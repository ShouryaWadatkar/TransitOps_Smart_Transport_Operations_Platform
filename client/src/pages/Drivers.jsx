import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { DriverForm } from '../components/forms/DriverForm';
import { Search } from '../components/ui/Search';
import toast from 'react-hot-toast';

const MOCK_DRIVERS = [
  { id: 'D-001', name: 'John Doe', licenseNumber: 'DL123456', phone: '(555) 123-4567', status: 'Active' },
  { id: 'D-002', name: 'Jane Smith', licenseNumber: 'DL987654', phone: '(555) 987-6543', status: 'On Leave' },
];

export function Drivers() {
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter((d) =>
    Object.values(d).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDriver = (data) => {
    const newDriver = { ...data, id: `D-00${drivers.length + 1}` };
    setDrivers([...drivers, newDriver]);
    setIsModalOpen(false);
    toast.success('Driver added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Drivers</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Driver</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Driver Roster</CardTitle>
            <div className="w-72">
              <Search onSearch={setSearchTerm} placeholder="Search drivers..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.id}</TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>
                    <Badge variant={driver.status === 'Active' ? 'success' : 'secondary'}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Driver">
        <DriverForm onSubmit={handleAddDriver} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
