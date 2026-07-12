import * as vehicleService from '../services/vehicleService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/vehicles
 * Retrieve all vehicles (optional ?status= query)
 */
export const getVehicles = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const vehicles = await vehicleService.getAllVehicles({ status });
  return sendSuccess(res, 'Vehicles retrieved successfully.', vehicles, 200);
});

/**
 * GET /api/vehicles/:id
 * Retrieve a single vehicle by ID
 */
export const getVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vehicle = await vehicleService.getVehicleById(id);
  return sendSuccess(res, 'Vehicle details retrieved successfully.', vehicle, 200);
});

/**
 * POST /api/vehicles
 * Create a new vehicle
 */
export const createVehicle = asyncHandler(async (req, res) => {
  const { registrationNumber, make, model, year, capacity, status } = req.body;
  const vehicle = await vehicleService.createVehicle({ registrationNumber, make, model, year, capacity, status });
  return sendSuccess(res, 'Vehicle created successfully.', vehicle, 201);
});

/**
 * PUT /api/vehicles/:id
 * Update an existing vehicle
 */
export const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { registrationNumber, make, model, year, capacity, status } = req.body;
  const vehicle = await vehicleService.updateVehicle(id, { registrationNumber, make, model, year, capacity, status });
  return sendSuccess(res, 'Vehicle updated successfully.', vehicle, 200);
});

/**
 * DELETE /api/vehicles/:id
 * Delete a vehicle
 */
export const deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await vehicleService.deleteVehicle(id);
  return sendSuccess(res, `Vehicle with ID ${id} deleted successfully.`, null, 200);
});
