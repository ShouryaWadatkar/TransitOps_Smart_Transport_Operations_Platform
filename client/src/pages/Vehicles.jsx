import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { VehicleForm } from '../components/forms/VehicleForm';
import { Search } from '../components/ui/Search';
import toast from 'react-hot-toast';

const MOCK_VEHICLES = [
  { id: 'V-001', make: 'Ford', model: 'Transit', year: 2021, licensePlate: 'ABC-123', status: 'Active' },
  { id: 'V-002', make: 'Mercedes', model: 'Sprinter', year: 2022, licensePlate: 'XYZ-987', status: 'Maintenance' },
];

export function Vehicles() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter((v) =>
    Object.values(v).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = (data) => {
    const newVehicle = { ...data, id: `V-00${vehicles.length + 1}` };
    setVehicles([...vehicles, newVehicle]);
    setIsModalOpen(false);
    toast.success('Vehicle added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Vehicle</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fleet Directory</CardTitle>
            <div className="w-72">
              <Search onSearch={setSearchTerm} placeholder="Search vehicles..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status === 'Active' ? 'success' : 'warning'}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVehicles.length === 0 && (
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vehicle">
        <VehicleForm onSubmit={handleAddVehicle} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
