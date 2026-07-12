import React, { useState } from 'react';
import { VehicleStatusDonut } from '../components/charts/VehicleStatusDonut';
import { FleetUtilizationGauge } from '../components/charts/FleetUtilizationGauge';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Users, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Dashboard() {
  const { vehicles, trips, drivers } = useData();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');

  const filteredVehicles = vehicles.filter(v => {
    if (filterType !== 'All' && v.type !== filterType) return false;
    if (filterStatus !== 'All' && v.status !== filterStatus) return false;
    return true;
  });

  const activeVehicles = filteredVehicles.filter(v => v.status === 'On Trip').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = filteredVehicles.filter(v => v.status === 'In Shop').length;
  const totalFleet = filteredVehicles.length;
  const fleetUtilization = totalFleet > 0 ? Math.round(((activeVehicles + availableVehicles) / totalFleet) * 100) : 0;

  const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
  const pendingTrips = trips.filter(t => t.status === 'Draft').length;
  
  const driversOnDuty = drivers.filter(d => d.status === 'On Trip' || d.status === 'Available').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to TransitOps overview.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="All">All Types</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
          </select>
          <select 
            value={filterRegion} 
            onChange={e => setFilterRegion(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="All">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active / Available</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles} / {availableVehicles}</div>
            <p className="text-xs text-muted-foreground">Vehicles on trip vs ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drivers On Duty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driversOnDuty}</div>
            <p className="text-xs text-muted-foreground">Available or On Trip</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips} Active</div>
            <p className="text-xs text-muted-foreground">{pendingTrips} Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inMaintenance}</div>
            <p className="text-xs text-muted-foreground">Currently In Shop</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <VehicleStatusDonut />
        <FleetUtilizationGauge value={fleetUtilization} />
        <div className="lg:col-span-3">
          <MonthlyBarChart />
        </div>
      </div>
    </div>
  );
}
