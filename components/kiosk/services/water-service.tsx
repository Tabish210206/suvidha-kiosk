'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function WaterService() {
  const usageData = [
    { month: 'Nov', kl: 12 },
    { month: 'Dec', kl: 14 },
    { month: 'Jan', kl: 18 },
    { month: 'Feb', kl: 15 },
    { month: 'Mar', kl: 13 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Current Bill</p>
          <p className="text-3xl font-bold text-blue-600">₹380</p>
          <p className="text-xs text-destructive mt-1">Overdue - Pay Now</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Current Consumption</p>
          <p className="text-3xl font-bold text-primary">13 KL</p>
          <p className="text-xs text-muted-foreground mt-1">Within quota (20 KL/month)</p>
        </Card>

        <Card className="p-6 border-2 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Bill Overdue</p>
              <p className="text-xs text-red-800">Payment due 2 days ago</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-2">
        <h3 className="font-bold text-lg mb-4">Water Usage History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="kl" stroke="#0ea5e9" strokeWidth={2} name="KL" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-2 bg-green-50">
          <div className="flex items-start gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="font-semibold text-green-900">Water Quality Status</p>
          </div>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• pH Level: 7.2 (Normal)</li>
            <li>• Chlorine: 0.3 ppm</li>
            <li>• Turbidity: Low</li>
            <li>• Safe for consumption</li>
          </ul>
        </Card>

        <Card className="p-6 border-2 bg-blue-50">
          <h3 className="font-bold text-blue-900 mb-3">Water Saving Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Fix leaking taps immediately</li>
            <li>• Take shorter showers</li>
            <li>• Turn off water while brushing teeth</li>
            <li>• Use bucket for cleaning instead of running water</li>
          </ul>
        </Card>
      </div>

      <Card className="p-6 border-2">
        <h3 className="font-bold text-lg mb-4">Billing Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">First 10 KL (Basic):</span>
            <span>₹150</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next 10 KL:</span>
            <span>₹15/KL × 3 = ₹45</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fixed Charges:</span>
            <span>₹50</span>
          </div>
          <div className="flex justify-between pt-3 border-t font-bold">
            <span>Total Amount:</span>
            <span className="text-blue-600">₹380</span>
          </div>
        </div>
      </Card>

      <Button className="w-full py-6 text-lg">Pay Water Bill Now</Button>
    </div>
  );
}
