import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

const initialVehicles = [
  { id: 'V-001', registrationNumber: 'REG123', make: 'Ford', model: 'Transit', type: 'Van', maxLoad: 1500, odometer: 12000, acquisitionCost: 45000, status: 'Available' },
  { id: 'V-002', registrationNumber: 'REG456', make: 'Mercedes', model: 'Sprinter', type: 'Van', maxLoad: 2000, odometer: 8000, acquisitionCost: 55000, status: 'In Shop' },
];

const initialDrivers = [
  { id: 'D-001', name: 'John Doe', licenseNumber: 'DL123456', licenseCategory: 'Commercial', licenseExpiry: '2028-10-15', phone: '(555) 123-4567', safetyScore: 95, status: 'Available' },
  { id: 'D-002', name: 'Jane Smith', licenseNumber: 'DL987654', licenseCategory: 'Standard', licenseExpiry: '2025-05-20', phone: '(555) 987-6543', safetyScore: 88, status: 'On Trip' },
];

const initialTrips = [
  { id: 'T-1001', vehicleId: 'V-001', driverId: 'D-001', origin: 'Station A', destination: 'Station B', cargoWeight: 500, plannedDistance: 150, status: 'Draft', departureTime: '2023-10-27T08:00:00' },
];

const initialMaintenance = [
  { id: 'M-1', vehicleId: 'V-002', serviceDate: '2023-10-20', description: 'Oil Change', cost: 150.0, status: 'Open' },
];

const initialFuel = [
  { id: 'F-1', vehicleId: 'V-001', date: '2023-10-25', gallons: 25.5, totalCost: 102.0 },
];

export function DataProvider({ children }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [trips, setTrips] = useState(initialTrips);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [fuelLogs, setFuelLogs] = useState(initialFuel);

  const addVehicle = (vehicle) => setVehicles([...vehicles, { ...vehicle, id: `V-00${vehicles.length + 1}` }]);
  const updateVehicleStatus = (id, status) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status } : v));
  };

  const addDriver = (driver) => setDrivers([...drivers, { ...driver, id: `D-00${drivers.length + 1}` }]);
  const updateDriverStatus = (id, status) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, status } : d));
  };

  const addTrip = (trip) => {
    setTrips([...trips, { ...trip, id: `T-100${trips.length + 1}`, status: 'Draft' }]);
  };
  const updateTripStatus = (id, status) => {
    setTrips(trips.map(t => t.id === id ? { ...t, status } : t));
  };

  const addMaintenance = (log) => {
    setMaintenance([...maintenance, { ...log, id: `M-${maintenance.length + 1}`, status: 'Open' }]);
    updateVehicleStatus(log.vehicleId, 'In Shop');
  };

  const closeMaintenance = (id) => {
    const record = maintenance.find(m => m.id === id);
    if (!record) return;
    
    setMaintenance(maintenance.map(m => m.id === id ? { ...m, status: 'Closed' } : m));
    
    // Restore vehicle to Available unless it is Retired
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    if (vehicle && vehicle.status !== 'Retired') {
      updateVehicleStatus(vehicle.id, 'Available');
    }
  };

  const addFuelLog = (log) => {
    setFuelLogs([...fuelLogs, { ...log, id: `F-${fuelLogs.length + 1}` }]);
  };

  return (
    <DataContext.Provider value={{
      vehicles, addVehicle, updateVehicleStatus,
      drivers, addDriver, updateDriverStatus,
      trips, addTrip, updateTripStatus,
      maintenance, addMaintenance, closeMaintenance,
      fuelLogs, addFuelLog
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
