const { ObjectId } = require('mongodb');

const sanitizeBody = (req, res, next) => {
  if (req.body) {
    if (req.body.menu && req.body.menu.length === 24) req.body.menu = new ObjectId(req.body.menu);
    if (req.body.user && req.body.user.length === 24) req.body.user = new ObjectId(req.body.user);
    if (req.body.meals) req.body.meals.forEach((meal) => { meal._id = new ObjectId(meal._id); });
    if (req.body.dateModified) delete req.body.dateModified;
    if (req.body.dateCreated) delete req.body.dateCreated;
  }
  next();
};

const sanitizeParams = (params) => {
  if (params.id && params.id.length === 24) params.id = new ObjectId(params.id);
  if (params.user && params.user.length === 24) params.user = new ObjectId(params.user);
  if (params.menu && params.menu.length === 24) params.menu = new ObjectId(params.menu);
  return params;
};

module.exports.sanitizeBody = sanitizeBody;
module.exports.sanitizeParams = sanitizeParams;
