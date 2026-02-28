'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap } from 'lucide-react';

export function GasService() {
  const consumptionData = [
    { month: 'Nov', units: 25 },
    { month: 'Dec', units: 32 },
    { month: 'Jan', units: 38 },
    { month: 'Feb', units: 28 },
    { month: 'Mar', units: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Current Bill</p>
          <p className="text-3xl font-bold text-orange-600">₹520</p>
          <p className="text-xs text-green-600 mt-1">Paid</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">This Month</p>
          <p className="text-3xl font-bold text-primary">18 m³</p>
          <p className="text-xs text-muted-foreground mt-1">Within average</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Cylinder Status</p>
          <p className="text-3xl font-bold text-primary">Active</p>
          <p className="text-xs text-green-600 mt-1">Expires: 10-Apr-2024</p>
        </Card>
      </div>

      <Card className="p-6 border-2">
        <h3 className="font-bold text-lg mb-4">Gas Consumption Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={consumptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="units" fill="#f97316" name="m³" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-2 bg-orange-50">
        <h3 className="font-bold text-orange-900 mb-3">Safety Information</h3>
        <ul className="space-y-2 text-sm text-orange-800">
          <li>• Last Safety Check: 01-Mar-2024</li>
          <li>• Next Due: 01-Jun-2024</li>
          <li>• Emergency Number: 1906</li>
          <li>• Report leaks immediately</li>
        </ul>
      </Card>

      <Button className="w-full py-6 text-lg">Pay Gas Bill / Book New Cylinder</Button>
    </div>
  );
}

export function MunicipalService() {
  const taxData = [
    { category: 'Property Tax', value: 8000, fill: '#10b981' },
    { category: 'Water Charges', value: 1200, fill: '#3b82f6' },
    { category: 'Parking Fee', value: 500, fill: '#f59e0b' },
    { category: 'Street Light', value: 300, fill: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Annual Property Tax</p>
          <p className="text-3xl font-bold text-green-600">₹8,000</p>
          <p className="text-xs text-muted-foreground mt-1">Assessment Year: 2024-25</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Outstanding Balance</p>
          <p className="text-3xl font-bold text-primary">₹1,500</p>
          <p className="text-xs text-destructive mt-1">1 year pending</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Property Details</p>
          <p className="text-sm font-bold text-foreground">Ward No. 45</p>
          <p className="text-xs text-muted-foreground">Area: 450 sqft</p>
        </Card>
      </div>

      <Card className="p-6 border-2">
        <h3 className="font-bold text-lg mb-4">Tax Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={taxData} cx="50%" cy="50%" labelLine={false} label={({ category, value }) => `${category}: ₹${value}`} dataKey="value" outerRadius={80}>
              {taxData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-2 bg-red-50">
          <h3 className="font-bold text-red-900 mb-3">Pending Payments</h3>
          <ul className="space-y-2 text-sm text-red-800">
            <li>• 2023-24: ₹1,000</li>
            <li>• 2024-25 (Partial): ₹500</li>
            <li>• Late Fee: Not Applicable</li>
          </ul>
        </Card>

        <Card className="p-6 border-2 bg-green-50">
          <h3 className="font-bold text-green-900 mb-3">Exemptions & Concessions</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Senior Citizen: 25% rebate</li>
            <li>• Early Payment: 5% discount</li>
            <li>• Status: Eligible</li>
          </ul>
        </Card>
      </div>

      <Button className="w-full py-6 text-lg">Pay Municipal Tax</Button>
    </div>
  );
}
