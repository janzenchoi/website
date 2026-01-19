import React from 'react';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle } from '../helper/styles';
import { initialiseGrid, getSumGrid } from '../helper/grid';
import { getRandomKey } from '../helper/random';
import { decrementValue } from '../helper/storage';

export const Space = () => {
  // Style
  const gameWindow = {
    width: '500px',
    height: '500px',
    border: '1px solid black',
  };
  const shootableStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: 'black',
    margin: '15px'
  };
  const unshootableStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    margin: '15px'
  };
  const shooterStyle = {
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    position: 'relative',
    bottom: '0px'
  };

  // Game state
  const [gridState, setGridState] = React.useState([]);
  const resetHandler = () => {
    const numRows = 2;
    const numCols = 10;
    const defaultValue = 1;
    const initialGrid = initialiseGrid(numRows, numCols, defaultValue);
    setGridState(initialGrid);
    setShooterPosition(0);
  };
  React.useEffect(() => resetHandler(), []);

  // Shooter state
  const [shooterPosition, setShooterPosition] = React.useState(0);
  const [keyPressed, setKeyPressed] = React.useState('');
  document.addEventListener('keydown', (event) => {
    setKeyPressed(event.key);
  });

  // Stores timer
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    const timeAmount = 0.05;
    const interval = setInterval(() => {
      
      // Update the state
      if (keyPressed === 'ArrowLeft' && shooterPosition > 0) {
        setShooterPosition(shooterPosition - 1);
      } else if (keyPressed === 'ArrowRight' && shooterPosition < 500) {
        setShooterPosition(shooterPosition + 1);
      } else if (keyPressed === ' ') {
        const newGridState = [...gridState];
        for (let i = 0; i < 10; i++) {
          if (shooterPosition >= 50*i + 15 && shooterPosition <= 50*i + 35) {
            newGridState[0][i] = 0;
            newGridState[1][i] = 0;
            setGridState(newGridState);
            
            // Check if win
            if (getSumGrid(newGridState) === 0) {
              alert('You have won!');
              decrementValue();
              resetHandler();
            }
          }
        }
      }

      setTimer(timer + timeAmount);
    }, timeAmount * 1000);
    return () => clearInterval(interval);
  });

  // Widths
  const [bodyWidth, setBodyWidth] = React.useState(0);
  const setWidthValues = () => {
    if (window.innerWidth > 1400) {
      setBodyWidth('calc(100vw - 100px)');
    } else if (window.innerWidth > 800 && window.innerWidth <= 1400) {
      setBodyWidth('calc(100vw - 60px)');
    } else if (window.innerWidth <= 800) {
      setBodyWidth('calc(100vw - 30px)');
    }
  };
  window.addEventListener('resize', () => setWidthValues());
  React.useEffect(() => setWidthValues(), []);

  return (
    <div style={{ ...outerContainerStyle, ...rowContainerStyle, width: (bodyWidth) }}>
      <div style={{ ...columnContainerStyle }}>

        <div style={{ ...gameWindow }}>
          {gridState.map((gridRow, indexRow) => {
            const indexRowString = getRandomKey(indexRow);
            return (
              <div style={{ ...rowContainerStyle }} key={indexRowString}>
                {gridRow.map((gridColumn, indexColumn) => {
                  const indexColumnString = indexRowString + indexColumn;
                  if (gridColumn === 1) {
                    return (
                      <div style={{ ...shootableStyle }} key={indexColumnString}/>
                    );
                  } else {
                    return (
                      <div style={{ ...unshootableStyle }} key={indexColumnString}/>
                    );
                  }
                })}
              </div>
            );
          })}

          <div style={{ height: '390px', width: '100%' }}></div>

          <div style={{ ...shooterStyle, left: (shooterPosition) }}>

          </div>

        </div>

      </div>
    </div>
  );
}