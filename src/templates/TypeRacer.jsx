import React from 'react';
import { initialiseGrid } from '../helper/grid';
import { getRandomKey, getRandomInteger } from '../helper/random';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';

export const TypeRacer = () => {
  // Style
  const cellStyle = {
    height: '50px',
    width: '50px',
    border: '1px solid grey',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  };
  const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  };
  const inputFieldStyle = {
    width: '300px',
    marginBottom: '10px',
    fontSize: '20px',
    padding: '5px'
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

  // Stores grid information
  const [gridState, setGridState] = React.useState([]);
  const [correctString, setCorrectString] = React.useState('');
  const [inputedString, setInputedString] = React.useState('');
  
  // Reset handler
  const resetHandler = () => {
    // Initialise the grid
    const numRows = 3;
    const numCols = 10;
    const initialGrid = initialiseGrid(numRows, numCols, 0);

    // Place random characters
    const validCharacters = 'abcdefghijjklmnopqrstuvwxyz';
    let correctStringTemp = '';
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const randomCharacter = validCharacters[getRandomInteger(validCharacters.length)];
        initialGrid[i][j] = randomCharacter;
        correctStringTemp += randomCharacter;
      }
    }
    setGridState(initialGrid);
    setCorrectString(correctStringTemp);

    // Reset input and timer
    setInputedString('');
    setTimer(0);
  };
  React.useEffect(() => resetHandler(), []);

  // Change handler
  const changeHandler = (string) => {
    setInputedString(string);
    if (correctString === string) {
      alert('Finished in ' + Math.round(timer * 10) / 10 + ' seconds!');
      resetHandler();
    }
  };

  // Get style depending on correctness
  const getColour = (indexRow, indexColumn) => {
    const characterIndex = gridState[0].length * indexRow + indexColumn;
    if (characterIndex + 1 > inputedString.length) {
      return 'black';
    } else if (inputedString[characterIndex] !== gridState[indexRow][indexColumn]) {
      return 'red';
    } else {
      return 'green';
    }
  };

  // Stores timer
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    const timeAmount = 0.1;
    const interval = setInterval(() => {
      if (inputedString !== '') {
        setTimer(timer + timeAmount);
      }
    }, timeAmount * 1000);
    return () => clearInterval(interval);
  });

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle }}>
      <div style={{ ...inputContainerStyle }}>
        <input style={{ ...inputFieldStyle, textAlign: 'center' }} value={Math.round(timer * 10) / 10 + ' seconds elapsed'} disabled/>
      </div>
      <div style={{ ...inputContainerStyle }}>
        <input style={{ ...inputFieldStyle }} value={inputedString} onChange={(event) => {
          changeHandler(event.target.value);
        }}/>
      </div>
      {gridState.map((gridRow, indexRow) => {
        const indexRowString = getRandomKey(indexRow);
        return (
          <div style={{ ...rowContainerStyle }} key={indexRowString}>
            {gridRow.map((gridColumn, indexColumn) => {
              const indexColumnString = indexRowString + indexColumn;
              const colour = getColour(indexRow, indexColumn);
              return (
                <div style={{ ...cellStyle, color: (colour) }} key={indexColumnString}>
                  {gridColumn}
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ ...buttonOuterContainerStyle }}>
        <div style={{ ...buttonContainerStyle }}>
          <button style={{ ...buttonStyle }} onClick={() => resetHandler()}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}