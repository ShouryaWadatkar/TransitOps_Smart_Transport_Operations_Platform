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
 * Validation rules for creating a maintenance record
 */
export const validateCreateMaintenance = [
  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required.')
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer.'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Maintenance type is required.')
    .isLength({ max: 100 })
    .withMessage('Maintenance type cannot exceed 100 characters.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.'),

  body('scheduledAt')
    .notEmpty()
    .withMessage('Scheduled date is required.')
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date.'),

  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number.'),

  validateResults,
];

/**
 * Validation rules for updating a maintenance record (all fields optional)
 */
export const validateUpdateMaintenance = [
  body('type')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Maintenance type cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Maintenance type cannot exceed 100 characters.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.'),

  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date.'),

  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number.'),

  validateResults,
];
