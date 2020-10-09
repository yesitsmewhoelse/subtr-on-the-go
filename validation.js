const { query } = require('express-validator');

module.exports = [
  query('questions')
    .isInt({ min: 1 })
    .withMessage('must be integer'),

  query('minuend_digits')
    .isInt({ min: 1, max: 10 })
    .withMessage('must be integer between 1 and 10'),

  query('subtrahend_digits')
    .isInt({ min: 1, max: 10 })
    .withMessage('must be integer between 1 and 10')
    .custom((value, { req }) => {
      if (Number(value) > Number(req.query.minuend_digits)) {
        throw new Error("subtrahend_digits can't exceed minuend_digits");
      }
      return true;
    }),

  query('borrowing')
    .isBoolean()
    .withMessage('must be true or false'),
];
