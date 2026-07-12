import prisma from '../config/db.js';
import { NotFoundError } from '../utils/errorHandler.js';

/**
 * Retrieve all fuel logs, with optional vehicleId filter
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
export const getAllFuelLogs = async ({ vehicleId, driverId } = {}) => {
  const where = {};
  if (vehicleId) where.vehicleId = parseInt(vehicleId);
  if (driverId)  where.driverId  = parseInt(driverId);

  return prisma.fuelLog.findMany({
    where,
    include: {
      vehicle: true,
      driver:  true,
    },
    orderBy: { loggedAt: 'desc' },
  });
};

/**
 * Retrieve a fuel log by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getFuelLogById = async (id) => {
  const log = await prisma.fuelLog.findUnique({
    where: { id: parseInt(id) },
    include: {
      vehicle: true,
      driver:  true,
    },
  });

  if (!log) {
    throw new NotFoundError(`Fuel log with ID ${id} not found.`);
  }

  return log;
};

/**
 * Create a new fuel log
 * Business rule: totalCost is auto-computed as liters * pricePerLiter
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createFuelLog = async ({ vehicleId, driverId, liters, pricePerLiter, odometer, station, loggedAt }) => {
  // Verify vehicle exists
  const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${vehicleId} not found.`);
  }

  // Verify driver exists if provided
  if (driverId) {
    const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
    if (!driver) {
      throw new NotFoundError(`Driver with ID ${driverId} not found.`);
    }
  }

  const parsedLiters        = parseFloat(liters);
  const parsedPricePerLiter = parseFloat(pricePerLiter);
  const totalCost           = parseFloat((parsedLiters * parsedPricePerLiter).toFixed(2));

  return prisma.fuelLog.create({
    data: {
      vehicleId:     parseInt(vehicleId),
      driverId:      driverId ? parseInt(driverId) : null,
      liters:        parsedLiters,
      pricePerLiter: parsedPricePerLiter,
      totalCost,
      odometer:      parseFloat(odometer),
      station:       station || null,
      loggedAt:      new Date(loggedAt),
    },
    include: {
      vehicle: true,
      driver:  true,
    },
  });
};

/**
 * Update a fuel log
 * Recomputes totalCost if liters or pricePerLiter change
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateFuelLog = async (id, { vehicleId, driverId, liters, pricePerLiter, odometer, station, loggedAt }) => {
  const parsedId = parseInt(id);

  const log = await prisma.fuelLog.findUnique({ where: { id: parsedId } });
  if (!log) {
    throw new NotFoundError(`Fuel log with ID ${id} not found.`);
  }

  // Verify FK references if being changed
  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) throw new NotFoundError(`Vehicle with ID ${vehicleId} not found.`);
  }

  if (driverId) {
    const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
    if (!driver) throw new NotFoundError(`Driver with ID ${driverId} not found.`);
  }

  // Recompute totalCost if either component changes
  const newLiters        = liters        !== undefined ? parseFloat(liters)        : parseFloat(log.liters);
  const newPricePerLiter = pricePerLiter !== undefined ? parseFloat(pricePerLiter) : parseFloat(log.pricePerLiter);
  const newTotalCost     = parseFloat((newLiters * newPricePerLiter).toFixed(2));

  return prisma.fuelLog.update({
    where: { id: parsedId },
    data: {
      vehicleId:     vehicleId     !== undefined ? parseInt(vehicleId)     : undefined,
      driverId:      driverId      !== undefined ? parseInt(driverId)      : undefined,
      liters:        newLiters,
      pricePerLiter: newPricePerLiter,
      totalCost:     newTotalCost,
      odometer:      odometer      !== undefined ? parseFloat(odometer)    : undefined,
      station:       station       !== undefined ? station                 : undefined,
      loggedAt:      loggedAt      !== undefined ? new Date(loggedAt)      : undefined,
    },
    include: {
      vehicle: true,
      driver:  true,
    },
  });
};

/**
 * Delete a fuel log by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteFuelLog = async (id) => {
  const parsedId = parseInt(id);

  const log = await prisma.fuelLog.findUnique({ where: { id: parsedId } });
  if (!log) {
    throw new NotFoundError(`Fuel log with ID ${id} not found.`);
  }

  return prisma.fuelLog.delete({ where: { id: parsedId } });
};
