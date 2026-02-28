'use client';

import React, { useEffect, useState } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface AiAvatarProps {
  messages: string[];
}

export default function AiAvatar({ messages }: AiAvatarProps) {
  const { accessibilityMode } = useKiosk();
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getAnimationStyle = () => {
    if (accessibilityMode === 'deaf') {
      return { transform: `scale(${0.95 + animationPhase * 0.02})` };
    }
    return {};
  };

  return (
    <Card className="w-48 h-64 bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary flex flex-col items-center justify-center p-6 shadow-lg">
      <div
        className="w-full h-40 flex items-center justify-center rounded-lg bg-primary/20 mb-4 transition-transform duration-300"
        style={getAnimationStyle()}
      >
        <Users className="w-16 h-16 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-foreground mb-2">Suvi</h3>
        <p className="text-xs text-muted-foreground">
          {messages.length > 0 ? messages[messages.length - 1].substring(0, 30) + '...' : 'Ready to assist'}
        </p>
      </div>
    </Card>
  );
}
