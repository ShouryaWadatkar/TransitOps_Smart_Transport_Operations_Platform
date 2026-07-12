import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';

export function MaintenanceForm({ onSubmit, onCancel }) {
  const { vehicles } = useData();
  const availableVehicles = vehicles.filter(v => v.status !== 'Retired');

  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceDate: '',
    description: '',
    cost: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehicle</label>
        <select 
          name="vehicleId" 
          value={formData.vehicleId} 
          onChange={handleChange} 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select a Vehicle</option>
          {availableVehicles.map(v => (
            <option key={v.id} value={v.id}>{v.registrationNumber} - {v.make} {v.model}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">Adding maintenance will set the vehicle to "In Shop" automatically.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Service Date</label>
        <Input name="serviceDate" type="date" value={formData.serviceDate} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Cost ($)</label>
        <Input name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} required />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Log Maintenance</Button>
      </div>
    </form>
  );
}
