'use client';

import React, { useState } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, FileText, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { t } from '@/lib/translations';
import DigiLockerUpload from '../digilocker-upload';

interface UtilityServiceProps {
  serviceType: 'electricity' | 'water' | 'gas' | 'municipal';
  onBack: () => void;
}

export default function UtilityService({ serviceType, onBack }: UtilityServiceProps) {
  const { language, speak, accessibilityMode } = useKiosk();
  const [currentTab, setCurrentTab] = useState('bill-payment');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const accountInfo = {
    electricity: {
      accountNumber: 'ELEC-2024-001',
      consumerName: 'John Doe',
      address: '123 Main Street, City',
      currentBill: 2450,
      dueDate: '2024-03-15',
      lastPayment: 2100,
    },
    water: {
      accountNumber: 'WATER-2024-001',
      consumerName: 'John Doe',
      address: '123 Main Street, City',
      currentBill: 850,
      dueDate: '2024-03-15',
      lastPayment: 750,
    },
    gas: {
      accountNumber: 'GAS-2024-001',
      consumerName: 'John Doe',
      address: '123 Main Street, City',
      currentBill: 1200,
      dueDate: '2024-03-15',
      lastPayment: 1100,
    },
    municipal: {
      accountNumber: 'MUN-2024-001',
      consumerName: 'John Doe',
      address: '123 Main Street, City',
      currentBill: 5000,
      dueDate: '2024-03-15',
      lastPayment: 5000,
    },
  };

  const consumptionData = [
    { month: 'Jan', usage: 250 },
    { month: 'Feb', usage: 280 },
    { month: 'Mar', usage: 320 },
    { month: 'Apr', usage: 290 },
    { month: 'May', usage: 310 },
    { month: 'Jun', usage: 350 },
  ];

  const recentPayments = [
    { date: '2024-02-15', amount: 2100, status: 'Paid', reference: 'TXN-001' },
    { date: '2024-01-15', amount: 1950, status: 'Paid', reference: 'TXN-002' },
    { date: '2024-12-15', amount: 2200, status: 'Paid', reference: 'TXN-003' },
  ];

  const account = accountInfo[serviceType];

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    speak(`Switched to ${tab}`);
  };

  const serviceDisplayName = {
    electricity: 'Electricity Bill',
    water: 'Water Bill',
    gas: 'Gas Bill',
    municipal: 'Municipal Tax',
  }[serviceType];

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground ">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{serviceDisplayName}</h1>
            <p className="text-sm text-primary-foreground/80">{account.accountNumber}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Tabs */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="bill-payment" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
            <TabsTrigger value="bill-payment" className="text-sm">
              <Zap className="w-4 h-4 mr-2" />
              {t('bill_payment', language)}
            </TabsTrigger>
            <TabsTrigger value="recent-usage" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('recent_usage', language)}
            </TabsTrigger>
            <TabsTrigger value="new-connection" className="text-sm">
              <FileText className="w-4 h-4 mr-2" />
              {t('new_connection', language)}
            </TabsTrigger>
          </TabsList>

          {/* Bill Payment Tab */}
          <TabsContent value="bill-payment" className="space-y-4">
            <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10">
              <h3 className="text-xl font-semibold mb-4">Current Bill</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                  <p className="text-3xl font-bold text-primary">₹{account.currentBill}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="text-lg font-semibold">{account.dueDate}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-background rounded border">
                  <span>Last Payment:</span>
                  <span className="font-semibold">₹{account.lastPayment}</span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90">
                {t('pay_bill', language)}
              </Button>
            </Card>

            {/* Recent Payments */}
            <Card className="p-6 border-2">
              <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
              <div className="space-y-2">
                {recentPayments.map((payment, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                    <div>
                      <p className="font-semibold">{payment.date}</p>
                      <p className="text-sm text-muted-foreground">{payment.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{payment.amount}</p>
                      <p className="text-sm text-green-600">{payment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Recent Usage Tab */}
          <TabsContent value="recent-usage" className="space-y-4">
            <Card className="p-6 border-2">
              <h3 className="text-lg font-semibold mb-4">Usage Trend (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Usage Alert</p>
                <p className="text-amber-800 dark:text-amber-200">Your usage increased by 12% this month</p>
              </div>
            </div>
          </TabsContent>

          {/* New Connection Tab */}
          <TabsContent value="new-connection" className="space-y-4">
            <Card className="p-6 border-2 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10">
              <h3 className="text-xl font-semibold mb-4">Apply for New Connection</h3>
              <p className="text-muted-foreground mb-6">
                Fill in your details to apply for a new {serviceType} connection
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Consumer Name</label>
                  <input
                    type="text"
                    defaultValue={account.consumerName}
                    className="w-full px-4 py-2 rounded border border-input bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <textarea
                    defaultValue={account.address}
                    className="w-full px-4 py-2 rounded border border-input bg-background"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 rounded border border-input bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t('upload_document', language)}
                  </label>
                  <DigiLockerUpload
                    documentType={`new-${serviceType}-connection`}
                    onComplete={(docId, fileName) => {
                      speak(`Document ${fileName} uploaded successfully`);
                    }}
                  />
                </div>

                <Button className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700">
                  {t('submit', language)} Application
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
