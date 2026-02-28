'use client';

import React from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import AccessibilityModeSelector from './accessibility-mode-selector';
import { Home, Settings, LogOut } from 'lucide-react';

interface AccessibleHeaderProps {
  showSettings?: boolean;
  showHome?: boolean;
  showLogout?: boolean;
  title?: string;
}

export default function AccessibleHeader({
  showSettings = true,
  showHome = true,
  showLogout = true,
  title,
}: AccessibleHeaderProps) {
  const { setCurrentPage, logout, language } = useKiosk();

  return (
    <header className="bg-white dark:bg-slate-950 border-b-2 border-primary/20 px-4 py-3 flex items-center justify-between">
      {/* Left Section: Title */}
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-lg font-bold text-primary hidden sm:block">{title}</h1>
        )}
      </div>

      {/* Right Section: Controls */}
      <div className="flex items-center gap-2">
        {/* Accessibility Mode Selector */}
        <AccessibilityModeSelector />

        {/* Home Button */}
        {showHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('home')}
            title="Go to home"
            className="h-8 w-8 p-0"
          >
            <Home className="w-4 h-4" />
          </Button>
        )}

        {/* Settings Button */}
        {showSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('settings')}
            title="Open settings"
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}

        {/* Logout Button */}
        {showLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            title="Logout"
            className="h-8 w-8 p-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
}
