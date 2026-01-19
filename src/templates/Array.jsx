import React from 'react';
import { shuffleArray } from '../helper/array';
import { getRandomKey } from '../helper/random';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';

export const Array = () => {
  // Style
  const cellStyle = {
    height: '50px',
    width: '50px',
    border: '1px solid grey',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
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
    justifyContent: 'space-between'
  };

  // Stores the state of the array
  const [arrayState, setArrayState] = React.useState([]);
  
  // Initialisation
  const initialiseArray = () => {
    const initialArray = [0, 0, 0, 0];
    setArrayState(initialArray);
  };
  React.useEffect(() => initialiseArray(), []);
  
  // Click handler
  const clickHandler = (index) => {
    const newArrayState = [...arrayState];
    const currentValue = newArrayState[index];
    const newValue = currentValue + 1;
    newArrayState[index] = newValue;
    setArrayState(newArrayState);
  };

  // Shuffle handler
  const shuffleHandler = () => {
    const shuffledArray = shuffleArray(arrayState);
    setArrayState(shuffledArray);
  };

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle }}>
      <div style={{ ...rowContainerStyle }}>
        {arrayState.map((element, index) => {
          const randomKey = getRandomKey(index);
          return (
            <div style={{ ...cellStyle }} key={randomKey} onClick={() => {
              clickHandler(index);
            }}>
              {element}
            </div>
          );
        })}
      </div>
      <div style={{ ...buttonOuterContainerStyle }}>
        <div style={{ ...buttonContainerStyle }}>
          <button style={{ ...buttonStyle }} onClick={() => shuffleHandler()}>
            Shuffle
          </button>
          <button style={{ ...buttonStyle }} onClick={() => initialiseArray()}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}