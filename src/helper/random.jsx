// Returns a random integer (0 <= integer < maxinteger)
export function getRandomInteger (maxInteger) {
  return Math.floor(Math.random() * maxInteger);
}

// Returns an array of random integers (0 <= integer < maxinteger)
export function getRandomIntegers (maxInteger, numIntegers) {
  const randomIntegers = [];
  for (let i = 0; i < numIntegers; i++) {
    const randomInteger = getRandomInteger(maxInteger);
    randomIntegers.push(randomInteger);
  }
  return randomIntegers;
}

// Returns a list of random integers without duplicates (0 <= integer < maxinteger)
export function getUniqueRandomIntegers (maxInteger, numIntegers) {
  if (numIntegers > maxInteger) {
    return [];
  }
  const randomIntegers = [];
  while (randomIntegers.length < numIntegers) {
    const newRandomInteger = getRandomInteger(maxInteger);
    if (!randomIntegers.includes(newRandomInteger)) {
      randomIntegers.push(newRandomInteger);
    }
  }
  return randomIntegers;
}

// Returns a random key
export function getRandomKey (key) {
  return Math.random().toString() + key;
}
