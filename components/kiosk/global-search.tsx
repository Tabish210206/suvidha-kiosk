'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, X, Clock, AlertCircle, CheckCircle, Zap, Droplets, Flame, MapPin } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'bill' | 'complaint' | 'payment' | 'status';
  service: 'electricity' | 'water' | 'gas' | 'municipal';
  title: string;
  description: string;
  date: string;
  icon: any;
  status?: 'pending' | 'completed' | 'overdue';
  amount?: number;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'bill',
    service: 'electricity',
    title: 'Electricity Bill - March 2024',
    description: 'Current bill amount: Rs. 2,450',
    date: '2024-03-15',
    icon: Zap,
    status: 'pending',
    amount: 2450,
  },
  {
    id: '2',
    type: 'bill',
    service: 'water',
    title: 'Water Bill - March 2024',
    description: 'Current bill amount: Rs. 850',
    date: '2024-03-10',
    icon: Droplets,
    status: 'overdue',
    amount: 850,
  },
  {
    id: '3',
    type: 'payment',
    service: 'electricity',
    title: 'Payment Received',
    description: 'Your payment of Rs. 2,100 was successful',
    date: '2024-02-15',
    icon: CheckCircle,
    status: 'completed',
    amount: 2100,
  },
  {
    id: '4',
    type: 'complaint',
    service: 'water',
    title: 'Water Supply Issue - Complaint #WC-001',
    description: 'Low water pressure complaint filed',
    date: '2024-03-01',
    icon: AlertCircle,
    status: 'pending',
  },
  {
    id: '5',
    type: 'status',
    service: 'gas',
    title: 'New Gas Connection Application',
    description: 'Application ID: GAS-APP-2024-001',
    date: '2024-02-20',
    icon: Flame,
    status: 'pending',
  },
];

interface GlobalSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function GlobalSearch({ onResultSelect, isOpen = false, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(isOpen);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = mockResults.filter((result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.service.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
  }, [searchQuery]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setResults([]);
    onClose?.();
  };

  if (!searchOpen) {
    return (
      <button
        onClick={() => setSearchOpen(true)}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-96 max-w-[calc(100%-2rem)] px-4 py-3 rounded-lg bg-muted border-2 border-border hover:border-primary transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground z-30"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
        <span className="text-sm">Search bills, complaints, payments...</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-start justify-center pt-10 z-50 p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-2xl border-2">
        {/* Search Header */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b-2 border-border">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Search Bills & Services</h2>
            <button onClick={handleClose} className="ml-auto p-2 hover:bg-muted rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Search by bill, complaint, payment, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-3 hover:bg-muted rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[600px] overflow-auto p-6">
          {!searchQuery ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Start typing to search for bills, complaints, and services</p>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Try searching for:</p>
                <p>- "electricity bill" or "water bill"</p>
                <p>- "payment" or "complaint"</p>
                <p>- Service names like "gas" or "municipal"</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => {
                const Icon = result.icon;
                return (
                  <Card
                    key={result.id}
                    className="p-4 border-2 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                    onClick={() => onResultSelect?.(result)}
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{result.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                          </div>
                          {result.status && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${getStatusColor(result.status)}`}>
                              {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.date}
                          </div>
                          {result.amount && (
                            <span className="font-semibold text-primary">Rs. {result.amount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
