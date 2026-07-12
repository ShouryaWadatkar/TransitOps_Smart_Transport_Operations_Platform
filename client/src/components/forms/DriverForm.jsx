import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function DriverForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    licenseNumber: initialData.licenseNumber || '',
    phone: initialData.phone || '',
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
          <label className="text-sm font-medium">Phone Number</label>
          <Input name="phone" value={formData.phone} onChange={handleChange} required />
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
