'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Mic, Volume2, HelpCircle, Minimize2, Maximize2 } from 'lucide-react';
import { useKiosk } from '@/lib/kiosk-context';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  isOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  context?: 'electricity' | 'water' | 'gas' | 'municipal' | 'dashboard';
}

const contextResponses: Record<string, Record<string, string>> = {
  electricity: {
    'hello': 'Hello! Welcome to Electricity Services. I can help you with bill payments, usage history, complaints, and new connections.',
    'bill': 'Your current electricity bill is Rs. 2,450 due on March 15, 2024. Would you like to pay now?',
    'usage': 'Your electricity usage this month is 320 kWh, which is 12% higher than last month. This might be due to increased AC usage.',
    'payment': 'You can pay your bill securely using credit card, debit card, net banking, or digital wallets. Which method would you prefer?',
    'complaint': 'I can help you file a complaint. What type of issue are you facing? (meter, billing, supply, or other)',
    'default': 'I can help you with electricity bill payments, view usage, file complaints, or apply for new connection. What would you like to do?',
  },
  water: {
    'hello': 'Hello! Welcome to Water Services. I can assist with bill payments, usage tracking, complaints, and new connections.',
    'bill': 'Your current water bill is Rs. 850 due on March 15, 2024. Would you like to proceed with payment?',
    'usage': 'Your water consumption this month is 48 units. This is within normal range for your area.',
    'payment': 'Pay your water bill easily through multiple payment methods available 24/7.',
    'complaint': 'Please describe your water supply issue. Is it a billing issue, low pressure, or something else?',
    'default': 'How can I help you today? I can process payments, show usage, handle complaints, or help with new connections.',
  },
  dashboard: {
    'hello': 'Hello! Welcome to your Service Dashboard. I can help you manage all your utility bills and services.',
    'bills': 'You have 3 active bills: Electricity (Rs. 1,250), Water (Rs. 380), and Gas (Rs. 520).',
    'payment': 'Which service would you like to pay for? Electricity, Water, or Gas?',
    'overview': 'Here is your overview: Electricity due on Mar 15, Water overdue, Gas paid. What would you like to do?',
    'default': 'I can help you manage your bills, make payments, view usage, or file complaints. What do you need?',
  },
};

const suggestedQuestions: Record<string, string[]> = {
  electricity: [
    'How much is my bill?',
    'Check my usage',
    'Pay my electricity bill',
    'File a complaint',
    'New connection',
    'Payment history',
  ],
  water: [
    'What is my bill?',
    'View my usage',
    'Make a payment',
    'Report a fault',
    'Apply for new',
    'Recent payments',
  ],
  gas: [
    'Show my bill',
    'Usage details',
    'Pay now',
    'Report issue',
    'New connection',
    'Bill history',
  ],
  dashboard: [
    'Overview of bills',
    'Pay a bill',
    'Check usage',
    'File complaint',
    'Payment history',
    'Help',
  ],
};

export default function AdvancedChatbot({ isOpen = false, position = 'bottom-right', context = 'dashboard' }: ChatbotProps) {
  const { language, speak } = useKiosk();
  const [chatOpen, setChatOpen] = useState(isOpen);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: contextResponses[context]['hello'] || contextResponses[context]['default'],
      timestamp: new Date(),
      suggestions: suggestedQuestions[context as keyof typeof suggestedQuestions],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputValue(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const response = getContextualResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response,
        timestamp: new Date(),
        suggestions: getSuggestedFollowUps(text),
      };
      setMessages((prev) => [...prev, botMessage]);
      speak(response);
    }, 500);
  };

  const getContextualResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const responses = contextResponses[context] || contextResponses.dashboard;

    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }
    return responses['default'];
  };

  const getSuggestedFollowUps = (userInput: string): string[] => {
    const questions = suggestedQuestions[context as keyof typeof suggestedQuestions] || [];
    return questions.filter((q) => !userInput.toLowerCase().includes(q.toLowerCase())).slice(0, 3);
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className={`fixed ${position === 'bottom-right' ? 'bottom-24 right-6' : 'bottom-24 left-6'} w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-90 transition-all flex items-center justify-center z-40`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );
  }

  const chatBoxClasses = `fixed ${position === 'bottom-right' ? 'right-4 bottom-24' : 'left-4 bottom-24'} w-96 max-h-[600px] bg-card rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-border`;

  return (
    <Card className={chatBoxClasses}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">Smart Assistant</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-2 hover:bg-primary-foreground/20 rounded transition-colors"
            aria-label="Minimize"
          >
            {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="p-2 hover:bg-primary-foreground/20 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.type === 'bot' && (
                    <button
                      onClick={() => speak(message.text)}
                      className="mt-2 text-xs hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      Speak
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {messages[messages.length - 1]?.suggestions && messages[messages.length - 1]?.type === 'bot' && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold">Suggested Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1]?.suggestions?.slice(0, 3).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleMicClick}
                className={`p-2 rounded transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted'}`}
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSendMessage()}
                className="p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSendMessage('Help')}
                className="flex-1 px-3 py-2 text-xs rounded border border-border hover:bg-muted transition-colors flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                Help
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
