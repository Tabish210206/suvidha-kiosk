'use client';

import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle, Clock } from 'lucide-react';

interface InactivityWarningProps {
  isVisible: boolean;
  timeRemaining: number;
  onContinue: () => void;
  onLogout: () => void;
  warningThreshold?: number;
}

export default function InactivityWarning({
  isVisible,
  timeRemaining,
  onContinue,
  onLogout,
  warningThreshold = 10000,
}: InactivityWarningProps) {
  const [displayTime, setDisplayTime] = useState(Math.ceil(timeRemaining / 1000));

  useEffect(() => {
    setDisplayTime(Math.ceil(timeRemaining / 1000));
  }, [timeRemaining]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  return (
    <AlertDialog open={isVisible}>
      <AlertDialogContent className="max-w-md bg-white border-4 border-warning">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-warning animate-pulse" />
            <AlertDialogTitle className="text-2xl font-bold">
              Session Expiring Soon
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-lg mt-4">
            <div className="space-y-4">
              <p className="text-base text-foreground font-semibold">
                You have been inactive. Your session will expire in:
              </p>
              
              {/* Time Display */}
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-warning/10 to-error/10 rounded-lg p-4 border-2 border-warning/30">
                <Clock className="w-6 h-6 text-warning animate-pulse" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-warning">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Minutes : Seconds
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Click "Continue" to stay logged in and keep your session active.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 mt-6">
          <AlertDialogCancel
            onClick={onContinue}
            className="flex-1 h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-2 rounded-lg"
          >
            Continue Session
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onLogout}
            className="flex-1 h-14 text-base font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 rounded-lg"
          >
            Logout Now
          </AlertDialogAction>
        </div>

        {/* Auto-logout warning */}
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-4 rounded">
          <p className="text-xs text-red-700 font-semibold">
            You will be automatically logged out if there is no activity.
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
