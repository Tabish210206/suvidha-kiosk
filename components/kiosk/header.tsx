'use client';

import React, { useEffect } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import { Volume2, Eye, Hand, Ear } from 'lucide-react';

export default function Header() {
  const { user, isLoggedIn, sessionTimeLeft, logout, setAccessibilityMode, accessibilityMode, setCurrentPage } = useKiosk();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoggedIn) {
        logout();
        setCurrentPage('home');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoggedIn, logout, setCurrentPage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white border-b-4 border-primary shadow-md">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground w-14 h-14 rounded-lg flex items-center justify-center font-bold text-xl">
              S4
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">SUVIDHA 4.0</h1>
              <p className="text-sm text-muted-foreground">Smart Government Services Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {isLoggedIn && (
              <>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Session: {formatTime(sessionTimeLeft)}</p>
                </div>

                <Button
                  onClick={logout}
                  variant="outline"
                  className="px-6 py-2 border-2"
                >
                  Logout
                </Button>
              </>
            )}

            <div className="flex gap-2">
              <Button
                variant={accessibilityMode === 'standard' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setAccessibilityMode('standard')}
                title="Standard Mode"
                className="w-12 h-12"
              >
                <Eye className="w-5 h-5" />
              </Button>
              <Button
                variant={accessibilityMode === 'blind' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setAccessibilityMode('blind')}
                title="Blind Mode - Voice Assistance"
                className="w-12 h-12"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button
                variant={accessibilityMode === 'deaf' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setAccessibilityMode('deaf')}
                title="Deaf Mode - Visual Only"
                className="w-12 h-12"
              >
                <Ear className="w-5 h-5" />
              </Button>
              <Button
                variant={accessibilityMode === 'motor' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setAccessibilityMode('motor')}
                title="Motor Mode - Voice Control"
                className="w-12 h-12"
              >
                <Hand className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
