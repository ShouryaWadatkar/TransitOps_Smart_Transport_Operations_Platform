import prisma from '../config/db.js';
import { NotFoundError } from '../utils/errorHandler.js';

/**
 * Retrieve all expenses, with optional filters
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
export const getAllExpenses = async ({ vehicleId, driverId, tripId, category } = {}) => {
  const where = {};
  if (vehicleId) where.vehicleId = parseInt(vehicleId);
  if (driverId)  where.driverId  = parseInt(driverId);
  if (tripId)    where.tripId    = parseInt(tripId);
  if (category)  where.category  = { contains: category };

  return prisma.expense.findMany({
    where,
    include: {
      vehicle: true,
      driver:  true,
      trip:    true,
    },
    orderBy: { date: 'desc' },
  });
};

/**
 * Retrieve an expense by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getExpenseById = async (id) => {
  const expense = await prisma.expense.findUnique({
    where: { id: parseInt(id) },
    include: {
      vehicle: true,
      driver:  true,
      trip:    true,
    },
  });

  if (!expense) {
    throw new NotFoundError(`Expense with ID ${id} not found.`);
  }

  return expense;
};

/**
 * Create a new expense
 * Validates optional FK references (vehicleId, driverId, tripId)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createExpense = async ({ vehicleId, driverId, tripId, category, amount, description, date }) => {
  // Validate optional FK references
  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) throw new NotFoundError(`Vehicle with ID ${vehicleId} not found.`);
  }

  if (driverId) {
    const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
    if (!driver) throw new NotFoundError(`Driver with ID ${driverId} not found.`);
  }

  if (tripId) {
    const trip = await prisma.trip.findUnique({ where: { id: parseInt(tripId) } });
    if (!trip) throw new NotFoundError(`Trip with ID ${tripId} not found.`);
  }

  return prisma.expense.create({
    data: {
      vehicleId:   vehicleId   ? parseInt(vehicleId)   : null,
      driverId:    driverId    ? parseInt(driverId)    : null,
      tripId:      tripId      ? parseInt(tripId)      : null,
      category,
      amount:      parseFloat(amount),
      description: description || null,
      date:        new Date(date),
    },
    include: {
      vehicle: true,
      driver:  true,
      trip:    true,
    },
  });
};

/**
 * Update an expense
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateExpense = async (id, { vehicleId, driverId, tripId, category, amount, description, date }) => {
  const parsedId = parseInt(id);

  const expense = await prisma.expense.findUnique({ where: { id: parsedId } });
  if (!expense) {
    throw new NotFoundError(`Expense with ID ${id} not found.`);
  }

  // Validate optional FK references if being changed
  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) throw new NotFoundError(`Vehicle with ID ${vehicleId} not found.`);
  }

  if (driverId) {
    const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
    if (!driver) throw new NotFoundError(`Driver with ID ${driverId} not found.`);
  }

  if (tripId) {
    const trip = await prisma.trip.findUnique({ where: { id: parseInt(tripId) } });
    if (!trip) throw new NotFoundError(`Trip with ID ${tripId} not found.`);
  }

  return prisma.expense.update({
    where: { id: parsedId },
    data: {
      vehicleId:   vehicleId   !== undefined ? parseInt(vehicleId)   : undefined,
      driverId:    driverId    !== undefined ? parseInt(driverId)    : undefined,
      tripId:      tripId      !== undefined ? parseInt(tripId)      : undefined,
      category:    category    ?? undefined,
      amount:      amount      !== undefined ? parseFloat(amount)    : undefined,
      description: description ?? undefined,
      date:        date        !== undefined ? new Date(date)        : undefined,
    },
    include: {
      vehicle: true,
      driver:  true,
      trip:    true,
    },
  });
};

/**
 * Delete an expense by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteExpense = async (id) => {
  const parsedId = parseInt(id);

  const expense = await prisma.expense.findUnique({ where: { id: parsedId } });
  if (!expense) {
    throw new NotFoundError(`Expense with ID ${id} not found.`);
  }

  return prisma.expense.delete({ where: { id: parsedId } });
};
