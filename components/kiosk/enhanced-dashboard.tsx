'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationCloud from '@/components/kiosk/notification-cloud';
import {
  AlertCircle,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Zap,
  Droplets,
  Flame,
  BarChart3
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface OutstandingBill {
  service: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue';
  icon: any;
  color: string;
}

interface PaymentRecord {
  date: string;
  service: string;
  amount: number;
  reference: string;
  status: 'success' | 'pending';
}

const outstandingBills: OutstandingBill[] = [
  { service: 'Electricity', amount: 2450, dueDate: '2024-03-15', status: 'pending', icon: Zap, color: 'text-yellow-600' },
  { service: 'Water', amount: 850, dueDate: '2024-03-10', status: 'overdue', icon: Droplets, color: 'text-blue-600' },
  { service: 'Gas', amount: 1200, dueDate: '2024-03-20', status: 'pending', icon: Flame, color: 'text-orange-600' },
];

const paymentHistory: PaymentRecord[] = [
  { date: '2024-02-15', service: 'Electricity', amount: 2100, reference: 'TXN-001', status: 'success' },
  { date: '2024-02-10', service: 'Water', amount: 750, reference: 'TXN-002', status: 'success' },
  { date: '2024-02-01', service: 'Gas', amount: 1100, reference: 'TXN-003', status: 'success' },
];

const monthlyExpenses = [
  { month: 'Jan', electricity: 2100, water: 750, gas: 1100 },
  { month: 'Feb', electricity: 2200, water: 800, gas: 1150 },
  { month: 'Mar', electricity: 2450, water: 850, gas: 1200 },
];

export default function EnhancedDashboard() {
  const [selectedTab, setSelectedTab] = useState('expenses');

  const totalOutstanding = outstandingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const overdueBills = outstandingBills.filter((bill) => bill.status === 'overdue');

  return (
    <div className="w-full space-y-10 p-8">

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="p-6 border-2 bg-red-50">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-3xl font-bold text-red-600">Rs. {totalOutstanding}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6 border-2 bg-orange-50">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-3xl font-bold text-orange-600">
                Rs. {overdueBills.reduce((sum, bill) => sum + bill.amount, 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6 border-2 bg-green-50">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Avg</p>
              <p className="text-3xl font-bold text-green-600">Rs. 4200</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

      </div>

      {/* ===== OUTSTANDING BILLS ===== */}
      <Card className="p-6 border-2">
        <h3 className="text-xl font-bold mb-4">Outstanding Bills</h3>

        {outstandingBills.map((bill, idx) => {
          const Icon = bill.icon;
          return (
            <div key={idx} className="flex justify-between items-center p-4 mb-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${bill.color}`} />
                <div>
                  <p className="font-semibold">{bill.service}</p>
                  <p className="text-xs text-muted-foreground">Due: {bill.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold">Rs. {bill.amount}</span>
                <Button size="sm">Pay</Button>
              </div>
            </div>
          );
        })}
      </Card>

      {/* ===== ANALYTICS TABS ===== */}
      <Tabs defaultValue="expenses" className="w-full">

        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">
            <BarChart3 className="w-4 h-4 mr-2" />
            Monthly Expenses
          </TabsTrigger>

          <TabsTrigger value="history">
            <Calendar className="w-4 h-4 mr-2" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card className="p-6 border-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs. ${value}`} />
                <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="gas" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6 border-2">
            {paymentHistory.map((payment, idx) => (
              <div key={idx} className="flex justify-between border-b py-3">
                <span>{payment.date}</span>
                <span>{payment.service}</span>
                <span className="font-bold">Rs. {payment.amount}</span>
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {payment.status}
                </span>
              </div>
            ))}
          </Card>
        </TabsContent>

      </Tabs>

      {/* ===== NOTIFICATION CLOUD SECTION ===== */}
      <div className="mt-10">
        <NotificationCloud />
      </div>

    </div>
  );
}