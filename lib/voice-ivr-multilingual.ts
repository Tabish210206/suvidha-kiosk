import { Language } from './translations';

export type VoiceIntent = 'electricity' | 'water' | 'gas' | 'municipal' | 'complaint' | 'pay_bill' | 'check_status' | 'new_connection' | 'help' | 'home' | 'none';

const commandKeywords: Record<Language, Record<string, VoiceIntent>> = {
  en: {
    'electricity': 'electricity',
    'electric': 'electricity',
    'bill': 'pay_bill',
    'pay': 'pay_bill',
    'water': 'water',
    'gas': 'gas',
    'municipal': 'municipal',
    'tax': 'municipal',
    'complaint': 'complaint',
    'complain': 'complaint',
    'status': 'check_status',
    'check': 'check_status',
    'new': 'new_connection',
    'connection': 'new_connection',
    'apply': 'new_connection',
    'help': 'help',
    'home': 'home',
    'menu': 'home',
    'back': 'home',
  },
  hi: {
    'बिजली': 'electricity',
    'इलेक्ट्रिक': 'electricity',
    'बिल': 'pay_bill',
    'भुगतान': 'pay_bill',
    'पानी': 'water',
    'गैस': 'gas',
    'नगरपालिका': 'municipal',
    'कर': 'municipal',
    'शिकायत': 'complaint',
    'स्थिति': 'check_status',
    'जांच': 'check_status',
    'नया': 'new_connection',
    'कनेक्शन': 'new_connection',
    'आवेदन': 'new_connection',
    'मदद': 'help',
    'होम': 'home',
    'मेनू': 'home',
    'वापस': 'home',
  },
  ta: {
    'மின்சாரம்': 'electricity',
    'மின்': 'electricity',
    'பட்டியல்': 'pay_bill',
    'பணம்': 'pay_bill',
    'நீர்': 'water',
    'வாயு': 'gas',
    'நகரபालிகை': 'municipal',
    'வரி': 'municipal',
    'புகார்': 'complaint',
    'நிலை': 'check_status',
    'சரிபார்': 'check_status',
    'புதிய': 'new_connection',
    'இணைப்பு': 'new_connection',
    'விண்ணப்பம்': 'new_connection',
    'உதவி': 'help',
    'வீடு': 'home',
    'பட்டியல்': 'home',
    'பின்னால்': 'home',
  },
  te: {
    'విద్యుత్': 'electricity',
    'ఎలక్ట్రిక్': 'electricity',
    'బిల్': 'pay_bill',
    'చెల్లింపు': 'pay_bill',
    'నీరు': 'water',
    'గ్యాస్': 'gas',
    'మునిసిపల్': 'municipal',
    'పన్ను': 'municipal',
    'ఫిర్యాదు': 'complaint',
    'స్థితి': 'check_status',
    'తనిఖీ': 'check_status',
    'కొత్త': 'new_connection',
    'కనెక్షన్': 'new_connection',
    'దరఖాస్తు': 'new_connection',
    'సహాయం': 'help',
    'హోమ్': 'home',
    'మెనూ': 'home',
    'వెనక్కి': 'home',
  },
  ka: {
    'ವಿದ್ಯುತ್': 'electricity',
    'ಬಿಲ್': 'pay_bill',
    'ಪಾವತಿ': 'pay_bill',
    'ನೀರು': 'water',
    'ಮೈದು': 'gas',
    'ಪುರಸಭೆ': 'municipal',
    'ತೆರಿಗೆ': 'municipal',
    'ಅಪನಂದನೆ': 'complaint',
    'ಸ್ಥಿತಿ': 'check_status',
    'ಕೊಸೇ': 'new_connection',
    'ಸಂಪರ್ಕ': 'new_connection',
    'ಆವೇದನ': 'new_connection',
    'ಸಹಾಯ': 'help',
    'ಮುಖಪುಟ': 'home',
    'ಮೆನು': 'home',
    'ಹಿಂದೆ': 'home',
  },
};

const responseTemplates: Record<Language, Record<string, string>> = {
  en: {
    'electricity': 'Navigating to electricity bill payment',
    'water': 'Opening water bill section',
    'gas': 'Accessing gas bill payment',
    'municipal': 'Displaying municipal services',
    'complaint': 'Opening complaint filing section',
    'pay_bill': 'Ready to process your bill payment',
    'check_status': 'Checking your service status',
    'new_connection': 'Processing new connection application',
    'help': 'How can I help you today?',
    'home': 'Returning to main menu',
    'not_understood': 'Sorry, I did not understand. Please try again.',
  },
  hi: {
    'electricity': 'बिजली बिल भुगतान पृष्ठ पर जा रहे हैं',
    'water': 'पानी बिल अनुभाग खोल रहे हैं',
    'gas': 'गैस बिल भुगतान में जा रहे हैं',
    'municipal': 'नगरपालिका सेवाएं दिखा रहे हैं',
    'complaint': 'शिकायत दर्ज करने के लिए खोल रहे हैं',
    'pay_bill': 'आपके बिल का भुगतान करने के लिए तैयार',
    'check_status': 'आपकी सेवा की स्थिति जांच रहे हैं',
    'new_connection': 'नए कनेक्शन के लिए आवेदन कर रहे हैं',
    'help': 'मैं आपकी कैसे मदद कर सकता हूं?',
    'home': 'मुख्य मेनू पर लौट रहे हैं',
    'not_understood': 'क्षमा करें, मैं समझ नहीं पाया। कृपया फिर से प्रयास करें।',
  },
  ta: {
    'electricity': 'மின்சாரம் பிల் பேமெண்ட் பெজ்க்கு செல்கிறேன்',
    'water': 'நீர் பிල் பிரிவை திறக்கிறேன்',
    'gas': 'வாயு பில் பேமெண்ட்க்கு செல்கிறேன்',
    'municipal': 'நகரபாலிகை சேவைகளை காட்டுகிறேன்',
    'complaint': 'புகார் பதிவு பிரிவை திறக்கிறேன்',
    'pay_bill': 'உங்கள் பில் பேமெண்ட்க்கு தயாரமாகிவிட்டேன்',
    'check_status': 'உங்கள் சேவை நிலையை சரிபார்க்கிறேன்',
    'new_connection': 'புதிய இணைப்பு விண்ணப்பத்தை செயல்பாட்டுக்கு கொண்டு வருகிறேன்',
    'help': 'நான் எப்படி உங்களுக்கு உதவ முடியும்?',
    'home': 'பிரதான மெனுவுக்கு திரும்பிக்கொண்டிருக்கிறேன்',
    'not_understood': 'மன்னிக்கவும், நான் புரியவில்லை। மீண்டும் முயற்சி செய்யவும்.',
  },
  te: {
    'electricity': 'విద్యుత్ బిల్ పేమెంట్ పేజీకి నావిగేట్ చేస్తున్నాను',
    'water': 'నీటి బిల్ సెక్షన్ తెరుస్తున్నాను',
    'gas': 'గ్యాస్ బిల్ పేమెంట్కు ప్రవేశిస్తున్నాను',
    'municipal': 'మునిసిపల్ సేవలను ప్రదర్శిస్తున్నాను',
    'complaint': 'ఫిర్యాదు దాఖలు చేయడం కోసం తెరుస్తున్నాను',
    'pay_bill': 'మీ బిల్ పేమెంట్ కోసం సిద్ధంగా ఉన్నాను',
    'check_status': 'మీ సేవ స్థితిని తనిఖీ చేస్తున్నాను',
    'new_connection': 'కొత్త కనెక్షన్ దరఖాస్తును ప్రక్రియ చేస్తున్నాను',
    'help': 'నేను మీకు ఎలా సహాయం చేయగలను?',
    'home': 'ప్రధాన మెనుకు తిరిగి వస్తున్నాను',
    'not_understood': 'క్షమించండి, నేను అర్థం చేసుకోలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
  },
  ka: {
    'electricity': 'ವಿದ್ಯುತ್ ಬಿಲ್ ಪೇಮೆಂಟ್ ಪುಟಕ್ಕೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡುತ್ತಿದೆ',
    'water': 'ನೀರಿನ ಬಿಲ್ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದೆ',
    'gas': 'ಮೈದು ಬಿಲ್ ಪೇಮೆಂಟ್ಗೆ ಪ್ರವೇಶಿಸುತ್ತಿದೆ',
    'municipal': 'ಪುರಸಭೆ ಸೇವೆಗಳನ್ನು ತೋರಿಸುತ್ತಿದೆ',
    'complaint': 'ಅಪನಂದನೆ ಸಲ್ಲಿಸುವಿಕೆಗೆ ತೆರೆಯುತ್ತಿದೆ',
    'pay_bill': 'ಮೀ ಬಿಲ್ ಪೇಮೆಂಟ್‌ಗಾಗಿ ಸಿದ್ಧವಾಗಿದೆ',
    'check_status': 'ಮೀ ಸೇವೆಯ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ',
    'new_connection': 'ಹೊಸ ಸಂಪರ್ಕ ಅರ್ಜಿಯನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡುತ್ತಿದೆ',
    'help': 'ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    'home': 'ಮುಖ್ಯ ಮೆನುಗೆ ಹಿಂತಿರುಗುತ್ತಿದೆ',
    'not_understood': 'ಕ್ಷಮಿಸಿ, ನಾನು ಅರ್ಥ ಮಾಡಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  },
};

export function recognizeVoiceIntent(speechText: string, language: Language): { intent: VoiceIntent; confidence: number } {
  const lowercaseText = speechText.toLowerCase().trim();
  const keywords = commandKeywords[language] || commandKeywords.en;

  let bestMatch: { intent: VoiceIntent; confidence: number } = { intent: 'none', confidence: 0 };

  for (const [keyword, intent] of Object.entries(keywords)) {
    if (lowercaseText.includes(keyword)) {
      const confidence = keyword.length / lowercaseText.length;
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intent as VoiceIntent, confidence };
      }
    }
  }

  return bestMatch.confidence > 0.2 ? bestMatch : { intent: 'none', confidence: 0 };
}

export function getVoiceResponse(intent: VoiceIntent, language: Language): string {
  const templates = responseTemplates[language] || responseTemplates.en;
  return templates[intent] || templates['not_understood'];
}

export function getHelpText(language: Language): string {
  const helps: Record<Language, string> = {
    en: 'You can say: pay electricity bill, check water bill status, file complaint, apply new connection, or go back to menu',
    hi: 'आप कह सकते हैं: बिजली बिल का भुगतान करें, पानी बिल स्थिति जांचें, शिकायत दर्ज करें, नया कनेक्शन लागू करें, या मेनू पर वापस जाएं',
    ta: 'நீங்கள் சொல்லலாம்: மின்சாரம் பிल் செலுத்தவும், நீர் பிల் நிலை சரிபார்க்கவும், புகார் பதிவு செய்யவும், புதிய இணைப்புக்கு விண்ணப்பிக்கவும், அல்லது மெனுவுக்கு திரும்பவும்',
    te: 'మీరు చెప్పవచ్చు: విద్యుత్ బిల్ చెల్లించండి, నీటి బిల్ స్థితిని తనిఖీ చేయండి, ఫిర్యాదు సమర్పించండి, కొత్త కనెక్షన్‌కు దరఖాస్తు చేయండి, లేదా మెనుకు తిరిగి వెళ్లండి',
    ka: 'ನೀವು ಹೇಳಬಹುದು: ವಿದ್ಯುತ್ ಬಿಲ್ ಪೇ ಮಾಡಿ, ನೀರಿನ ಬಿಲ್ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ, ಅಪನಂದನೆ ಸಲ್ಲಿಸಿ, ಹೊಸ ಸಂಪರ್ಕಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ, ಅಥವಾ ಮೆನುಗೆ ಹಿಂತಿರುಗಿ',
  };

  return helps[language] || helps.en;
}
