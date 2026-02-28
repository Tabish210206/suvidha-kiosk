'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceIVRSystemProps {
  onCommand?: (intent: string, details: any) => void;
  isActive?: boolean;
}

export default function VoiceIVRSystem({ onCommand, isActive = true }: VoiceIVRSystemProps) {
  const { language, speak } = useKiosk();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(Array(20).fill(0));
  const recognitionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const wakeWords: Record<string, string[]> = {
    en: ['start service', 'hey seva', 'help me', 'pay bill'],
    hi: ['सेवा शुरू करें', 'हे सेवा', 'मदद करो', 'बिल भरो'],
    ta: ['சேவையைத் தொடங்கவும்', 'ஹே சேவா', 'உதவிக்கு', 'பில் செலுத்த'],
    te: ['సేవ ప్రారంభించండి', 'హే సేవ', 'సహాయం చేయండి', 'బిల్లు చెల్లించండి'],
    ka: ['ಸೇವೆ ಪ್ರಾರಂಭಿಸಿ', 'ಹೇ ಸೇವೆ', 'ಸಹಾಯ ಮಾಡಿ', 'ಬಿಲ್ ಪಾವತಿ'],
  };

  // Initialize speech recognition
  useEffect(() => {
    if (!isActive) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ka: 'ka-IN',
    };

    recognitionRef.current.lang = langMap[language] || 'en-IN';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      initializeWaveform();
    };

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        processVoiceCommand(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      cancelAnimationFrame(animationRef.current || 0);
      setWaveformData(Array(20).fill(0));
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, isActive]);

  // Initialize waveform animation
  const initializeWaveform = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateWaveform = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const sliced = Array.from(dataArray).slice(0, 20).map(val => val / 255);
          setWaveformData(sliced);
          animationRef.current = requestAnimationFrame(updateWaveform);
        }
      };

      updateWaveform();
    } catch (error) {
      console.error('Microphone access error:', error);
    }
  };

  // Process voice commands
  const processVoiceCommand = (input: string) => {
    const lowerInput = input.toLowerCase().trim();
    const validWakeWords = wakeWords[language] || wakeWords.en;

    // Check for wake words
    for (const wakeWord of validWakeWords) {
      if (lowerInput.includes(wakeWord.toLowerCase())) {
        handleVoiceIntent(lowerInput);
        return;
      }
    }
  };

  // Handle detected intents
  const handleVoiceIntent = (input: string) => {
    const lower = input.toLowerCase();

    if (lower.includes('bill') || lower.includes('भरो') || lower.includes('செலுத்த')) {
      onCommand?.('PAY_BILL', { transcript: input });
    } else if (lower.includes('usage') || lower.includes('खपत') || lower.includes('பயன்பாடு')) {
      onCommand?.('CHECK_USAGE', { transcript: input });
    } else if (lower.includes('complaint') || lower.includes('शिकायत') || lower.includes('புகார்')) {
      onCommand?.('FILE_COMPLAINT', { transcript: input });
    } else if (lower.includes('connection') || lower.includes('कनेक्शन') || lower.includes('இணைப்பு')) {
      onCommand?.('NEW_CONNECTION', { transcript: input });
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  // Speak feedback
  const speakFeedback = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!isActive) return null;

  return (
    <Card className="fixed bottom-24 left-4 right-4 p-6 shadow-2xl border-2 border-primary z-30 max-w-sm mx-auto md:max-w-md">
      <div className="flex flex-col gap-4">
        {/* Waveform Visualization */}
        <div className="flex items-center justify-center gap-1 h-12 bg-primary/10 rounded-lg p-3">
          {waveformData.map((val, idx) => (
            <div
              key={idx}
              className="flex-1 bg-primary rounded-full transition-all"
              style={{
                height: `${Math.max(8, val * 100)}%`,
              }}
            />
          ))}
        </div>

        {/* Transcript Display */}
        <div className="min-h-12 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Listening...</p>
          <p className="text-base font-medium text-foreground line-clamp-2">{transcript || 'Say something...'}</p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {isListening && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            <span className="text-muted-foreground">{isListening ? 'Listening' : 'Ready'}</span>
          </div>
          {isSpeaking && <Volume2 className="w-4 h-4 text-primary" />}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={toggleListening}
            className="flex-1 kiosk-btn"
            variant={isListening ? 'destructive' : 'default'}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
