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
 * Validation rules for creating a driver
 */
export const validateCreateDriver = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Driver name is required.')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters.'),

  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License number is required.')
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters.'),

  body('licenseExpiry')
    .notEmpty()
    .withMessage('License expiry date is required.')
    .isISO8601()
    .withMessage('License expiry must be a valid ISO 8601 date (e.g. 2026-12-31).'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required.')
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters.'),

  body('status')
    .optional()
    .isIn(['AVAILABLE', 'ON_TRIP', 'SUSPENDED'])
    .withMessage('Status must be one of: AVAILABLE, ON_TRIP, SUSPENDED.'),

  validateResults,
];

/**
 * Validation rules for updating a driver (all fields optional)
 */
export const validateUpdateDriver = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters.'),

  body('licenseNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('License number cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters.'),

  body('licenseExpiry')
    .optional()
    .isISO8601()
    .withMessage('License expiry must be a valid ISO 8601 date (e.g. 2026-12-31).'),

  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty.')
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters.'),

  body('status')
    .optional()
    .isIn(['AVAILABLE', 'ON_TRIP', 'SUSPENDED'])
    .withMessage('Status must be one of: AVAILABLE, ON_TRIP, SUSPENDED.'),

  validateResults,
];
