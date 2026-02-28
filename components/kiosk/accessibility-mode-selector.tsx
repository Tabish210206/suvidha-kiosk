'use client';

import React, { useState } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Eye, Volume2, Zap } from 'lucide-react';

const ACCESSIBILITY_MODES = [
  {
    code: 'standard',
    name: 'Standard',
    icon: Eye,
    description: 'Regular interface',
    color: 'bg-blue-500',
  },
  {
    code: 'blind',
    name: 'Visually Impaired',
    icon: Volume2,
    description: 'Voice navigation',
    color: 'bg-purple-500',
  },
  {
    code: 'deaf',
    name: 'Hearing Impaired',
    icon: Eye,
    description: 'Visual captions',
    color: 'bg-green-500',
  },
  {
    code: 'motor',
    name: 'Motor Disability',
    icon: Zap,
    description: 'Voice control',
    color: 'bg-orange-500',
  },
];

export default function AccessibilityModeSelector() {
  const { accessibilityMode, setAccessibilityMode, speak, language } = useKiosk();
  const [isOpen, setIsOpen] = useState(false);

  const currentMode = ACCESSIBILITY_MODES.find(m => m.code === accessibilityMode);
  const CurrentIcon = currentMode?.icon || Eye;

  const handleModeChange = (mode: string) => {
    setAccessibilityMode(mode as any);
    const selectedMode = ACCESSIBILITY_MODES.find(m => m.code === mode);
    const speakText = `Switched to ${selectedMode?.name} mode`;
    speak(speakText, language);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs gap-1.5 h-8 px-2"
        title="Switch accessibility mode"
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="hidden sm:inline text-xs">{currentMode?.name}</span>
      </Button>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-base font-bold">
          Accessibility Modes
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {ACCESSIBILITY_MODES.map(mode => {
          const ModeIcon = mode.icon;
          const isActive = accessibilityMode === mode.code;

          return (
            <DropdownMenuItem
              key={mode.code}
              onClick={() => handleModeChange(mode.code)}
              className={`cursor-pointer py-3 ${isActive ? 'bg-primary/10' : ''}`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`${mode.color} text-white p-2 rounded`}>
                  <ModeIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{mode.name}</p>
                  <p className="text-xs text-muted-foreground">{mode.description}</p>
                </div>
                {isActive && <span className="text-green-600 font-bold">✓</span>}
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <div className="px-2 py-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 rounded mx-2">
          💡 Select a mode optimized for your needs. Tap any mode to activate it.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
