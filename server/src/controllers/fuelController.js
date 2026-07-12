import * as fuelService from '../services/fuelService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/fuel
 * Retrieve all fuel logs (optional ?vehicleId= and ?driverId= queries)
 */
export const getFuelLogs = asyncHandler(async (req, res) => {
  const { vehicleId, driverId } = req.query;
  const logs = await fuelService.getAllFuelLogs({ vehicleId, driverId });
  return sendSuccess(res, 'Fuel logs retrieved successfully.', logs, 200);
});

/**
 * GET /api/fuel/:id
 * Retrieve a single fuel log by ID
 */
export const getFuelLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const log = await fuelService.getFuelLogById(id);
  return sendSuccess(res, 'Fuel log retrieved successfully.', log, 200);
});

/**
 * POST /api/fuel
 * Create a new fuel log (totalCost auto-computed)
 */
export const createFuelLog = asyncHandler(async (req, res) => {
  const { vehicleId, driverId, liters, pricePerLiter, odometer, station, loggedAt } = req.body;
  const log = await fuelService.createFuelLog({ vehicleId, driverId, liters, pricePerLiter, odometer, station, loggedAt });
  return sendSuccess(res, 'Fuel log created successfully.', log, 201);
});

/**
 * PUT /api/fuel/:id
 * Update an existing fuel log
 */
export const updateFuelLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vehicleId, driverId, liters, pricePerLiter, odometer, station, loggedAt } = req.body;
  const log = await fuelService.updateFuelLog(id, { vehicleId, driverId, liters, pricePerLiter, odometer, station, loggedAt });
  return sendSuccess(res, 'Fuel log updated successfully.', log, 200);
});

/**
 * DELETE /api/fuel/:id
 * Delete a fuel log
 */
export const deleteFuelLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await fuelService.deleteFuelLog(id);
  return sendSuccess(res, `Fuel log with ID ${id} deleted successfully.`, null, 200);
});
