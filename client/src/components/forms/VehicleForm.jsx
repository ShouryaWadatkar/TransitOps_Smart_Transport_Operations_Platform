import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function VehicleForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    make: initialData.make || '',
    model: initialData.model || '',
    year: initialData.year || '',
    licensePlate: initialData.licensePlate || '',
    status: initialData.status || 'Active',
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Make</label>
          <Input name="make" value={formData.make} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Input name="model" value={formData.model} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Input name="year" type="number" value={formData.year} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">License Plate</label>
          <Input name="licensePlate" value={formData.licensePlate} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Vehicle</Button>
      </div>
    </form>
  );
}
