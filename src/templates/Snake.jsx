import React from 'react';
import { initialiseGrid, getNeighbourIndexes, gridIncludesArray } from '../helper/grid';
import { getRandomInteger } from '../helper/random';
import { arrayIsEqual } from '../helper/array';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, cellStyle } from '../helper/styles';

export const Snake = () => {

  // Stores grid information
  const [gridState, setGridState] = React.useState([]);

  // Stores last key pressed
  const [keyPressed, setKeyPressed] = React.useState('');
  document.addEventListener('keydown', (event) => {
    setKeyPressed(event.key);
  });

  // Stores the state of the apple
  const [apple, setApple] = React.useState([-1, -1]);
  const resetApple = (numRows, numColumns) => {
    const appleRow = getRandomInteger(numRows);
    const appleColumn = getRandomInteger(numColumns);
    setApple([appleRow, appleColumn]);
  }

  // Stores the state of the snake
  const [snake, setSnake] = React.useState([]);
  const updateSnake = (newPosition) => {
    if (arrayIsEqual(newPosition, apple)) {
      const newSnake = [apple].concat(snake);
      setSnake(newSnake);
      resetApple(gridState.length, gridState[0].length);
      incrementScore();
    } else {
      const newSnake = [newPosition].concat(snake);
      newSnake.splice(-1, 1);
      setSnake(newSnake);
    }
  }

  // Keeps track of score
  const [score, setScore] = React.useState(0);
  const incrementScore = () => {
    setScore(score + 1);
  };

  // Updates the state of the grid
  const updateGrid = () => {

    // Get current position
    const currentRow = snake[0][0];
    const currentColumn = snake[0][1];
    const neighbourIndexes = getNeighbourIndexes(gridState, currentRow, currentColumn);
    
    // Checks if bumped into a wall
    if ((keyPressed === 'ArrowUp' && currentRow === 0)
      || (keyPressed === 'ArrowLeft' && currentColumn === 0)
      || (keyPressed === 'ArrowRight' && currentColumn === gridState[0].length-1)
      || (keyPressed === 'ArrowDown' && currentRow === gridState.length-1)) {
        resetHandler();
    // Check if bumped into self
    } else {
      const snakeBody = [...snake];
      snakeBody.shift();
      if (gridIncludesArray(snakeBody, snake[0])) {
        resetHandler();
      } else {
        // Update state
        if (keyPressed === 'ArrowUp' && gridIncludesArray(neighbourIndexes, [currentRow-1, currentColumn])) {
          updateSnake([currentRow-1, currentColumn]);
        } else if (keyPressed === 'ArrowLeft' && gridIncludesArray(neighbourIndexes, [currentRow, currentColumn-1])) {
          updateSnake([currentRow, currentColumn-1]);
        } else if (keyPressed === 'ArrowRight' && gridIncludesArray(neighbourIndexes, [currentRow, currentColumn+1])) {
          updateSnake([currentRow, currentColumn+1]);
        } else if (keyPressed === 'ArrowDown' && gridIncludesArray(neighbourIndexes, [currentRow+1, currentColumn])) {
          updateSnake([currentRow+1, currentColumn]);
        }
      }
    }
  };

  // Stores timer
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    const timeAmount = 0.05;
    const interval = setInterval(() => {
      updateGrid();
      setTimer(timer + timeAmount);
    }, timeAmount * 1000);
    return () => clearInterval(interval);
  });

  // Initialise
  const resetHandler = () => {
    // Initialise grid
    const numRows = 20;
    const numColumns = 20;
    const defaultValue = 0;
    const initialGrid = initialiseGrid(numRows, numColumns, defaultValue);
    setGridState(initialGrid);
    // Initialise snake
    const startRow = getRandomInteger(numRows);
    const startColumn = getRandomInteger(numColumns);
    setSnake([[startRow, startColumn]]);
    // Initialise apple
    resetApple(numRows, numColumns);
    setScore(0);
  };
  React.useEffect(() => resetHandler(), []);

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle }}>
      <div style={{ ...rowContainerStyle }}>
        <input style={{ fontSize: '30px', textAlign: 'center', width: '100px', marginBottom: '10px' }} value={score} disabled/>
      </div>
      {gridState.map((gridRow, indexRow) => {
        const indexRowString = Math.random().toString() + indexRow;
        return (
          <div style={{ ...rowContainerStyle }} key={indexRowString}>
            {gridRow.map((_, indexColumn) => {
              const indexColumnString = indexRowString + indexColumn;
              if (gridIncludesArray(snake, [indexRow, indexColumn])) {
                return (
                  <div style={{ ...cellStyle, backgroundColor: 'grey' }} key={indexColumnString}/>
                );
              } else if (arrayIsEqual(apple, [indexRow, indexColumn])) {
                return (
                  <div style={{ ...cellStyle, backgroundColor: 'red' }} key={indexColumnString}/>
                );
              } else {
                return (
                  <div style={{ ...cellStyle }} key={indexColumnString}/>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}