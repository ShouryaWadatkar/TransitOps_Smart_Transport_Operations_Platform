import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function DriverForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    licenseNumber: initialData.licenseNumber || '',
    licenseCategory: initialData.licenseCategory || 'Standard',
    licenseExpiry: initialData.licenseExpiry || '',
    phone: initialData.phone || '',
    safetyScore: initialData.safetyScore || 100,
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
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">License Number</label>
          <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">License Category</label>
          <select 
            name="licenseCategory" 
            value={formData.licenseCategory} 
            onChange={handleChange} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="Standard">Standard</option>
            <option value="Commercial">Commercial</option>
            <option value="Heavy">Heavy Duty</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">License Expiry</label>
          <Input name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Safety Score</label>
          <Input name="safetyScore" type="number" min="0" max="100" value={formData.safetyScore} onChange={handleChange} required />
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
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Driver</Button>
      </div>
    </form>
  );
}
