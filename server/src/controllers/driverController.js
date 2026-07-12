import * as driverService from '../services/driverService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/drivers
 * Retrieve all drivers (optional ?status= query)
 */
export const getDrivers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const drivers = await driverService.getAllDrivers({ status });
  return sendSuccess(res, 'Drivers retrieved successfully.', drivers, 200);
});

/**
 * GET /api/drivers/:id
 * Retrieve a single driver by ID
 */
export const getDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const driver = await driverService.getDriverById(id);
  return sendSuccess(res, 'Driver details retrieved successfully.', driver, 200);
});

/**
 * POST /api/drivers
 * Create a new driver
 */
export const createDriver = asyncHandler(async (req, res) => {
  const { name, licenseNumber, licenseExpiry, phone, status } = req.body;
  const driver = await driverService.createDriver({ name, licenseNumber, licenseExpiry, phone, status });
  return sendSuccess(res, 'Driver created successfully.', driver, 201);
});

/**
 * PUT /api/drivers/:id
 * Update an existing driver
 */
export const updateDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, licenseNumber, licenseExpiry, phone, status } = req.body;
  const driver = await driverService.updateDriver(id, { name, licenseNumber, licenseExpiry, phone, status });
  return sendSuccess(res, 'Driver updated successfully.', driver, 200);
});

/**
 * DELETE /api/drivers/:id
 * Delete a driver
 */
export const deleteDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await driverService.deleteDriver(id);
  return sendSuccess(res, `Driver with ID ${id} deleted successfully.`, null, 200);
});
