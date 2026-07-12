import * as tripService from '../services/tripService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/trips
 * Retrieve all trips (optional ?status= query)
 */
export const getTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const trips = await tripService.getAllTrips({ status });
  return sendSuccess(res, 'Trips retrieved successfully.', trips, 200);
});

/**
 * GET /api/trips/:id
 * Retrieve a single trip by ID
 */
export const getTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.getTripById(id);
  return sendSuccess(res, 'Trip details retrieved successfully.', trip, 200);
});

/**
 * POST /api/trips
 * Create a new trip (SCHEDULED)
 */
export const createTrip = asyncHandler(async (req, res) => {
  const { vehicleId, driverId, origin, destination, cargoWeight, notes } = req.body;
  const trip = await tripService.createTrip({ vehicleId, driverId, origin, destination, cargoWeight, notes });
  return sendSuccess(res, 'Trip created successfully.', trip, 201);
});

/**
 * PUT /api/trips/:id
 * Update a SCHEDULED trip's details
 */
export const updateTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vehicleId, driverId, origin, destination, cargoWeight, notes } = req.body;
  const trip = await tripService.updateTrip(id, { vehicleId, driverId, origin, destination, cargoWeight, notes });
  return sendSuccess(res, 'Trip updated successfully.', trip, 200);
});

/**
 * DELETE /api/trips/:id
 * Delete a SCHEDULED or CANCELLED trip
 */
export const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await tripService.deleteTrip(id);
  return sendSuccess(res, `Trip with ID ${id} deleted successfully.`, null, 200);
});

/**
 * PATCH /api/trips/:id/dispatch
 * Transition trip: SCHEDULED → DISPATCHED
 */
export const dispatchTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.dispatchTrip(id);
  return sendSuccess(res, 'Trip dispatched successfully. Vehicle and driver are now ON_TRIP.', trip, 200);
});

/**
 * PATCH /api/trips/:id/complete
 * Transition trip: DISPATCHED → COMPLETED
 */
export const completeTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.completeTrip(id);
  return sendSuccess(res, 'Trip completed successfully. Vehicle and driver are now AVAILABLE.', trip, 200);
});

/**
 * PATCH /api/trips/:id/cancel
 * Transition trip: SCHEDULED | DISPATCHED → CANCELLED
 */
export const cancelTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trip = await tripService.cancelTrip(id);
  return sendSuccess(res, 'Trip cancelled successfully.', trip, 200);
});
