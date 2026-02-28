'use client';

import React, { useState } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Shield, Eye, EyeOff, Volume2, Type, AlertTriangle, Phone, Video, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SecurityAccessibilityProps {
  showSessionMasking?: boolean;
  onEmergencyCall?: () => void;
}

export default function SecurityAccessibility({ showSessionMasking = true, onEmergencyCall }: SecurityAccessibilityProps) {
  const { sessionTimeLeft, setLanguage, language } = useKiosk();
  const [showSettings, setShowSettings] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [screenMasking, setScreenMasking] = useState(false);
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);

  const textSizeMap = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  // Privacy screen - masks sensitive content
  if (screenMasking && showSessionMasking) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center text-white space-y-6">
          <Eye className="w-16 h-16 mx-auto opacity-75" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Screen Masking Active</h2>
            <p className="text-gray-400">Your screen is private and secured</p>
          </div>
          <Button
            onClick={() => setScreenMasking(false)}
            className="bg-white text-black hover:bg-gray-200"
          >
            Unmask Screen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Emergency Help Modal */}
      {showEmergencyHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 border-4 border-destructive">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20 mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Emergency Assistance</h2>
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Toll-Free Help Line</p>
                <p className="text-2xl font-bold text-primary">1800-XXX-XXXX</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Local Support</p>
                <p className="text-lg font-bold">+91-XXX-XXX-XXXX</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  onEmergencyCall?.();
                  setShowEmergencyHelp(false);
                }}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Help
              </Button>
              <Button
                onClick={() => setShowEmergencyHelp(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Accessibility & Security Controls */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        {/* Settings Button */}
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="icon"
          className="w-12 h-12"
        >
          <Settings className="w-6 h-6" />
        </Button>

        {/* Emergency Help Button */}
        <Button
          onClick={() => setShowEmergencyHelp(true)}
          variant="destructive"
          size="icon"
          className="w-12 h-12"
          title="Emergency Help"
        >
          <AlertTriangle className="w-6 h-6" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="fixed top-20 right-4 w-96 p-6 border-2 z-40 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Security Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Security</h3>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => setScreenMasking(!screenMasking)}
                  className="w-full justify-start text-left"
                  variant={screenMasking ? 'default' : 'outline'}
                >
                  {screenMasking ? <EyeOff className="w-5 h-5 mr-3" /> : <Eye className="w-5 h-5 mr-3" />}
                  <div>
                    <p className="font-semibold">Screen Privacy Mask</p>
                    <p className="text-xs text-muted-foreground">{screenMasking ? 'On' : 'Off'}</p>
                  </div>
                </Button>
                <div className="p-3 bg-accent/10 rounded-lg text-sm">
                  <p className="font-semibold text-accent mb-1">Session Security</p>
                  <p className="text-muted-foreground">AES-256 Encrypted</p>
                  <p className="text-muted-foreground">HTTPS Protected</p>
                  <p className="text-muted-foreground">Auto-logout in {sessionTimeLeft}s</p>
                </div>
              </div>
            </div>

            {/* Accessibility Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Accessibility</h3>
              </div>
              <div className="space-y-4">
                {/* High Contrast */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted">
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => {
                        setHighContrast(e.target.checked);
                        if (e.target.checked) {
                          document.documentElement.classList.add('high-contrast');
                        } else {
                          document.documentElement.classList.remove('high-contrast');
                        }
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <div>
                      <p className="font-semibold">High Contrast Mode</p>
                      <p className="text-sm text-muted-foreground">Improves visibility</p>
                    </div>
                  </label>
                </div>

                {/* Text Size */}
                <div>
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Text Size
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {['small', 'normal', 'large', 'xlarge'].map(size => (
                      <Button
                        key={size}
                        onClick={() => {
                          setTextSize(size);
                          document.documentElement.style.fontSize = {
                            small: '14px',
                            normal: '16px',
                            large: '18px',
                            xlarge: '20px',
                          }[size] || '16px';
                        }}
                        variant={textSize === size ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs"
                      >
                        {size.charAt(0).toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <p className="font-semibold mb-2">Language</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['en', 'hi', 'ta', 'te', 'ka'].map(lang => (
                      <Button
                        key={lang}
                        onClick={() => setLanguage(lang as any)}
                        variant={language === lang ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs"
                      >
                        {lang.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Help & Support</h3>
              </div>
              <Button
                onClick={() => setShowEmergencyHelp(true)}
                variant="destructive"
                className="w-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency Assistance
              </Button>
            </div>

            {/* Close Settings */}
            <Button
              onClick={() => setShowSettings(false)}
              className="w-full"
            >
              Close Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Accessibility Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t-2 border-primary flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowEmergencyHelp(true)}
            variant="outline"
            size="sm"
            className="gap-2"
            title="Emergency Help - Press for assistance"
          >
            <AlertTriangle className="w-4 h-4" />
            Help
          </Button>
          <Button
            onClick={() => setScreenMasking(!screenMasking)}
            variant="outline"
            size="sm"
            className="gap-2"
            title="Toggle screen privacy mask"
          >
            {screenMasking ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {screenMasking ? 'Masked' : 'Privacy'}
          </Button>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="sm"
            className="gap-2"
            title="Accessibility settings"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Security Badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 rounded-lg">
            <Shield className="w-3 h-3 text-accent" />
            <span className="text-accent font-semibold">AES-256</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 rounded-lg">
            <span className="text-accent font-semibold">Government Certified</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 rounded-lg">
            <span className="text-accent font-semibold">DPDP Compliant</span>
          </div>
        </div>
      </div>
    </>
  );
}
