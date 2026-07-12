import prisma from '../config/db.js';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errorHandler.js';

/**
 * Retrieve all drivers, with optional status filter
 * @param {string} [status] - Optional DriverStatus filter
 * @returns {Promise<Array>}
 */
export const getAllDrivers = async ({ status } = {}) => {
  const where = status ? { status } : {};
  return prisma.driver.findMany({
    where,
    orderBy: { id: 'asc' },
  });
};

/**
 * Retrieve a driver by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getDriverById = async (id) => {
  const driver = await prisma.driver.findUnique({
    where: { id: parseInt(id) },
  });

  if (!driver) {
    throw new NotFoundError(`Driver with ID ${id} not found.`);
  }

  return driver;
};

/**
 * Create a new driver
 * Business rules:
 *  - licenseNumber must be unique
 *  - licenseExpiry must be a future date
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createDriver = async ({ name, licenseNumber, licenseExpiry, phone, status }) => {
  // Unique license number check
  const existing = await prisma.driver.findUnique({
    where: { licenseNumber },
  });

  if (existing) {
    throw new ConflictError(
      `A driver with license number "${licenseNumber}" already exists.`
    );
  }

  // License expiry must be in the future
  const expiryDate = new Date(licenseExpiry);
  if (expiryDate <= new Date()) {
    throw new BadRequestError(
      'License expiry date must be a future date. The driver cannot be registered with an expired or today-dated license.'
    );
  }

  return prisma.driver.create({
    data: {
      name,
      licenseNumber,
      licenseExpiry: expiryDate,
      phone,
      status: status || 'AVAILABLE',
    },
  });
};

/**
 * Update an existing driver
 * Business rules:
 *  - licenseNumber must remain unique if changed
 *  - licenseExpiry must be a future date if changed
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateDriver = async (id, { name, licenseNumber, licenseExpiry, phone, status }) => {
  const parsedId = parseInt(id);

  const driver = await prisma.driver.findUnique({ where: { id: parsedId } });
  if (!driver) {
    throw new NotFoundError(`Driver with ID ${id} not found.`);
  }

  // Unique check only if license number is being changed
  if (licenseNumber && licenseNumber !== driver.licenseNumber) {
    const conflict = await prisma.driver.findUnique({ where: { licenseNumber } });
    if (conflict) {
      throw new ConflictError(
        `A driver with license number "${licenseNumber}" already exists.`
      );
    }
  }

  // Expiry must be future date if being changed
  let expiryDate;
  if (licenseExpiry !== undefined) {
    expiryDate = new Date(licenseExpiry);
    if (expiryDate <= new Date()) {
      throw new BadRequestError(
        'License expiry date must be a future date.'
      );
    }
  }

  return prisma.driver.update({
    where: { id: parsedId },
    data: {
      name: name ?? undefined,
      licenseNumber: licenseNumber ?? undefined,
      licenseExpiry: expiryDate ?? undefined,
      phone: phone ?? undefined,
      status: status ?? undefined,
    },
  });
};

/**
 * Delete a driver by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteDriver = async (id) => {
  const parsedId = parseInt(id);

  const driver = await prisma.driver.findUnique({ where: { id: parsedId } });
  if (!driver) {
    throw new NotFoundError(`Driver with ID ${id} not found.`);
  }

  return prisma.driver.delete({ where: { id: parsedId } });
};
