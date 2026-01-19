import React from 'react';
import { shuffleGrid, initialiseGrid } from '../helper/grid';
import { getRandomKey } from '../helper/random';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';

export const Grid = () => {
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

  // Stores grid information
  const [gridState, setGridState] = React.useState([]);
  
  // Reset handler
  const resetHandler = () => {
    const numRows = 3;
    const numCols = 5;
    const defaultValue = 0;
    const initialGrid = initialiseGrid(numRows, numCols, defaultValue);
    setGridState(initialGrid);
  };

  // Initialise grid
  React.useEffect(() => resetHandler(), []);
  
  // Click handler
  const clickHandler = (indexRow, indexColumn) => {
    const oldGridState = [...gridState];
    const currentValue = gridState[indexRow][indexColumn];
    const newValue = currentValue + 1;
    oldGridState[indexRow][indexColumn] = newValue;
    setGridState(oldGridState);
  };

  // Shuffle handler
  const shuffleHandler = () => {
    const shuffledGrid = shuffleGrid(gridState);
    setGridState(shuffledGrid);
  };

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle }}>
      {gridState.map((gridRow, indexRow) => {
        const indexRowString = getRandomKey(indexRow);
        return (
          <div style={{ ...rowContainerStyle }} key={indexRowString}>
            {gridRow.map((gridColumn, indexColumn) => {
              const indexColumnString = indexRowString + indexColumn;
              return(
                <div style={{ ...cellStyle }} key={indexColumnString} onClick={(event) => {
                  clickHandler(indexRow, indexColumn);
                }}>
                  {gridColumn}
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ ...buttonOuterContainerStyle }}>
        <div style={{ ...buttonContainerStyle }}>
          <button style={{ ...buttonStyle }} onClick={() => shuffleHandler()}>
            Shuffle
          </button>
          <button style={{ ...buttonStyle }} onClick={() => resetHandler()}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}