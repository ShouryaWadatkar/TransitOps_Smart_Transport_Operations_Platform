import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

export function Reports() {
  const { vehicles, trips, maintenance, fuelLogs } = useData();

  const handleExportCSV = (filename, dataRows) => {
    if (dataRows.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = Object.keys(dataRows[0]).join(',');
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers + "\n" 
      + dataRows.map(e => Object.values(e).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} exported successfully`);
  };

  const generateVehicleAnalytics = () => {
    return vehicles.map(v => {
      const vTrips = trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
      const totalDistance = vTrips.reduce((acc, t) => acc + Number(t.plannedDistance), 0);
      
      const vFuel = fuelLogs.filter(f => f.vehicleId === v.id);
      const totalFuelVolume = vFuel.reduce((acc, f) => acc + Number(f.gallons), 0);
      const fuelCost = vFuel.reduce((acc, f) => acc + Number(f.totalCost), 0);
      
      const vMaint = maintenance.filter(m => m.vehicleId === v.id);
      const maintCost = vMaint.reduce((acc, m) => acc + Number(m.cost), 0);
      
      const fuelEfficiency = totalFuelVolume > 0 ? (totalDistance / totalFuelVolume).toFixed(2) : 'N/A';
      const operationalCost = fuelCost + maintCost;
      
      // Mock Revenue Calculation: $2 per km distance
      const revenue = totalDistance * 2;
      const roi = v.acquisitionCost > 0 ? (((revenue - operationalCost) / v.acquisitionCost) * 100).toFixed(2) : 0;

      return {
        registration: v.registrationNumber,
        type: v.type,
        distance: totalDistance,
        fuelVolume: totalFuelVolume,
        fuelEfficiency: fuelEfficiency,
        operationalCost: operationalCost.toFixed(2),
        roi: `${roi}%`
      };
    });
  };

  const analyticsData = generateVehicleAnalytics();

  const handleExportAnalytics = () => {
    handleExportCSV('vehicle_analytics.csv', analyticsData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
        <Button onClick={handleExportAnalytics}>
          <Download className="mr-2 h-4 w-4" /> Export Analytics CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle ROI & Operational Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Fuel Efficiency (km/L)</TableHead>
                <TableHead>Operational Cost ($)</TableHead>
                <TableHead className="text-right">ROI (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.map((data, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{data.registration}</TableCell>
                  <TableCell>{data.type}</TableCell>
                  <TableCell>{data.distance}</TableCell>
                  <TableCell>{data.fuelEfficiency}</TableCell>
                  <TableCell>${data.operationalCost}</TableCell>
                  <TableCell className="text-right">{data.roi}</TableCell>
                </TableRow>
              ))}
              {analyticsData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No data available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Download the complete financial ledger including all maintenance and fuel expenses.</p>
            <Button variant="outline" className="w-full" onClick={() => handleExportCSV('expenses.csv', [...fuelLogs, ...maintenance])}>
              <Download className="mr-2 h-4 w-4" /> Download Ledger
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Export all trip logs including origin, destination, and completion status.</p>
            <Button variant="outline" className="w-full" onClick={() => handleExportCSV('trips.csv', trips)}>
              <Download className="mr-2 h-4 w-4" /> Download Trips
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Driver Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Get a comprehensive report on driver duty hours and safety scores.</p>
            <Button variant="outline" className="w-full" onClick={() => handleExportCSV('drivers.csv', [])}>
              <Download className="mr-2 h-4 w-4" /> Download Drivers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
