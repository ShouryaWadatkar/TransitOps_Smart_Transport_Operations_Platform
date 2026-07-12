import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { MaintenanceForm } from '../components/forms/MaintenanceForm';
import { Search } from '../components/ui/Search';
import toast from 'react-hot-toast';

const MOCK_LOGS = [
  { id: 'M-1', vehicleId: 'V-001', serviceDate: '2023-10-20', description: 'Oil Change', cost: 150.0 },
  { id: 'M-2', vehicleId: 'V-002', serviceDate: '2023-10-22', description: 'Tire Replacement', cost: 800.0 },
];

export function Maintenance() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((l) =>
    Object.values(l).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLog = (data) => {
    const newLog = { ...data, id: `M-${logs.length + 1}` };
    setLogs([...logs, newLog]);
    setIsModalOpen(false);
    toast.success('Maintenance log added');
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
              <Search onSearch={setSearchTerm} placeholder="Search logs..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.vehicleId}</TableCell>
                  <TableCell>{new Date(log.serviceDate).toLocaleDateString()}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell className="text-right">${Number(log.cost).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Maintenance">
        <MaintenanceForm onSubmit={handleAddLog} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
