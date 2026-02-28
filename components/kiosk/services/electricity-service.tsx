'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, TrendingUp } from 'lucide-react';

export default function ElectricityService() {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const monthlyData = [
    { month: 'Nov', units: 125, cost: 1150 },
    { month: 'Dec', units: 132, cost: 1215 },
    { month: 'Jan', units: 145, cost: 1335 },
    { month: 'Feb', units: 138, cost: 1270 },
    { month: 'Mar', units: 120, cost: 1105 },
  ];

  const dailyData = [
    { day: 'Mon', consumption: 4.2 },
    { day: 'Tue', consumption: 4.5 },
    { day: 'Wed', consumption: 4.1 },
    { day: 'Thu', consumption: 4.8 },
    { day: 'Fri', consumption: 4.3 },
    { day: 'Sat', consumption: 5.2 },
    { day: 'Sun', consumption: 4.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Current Bill</p>
          <p className="text-3xl font-bold text-yellow-600">₹1,250</p>
          <p className="text-xs text-muted-foreground mt-1">Due: 15-Mar-2024</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">This Month Consumption</p>
          <p className="text-3xl font-bold text-primary">120 Units</p>
          <p className="text-xs text-green-600 mt-1">10% less than last month</p>
        </Card>

        <Card className="p-6 border-2 bg-yellow-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">High Usage Alert</p>
              <p className="text-xs text-yellow-800">Peak hours: 6-9 PM</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-2">
        <h3 className="font-bold text-lg mb-4">Monthly Usage Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="units" stroke="#eab308" strokeWidth={2} name="Units" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-2">
        <h3 className="font-bold text-lg mb-4">Daily Consumption (This Week)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consumption" fill="#f59e0b" name="kWh" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-2 bg-blue-50">
        <h3 className="font-bold text-lg mb-3 text-blue-900">Energy Saving Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Use LED bulbs to save 75% energy compared to incandescent</li>
          <li>• Run AC between 24-26°C for optimal comfort and efficiency</li>
          <li>• Use natural light during daytime</li>
          <li>• Unplug devices when not in use to avoid standby power consumption</li>
        </ul>
      </Card>

      <Button className="w-full py-6 text-lg">View Full Bill Details</Button>
    </div>
  );
}
