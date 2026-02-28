'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface Complaint {
  id: string;
  date: string;
  category: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

export default function ComplaintService() {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const complaints: Complaint[] = [
    {
      id: 'C001',
      date: '15-Feb-2024',
      category: 'High Bill',
      description: 'Bill amount higher than usual',
      status: 'resolved',
      priority: 'medium',
    },
    {
      id: 'C002',
      date: '20-Feb-2024',
      category: 'Water Leakage',
      description: 'Suspected leakage in pipeline',
      status: 'in-progress',
      priority: 'high',
    },
    {
      id: 'C003',
      date: '25-Feb-2024',
      category: 'Meter Reading',
      description: 'Request for meter re-reading',
      status: 'open',
      priority: 'low',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleSubmitComplaint = () => {
    if (category && description) {
      // In real app, this would be sent to backend
      alert('Complaint lodged successfully! Ticket ID will be sent to your phone.');
      setCategory('');
      setDescription('');
      setShowNewComplaint(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Total Complaints</p>
          <p className="text-3xl font-bold text-primary">3</p>
          <p className="text-xs text-muted-foreground mt-1">Last 12 months</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Avg. Resolution Time</p>
          <p className="text-3xl font-bold text-primary">4 Days</p>
          <p className="text-xs text-muted-foreground mt-1">2 resolved</p>
        </Card>

        <Card className="p-6 border-2">
          <p className="text-sm text-muted-foreground mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-xs text-muted-foreground mt-1">1 in-progress</p>
        </Card>
      </div>

      {!showNewComplaint && (
        <Button
          onClick={() => setShowNewComplaint(true)}
          className="w-full py-6 text-lg"
        >
          Lodge New Complaint
        </Button>
      )}

      {showNewComplaint && (
        <Card className="p-6 border-2 bg-blue-50">
          <h3 className="font-bold text-lg text-foreground mb-4">Lodge a Complaint</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border-2 rounded-lg"
              >
                <option value="">Select category</option>
                <option value="high-bill">High Bill</option>
                <option value="leakage">Water Leakage</option>
                <option value="meter-reading">Meter Reading Issue</option>
                <option value="billing-error">Billing Error</option>
                <option value="service-quality">Service Quality</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your complaint in detail"
                className="w-full p-2 border-2 rounded-lg h-24"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitComplaint}
                className="flex-1"
                disabled={!category || !description}
              >
                Submit Complaint
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewComplaint(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h3 className="font-bold text-lg text-foreground mb-4">Your Complaints</h3>
        <div className="space-y-4">
          {complaints.map(complaint => (
            <Card key={complaint.id} className="p-6 border-2">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(complaint.status)}
                  <div>
                    <p className="font-bold text-foreground">{complaint.category}</p>
                    <p className="text-xs text-muted-foreground">ID: {complaint.id}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Filed: {complaint.date}</p>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 border-2 bg-green-50">
        <h3 className="font-bold text-green-900 mb-3">Customer Support</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• Toll Free: 1800-123-4567</li>
          <li>• Email: support@suvidha.gov.in</li>
          <li>• Chat: Available 24/7</li>
          <li>• Visit: Service Centers across the city</li>
        </ul>
      </Card>
    </div>
  );
}
