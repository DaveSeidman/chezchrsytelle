import React, { useEffect, useState } from 'react';
import friedRice from '../../assets/images/fried-rice.jpg';
import cornchap from '../../assets/images/cornchap.jpg';
import { api } from '../../utils';
import './index.scss';

const adjectivesToString = list => list.join(', ');

const sidesToString = (list) => {
  let string = 'with ';
  list.forEach((item, index) => {
    string += item;
    string += (index + 2 === list.length) ? ' and ' : ', ';
  });
  return string.substring(0, string.length - 2);
};

function Menu(props) {
  const { user, setModal, setShowLogin } = props;
  const extras = [
    {
      name: 'cornchap',
      image: cornchap,
    },
    {
      name: 'aromatic rice',
      image: friedRice,

    },
  ];

  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch(`${api}/menu/`).then(res => res.json()).then((res) => {
      setMeals(res.meals);
    });
  }, []);

  return (
    <div className="page menu" id="menu">
      <h2>Tuesdays Dinner</h2>
      <div className="menu-meals" key="meals">
        {meals.length
          ? Object.keys(meals).map((key) => {
            const { main, sides, amount, remaining } = meals[key];
            const { name, adjectives, photo } = main;
            return (
              <div className="menu-meals-meal" key={name}>
                <div className="menu-meals-meal-image">
                  <img
                    src={`src/assets/images/${photo}`}
                    alt={name}
                  />
                </div>
                <h2 className="menu-meals-meal-title">
                  <span>{adjectivesToString(adjectives)}</span>
                  <span>{name}</span>
                  <span>{sidesToString(sides.map(side => side.name))}</span>
                </h2>
                <div className="menu-meals-meal-amount"><p>{remaining} of {amount} remaining</p></div>
              </div>
            );
          })
          : (<h3>Family Dinners returning in October... Stay Tuned!</h3>)

        }
      </div>
      <h2>All Entrees served with:</h2>
      <div className="menu-extras">
        {extras.map((extra) => {
          const { name, image } = extra;
          return (
            <div className="menu-extras-extra" key={name}>
              <div className="menu-extras-extra-image">
                <img src={image} alt={name} />
              </div>
              <h2 className="menu-extras-extra-title">{name}</h2>

            </div>
          );
        })}
      </div>
      <div className="menu-actions">

        <button
          type="button"
          className="secondary"
        >
          Questions about the Menu
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => {
            // setModal('order');
            if (user._id) setModal('order');
            else setShowLogin(true);
          }}
        >{user._id ? 'Start Order' : 'Login to Start Order'}
        </button>
      </div>
    </div>
  );
}

export default Menu;
