import React, { useEffect, useState } from 'react';
import { api } from '../../utils';
import './index.scss';
import { toast } from 'react-toastify';


function Order(props) {
  const { modal, setModal, user } = props;
  const [meals, setMeals] = useState([]);
  const [order, setOrder] = useState({ menu: null, meals: [] });

  const credentials = 'include';

  const pricePerMeal = 30; // PULL from DB, meals table, eventually might be different for each meal

  const setQuantity = ({ target }) => {
    console.log(target.getAttribute('data-meal'));
    const nextOrder = { ...order };
    console.log({ nextOrder });
    nextOrder.meals.find(meal => meal._id === target.getAttribute('data-meal')).quantity = parseInt(target.value, 10);
    setOrder(nextOrder);
  };

  const placeOrder = () => {
    const headers = { 'Content-Type': 'application/json' };
    const method = 'PUT';
    const body = JSON.stringify(order);
    console.log({ order });
    const url = `${api}/order`;
    fetch(url, { method, headers, body, credentials }).then(res => res.json()).then((res) => {
      const nextOrder = { ...order };
      nextOrder._id = res.orderId;
      setOrder(nextOrder);
      toast('Thanks, we\'ll email you to confirm your reservation soon!');
    });
  };

  useEffect(() => {
    if (modal === 'order') {
      fetch(`${api}/menu`).then(res => res.json()).then((menu) => {
        const nextOrder = { ...order };
        nextOrder.meals = menu.meals.map(meal => ({ _id: meal._id, quantity: 0 }));
        setMeals(menu.meals);
        console.log(`check if ${user._id} already posted an order for ${menu._id}`);
        fetch(`${api}/order/${user._id}/${menu._id}`, { credentials }).then(res => res.json()).then(({ savedOrder }) => {
          nextOrder.menu = menu._id;
          nextOrder.user = user._id;
          console.log({ savedOrder });
          if (savedOrder) {
            nextOrder._id = savedOrder._id;
            savedOrder.meals.forEach((savedMeal) => {
              const matchedSavedMeal = nextOrder.meals.find(meal => meal._id === savedMeal._id);
              if (matchedSavedMeal) matchedSavedMeal.quantity = savedMeal.quantity;
            });
          }
          console.log({ nextOrder });
          setOrder(nextOrder);
        });
      });
    }
  }, [modal]);

  return (
    <div className="modal order" id="order">
      <h2>Reserve Your Meal!</h2>
      <div className="content">
        <h4>Choose from this week's delicious meals!</h4>
        <ul>
          {meals.map((meal) => {
            const orderedMeal = order.meals.find(_meal => _meal._id === meal._id);
            return (
              <li key={meal._id} className="order-meal">
                <input
                  type="number"
                  min="0"
                  max={meal.quantity}
                  onChange={setQuantity}
                  data-meal={meal._id}
                  value={(orderedMeal && orderedMeal.quantity) || 0}
                />
                <p>{meal.main.name}</p>
                <p>{((orderedMeal && orderedMeal.quantity) || 0) * pricePerMeal}</p>
              </li>
            );
          })}
        </ul>
        <div className="order-total">{
          pricePerMeal * order.meals.reduce((total, meal) => meal.quantity + parseInt(total, 10), 0)
        }
        </div>
        <button
          type="button"
          className="primary"
          onClick={placeOrder}
        >Place Order
          {/* TODO: disable this button if all values are 0
        TODO: Change from Place Order to Update Order if order existed */}
        </button>
        <button
          type="button"
          className="close"
          onClick={
            () => { setModal(null); }
          }
        >×
        </button>

      </div>
    </div>
  );
}

export default Order;
