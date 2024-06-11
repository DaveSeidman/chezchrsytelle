import React, { useEffect, useState } from 'react';
import { listToString } from '../../../utils';
import './index.scss';

function Main({ _id, name, adjectives, photo, type, editable, saveToLocalStorage }) {
  const [mainName, setMainName] = useState(name);
  const [mainType, setMainType] = useState(type);
  const [mainAdjectives, setMainAdjectives] = useState(adjectives);
  const types = ['meat', 'fish', 'veg']; // TODO: pull from db

  const addAdjective = () => {
    const newAdjectives = mainAdjectives.slice();
    newAdjectives.push('');
    setMainAdjectives(newAdjectives);
  };

  const removeAdjective = ({ target }) => {
    const index = parseInt(target.getAttribute('data-index'), 10);
    const newAdjectives = mainAdjectives.slice();
    newAdjectives.splice(index, 1);
    setMainAdjectives(newAdjectives);
  };

  useEffect(() => {
    // console.log('update adjectives');
    saveToLocalStorage({ _id, type: 'adjectives', data: mainAdjectives });
  }, [mainAdjectives]);

  useEffect(() => {
    // saveToLocalStorage({ _id, type: 'name', data: mainName });
  }, [mainName]);

  useEffect(() => {
    saveToLocalStorage({ _id, type: 'type', data: mainType });
  }, [mainType]);

  return (
    <div className="main" id={_id}>
      <div className="main-adjectives">
        {
          mainAdjectives.map((adjective, index) => (
            <div
              id={`${_id}_adjective${index}`}
              key={`${_id}_adjective${index}`}
              className="main-adjectives-adjective"
            >
              <span
                value={adjective}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const nextMainAdjectives = [...mainAdjectives];
                  nextMainAdjectives[index] = e.target.innerText;
                  setMainAdjectives(nextMainAdjectives);
                }}
                onFocus={(e) => {
                  if (e.target.innerText === 'adjective') e.target.innerText = '';
                }}
              >{adjective || 'adjective'}
              </span>
              <button
                type="button"
                data-index={index}
                className="main-adjectives-adjective-delete"
                onClick={removeAdjective}
              >-
              </button>
            </div>
          ))
        }
        <button
          type="button"
          onClick={addAdjective}
        >+ add adjective
        </button>
        {/* </div> */}
      </div>

      <div className="main-name">
        <p className={editable ? 'hidden' : ''}>{name}</p>
        <input
          className={editable ? '' : 'hidden'}
          type="text"
          value={mainName}
          onChange={(e) => {
            setMainName(e.target.value);
          }}
          onBlur={() => { saveToLocalStorage({ _id, type: 'name', data: mainName }); }}
        />
      </div>

      <div className="main-type">
        <select
          value={mainType}
          onChange={(e) => {
            setMainType(e.target.value);
          }}
        >
          {types.map(mainType => (
            <option key={mainType}>{mainType}</option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default Main;
