import { body, validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

/**
 * Common middleware to compile and verify express-validator outcomes.
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendError(res, 'Request validation failed.', formattedErrors, 400);
  }
  next();
};

/**
 * Validation rules for creating an expense
 */
export const validateCreateExpense = [
  body('vehicleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('driverId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Driver ID must be a positive integer.'),

  body('tripId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trip ID must be a positive integer.'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters.'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required.')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.'),

  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),

  validateResults,
];

/**
 * Validation rules for updating an expense (all fields optional)
 */
export const validateUpdateExpense = [
  body('vehicleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('driverId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Driver ID must be a positive integer.'),

  body('tripId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trip ID must be a positive integer.'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters.'),

  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),

  validateResults,
];
