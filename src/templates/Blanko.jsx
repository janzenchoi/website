import React from 'react';
import { stringToArray } from '../helper/array';
import { getRandomKey, getRandomInteger, getUniqueRandomIntegers } from '../helper/random';
import { strs } from '../data/blanko';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';

export const Blanko = () => {
  // Style
  const cellStyle = {
    height: '50px',
    width: '50px',
    border: '1px solid grey',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '24px',
  };
  const buttonOuterContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10px'
  };
  const buttonContainerStyle = {
    display: 'flex',
    width: '400px',
    flexDirection: 'row',
    justifyContent: 'center'
  };
  const highlightedStyle = {
    backgroundColor: 'lightgrey'
  };

  // Stores the state of the game
  const [arrayState, setArrayState] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState('');
  const [inputIndexes, setInputIndexes] = React.useState([]);
  const [inputValues, setInputValues] = React.useState([]);

  // Initialisation
  const initialiseArray = () => {
    // Set current word
    const randomWord = strs[getRandomInteger(strs.length)];
    setCurrentWord(randomWord);

    // Set initial array
    const initialArray = stringToArray(randomWord);
    setArrayState(initialArray);

    // Set input indexes
    const validIndexes = [];
    for (let i = 0; i < initialArray.length; i++) {
      if (initialArray[i] !== ' ') {
        validIndexes.push(i);
      }
    }
    const randomIndexes = getUniqueRandomIntegers(validIndexes.length, 3);
    const initialInputIndexes = [];
    for (let i = 0; i < randomIndexes.length; i++) {
      const inputIndex = validIndexes[randomIndexes[i]];
      initialInputIndexes.push(inputIndex);
    }
    setInputIndexes(initialInputIndexes);

    // Set input values
    setInputValues(['', '', '']);
  };
  React.useEffect(() => initialiseArray(), []);
  
  // Change handler
  const changeHandler = (index, value) => {
    // Set new values
    const newInputValues = inputValues;
    newInputValues[inputIndexes.indexOf(index)] = value;
    setInputValues(newInputValues);

    // If all filled in
    if (!inputValues.includes('')) {
      let isCorrect = true;
      for (let i = 0; i < inputValues.length; i++) {
        if (inputValues[i] !== currentWord[inputIndexes[i]]) {
          isCorrect = false;
        }
      }
      if (isCorrect) {
        alert('Correct');
        initialiseArray();
      } else {
        alert('Incorrect');
      }
    }
  };

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle }}>
      <div style={{ ...rowContainerStyle }}>
        {arrayState.map((element, index) => {
          const randomKey = getRandomKey(index);
          if (inputIndexes.includes(index)) {
            return (
              <input style={{ ...cellStyle }} key={randomKey} maxLength='1' onChange={(event) => {
                changeHandler(index, event.target.value);
              }}/>
            );
          } else {
            return (
              <div style={{ ...cellStyle, ...highlightedStyle }} key={randomKey}>
                {element}
              </div>
            );
          }
        })}
      </div>
      <div style={{ ...buttonOuterContainerStyle }}>
        <div style={{ ...buttonContainerStyle }}>
          <button style={{ ...buttonStyle }} onClick={() => initialiseArray()}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}