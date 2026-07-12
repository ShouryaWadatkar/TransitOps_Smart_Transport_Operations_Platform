import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { VehicleForm } from '../components/forms/VehicleForm';
import { Search } from '../components/ui/Search';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

export function Vehicles() {
  const { vehicles, addVehicle } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter((v) =>
    Object.values(v).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = (data) => {
    if (vehicles.some(v => v.registrationNumber === data.registrationNumber)) {
      toast.error('Registration number must be unique');
      return;
    }
    addVehicle(data);
    setIsModalOpen(false);
    toast.success('Vehicle added successfully');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'On Trip': return 'primary';
      case 'In Shop': return 'warning';
      case 'Retired': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Vehicle Registry</h2>
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
                <TableHead>Reg. No</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Max Load</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.odometer} km</TableCell>
                  <TableCell>{vehicle.maxLoad} kg</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(vehicle.status)}>
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
