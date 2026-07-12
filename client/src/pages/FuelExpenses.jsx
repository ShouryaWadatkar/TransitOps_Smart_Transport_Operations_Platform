import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { FuelForm } from '../components/forms/FuelForm';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

export function FuelExpenses() {
  const { fuelLogs, addFuelLog, maintenance, vehicles } = useData();
  const [expenses, setExpenses] = useState([]); // Other expenses (tolls, etc.)
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const handleAddFuel = (data) => {
    addFuelLog({
      ...data,
      totalCost: parseFloat(data.totalCost),
      gallons: parseFloat(data.gallons)
    });
    setIsFuelModalOpen(false);
    toast.success('Fuel log added');
  };

  const handleAddExpense = (data) => {
    setExpenses([...expenses, { ...data, id: `E-${expenses.length + 1}`, amount: parseFloat(data.amount) }]);
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
                  <TableHead>Volume</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelLogs.map((log) => {
                  const vehicle = vehicles.find(v => v.id === log.vehicleId);
                  return (
                    <TableRow key={log.id}>
                      <TableCell>{vehicle?.registrationNumber || log.vehicleId}</TableCell>
                      <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                      <TableCell>{log.gallons}</TableCell>
                      <TableCell className="text-right">${Number(log.totalCost).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
                {fuelLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">No results.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Expenses & Maintenance Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category / Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenance.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>Maintenance</TableCell>
                    <TableCell>{new Date(m.serviceDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${Number(m.cost).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${Number(expense.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {maintenance.length === 0 && expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No results.</TableCell>
                  </TableRow>
                )}
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
