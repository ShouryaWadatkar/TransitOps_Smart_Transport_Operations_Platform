import * as maintenanceService from '../services/maintenanceService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/maintenance
 * Retrieve all maintenance records (optional ?status= and ?vehicleId= queries)
 */
export const getMaintenances = asyncHandler(async (req, res) => {
  const { status, vehicleId } = req.query;
  const records = await maintenanceService.getAllMaintenances({ status, vehicleId });
  return sendSuccess(res, 'Maintenance records retrieved successfully.', records, 200);
});

/**
 * GET /api/maintenance/:id
 * Retrieve a single maintenance record by ID
 */
export const getMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await maintenanceService.getMaintenanceById(id);
  return sendSuccess(res, 'Maintenance record retrieved successfully.', record, 200);
});

/**
 * POST /api/maintenance
 * Create a new maintenance record (ACTIVE) — sets vehicle IN_SHOP
 */
export const createMaintenance = asyncHandler(async (req, res) => {
  const { vehicleId, type, description, scheduledAt, cost } = req.body;
  const record = await maintenanceService.createMaintenance({ vehicleId, type, description, scheduledAt, cost });
  return sendSuccess(res, 'Maintenance record created successfully. Vehicle status set to IN_SHOP.', record, 201);
});

/**
 * PUT /api/maintenance/:id
 * Update a maintenance record's editable fields
 */
export const updateMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, description, scheduledAt, cost } = req.body;
  const record = await maintenanceService.updateMaintenance(id, { type, description, scheduledAt, cost });
  return sendSuccess(res, 'Maintenance record updated successfully.', record, 200);
});

/**
 * DELETE /api/maintenance/:id
 * Delete a CLOSED maintenance record
 */
export const deleteMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await maintenanceService.deleteMaintenance(id);
  return sendSuccess(res, `Maintenance record with ID ${id} deleted successfully.`, null, 200);
});

/**
 * PATCH /api/maintenance/:id/close
 * Transition maintenance: ACTIVE → CLOSED — sets vehicle AVAILABLE
 */
export const closeMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cost } = req.body;
  const record = await maintenanceService.closeMaintenance(id, { cost });
  return sendSuccess(res, 'Maintenance record closed. Vehicle status set to AVAILABLE.', record, 200);
});
