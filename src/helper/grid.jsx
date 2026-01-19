import { arrayIsEqual, shuffleArray, getSum } from './array';

// Gets the sum of a grid
export function getSumGrid (grid) {
  let totalSum = 0;
  for (let i = 0; i < grid.length; i++) {
    totalSum += getSum(grid[i]);
  }
  return totalSum;
}

// Returns the neighbour indexes of a 2D grid, given the grid, the row index, and column index
export function getNeighbourIndexes (grid, indexRow, indexColumn) {
  // Check grid shape
  const numRows = grid.length;
  if (numRows === 0) {
    return [];
  }
  const numColumns = grid[0].length;
  if (numColumns === 0) {
    return [];
  }
  // Get indexes
  const neighbourIndexes = [];
  if (indexColumn !== 0) {
    neighbourIndexes.push([indexRow, indexColumn - 1]);
  }
  if (indexColumn !== numColumns - 1) {
    neighbourIndexes.push([indexRow, indexColumn + 1]);
  }
  if (indexRow !== 0) {
    neighbourIndexes.push([indexRow - 1, indexColumn]);
  }
  if (indexRow !== numRows - 1) {
    neighbourIndexes.push([indexRow + 1, indexColumn]);
  }
  return neighbourIndexes;
}

// Returns the neighbours of a 2D grid, given the grid, the row index, and column index
export function getNeighbours (grid, indexRow, indexColumn) {
  const neighbourIndexes = getNeighbourIndexes(grid, indexRow, indexColumn);
  const neighbours = [];
  for (let i = 0; i < neighbourIndexes.length; i++) {
    const neighbourRow = neighbourIndexes[i][0];
    const neighbourColumn = neighbourIndexes[i][1];
    neighbours.push(grid[neighbourRow][neighbourColumn]);
  }
  return neighbours;
}

// Flattens a grid into an array
export function gridToArray (grid) {
  const flattenedGrid = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      flattenedGrid.push(grid[i][j]);
    }
  }
  return flattenedGrid;
}

// Converts an array to a 2D grid
export function arrayToGrid (array, numRows, numColumns) {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numColumns; j++) {
      row.push(array[i * numColumns + j]);
    }
    grid.push(row);
  }
  return grid;
}

// Shuffles a 2D grid
export function shuffleGrid (grid) {
  // Check grid shape
  const numRows = grid.length;
  if (numRows === 0) {
    return [];
  }
  const numColumns = grid[0].length;
  if (numColumns === 0) {
    return [];
  }
  // Shuffle and return
  const flattenedGrid = gridToArray(grid);
  const shuffledArray = shuffleArray(flattenedGrid);
  const shuffledGrid = arrayToGrid(shuffledArray, numRows, numColumns);
  return shuffledGrid;
}

// Fills a 2D grid with one value
export function initialiseGrid (numRows, numColumns, value) {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numColumns; j++) {
      row.push(value);
    }
    grid.push(row);
  }
  return grid;
}

// Returns the row and column in a grid that matches a value
export function findCell (grid, value) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === value) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

// Checks the similarity between two grids
export function gridIsEqual (grid1, grid2) {
  if (grid1.length !== grid2.length) {
    return false;
  }
  for (let i = 0; i < grid1.length; i++) {
    if (!arrayIsEqual(grid1[i], grid2[i])) {
      return false;
    }
  }
  return true; 
}

// Checks whether a grid has an array
export function gridIncludesArray (grid, array) {
  for (let i = 0; i < grid.length; i++) {
    if (arrayIsEqual(grid[i], array)) {
      return true;
    }
  }
  return false;
}
