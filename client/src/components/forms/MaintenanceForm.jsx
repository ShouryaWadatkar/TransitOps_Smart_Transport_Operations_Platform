import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function MaintenanceForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: initialData.vehicleId || '',
    serviceDate: initialData.serviceDate || '',
    description: initialData.description || '',
    cost: initialData.cost || '',
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
