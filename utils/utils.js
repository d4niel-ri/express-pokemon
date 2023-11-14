export const orderData = (data) => {
  // The items are sorted from the the lowest ID to the largest ID
  const customCompare = (a, b) => {
    if (a.id === b.id) {
      return 0;
    } else {
      return a.id > b.id ? 1 : -1;
    }
  }

  data.sort(customCompare)
  return data;
}

export const canCatchPokemon = () => {
  // This return true if the Math.random return larger than 50%
  if (Math.floor(Math.random() * 100) >= 50) {
    return true;
  }

  return false;
}

export const canReleasePokemon = (randomNumber) => {
  if (randomNumber < 2) return false;

  const sqrtRandom = Math.floor(Math.sqrt(randomNumber));
  for (let i = 2; i <= sqrtRandom; i++) {
    if (randomNumber % i === 0) return false;
  }

  return true;
}

export const getFibonacciSequence = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let prevPrev = 0;
  let prev = 1;

  for (let i = 2; i <= n; i++) {
    const current = prevPrev + prev;
    prevPrev = prev;
    prev = current;
  }

  return prev;
}

export const extractIDFromURL = (url) => {
  // Match the last set of digits in the URL
  const match = url.match(/\/(\d+)\/?$/);

  // Check if there is a match
  if (match && match[1]) {
    // Convert the matched string to a number and return
    return parseInt(match[1], 10);
  } else {
    // Return null or handle the case where no match is found
    return null;
  }
}

export const extractNextEvolutionFromObject = (evolutionChainTemp, name) => {
  let evolutionChain = evolutionChainTemp;

  while (true) {
    if (evolutionChain.species.name === name) break;
    evolutionChain = evolutionChain.evolves_to[0];
  }

  // Return null if no evolution after it
  if (evolutionChain.evolves_to.length === 0) {
    return null;
  }

  return evolutionChain.evolves_to[0].species.name;
}