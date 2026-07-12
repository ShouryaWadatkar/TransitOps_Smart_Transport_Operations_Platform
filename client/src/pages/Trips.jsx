import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { TripWizard } from '../components/forms/TripWizard';
import { Search } from '../components/ui/Search';
import toast from 'react-hot-toast';

const MOCK_TRIPS = [
  { id: 'T-1001', vehicleId: 'V-001', driverId: 'D-001', origin: 'Station A', destination: 'Station B', status: 'In Progress', departureTime: '2023-10-27T08:00:00' },
  { id: 'T-1002', vehicleId: 'V-002', driverId: 'D-002', origin: 'Station C', destination: 'Station D', status: 'Completed', departureTime: '2023-10-26T14:30:00' },
];

export function Trips() {
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter((t) =>
    Object.values(t).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTrip = (data) => {
    const newTrip = { ...data, id: `T-100${trips.length + 1}`, status: 'Scheduled' };
    setTrips([...trips, newTrip]);
    setIsModalOpen(false);
    toast.success('Trip scheduled successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Trips</h2>
        <Button onClick={() => setIsModalOpen(true)}>Schedule Trip</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trip Log</CardTitle>
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
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.id}</TableCell>
                  <TableCell>{trip.vehicleId}</TableCell>
                  <TableCell>{trip.driverId}</TableCell>
                  <TableCell>{trip.origin} &rarr; {trip.destination}</TableCell>
                  <TableCell>{new Date(trip.departureTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={trip.status === 'Completed' ? 'secondary' : trip.status === 'In Progress' ? 'primary' : 'outline'}>
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Trip">
        <TripWizard onSubmit={handleAddTrip} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
