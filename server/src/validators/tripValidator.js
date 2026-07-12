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
 * Validation rules for creating a trip
 */
export const validateCreateTrip = [
  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required.')
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('driverId')
    .notEmpty()
    .withMessage('Driver ID is required.')
    .isInt({ min: 1 })
    .withMessage('Driver ID must be a positive integer.'),

  body('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin is required.')
    .isLength({ max: 191 })
    .withMessage('Origin cannot exceed 191 characters.'),

  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required.')
    .isLength({ max: 191 })
    .withMessage('Destination cannot exceed 191 characters.'),

  body('cargoWeight')
    .notEmpty()
    .withMessage('Cargo weight is required.')
    .isFloat({ min: 0 })
    .withMessage('Cargo weight must be a non-negative number.'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string.'),

  validateResults,
];

/**
 * Validation rules for updating a trip (all fields optional)
 */
export const validateUpdateTrip = [
  body('vehicleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('driverId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Driver ID must be a positive integer.'),

  body('origin')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Origin cannot be empty.')
    .isLength({ max: 191 })
    .withMessage('Origin cannot exceed 191 characters.'),

  body('destination')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Destination cannot be empty.')
    .isLength({ max: 191 })
    .withMessage('Destination cannot exceed 191 characters.'),

  body('cargoWeight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cargo weight must be a non-negative number.'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string.'),

  validateResults,
];
