import React from 'react';
import { shuffleGrid, getNeighbours, findCell, gridIsEqual } from '../helper/grid';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';
import s1 from '../data/shrek/s1.png';
import s2 from '../data/shrek/s2.png';
import s3 from '../data/shrek/s3.png';
import s4 from '../data/shrek/s4.png';
import s5 from '../data/shrek/s5.png';
import s6 from '../data/shrek/s6.png';
import s7 from '../data/shrek/s7.png';
import s8 from '../data/shrek/s8.png';

function getImage(index) {
  if (index === 0) {
    return s1;
  } else if (index === 1) {
    return s2;
  } else if (index === 2) {
    return s3;
  } else if (index === 3) {
    return s4;
  } else if (index === 4) {
    return s5;
  } else if (index === 5) {
    return s6;
  } else if (index === 6) {
    return s7;
  } else if (index === 7) {
    return s8;
  } else {
    return null;
  }
}

export const Puzzle = () => {
  // Style
  const cellStyle = {
    height: '150px',
    width: '150px',
    border: '1px solid #333',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  };
  const highlighted = {
    backgroundColor: 'grey'
  };
  const buttonOuterContainer = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10px'
  };
  const buttonContainer = {
    display: 'flex',
    width: '400px',
    flexDirection: 'row',
    justifyContent: 'space-between'
  };

  // Stores grid information
  const [gridState, setGridState] = React.useState([]);
  
  // Solve handler
  const solveHandler = () => {
    setGridState([[0,1,2], [3,4,5], [6,7,-1]]);
  };

  // Shuffle handler
  const shuffleHandler = () => {
    const shuffledGrid = shuffleGrid(gridState);
    setGridState(shuffledGrid);
  };

  // Initialise grid
  React.useEffect(() => {
    const shuffledGrid = shuffleGrid([[0,1,2], [3,4,5], [6,7,-1]]);
    setGridState(shuffledGrid);
  }, []);
  
  // Click handler
  const clickHandler = (indexRow, indexColumn) => {
    const neighbours = getNeighbours(gridState, indexRow, indexColumn);
    if (neighbours.includes(-1)) {
      const oldGridState = [...gridState];
      const blankCell = findCell(gridState, -1);
      oldGridState[blankCell[0]][blankCell[1]] = oldGridState[indexRow][indexColumn];
      oldGridState[indexRow][indexColumn] = -1;
      setGridState(oldGridState);
    }
    if (gridIsEqual(gridState, [[0,1,2], [3,4,5], [6,7,-1]])) {
      alert('Correct!');
      shuffleHandler();
    }
  };

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle }}>
      {gridState.map((gridRow, indexRow) => {
        const indexRowString = Math.random().toString() + indexRow;
        return (
          <div style={{ ...rowContainerStyle }} key={indexRowString}>
            {gridRow.map((gridColumn, indexColumn) => {
              const indexColumnString = indexRowString + indexColumn;
              const image = getImage(gridColumn);
              if (image === null) {
                return (
                  <div style={{ ...cellStyle, ...highlighted }} key={indexColumnString}/>
                );
              } else {
                return (
                  <div style={{ ...cellStyle }} key={indexColumnString} onClick={() => {
                    clickHandler(indexRow, indexColumn);
                  }}>
                    <img src={image} alt='shrek'/>
                  </div>
                );
              }
            })}
          </div>
        );
      })}
      <div style={{ ...buttonOuterContainer }}>
        <div style={{ ...buttonContainer }}>
          <button style={{ ...buttonStyle }} onClick={() => shuffleHandler()}>Reset</button>
          {!gridIsEqual(gridState, [[0,1,2], [3,4,5], [6,7,-1]]) &&
            <button style={{ ...buttonStyle }} onClick={() => solveHandler()}>Solve</button>
          }
          {gridIsEqual(gridState, [[0,1,2], [3,4,5], [6,7,-1]]) &&
            <button style={{ ...buttonStyle }} disabled>Solve</button>
          }
        </div>
      </div>
    </div>
  );
}