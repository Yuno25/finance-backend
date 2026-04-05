const { body, query } = require('express-validator');

const createRecordValidator = [
  body('amount')
    .isNumeric().withMessage('Amount must be a number')
    .custom(val => val > 0).withMessage('Amount must be greater than 0'),

  body('type')
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('date')
    .isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD)'),

  body('notes')
    .optional()
    .trim()
];

const updateRecordValidator = [
  body('amount')
    .optional()
    .isNumeric().withMessage('Amount must be a number')
    .custom(val => val > 0).withMessage('Amount must be greater than 0'),

  body('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),

  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD)'),

  body('notes')
    .optional()
    .trim()
];

module.exports = { createRecordValidator, updateRecordValidator };