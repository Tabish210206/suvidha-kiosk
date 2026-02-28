'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Printer,
  Mail,
  MessageSquare,
  Copy,
  Home,
} from 'lucide-react';
import { Receipt, Transaction } from '@/lib/receipt-generator';
import QRCode from 'qrcode.react';

interface ReceiptDisplayProps {
  receipt: Receipt;
  transaction: Transaction;
  onPrint?: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
  onSMS?: () => void;
  onHome?: () => void;
  showActions?: boolean;
}

export default function ReceiptDisplay({
  receipt,
  transaction,
  onPrint,
  onDownload,
  onEmail,
  onSMS,
  onHome,
  showActions = true,
}: ReceiptDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'digital' | 'qr'>('digital');

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Success',
    },
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Pending',
    },
    failed: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Failed',
    },
  };

  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(receipt.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className={`${status.bgColor} rounded-full p-4`}>
            <StatusIcon className={`w-12 h-12 ${status.color}`} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Transaction {status.label}
        </h1>
        <p className="text-gray-600 mt-2">
          Receipt #{receipt.receiptNumber}
        </p>
      </div>

      {/* Receipt Card */}
      <div className="flex-1 overflow-auto mb-6">
        <Card className="bg-white shadow-lg border-2">
          {/* Tab Selection */}
          <div className="flex border-b-2">
            <button
              onClick={() => setActiveTab('digital')}
              className={`flex-1 py-4 px-6 font-bold text-center transition-all ${
                activeTab === 'digital'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Receipt Details
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-4 px-6 font-bold text-center transition-all ${
                activeTab === 'qr'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              QR Code
            </button>
          </div>

          {/* Digital Receipt */}
          {activeTab === 'digital' && (
            <div className="p-6 space-y-6">
              {/* Transaction ID */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  Transaction ID
                </p>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-lg font-bold text-gray-800 break-all">
                    {receipt.transactionId}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyTransactionId}
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-xs text-gray-600 font-semibold">Service</p>
                  <p className="text-lg font-bold text-gray-800">
                    {transaction.serviceType}
                  </p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <p className="text-xs text-gray-600 font-semibold">Date & Time</p>
                  <p className="text-lg font-bold text-gray-800">
                    {receipt.dateTime}
                  </p>
                </div>
              </div>

              {/* Amount (if applicable) */}
              {transaction.amount && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Amount Paid
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    ₹{transaction.amount.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Customer Details */}
              {(transaction.consumerNumber ||
                transaction.consumerName ||
                transaction.phoneNumber) && (
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-3">
                    Customer Details
                  </p>
                  {transaction.consumerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-800">
                        {transaction.consumerName}
                      </span>
                    </div>
                  )}
                  {transaction.consumerNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-mono font-semibold text-gray-800">
                        {transaction.consumerNumber}
                      </span>
                    </div>
                  )}
                  {transaction.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-800">
                        {transaction.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation Code */}
              {transaction.confirmationCode && (
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-xs text-gray-600 font-semibold mb-2">
                    Confirmation Code
                  </p>
                  <code className="font-mono text-xl font-bold text-blue-600">
                    {transaction.confirmationCode}
                  </code>
                </div>
              )}

              {/* Support Information */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="font-semibold text-blue-900 mb-2">
                  Need Help?
                </p>
                <p className="text-sm text-blue-800">
                  Customer Support: <strong>+91-9876-543-210</strong>
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Available 24/7 for assistance
                </p>
              </div>
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-sm text-gray-600 font-semibold mb-6 text-center">
                Scan this QR code to verify your transaction
              </p>

              {/* QR Code Display */}
              <div className="bg-white border-4 border-gray-300 rounded-lg p-6 mb-6">
                <QRCode
                  value={receipt.qrCode}
                  size={256}
                  level="H"
                  includeMargin={true}
                  renderAs="canvas"
                />
              </div>

              <p className="text-xs text-gray-600 text-center max-w-xs">
                Transaction ID: {receipt.transactionId.slice(0, 20)}...
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {onPrint && (
            <Button
              onClick={onPrint}
              size="lg"
              className="h-16 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
            >
              <Printer className="w-6 h-6" />
              <span className="text-sm">Print</span>
            </Button>
          )}

          {onDownload && (
            <Button
              onClick={onDownload}
              size="lg"
              className="h-16 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
            >
              <Download className="w-6 h-6" />
              <span className="text-sm">Download</span>
            </Button>
          )}

          {onEmail && (
            <Button
              onClick={onEmail}
              size="lg"
              className="h-16 flex flex-col items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
            >
              <Mail className="w-6 h-6" />
              <span className="text-sm">Email</span>
            </Button>
          )}

          {onSMS && (
            <Button
              onClick={onSMS}
              size="lg"
              className="h-16 flex flex-col items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">SMS</span>
            </Button>
          )}

          {!onHome && (
            <Button
              onClick={onHome}
              size="lg"
              className="h-16 flex flex-col items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg col-span-2 md:col-span-4"
            >
              <Home className="w-6 h-6" />
              <span className="text-sm">Back to Home</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
