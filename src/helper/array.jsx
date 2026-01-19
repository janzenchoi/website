import { getRandomInteger } from "./random";

// Returns the sum of the elements of an array
export function getSum (array) {
  return array.reduce((a, b) => a + b, 0);
}

// Returns the average of the elements of an array
export function getAverage (array) {
  return getSum(array) / array.length;
}

// Checks the similarity between two arrays
export function arrayIsEqual (array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true; 
}

// Shuffles a 1D array
export function shuffleArray (array) {
  const newArray = [];
  const oldArrayCopy = array.slice();
  for (let i = 0; i < array.length; i++) {
    const randomIndex = getRandomInteger(oldArrayCopy.length);
    newArray.push(oldArrayCopy[randomIndex]);
    oldArrayCopy.splice(randomIndex, 1);
  }
  return newArray;
}

// Converts a string to an array
export function stringToArray (string) {
  const array = [];
  for (let i = 0; i < string.length; i++) {
    array.push(string[i]);
  }
  return array;
}

// Converts an array to a string
export function arrayToString (array) {
  let string = '';
  for (let i = 0; i < array.length; i++) {
    string += array[i];
  }
  return string;
}
