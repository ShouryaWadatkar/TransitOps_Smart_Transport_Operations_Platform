import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { TripWizard } from '../components/forms/TripWizard';
import { Search } from '../components/ui/Search';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

export function Trips() {
  const { trips, addTrip, updateTripStatus, updateVehicleStatus, updateDriverStatus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter((t) =>
    Object.values(t).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTrip = (data) => {
    addTrip(data);
    setIsModalOpen(false);
    toast.success('Trip created as Draft');
  };

  const handleDispatch = (trip) => {
    updateTripStatus(trip.id, 'Dispatched');
    updateVehicleStatus(trip.vehicleId, 'On Trip');
    updateDriverStatus(trip.driverId, 'On Trip');
    toast.success('Trip dispatched successfully');
  };

  const handleComplete = (trip) => {
    updateTripStatus(trip.id, 'Completed');
    updateVehicleStatus(trip.vehicleId, 'Available');
    updateDriverStatus(trip.driverId, 'Available');
    toast.success('Trip marked as completed');
  };

  const handleCancel = (trip) => {
    updateTripStatus(trip.id, 'Cancelled');
    updateVehicleStatus(trip.vehicleId, 'Available');
    updateDriverStatus(trip.driverId, 'Available');
    toast.error('Trip cancelled');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Dispatched': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Trip Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create Trip</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active & Scheduled Trips</CardTitle>
            <div className="w-72">
              <Search onSearch={setSearchTerm} placeholder="Search trips..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Cargo Weight</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.id}</TableCell>
                  <TableCell>{trip.origin} → {trip.destination}</TableCell>
                  <TableCell>{trip.plannedDistance} km</TableCell>
                  <TableCell>{trip.cargoWeight} kg</TableCell>
                  <TableCell>{new Date(trip.departureTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(trip.status)}>
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {trip.status === 'Draft' && (
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDispatch(trip)}>Dispatch</Button>
                    )}
                    {trip.status === 'Dispatched' && (
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleComplete(trip)}>Complete</Button>
                    )}
                    {(trip.status === 'Draft' || trip.status === 'Dispatched') && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleCancel(trip)}>Cancel</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredTrips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Trip Wizard">
        <TripWizard onSubmit={handleAddTrip} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
