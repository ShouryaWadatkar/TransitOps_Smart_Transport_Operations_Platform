import prisma from '../config/db.js';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errorHandler.js';

/**
 * Retrieve all vehicles, with optional status filter
 * @param {string} [status] - Optional VehicleStatus filter
 * @returns {Promise<Array>}
 */
export const getAllVehicles = async ({ status } = {}) => {
  const where = status ? { status } : {};
  return prisma.vehicle.findMany({
    where,
    orderBy: { id: 'asc' },
  });
};

/**
 * Retrieve a vehicle by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getVehicleById = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
  });

  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${id} not found.`);
  }

  return vehicle;
};

/**
 * Create a new vehicle
 * Business rule: registrationNumber must be unique
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createVehicle = async ({ registrationNumber, make, model, year, capacity, status }) => {
  // Unique registration number check
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber },
  });

  if (existing) {
    throw new ConflictError(
      `A vehicle with registration number "${registrationNumber}" already exists.`
    );
  }

  return prisma.vehicle.create({
    data: {
      registrationNumber,
      make,
      model,
      year: parseInt(year),
      capacity: parseFloat(capacity),
      status: status || 'AVAILABLE',
    },
  });
};

/**
 * Update an existing vehicle
 * Business rule: registrationNumber must remain unique if changed
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateVehicle = async (id, { registrationNumber, make, model, year, capacity, status }) => {
  const parsedId = parseInt(id);

  const vehicle = await prisma.vehicle.findUnique({ where: { id: parsedId } });
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${id} not found.`);
  }

  // Unique check only if registration number is being changed
  if (registrationNumber && registrationNumber !== vehicle.registrationNumber) {
    const conflict = await prisma.vehicle.findUnique({ where: { registrationNumber } });
    if (conflict) {
      throw new ConflictError(
        `A vehicle with registration number "${registrationNumber}" already exists.`
      );
    }
  }

  return prisma.vehicle.update({
    where: { id: parsedId },
    data: {
      registrationNumber: registrationNumber ?? undefined,
      make: make ?? undefined,
      model: model ?? undefined,
      year: year !== undefined ? parseInt(year) : undefined,
      capacity: capacity !== undefined ? parseFloat(capacity) : undefined,
      status: status ?? undefined,
    },
  });
};

/**
 * Delete a vehicle by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteVehicle = async (id) => {
  const parsedId = parseInt(id);

  const vehicle = await prisma.vehicle.findUnique({ where: { id: parsedId } });
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${id} not found.`);
  }

  return prisma.vehicle.delete({ where: { id: parsedId } });
};
