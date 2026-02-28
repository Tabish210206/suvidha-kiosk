'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, HelpCircle, X } from 'lucide-react';
import { recognizeVoiceIntent, getVoiceResponse, getHelpText, VoiceIntent } from '@/lib/voice-ivr-multilingual';
import { t } from '@/lib/translations';

interface VoiceAssistantIVRProps {
  onCommand?: (intent: VoiceIntent) => void;
  isActive?: boolean;
}

export default function VoiceAssistantIVR({ onCommand, isActive = false }: VoiceAssistantIVRProps) {
  const { language, speak, setCurrentPage } = useKiosk();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognizedIntent, setRecognizedIntent] = useState<VoiceIntent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        const langMap: Record<string, string> = {
          'en': 'en-IN',
          'hi': 'hi-IN',
          'ta': 'ta-IN',
          'te': 'te-IN',
          'ka': 'ka-IN',
        };

        recognitionRef.current.lang = langMap[language] || 'en-IN';

        recognitionRef.current.onstart = () => {
          setListening(true);
          setTranscript('');
          speak('Listening... Please speak now');
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setTranscript(transcript);
              processVoiceCommand(transcript);
            } else {
              interimTranscript += transcript;
            }
          }
        };

        recognitionRef.current.onend = () => {
          setListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          setFeedback(`Error: ${event.error}`);
          setListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, speak]);

  const processVoiceCommand = (text: string) => {
    const { intent, confidence } = recognizeVoiceIntent(text, language);
    setRecognizedIntent(intent);

    if (confidence > 0.2) {
      const response = getVoiceResponse(intent, language);
      speak(response);
      setFeedback(`Recognized: ${intent}`);

      setTimeout(() => {
        if (onCommand) {
          onCommand(intent);
        } else {
          handleIntentNavigation(intent);
        }
      }, 1000);
    } else {
      speak(getVoiceResponse('help', language));
      setFeedback('Command not recognized. Please try again.');
    }
  };

  const handleIntentNavigation = (intent: VoiceIntent) => {
    const intentMap: Record<VoiceIntent, string> = {
      'electricity': 'service-detail-electricity',
      'water': 'service-detail-water',
      'gas': 'service-detail-gas',
      'municipal': 'service-detail-municipal',
      'complaint': 'complaint',
      'pay_bill': 'bill-payment',
      'check_status': 'status',
      'new_connection': 'new-connection',
      'help': 'help',
      'home': 'home',
      'none': 'none',
    };

    const page = intentMap[intent];
    if (page && page !== 'none') {
      setCurrentPage(page);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.abort();
      setListening(false);
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
    if (!showHelp) {
      speak(getHelpText(language));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 space-y-2">
      {/* Floating Help Button */}
      <Button
        onClick={toggleHelp}
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      {/* Main Voice Assistant Button */}
      <Button
        onClick={listening ? stopListening : startListening}
        disabled={!isActive}
        className={`rounded-full w-14 h-14 ${
          listening
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {listening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Help Card */}
      {showHelp && (
        <Card className="absolute bottom-20 right-0 w-72 p-4 border-2 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              Voice Commands
            </h3>
            <button onClick={() => setShowHelp(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {getHelpText(language)}
          </p>
          <div className="text-xs bg-muted p-2 rounded">
            <p className="font-semibold mb-1">Quick Commands:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• "{language === 'en' ? 'Pay electricity bill' : language === 'hi' ? 'बिजली बिल भुगतान' : 'Pay electricity'}"</li>
              <li>• "{language === 'en' ? 'Check water status' : language === 'hi' ? 'पानी की स्थिति जांचें' : 'Check water'}"</li>
              <li>• "{language === 'en' ? 'File complaint' : language === 'hi' ? 'शिकायत दर्ज करें' : 'File complaint'}"</li>
              <li>• "{language === 'en' ? 'New connection' : language === 'hi' ? 'नया कनेक्शन' : 'New connection'}"</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Status Display */}
      {(transcript || feedback) && (
        <Card className="absolute bottom-20 right-0 w-72 p-3 border-2 shadow-lg">
          {transcript && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Transcribed:</p>
              <p className="text-sm mb-2">"{transcript}"</p>
            </div>
          )}
          {recognizedIntent && recognizedIntent !== 'none' && (
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1">✓ Intent Recognized:</p>
              <p className="text-sm text-green-600">{recognizedIntent}</p>
            </div>
          )}
          {feedback && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Status:</p>
              <p className="text-xs text-muted-foreground">{feedback}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
