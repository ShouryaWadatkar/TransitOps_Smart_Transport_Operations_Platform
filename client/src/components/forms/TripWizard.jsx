import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

export function TripWizard({ onSubmit, onCancel }) {
  const { vehicles, drivers } = useData();
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => {
    if (d.status !== 'Available') return false;
    const isExpired = new Date(d.licenseExpiry) < new Date();
    return !isExpired;
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    plannedDistance: '',
    departureTime: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (step === 2) {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      if (selectedVehicle && Number(formData.cargoWeight) > Number(selectedVehicle.maxLoad)) {
        toast.error(`Cargo exceeds max capacity of ${selectedVehicle.maxLoad} kg`);
        return;
      }
    }
    setStep(step + 1);
  };
  const handlePrev = () => setStep(step - 1);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-4">
        <span className={step >= 1 ? "text-primary" : ""}>1. Route</span>
        <span className={step >= 2 ? "text-primary" : ""}>2. Details</span>
        <span className={step >= 3 ? "text-primary" : ""}>3. Confirm</span>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origin</label>
              <Input name="origin" value={formData.origin} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input name="destination" value={formData.destination} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Planned Distance (km)</label>
              <Input name="plannedDistance" type="number" value={formData.plannedDistance} onChange={handleChange} required />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
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
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Driver</label>
              <select 
                name="driverId" 
                value={formData.driverId} 
                onChange={handleChange} 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a Driver</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.licenseCategory})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo Weight (kg)</label>
              <Input name="cargoWeight" type="number" value={formData.cargoWeight} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Departure Time</label>
              <Input name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleChange} required />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">Review Trip Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Origin:</div><div>{formData.origin}</div>
              <div className="text-muted-foreground">Destination:</div><div>{formData.destination}</div>
              <div className="text-muted-foreground">Distance:</div><div>{formData.plannedDistance} km</div>
              <div className="text-muted-foreground">Cargo:</div><div>{formData.cargoWeight} kg</div>
              <div className="text-muted-foreground">Vehicle:</div><div>{vehicles.find(v => v.id === formData.vehicleId)?.registrationNumber || 'Not selected'}</div>
              <div className="text-muted-foreground">Driver:</div><div>{drivers.find(d => d.id === formData.driverId)?.name || 'Not selected'}</div>
              <div className="text-muted-foreground">Departure:</div><div>{new Date(formData.departureTime).toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={step === 1 ? onCancel : handlePrev}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>Next Step</Button>
          ) : (
            <Button type="submit">Create Draft Trip</Button>
          )}
        </div>
      </form>
    </div>
  );
}
