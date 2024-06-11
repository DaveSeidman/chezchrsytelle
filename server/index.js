// TODO: split this out into classes:
// Auth
// Orders

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient, ObjectId } = require('mongodb');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sanitizeBody, sanitizeParams } = require('./utils');
// const { mainTemplate } = require('./templates');

const port = process.env.PORT || 3000;

const mongoUrl = process.env.MONGO_URL;
const dbName = 'chezchrystelle';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(sanitizeBody);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true, allowHeaders: ['Content-Type'] }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(session({
  secret: 'chez-key',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60,
  }),

}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_AUTH_CALLBACK;

// Connect to MongoDB
const mongoClient = new MongoClient(mongoUrl);
console.log('connecting to mongo at', mongoUrl);
mongoClient.connect().then((client) => {
  console.log('Connected to MongoDB');
  const db = client.db(dbName);

  passport.use(new GoogleStrategy({ clientID, clientSecret, callbackURL }, async (accessToken, refreshToken, profile, done) => {
    // Save user information to MongoDB
    console.log(profile);
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      photo: profile.photos[0].value,
      email: profile._json.email,
      admin: false,
    };
    console.log(`${newUser.displayName} is being added to the users table`);
    await usersCollection.insertOne(newUser);
    return done(null, newUser);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.googleId);
  });

  passport.deserializeUser(async (user, done) => {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ googleId: user });
    done(null, existingUser);
  });

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.get('/auth/google', passport.authenticate('google', { session: true, scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { session: true, failureRedirect: '/' }), (req, res) => {
    console.log(`${req.user.displayName} is logging in`);
    req.login(req.user, () => {
      res.redirect(process.env.CLIENT_URL);
    });
  });

  app.post('/auth/logout', (req, res) => {
    console.log(`${req.user.displayName} is logging out`);
    req.logout(() => {
      req.session.destroy((err) => {
        res.send({ error: err, success: true });
      });
    });
  });

  const authenticate = (req, res, next) => {
    console.log(`${req.user ? req.user.displayName : 'a user'} is checking if they are logged in`);
    if (req.isAuthenticated()) {
      return next();
    }
    return res.send({ error: 'not authenticated' });
  };

  const authorize = (req, res, next) => {
    if (req.user.admin) return next();
    return res.send({ error: 'not authorized' });
  };

  app.get('/user', authenticate, (req, res) => {
    res.send(req.user);
  });

  app.get('/users', (req, res) => {
    db.collection('users').find({}).toArray().then((users) => {
      res.send(users);
    });
  });

  app.get('/meals', (req, res) => {
    db.collection('meals').find({}).toArray().then((meals) => {
      res.send(meals);
    });
  });

  app.get('/menu', (req, res) => {
    // get the latest menu and attach meal data
    db.collection('menus').aggregate(
      [
        { $sort: { date: -1 } },
        { $limit: 1 }, { $unwind: { path: '$meals' } },
        { $lookup: { from: 'meals', localField: 'meals.id', foreignField: '_id', as: 'meal' } },
        { $unwind: { path: '$meal' } },
        { $lookup: { from: 'mains', localField: 'meal.main', foreignField: '_id', as: 'main' } },
        { $unwind: { path: '$main' } },
        { $unwind: { path: '$meal.sides' } },
        { $lookup: { from: 'sides', localField: 'meal.sides', foreignField: '_id', as: 'sides' } },
        { $unwind: { path: '$sides' } },
        { $group: { _id: '$meal._id', menu_id: { $first: '$_id' }, date: { $first: '$date' }, amount: { $first: '$meals.amount' }, sides: { $push: '$sides' }, main: { $addToSet: '$main' } } },
        { $unwind: { path: '$main' } },
        { $group: { _id: '$menu_id', meals: { $push: { _id: '$_id', main: '$main', sides: '$sides', amount: '$amount' } }, date: { $first: '$$ROOT.date' } } },
      ],
    ).toArray().then((menu, err) => {
      // subtract orders from each meal and attach amount remaining
      db.collection('orders').aggregate([
        { $match: { menu: menu[0]._id } },
        { $unwind: '$meals' },
        { $group: { _id: '$meals._id', claimed: { $sum: '$meals.quantity' } } },
      ]).toArray().then((orders) => {
        menu[0].meals.forEach((meal) => {
          const orderMeal = orders.find(order => order._id.toString() === meal._id.toString());
          meal.remaining = meal.amount - orderMeal.claimed;
        });
        res.send(menu[0]);
      });
    });
  });

  app.put('/order', authenticate, (req, res) => {
    // add the order to the orders table
    const orderId = new ObjectId(req.body._id);
    console.log('here', orderId);
    console.log(`${req.user.displayName} is posting order ${orderId}`);
    delete req.body._id;
    const query = { _id: orderId };
    const update = { $setOnInsert: { dateCreated: new Date() }, $set: req.body, $currentDate: { dateModified: true } };
    const options = { upsert: true };
    db.collection('orders').updateOne(query, update, options).then((error) => {
      res.send({ status: 'ok', error, orderId });
    });
  });

  // app.post('/main', authenticate, authorize, (req, res) => {
  //   const main = { ...mainTemplate };
  //   // TODO: does it make sense to actually add this to the database here too?
  //   // Pros: ???
  //   // Cons: if the user never hits save, we end up with a lot of empty documents
  //   res.send({ main, error: null });
  // });

  app.put('/main/:id', authenticate, authorize, (req, res) => {
    console.log(`${req.user.displayName} is modifying main ${req.params.id}`);
    const params = sanitizeParams(req.params);
    const query = { _id: params.id };
    delete req.body._id;
    const update = { $setOnInsert: { dateCreated: new Date() }, $set: req.body, $currentDate: { dateModified: true } };
    const options = { upsert: true };
    db.collection('mains').updateOne(query, update, options).then((error) => {
      res.send({ status: 'ok', error });
    });
  });

  app.delete('/main/:id', authenticate, authorize, (req, res) => {
    const params = sanitizeParams(req.params);
    console.log(`${req.user.displayName} is deleting main ${params.id}`);
    db.collection('mains').deleteOne({ _id: params.id }).then((result) => {
      // TODO: error check that the main was deleted
      res.send({ error: null, status: 'ok' });
    });
  });

  app.get('/orders/:user', authenticate, (req, res) => {
    console.log(`${req.user.displayName} is requesting their orders`);
    const params = sanitizeParams(req.params);
    db.collection('orders').find({
      user: params.user,
    }).toArray().then((orders) => {
      res.send({ error: null, orders });
    });
  });

  app.get('/order/:user/:menu', authenticate, (req, res) => {
    console.log(`${req.user.displayName} is checking if they already started an order for menu ${req.params.menu}`);
    const params = sanitizeParams(req.params);
    const { user, menu } = params;
    console.log({ user, menu });
    db.collection('orders').findOne({ user, menu }).then((savedOrder) => {
      console.log('found a saved order?', savedOrder);
      res.send({ savedOrder });
    });
  });

  app.get('/mains', (req, res) => {
    db.collection('mains').find({}).toArray().then((mains) => {
      res.send(mains);
    });
  });

  app.get('/sides', (req, res) => {
    db.collection('sides').find({}).toArray().then((sides) => {
      res.send(sides);
    });
  });

  app.get('/menus', (req, res) => {
    db.collection('menus').find({}).toArray().then((menus) => {
      res.send(menus);
    });
  });

  app.get('/', (req, res) => {
    res.status(200).send('default');
  });

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.listen(port, () => {
    console.log(`chez-chrystelle-api is listening on port ${port}`);
  });
});
