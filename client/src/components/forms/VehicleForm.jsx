import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function VehicleForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    registrationNumber: initialData.registrationNumber || '',
    make: initialData.make || '',
    model: initialData.model || '',
    type: initialData.type || 'Van',
    maxLoad: initialData.maxLoad || '',
    odometer: initialData.odometer || '',
    acquisitionCost: initialData.acquisitionCost || '',
    status: initialData.status || 'Available',
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
          <label className="text-sm font-medium">Registration Number</label>
          <Input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Make</label>
          <Input name="make" value={formData.make} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Input name="model" value={formData.model} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Load (kg)</label>
          <Input name="maxLoad" type="number" value={formData.maxLoad} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Odometer (km)</label>
          <Input name="odometer" type="number" value={formData.odometer} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Acquisition Cost ($)</label>
          <Input name="acquisitionCost" type="number" step="0.01" value={formData.acquisitionCost} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
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
