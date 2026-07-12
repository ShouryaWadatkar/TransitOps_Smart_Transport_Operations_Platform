import prisma from '../config/db.js';
import { BadRequestError, NotFoundError } from '../utils/errorHandler.js';

/**
 * Retrieve all maintenance records, with optional status or vehicle filter
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
export const getAllMaintenances = async ({ status, vehicleId } = {}) => {
  const where = {};
  if (status)    where.status    = status;
  if (vehicleId) where.vehicleId = parseInt(vehicleId);

  return prisma.maintenance.findMany({
    where,
    include: { vehicle: true },
    orderBy: { id: 'desc' },
  });
};

/**
 * Retrieve a maintenance record by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getMaintenanceById = async (id) => {
  const maintenance = await prisma.maintenance.findUnique({
    where: { id: parseInt(id) },
    include: { vehicle: true },
  });

  if (!maintenance) {
    throw new NotFoundError(`Maintenance record with ID ${id} not found.`);
  }

  return maintenance;
};

/**
 * Create a new maintenance record
 * Business rules:
 *  - Vehicle must exist and must not be RETIRED
 *  - Sets vehicle status = IN_SHOP
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createMaintenance = async ({ vehicleId, type, description, scheduledAt, cost }) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });

  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${vehicleId} not found.`);
  }

  if (vehicle.status === 'RETIRED') {
    throw new BadRequestError(
      `Vehicle "${vehicle.registrationNumber}" is retired and cannot be sent for maintenance.`
    );
  }

  // Atomic: create maintenance record + set vehicle IN_SHOP
  const [maintenance] = await prisma.$transaction([
    prisma.maintenance.create({
      data: {
        vehicleId:   parseInt(vehicleId),
        type,
        description: description || null,
        scheduledAt: new Date(scheduledAt),
        cost:        cost !== undefined ? parseFloat(cost) : null,
        status:      'ACTIVE',
      },
      include: { vehicle: true },
    }),
    prisma.vehicle.update({
      where: { id: parseInt(vehicleId) },
      data:  { status: 'IN_SHOP' },
    }),
  ]);

  return maintenance;
};

/**
 * Update a maintenance record (fields only, not status transitions)
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateMaintenance = async (id, { type, description, scheduledAt, cost }) => {
  const parsedId = parseInt(id);

  const maintenance = await prisma.maintenance.findUnique({ where: { id: parsedId } });
  if (!maintenance) {
    throw new NotFoundError(`Maintenance record with ID ${id} not found.`);
  }

  if (maintenance.status === 'CLOSED') {
    throw new BadRequestError(
      'Cannot update a closed maintenance record.'
    );
  }

  return prisma.maintenance.update({
    where: { id: parsedId },
    data: {
      type:        type        ?? undefined,
      description: description ?? undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      cost:        cost !== undefined ? parseFloat(cost) : undefined,
    },
    include: { vehicle: true },
  });
};

/**
 * Delete a maintenance record by ID
 * Only CLOSED records may be deleted
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteMaintenance = async (id) => {
  const parsedId = parseInt(id);

  const maintenance = await prisma.maintenance.findUnique({ where: { id: parsedId } });
  if (!maintenance) {
    throw new NotFoundError(`Maintenance record with ID ${id} not found.`);
  }

  if (maintenance.status === 'ACTIVE') {
    throw new BadRequestError(
      'Cannot delete an active maintenance record. Close it first.'
    );
  }

  return prisma.maintenance.delete({ where: { id: parsedId } });
};

/**
 * Close a maintenance record: ACTIVE → CLOSED
 * Business rule: Sets vehicle status = AVAILABLE
 * @param {number} id
 * @param {Object} [data] - Optional cost update on close
 * @returns {Promise<Object>}
 */
export const closeMaintenance = async (id, { cost } = {}) => {
  const parsedId = parseInt(id);

  const maintenance = await prisma.maintenance.findUnique({
    where: { id: parsedId },
    include: { vehicle: true },
  });

  if (!maintenance) {
    throw new NotFoundError(`Maintenance record with ID ${id} not found.`);
  }

  if (maintenance.status === 'CLOSED') {
    throw new BadRequestError(
      `Maintenance record with ID ${id} is already closed.`
    );
  }

  const [updatedMaintenance] = await prisma.$transaction([
    prisma.maintenance.update({
      where: { id: parsedId },
      data: {
        status:   'CLOSED',
        closedAt: new Date(),
        cost:     cost !== undefined ? parseFloat(cost) : maintenance.cost,
      },
      include: { vehicle: true },
    }),
    prisma.vehicle.update({
      where: { id: maintenance.vehicleId },
      data:  { status: 'AVAILABLE' },
    }),
  ]);

  return updatedMaintenance;
};
