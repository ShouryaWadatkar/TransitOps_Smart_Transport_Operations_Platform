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
 * Validation rules for creating a fuel log
 */
export const validateCreateFuelLog = [
  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required.')
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('driverId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Driver ID must be a positive integer.'),

  body('liters')
    .notEmpty()
    .withMessage('Liters is required.')
    .isFloat({ min: 0.01 })
    .withMessage('Liters must be a positive number.'),

  body('pricePerLiter')
    .notEmpty()
    .withMessage('Price per liter is required.')
    .isFloat({ min: 0.01 })
    .withMessage('Price per liter must be a positive number.'),

  body('odometer')
    .notEmpty()
    .withMessage('Odometer reading is required.')
    .isFloat({ min: 0 })
    .withMessage('Odometer must be a non-negative number.'),

  body('station')
    .optional()
    .trim()
    .isLength({ max: 191 })
    .withMessage('Station name cannot exceed 191 characters.'),

  body('loggedAt')
    .notEmpty()
    .withMessage('Log date/time is required.')
    .isISO8601()
    .withMessage('Log date must be a valid ISO 8601 date.'),

  validateResults,
];

/**
 * Validation rules for updating a fuel log (all fields optional)
 */
export const validateUpdateFuelLog = [
  body('vehicleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('driverId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Driver ID must be a positive integer.'),

  body('liters')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Liters must be a positive number.'),

  body('pricePerLiter')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price per liter must be a positive number.'),

  body('odometer')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Odometer must be a non-negative number.'),

  body('station')
    .optional()
    .trim()
    .isLength({ max: 191 })
    .withMessage('Station name cannot exceed 191 characters.'),

  body('loggedAt')
    .optional()
    .isISO8601()
    .withMessage('Log date must be a valid ISO 8601 date.'),

  validateResults,
];
