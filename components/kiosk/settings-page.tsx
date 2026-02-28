'use client';

import React from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Globe, Accessibility, LogOut } from 'lucide-react';
import { t } from '@/lib/translations';

export default function SettingsPage() {
  const { setCurrentPage, language, setLanguage, accessibilityMode, setAccessibilityMode, logout } = useKiosk();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ka', name: 'ಕನ್ನಡ' },
  ];

  const accessibilityModes = [
    { 
      code: 'standard', 
      name: 'Standard', 
      description: 'Regular interface - WCAG AA compliant',
      icon: '📱'
    },
    { 
      code: 'blind', 
      name: 'Visually Impaired (Demo)', 
      description: 'Voice-based navigation, screen reader optimized, audio descriptions',
      icon: '🎧',
      demo: true
    },
    { 
      code: 'deaf', 
      name: 'Hearing Impaired (Demo)', 
      description: 'Visual captions, no sound required, maximum contrast',
      icon: '👁️',
      demo: true
    },
    { 
      code: 'motor', 
      name: 'Motor Disability (Demo)', 
      description: 'Voice control enabled, minimal clicking required, large targets',
      icon: '🎤',
      demo: true
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage('home')}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-6">
          {/* Demo Mode Info Banner */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-bold text-blue-900 dark:text-blue-100 mb-1">Accessibility Demo Mode Active</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  This kiosk is configured with enhanced accessibility features. Currently in <strong>Visually Impaired Mode</strong> 
                  for demonstration. Switch modes below to experience different accessibility features tailored for senior citizens, 
                  persons with disabilities, and hearing impaired users.
                </p>
              </div>
            </div>
          </Card>
          {/* Language Selection */}
          <Card className="p-6 border-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              {t('language', language)}
            </h2>
            <p className="text-muted-foreground mb-4">Select your preferred language</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                  }}
                  variant={language === lang.code ? 'default' : 'outline'}
                  className={`h-16 flex flex-col items-center justify-center gap-1 border-2 ${
                    language === lang.code ? 'bg-primary text-primary-foreground' : 'hover:border-primary'
                  }`}
                >
                  <span className="text-xs font-semibold">{lang.name}</span>
                  {language === lang.code && <span className="text-xs">✓ Selected</span>}
                </Button>
              ))}
            </div>
          </Card>

          {/* Accessibility Mode - WCAG Compliant */}
          <Card className="p-6 border-2">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-primary" />
              Accessibility Modes (WCAG 2.1 Compliant)
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Choose a mode optimized for your accessibility needs. All modes meet WCAG AA or AAA standards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(accessibilityModes as any).map((mode: any) => (
                <Button
                  key={mode.code}
                  onClick={() => {
                    setAccessibilityMode(mode.code as any);
                  }}
                  variant={accessibilityMode === mode.code ? 'default' : 'outline'}
                  className={`h-32 flex flex-col items-start justify-start gap-2 border-2 p-4 text-left transition-all ${
                    accessibilityMode === mode.code 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:border-primary hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{mode.icon}</span>
                        <span className="font-bold text-sm">{mode.name}</span>
                      </div>
                      {mode.demo && (
                        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-semibold mb-2">
                          DEMO
                        </span>
                      )}
                    </div>
                    {accessibilityMode === mode.code && (
                      <span className="text-lg font-bold">✓</span>
                    )}
                  </div>
                  <span className="text-xs opacity-80 leading-tight">{mode.description}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6 border-2">
            <h2 className="text-lg font-semibold mb-4">Display & Kiosk Settings</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-semibold text-sm mb-2">Kiosk Mode Features:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>✓ Fullscreen display (1920x1080 landscape / 1080x1920 portrait)</li>
                  <li>✓ Auto-logout after 60 seconds of inactivity</li>
                  <li>✓ Session warning at 10 seconds before logout</li>
                  <li>✓ Touch-optimized buttons (minimum 64x64px)</li>
                  <li>✓ On-screen keyboard for text input</li>
                  <li>✓ High contrast UI elements for visibility</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Feature Information */}
          <Card className="p-6 border-2 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-semibold mb-3">📋 Available Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Multilingual Support (English, Hindi, Tamil, Telugu, Kannada)</li>
              <li>✓ Voice-Based IVR System with Natural Language Recognition</li>
              <li>✓ Accessibility Modes for Different User Groups</li>
              <li>✓ DigiLocker Integration for Secure Document Upload</li>
              <li>✓ Real-Time Bill Payment & Status Tracking</li>
              <li>✓ New Connection Applications with Document Support</li>
              <li>✓ Complaint Lodging & Status Tracking</li>
              <li>✓ Multi-Service Integration (Electricity, Water, Gas, Municipal)</li>
            </ul>
          </Card>

          {/* Logout */}
          <Button
            onClick={() => {
              logout();
              setCurrentPage('home');
            }}
            variant="destructive"
            className="w-full h-12 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
