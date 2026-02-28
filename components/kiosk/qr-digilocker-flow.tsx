'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, AlertCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import QRCode from 'qrcode.react';

interface QRDigiLockerFlowProps {
  serviceType: string;
  onFormFill?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface DigiLockerData {
  aadhaar: string;
  name: string;
  address: string;
  dob: string;
  email: string;
  phone: string;
  documents: {
    aadhaar: boolean;
    addressProof: boolean;
    propertyOwnership: boolean;
    incomeProof: boolean;
  };
}

export default function QRDigiLockerFlow({ serviceType, onFormFill, onComplete }: QRDigiLockerFlowProps) {
  const [flowStep, setFlowStep] = useState<'qr' | 'waiting' | 'syncing' | 'prefilled' | 'complete'>('qr');
  const [qrSessionId, setQrSessionId] = useState(`DL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [pollProgress, setPollProgress] = useState(0);
  const [digiLockerData, setDigiLockerData] = useState<DigiLockerData | null>(null);
  const [mockSyncTimer, setMockSyncTimer] = useState<number | null>(null);

  // Generate QR Code with session ID and metadata
  const qrData = JSON.stringify({
    sessionId: qrSessionId,
    serviceType: serviceType,
    timestamp: Date.now(),
    action: 'digilocker-auth',
    redirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/sync-qr`,
  });

  // Simulate polling for DigiLocker auth completion
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (flowStep === 'waiting') {
      // Start polling after 2 seconds to simulate user scanning QR
      const startPoll = setTimeout(() => {
        setFlowStep('syncing');
        let progress = 0;

        pollInterval = setInterval(() => {
          progress += Math.random() * 25;
          if (progress >= 100) {
            clearInterval(pollInterval);
            setPollProgress(100);

            // Simulate data fetch
            setTimeout(() => {
              const mockData: DigiLockerData = {
                aadhaar: 'XXXX XXXX XXXX 1234',
                name: 'Rajesh Kumar',
                address: '123 Municipal Street, City',
                dob: '1990-05-15',
                email: 'rajesh.kumar@email.com',
                phone: '9876543210',
                documents: {
                  aadhaar: true,
                  addressProof: true,
                  propertyOwnership: true,
                  incomeProof: false,
                },
              };
              setDigiLockerData(mockData);
              setFlowStep('prefilled');
            }, 1000);
          } else {
            setPollProgress(progress);
          }
        }, 500);
      }, 2000);

      return () => {
        clearTimeout(startPoll);
        if (pollInterval) clearInterval(pollInterval);
      };
    }
  }, [flowStep]);

  // Handle form prefill
  const handleAcceptData = () => {
    if (digiLockerData) {
      onFormFill?.(digiLockerData);
      setFlowStep('complete');
    }
  };

  // Rescan QR
  const handleRescan = () => {
    setFlowStep('qr');
    setPollProgress(0);
    setQrSessionId(`DL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  };

  return (
    <Card className="w-full p-8 border-2">
      {flowStep === 'qr' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20">
            <QrCode className="w-12 h-12 text-primary" />
          </div>

          <div className="text-center">
            <h2 className="kiosk-h2 mb-2">Quick DigiLocker Auth</h2>
            <p className="kiosk-body text-muted-foreground">
              Scan this QR code with your phone to securely authenticate and auto-fill your details
            </p>
          </div>

          <div className="border-4 border-primary p-6 rounded-lg bg-white">
            <QRCode value={qrData} size={250} level="H" quietZone={20} />
          </div>

          <div className="flex items-center gap-3 w-full p-4 bg-accent/10 border-2 border-accent rounded-lg">
            <Smartphone className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Session ID: {qrSessionId.substring(0, 20)}...</p>
              <p className="text-xs text-muted-foreground">Valid for 5 minutes</p>
            </div>
          </div>

          <Button
            onClick={() => setFlowStep('waiting')}
            className="w-full kiosk-btn"
          >
            Scanned QR Code
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Doesn't have DigiLocker? <a href="#" className="text-primary font-semibold underline">Fill manually</a>
          </p>
        </div>
      )}

      {flowStep === 'waiting' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 animate-pulse">
            <Clock className="w-12 h-12 text-secondary" />
          </div>

          <div className="text-center">
            <h2 className="kiosk-h2 mb-2">Waiting for Authentication</h2>
            <p className="kiosk-body text-muted-foreground">
              Complete the DigiLocker authentication on your phone...
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold">Initializing...</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full ">
              <div className="h-full bg-secondary transition-all" style={{ width: '30%' }} />
            </div>
          </div>

          <Button onClick={handleRescan} variant="outline" className="w-full">
            Show QR Code Again
          </Button>
        </div>
      )}

      {flowStep === 'syncing' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20">
            <QrCode className="w-12 h-12 text-primary animate-spin" />
          </div>

          <div className="text-center">
            <h2 className="kiosk-h2 mb-2">Syncing Your Data</h2>
            <p className="kiosk-body text-muted-foreground">
              Fetching your DigiLocker documents and information...
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sync Progress</span>
              <span className="font-semibold">{Math.round(pollProgress)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full ">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${pollProgress}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            This usually takes 10-20 seconds
          </div>
        </div>
      )}

      {flowStep === 'prefilled' && digiLockerData && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="kiosk-h2">Data Retrieved Successfully</h2>
              <p className="text-sm text-muted-foreground">Your DigiLocker information is ready to use</p>
            </div>
          </div>

          <Card className="p-6 bg-muted/50 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold text-lg">{digiLockerData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aadhaar (Masked)</p>
              <p className="font-semibold text-lg font-mono">{digiLockerData.aadhaar}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-semibold">{digiLockerData.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{digiLockerData.email}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">Available Documents</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(digiLockerData.documents).map(([doc, available]) => (
                  <div key={doc} className={`p-2 rounded-lg text-sm ${available ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                    {available ? '✓' : '○'} {doc.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleAcceptData}
              className="flex-1 kiosk-btn"
            >
              Use This Information
            </Button>
            <Button
              onClick={handleRescan}
              variant="outline"
              className="flex-1"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {flowStep === 'complete' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/20">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>

          <div className="text-center">
            <h2 className="kiosk-h2 mb-2">Form Auto-Filled</h2>
            <p className="kiosk-body text-muted-foreground">
              Your details have been pre-filled. Review and submit the form.
            </p>
          </div>

          <div className="w-full space-y-2 p-4 bg-accent/10 rounded-lg">
            <p className="text-sm font-semibold text-accent">Security Status</p>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>DigiLocker verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Government Certified</span>
            </div>
          </div>

          <Button
            onClick={() => onComplete?.(digiLockerData)}
            className="w-full kiosk-btn"
          >
            Continue to Form
          </Button>
        </div>
      )}
    </Card>
  );
}
