'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { getSessionManager } from '@/lib/kiosk-session';
import {
  detectDisplayConfig,
  requestFullscreen,
  isFullscreenEnabled,
  lockOrientation,
} from '@/lib/kiosk-display';
import InactivityWarning from './inactivity-warning';

interface KioskModeControllerProps {
  children: React.ReactNode;
  enableKioskMode?: boolean;
  autoFullscreen?: boolean;
  inactivityTimeout?: number;
  warningThreshold?: number;
}

export default function KioskModeController({
  children,
  enableKioskMode = true,
  autoFullscreen = true,
  inactivityTimeout = 60000, // 60 seconds
  warningThreshold = 10000, // 10 seconds
}: KioskModeControllerProps) {
  const { isLoggedIn, logout, resetSessionTimer } = useKiosk();
  const [sessionManager] = useState(() =>
    getSessionManager(inactivityTimeout, warningThreshold)
  );
  const [displayConfig] = useState(() => detectDisplayConfig());
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(inactivityTimeout);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  // Initialize kiosk mode
  useEffect(() => {
    if (!enableKioskMode || !isLoggedIn) return;

    // Start session
    sessionManager.startSession();

    // Setup inactivity listeners
    sessionManager.on('inactivity-warning', (data: any) => {
      setShowInactivityWarning(true);
      setRemainingTime(data.timeRemaining || warningThreshold);
    });

    sessionManager.on('logout', (data: any) => {
      if (data.reason === 'inactivity') {
        logout();
        exitKioskMode();
      }
    });

    // Request fullscreen if enabled
    if (autoFullscreen && isFullscreenEnabled()) {
      const element = document.documentElement;
      requestFullscreen(element).catch(() => {
        console.warn('Fullscreen request denied');
      });
      setIsFullscreenActive(true);
    }

    // Lock orientation to landscape (if available)
    lockOrientation('landscape').catch(() => {
      console.warn('Screen orientation lock not supported');
    });

    // Prevent common escape sequences
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F11 (fullscreen toggle)
      if (e.key === 'F11') {
        e.preventDefault();
      }

      // Prevent Alt+Tab (if possible)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
      }

      // Prevent browser developer tools
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === 'I' || e.key === 'J' || e.key === 'C')
      ) {
        e.preventDefault();
      }

      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [enableKioskMode, isLoggedIn, sessionManager, autoFullscreen, logout, warningThreshold]);

  // Update remaining time display
  useEffect(() => {
    if (!showInactivityWarning) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = Math.max(0, prev - 1000);
        if (newTime <= 0) {
          clearInterval(interval);
          logout();
          exitKioskMode();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showInactivityWarning, logout]);

  // Handle session continuation
  const handleContinueSession = useCallback(() => {
    setShowInactivityWarning(false);
    sessionManager.recordActivity('touch');
    resetSessionTimer();
  }, [sessionManager, resetSessionTimer]);

  // Handle logout
  const handleLogout = useCallback(() => {
    setShowInactivityWarning(false);
    logout();
    exitKioskMode();
  }, [logout]);

  // Exit kiosk mode
  const exitKioskMode = useCallback(async () => {
    if (isFullscreenActive) {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.warn('Failed to exit fullscreen:', error);
      }
      setIsFullscreenActive(false);
    }
  }, [isFullscreenActive]);

  // Apply display configuration CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'kiosk-display-config';
    style.textContent = `
      /* Kiosk Display Configuration */
      html {
        width: ${displayConfig.width}px;
        height: ${displayConfig.height}px;
        ;
      }

      body {
        width: 100vw;
        height: 100vh;
        ;
        margin: 0;
        padding: 0;
      }

      /* Hide browser UI elements */
      @media (display-mode: fullscreen) {
        html {
          width: 100vw;
          height: 100vh;
        }
      }

      /* Prevent scrolling */
      html, body {
        ;
      }

      /* Responsive layout */
      ${
        displayConfig.orientation === 'portrait'
          ? `
        @media (max-aspect-ratio: 1/1) {
          body {
            flex-direction: column;
          }
        }
        `
          : ''
      }

      /* Touch optimizations */
      @media (hover: none) {
        button:hover {
          background-color: inherit;
        }
        
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
        }
      }

      /* Prevent zoom on touch */
      input, select, textarea {
        font-size: 16px;
      }

      /* Hide scrollbars */
      ::-webkit-scrollbar {
        display: none;
      }
    `;

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('kiosk-display-config');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [displayConfig]);

  return (
    <>
      {children}

      {/* Inactivity Warning */}
      {enableKioskMode && isLoggedIn && (
        <InactivityWarning
          isVisible={showInactivityWarning}
          timeRemaining={remainingTime}
          onContinue={handleContinueSession}
          onLogout={handleLogout}
          warningThreshold={warningThreshold}
        />
      )}

      {/* Kiosk Mode Indicator (for development) */}
      {enableKioskMode && isLoggedIn && (
        <div
          className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-50 pointer-events-none z-40"
          style={{ fontSize: '10px' }}
        >
          <div>Kiosk Mode Active</div>
          <div>
            {displayConfig.width}x{displayConfig.height}
          </div>
          <div>{displayConfig.orientation}</div>
        </div>
      )}
    </>
  );
}
