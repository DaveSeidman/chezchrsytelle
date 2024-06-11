import React, { useState, useEffect } from 'react';
import Login from '../../components/Login';
import { api } from '../../utils';


function User(props) {
  const { user, setUser } = props;
  const [orders, setOrders] = useState([]);

  const credentials = 'include';

  // const sortOrders = () => {

  // };

  useEffect(() => {
    if (user._id) {
      fetch(`${api}/orders/${user._id}`, { credentials }).then(res => res.json()).then((res) => {
        console.log(res);
        setOrders(res.orders);
      });
    }
  }, [user._id]);


  return (
    <div className="user">
      <Login
        user={user}
        setUser={setUser}
        showLogin
      />
      <h1>User Page</h1>
      {user._id
        && (
          <div className="user-info">
            <h2>{user.displayName}</h2>
            <p>Orders</p>
            <div className="user-info-orders">
              {orders.map(order => (
                <div className="user-info-orders-order" data-id={order._id} key={order._id}>
                  <p>{new Date(order.dateModified).toString()}</p>
                  <div className="user-info-orders-order-meals" />
                  {order.meals.map(meal => (
                    <div className="user-info-orders-order-meals-meal" key={meal._id}>
                      <span>{meal._id}</span>
                      <span> Amount </span>
                      <span>{meal.quantity}</span>
                    </div>
                  ))}
                </div>
              ))}

            </div>
          </div>
        )}
    </div>
  );
}

export default User;
