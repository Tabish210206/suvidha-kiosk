'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CreditCard, TrendingUp, AlertTriangle, Plus, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ServiceAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface BillData {
  accountNumber: string;
  consumerName: string;
  address: string;
  currentBill: number;
  dueDate: string;
  lastPayment: number;
  usageData: any[];
  recentPayments: any[];
}

export interface ServiceActionsProps {
  serviceType: 'electricity' | 'water' | 'gas' | 'municipal';
  billData: BillData;
  onPaymentInitiate?: () => void;
  onComplaintFile?: () => void;
  onNewConnectionApply?: () => void;
}

const actions: ServiceAction[] = [
  { id: 'search', title: 'Search Bill', description: 'Find your bill by account number', icon: Search, color: 'text-blue-600' },
  { id: 'pay', title: 'Pay Bill', description: 'Make online payment securely', icon: CreditCard, color: 'text-green-600' },
  { id: 'usage', title: 'Usage History', description: 'View your consumption trends', icon: TrendingUp, color: 'text-purple-600' },
  { id: 'complaint', title: 'Report Fault', description: 'File a complaint or report fault', icon: AlertTriangle, color: 'text-orange-600' },
  { id: 'connection', title: 'New Connection', description: 'Apply for new service connection', icon: Plus, color: 'text-teal-600' },
];

export function SearchBillAction({ billData }: { billData: BillData }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4">
      <Card className="p-6 border-2">
        <h3 className="text-lg font-semibold mb-4">Search Your Bill</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter account number or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded border border-input bg-background"
          />
          <Button className="px-6 h-12 bg-primary hover:bg-primary/90">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {searchQuery && (
        <Card className="p-6 border-2 border-green-500 bg-green-50 dark:bg-green-900/10">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100">Bill Found</h4>
              <p className="text-sm text-green-800 dark:text-green-200">Account: {billData.accountNumber}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-primary">₹{billData.currentBill}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Due Date</p>
              <p className="text-lg font-semibold">{billData.dueDate}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export function PayBillAction({ billData, onPaymentInitiate }: { billData: BillData; onPaymentInitiate?: () => void }) {
  return (
    <Card className="p-6 border-2 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10">
      <h3 className="text-lg font-semibold mb-4">Current Bill Payment</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Amount Due</p>
          <p className="text-3xl font-bold text-primary">₹{billData.currentBill}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Due Date</p>
          <p className="text-lg font-semibold">{billData.dueDate}</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-background rounded border">
          <span className="text-sm">Last Payment</span>
          <span className="font-semibold">₹{billData.lastPayment}</span>
        </div>
      </div>
      <Button
        onClick={onPaymentInitiate}
        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Proceed to Payment
      </Button>
    </Card>
  );
}

export function UsageHistoryAction({ billData }: { billData: BillData }) {
  return (
    <div className="space-y-4">
      <Card className="p-6 border-2">
        <h3 className="text-lg font-semibold mb-4">Usage Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={billData.usageData}>
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
          <BarChart data={billData.usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-100">Usage Alert</p>
          <p className="text-amber-800 dark:text-amber-200">Your usage increased by 12% this month compared to last month</p>
        </div>
      </div>
    </div>
  );
}

export function ReportFaultAction({ billData, onComplaintFile }: { billData: BillData; onComplaintFile?: () => void }) {
  const [complaintType, setComplaintType] = useState('billing');

  return (
    <Card className="p-6 border-2 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10">
      <h3 className="text-lg font-semibold mb-4">Report a Fault or Complaint</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Complaint Type</label>
          <select
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            className="w-full px-4 py-2 rounded border border-input bg-background"
          >
            <option value="billing">Billing Issue</option>
            <option value="meter">Meter Issue</option>
            <option value="supply">Supply Issue</option>
            <option value="service">Service Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            placeholder="Describe your issue in detail"
            className="w-full px-4 py-2 rounded border border-input bg-background"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Preferred Contact Method</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="contact" defaultChecked />
              <span className="text-sm">Phone</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contact" />
              <span className="text-sm">Email</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contact" />
              <span className="text-sm">SMS</span>
            </label>
          </div>
        </div>

        <Button
          onClick={onComplaintFile}
          className="w-full h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          File Complaint
        </Button>
      </div>
    </Card>
  );
}

export function NewConnectionAction({ billData, onNewConnectionApply }: { billData: BillData; onNewConnectionApply?: () => void }) {
  return (
    <Card className="p-6 border-2 bg-gradient-to-br from-teal-50 to-teal-50/50 dark:from-teal-900/20 dark:to-teal-900/10">
      <h3 className="text-lg font-semibold mb-4">Apply for New Connection</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Consumer Name</label>
          <input
            type="text"
            defaultValue={billData.consumerName}
            className="w-full px-4 py-2 rounded border border-input bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Address</label>
          <textarea
            defaultValue={billData.address}
            className="w-full px-4 py-2 rounded border border-input bg-background"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="10-digit phone number"
            className="w-full px-4 py-2 rounded border border-input bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Connection Type</label>
          <select className="w-full px-4 py-2 rounded border border-input bg-background">
            <option>Domestic</option>
            <option>Commercial</option>
            <option>Industrial</option>
          </select>
        </div>

        <Button
          onClick={onNewConnectionApply}
          className="w-full h-12 text-lg font-semibold bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Submit Application
        </Button>
      </div>
    </Card>
  );
}

export default function ServiceActions({
  serviceType,
  billData,
  onPaymentInitiate,
  onComplaintFile,
  onNewConnectionApply,
}: ServiceActionsProps) {
  const [activeAction, setActiveAction] = useState('overview');

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" onValueChange={setActiveAction} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-muted">
          {actions.map((action) => (
            <TabsTrigger key={action.id} value={action.id} className="text-xs">
              <action.icon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{action.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action) => (
              <Card
                key={action.id}
                className="p-4 border-2 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveAction(action.id)}
              >
                <div className="flex items-start gap-3">
                  <action.icon className={`w-8 h-8 ${action.color} flex-shrink-0`} />
                  <div>
                    <h4 className="font-semibold">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <SearchBillAction billData={billData} />
        </TabsContent>

        <TabsContent value="pay">
          <PayBillAction billData={billData} onPaymentInitiate={onPaymentInitiate} />
        </TabsContent>

        <TabsContent value="usage">
          <UsageHistoryAction billData={billData} />
        </TabsContent>

        <TabsContent value="complaint">
          <ReportFaultAction billData={billData} onComplaintFile={onComplaintFile} />
        </TabsContent>

        <TabsContent value="connection">
          <NewConnectionAction billData={billData} onNewConnectionApply={onNewConnectionApply} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
