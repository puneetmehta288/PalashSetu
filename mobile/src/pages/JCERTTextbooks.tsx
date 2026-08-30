import React, { useState } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

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
  book_title_hin: string;
  book_title_sat: string;
  book_icon: string;
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
// OFFICIAL JCERT JHARKHAND STATE SANTALI TEXTBOOKS (PALASH MTB-MLE)
// ─────────────────────────────────────────────────────────────
const JCERT_BOOKS: TextbookChapter[] = [
  // ── BOOK 1: JCERT MATH MAGIC / ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (CLASS 1) ──
  {
    id: 'math_ch1',
    book_title_hin: 'JCERT गणित खेल (Class 1)',
    book_title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (᱑ ᱪᱟᱱᱟᱪ)',
    book_icon: '📘',
    chapter_no: 1,
    grade: 'Class 1',
    subject: 'Mathematics (ᱮᱞᱠᱷᱟ)',
    title_hin: 'संख्याएँ और गिनती: 1 से 10 तक',
    title_sat: 'ᱮᱞᱠᱷᱟ ᱟᱨ ᱞᱮᱠᱷᱟ: ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ',
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
        hindi: 'यहाँ एक लाल सेब है। 1 को संताली में "मिद" (ᱢᱤᱫ) कहते हैं। 1 = ᱢᱤᱫ (1)',
        santali: 'ᱱᱚᱸᱰᱮ ᱢᱤᱫᱴᱟᱝ ᱟᱨᱟᱜ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱑ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱢᱤᱫ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱑ = ᱢᱤᱫ (᱑)',
        pronunciation: 'Nonde mid-tang arag sew menaga. 1 do Santali te "Mid" bon metaga. 1 = Mid',
        visual: '🍎 (1 = ᱢᱤᱫ)',
        vocab: [{ hin: 'एक', sat: 'ᱢᱤᱫ' }, { hin: 'लाल', sat: 'ᱟᱨᱟᱜ' }, { hin: 'सेब', sat: 'ᱥᱮᱣ' }]
      },
      {
        id: 3,
        hindi: 'अब इन दो गायों को देखो। 2 को संताली में "बार" (ᱵᱟᱨ) कहते हैं। 2 = ᱵᱟᱨ (2)',
        santali: 'ᱱᱤᱛᱚᱜ ᱱᱚᱣᱟ ᱵᱟᱨᱭᱟ ᱜᱟᱹᱭ ᱠᱤᱱ ᱧᱮᱞ ᱵᱤᱱ᱾ ᱒ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱵᱟᱨ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱒ = ᱵᱟᱨ (᱒)',
        pronunciation: 'Nitog nowa barya gai kin nel bin. 2 do Santali te "Bar" bon metaga. 2 = Bar',
        visual: '🐄🐄 (2 = ᱵᱟᱨ)',
        vocab: [{ hin: 'दो', sat: 'ᱵᱟᱨ' }, { hin: 'गाय', sat: 'ᱜᱟᱹᱭ' }, { hin: 'देखो', sat: 'ᱧᱮᱞ ᱢᱮ' }]
      },
      {
        id: 4,
        hindi: 'पेड़ पर तीन चिड़ियाँ बैठी हैं। 3 को संताली में "पे" (ᱯᱮ) कहते हैं। 3 = ᱯᱮ (3)',
        santali: 'ᱫᱟᱨᱮ ᱨᱮ ᱯᱮᱭᱟ ᱪᱮᱬᱮ ᱠᱚ ᱫᱩᱲᱩᱵ ᱟᱠᱟᱱᱟ᱾ ᱓ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱯᱮ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱓ = ᱯᱮ (᱓)',
        pronunciation: 'Dare re peya chene ko durub akana. 3 do Santali te "Pe" bon metaga. 3 = Pe',
        visual: '🌳 🐦🐦🐦 (3 = ᱯᱮ)',
        vocab: [{ hin: 'तीन', sat: 'ᱯᱮ' }, { hin: 'पेड़', sat: 'ᱫᱟᱨᱮ' }, { hin: 'चिड़िया', sat: 'ᱪᱮᱬᱮ' }]
      },
      {
        id: 5,
        hindi: 'पाँच उँगलियाँ: एक हाथ में 5 उँगलियाँ होती हैं। 5 को "मोणे" (ᱢᱚᱬᱮ) कहते हैं। 5 = ᱢᱚᱬᱮ',
        santali: 'ᱢᱚᱬᱮ ᱠᱟᱹᱴᱩᱵ: ᱢᱤᱫ ᱛᱤ ᱨᱮ ᱕ ᱠᱟᱹᱴᱩᱵ ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱕ ᱫᱚ "ᱢᱚᱬᱮ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱕ = ᱢᱚᱬᱮ (᱕)',
        pronunciation: 'Mone katub: mid ti re 5 katub tahena. 5 do "Mone" bon metaga. 5 = Mone',
        visual: '🖐️ (5 = ᱢᱚᱬᱮ)',
        vocab: [{ hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }, { hin: 'हाथ', sat: 'ᱛᱤ' }, { hin: 'उँगलियाँ', sat: 'ᱠᱟᱹᱴᱩᱵ' }]
      },
      {
        id: 6,
        hindi: 'दस तारे: जब हम नौ में 1 जोड़ते हैं तो दस (10 = ᱜᱮᱞ) बन जाता है। शाबाश बच्चों!',
        santali: 'ᱜᱮᱞ ᱤᱯᱤᱞ: ᱡᱚᱠᱷᱚᱱ ᱟᱵᱚ ᱟᱨᱮ ᱨᱮ ᱑ ᱵᱚᱱ ᱡᱚᱲᱟᱣᱟ ᱩᱱᱫᱚ ᱜᱮᱞ (᱑᱐ = ᱜᱮᱞ) ᱦᱩᱭᱩᱜᱼᱟ᱾ ᱥᱟᱵᱟᱥ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!',
        pronunciation: 'Gel ipil: jokhon abo are re 1 bon jorawa undo gel (10 = Gel) huyuga. Sabas gidrako!',
        visual: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10 = ᱜᱮᱞ)',
        vocab: [{ hin: 'दस', sat: 'ᱜᱮᱞ' }, { hin: 'तारे', sat: 'ᱤᱯᱤᱞ' }, { hin: 'शाबाश', sat: 'ᱥᱟᱵᱟᱥ' }]
      }
    ]
  },
  {
    id: 'math_ch2',
    book_title_hin: 'JCERT गणित खेल (Class 1)',
    book_title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (᱑ ᱪᱟᱱᱟᱪ)',
    book_icon: '📘',
    chapter_no: 2,
    grade: 'Class 1',
    subject: 'Mathematics (ᱮᱞᱠᱷᱟ)',
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
    id: 'math_ch3',
    book_title_hin: 'JCERT गणित खेल (Class 1)',
    book_title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (᱑ ᱪᱟᱱᱟᱪ)',
    book_icon: '📘',
    chapter_no: 3,
    grade: 'Class 1',
    subject: 'Mathematics (ᱮᱞᱠᱷᱟ)',
    title_hin: 'जोड़ का खेल: एक साथ मिलाओ (1 से 9)',
    title_sat: 'ᱡᱚᱲᱟᱣ ᱮᱱᱮᱡ: ᱢᱤᱫ ᱴᱷᱮᱱ ᱢᱮᱥᱟᱭ ᱢᱮ (᱑ ᱠᱷᱚᱱ ᱙)',
    summary_hin: 'वस्तुओं को एक साथ मिलाकर कुल संख्या ज्ञात करना (जोड़ की प्रारंभिक समझ)।',
    summary_sat: 'ᱡᱤᱱᱤᱥ ᱠᱚ ᱢᱤᱫ ᱴᱷᱮᱱ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱞᱮᱠᱷᱟ ᱧᱟᱢ (ᱡᱚᱲᱟᱣ ᱮᱛᱚᱦᱚᱵ)᱾',
    paragraphs: [
      {
        id: 1,
        hindi: 'रोहन के पास 2 आम हैं। सीता ने उसे 1 आम और दिया। अब रोहन के पास 3 आम हो गए। 2 + 1 = 3',
        santali: 'ᱨᱳᱦᱚᱱ ᱴᱷᱮᱱ ᱒ ᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱥᱤᱛᱟ ᱩᱱᱤ ᱑ ᱩᱞ ᱮ ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱱᱤᱛᱚᱜ ᱨᱳᱦᱚᱱ ᱴᱷᱮᱱ ᱓ ᱩᱞ ᱦᱩᱭ ᱮᱱᱟ᱾ ᱒ + ᱑ = ᱓',
        pronunciation: 'Rohan then 2 ul menaga. Sita uni 1 ul e emadeya. Nitog Rohan then 3 ul huy ena. 2 + 1 = 3',
        visual: '🥭🥭 + 🥭 = 🥭🥭🥭 (3)',
        vocab: [{ hin: 'आम', sat: 'ᱩᱞ' }, { hin: 'जोड़ना', sat: 'ᱡᱚᱲᱟᱣ' }, { hin: 'दिया', sat: 'ᱮᱢᱟᱫᱮᱭᱟ' }]
      },
      {
        id: 2,
        hindi: 'डाल पर 3 चिड़ियाँ थीं। 2 चिड़ियाँ और आ गईं। अब कुल 5 चिड़ियाँ हैं। 3 + 2 = 5',
        santali: 'ᱰᱟᱹᱨ ᱨᱮ ᱓ ᱪᱮᱬᱮ ᱠᱚ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱒ ᱪᱮᱬᱮ ᱟᱨᱦᱚᱸ ᱠᱤᱱ ᱦᱮᱡ ᱮᱱᱟ᱾ ᱱᱤᱛᱚᱜ ᱕ ᱪᱮᱬᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ᱾ ᱓ + ᱒ = ᱕',
        pronunciation: 'Dar re 3 chene ko tahekana. 2 chene arhon kin hej ena. Nitog 5 chene menag kowa. 3 + 2 = 5',
        visual: '🐦🐦🐦 + 🐦🐦 = 🐦🐦🐦🐦🐦 (5)',
        vocab: [{ hin: 'डाल', sat: 'ᱰᱟᱹᱨ' }, { hin: 'कुल', sat: 'ᱢᱚᱴ' }, { hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }]
      }
    ]
  },
  // ── BOOK 2: JCERT भाषा वाटिका / ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ ──
  {
    id: 'lang_ch1',
    book_title_hin: 'JCERT भाषा वाटिका (Balvatika & Class 1)',
    book_title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ',
    book_icon: '📕',
    chapter_no: 1,
    grade: 'Balvatika & Class 1',
    subject: 'Santali / Hindi FLN (ᱯᱟᱹᱨᱥᱤ)',
    title_hin: 'प्यासा कौवा और मिट्टी का घड़ा (लोककथा)',
    title_sat: 'ᱛᱮᱛᱟᱝ ᱠᱟᱦᱩ ᱟᱨ ᱦᱟᱥᱟ ᱴᱩᱠᱩᱡ (ᱠᱟᱹᱦᱱᱤ)',
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
  },
  {
    id: 'lang_ch2',
    book_title_hin: 'JCERT भाषा वाटिका (Balvatika & Class 1)',
    book_title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ',
    book_icon: '📕',
    chapter_no: 2,
    grade: 'Class 1 & 2',
    subject: 'Santali / Hindi FLN (ᱯᱟᱹᱨᱥᱤ)',
    title_hin: 'कछुआ और खरगोश की दौड़ (नीति कथा)',
    title_sat: 'ᱦᱚᱨᱚ ᱟᱨ ᱠᱩᱞᱟᱹᱭ ᱨᱮᱭᱟᱜ ᱫᱟᱹᱲ (ᱠᱟᱹᱦᱱᱤ)',
    summary_hin: 'धीमी और निरंतर गति से चलने वाला हमेशा जीतता है।',
    summary_sat: 'ᱞᱟᱦᱟ ᱞᱟᱦᱟ ᱛᱮ ᱪᱟᱞᱟᱜ ᱦᱚᱲ ᱜᱮ ᱡᱤᱛᱠᱟᱹᱨᱚᱜᱼᱟ᱾',
    paragraphs: [
      {
        id: 1,
        hindi: 'खरगोश को अपनी तेज दौड़ पर बहुत घमंड था। उसने कछुए को दौड़ की चुनौती दी।',
        santali: 'ᱠᱩᱞᱟᱹᱭ ᱟᱡᱟᱜ ᱞᱚᱜᱚᱱ ᱫᱟᱹᱲ ᱨᱮ ᱟᱹᱰᱤ ᱜᱚᱨᱚᱵᱽ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱩᱱᱤ ᱦᱚᱨᱚ ᱫᱟᱹᱲ ᱞᱟᱹᱜᱤᱫ ᱮ ᱦᱚᱦᱚᱣᱟᱫᱮᱭᱟ᱾',
        pronunciation: 'Kulai ajag logon dar re adi gorob tahekana. Uni horo dar lagid e hohowadeya.',
        visual: '🐇 🐢 🏁',
        vocab: [{ hin: 'खरगोश', sat: 'ᱠᱩᱞᱟᱹᱭ' }, { hin: 'कछुआ', sat: 'ᱦᱚᱨᱚ' }, { hin: 'दौड़', sat: 'ᱫᱟᱹᱲ' }]
      },
      {
        id: 2,
        hindi: 'खरगोश रास्ते में एक पेड़ के नीचे सो गया। कछुआ धीरे-धीरे चलता रहा और जीत गया।',
        santali: 'ᱠᱩᱞᱟᱹᱭ ᱦᱚᱨ ᱨᱮ ᱢᱤᱫ ᱫᱟᱨᱮ ᱞᱟᱛᱟᱨ ᱨᱮ ᱡᱟᱹᱯᱤᱫ ᱠᱮᱫᱼᱟ᱾ ᱦᱚᱨᱚ ᱫᱚ ᱵᱟᱹᱭᱼᱵᱟᱹᱭ ᱛᱮ ᱪᱟᱞᱟᱣ ᱮᱱᱟ ᱟᱨ ᱡᱤᱛᱠᱟᱹᱨ ᱮᱱᱟ᱾',
        pronunciation: 'Kulai hor re mid dare latar re japid keda. Horo do bay-bay te calaw ena ar jitkar ena.',
        visual: '🌳 💤 🏆',
        vocab: [{ hin: 'रास्ता', sat: 'ᱦᱚᱨ' }, { hin: 'सो गया', sat: 'ᱡᱟᱹᱯᱤᱫ ᱠᱮᱫᱼᱟ' }, { hin: 'जीत गया', sat: 'ᱡᱤᱛᱠᱟᱹᱨ ᱮᱱᱟ' }]
      }
    ]
  }
];

const JCERTTextbooks: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('math_ch1');
  const [activePlayingId, setActivePlayingId] = useState<number | null>(null);
  const [filterSubject, setFilterSubject] = useState<'All' | 'Math' | 'Language'>('All');

  const selectedChapter = JCERT_BOOKS.find(c => c.id === selectedChapterId) || JCERT_BOOKS[0];

  const filteredBooks = JCERT_BOOKS.filter(b => {
    if (filterSubject === 'Math') return b.subject.includes('Math') || b.subject.includes('ᱮᱞᱠᱷᱟ');
    if (filterSubject === 'Language') return b.subject.includes('Language') || b.subject.includes('Santali') || b.subject.includes('ᱯᱟᱹᱨᱥᱤ');
    return true;
  });

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
              📖 JCERT Jharkhand State Textbooks
            </span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              🏹 ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ
            </span>
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            📚 JCERT State Santali Books (ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Official Jharkhand JCERT primary textbooks: <strong>ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (Math Magic)</strong> and <strong>ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ (Language Reader)</strong> with native audio.
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
          <span>🖨️ Print Chapter Handout (A4 PDF)</span>
        </button>
      </div>

      {/* ─── Subject Filter Bar (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Select Book:</span>
        {(['All', 'Math', 'Language'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { sfx.playTap(); setFilterSubject(tab); }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filterSubject === tab ? '#0f2744' : '#e2e8f0',
              color: filterSubject === tab ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {tab === 'All' ? '📚 All Books (ᱡᱚᱛᱚ)' : tab === 'Math' ? '📘 JCERT ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (Math)' : '📕 JCERT ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ (Language)'}
          </button>
        ))}
      </div>

      {/* ─── Chapter Selector Carousel (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {filteredBooks.map(ch => (
          <button
            key={ch.id}
            onClick={() => { sfx.playTap(); setSelectedChapterId(ch.id); }}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              border: selectedChapterId === ch.id ? '2px solid #ed8936' : '1px solid #cbd5e1',
              backgroundColor: selectedChapterId === ch.id ? '#fffaf0' : '#ffffff',
              color: selectedChapterId === ch.id ? '#c05621' : '#334155',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              minWidth: '240px',
              boxShadow: selectedChapterId === ch.id ? '0 4px 12px rgba(237,137,54,0.18)' : '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{ch.book_icon}</span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Ch {ch.chapter_no} • {ch.grade}</span>
            </div>
            <div style={{ marginTop: '4px', fontWeight: 800 }}>{ch.title_hin}</div>
            <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '2px', fontFamily: 'Noto Sans Ol Chiki, sans-serif' }}>
              {ch.title_sat}
            </div>
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
              झारखंड शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद् (JCERT) • PALASH MTB-MLE পাঠ্যপুস্তক
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f2744', margin: '4px 0 2px 0' }}>
              {selectedChapter.book_title_hin} — अध्याय {selectedChapter.chapter_no}: {selectedChapter.title_hin}
            </h2>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#d97706', fontFamily: 'Noto Sans Ol Chiki, sans-serif' }}>
              {selectedChapter.book_title_sat} — ᱦᱟᱹᱴᱤᱧ {selectedChapter.chapter_no}: {selectedChapter.title_sat}
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
            <div>🏹 ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ (Santali Reader)</div>
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
                  {p.visual && <span style={{ fontSize: '1.05rem' }}>{p.visual}</span>}
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
                      fontSize: '0.82rem',
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

export default JCERTTextbooks;
