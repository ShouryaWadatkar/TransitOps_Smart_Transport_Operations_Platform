import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { MaintenanceForm } from '../components/forms/MaintenanceForm';
import { Search } from '../components/ui/Search';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

export function Maintenance() {
  const { maintenance, addMaintenance, closeMaintenance, vehicles } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaintenance = maintenance.filter((m) =>
    Object.values(m).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaintenance = (data) => {
    addMaintenance({
      ...data,
      cost: parseFloat(data.cost)
    });
    setIsModalOpen(false);
    toast.success('Maintenance logged and vehicle set to In Shop');
  };

  const handleClose = (id) => {
    closeMaintenance(id);
    toast.success('Maintenance closed and vehicle status restored');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Maintenance Logs</h2>
        <Button onClick={() => setIsModalOpen(true)}>Log Maintenance</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service History</CardTitle>
            <div className="w-72">
              <Search onSearch={setSearchTerm} placeholder="Search records..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenance.map((record) => {
                const vehicle = vehicles.find(v => v.id === record.vehicleId);
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{vehicle?.registrationNumber || record.vehicleId}</TableCell>
                    <TableCell>{new Date(record.serviceDate).toLocaleDateString()}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>${Number(record.cost).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'Open' ? 'warning' : 'secondary'}>
                        {record.status || 'Closed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {record.status === 'Open' && (
                        <Button variant="outline" size="sm" onClick={() => handleClose(record.id)}>
                          Close
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredMaintenance.length === 0 && (
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Maintenance">
        <MaintenanceForm onSubmit={handleAddMaintenance} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
