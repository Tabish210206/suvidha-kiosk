'use client';

import React, { useEffect, useState } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VoiceGuideOverlayProps {
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    hotkey?: string;
  }>;
}

export default function VoiceGuideOverlay({
  title,
  description,
  actions = [],
}: VoiceGuideOverlayProps) {
  const { accessibilityMode, speak, language } = useKiosk();
  const [isReading, setIsReading] = useState(false);
  const [volume, setVolume] = useState(1);

  // Auto-announce for visually impaired users
  useEffect(() => {
    if (accessibilityMode === 'blind') {
      const fullText = `${title}. ${description}. ${
        actions.length > 0
          ? `Options available: ${actions.map(a => `${a.label}${a.hotkey ? ` press ${a.hotkey}` : ''}`).join(', ')}.`
          : ''
      }`;
      speak(fullText, language);
      setIsReading(true);
      setTimeout(() => setIsReading(false), 3000);
    }
  }, [title, description, actions, accessibilityMode, speak, language]);

  if (accessibilityMode !== 'blind') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className={`w-5 h-5 ${isReading ? 'text-green-600 animate-pulse' : 'text-blue-600'}`} />
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                {isReading ? 'Reading...' : 'Voice Guide'}
              </p>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-200 line-clamp-2">
              {title}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => speak(`${title}. ${description}`, language)}
              title="Repeat"
            >
              <Volume1 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
