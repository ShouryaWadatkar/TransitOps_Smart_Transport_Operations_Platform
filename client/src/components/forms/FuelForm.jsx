import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function FuelForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: '',
    gallons: '',
    totalCost: '',
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
        <label className="text-sm font-medium">Vehicle ID</label>
        <Input name="vehicleId" value={formData.vehicleId} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Input name="date" type="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Gallons/Liters</label>
          <Input name="gallons" type="number" step="0.1" value={formData.gallons} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Total Cost ($)</label>
          <Input name="totalCost" type="number" step="0.01" value={formData.totalCost} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Log Fuel</Button>
      </div>
    </form>
  );
}
