const getRandom = (min, max) => parseInt(
  Math.random() * (max - min) + min,
  10,
);

const adjustForBorrowing = (minuend, subtrahend, borrowing) => {
  const minuendDigits = Array.from(String(minuend), Number).reverse();
  const subtrahendDigits = Array.from(String(subtrahend), Number).reverse();

  const diffArray = minuendDigits.map(
    (minuendDigit, index) => minuendDigit - (subtrahendDigits[index] || 0),
  );

  if (borrowing) {
    if (diffArray.some((diff) => diff < 0)) { // borrowing already exists
      return { minuend, subtrahend };
    }

    const swapIndex = diffArray.findIndex((diff) => diff > 0);
    // swapping least significant digit with +ve difference
    const temp = minuendDigits[swapIndex];
    minuendDigits[swapIndex] = subtrahendDigits[swapIndex];
    subtrahendDigits[swapIndex] = temp;
  } else if (!borrowing) {
    if (!diffArray.some((diff) => diff < 0)) { // borrowing doesn't exist
      return { minuend, subtrahend };
    }

    diffArray.forEach((diff, index) => {
      if (diff < 0) {
        const temp = minuendDigits[index];
        minuendDigits[index] = subtrahendDigits[index];
        subtrahendDigits[index] = temp;
      }
    });
  }

  return {
    minuend: Number(minuendDigits.reverse().join('')),
    subtrahend: Number(subtrahendDigits.reverse().join('')),
  };
};

const generateOptions = (minuend, subtrahend) => {
  const answer = minuend - subtrahend;
  const digitRange = String(answer).length > 2
    ? String(answer).length - 2
    : String(answer).length;
  const options = Array.from(
    new Array(3),
    // randomly choosing whether to add or subtract random value to answer
    () => (getRandom(0, 2) === 0
      ? answer + getRandom(
        1, 10 ** (Math.max(digitRange - 1, 1)),
      )
      : answer - getRandom(
        1, 10 ** (Math.max(digitRange - 1, 1)),
      )),
  );

  // choosing random position for right answer
  options.splice(getRandom(0, 4), 0, answer);
  return options;
};

module.exports = { getRandom, adjustForBorrowing, generateOptions };
