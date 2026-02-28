'use client';

import React, { useEffect } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { AlertCircle, LogOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface KioskResponsiveLayoutProps {
  children: React.ReactNode;
  kioskMode?: boolean;
}

export default function KioskResponsiveLayout({ children, kioskMode = false }: KioskResponsiveLayoutProps) {
  const { setKioskMode, kioskMode: currentKioskMode, sessionTimeLeft, showSessionWarning, logout, resetSessionTimer } = useKiosk();

  useEffect(() => {
    if (kioskMode) {
      setKioskMode('kiosk');
    }
  }, [kioskMode, setKioskMode]);

  // Handle fullscreen request for kiosk mode
  useEffect(() => {
    if (currentKioskMode === 'kiosk' && typeof document !== 'undefined') {
      const handleFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {
            // Fullscreen may be blocked by browser
          });
        }
      };

      const timer = setTimeout(handleFullscreen, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentKioskMode]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`kiosk-container ${currentKioskMode === 'kiosk' ? 'fullscreen' : ''}`}>
      {/* Session Warning Modal */}
      {showSessionWarning && currentKioskMode === 'kiosk' && (
        <div className="kiosk-modal">
          <Card className="kiosk-modal-content border-4 border-destructive">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <div className="text-center">
                <h2 className="kiosk-h2 text-destructive mb-2">Session Ending Soon</h2>
                <p className="kiosk-body text-muted-foreground mb-4">
                  Your session will expire in <span className="font-bold text-lg">{formatTime(sessionTimeLeft)}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click Continue to stay logged in or log out for security.
                </p>
              </div>
              <div className="flex gap-4 w-full">
                <Button
                  onClick={resetSessionTimer}
                  className="kiosk-btn flex-1"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Continue
                </Button>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="kiosk-main">
        {children}
      </div>

      {/* Session Timer Bar (Kiosk Mode Only) */}
      {currentKioskMode === 'kiosk' && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t-2 border-primary flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Session Time Remaining</span>
              <span className="text-xl font-bold text-primary">{formatTime(sessionTimeLeft)}</span>
            </div>
            <div className="w-24 h-2 bg-muted rounded-full ">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(sessionTimeLeft / 60) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={resetSessionTimer}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Extend
            </Button>
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
