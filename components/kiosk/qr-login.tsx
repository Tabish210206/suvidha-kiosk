'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface QrLoginProps {
  onScan: (userId: string) => void;
}

export default function QrLogin({ onScan }: QrLoginProps) {
  const [scanning, setScanning] = useState(false);

  const handleSimulatedScan = () => {
    setScanning(true);
    setTimeout(() => {
      onScan('user_qr_scan_' + Date.now());
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center">
        <Card className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border-4 border-dashed border-primary mb-6">
          <QrCode className="w-24 h-24 text-primary" />
        </Card>
        <p className="text-center text-muted-foreground mb-4">
          Scan your smart card or QR code on the reader
        </p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
        <p className="text-sm font-semibold text-foreground mb-2">How to use:</p>
        <ul className="text-sm text-foreground space-y-1">
          <li>1. Insert your smart card in the card reader</li>
          <li>2. Or hold your QR code up to the scanner</li>
          <li>3. Wait for verification to complete</li>
        </ul>
      </div>

      <Button
        onClick={handleSimulatedScan}
        disabled={scanning}
        className="w-full py-6 text-lg"
      >
        {scanning ? 'Scanning...' : 'Simulate Card Scan'}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Device Status: {scanning ? 'Scanning' : 'Ready'}
      </div>
    </div>
  );
}
