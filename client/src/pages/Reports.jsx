import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export function Reports() {
  const handleDownload = (reportName) => {
    toast.success(`Downloading ${reportName}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">Generate and download operational reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Utilization Report</CardTitle>
            <CardDescription>Monthly overview of vehicle usage and downtime.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => handleDownload('Fleet Utilization Report')}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Costs</CardTitle>
            <CardDescription>Detailed breakdown of maintenance expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => handleDownload('Maintenance Costs Report')}>
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
            <CardDescription>Metrics on driver trips, incidents, and hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => handleDownload('Driver Performance Report')}>
              <Download className="mr-2 h-4 w-4" /> Download Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
