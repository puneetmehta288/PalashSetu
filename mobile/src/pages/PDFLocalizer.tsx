import React, { useState } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';
import { COMPREHENSIVE_HINDI_TO_SANTALI } from '../data/santali_comprehensive_dictionary';
import { transliterateDevanagariToOlChiki } from '../utils/santaliSpeech';

interface TextbookParagraph {
  id: number;
  hindi: string;
  santali: string;
  pronunciation: string;
  visual?: string;
  vocab?: Array<{ hin: string; sat: string }>;
}

interface TextbookChapter {
  id: string;
  title_hin: string;
  title_sat: string;
  grade: string;
  subject: string;
  chapter_no: number;
  summary_hin: string;
  summary_sat: string;
  paragraphs: TextbookParagraph[];
}

// ─────────────────────────────────────────────────────────────
// PRE-LOADED OFFICIAL JCERT STATE TEXTBOOK CHAPTERS
// ─────────────────────────────────────────────────────────────
const JCERT_CHAPTERS: TextbookChapter[] = [
  {
    id: 'math_ch1',
    chapter_no: 1,
    grade: 'Class 1',
    subject: 'Mathematics (गणित खेल)',
    title_hin: 'संख्याएँ और गिनती: एक से दस तक',
    title_sat: 'ᱮᱞᱠᱷᱟ ᱟᱨ ᱞᱮᱠᱷᱟ: ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ',
    summary_hin: 'वस्तुओं को गिनना, संख्याओं की पहचान और एक से दस तक की समझ।',
    summary_sat: 'ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟ, ᱮᱞᱠᱷᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱵᱩᱡᱷᱟᱹᱣ᱾',
    paragraphs: [
      {
        id: 1,
        hindi: 'नमस्ते बच्चों! आज हम सब मिलकर अपने आसपास की वस्तुओं को गिनना सीखेंगे।',
        santali: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱡᱚᱛᱚ ᱦᱚᱲ ᱟᱵᱚᱣᱟᱜ ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾',
        pronunciation: 'Johar gidrako! Tehen abo joto hor abowag sur renag jinis ko lekha bon chedoga.',
        visual: '🏫 🎒 🍎',
        vocab: [{ hin: 'नमस्ते', sat: 'ᱡᱚᱦᱟᱨ' }, { hin: 'बच्चे', sat: 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ' }, { hin: 'गिनना', sat: 'ᱞᱮᱠᱷᱟ' }]
      },
      {
        id: 2,
        hindi: 'यहाँ एक लाल सेब है। एक को संताली में "मिद" (ᱢᱤᱫ) कहते हैं। 1 = ᱢᱤᱫ',
        santali: 'ᱱᱚᱸᱰᱮ ᱢᱤᱫᱴᱟᱝ ᱟᱨᱟᱜ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱑ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱢᱤᱫ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱑ = ᱢᱤᱫ',
        pronunciation: 'Nonde mid-tang arag sew menaga. 1 do Santali te "Mid" bon metaga. 1 = Mid',
        visual: '🍎 (1)',
        vocab: [{ hin: 'एक', sat: 'ᱢᱤᱫ' }, { hin: 'लाल', sat: 'ᱟᱨᱟᱜ' }, { hin: 'सेब', sat: 'ᱥᱮᱣ' }]
      },
      {
        id: 3,
        hindi: 'अब इन दो गायों को देखो। दो को संताली में "बार" (ᱵᱟᱨ) कहते हैं। 2 = ᱵᱟᱨ',
        santali: 'ᱱᱤᱛᱚᱜ ᱱᱚᱣᱟ ᱵᱟᱨᱭᱟ ᱜᱟᱹᱭ ᱠᱤᱱ ᱧᱮᱞ ᱵᱤᱱ᱾ ᱒ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱵᱟᱨ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱒ = ᱵᱟᱨ',
        pronunciation: 'Nitog nowa barya gai kin nel bin. 2 do Santali te "Bar" bon metaga. 2 = Bar',
        visual: '🐄🐄 (2)',
        vocab: [{ hin: 'दो', sat: 'ᱵᱟᱨ' }, { hin: 'गाय', sat: 'ᱜᱟᱹᱭ' }, { hin: 'देखो', sat: 'ᱧᱮᱞ ᱢᱮ' }]
      },
      {
        id: 4,
        hindi: 'पेड़ पर तीन चिड़ियाँ बैठी हैं। तीन को संताली में "पे" (ᱯᱮ) कहते हैं। 3 = ᱯᱮ',
        santali: 'ᱫᱟᱨᱮ ᱨᱮ ᱯᱮᱭᱟ ᱪᱮᱬᱮ ᱠᱚ ᱫᱩᱲᱩᱵ ᱟᱠᱟᱱᱟ᱾ ᱓ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱯᱮ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱓ = ᱯᱮ',
        pronunciation: 'Dare re peya chene ko durub akana. 3 do Santali te "Pe" bon metaga. 3 = Pe',
        visual: '🌳 🐦🐦🐦 (3)',
        vocab: [{ hin: 'तीन', sat: 'ᱯᱮ' }, { hin: 'पेड़', sat: 'ᱫᱟᱨᱮ' }, { hin: 'चिड़िया', sat: 'ᱪᱮᱬᱮ' }]
      },
      {
        id: 5,
        hindi: 'पाँच उँगलियाँ: एक हाथ में पाँच उँगलियाँ होती हैं। पाँच को "मोणे" (ᱢᱚᱬᱮ) कहते हैं। 5 = ᱢᱚᱬᱮ',
        santali: 'ᱢᱚᱬᱮ ᱠᱟᱹᱴᱩᱵ: ᱢᱤᱫ ᱛᱤ ᱨᱮ ᱢᱚᱬᱮ ᱠᱟᱹᱴᱩᱵ ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱕ ᱫᱚ "ᱢᱚᱬᱮ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱕ = ᱢᱚᱬᱮ',
        pronunciation: 'Mone katub: mid ti re mone katub tahena. 5 do "Mone" bon metaga. 5 = Mone',
        visual: '🖐️ (5)',
        vocab: [{ hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }, { hin: 'हाथ', sat: 'ᱛᱤ' }, { hin: 'उँगलियाँ', sat: 'ᱠᱟᱹᱴᱩᱵ' }]
      },
      {
        id: 6,
        hindi: 'दस तारे: जब हम नौ में एक जोड़ते हैं तो दस (10 = ᱜᱮᱞ) बन जाता है। शाबाश बच्चों!',
        santali: 'ᱜᱮᱞ ᱤᱯᱤᱞ: ᱡᱚᱠᱷᱚᱱ ᱟᱵᱚ ᱟᱨᱮ ᱨᱮ ᱢᱤᱫ ᱵᱚᱱ ᱡᱚᱲᱟᱣᱟ ᱩᱱᱫᱚ ᱜᱮᱞ (᱑᱐ = ᱜᱮᱞ) ᱦᱩᱭᱩᱜᱼᱟ᱾ ᱥᱟᱵᱟᱥ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!',
        pronunciation: 'Gel ipil: jokhon abo are re mid bon jorawa undo gel (10 = Gel) huyuga. Sabas gidrako!',
        visual: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10)',
        vocab: [{ hin: 'दस', sat: 'ᱜᱮᱞ' }, { hin: 'तारे', sat: 'ᱤᱯᱤᱞ' }, { hin: 'शाबाश', sat: 'ᱥᱟᱵᱟᱥ' }]
      }
    ]
  },
  {
    id: 'math_ch2',
    chapter_no: 2,
    grade: 'Class 1',
    subject: 'Mathematics (गणित खेल)',
    title_hin: 'आकृतियाँ और स्थान: गोल, चौकोर और तिकोना',
    title_sat: 'ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱴᱷᱟᱶ: ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ ᱟᱨ ᱯᱮ ᱠᱳᱬ',
    summary_hin: 'विभिन्न ज्यामितीय आकृतियों और आकार की समझ।',
    summary_sat: 'ᱟᱭᱢᱟ ᱞᱮᱠᱟᱱ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱢᱩᱴᱷᱟᱹᱱ ᱵᱩᱡᱷᱟᱹᱣ᱾',
    paragraphs: [
      {
        id: 1,
        hindi: 'सूरज और गेंद गोल होते हैं। गोल आकार को संताली में "गुल" (ᱜᱩᱞ) कहते हैं।',
        santali: 'ᱵᱮᱨᱟ ᱟᱨ ᱵᱚᱞ ᱫᱚ ᱜᱩᱞ ᱜᱮᱭᱟ᱾ ᱜᱩᱞ ᱢᱩᱴᱷᱟᱹᱱ ᱫᱚ "ᱜᱩᱞ" (ᱜᱩᱞ) ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
        pronunciation: 'Bera ar bol do gul geya. Gul muthan do "Gul" bon metaga.',
        visual: '☀️ ⚽ ⭕ (ᱜᱩᱞ - Circle)',
        vocab: [{ hin: 'सूरज', sat: 'ᱵᱮᱨᱟ' }, { hin: 'गोल', sat: 'ᱜᱩᱞ' }]
      },
      {
        id: 2,
        hindi: 'किताब और कैरम बोर्ड चौकोर होते हैं। चौकोर को "चारकोना / चार्खी" (ᱪᱟᱹᱨᱠᱷᱤ) कहते हैं।',
        santali: 'ᱯᱩᱛᱷᱤ ᱟᱨ ᱠᱮᱨᱚᱢ ᱵᱳᱨᱰ ᱫᱚ ᱯᱩᱱ ᱠᱳᱬ ᱜᱮᱭᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ "ᱪᱟᱹᱨᱠᱷᱤ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
        pronunciation: 'Puthi ar carrom board do pun kon geya. Nowa do "Carkhi" bon metaga.',
        visual: '📖 🔲 (ᱪᱟᱹᱨᱠᱷᱤ - Square)',
        vocab: [{ hin: 'किताब', sat: 'ᱯᱩᱛᱷᱤ' }, { hin: 'चौकोर', sat: 'ᱪᱟᱹᱨᱠᱷᱤ' }]
      },
      {
        id: 3,
        hindi: 'समोसा और पहाड़ तिकोने होते हैं। तीन कोनों वाली आकृति को "पे कोना" (ᱯᱮ ᱠᱳᱬ) कहते हैं।',
        santali: 'ᱥᱟᱢᱚᱥᱟ ᱟᱨ ᱵᱩᱨᱩ ᱫᱚ ᱯᱮ ᱠᱳᱬ ᱜᱮᱭᱟ᱾ ᱯᱮᱭᱟ ᱠᱳᱬ ᱢᱩᱴᱷᱟᱹᱱ ᱫᱚ "ᱯᱮ ᱠᱳᱬ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
        pronunciation: 'Samosa ar buru do pe kon geya. Peya kon muthan do "Pe Kon" bon metaga.',
        visual: '⛰️ 🔺 (ᱯᱮ ᱠᱳᱬ - Triangle)',
        vocab: [{ hin: 'पहाड़', sat: 'ᱵᱩᱨᱩ' }, { hin: 'तिकोना', sat: 'ᱯᱮ ᱠᱳᱬ' }]
      }
    ]
  },
  {
    id: 'story_ch3',
    chapter_no: 3,
    grade: 'Balvatika & Class 1',
    subject: 'Language & FLN (कहानी समय)',
    title_hin: 'प्यासा कौवा और मिट्टी का घड़ा',
    title_sat: 'ᱛᱮᱛᱟᱝ ᱠᱟᱦᱩ ᱟᱨ ᱦᱟᱥᱟ ᱴᱩᱠᱩᱡ',
    summary_hin: 'एक होशियार कौवे की प्रसिद्ध लोककथा और कठिन परिश्रम का फल।',
    summary_sat: 'ᱢᱤᱫ ᱪᱟᱞᱟᱠ ᱠᱟᱦᱩ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱦᱱᱤ ᱟᱨ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱨᱮᱭᱟᱜ ᱚᱨᱡᱚ᱾',
    paragraphs: [
      {
        id: 1,
        hindi: 'एक जंगल में एक कौवा रहता था। एक दिन उसे बहुत तेज प्यास लगी।',
        santali: 'ᱢᱤᱫᱴᱟᱝ ᱵᱤᱨ ᱨᱮ ᱢᱤᱫ ᱠᱟᱦᱩ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱢᱤᱫ ᱫᱤᱱ ᱩᱱᱤ ᱟᱹᱰᱤ ᱛᱮᱛᱟᱝ ᱠᱮᱫᱮᱭᱟ᱾',
        pronunciation: 'Mid-tang bir re mid kahu tahekana. Mid din uni adi tetang kedeya.',
        visual: '🌲 🦅 ☀️',
        vocab: [{ hin: 'जंगल', sat: 'ᱵᱤᱨ' }, { hin: 'कौवा', sat: 'ᱠᱟᱦᱩ' }, { hin: 'प्यास', sat: 'ᱛᱮᱛᱟᱝ' }]
      },
      {
        id: 2,
        hindi: 'उसने बगीचे में एक घड़ा देखा। घड़े में बहुत कम पानी था।',
        santali: 'ᱩᱱᱤ ᱵᱟᱜᱟᱱ ᱨᱮ ᱢᱤᱫ ᱴᱩᱠᱩᱡ ᱮ ᱧᱮᱞ ᱠᱮᱫᱼᱟ᱾ ᱴᱩᱠᱩᱡ ᱨᱮ ᱟᱹᱰᱤ ᱠᱚᱢ ᱫᱟᱜ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾',
        pronunciation: 'Uni bagan re mid tukuj e nel keda. Tukuj re adi kom dag tahekana.',
        visual: '🏺 💧',
        vocab: [{ hin: 'घड़ा', sat: 'ᱴᱩᱠᱩᱡ' }, { hin: 'पानी', sat: 'ᱫᱟᱜ' }, { hin: 'कम', sat: 'ᱠᱚᱢ' }]
      },
      {
        id: 3,
        hindi: 'कौवे ने अपनी चोंच से छोटे-छोटे कंकड़ घड़े में डाले। पानी ऊपर आ गया।',
        santali: 'ᱠᱟᱦᱩ ᱟᱡᱟᱜ ᱛᱷᱚᱱᱴ ᱛᱮ ᱦᱩᱰᱤᱧ ᱦᱩᱰᱤᱧ ᱫᱷᱤᱨᱤ ᱴᱩᱠᱩᱡ ᱨᱮ ᱠᱷᱟᱫᱞᱮ ᱠᱮᱫᱼᱟ᱾ ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ ᱮᱱᱟ᱾',
        pronunciation: 'Kahu ajag thont te hudinj hudinj dhiri tukuj re khadle keda. Dag cetan rakab ena.',
        visual: '🦅 🪨 🏺',
        vocab: [{ hin: 'कंकड़ / पत्थर', sat: 'ᱫᱷᱤᱨᱤ' }, { hin: 'ऊपर', sat: 'ᱪᱮᱛᱟᱱ' }]
      },
      {
        id: 4,
        hindi: 'कौवे ने खुशी-खुशी पानी पिया और अपनी प्यास बुझाई। मेहनत से हर काम सफल होता है।',
        santali: 'ᱠᱟᱦᱩ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮ ᱫᱟᱜ ᱮ ᱧᱩ ᱠᱮᱫᱼᱟ ᱟᱨ ᱛᱮᱛᱟᱝ ᱮ ᱢᱟᱨᱟᱣ ᱠᱮᱫᱼᱟ᱾ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱛᱮ ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣᱜᱼᱟ᱾',
        pronunciation: 'Kahu raska te dag e nyu keda ar tetang e maraw keda. Kurumutu te joto kami purauga.',
        visual: '😊 💧 ✨',
        vocab: [{ hin: 'खुशी', sat: 'ᱨᱟᱹᱥᱠᱟᱹ' }, { hin: 'मेहनत / प्रयास', sat: 'ᱠᱩᱨᱩᱢᱩᱴᱩ' }]
      }
    ]
  }
];

// Sample presets for custom text translation
const SAMPLE_PRESETS = [
  {
    title: '🍎 गणित अभ्यास प्रश्न (Class 1)',
    text: 'इन पाँच मोतियों को गिनो और संख्या लिखो। पाँच के बाद कौन सी संख्या आती है? अपनी कॉपी में लिखो।'
  },
  {
    title: '🏫 कक्षा निर्देश एवं गृहकार्य',
    text: 'सभी बच्चे अपनी किताब खोलो। ब्लैकबोर्ड की तरफ देखो और ध्यान से सुनो। आज का पाठ याद करो।'
  },
  {
    title: '🌿 प्रकृति एवं पर्यावरण',
    text: 'झारखंड का राज्य पुष्प पलाश है। साल का पेड़ बहुत मजबूत होता है। सरहुल पर्व में प्रकृति की पूजा होती है।'
  }
];

const PDFLocalizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'custom'>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('math_ch1');
  const [customInputText, setCustomInputText] = useState<string>('');
  const [translatedCustomSegments, setTranslatedCustomSegments] = useState<Array<{ hin: string; sat: string; pron: string }>>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [activePlayingId, setActivePlayingId] = useState<number | null>(null);

  const selectedChapter = JCERT_CHAPTERS.find(c => c.id === selectedChapterId) || JCERT_CHAPTERS[0];

  // Helper translation engine matching the offline 7,503-word lexicon
  const translateOfflineSentence = (sentence: string): { sat: string; pron: string } => {
    const trimmed = sentence.trim();
    if (!trimmed) return { sat: '', pron: '' };

    // 1. Direct dictionary match
    if (COMPREHENSIVE_HINDI_TO_SANTALI[trimmed]) {
      const sat = COMPREHENSIVE_HINDI_TO_SANTALI[trimmed];
      return { sat, pron: transliterateDevanagariToOlChiki(sat) };
    }

    // 2. Tokenize sentence words
    const words = trimmed.split(/\s+/);
    const satWords: string[] = [];
    for (const w of words) {
      const punct = w.match(/[।,?!.:]+/)?.[0] || '';
      const cleanWord = w.replace(/[।,?!.:]/g, '').trim();
      if (!cleanWord) continue;

      if (COMPREHENSIVE_HINDI_TO_SANTALI[cleanWord]) {
        satWords.push(COMPREHENSIVE_HINDI_TO_SANTALI[cleanWord] + punct);
      } else {
        satWords.push(transliterateDevanagariToOlChiki(cleanWord) + punct);
      }
    }

    const satResult = satWords.join(' ');
    return { sat: satResult, pron: transliterateDevanagariToOlChiki(satResult) };
  };

  const handleTranslateCustomText = () => {
    if (!customInputText.trim()) return;
    sfx.playTap();
    setIsTranslating(true);

    setTimeout(() => {
      // Split by sentences (danda, period, newline, question mark)
      const sentences = customInputText
        .split(/([।\n.?!]+)/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !/^[।\n.?!]+$/.test(s));

      const segments = sentences.map(s => {
        const res = translateOfflineSentence(s);
        return { hin: s, sat: res.sat, pron: res.pron };
      });

      setTranslatedCustomSegments(segments);
      setIsTranslating(false);
      sfx.playSuccess();
    }, 100);
  };

  const handlePlayAudio = (text: string, id: number) => {
    sfx.playVoicePing();
    setActivePlayingId(id);
    speakText(text, {
      rate: 0.85,
      onEnd: () => setActivePlayingId(null)
    });
  };

  const handlePrint = () => {
    sfx.playTap();
    window.print();
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1020px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ─── Top Header & Badges (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              📄 JCERT State Textbook Localizer
            </span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              ⚡ 100% Offline Dual-Column Reader
            </span>
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            📖 Bilingual Textbook & Handout Studio
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Translate state Hindi textbooks into side-by-side Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) with native audio pronunciation and A4 printable handouts.
          </p>
        </div>

        {/* Print / Export Action Button */}
        <button
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1a365d',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(26,54,93,0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>🖨️ Export A4 Printable PDF</span>
        </button>
      </div>

      {/* ─── Tab Switcher (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', gap: '10px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '14px', width: 'fit-content' }}>
        <button
          onClick={() => { sfx.playTap(); setActiveTab('chapters'); }}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'chapters' ? '#0f2744' : 'transparent',
            color: activeTab === 'chapters' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          📚 State Curriculum Chapters
        </button>
        <button
          onClick={() => { sfx.playTap(); setActiveTab('custom'); }}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'custom' ? '#0f2744' : 'transparent',
            color: activeTab === 'custom' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          ✍️ Translate Custom Passage / Notice
        </button>
      </div>

      {/* ─── TAB 1: PRE-LOADED JCERT CHAPTERS ─── */}
      {activeTab === 'chapters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Chapter Selector Bar (Hidden in Print) */}
          <div className="no-print" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {JCERT_CHAPTERS.map(ch => (
              <button
                key={ch.id}
                onClick={() => { sfx.playTap(); setSelectedChapterId(ch.id); }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: selectedChapterId === ch.id ? '2px solid #ed8936' : '1px solid #cbd5e1',
                  backgroundColor: selectedChapterId === ch.id ? '#fffaf0' : '#ffffff',
                  color: selectedChapterId === ch.id ? '#c05621' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  boxShadow: selectedChapterId === ch.id ? '0 2px 6px rgba(237,137,54,0.15)' : 'none'
                }}
              >
                <div>Ch {ch.chapter_no}: {ch.title_hin.slice(0, 24)}...</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>{ch.grade} • {ch.subject}</div>
              </button>
            ))}
          </div>

          {/* ─── PRINTABLE DOCUMENT CONTAINER ─── */}
          <div
            className="printable-document"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Document Official Header */}
            <div style={{ borderBottom: '2px solid #0f2744', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c05621', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  झारखंड शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद् (JCERT) • द्विभाषी पाठ्यपुस्तक
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f2744', margin: '4px 0 2px 0' }}>
                  अध्याय {selectedChapter.chapter_no}: {selectedChapter.title_hin}
                </h2>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#d97706', fontFamily: 'Noto Sans Ol Chiki, sans-serif' }}>
                  ᱦᱟᱹᱴᱤᱧ {selectedChapter.chapter_no}: {selectedChapter.title_sat}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#475569' }}>
                <div><strong>कक्षा / Grade:</strong> {selectedChapter.grade}</div>
                <div><strong>विषय / Subject:</strong> {selectedChapter.subject}</div>
                <div><strong>माध्यम:</strong> हिन्दी $\leftrightarrow$ ᱥᱟᱱᱛᱟᱲᱤ (Santali)</div>
              </div>
            </div>

            {/* Printable Student Info Box (Visible when printing or on tablet) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.82rem', color: '#475569' }}>
              <div>विद्यार्थी का नाम: ____________________</div>
              <div>दिनांक: ____________________</div>
              <div>विद्यालय: ____________________</div>
              <div>रोल नं: ________</div>
            </div>

            {/* Side-by-Side Dual Column Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#0f2744', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}>
                <div>🇮🇳 राज्य पाठ्यपुस्तक (हिन्दी मूल पाठ)</div>
                <div>🏹 मातृभाषा अनुवाद (ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ)</div>
              </div>

              {selectedChapter.paragraphs.map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                    border: '1px solid #edf2f7',
                    alignItems: 'start',
                    position: 'relative'
                  }}
                >
                  {/* Left Column: Hindi */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                        {idx + 1}
                      </span>
                      {p.visual && <span style={{ fontSize: '1rem' }}>{p.visual}</span>}
                    </div>
                    <div style={{ fontSize: '0.98rem', lineHeight: 1.6, color: '#1e293b', fontWeight: 500 }}>
                      {p.hindi}
                    </div>
                  </div>

                  {/* Right Column: Santali Ol Chiki */}
                  <div style={{ borderLeft: '2px solid #fed7aa', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#9a3412', fontWeight: 700, fontFamily: 'Noto Sans Ol Chiki, sans-serif' }}>
                        {p.santali}
                      </div>

                      {/* 🔊 Audio Speaker Button (Hidden in Print) */}
                      <button
                        className="no-print"
                        onClick={() => handlePlayAudio(p.santali, p.id)}
                        title="Play Santali pronunciation aloud"
                        style={{
                          backgroundColor: activePlayingId === p.id ? '#c2410c' : '#fffaf0',
                          border: '1px solid #ffedd5',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: activePlayingId === p.id ? '#ffffff' : '#ea580c',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0
                        }}
                      >
                        <span>{activePlayingId === p.id ? '🔊 Playing' : '🔊 Pronounce'}</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                      🗣️ {p.pronunciation}
                    </div>

                    {/* Word-level vocabulary tags */}
                    {p.vocab && p.vocab.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {p.vocab.map((v, vi) => (
                          <span key={vi} style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                            {v.hin} = {v.sat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Vocabulary & Summary Box */}
            <div style={{ marginTop: '0.5rem', padding: '12px 16px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.85rem', marginBottom: '4px' }}>
                💡 FLN शिक्षण निष्कर्ष (Learning Outcome & Practice Drill):
              </div>
              <div style={{ fontSize: '0.84rem', color: '#78350f', lineHeight: 1.5 }}>
                {selectedChapter.summary_hin} • {selectedChapter.summary_sat}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: CUSTOM TEXTBOOK PASSAGE TRANSLATOR ─── */}
      {activeTab === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Preset Prompts (Hidden in Print) */}
          <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
              ⚡ Quick Load Sample Passages:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SAMPLE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sfx.playTap();
                    setCustomInputText(p.text);
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Input (Hidden in Print) */}
          <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f2744' }}>
              ✍️ Paste or Type Hindi Textbook Paragraph / Classroom Notice:
            </label>
            <textarea
              rows={4}
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="यहाँ कोई भी पाठ, गणित का प्रश्न, या सूचना लिखें..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <button
              onClick={handleTranslateCustomText}
              disabled={isTranslating || !customInputText.trim()}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: isTranslating ? '#94a3b8' : '#ed8936',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: isTranslating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{isTranslating ? '⏳ Translating on Device...' : '⚡ Localize & Generate Side-by-Side View'}</span>
            </button>
          </div>

          {/* Translated Side-by-Side Result */}
          {translatedCustomSegments.length > 0 && (
            <div
              className="printable-document"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1.75rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ borderBottom: '2px solid #0f2744', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#0f2744', fontSize: '1.25rem', fontWeight: 800 }}>
                    द्विभाषी अभ्यास पत्रक / ᱵᱟᱨ ᱯᱟᱹᱨᱥᱤ ᱟᱵᱷᱭᱟᱥ
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Translated with PalashSetu On-Device 7,503-Word Engine
                  </div>
                </div>
                <button
                  className="no-print"
                  onClick={handlePrint}
                  style={{
                    backgroundColor: '#1a365d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Print Sheet
                </button>
              </div>

              {/* Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#0f2744', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.86rem' }}>
                  <div>मूल हिन्दी पाठ (Hindi Source)</div>
                  <div>ᱥᱟᱱᱛᱟᱲᱤ ᱛᱚᱨᱡᱚᱢᱟ (Santali Translation)</div>
                </div>

                {translatedCustomSegments.map((seg, sIdx) => (
                  <div
                    key={sIdx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '14px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: sIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      border: '1px solid #edf2f7',
                      alignItems: 'start'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: 1.5 }}>
                      {seg.hin}
                    </div>
                    <div style={{ borderLeft: '2px solid #fed7aa', paddingLeft: '12px' }}>
                      <div style={{ fontSize: '1.08rem', color: '#9a3412', fontWeight: 700, lineHeight: 1.5, fontFamily: 'Noto Sans Ol Chiki, sans-serif' }}>
                        {seg.sat}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                          🗣️ {seg.pron}
                        </span>
                        <button
                          className="no-print"
                          onClick={() => handlePlayAudio(seg.sat, sIdx + 100)}
                          style={{
                            backgroundColor: '#fffaf0',
                            border: '1px solid #ffedd5',
                            color: '#ea580c',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          🔊 Play
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── PRINT CSS STYLES ─── */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-document {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
};

export default PDFLocalizer;
