import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../Menu/Main';
import Meal from '../Menu/Meal';
import './index.scss';
import { api } from '../../utils';
import useStore from '../../store';
import deepEql from 'deep-eql';

function Admin() {
  const [mains, setMains] = useState([]);
  const [sides, setSides] = useState([]);
  const [meals, setMeals] = useState([]);
  const [menus, setMenus] = useState([]);

  const location = useLocation();
  // const [edited, setEdited] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const { user } = useStore();

  const credentials = 'include';

  const fetchMains = () => {
    fetch(`${api}/mains/`).then(res => res.json()).then((mainsFromDatabase) => {
      // console.log(mainsFromDatabase);
      const mainsFromLocalStorage = JSON.parse(localStorage.getItem('mains'));
      if (mainsFromLocalStorage) {
        for (let i = 0; i < mainsFromDatabase.length; i += 1) {
          const mainFromDatabase = mainsFromDatabase[i];
          const mainFromLocalStorage = mainsFromLocalStorage.find(main => main._id === mainFromDatabase._id);
          mainsFromDatabase[i].name = mainFromLocalStorage.name;
          mainsFromDatabase[i].adjectives = mainFromLocalStorage.adjectives;
        }
      }
      setMains(mainsFromDatabase);
      // TODO: this is a good place to set the "starting state of the mains for comparison later"
      setSavedState(JSON.parse(JSON.stringify(mainsFromDatabase)));
    });
  };


  useEffect(() => {
    if (user._id && !user.admin) return location.replace('/');

    fetchMains();

    fetch(`${api}/sides/`).then(res => res.json()).then((res) => {
      // console.log(res);
      setSides(res);
    });

    fetch(`${api}/meals/`).then(res => res.json()).then((res) => {
      console.log(res);
      setMeals(res);
    });


    fetch(`${api}/menus/`).then(res => res.json()).then((res) => {
      // console.log(res);
      setMenus(res);
    });
  }, [user]);

  useEffect(() => {
    console.log({ location });
    // if (location)
  }, [location]);


  const addMain = () => {
    console.log('add a main');
    const method = 'POST';
    fetch(`${api}/main`, { method, credentials }).then(res => res.json()).then(({ main }) => {
      const nextMains = [...mains];
      nextMains.push(main);
      setMains(nextMains);
    });
  };

  const deleteMain = (e) => {
    console.log('delete a main', e.target.parentNode.id);
    const main = mains.find(_main => _main._id === e.target.parentNode.id);

    if (confirm(`Are you sure you want to delete ${main.name}?`)) {
      const method = 'DELETE';
      fetch(`${api}/main/${main._id}`, { method, credentials }).then(res => res.json()).then((res) => {
        // TODO: handle errors here
        fetchMains();
      });
    }
    // fetch(`${api}/main/${}`)
  };


  const addMeal = () => {

  };

  const deleteMeal = () => {

  };

  const saveToLocalStorage = ({ _id, type, data }) => {
    // find the main that was just edited
    mains.find(main => main._id === _id)[type] = data;
    // put it in local storage (don't send it to db yet)
    localStorage.setItem('mains', JSON.stringify(mains));
    // check the current state against the savedState from DB, if it differs we can do things like enable the save button
    // TODO: this needs to be a propery
    // setEdited(!deepEql(mains, savedState));
  };

  const saveToDatabase = (e) => {
    // console.log('save to db', e.target.parentNode.id);
    const { id } = e.target.parentNode;
    // clone the mains from localStorage
    const mainsFromLocalStorage = JSON.parse(localStorage.getItem('mains'));
    // find the one we're editing
    const mainFromLocalStorage = mainsFromLocalStorage.find(main => main._id === id);
    console.log('update', mainFromLocalStorage);
    const method = 'PUT';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(mainFromLocalStorage);
    // console.log('save this one', mainFromLocalStorage);
    fetch(`${api}/main/${id}`, { method, headers, body, credentials }).then(res => res.json()).then((res) => {
      console.log('res', res);
      setSavedState(mains);
    });
  };

  return (
    <div className="page admin" id="admin">
      <h2>Admin</h2>
      <div className="admin-section">
        <div className="food">
          <h3>Mains</h3>
          <div className="mains">
            {
              mains.map(main => (
                <div key={main._id} id={main._id}>
                  <Main
                    editable
                    saveToDatabase={saveToDatabase}
                    saveToLocalStorage={saveToLocalStorage}
                    key={main._id}
                    {...main}
                  />
                  <button
                    type="button"
                    onClick={saveToDatabase}
                    disabled={(() => {
                      // TODO: this needs work but the idea is that it checks if it's different from its saved state and if so, allow saving
                      const mainFromDb = savedState.find(_main => _main._id === main._id);
                      // console.log(main, mainFromDb, deepEql(main, mainFromDb));
                      return false;
                    })()}
                  >Save
                  </button>
                  <button
                    type="button"
                    onClick={deleteMain}
                  >Delete Main
                  </button>
                </div>
              ))
            }
            <button
              type="button"
              onClick={addMain}
            >Add Main
            </button>
          </div>
          <h3>Sides</h3>
          <div className="sides">
            {
              sides.map(side => (
                <div className="sides-side" key={side._id}>
                  <p>{side.name}</p>
                </div>
              ))
            }
          </div>
        </div>
        <h3>Meals</h3>
        <div className="meals">
          {
            meals.map(meal => (
              <div key={meal._id} id={meal._id}>
                <Meal
                  allSides={sides}
                  editable
                  saveToDatabase={saveToDatabase}
                  saveToLocalStorage={saveToLocalStorage}
                  // key={meal._id}
                  // _id={meal._id}
                  {...meal}
                />
                <a href={`/admin/meals/${meal._id}`}>Edit Meal</a>
                {/* <button
                  type="button"
                  onClick={saveToDatabase}
                >Save
                </button>
                <button
                  type="button"
                  onClick={deleteMeal}
                >Delete Meal
                </button> */}
              </div>
            ))
          }
          <button
            type="button"
            onClick={addMeal}
          >Add Meal
          </button>
        </div>
        <h3>Menus</h3>
        <div className="menus">
          {
            menus.map(menu => (
              <div className="menus-menu" key={menu._id}>
                <p>{menu._id}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Admin;
