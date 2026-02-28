'use client';

import React, { useState, useRef } from 'react';
import { Download, Printer, Mail, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import QRCode from 'qrcode.react';

interface ReceiptData {
  id: string;
  type: 'payment' | 'application' | 'complaint';
  serviceType: string;
  amount?: number;
  applicationId?: string;
  complaintId?: string;
  date: Date;
  userPhone: string;
  userName: string;
  details: Record<string, any>;
}

interface ReceiptNotificationSystemProps {
  receiptData: ReceiptData;
  onClose?: () => void;
}

export default function ReceiptNotificationSystem({ receiptData, onClose }: ReceiptNotificationSystemProps) {
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Generate QR Code data
  const qrCodeData = JSON.stringify({
    id: receiptData.id,
    type: receiptData.type,
    date: receiptData.date.toISOString(),
    amount: receiptData.amount,
  });

  // Send Notifications (Mock)
  const handleNotification = async (type: 'email' | 'sms' | 'whatsapp') => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNotifications(prev => ({
        ...prev,
        [type]: true,
      }));

      // Toast notification could be shown here
      console.log(`${type.toUpperCase()} sent to ${receiptData.userPhone}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Receipt as PDF
  const downloadReceiptPDF = async () => {
    const canvas = await html2canvas(receiptRef.current!, {
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `receipt-${receiptData.id}.pdf`;
    link.click();
  };

  // Print Receipt (Thermal Printer Support - 80mm)
  const printReceipt = () => {
    const printWindow = window.open('', '', 'width=600,height=800');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: monospace; width: 80mm; margin: 0; padding: 10mm; }
          .receipt { border: 1px solid #000; padding: 10mm; }
          .header { text-align: center; margin-bottom: 10mm; }
          .section { margin-bottom: 8mm; }
          .row { display: flex; justify-content: space-between; margin-bottom: 2mm; }
          .divider { border-top: 1px dashed #000; margin: 5mm 0; }
          .qr { text-align: center; margin: 10mm 0; }
          .footer { text-align: center; font-size: 8pt; margin-top: 10mm; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>MUNICIPAL SERVICES</h2>
            <p>Receipt</p>
          </div>
          
          <div class="section">
            <div class="row">
              <span>Receipt ID:</span>
              <strong>${receiptData.id}</strong>
            </div>
            <div class="row">
              <span>Date:</span>
              <strong>${receiptData.date.toLocaleDateString()}</strong>
            </div>
            <div class="row">
              <span>Time:</span>
              <strong>${receiptData.date.toLocaleTimeString()}</strong>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="row">
              <span>Name:</span>
              <strong>${receiptData.userName}</strong>
            </div>
            <div class="row">
              <span>Phone:</span>
              <strong>${receiptData.userPhone}</strong>
            </div>
            <div class="row">
              <span>Service:</span>
              <strong>${receiptData.serviceType}</strong>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="row">
              <span>Transaction Type:</span>
              <strong>${receiptData.type.toUpperCase()}</strong>
            </div>
            ${receiptData.amount ? `
            <div class="row">
              <span>Amount:</span>
              <strong>₹${receiptData.amount.toLocaleString('en-IN')}</strong>
            </div>
            ` : ''}
            ${receiptData.applicationId ? `
            <div class="row">
              <span>Application ID:</span>
              <strong>${receiptData.applicationId}</strong>
            </div>
            ` : ''}
            ${receiptData.complaintId ? `
            <div class="row">
              <span>Complaint ID:</span>
              <strong>${receiptData.complaintId}</strong>
            </div>
            ` : ''}
          </div>

          <div class="divider"></div>

          <div class="footer">
            <p>Thank you for using our service</p>
            <p>For support call: 1800-XXX-XXXX</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Receipt Display */}
      <Card className="p-8 bg-white border-2" ref={receiptRef}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">RECEIPT</h1>
          <p className="text-muted-foreground">Transaction Confirmation</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="border-2 border-primary p-4 rounded-lg">
            <QRCode value={qrCodeData} size={150} level="H" />
          </div>
        </div>

        {/* Receipt Details */}
        <div className="space-y-4 text-lg">
          <div className="flex justify-between pb-2 border-b">
            <span className="text-muted-foreground">Receipt ID:</span>
            <span className="font-semibold">{receiptData.id}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-muted-foreground">Date & Time:</span>
            <span className="font-semibold">{receiptData.date.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-muted-foreground">Service Type:</span>
            <span className="font-semibold capitalize">{receiptData.serviceType}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-muted-foreground">User Name:</span>
            <span className="font-semibold">{receiptData.userName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-semibold">{receiptData.userPhone}</span>
          </div>

          {/* Transaction Type Specific Info */}
          <div className="border-t-2 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold capitalize">{receiptData.type}</span>
            </div>

            {receiptData.type === 'payment' && receiptData.amount && (
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="text-2xl font-bold text-accent">₹{receiptData.amount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {receiptData.type === 'application' && receiptData.applicationId && (
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Application ID:</span>
                <span className="font-semibold text-lg">{receiptData.applicationId}</span>
              </div>
            )}

            {receiptData.type === 'complaint' && receiptData.complaintId && (
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Complaint Reference:</span>
                <span className="font-semibold text-lg">{receiptData.complaintId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent/10 rounded-lg border-2 border-accent text-center">
          <p className="text-sm font-semibold">Transaction Status: SUCCESS</p>
          <p className="text-xs text-muted-foreground mt-1">Please keep this receipt for your records</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={downloadReceiptPDF} className="kiosk-btn" variant="outline">
          <Download className="w-5 h-5 mr-2" />
          Download
        </Button>
        <Button onClick={printReceipt} className="kiosk-btn" variant="outline">
          <Printer className="w-5 h-5 mr-2" />
          Print
        </Button>
      </div>

      {/* Notification Options */}
      <Card className="p-6 bg-muted/50 border-2">
        <h3 className="font-bold text-lg mb-4">Send Receipt Via</h3>
        <div className="space-y-2">
          <Button
            onClick={() => handleNotification('email')}
            disabled={isProcessing || notifications.email}
            className="w-full justify-start"
            variant={notifications.email ? 'outline' : 'default'}
          >
            <Mail className="w-5 h-5 mr-3" />
            {notifications.email ? 'Email Sent' : 'Send via Email'}
          </Button>
          <Button
            onClick={() => handleNotification('sms')}
            disabled={isProcessing || notifications.sms}
            className="w-full justify-start"
            variant={notifications.sms ? 'outline' : 'default'}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            {notifications.sms ? 'SMS Sent' : 'Send via SMS'}
          </Button>
          <Button
            onClick={() => handleNotification('whatsapp')}
            disabled={isProcessing || notifications.whatsapp}
            className="w-full justify-start"
            variant={notifications.whatsapp ? 'outline' : 'default'}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            {notifications.whatsapp ? 'WhatsApp Sent' : 'Send via WhatsApp'}
          </Button>
        </div>
      </Card>

      {/* Close Button */}
      {onClose && (
        <Button onClick={onClose} className="w-full kiosk-btn">
          Continue
        </Button>
      )}
    </div>
  );
}
