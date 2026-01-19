// Fetches a value from a URL
export async function fetchValue () {
  const url = 'https://cs6080.web.cse.unsw.edu.au/raw/data/score.json';
  const response = await fetch(url);
  const data = await response.json();
  const value = await data['score'];
  return value;
}

// Sets the value of a stored value
export function setValue (value) {
  localStorage.setItem('storedValue', value);
}

// Resets the stored value with that from a URL
export async function resetValue () {
  const initialValue = await fetchValue();
  setValue(initialValue);
  return initialValue;
}

// Gets the value of the stored value
export async function getValue () {
  const storedValue = localStorage.getItem('storedValue');
  if (isNaN(parseInt(storedValue))) {
    return await resetValue();
  } else {
    return storedValue;
  }
} 

// Increment the stored value by 1
export async function incrementValue () {
  const oldValue = await getValue();
  const newValue = parseInt(oldValue) + 1;
  setValue(newValue);
  return newValue;
}

// Decrement the stored value by 1, with a minimum of 0
export async function decrementValue () {
  const oldValue = await getValue();
  const newValue = parseInt(oldValue) - 1;
  if (newValue < 0) {
    return oldValue;
  }
  setValue(newValue);
  return newValue;
}
