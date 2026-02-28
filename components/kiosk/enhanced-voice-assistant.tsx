'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, Copy, RefreshCw, Zap, Check } from 'lucide-react';
import { useKiosk } from '@/lib/kiosk-context';

interface VoiceOutput {
  id: string;
  text: string;
  confidence: number;
  timestamp: Date;
}

export default function EnhancedVoiceAssistant() {
  const { language, speak } = useKiosk();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [history, setHistory] = useState<VoiceOutput[]>([]);
  const [detectedIntent, setDetectedIntent] = useState('');
  const recognitionRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          animateMicrophone();
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          let maxConfidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const isFinal = event.results[i].isFinal;
            const conf = event.results[i][0].confidence;

            if (isFinal) {
              finalTranscript += transcript + ' ';
              maxConfidence = Math.max(maxConfidence, conf);
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
          setConfidence(maxConfidence);

          // Detect intent
          if (finalTranscript) {
            const intent = detectIntent(finalTranscript);
            setDetectedIntent(intent);

            const output: VoiceOutput = {
              id: Date.now().toString(),
              text: finalTranscript,
              confidence: maxConfidence,
              timestamp: new Date(),
            };
            setHistory((prev) => [output, ...prev].slice(0, 10));
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          cancelAnimationFrame(animationRef.current!);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('[v0] Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [language]);

  const animateMicrophone = () => {
    animationRef.current = requestAnimationFrame(animateMicrophone);
  };

  const detectIntent = (input: string): string => {
    const text = input.toLowerCase();
    const intents: Record<string, string> = {
      'pay|payment|bill': 'Pay Bill',
      'usage|consumption|history': 'View Usage',
      'complaint|fault|issue': 'File Complaint',
      'connection|new': 'New Connection',
      'help|info|guide': 'Get Help',
      'status|track': 'Check Status',
      'search|find|look': 'Search',
    };

    for (const [pattern, intent] of Object.entries(intents)) {
      if (new RegExp(pattern).test(text)) {
        return intent;
      }
    }
    return 'General Query';
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setConfidence(0);
      setDetectedIntent('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf > 0.8) return 'text-green-600';
    if (conf > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-8">
      {/* Voice Input Card */}
      <Card className="p-8 border-2 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10">
        <h2 className="text-2xl font-bold mb-6">Voice Assistant</h2>

        {/* Microphone Button */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 shadow-2xl scale-110 animate-pulse'
                : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>
          <p className="text-sm text-muted-foreground">
            {isListening ? 'Listening... Say "Hey Seva" or your command' : 'Click to start listening'}
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-6 p-4 bg-background rounded-lg border-2 border-primary">
            <p className="text-sm text-muted-foreground mb-2">You said:</p>
            <p className="text-lg font-semibold text-foreground">{transcript}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getConfidenceColor(confidence)}`} />
                <span className="text-xs text-muted-foreground">
                  Confidence: {(confidence * 100).toFixed(0)}%
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(transcript)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Intent Detection */}
        {detectedIntent && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
            <p className="text-sm text-muted-foreground mb-1">Detected Intent:</p>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-green-700 dark:text-green-300">{detectedIntent}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Voice Commands Help */}
      <Card className="p-6 border-2">
        <h3 className="text-lg font-bold mb-4">Supported Voice Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Bill Related:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• "Pay my electricity bill"</li>
              <li>• "Check water bill status"</li>
              <li>• "Show gas bill"</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Usage & Tracking:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• "Show my usage history"</li>
              <li>• "What is my consumption?"</li>
              <li>• "Check status"</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Complaints & Support:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• "File a complaint"</li>
              <li>• "Report a fault"</li>
              <li>• "Call customer service"</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">New Connection:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• "Apply for new connection"</li>
              <li>• "New electricity bill"</li>
              <li>• "Get new service"</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recent Voice Inputs */}
      {history.length > 0 && (
        <Card className="p-6 border-2">
          <h3 className="text-lg font-bold mb-4">Recent Voice Inputs</h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-3 bg-muted rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-foreground text-sm">{item.text}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(item.confidence)} bg-white/50`}>
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings */}
      <Card className="p-6 border-2">
        <h3 className="text-lg font-bold mb-4">Voice Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Wake Word</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">Enabled: "Hey Seva"</span>
              <Button size="sm" variant="outline" className="ml-auto" disabled>
                Enabled
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Language</label>
            <select className="w-full px-4 py-2 rounded-lg border-2 border-input bg-background">
              <option>English (Indian)</option>
              <option>Hindi</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Kannada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Auto Transcription</label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Show text as you speak</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}
