'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import { TrendingUp, Users, Zap, AlertTriangle, Download } from 'lucide-react';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('month');

  const kioskMetrics = [
    { metric: 'Total Transactions', value: '2,45,678', change: '+12.5%', icon: Zap },
    { metric: 'Active Users', value: '1,23,456', change: '+8.3%', icon: Users },
    { metric: 'Revenue Generated', value: '₹12.5L', change: '+15.7%', icon: TrendingUp },
    { metric: 'Avg Response Time', value: '2.3s', change: '-5.2%', icon: AlertTriangle },
  ];

  const transactionData = [
    { date: 'Mon', electricity: 1200, water: 450, gas: 320, municipal: 280 },
    { date: 'Tue', electricity: 1400, water: 520, gas: 380, municipal: 350 },
    { date: 'Wed', electricity: 1100, water: 480, gas: 300, municipal: 290 },
    { date: 'Thu', electricity: 1600, water: 620, gas: 450, municipal: 420 },
    { date: 'Fri', electricity: 1800, water: 700, gas: 520, municipal: 480 },
    { date: 'Sat', electricity: 2100, water: 850, gas: 600, municipal: 550 },
    { date: 'Sun', electricity: 1900, water: 780, gas: 550, municipal: 500 },
  ];

  const complaintHeatmap = [
    { id: 'Ward-1', complaints: 12, resolved: 8, pending: 4 },
    { id: 'Ward-2', complaints: 18, resolved: 14, pending: 4 },
    { id: 'Ward-3', complaints: 8, resolved: 7, pending: 1 },
    { id: 'Ward-4', complaints: 15, resolved: 10, pending: 5 },
    { id: 'Ward-5', complaints: 22, resolved: 16, pending: 6 },
  ];

  const serviceBreakdown = [
    { name: 'Electricity', value: 45, fill: '#eab308' },
    { name: 'Water', value: 28, fill: '#3b82f6' },
    { name: 'Gas', value: 15, fill: '#f97316' },
    { name: 'Municipal', value: 12, fill: '#10b981' },
  ];

  const roiMetrics = {
    totalInvestment: '₹50L',
    monthlyRevenue: '₹12.5L',
    paybackPeriod: '4.2 months',
    roi: '250%',
    costPerTransaction: '₹2.50',
    userSatisfaction: '94%',
  };

  const accessibilityStats = {
    blindMode: { active: 234, percentage: 8.5 },
    deafMode: { active: 156, percentage: 5.6 },
    motorMode: { active: 89, percentage: 3.2 },
    standardMode: { active: 2241, percentage: 82.7 },
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">SUVIDHA 4.0 Kiosk Network Analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {kioskMetrics.map((item, idx) => {
            const Icon = item.icon;
            const isPositive = item.change.startsWith('+');
            return (
              <Card key={idx} className="p-6 border-2">
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                  <Badge variant={isPositive ? 'default' : 'secondary'}>
                    {item.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.metric}</p>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Transaction Trends */}
          <Card className="p-6 border-2">
            <h3 className="font-bold text-lg mb-4">Weekly Transaction Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="electricity" fill="#eab308" name="Electricity" />
                <Bar dataKey="water" fill="#3b82f6" name="Water" />
                <Bar dataKey="gas" fill="#f97316" name="Gas" />
                <Bar dataKey="municipal" fill="#10b981" name="Municipal" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Service Breakdown */}
          <Card className="p-6 border-2">
            <h3 className="font-bold text-lg mb-4">Service Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={serviceBreakdown} cx="50%" cy="50%" dataKey="value" outerRadius={80} label>
                  {serviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    {item.name}
                  </span>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Complaint Heatmap */}
        <Card className="p-6 border-2 mb-8">
          <h3 className="font-bold text-lg mb-4">Complaint Distribution by Ward</h3>
          <div className="space-y-4">
            {complaintHeatmap.map((ward, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-20 font-semibold">{ward.id}</span>
                <div className="flex-1">
                  <div className="flex gap-2 h-8">
                    {Array.from({ length: ward.complaints }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded ${
                          i < ward.resolved ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        title={i < ward.resolved ? 'Resolved' : 'Pending'}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{ward.complaints}</p>
                  <p className="text-xs text-muted-foreground">{ward.resolved} resolved, {ward.pending} pending</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ROI Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-2 bg-gradient-to-br from-green-50 to-green-100 border-green-300">
            <h3 className="font-bold text-lg text-green-900 mb-4">Investment & Returns</h3>
            <div className="space-y-3 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Total Investment:</span>
                <span className="font-bold">{roiMetrics.totalInvestment}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Revenue:</span>
                <span className="font-bold text-lg text-green-600">{roiMetrics.monthlyRevenue}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-green-300">
                <span>Payback Period:</span>
                <span className="font-bold">{roiMetrics.paybackPeriod}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
            <h3 className="font-bold text-lg text-blue-900 mb-4">ROI & Efficiency</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>ROI:</span>
                <span className="font-bold text-2xl text-blue-600">{roiMetrics.roi}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per Transaction:</span>
                <span className="font-bold">{roiMetrics.costPerTransaction}</span>
              </div>
              <div className="flex justify-between">
                <span>User Satisfaction:</span>
                <span className="font-bold text-lg text-blue-600">{roiMetrics.userSatisfaction}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
            <h3 className="font-bold text-lg text-purple-900 mb-4">Accessibility Usage</h3>
            <div className="space-y-2 text-xs text-purple-800">
              {Object.entries(accessibilityStats).map(([mode, data]: [string, any]) => (
                <div key={mode} className="flex justify-between items-center">
                  <span>{mode.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right font-bold">{data.percentage}%</span>
                    <div className="w-16 h-2 bg-purple-300 rounded-full ">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Export Report */}
        <Card className="p-6 border-2 bg-muted flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-foreground">Generate Reports</h3>
            <p className="text-sm text-muted-foreground">Export analytics and performance reports</p>
          </div>
          <Button className="gap-2">
            <Download className="w-5 h-5" />
            Export PDF Report
          </Button>
        </Card>
      </div>
    </div>
  );
}
