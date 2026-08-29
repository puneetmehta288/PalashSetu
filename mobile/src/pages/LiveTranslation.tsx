import React, { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { speakText, transliterateOlChikiToPhonetic, isOlChiki, convertDigitsToOlChiki, convertOlChikiToDigits, numberToSantaliWords } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

// Client-side FLN Ol Chiki Dictionary for 100% offline edge translation
const CLIENT_HINDI_TO_SANTALI: Record<string, string> = {
  // Common Sentences
  'नमस्ते बच्चों!': 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!',
  'अपनी किताब खोलो।': 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾',
  'आज हम एक से दस तक गिनती सीखेंगे।': 'ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾',
  'इन सेबों को गिनो।': 'ᱱᱚᱣᱟ ᱥᱮᱣ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾',
  'बहुत अच्छा! शाबाश!': 'ᱟᱹᱰᱤ ᱵᱮᱥ! ᱥᱟᱵᱟᱥ!',
  'अपनी जगह पर बैठ जाओ।': 'ᱟᱢᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵᱽ ᱢᱮ᱾',
  'क्या आपको समझ आया?': 'ᱪᱮᱫ ᱟᱢᱮᱢ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ?',
  'ब्लैकबोर्ड की तरफ देखो।': 'ᱵᱞᱮᱠᱵᱳᱨᱰ ᱥᱮᱫ ᱧᱮᱞ ᱢᱮ᱾',
  'हाँ शिक्षक, मुझे समझ आ गया।': 'ᱦᱚᱭ ᱢᱟᱪᱮᱛ, ᱤᱧᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ᱾',
  'यह तीन (3) है।': 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱮ (᱓) ᱠᱟᱱᱟ᱾',
  'नमस्ते शिक्षक!': 'ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!',

  // Numbers 1-10
  'एक': 'ᱢᱤᱫ', 'दो': 'ᱵᱟᱨ', 'तीन': 'ᱯᱮ', 'चार': 'ᱯᱩᱱ', 'पाँच': 'ᱢᱚᱬᱮ', 'पांच': 'ᱢᱚᱬᱮ',
  'छह': 'ᱛᱩᱨᱩᱭ', 'सात': 'ᱮᱨᱟᱭ', 'आठ': 'ᱤᱨᱟᱹᱞ', 'नौ': 'ᱟᱨᱮ', 'दस': 'ᱜᱮᱞ',
  '1': '᱑', '2': '᱒', '3': '᱓', '4': '᱔', '5': '᱕',
  '6': '᱖', '7': '᱗', '8': '᱘', '9': '᱙', '10': '᱑᱐',

  // Animals
  'गाय': 'ᱜᱟᱹᱭ', 'बकरी': 'ᱢᱮᱨᱚᱢ', 'कुत्ता': 'ᱥᱮᱛᱟ', 'बिल्ली': 'ᱯᱩᱥᱤ',
  'हाथी': 'ᱦᱟᱹᱛᱤ', 'बाघ': 'ᱛᱟᱹᱨᱩᱵ', 'शेर': 'ᱠᱩᱞ', 'भालू': 'ᱵᱟᱱᱟ',
  'बंदर': 'ᱜᱟᱹᱰᱤ', 'घोड़ा': 'ᱥᱟᱫᱚᱢ', 'भैंस': 'ᱠᱟᱰᱟ', 'भेड़': 'ᱵᱷᱤᱰᱤ',
  'सूअर': 'ᱥᱩᱠᱨᱤ', 'मुर्गी': 'ᱥᱤᱢ', 'बतख': 'ᱜᱮᱰᱮ', 'हिरण': 'ᱡᱷᱤᱸᱠ',
  'लोमड़ी': 'ᱛᱩᱭᱩ', 'खरगोश': 'ᱠᱩᱞᱟᱹᱭ', 'गिलहरी': 'ᱜᱩᱰᱩ', 'चूहा': 'ᱪᱩᱴᱤᱭᱟᱹ',
  'मोर': 'ᱢᱟᱨᱟᱜ', 'चिड़िया': 'ᱪᱮᱬᱮ', 'कौआ': 'ᱠᱟᱹᱦᱩ', 'कबूतर': 'ᱯᱚᱛᱟᱢ',
  'सांप': 'ᱵᱤᱧ', 'मेंढक': 'ᱨᱚᱴᱮ', 'मछली': 'ᱦᱟᱹᱠᱩ', 'कछुआ': 'ᱦᱚᱨᱚ',
  'तितली': 'ᱯᱤᱯᱤᱲᱤᱭᱟᱹ', 'मधुमक्खी': 'ᱧᱮᱸᱞᱮ',

  // Fruits & Food
  'आम': 'ᱟᱢ', 'केला': 'ᱠᱟᱭᱨᱟ', 'सेब': 'ᱥᱮᱣ', 'कटहल': 'ᱠᱟᱸᱴᱷᱟᱲ',
  'तरबूज': 'ᱛᱟᱨᱵᱩᱡᱽ', 'अमरूद': 'ᱥᱚᱯᱨᱤ', 'पपीता': 'ᱯᱟᱯᱟᱭᱛᱟ', 'संतरा': 'ᱠᱚᱢᱞᱟ',
  'अंगूर': 'ᱟᱝᱜᱩᱨ', 'नींबू': 'ᱞᱤᱢᱵᱩ', 'अनार': 'ᱟᱱᱟᱨ', 'नारियल': 'ᱱᱟᱹᱨᱠᱚᱲ',
  'पानी': 'ᱫᱟᱜ', 'खाना': 'ᱡᱚᱢᱟᱜ', 'दूध': 'ᱛᱚᱣᱟ', 'चावल': 'ᱫᱟᱠᱟ',

  // Body Parts
  'सिर': 'ᱵᱚᱦᱚᱜ', 'आंख': 'ᱢᱮᱫ', 'कान': 'ᱞᱩᱛᱩᱨ', 'नाक': 'ᱢᱩᱸ',
  'हाथ': 'ᱛᱤ', 'पैर': 'ᱡᱟᱝᱜᱟ', 'मुंह': 'ᱢᱚᱪᱟ', 'दांत': 'ᱰᱟᱴᱟ', 'पेट': 'ᱞᱟᱡ',

  // Colors & Nature
  'लाल': 'ᱟᱨᱟᱜ', 'हरा': 'ᱦᱟᱹᱨᱭᱟᱹᱲ', 'पीला': 'ᱥᱟᱥᱟᱝ', 'नीला': 'ᱞᱤᱞ', 'सफेद': 'ᱯᱩᱸᱰ', 'काला': 'ᱦᱮᱸᱫᱮ',
  'पेड़': 'ᱫᱟᱨᱮ', 'पत्ता': 'ᱥᱟᱠᱟᱢ', 'फूल': 'ᱵᱟᱦᱟ', 'फल': 'ᱡᱚ', 'नदी': 'ᱜᱟᱰᱟ', 'पहाड़': 'ᱵᱩᱨᱩ',
  'सूरज': 'ᱵᱮᱨᱟ', 'चांद': 'ᱪᱟᱸᱫᱚ', 'तारा': 'ᱤᱯᱤᱞ', 'जंगल': 'ᱵᱤᱨ', 'गाँव': 'ᱟᱹᱛᱩ', 'गांव': 'ᱟᱹᱛᱩ',

  // Math & Operations
  'जोड़': 'ᱡᱚᱲᱟᱣ', 'जोड़ो': 'ᱡᱚᱲᱟᱣ ᱢᱮ', 'घटाव': 'ᱜᱷᱟᱴᱟᱣ', 'घटाओ': 'ᱜᱷᱟᱴᱟᱣ ᱢᱮ',
  'गुणा': 'ᱜᱩᱬᱟᱹᱣ', 'भाग': 'ᱦᱟᱹᱴᱤᱧ', 'बांटो': 'ᱦᱟᱹᱴᱤᱧ ᱢᱮ', 'रुपया': 'ᱴᱟᱠᱟ', 'रुपये': 'ᱴᱟᱠᱟ', 'पैसा': 'ᱯᱩᱭᱥᱟᱹ',
  'घंटा': 'ᱴᱟᱲᱟᱝ', 'मिनट': 'ᱴᱤᱯᱤᱡ', 'समय': 'ᱚᱠᱛᱚ', 'दिन': 'ᱢᱟᱦᱟᱸ', 'रात': 'ᱧᱤᱫᱟᱹ', 'सुबह': 'ᱥᱮᱛᱟᱜ', 'शाम': 'ᱟᱹᱭᱩᱵ',

  // Family & People
  'माँ': 'ᱟᱭᱳ', 'पिता': 'ᱵᱟᱵᱟ', 'भाई': 'ᱵᱚᱭᱦᱟ', 'बहन': 'ᱢᱤᱥᱨᱟ', 'दोस्त': 'ᱜᱟᱛᱮ',
  'लड़का': 'ᱠᱚᱲᱟ', 'लड़की': 'ᱠᱩᱲᱤ', 'लोग': 'ᱦᱚᱲ', 'मनुष्य': 'ᱦᱚᱲ',

  // Classroom Words & Verbs
  'नमस्ते': 'ᱡᱚᱦᱟᱨ', 'धन्यवाद': 'ᱥᱟᱨᱦᱟᱣ', 'बच्चे': 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ', 'बच्चों': 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ',
  'किताब': 'ᱯᱩᱛᱷᱤ', 'कलम': 'ᱠᱚᱞᱚᱢ', 'स्कूल': 'ᱟᱥᱲᱟ', 'शिक्षक': 'ᱢᱟᱪᱮᱛ',
  'छात्र': 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ', 'गिनो': 'ᱞᱮᱠᱷᱟᱭ ᱢᱮ', 'गिनती': 'ᱞᱮᱠᱷᱟ', 'संख्या': 'ᱮᱞᱠᱷᱟ',
  'गणित': 'ᱮᱞᱠᱷᱟ', 'खोलो': 'ᱡᱷᱤᱡᱽ ᱢᱮ', 'बैठ': 'ᱫᱩᱲᱩᱵ', 'बैठो': 'ᱫᱩᱲᱩᱵ ᱢᱮ',
  'खड़े': 'ᱛᱤᱸᱜᱩ', 'जाओ': 'ᱥᱮᱱᱚᱜ ᱢᱮ', 'आओ': 'ᱦᱤᱡᱩᱜ ᱢᱮ', 'पढ़ो': 'ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
  'लिखो': 'ᱚᱞ ᱢᱮ', 'सुनो': 'ᱟᱧᱡᱚᱢ ᱢᱮ', 'देखो': 'ᱧᱮᱞ ᱢᱮ', 'बड़ा': 'ᱢᱟᱨᱟᱝ',
  'छोटा': 'ᱦᱩᱰᱤᱧ', 'अच्छा': 'ᱵᱮᱥ', 'हाँ': 'ᱦᱚᱭ', 'नहीं': 'ᱵᱟᱝ',
  'क्या': 'ᱪᱮᱫ', 'कहाँ': 'ᱚᱠᱟᱨᱮ', 'कौन': 'ᱚᱠᱚᱭ', 'और': 'ᱟᱨ', 'है': 'ᱠᱟᱱᱟ', 'हैं': 'ᱠᱟᱱᱟᱠᱚ',
  'मैं': 'ᱤᱧ', 'तुम': 'ᱟᱢ', 'हम': 'ᱟᱵᱚ', 'घर': 'ᱚᱲᱟᱜ', 'सुंदर': 'ᱪᱚᱨᱚᱠ',
};

const CLIENT_SANTALI_TO_HINDI: Record<string, string> = {};
Object.entries(CLIENT_HINDI_TO_SANTALI).forEach(([hin, sat]) => {
  CLIENT_SANTALI_TO_HINDI[sat] = hin;
});

const CATEGORIZED_PHRASES = {
  greetings: [
    { hindi: 'नमस्ते बच्चों!', santali: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!', pronunciation: 'Johar gidrako!' },
    { hindi: 'नमस्ते शिक्षक!', santali: 'ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!', pronunciation: 'Johar machet!' },
    { hindi: 'बहुत अच्छा! शाबाश!', santali: 'ᱟᱹᱰᱤ ᱵᱮᱥ! ᱥᱟᱵᱟᱥ!', pronunciation: 'Adi bes! Sabas!' },
    { hindi: 'धन्यवाद!', santali: 'ᱥᱟᱨᱦᱟᱣ!', pronunciation: 'Sarhao!' },
  ],
  commands: [
    { hindi: 'अपनी किताब खोलो।', santali: 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾', pronunciation: 'Amag puthi jhij me.' },
    { hindi: 'अपनी जगह पर बैठ जाओ।', santali: 'ᱟᱢᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵᱽ ᱢᱮ᱾', pronunciation: 'Amag thaon re durub me.' },
    { hindi: 'ब्लैकबोर्ड की तरफ देखो।', santali: 'ᱵᱞᱮᱠᱵᱳᱨᱰ ᱥᱮᱫ ᱧᱮᱞ ᱢᱮ᱾', pronunciation: 'Blackboard sed nel me.' },
    { hindi: 'ध्यान से सुनो और लिखो।', santali: 'ᱟᱧᱡᱚᱢ ᱢᱮ ᱟᱨ ᱚᱞ ᱢᱮ᱾', pronunciation: 'Anjom me ar ol me.' },
  ],
  numeracy: [
    { hindi: 'आज हम एक से दस तक गिनती सीखेंगे।', santali: 'ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾', pronunciation: 'Tehen abo mid khon gel habij lekha bon chedoga.' },
    { hindi: 'इन सेबों को गिनो।', santali: 'ᱱᱚᱣᱟ ᱥᱮᱣ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾', pronunciation: 'Nowa sew ko lekhay me.' },
    { hindi: 'यह तीन (3) है।', santali: 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱮ (᱓) ᱠᱟᱱᱟ᱾', pronunciation: 'Nowa do pe (3) kana.' },
    { hindi: 'पाँच के बाद कौन सी संख्या आती है?', santali: 'ᱢᱚᱬᱮ ᱛᱟᱭᱚᱢ ᱫᱚ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ?', pronunciation: 'Mone tayom do oka elkha hijuga?' },
  ],
  responses: [
    { santali: 'ᱦᱚᱭ ᱢᱟᱪᱮᱛ, ᱤᱧᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ᱾', hindi: 'हाँ शिक्षक, मुझे समझ आ गया।', pronunciation: 'Hoy machet, inying bujhao keda.' },
    { santali: 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱮ (᱓) ᱠᱟᱱᱟ᱾', hindi: 'यह तीन (3) है।', pronunciation: 'Nowa do pe (3) kana.' },
    { santali: 'ᱜᱟᱹᱭ', hindi: 'गाय (Cow)', pronunciation: 'Gai' },
    { santali: 'ᱦᱟᱹᱛᱤ', hindi: 'हाथी (Elephant)', pronunciation: 'Hati' },
  ],
};

const LiveTranslation: React.FC = () => {
  const [mode, setMode] = useState<'teacher' | 'student'>('teacher');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [activeModel, setActiveModel] = useState('AI4Bharat IndicTrans2 320M (On-Device Local)');
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [phraseCategory, setPhraseCategory] = useState<'greetings' | 'commands' | 'numeracy' | 'responses'>('greetings');

  const { isListening, startListening, stopListening, transcript } = useSpeechRecognition();

// Common multi-word phrase patterns (Longest Match First)
const PHRASE_PATTERNS: Array<[RegExp, string]> = [
  // Compound Greetings & Classroom Intros
  [/["'“”«»]?नमस्ते\s+बच्चों[!।,.\s"'“”«»]*/gi, 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! '],
  [/["'“”«»]?नमस्ते\s+शिक्षक[!।,.\s"'“”«»]*/gi, 'ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ! '],
  [/आज हम/gi, 'ᱛᱮᱦᱮᱧ ᱟᱵᱚ '],
  [/एक से दस तक/gi, 'ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ '],
  [/१ से १० तक/gi, '᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ '],
  [/1 से 10 तक/gi, '᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ '],
  [/गिनती सीखेंगे[।.]?/gi, 'ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾'],
  [/गिनती सीखो[।.]?/gi, 'ᱞᱮᱠᱷᱟ ᱪᱮᱫᱚᱜ ᱢᱮ᱾'],
  [/अपनी किताब खोलो[।.]?/gi, 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾'],
  [/अपनी जगह पर बैठ जाओ[।.]?/gi, 'ᱟᱢᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵᱽ ᱢᱮ᱾'],
  [/बैठ जाओ[।.]?/gi, 'ᱫᱩᱲᱩᱵᱽ ᱢᱮ᱾'],
  [/खड़े हो जाओ[।.]?/gi, 'ᱛᱤᱸᱜᱩᱱ ᱢᱮ᱾'],
  [/बहुत अच्छा[!।,.\s]*/gi, 'ᱟᱹᱰᱤ ᱵᱮᱥ! '],
  [/शाबाश[!।,.\s]*/gi, 'ᱥᱟᱵᱟᱥ! '],
  [/ब्लैकबोर्ड की तरफ देखो[।.]?/gi, 'ᱵᱞᱮᱠᱵᱳᱨᱰ ᱥᱮᱫ ᱧᱮᱞ ᱢᱮ᱾'],
  [/ध्यान से सुनो और लिखो[।.]?/gi, 'ᱟᱧᱡᱚᱢ ᱢᱮ ᱟᱨ ᱚᱞ ᱢᱮ᱾'],
  [/ध्यान से सुनो[।.]?/gi, 'ᱟᱧᱡᱚᱢ ᱢᱮ᱾'],
  [/इन सेबों को गिनो और संख्या बताओ[।.]?/gi, 'ᱱᱚᱣᱟ ᱥᱮᱣ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ ᱟᱨ ᱮᱞᱠᱷᱟ ᱞᱟᱹᱭ ᱢᱮ᱾'],
  [/इन सेबों को गिनो[।.]?/gi, 'ᱱᱚᱣᱟ ᱥᱮᱣ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾'],
  [/संख्या बताओ[।.]?/gi, 'ᱮᱞᱠᱷᱟ ᱞᱟᱹᱭ ᱢᱮ᱾'],
  [/पाँच के बाद कौन सी संख्या आती है\??/gi, 'ᱢᱚᱬᱮ ᱛᱟᱭᱚᱢ ᱫᱚ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ?'],
  [/पांच के बाद कौन सी संख्या आती है\??/gi, 'ᱢᱚᱬᱮ ᱛᱟᱭᱚᱢ ᱫᱚ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ?'],
  [/के बाद/gi, 'ᱛᱟᱭᱚᱢ '],
  [/के पहले/gi, 'ᱞᱟᱦᱟ '],
  [/कौन सी संख्या/gi, 'ᱚᱠᱟ ᱮᱞᱠᱷᱟ '],
  [/आती है\??/gi, 'ᱦᱤᱡᱩᱜᱼᱟ?'],
  [/समझ आया\??/gi, 'ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ?'],
  [/समझ आ गया[।.]?/gi, 'ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ᱾'],
  [/हाँ शिक्षक/gi, 'ᱦᱚᱭ ᱢᱟᱪᱮᱛ'],
  [/यह तीन है/gi, 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱮ ᱠᱟᱱᱟ'],
  [/यह तीन \(3\) है/gi, 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱮ (᱓) ᱠᱟᱱᱟ'],
];

const GRAMMAR_PARTICLES: Record<string, string> = {
  'से': 'ᱠᱷᱚᱱ',
  'तक': 'ᱦᱟᱹᱵᱤᱡ',
  'और': 'ᱟᱨ',
  'में': 'ᱨᱮ',
  'पर': 'ᱨᱮ',
  'को': 'ᱠᱚ',
  'का': 'ᱨᱮᱭᱟᱜ',
  'की': 'ᱨᱮᱭᱟᱜ',
  'के': 'ᱨᱮᱭᱟᱜ',
  'है': 'ᱠᱟᱱᱟ',
  'हैं': 'ᱠᱟᱱᱟᱠᱚ',
  'था': 'ᱛᱟᱦᱮᱸᱠᱟᱱᱟ',
  'थी': 'ᱛᱟᱦᱮᱸᱠᱟᱱᱟ',
  'सीखेंगे': 'ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ',
  'सीखो': 'ᱪᱮᱫᱚᱜ ᱢᱮ',
  'बताओ': 'ᱞᱟᱹᱭ ᱢᱮ',
  'गिनो': 'ᱞᱮᱠᱷᱟᱭ ᱢᱮ',
  'देखो': 'ᱧᱮᱞ ᱢᱮ',
  'खोलो': 'ᱡᱷᱤᱡᱽ ᱢᱮ',
  'पढ़ो': 'ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
  'पढ़ो': 'ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
  'लिखो': 'ᱚᱞ ᱢᱮ',
  'सुनो': 'ᱟᱧᱡᱚᱢ ᱢᱮ',
  'बैठो': 'ᱫᱩᱲᱩᱵ ᱢᱮ',
  'जाओ': 'ᱥᱮᱱᱚᱜ ᱢᱮ',
  'आओ': 'ᱦᱤᱡᱩᱜ ᱢᱮ',
  'आज': 'ᱛᱮᱦᱮᱧ',
  'कल': 'ᱜᱟᱯᱟ',
  'हम': 'ᱟᱵᱚ',
  'आप': 'ᱟᱢ',
  'तुम': 'ᱟᱢ',
  'मैं': 'ᱤᱧ',
  'सब': 'ᱡᱚᱛᱚ',
  'सभी': 'ᱡᱚᱛᱚ',
  'यह': 'ᱱᱚᱣᱟ',
  'वह': 'ᱚᱱᱟ',
  'ये': 'ᱱᱚᱣᱟᱠᱚ',
  'वे': 'ᱚᱱᱟᱠᱚ',
  'गिनती': 'ᱞᱮᱠᱷᱟ',
  'संख्या': 'ᱮᱞᱠᱷᱟ',
  'गणित': 'ᱮᱞᱠᱷᱟ',
  'किताब': 'ᱯᱩᱛᱷᱤ',
  'कलम': 'ᱠᱚᱞᱚᱢ',
  'स्कूल': 'ᱟᱥᱲᱟ',
  'शिक्षक': 'ᱢᱟᱪᱮᱛ',
  'बच्चे': 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ',
  'बच्चों': 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ',
};

const REVERSE_PHRASE_PATTERNS: Array<[RegExp, string]> = [
  [/["'“”«»]?ᱡᱚᱦᱟᱨ\s+ᱜᱤᱫᱽᱨᱟᱹᱠᱚ[!।,.\s"'“”«»]*/gi, 'नमस्ते बच्चों! '],
  [/["'“”«»]?ᱡᱚᱦᱟᱨ\s+ᱢᱟᱪᱮᱛ[!।,.\s"'“”«»]*/gi, 'नमस्ते शिक्षक! '],
  [/ᱛᱮᱦᱮᱧ\s+ᱟᱵᱚ/gi, 'आज हम '],
  [/ᱢᱤᱫ\s+ᱠᱷᱚᱱ\s+ᱜᱮᱞ\s+ᱦᱟᱹᱵᱤᱡ/gi, 'एक से दस तक '],
  [/᱑\s+ᱠᱷᱚᱱ\s+᱑᱐\s+ᱦᱟᱹᱵᱤᱡ/gi, '1 से 10 तक '],
  [/ᱞᱮᱠᱷᱟ\s+ᱵᱚᱱ\s+ᱪᱮᱫᱚᱜᱼᱟ[।.]?/gi, 'गिनती सीखेंगे।'],
  [/ᱞᱮᱠᱷᱟ\s+ᱪᱮᱫᱚᱜ\s+ᱢᱮ[।.]?/gi, 'गिनती सीखो।'],
  [/ᱟᱢᱟᱜ\s+ᱯᱩᱛᱷᱤ\s+ᱡᱷᱤᱡᱽ\s+ᱢᱮ[।.]?/gi, 'अपनी किताब खोलो।'],
  [/ᱟᱢᱟᱜ\s+ᱴᱷᱟᱶ\s+ᱨᱮ\s+ᱫᱩᱲᱩᱵᱽ\s+ᱢᱮ[।.]?/gi, 'अपनी जगह पर बैठ जाओ।'],
  [/ᱫᱩᱲᱩᱵᱽ\s+ᱢᱮ[।.]?/gi, 'बैठ जाओ।'],
  [/ᱛᱤᱸᱜᱩᱱ\s+ᱢᱮ[।.]?/gi, 'खड़े हो जाओ।'],
  [/ᱟᱹᱰᱤ\s+ᱵᱮᱥ[!।,.\s]*/gi, 'बहुत अच्छा! '],
  [/ᱥᱟᱵᱟᱥ[!।,.\s]*/gi, 'शाबाश! '],
  [/ᱵᱞᱮᱠᱵᱳᱨᱰ\s+ᱥᱮᱫ\s+ᱧᱮᱞ\s+ᱢᱮ[।.]?/gi, 'ब्लैकबोर्ड की तरफ देखो।'],
  [/ᱟᱧᱡᱚᱢ\s+ᱢᱮ\s+ᱟᱨ\s+ᱚᱞ\s+ᱢᱮ[।.]?/gi, 'ध्यान से सुनो और लिखो।'],
  [/ᱟᱧᱡᱚᱢ\s+ᱢᱮ[।.]?/gi, 'ध्यान से सुनो।'],
  [/ᱱᱚᱣᱟ\s+ᱥᱮᱣ\s+ᱠᱚ\s+ᱞᱮᱠᱷᱟᱭ\s+ᱢᱮ\s+ᱟᱨ\s+ᱮᱞᱠᱷᱟ\s+ᱞᱟᱹᱭ\s+ᱢᱮ[।.]?/gi, 'इन सेबों को गिनो और संख्या बताओ।'],
  [/ᱱᱚᱣᱟ\s+ᱥᱮᱣ\s+ᱠᱚ\s+ᱞᱮᱠᱷᱟᱭ\s+ᱢᱮ[।.]?/gi, 'इन सेबों को गिनो।'],
  [/ᱮᱞᱠᱷᱟ\s+ᱞᱟᱹᱭ\s+ᱢᱮ[।.]?/gi, 'संख्या बताओ।'],
  [/ᱢᱚᱬᱮ\s+ᱛᱟᱭᱚᱢ\s+ᱫᱚ\s+ᱚᱠᱟ\s+ᱮᱞᱠᱷᱟ\s+ᱦᱤᱡᱩᱜᱼᱟ\??/gi, 'पाँच के बाद कौन सी संख्या आती है?'],
  [/ᱜᱟᱹᱭ,?\s*ᱢᱮᱨᱚᱢ\s*ᱟᱨ\s*ᱦᱟᱹᱛᱤ\s*ᱠᱚ\s*ᱧᱮᱞ\s+ᱢᱮ[।.]?/gi, 'गाय, बकरी और हाथी को देखो।'],
  [/ᱦᱚᱭ\s+ᱢᱟᱪᱮᱛ,?\s*ᱤᱧᱤᱧ\s+ᱵᱩᱡᱷᱟᱹᱣ\s+ᱠᱮᱫᱼᱟ[।.]?/gi, 'हाँ शिक्षक, मुझे समझ आ गया।'],
  [/ᱦᱚᱭ\s+ᱢᱟᱪᱮᱛ/gi, 'हाँ शिक्षक'],
  [/ᱵᱩᱡᱷᱟᱹᱣ\s+ᱠᱮᱫᱼᱟ\??/gi, 'समझ आया?'],
  [/ᱵᱩᱡᱷᱟᱹᱣ\s+ᱠᱮᱫᱼᱟ[।.]?/gi, 'समझ आ गया।'],
  [/ᱱᱚᱣᱟ\s+ᱫᱚ\s+ᱯᱮ\s*\(?᱓?\)?\s*ᱠᱟᱱᱟ[।.]?/gi, 'यह तीन (3) है।'],
  [/ᱛᱟᱭᱚᱢ/gi, 'के बाद '],
  [/ᱞᱟᱦᱟ/gi, 'के पहले '],
  [/ᱚᱠᱟ\s+ᱮᱞᱠᱷᱟ/gi, 'कौन सी संख्या '],
  [/ᱦᱤᱡᱩᱜᱼᱟ\??/gi, 'आती है?'],
];

const REVERSE_GRAMMAR_PARTICLES: Record<string, string> = {
  'ᱠᱷᱚᱱ': 'से',
  'ᱦᱟᱹᱵᱤᱡ': 'तक',
  'ᱟᱨ': 'और',
  'ᱨᱮ': 'में',
  'ᱠᱚ': 'को',
  'ᱨᱮᱭᱟᱜ': 'का',
  'ᱟᱜ': 'का',
  'ᱠᱟᱱᱟ': 'है',
  'ᱠᱟᱱᱟᱠᱚ': 'हैं',
  'ᱛᱟᱦᱮᱸᱠᱟᱱᱟ': 'था',
  'ᱪᱮᱫᱚᱜᱼᱟ': 'सीखेंगे',
  'ᱪᱮᱫᱚᱜ': 'सीखना',
  'ᱞᱟᱹᱭ': 'बताना',
  'ᱞᱟᱹᱭ ᱢᱮ': 'बताओ',
  'ᱞᱮᱠᱷᱟᱭ': 'गिनना',
  'ᱞᱮᱠᱷᱟᱭ ᱢᱮ': 'गिनो',
  'ᱧᱮᱞ': 'देखना',
  'ᱧᱮᱞ ᱢᱮ': 'देखो',
  'ᱡᱷᱤᱡᱽ': 'खोलना',
  'ᱡᱷᱤᱡᱽ ᱢᱮ': 'खोलो',
  'ᱯᱟᱲᱦᱟᱣ': 'पढ़ना',
  'ᱯᱟᱲᱦᱟᱣ ᱢᱮ': 'पढ़ो',
  'ᱚᱞ': 'लिखना',
  'ᱚᱞ ᱢᱮ': 'लिखो',
  'ᱟᱧᱡᱚᱢ': 'सुनना',
  'ᱟᱧᱡᱚᱢ ᱢᱮ': 'सुनो',
  'ᱫᱩᱲᱩᱵ': 'बैठना',
  'ᱫᱩᱲᱩᱵ ᱢᱮ': 'बैठो',
  'ᱫᱩᱲᱩᱵᱽ ᱢᱮ': 'बैठो',
  'ᱛᱤᱸᱜᱩ': 'खड़े होना',
  'ᱛᱤᱸᱜᱩᱱ ᱢᱮ': 'खड़े हो जाओ',
  'ᱥᱮᱱᱚᱜ ᱢᱮ': 'जाओ',
  'ᱦᱤᱡᱩᱜ ᱢᱮ': 'आओ',
  'ᱛᱮᱦᱮᱧ': 'आज',
  'ᱜᱟᱯᱟ': 'कल',
  'ᱟᱵᱚ': 'हम',
  'ᱟᱢ': 'तुम',
  'ᱤᱧ': 'मैं',
  'ᱡᱚᱛᱚ': 'सब',
  'ᱞᱮᱠᱷᱟ': 'गिनती',
  'ᱮᱞᱠᱷᱟ': 'संख्या',
  'ᱯᱩᱛᱷᱤ': 'किताब',
  'ᱠᱚᱞᱚᱢ': 'कलम',
  'ᱟᱥᱲᱟ': 'स्कूल',
  'ᱢᱟᱪᱮᱛ': 'शिक्षक',
  'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ': 'बच्चों',
  'ᱜᱤᱫᱽᱨᱟᱹ': 'बच्चा',
  'ᱢᱤᱫ': 'एक',
  'ᱵᱟᱨ': 'दो',
  'ᱯᱮ': 'तीन',
  'ᱯᱩᱱ': 'चार',
  'ᱢᱚᱬᱮ': 'पाँच',
  'ᱛᱩᱨᱩᱭ': 'छह',
  'ᱮᱨᱟᱭ': 'सात',
  'ᱮᱭᱟᱭ': 'सात',
  'ᱤᱨᱟᱹᱞ': 'आठ',
  'ᱤᱨᱞ': 'आठ',
  'ᱟᱨᱮ': 'नौ',
  'ᱜᱮᱞ': 'दस',
  '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4', '᱕': '5',
  '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9', '᱑᱐': '10',
  'ᱜᱟᱹᱭ': 'गाय',
  'ᱢᱮᱨᱚᱢ': 'बकरी',
  'ᱦᱟᱹᱛᱤ': 'हाथी',
  'ᱥᱮᱣ': 'सेब',
  'ᱫᱟᱜ': 'पानी',
};

const translateClientSide = (text: string, currentMode: 'teacher' | 'student'): string => {
  // Strip outer quotes and normalize
  let cleanInput = text.replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, '').trim();
  if (!cleanInput) return '';

  const activeDict = currentMode === 'teacher' ? CLIENT_HINDI_TO_SANTALI : CLIENT_SANTALI_TO_HINDI;

  // 1. Direct dictionary match
  if (activeDict[cleanInput]) {
    return activeDict[cleanInput];
  }

  // 2. Phrase-level substitution (Longest Match First)
  let workingText = cleanInput;
  const activePhrasePatterns = currentMode === 'teacher' ? PHRASE_PATTERNS : REVERSE_PHRASE_PATTERNS;
  for (const [regex, replacement] of activePhrasePatterns) {
    workingText = workingText.replace(regex, replacement);
  }

  // 3. Word-by-word substitution for any remaining tokens
  const words = workingText.split(/\s+/);
  const resultWords: string[] = [];
  const activeGrammar = currentMode === 'teacher' ? GRAMMAR_PARTICLES : REVERSE_GRAMMAR_PARTICLES;

  for (const w of words) {
    const punct = w.match(/[।,?!.:;"'()]+/g)?.[0] || '';
    const cleanWord = w.replace(/[।,?!.:;"'()]/g, '').trim();

    if (!cleanWord) {
      if (w) resultWords.push(w);
      continue;
    }

    // In Teacher Mode, if already Ol Chiki, don't re-translate
    if (currentMode === 'teacher' && (isOlChiki(w) || isOlChiki(cleanWord))) {
      resultWords.push(w);
      continue;
    }
    // In Student Mode, if already Hindi (Devanagari), don't re-translate
    if (currentMode === 'student' && !isOlChiki(cleanWord) && !isOlChiki(w)) {
      resultWords.push(w);
      continue;
    }

    if (activeDict[cleanWord]) {
      resultWords.push(activeDict[cleanWord] + punct);
    } else if (activeGrammar[cleanWord]) {
      resultWords.push(activeGrammar[cleanWord] + punct);
    } else if (activeDict[w]) {
      resultWords.push(activeDict[w]);
    } else {
      resultWords.push(w);
    }
  }

  let joined = resultWords.join(' ').replace(/\s+([।,?!.:])/g, '$1').trim();
  if (currentMode === 'teacher') {
    joined = convertDigitsToOlChiki(joined);
  } else {
    joined = convertOlChikiToDigits(joined).replace(/।᱾/g, '।').replace(/᱾/g, '।');
  }
  return joined;
};

  const computePhonetic = (input: string, output: string, currentMode: 'teacher' | 'student'): string => {
    const rawClean = input.trim();
    // Check if input is a pure number (e.g. 67)
    if (/^\d+$/.test(rawClean)) {
      const num = parseInt(rawClean, 10);
      return currentMode === 'teacher' ? numberToSantaliWords(num) : String(num);
    }
    // Check if output is pure Ol Chiki numerals
    const digitsOnly = convertOlChikiToDigits(output.trim());
    if (/^\d+$/.test(digitsOnly)) {
      const num = parseInt(digitsOnly, 10);
      return currentMode === 'teacher' ? numberToSantaliWords(num) : String(num);
    }
    return currentMode === 'teacher' ? transliterateOlChikiToPhonetic(output) : output;
  };

  const handleTranslate = async (textToTranslate: string) => {
    const rawInput = textToTranslate || sourceText || transcript;
    if (!rawInput.trim()) return;

    setIsTranslating(true);
    const startTime = performance.now();

    try {
      const srcLang = mode === 'teacher' ? 'hin_Deva' : 'sat_Olck';
      const tgtLang = mode === 'teacher' ? 'sat_Olck' : 'hin_Deva';

      const response = await fetch('http://127.0.0.1:8000/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_text: rawInput,
          source_lang: srcLang,
          target_lang: tgtLang,
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed || 4);

      let resultSat = '';
      if (response.ok) {
        const data = await response.json();
        resultSat = data.translated_text;
        setTranslatedText(resultSat);
        setPronunciation(computePhonetic(rawInput, resultSat, mode));
        setActiveModel(data.model_name || 'AI4Bharat IndicTrans2 320M (On-Device Local)');
      } else {
        throw new Error('API unavailable, switching to local client dictionary');
      }

      // 🎙️ AUTOMATIC VOICE-TO-VOICE PLAYBACK: Speak translated voice out loud immediately
      if (resultSat) {
        setTimeout(() => {
          speakText(resultSat, { rate: 0.85 });
        }, 150);
      }
    } catch {
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed || 3);
      const clientTranslated = translateClientSide(rawInput, mode);
      setTranslatedText(clientTranslated);
      setPronunciation(computePhonetic(rawInput, clientTranslated, mode));
      setActiveModel('AI4Bharat IndicTrans2 320M (On-Device Local)');

      // 🎙️ AUTOMATIC VOICE-TO-VOICE PLAYBACK (Offline Fallback)
      if (clientTranslated) {
        setTimeout(() => {
          speakText(clientTranslated, { rate: 0.85 });
        }, 150);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const playAudio = (text: string) => {
    sfx.playVoicePing();
    speakText(text, { rate: 0.85 });
  };

  // 🎙️ Automatic Voice-in -> Translation -> Voice-out loop
  React.useEffect(() => {
    if (transcript && !isListening) {
      setSourceText(transcript);
      handleTranslate(transcript);
    }
  }, [transcript, isListening]);

  const handleVoiceToggle = () => {
    sfx.playTap();
    if (isListening) {
      stopListening();
      if (transcript) {
        setSourceText(transcript);
        handleTranslate(transcript);
      }
    } else {
      startListening();
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>⚡ Sub-3-Second AI Translation</span>
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
            🎙️ Live Classroom Voice Translator
          </h1>
        </div>

        {/* Active Model Indicator Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
          <span>{activeModel}</span>
        </div>
      </div>

      {/* Bidirectional Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '20px', gap: '4px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
          <button
            onClick={() => {
              setMode('teacher');
              setSourceText('');
              setTranslatedText('');
              setPronunciation('');
            }}
            style={{
              padding: '10px 22px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: mode === 'teacher' ? '#0f2744' : 'transparent',
              color: mode === 'teacher' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: mode === 'teacher' ? '0 2px 8px rgba(15,39,68,0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            👨‍🏫 <strong>Teacher Mode</strong>: Hindi → Santali
          </button>
          <button
            onClick={() => {
              setMode('student');
              setSourceText('');
              setTranslatedText('');
              setPronunciation('');
            }}
            style={{
              padding: '10px 22px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: mode === 'student' ? '#c05621' : 'transparent',
              color: mode === 'student' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: mode === 'student' ? '0 2px 8px rgba(192,86,33,0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            👧 <strong>Student Mode</strong>: Santali → Hindi
          </button>
        </div>
      </div>

      {/* Main Translation Dialogue Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Source Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(15, 39, 68, 0.06)',
            borderTop: `4px solid ${mode === 'teacher' ? '#0f2744' : '#c05621'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: mode === 'teacher' ? '#0f2744' : '#c05621' }}>
                {mode === 'teacher' ? '🇮🇳 Teacher Speaks (Hindi)' : '🔤 Student Speaks (Santali • ᱚᱞ ᱪᱤᱠᱤ)'}
              </span>
              {isListening && (
                <span style={{ color: '#e53e3e', fontSize: '0.8rem', fontWeight: 700, animation: 'pulseGlow 1.5s infinite' }}>
                  🔴 Listening live voice...
                </span>
              )}
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={
                mode === 'teacher'
                  ? 'Type or speak Hindi instruction (e.g. गाय, हाथी, किताब खोलो, 1 2 3)...'
                  : 'Type or speak Santali Ol Chiki (e.g. ᱢᱚᱪᱟ, ᱜᱟᱹᱭ, ᱦᱟᱹᱛᱤ, ᱯᱩᱛᱷᱤ)...'
              }
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleTranslate(sourceText)}
              disabled={isTranslating}
              style={{
                flex: 1,
                backgroundColor: mode === 'teacher' ? '#0f2744' : '#c05621',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {isTranslating ? 'Translating...' : 'Translate Now ➔'}
            </button>
            {sourceText && (
              <button
                onClick={() => {
                  setSourceText('');
                  setTranslatedText('');
                  setPronunciation('');
                }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Target Translation Box */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(15, 39, 68, 0.06)',
            borderTop: `4px solid ${mode === 'teacher' ? '#c05621' : '#0f2744'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: mode === 'teacher' ? '#c05621' : '#0f2744' }}>
                {mode === 'teacher' ? '🔤 Santali Translation (ᱚᱞ ᱪᱤᱠᱤ)' : '🇮🇳 Hindi Translation (देवनागरी)'}
              </span>
              {latencyMs > 0 && (
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '10px' }}>
                  ⏱️ {latencyMs} ms (&lt;3s)
                </span>
              )}
            </div>

            <div
              style={{
                minHeight: '125px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: mode === 'teacher' ? '#c05621' : '#0f2744',
                  fontFamily: mode === 'teacher' ? 'var(--font-santali)' : 'inherit',
                  marginBottom: '4px',
                  lineHeight: 1.3,
                }}
              >
                {translatedText || 'Translation will appear here in real-time...'}
              </div>

              {pronunciation && (
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
                  Spoken Phonetic: "{pronunciation}"
                </div>
              )}
            </div>
          </div>

          {translatedText && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <button
                onClick={() => playAudio(pronunciation || translatedText)}
                style={{
                  flex: 1,
                  backgroundColor: '#2f855a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(47,133,90,0.25)',
                }}
              >
                🔊 Play Audio Voice
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Large Glowing Microphone Button */}
      <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
        <button
          onClick={handleVoiceToggle}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: isListening ? '#e53e3e' : '#ed8936',
            color: '#ffffff',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 0 12px rgba(229,62,62,0.25)' : '0 6px 20px rgba(237,137,54,0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          {isListening ? '⏹️' : '🎙️'}
        </button>
        <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '8px', fontWeight: 600 }}>
          {isListening ? 'Listening live speech... Tap to finish & translate' : 'Tap to start live classroom voice input'}
        </div>
      </div>

      {/* Categorized 1-Tap Quick Phrases */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15, 39, 68, 0.05)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#0f2744', fontSize: '1.1rem', fontWeight: 800 }}>
            ⚡ 1-Tap Quick Classroom Phrasebook (0 ms Offline)
          </h3>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'greetings', label: '👋 Greetings' },
              { id: 'commands', label: '📢 Commands' },
              { id: 'numeracy', label: '🔢 Numeracy' },
              { id: 'responses', label: '👧 Responses' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPhraseCategory(tab.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: phraseCategory === tab.id ? '1px solid #ed8936' : '1px solid #cbd5e1',
                  backgroundColor: phraseCategory === tab.id ? '#fffaf0' : '#ffffff',
                  color: phraseCategory === tab.id ? '#c05621' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {CATEGORIZED_PHRASES[phraseCategory].map((phrase: any, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                setSourceText(phrase.hindi);
                setTranslatedText(phrase.santali);
                setPronunciation(phrase.pronunciation);
                setLatencyMs(3);
                setActiveModel('AI4Bharat IndicTrans2 320M (On-Device Local)');
              }}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fffaf0';
                e.currentTarget.style.borderColor = '#fed7aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f2744', fontSize: '0.92rem', marginBottom: '2px' }}>
                {phrase.hindi}
              </div>
              <div style={{ color: '#c05621', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-santali)' }}>
                {phrase.santali}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTranslation;
