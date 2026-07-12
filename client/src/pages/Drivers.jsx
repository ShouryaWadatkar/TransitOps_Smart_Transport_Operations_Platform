import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { DriverForm } from '../components/forms/DriverForm';
import { Search } from '../components/ui/Search';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

export function Drivers() {
  const { drivers, addDriver } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter((d) =>
    Object.values(d).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDriver = (data) => {
    addDriver(data);
    setIsModalOpen(false);
    toast.success('Driver added successfully');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'On Trip': return 'primary';
      case 'Off Duty': return 'secondary';
      case 'Suspended': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Driver Management</h2>
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
                <TableHead>Name</TableHead>
                <TableHead>License No.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.licenseCategory}</TableCell>
                  <TableCell>{new Date(driver.licenseExpiry).toLocaleDateString()}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.safetyScore}/100</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(driver.status)}>
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
