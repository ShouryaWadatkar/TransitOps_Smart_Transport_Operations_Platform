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
 * Validation rules for creating a vehicle
 */
export const validateCreateVehicle = [
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required.')
    .isLength({ max: 50 })
    .withMessage('Registration number cannot exceed 50 characters.'),

  body('make')
    .trim()
    .notEmpty()
    .withMessage('Vehicle make is required.')
    .isLength({ max: 100 })
    .withMessage('Make cannot exceed 100 characters.'),

  body('model')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required.')
    .isLength({ max: 100 })
    .withMessage('Model cannot exceed 100 characters.'),

  body('year')
    .notEmpty()
    .withMessage('Year is required.')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be a valid integer between 1900 and ${new Date().getFullYear() + 1}.`),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required.')
    .isFloat({ min: 0.01 })
    .withMessage('Capacity must be a positive number (in tonnes or kg).'),

  body('status')
    .optional()
    .isIn(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'])
    .withMessage('Status must be one of: AVAILABLE, ON_TRIP, IN_SHOP, RETIRED.'),

  validateResults,
];

/**
 * Validation rules for updating a vehicle (all fields optional)
 */
export const validateUpdateVehicle = [
  body('registrationNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Registration number cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('Registration number cannot exceed 50 characters.'),

  body('make')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Make cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Make cannot exceed 100 characters.'),

  body('model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Model cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Model cannot exceed 100 characters.'),

  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be a valid integer between 1900 and ${new Date().getFullYear() + 1}.`),

  body('capacity')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Capacity must be a positive number.'),

  body('status')
    .optional()
    .isIn(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'])
    .withMessage('Status must be one of: AVAILABLE, ON_TRIP, IN_SHOP, RETIRED.'),

  validateResults,
];
