import prisma from '../config/db.js';
import { BadRequestError, NotFoundError } from '../utils/errorHandler.js';

// ─────────────────────────────────────────────
// Internal helper – run pre-dispatch business checks
// ─────────────────────────────────────────────

/**
 * Validate that a vehicle and driver are eligible for a trip assignment.
 * Throws BadRequestError if any rule is violated.
 * @param {Object} vehicle - Prisma vehicle record
 * @param {Object} driver  - Prisma driver record
 * @param {number} cargoWeight
 */
const assertDispatchEligibility = (vehicle, driver, cargoWeight) => {
  // Vehicle checks
  if (vehicle.status === 'RETIRED') {
    throw new BadRequestError(
      `Vehicle "${vehicle.registrationNumber}" is retired and cannot be assigned to a trip.`
    );
  }
  if (vehicle.status === 'IN_SHOP') {
    throw new BadRequestError(
      `Vehicle "${vehicle.registrationNumber}" is currently in the shop for maintenance and cannot be assigned to a trip.`
    );
  }
  if (vehicle.status === 'ON_TRIP') {
    throw new BadRequestError(
      `Vehicle "${vehicle.registrationNumber}" is already on an active trip.`
    );
  }

  // Driver checks
  if (driver.status === 'SUSPENDED') {
    throw new BadRequestError(
      `Driver "${driver.name}" is suspended and cannot be assigned to a trip.`
    );
  }
  if (driver.status === 'ON_TRIP') {
    throw new BadRequestError(
      `Driver "${driver.name}" is already on an active trip.`
    );
  }

  // License expiry check
  if (new Date(driver.licenseExpiry) <= new Date()) {
    throw new BadRequestError(
      `Driver "${driver.name}" has an expired license and cannot be assigned to a trip.`
    );
  }

  // Cargo weight vs vehicle capacity
  if (parseFloat(cargoWeight) > parseFloat(vehicle.capacity)) {
    throw new BadRequestError(
      `Cargo weight (${cargoWeight}) exceeds vehicle capacity (${vehicle.capacity}). Cannot create this trip.`
    );
  }
};

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────

/**
 * Retrieve all trips, with optional status filter
 * @param {string} [status]
 * @returns {Promise<Array>}
 */
export const getAllTrips = async ({ status } = {}) => {
  const where = status ? { status } : {};
  return prisma.trip.findMany({
    where,
    include: {
      vehicle: true,
      driver: true,
    },
    orderBy: { id: 'desc' },
  });
};

/**
 * Retrieve a trip by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getTripById = async (id) => {
  const trip = await prisma.trip.findUnique({
    where: { id: parseInt(id) },
    include: {
      vehicle: true,
      driver: true,
    },
  });

  if (!trip) {
    throw new NotFoundError(`Trip with ID ${id} not found.`);
  }

  return trip;
};

/**
 * Create a new trip (status = SCHEDULED)
 * Business rules enforced: vehicle/driver availability, capacity, license expiry
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createTrip = async ({ vehicleId, driverId, origin, destination, cargoWeight, notes }) => {
  // Fetch vehicle
  const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${vehicleId} not found.`);
  }

  // Fetch driver
  const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
  if (!driver) {
    throw new NotFoundError(`Driver with ID ${driverId} not found.`);
  }

  // Enforce all eligibility rules
  assertDispatchEligibility(vehicle, driver, cargoWeight);

  return prisma.trip.create({
    data: {
      vehicleId: parseInt(vehicleId),
      driverId: parseInt(driverId),
      origin,
      destination,
      cargoWeight: parseFloat(cargoWeight),
      notes: notes || null,
      status: 'SCHEDULED',
    },
    include: {
      vehicle: true,
      driver: true,
    },
  });
};

/**
 * Update a SCHEDULED trip's editable fields
 * Only allowed while the trip is in SCHEDULED status
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateTrip = async (id, { vehicleId, driverId, origin, destination, cargoWeight, notes }) => {
  const parsedId = parseInt(id);

  const trip = await prisma.trip.findUnique({ where: { id: parsedId } });
  if (!trip) {
    throw new NotFoundError(`Trip with ID ${id} not found.`);
  }

  if (trip.status !== 'SCHEDULED') {
    throw new BadRequestError(
      `Only SCHEDULED trips can be updated. Current status is "${trip.status}".`
    );
  }

  // Resolve vehicle and driver to validate changes
  const targetVehicleId = vehicleId ? parseInt(vehicleId) : trip.vehicleId;
  const targetDriverId  = driverId  ? parseInt(driverId)  : trip.driverId;
  const targetCargo     = cargoWeight !== undefined ? parseFloat(cargoWeight) : parseFloat(trip.cargoWeight);

  const vehicle = await prisma.vehicle.findUnique({ where: { id: targetVehicleId } });
  if (!vehicle) throw new NotFoundError(`Vehicle with ID ${targetVehicleId} not found.`);

  const driver = await prisma.driver.findUnique({ where: { id: targetDriverId } });
  if (!driver) throw new NotFoundError(`Driver with ID ${targetDriverId} not found.`);

  // Re-validate business rules
  assertDispatchEligibility(vehicle, driver, targetCargo);

  return prisma.trip.update({
    where: { id: parsedId },
    data: {
      vehicleId: targetVehicleId,
      driverId:  targetDriverId,
      origin:      origin      ?? undefined,
      destination: destination ?? undefined,
      cargoWeight: targetCargo,
      notes:       notes       ?? undefined,
    },
    include: {
      vehicle: true,
      driver: true,
    },
  });
};

/**
 * Delete a trip by ID
 * Only SCHEDULED or CANCELLED trips may be deleted
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteTrip = async (id) => {
  const parsedId = parseInt(id);

  const trip = await prisma.trip.findUnique({ where: { id: parsedId } });
  if (!trip) {
    throw new NotFoundError(`Trip with ID ${id} not found.`);
  }

  if (!['SCHEDULED', 'CANCELLED'].includes(trip.status)) {
    throw new BadRequestError(
      `Cannot delete a trip that is in "${trip.status}" status. Only SCHEDULED or CANCELLED trips can be deleted.`
    );
  }

  return prisma.trip.delete({ where: { id: parsedId } });
};

// ─────────────────────────────────────────────
// State machine actions
// ─────────────────────────────────────────────

/**
 * Dispatch a trip: SCHEDULED → DISPATCHED
 * Sets vehicle status = ON_TRIP, driver status = ON_TRIP
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const dispatchTrip = async (id) => {
  const parsedId = parseInt(id);

  const trip = await prisma.trip.findUnique({
    where: { id: parsedId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) {
    throw new NotFoundError(`Trip with ID ${id} not found.`);
  }

  if (trip.status !== 'SCHEDULED') {
    throw new BadRequestError(
      `Trip cannot be dispatched. Current status is "${trip.status}". Only SCHEDULED trips can be dispatched.`
    );
  }

  // Re-validate all business rules at dispatch time
  assertDispatchEligibility(trip.vehicle, trip.driver, trip.cargoWeight);

  // Atomic transaction: update trip + vehicle + driver
  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: parsedId },
      data: {
        status:    'DISPATCHED',
        startedAt: new Date(),
      },
      include: { vehicle: true, driver: true },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data:  { status: 'ON_TRIP' },
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data:  { status: 'ON_TRIP' },
    }),
  ]);

  return updatedTrip;
};

/**
 * Complete a trip: DISPATCHED → COMPLETED
 * Sets vehicle status = AVAILABLE, driver status = AVAILABLE
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const completeTrip = async (id) => {
  const parsedId = parseInt(id);

  const trip = await prisma.trip.findUnique({
    where: { id: parsedId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) {
    throw new NotFoundError(`Trip with ID ${id} not found.`);
  }

  if (trip.status !== 'DISPATCHED') {
    throw new BadRequestError(
      `Trip cannot be completed. Current status is "${trip.status}". Only DISPATCHED trips can be completed.`
    );
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: parsedId },
      data: {
        status:      'COMPLETED',
        completedAt: new Date(),
      },
      include: { vehicle: true, driver: true },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data:  { status: 'AVAILABLE' },
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data:  { status: 'AVAILABLE' },
    }),
  ]);

  return updatedTrip;
};

/**
 * Cancel a trip: SCHEDULED | DISPATCHED → CANCELLED
 * Sets vehicle status = AVAILABLE, driver status = AVAILABLE
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const cancelTrip = async (id) => {
  const parsedId = parseInt(id);

  const trip = await prisma.trip.findUnique({
    where: { id: parsedId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) {
    throw new NotFoundError(`Trip with ID ${id} not found.`);
  }

  if (!['SCHEDULED', 'DISPATCHED'].includes(trip.status)) {
    throw new BadRequestError(
      `Trip cannot be cancelled. Current status is "${trip.status}". Only SCHEDULED or DISPATCHED trips can be cancelled.`
    );
  }

  // Only restore vehicle/driver availability if the trip was actually dispatched
  const isDispatched = trip.status === 'DISPATCHED';

  const operations = [
    prisma.trip.update({
      where: { id: parsedId },
      data:  { status: 'CANCELLED' },
      include: { vehicle: true, driver: true },
    }),
  ];

  if (isDispatched) {
    operations.push(
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data:  { status: 'AVAILABLE' },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data:  { status: 'AVAILABLE' },
      })
    );
  }

  const [updatedTrip] = await prisma.$transaction(operations);
  return updatedTrip;
};
