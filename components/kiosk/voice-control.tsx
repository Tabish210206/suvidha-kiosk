'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { startSpeechRecognition, recognizeIntent, speakText } from '@/lib/voice-ivr';
import { useKiosk } from '@/lib/kiosk-context';

interface VoiceControlProps {
  onCommand: (intent: string) => void;
  isActive?: boolean;
}

export default function VoiceControl({ onCommand, isActive = false }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const { accessibilityMode } = useKiosk();

  const handleStartListening = async () => {
    if (isListening) return;
    
    setIsListening(true);
    setTranscript('');
    setFeedback('Listening...');

    try {
      await speakText('Please speak your command');
      const result = await startSpeechRecognition();
      setTranscript(result);

      const response = recognizeIntent(result);
      setFeedback(`Understood: ${response.action}`);
      
      await speakText(response.message);
      
      if (response.confidence > 0.7) {
        onCommand(response.action);
      }
    } catch (error) {
      setFeedback('Unable to recognize speech. Please try again.');
      console.error('[v0] Voice recognition error:', error);
    } finally {
      setIsListening(false);
    }
  };

  if (accessibilityMode !== 'motor' && accessibilityMode !== 'blind' && !isActive) {
    return null;
  }

  return (
    <Card className="p-4 border-2 bg-gradient-to-r from-accent/10 to-primary/10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1 h-6 bg-primary animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Voice Control</p>
            <p className="text-xs text-muted-foreground">
              {feedback || 'Press microphone to speak'}
            </p>
          </div>
        </div>

        {transcript && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs font-mono text-foreground">
              You said: "{transcript}"
            </p>
          </div>
        )}

        <Button
          onClick={handleStartListening}
          disabled={isListening}
          size="lg"
          className="w-full gap-2"
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Voice Command
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1 mt-4 pt-4 border-t">
          <p className="font-semibold">Voice Commands:</p>
          <ul className="space-y-1">
            <li>"Pay my electricity bill"</li>
            <li>"Check my bill"</li>
            <li>"Lodge a complaint"</li>
            <li>"Download bill"</li>
            <li>"Help"</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
