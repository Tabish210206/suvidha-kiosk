'use client';

import React, { useState, useEffect } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import AiAvatar from './ai-avatar';
import ServiceTiles from './service-tiles';
import VoiceAssistantIVR from './voice-assistant-ivr';
import AccessibleHeader from './accessible-header';
import { Volume2, Settings } from 'lucide-react';
import { t } from '@/lib/translations';

export default function HomePage() {
  const { setCurrentPage, accessibilityMode, speak, language } = useKiosk();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const greetingMap: Record<string, string> = {
      en: 'Welcome to SUVIDHA 4.0. I am your digital assistant. How can I help you today?',
      hi: 'SUVIDHA 4.0 में आपका स्वागत है। मैं आपका डिजिटल सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
      ta: 'SUVIDHA 4.0 க்கு வரவேற்கிறோம். நான் உங்கள் டிஜிடல் உதவியாளர். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
      te: 'SUVIDHA 4.0 కు స్వాగతం. నేను మీ డిజిటల్ సహాయకుడిని. నేను మీకు ఎలా సహాయం చేయగలను?',
      ka: 'SUVIDHA 4.0 ಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    };
    const greeting = greetingMap[language] || greetingMap.en;
    setMessages([greeting]);
    speak(greeting);
  }, [speak, language]);

  const handleServiceClick = (service: string) => {
    if (service === 'bills') {
      setCurrentPage('login');
    } else {
      const message = `You selected ${service} service. Please log in to continue.`;
      setMessages(prev => [...prev, message]);
      speak(message);
      setTimeout(() => setCurrentPage('login'), 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AccessibleHeader title="SUVIDHA 4.0 - Home" showLogout={false} />
      
      <div className="flex-1 flex flex-col p-8 overflow-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-8 w-full max-w-7xl">
            {/* Left: AI Avatar */}
            <div className="flex flex-col items-center justify-center gap-6">
              <AiAvatar messages={messages} />
              {accessibilityMode === 'blind' && (
                <Button
                  onClick={() => speak(messages[messages.length - 1] || 'Welcome')}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Volume2 className="w-5 h-5" />
                  {t('voice_assistant', language)}
                </Button>
              )}
            </div>

            {/* Right: Service Tiles */}
            <div className="col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">{t('select_service', language)}</h2>
                <p className="text-lg text-muted-foreground">Select a service to get started</p>
              </div>
              <ServiceTiles onSelect={handleServiceClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant IVR */}
      <VoiceAssistantIVR isActive={true} />
    </div>
  );
}
