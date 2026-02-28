export interface VoiceCommand {
  intent: string;
  action: string;
  parameters?: Record<string, any>;
}

export interface VoiceResponse {
  message: string;
  action?: string;
  confidence: number;
}

// Intent patterns for voice recognition
const intentPatterns: Record<string, RegExp[]> = {
  'pay_bill': [
    /pay\s+(bill|bills|payment)/i,
    /i\s+want\s+to\s+pay/i,
    /pay\s+(electricity|water|gas)/i,
    /कर\s+(भुगतान|payment)/i,
  ],
  'check_bill': [
    /check\s+(my\s+)?bill/i,
    /what\s+is\s+my\s+bill/i,
    /show\s+bill/i,
    /मेरा\s+बिल/i,
  ],
  'lodge_complaint': [
    /lodge\s+complaint/i,
    /report\s+(problem|issue)/i,
    /i\s+have\s+an\s+issue/i,
    /शिकायत\s+(दर्ज|lodge)/i,
  ],
  'check_status': [
    /check\s+(status|payment\s+status)/i,
    /payment\s+status/i,
    /क्या\s+स्थिति\s+है/i,
  ],
  'download_bill': [
    /download\s+bill/i,
    /send\s+bill/i,
    /email\s+bill/i,
    /बिल\s+डाउनलोड/i,
  ],
  'help': [
    /help/i,
    /what\s+can\s+i\s+do/i,
    /options/i,
    /मदद/i,
  ],
};

// Responses based on intent
const responseMap: Record<string, string> = {
  'pay_bill': 'I will help you pay your bill. Please provide your consumer reference number.',
  'check_bill': 'Let me fetch your current bill details. Please provide your consumer ID.',
  'lodge_complaint': 'I will help you lodge a complaint. What is the issue you are facing?',
  'check_status': 'I can check your payment status. Please provide your transaction ID or reference number.',
  'download_bill': 'I can send you your bill via email or SMS. What is your preferred method?',
  'help': 'I can help you with bill payments, checking bills, lodging complaints, and more. What would you like to do?',
  'unknown': 'I did not understand that. Can you please repeat or try one of our services?',
};

export function recognizeIntent(transcript: string): VoiceResponse {
  // Normalize transcript
  const normalized = transcript.toLowerCase().trim();

  // Check each intent pattern
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return {
          message: responseMap[intent],
          action: intent,
          confidence: 0.95,
        };
      }
    }
  }

  // If no intent matched
  return {
    message: responseMap['unknown'],
    action: 'unknown',
    confidence: 0.3,
  };
}

export function generateVoiceResponse(intent: string): string {
  const response = responseMap[intent] || responseMap['unknown'];
  return response;
}

export function startSpeechRecognition(): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject(new Error('Speech Recognition API not supported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.language = 'en-IN'; // Hindi-English
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('[v0] Speech recognition started');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      console.log('[v0] Speech recognized:', transcript);
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('[v0] Speech recognition error:', event.error);
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      console.log('[v0] Speech recognition ended');
    };

    recognition.start();

    // Auto timeout after 10 seconds
    setTimeout(() => {
      recognition.abort();
    }, 10000);
  });
}

export function speakText(text: string, language: string = 'en-IN'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('[v0] Speech synthesis not supported');
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.language = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

export async function processVoiceCommand(transcript: string): Promise<VoiceCommand> {
  const response = recognizeIntent(transcript);

  return {
    intent: response.action || 'unknown',
    action: response.action || 'unknown',
    parameters: {
      transcript,
      confidence: response.confidence,
    },
  };
}
