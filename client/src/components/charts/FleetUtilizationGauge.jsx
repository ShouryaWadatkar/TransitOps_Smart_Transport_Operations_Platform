import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const data = [
  {
    name: 'Utilization',
    value: 78,
    fill: 'hsl(var(--primary))',
  },
];

export function FleetUtilizationGauge({ value = 78 }) {
  const chartData = [
    {
      name: 'Utilization',
      value: value,
      fill: 'hsl(var(--primary))',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Utilization</CardTitle>
        <CardDescription>Current active vs total fleet</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="h-[250px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={20}
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                minAngle={15}
                background={{ fill: 'hsl(var(--secondary))' }}
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center text-center mt-8">
            <span className="text-4xl font-bold text-primary">{chartData[0].value}%</span>
            <span className="text-sm text-muted-foreground">Optimal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
