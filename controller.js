const { validationResult } = require('express-validator');
const { getRandom, adjustForBorrowing, generateOptions } = require('./utils');

module.exports = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // parsing query parameters
  const questionCount = Number(req.query.questions);
  const minuendDigits = Number(req.query.minuend_digits);
  const subtrahendDigits = Number(req.query.subtrahend_digits);
  const borrowing = JSON.parse(req.query.borrowing);

  const questions = Array.from(new Array(questionCount), () => {
    const initialMinuend = getRandom(
      10 ** (minuendDigits - 1),
      10 ** minuendDigits,
    );
    const initialSubtrahend = getRandom(
      10 ** (subtrahendDigits - 1),
      Math.min(10 ** subtrahendDigits, initialMinuend),
    );
    const { minuend, subtrahend } = adjustForBorrowing(
      initialMinuend,
      initialSubtrahend,
      borrowing,
    );
    const correct = minuend - subtrahend;

    const options = generateOptions(minuend, subtrahend);
    return {
      minuend, subtrahend, options, correct,
    };
  });
  return res.send(questions);
};
