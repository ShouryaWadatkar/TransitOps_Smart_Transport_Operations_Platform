import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function TripWizard({ onSubmit, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    origin: '',
    destination: '',
    departureTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground">
        <span className={step === 1 ? 'text-primary' : ''}>1. Assignment</span>
        <span className={step === 2 ? 'text-primary' : ''}>2. Route</span>
        <span className={step === 3 ? 'text-primary' : ''}>3. Review</span>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle ID</label>
            <Input name="vehicleId" value={formData.vehicleId} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Driver ID</label>
            <Input name="driverId" value={formData.driverId} onChange={handleChange} required />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium">Origin</label>
            <Input name="origin" value={formData.origin} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <Input name="destination" value={formData.destination} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Departure Time</label>
            <Input name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleChange} required />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 rounded-md border p-4">
          <p><strong>Vehicle ID:</strong> {formData.vehicleId}</p>
          <p><strong>Driver ID:</strong> {formData.driverId}</p>
          <p><strong>Route:</strong> {formData.origin} to {formData.destination}</p>
          <p><strong>Departure:</strong> {new Date(formData.departureTime).toLocaleString()}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        
        {step < 3 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit">Create Trip</Button>
        )}
      </div>
    </form>
  );
}
