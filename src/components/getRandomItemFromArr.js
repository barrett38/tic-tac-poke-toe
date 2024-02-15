export function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  let randomArrayItem = array[randomIndex];

  return randomArrayItem;
}

// For this instance we are using this for a on an array of images
