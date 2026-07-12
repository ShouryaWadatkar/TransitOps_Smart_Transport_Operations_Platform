import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { FuelForm } from '../components/forms/FuelForm';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import toast from 'react-hot-toast';

const MOCK_FUEL = [
  { id: 'F-1', vehicleId: 'V-001', date: '2023-10-25', gallons: 25.5, totalCost: 102.0 },
];

const MOCK_EXPENSES = [
  { id: 'E-1', category: 'Tolls', amount: 15.0, date: '2023-10-25', description: 'Bridge Toll' },
];

export function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState(MOCK_FUEL);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const handleAddFuel = (data) => {
    setFuelLogs([...fuelLogs, { ...data, id: `F-${fuelLogs.length + 1}` }]);
    setIsFuelModalOpen(false);
    toast.success('Fuel log added');
  };

  const handleAddExpense = (data) => {
    setExpenses([...expenses, { ...data, id: `E-${expenses.length + 1}` }]);
    setIsExpenseModalOpen(false);
    toast.success('Expense added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Fuel & Expenses</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsFuelModalOpen(true)}>Log Fuel</Button>
          <Button onClick={() => setIsExpenseModalOpen(true)}>Log Expense</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fuel Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.vehicleId}</TableCell>
                    <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${Number(log.totalCost).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${Number(expense.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} title="Log Fuel">
        <FuelForm onSubmit={handleAddFuel} onCancel={() => setIsFuelModalOpen(false)} />
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Log Expense">
        <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setIsExpenseModalOpen(false)} />
      </Modal>
    </div>
  );
}
