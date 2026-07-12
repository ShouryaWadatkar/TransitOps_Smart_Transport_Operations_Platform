import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ExpenseForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
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
        <label className="text-sm font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select Category...</option>
          <option value="Tolls">Tolls</option>
          <option value="Parking">Parking</option>
          <option value="Parts">Parts</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount ($)</label>
        <Input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Input name="date" type="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Log Expense</Button>
      </div>
    </form>
  );
}
