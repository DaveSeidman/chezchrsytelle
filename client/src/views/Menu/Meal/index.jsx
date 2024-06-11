import React, { useEffect, useState } from 'react';
import { listToString } from '../../../utils';
import './index.scss';

function Meal(props) {
  // console.log({ props });
  const { allSides, sides, _id, main, editable, saveToDatabase, saveToLocalStorage } = props;
  const defaultValue = 'Add a Side';
  const defaultOption = [{ _id: null, name: defaultValue }];
  const sidesNotSelected = defaultOption.concat(allSides.filter(side => !sides.includes(side._id)));

  const removeSide = (side) => {
    console.log(side);
    sides.splice(sides.indexOf(side), 1);
  };

  const addSide = (side) => {
    console.log(side);
  };

  return (
    <div key={_id} className="meal" id={_id}>
      <h2>Meal ID: {_id}</h2>
      <h3>main: {main}</h3>
      {
        sides.map(side => (
          <div key={side._id}>
            <span>{allSides.find(_side => _side._id === side).name}</span>
            <button
              type="button"
              onClick={() => { removeSide(side); }}
            >x
            </button>
          </div>
        ))
      }
      <p>add sides:</p>
      <select value={defaultValue} onChange={addSide}>
        {
          sidesNotSelected.map(side => (
            <option key={side._id}>{side.name}</option>
          ))
        }
      </select>
    </div>
  );
}

export default Meal;
