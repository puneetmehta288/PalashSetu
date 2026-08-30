import React, { useState } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

type GradeLevel = 'Balvatika' | 'Grade 1' | 'Grade 2' | 'Grade 3';
type SubjectType = 'All' | 'Mathematics' | 'Language' | 'EVS';

interface BookPage {
  page_number: number;
  section_title_hin: string;
  section_title_sat: string;
  visual_banner?: string;
  paragraphs: Array<{
    id: number;
    hindi: string;
    santali: string;
    pronunciation: string;
    visual?: string;
    vocab?: Array<{ hin: string; sat: string }>;
  }>;
  exercise?: {
    question_hin: string;
    question_sat: string;
    type: string;
  };
}

interface OfficialBook {
  id: string;
  grade: GradeLevel;
  subject: 'Mathematics' | 'Language' | 'EVS';
  book_code: string;
  title_hin: string;
  title_sat: string;
  cover_color: string;
  icon: string;
  total_pages: number;
  description_hin: string;
  description_sat: string;
  pages: BookPage[];
}

// ─────────────────────────────────────────────────────────────
// OFFICIAL JCERT JHARKHAND BILINGUAL TEXTBOOKS REPOSITORY
// ─────────────────────────────────────────────────────────────
const OFFICIAL_JCERT_BOOKS: OfficialBook[] = [
  // ══════════════════ BALVATIKA ══════════════════
  {
    id: 'bal_math_1',
    grade: 'Balvatika',
    subject: 'Mathematics',
    book_code: 'JCERT-BAL-MATH-01',
    title_hin: 'जादुई पिटारा: आकृतियाँ और गिनती (1 से 5)',
    title_sat: 'ᱡᱟᱹᱫᱩᱭ ᱯᱤᱴᱟᱨᱟ: ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱞᱮᱠᱷᱟ (᱑ ᱠᱷᱚᱱ ᱕)',
    cover_color: '#319795',
    icon: '🎒',
    total_pages: 2,
    description_hin: 'बालवाटिका स्तर के बच्चों के लिए वस्तुओं की पहचान, आकृतियाँ और 1 से 5 तक संख्या बोध।',
    description_sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱡᱤᱱᱤᱥ ᱪᱤᱱᱦᱟᱹᱣ, ᱢᱩᱴᱷᱟᱹᱱ ᱟᱨ ᱑ ᱠᱷᱚᱱ ᱕ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱩᱡᱷᱟᱹᱣ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'पाठ १: हमारे आसपास की गोल और चौकोर चीजें',
        section_title_sat: 'ᱯᱟᱴᱷ ᱑: ᱟᱵᱚ ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱜᱩᱞ ᱟᱨ ᱪᱟᱹᱨᱠᱷᱤ ᱡᱤᱱᱤᱥ',
        visual_banner: '☀️ ⚽ 📦 🔲',
        paragraphs: [
          {
            id: 101,
            hindi: 'बच्चों, आसमान में सूरज को देखो। सूरज का आकार गोल होता है।',
            santali: 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ, ᱥᱮᱨᱢᱟ ᱨᱮ ᱵᱮᱨᱟ ᱧᱮᱞ ᱵᱤᱱ᱾ ᱵᱮᱨᱟ ᱫᱚ ᱜᱩᱞ ᱜᱮᱭᱟ᱾',
            pronunciation: 'Gidrako, serma re bera nel bin. Bera do gul geya.',
            visual: '☀️ (ᱜᱩᱞ - Circle)',
            vocab: [{ hin: 'सूरज', sat: 'ᱵᱮᱨᱟ' }, { hin: 'गोल', sat: 'ᱜᱩᱞ' }]
          },
          {
            id: 102,
            hindi: 'फुटबॉल और रोटी भी गोल होती हैं। गोल को संताली में "गुल" कहते हैं।',
            santali: 'ᱵᱚᱞ ᱟᱨ ᱨᱩᱴᱤ ᱦᱚᱸ ᱜᱩᱞ ᱜᱮᱭᱟ᱾ ᱜᱩᱞ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱜᱩᱞ" (ᱜᱩᱞ) ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
            pronunciation: 'Bol ar ruti hon gul geya. Gul do Santali te "Gul" bon metaga.',
            visual: '⚽ 🫓',
            vocab: [{ hin: 'रोटी', sat: 'ᱨᱩᱴᱤ' }]
          }
        ],
        exercise: {
          question_hin: 'अभ्यास: कक्षा में गोल चीजों पर घेरा लगाओ।',
          question_sat: 'ᱟᱵᱷᱭᱟᱥ: ᱪᱟᱱᱟᱪ ᱨᱮ ᱜᱩᱞ ᱡᱤᱱᱤᱥ ᱠᱚᱨᱮ ᱜᱩᱞ ᱪᱤᱱᱦᱟᱹ ᱮᱢ ᱢᱮ᱾',
          type: 'Drawing / Circle Activity'
        }
      },
      {
        page_number: 2,
        section_title_hin: 'पाठ २: एक से पाँच तक की उँगलियाँ',
        section_title_sat: 'ᱯᱟᱴᱷ ᱒: ᱢᱤᱫ ᱠᱷᱚᱱ ᱢᱚᱬᱮ ᱦᱟᱹᱵᱤᱡ ᱠᱟᱹᱴᱩᱵ',
        visual_banner: '🖐️ 🍎 🐄 🐦',
        paragraphs: [
          {
            id: 103,
            hindi: 'अपने हाथ की एक उँगली उठाओ: 1 = मिद (ᱢᱤᱫ)',
            santali: 'ᱟᱢᱟᱜ ᱛᱤ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱠᱟᱹᱴᱩᱵ ᱛᱩᱞ ᱢᱮ: ᱑ = ᱢᱤᱫ',
            pronunciation: 'Amag ti renag mid katub tul me: 1 = Mid',
            visual: '☝️ 1 = ᱢᱤᱫ',
            vocab: [{ hin: 'एक', sat: 'ᱢᱤᱫ' }, { hin: 'उँगली', sat: 'ᱠᱟᱹᱴᱩᱵ' }]
          },
          {
            id: 104,
            hindi: 'दो उँगलियाँ उठाओ: 2 = बार (ᱵᱟᱨ)। तीन उँगलियाँ: 3 = पे (ᱯᱮ)।',
            santali: 'ᱵᱟᱨᱭᱟ ᱠᱟᱹᱴᱩᱵ ᱛᱩᱞ ᱢᱮ: ᱒ = ᱵᱟᱨ᱾ ᱯᱮᱭᱟ ᱠᱟᱹᱴᱩᱵ: ᱓ = ᱯᱮ᱾',
            pronunciation: 'Barya katub tul me: 2 = Bar. Peya katub: 3 = Pe.',
            visual: '✌️ 2 = ᱵᱟᱨ | 🤟 3 = ᱯᱮ',
            vocab: [{ hin: 'दो', sat: 'ᱵᱟᱨ' }, { hin: 'तीन', sat: 'ᱯᱮ' }]
          },
          {
            id: 105,
            hindi: 'चार उँगलियाँ: 4 = पुन (ᱯᱩᱱ)। पूरे हाथ की पाँच उँगलियाँ: 5 = मोणे (ᱢᱚᱬᱮ)।',
            santali: 'ᱯᱩᱱᱭᱟ ᱠᱟᱹᱴᱩᱵ: ᱔ = ᱯᱩᱱ᱾ ᱯᱩᱨᱟᱹ ᱛᱤ ᱨᱮ ᱢᱚᱬᱮ ᱠᱟᱹᱴᱩᱵ: ᱕ = ᱢᱚᱬᱮ᱾',
            pronunciation: 'Punya katub: 4 = Pun. Pura ti re mone katub: 5 = Mone.',
            visual: '🖐️ 5 = ᱢᱚᱬᱮ',
            vocab: [{ hin: 'चार', sat: 'ᱯᱩᱱ' }, { hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'bal_lang_1',
    grade: 'Balvatika',
    subject: 'Language',
    book_code: 'JCERT-BAL-LANG-01',
    title_hin: 'भाषा वाटिका: सुनो और बोलो (बाल गीत व लोककथा)',
    title_sat: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱜᱟᱱ: ᱟᱸᱡᱚᱢ ᱟᱨ ᱨᱚᱲ (ᱥᱮᱨᱮᱧ ᱟᱨ ᱠᱟᱹᱦᱱᱤ)',
    cover_color: '#dd6b20',
    icon: '📕',
    total_pages: 2,
    description_hin: 'ध्वनि पहचान, चित्रों के माध्यम से मौखिक भाषा विकास और बालवाटिका लोककथा।',
    description_sat: 'ᱥᱟᱰᱮ ᱪᱤᱱᱦᱟᱹᱣ, ᱪᱤᱛᱟᱹᱨ ᱦᱚᱛᱮᱛᱮ ᱨᱚᱲ ᱞᱟᱦᱟᱱᱛᱤ ᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱟᱹᱦᱱᱤ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'प्रभात गीत: जोहार शिक्षक, जोहार बच्चे',
        section_title_sat: 'ᱥᱮᱛᱟᱜ ᱥᱮᱨᱮᱧ: ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ, ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ',
        visual_banner: '🌄 🏫 👦👧 🌸',
        paragraphs: [
          {
            id: 106,
            hindi: 'सूरज निकला, हुआ सवेरा। सब बच्चों ने हाथ जोड़कर कहा: "जोहार शिक्षक जी!"',
            santali: 'ᱵᱮᱨᱟ ᱨᱟᱠᱟᱵ ᱮᱱᱟ, ᱥᱮᱛᱟᱜ ᱮᱱᱟ᱾ ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱤ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱠᱚ ᱢᱮᱱ ᱠᱮᱫᱼᱟ: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ!"',
            pronunciation: 'Bera rakab ena, setag ena. Joto gidra ti joraw kate ko men keda: "Johar macet gomke!"',
            visual: '🌄 🏫 🙏',
            vocab: [{ hin: 'सवेरा', sat: 'ᱥᱮᱛᱟᱜ' }, { hin: 'शिक्षक', sat: 'ᱢᱟᱪᱮᱛ' }]
          },
          {
            id: 107,
            hindi: 'शिक्षक ने मुस्कुराकर उत्तर दिया: "जोहार प्यारे बच्चों! आओ मिलकर पढ़ाई करें।"',
            santali: 'ᱢᱟᱪᱮᱛ ᱞᱟᱸᱫᱟ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱠᱮᱫᱼᱟ: "ᱡᱚᱦᱟᱨ ᱫᱩᱞᱟᱹᱲ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱫᱮᱞᱟ ᱢᱤᱫ ᱴᱷᱮᱱ ᱵᱚᱱ ᱯᱟᱲᱦᱟᱣᱜᱼᱟ᱾"',
            pronunciation: 'Macet landa kate lay keda: "Johar dular gidrako! Dela mid then bon parhauga."',
            visual: '😊 📖 ✨',
            vocab: [{ hin: 'पढ़ाई', sat: 'ᱯᱟᱲᱦᱟᱣ' }, { hin: 'प्यारे', sat: 'ᱫᱩᱞᱟᱹᱲ' }]
          }
        ]
      },
      {
        page_number: 2,
        section_title_hin: 'कहानी: प्यासा कौवा (ᱛᱮᱛᱟᱝ ᱠᱟᱦᱩ)',
        section_title_sat: 'ᱠᱟᱹᱦᱱᱤ: ᱛᱮᱛᱟᱝ ᱠᱟᱦᱩ ᱟᱨ ᱦᱟᱥᱟ ᱴᱩᱠᱩᱡ',
        visual_banner: '🌲 🦅 🏺 💧',
        paragraphs: [
          {
            id: 108,
            hindi: 'एक कौवे को तेज प्यास लगी। उसने एक घड़े में थोड़ा पानी देखा।',
            santali: 'ᱢᱤᱫ ᱠᱟᱦᱩ ᱟᱹᱰᱤ ᱛᱮᱛᱟᱝ ᱠᱮᱫᱮᱭᱟ᱾ ᱩᱱᱤ ᱢᱤᱫ ᱴᱩᱠᱩᱡ ᱨᱮ ᱠᱚᱢ ᱫᱟᱜ ᱮ ᱧᱮᱞ ᱠᱮᱫᱼᱟ᱾',
            pronunciation: 'Mid kahu adi tetang kedeya. Uni mid tukuj re kom dag e nel keda.',
            visual: '🦅 🏺',
            vocab: [{ hin: 'कौवा', sat: 'ᱠᱟᱦᱩ' }, { hin: 'प्यास', sat: 'ᱛᱮᱛᱟᱝ' }, { hin: 'पानी', sat: 'ᱫᱟᱜ' }]
          },
          {
            id: 109,
            hindi: 'उसने कंकड़ डाले, पानी ऊपर आया। उसने पानी पिया और खुशी से उड़ गया।',
            santali: 'ᱩᱱᱤ ᱫᱷᱤᱨᱤ ᱠᱷᱟᱫᱞᱮ ᱠᱮᱫᱼᱟ, ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ ᱮᱱᱟ᱾ ᱫᱟᱜ ᱮ ᱧᱩ ᱠᱮᱫᱼᱟ ᱟᱨ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮ ᱩᱰᱟᱹᱣ ᱮᱱᱟ᱾',
            pronunciation: 'Uni dhiri khadle keda, dag cetan rakab ena. Dag e nyu keda ar raska te udaw ena.',
            visual: '🪨 💧 🦅 ✨',
            vocab: [{ hin: 'कंकड़', sat: 'ᱫᱷᱤᱨᱤ' }, { hin: 'उड़ गया', sat: 'ᱩᱰᱟᱹᱣ ᱮᱱᱟ' }]
          }
        ]
      }
    ]
  },

  // ══════════════════ GRADE 1 ══════════════════
  {
    id: 'g1_math_1',
    grade: 'Grade 1',
    subject: 'Mathematics',
    book_code: 'JCERT-G1-MATH-01',
    title_hin: 'JCERT गणित खेल: गिनती और आकृतियाँ',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ: ᱞᱮᱠᱷᱟ ᱟᱨ ᱪᱤᱱᱦᱟᱹ',
    cover_color: '#3182ce',
    icon: '📘',
    total_pages: 3,
    description_hin: 'कक्षा 1 गणित: 1 से 10 तक गिनती, स्थानीय मान, जोड़ की संकल्पना और ज्यामितीय आकृतियाँ।',
    description_sat: '᱑ ᱪᱟᱱᱟᱪ ᱮᱞᱠᱷᱟ: ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ, ᱡᱚᱲᱟᱣ ᱟᱨ ᱢᱩᱴᱷᱟᱹᱱ ᱪᱤᱱᱦᱟᱹᱣ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'अध्याय १: आओ 1 से 10 तक गिनती सीखें',
        section_title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱑: ᱫᱮᱞᱟ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ',
        visual_banner: '🍎 🐄 🐦 🖐️ 🔟',
        paragraphs: [
          {
            id: 201,
            hindi: '1 सेब (मिद - ᱢᱤᱫ), 2 गाय (बार - ᱵᱟᱨ), 3 चिड़ियाँ (पे - ᱯᱮ)।',
            santali: '᱑ ᱥᱮᱣ (ᱢᱤᱫ), ᱒ ᱜᱟᱹᱭ (ᱵᱟᱨ), ᱓ ᱪᱮᱬᱮ (ᱯᱮ)᱾',
            pronunciation: '1 sew (Mid), 2 gai (Bar), 3 chene (Pe).',
            visual: '🍎 | 🐄🐄 | 🐦🐦🐦',
            vocab: [{ hin: 'एक', sat: 'ᱢᱤᱫ' }, { hin: 'दो', sat: 'ᱵᱟᱨ' }, { hin: 'तीन', sat: 'ᱯᱮ' }]
          },
          {
            id: 202,
            hindi: '4 किताबें (पुन - ᱯᱩᱱ), 5 उँगलियाँ (मोणे - ᱢᱚᱬᱮ), 6 गेंदें (तुरुय - ᱛᱩᱨᱩᱭ)।',
            santali: '᱔ ᱯᱩᱛᱷᱤ (ᱯᱩᱱ), ᱕ ᱠᱟᱹᱴᱩᱵ (ᱢᱚᱬᱮ), ᱖ ᱵᱚᱞ (ᱛᱩᱨᱩᱭ)᱾',
            pronunciation: '4 puthi (Pun), 5 katub (Mone), 6 bol (Turui).',
            visual: '📚📚📚📚 | 🖐️ | ⚽⚽⚽⚽⚽⚽',
            vocab: [{ hin: 'चार', sat: 'ᱯᱩᱱ' }, { hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }, { hin: 'छह', sat: 'ᱛᱩᱨᱩᱭ' }]
          },
          {
            id: 203,
            hindi: '7 फूल (एयाय - ᱮᱭᱟᱭ), 8 पत्ते (इरल - ᱤᱨᱟᱹᱞ), 9 पेंसिल (आरे - ᱟᱨᱮ), 10 तारे (गेल - ᱜᱮᱞ)।',
            santali: '᱗ ᱵᱟᱦᱟ (ᱮᱭᱟᱭ), ᱘ ᱥᱟᱠᱟᱢ (ᱤᱨᱟᱹᱞ), ᱙ ᱯᱮᱱᱥᱤᱞ (ᱟᱨᱮ), ᱑᱐ ᱤᱯᱤᱞ (ᱜᱮᱞ)᱾',
            pronunciation: '7 baha (Eyay), 8 sakam (Iral), 9 pencil (Are), 10 ipil (Gel).',
            visual: '🌸 | 🍃 | ✏️ | ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',
            vocab: [{ hin: 'सात', sat: 'ᱮᱭᱟᱭ' }, { hin: 'आठ', sat: 'ᱤᱨᱟᱹᱞ' }, { hin: 'नौ', sat: 'ᱟᱨᱮ' }, { hin: 'दस', sat: 'ᱜᱮᱞ' }]
          }
        ],
        exercise: {
          question_hin: 'प्रश्न: 5 के बाद कौन सी संख्या आती है? अपनी कॉपी में लिखो।',
          question_sat: 'ᱠᱩᱠᱞᱤ: ᱕ ᱛᱟᱭᱚᱢ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ? ᱟᱢᱟᱜ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ᱾',
          type: 'Math Number Fill'
        }
      },
      {
        page_number: 2,
        section_title_hin: 'अध्याय २: आकृतियाँ - गोल, चौकोर और तिकोना',
        section_title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱒: ᱪᱤᱱᱦᱟᱹ - ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ ᱟᱨ ᱯᱮ ᱠᱳᱬ',
        visual_banner: '⭕ 🔲 🔺 ⚽ 📖 ⛰️',
        paragraphs: [
          {
            id: 204,
            hindi: 'सिक्का और चूड़ी गोल (ᱜᱩᱞ) हैं। कैरम बोर्ड चौकोर (ᱪᱟᱹᱨᱠᱷᱤ) है।',
            santali: 'ᱯᱩᱭᱥᱟᱹ ᱟᱨ ᱥᱟᱠᱚᱢ ᱫᱚ ᱜᱩᱞ (ᱜᱩᱞ) ᱜᱮᱭᱟ᱾ ᱠᱮᱨᱚᱢ ᱵᱳᱨᱰ ᱫᱚ ᱪᱟᱹᱨᱠᱷᱤ (ᱪᱟᱹᱨᱠᱷᱤ) ᱜᱮᱭᱟ᱾',
            pronunciation: 'Puysa ar sakom do gul geya. Carrom board do carkhi geya.',
            visual: '🪙 ⭕ | 🔲',
            vocab: [{ hin: 'गोल', sat: 'ᱜᱩᱞ' }, { hin: 'चौकोर', sat: 'ᱪᱟᱹᱨᱠᱷᱤ' }]
          },
          {
            id: 205,
            hindi: 'पहाड़ और समोसा तिकोना (ᱯᱮ ᱠᱳᱬ) होते हैं। तिकोने में 3 कोने होते हैं।',
            santali: 'ᱵᱩᱨᱩ ᱟᱨ ᱥᱟᱢᱚᱥᱟ ᱫᱚ ᱯᱮ ᱠᱳᱬ (ᱯᱮ ᱠᱳᱬ) ᱜᱮᱭᱟ᱾ ᱯᱮ ᱠᱳᱬ ᱨᱮ ᱓ ᱠᱳᱬ ᱛᱟᱦᱮᱸᱱᱟ᱾',
            pronunciation: 'Buru ar samosa do pe kon geya. Pe kon re 3 kon tahena.',
            visual: '⛰️ 🔺',
            vocab: [{ hin: 'पहाड़', sat: 'ᱵᱩᱨᱩ' }, { hin: 'तिकोना', sat: 'ᱯᱮ ᱠᱳᱬ' }]
          }
        ]
      },
      {
        page_number: 3,
        section_title_hin: 'अध्याय ३: जोड़ का खेल - एक साथ मिलाना (1 से 9)',
        section_title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱓: ᱡᱚᱲᱟᱣ ᱮᱱᱮᱡ - ᱢᱤᱫ ᱴᱷᱮᱱ ᱢᱮᱥᱟ (᱑ ᱠᱷᱚᱱ ᱙)',
        visual_banner: '🥭🥭 + 🥭 = 🥭🥭🥭 (3)',
        paragraphs: [
          {
            id: 206,
            hindi: 'सीता के पास 2 आम हैं। रामू ने 1 आम और दिया। अब कुल 3 आम हो गए। 2 + 1 = 3',
            santali: 'ᱥᱤᱛᱟ ᱴᱷᱮᱱ ᱒ ᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱨᱟᱢᱩ ᱑ ᱩᱞ ᱮ ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱱᱤᱛᱚᱜ ᱓ ᱩᱞ ᱦᱩᱭ ᱮᱱᱟ᱾ ᱒ + ᱑ = ᱓',
            pronunciation: 'Sita then 2 ul menaga. Ramu 1 ul e emadeya. Nitog 3 ul huy ena. 2 + 1 = 3',
            visual: '🥭🥭 + 🥭 = 3',
            vocab: [{ hin: 'आम', sat: 'ᱩᱞ' }, { hin: 'जोड़', sat: 'ᱡᱚᱲᱟᱣ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'g1_lang_1',
    grade: 'Grade 1',
    subject: 'Language',
    book_code: 'JCERT-G1-LANG-01',
    title_hin: 'JCERT भाषा वाटिका / ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱜᱟᱱ (᱑ ᱪᱟᱱᱟᱪ)',
    cover_color: '#805ad5',
    icon: '📕',
    total_pages: 2,
    description_hin: 'मातृभाषा संताली एवं हिन्दी का द्विभाषी पठन, शब्द-रचना, और प्रेरक कहानियाँ।',
    description_sat: 'ᱟᱭᱳ ᱟᱲᱟᱝ ᱥᱟᱱᱛᱟᱲᱤ ᱟᱨ ᱦᱤᱱᱫᱤ ᱯᱟᱲᱦᱟᱣ, ᱟᱹᱲᱟᱹ ᱜᱟᱵᱟᱱ ᱟᱨ ᱠᱟᱹᱦᱱᱤ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'पाठ १: कछुआ और खरगोश की दौड़',
        section_title_sat: 'ᱯᱟᱴᱷ ᱑: ᱦᱚᱨᱚ ᱟᱨ ᱠᱩᱞᱟᱹᱭ ᱨᱮᱭᱟᱜ ᱫᱟᱹᱲ',
        visual_banner: '🐇 🐢 🌳 🏁',
        paragraphs: [
          {
            id: 207,
            hindi: 'खरगोश को अपनी तेज चाल पर गर्व था। उसने कछुए का मजाक उड़ाया।',
            santali: 'ᱠᱩᱞᱟᱹᱭ ᱟᱡᱟᱜ ᱞᱚᱜᱚᱱ ᱫᱟᱹᱲ ᱨᱮ ᱟᱹᱰᱤ ᱜᱚᱨᱚᱵᱽ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱩᱱᱤ ᱦᱚᱨᱚ ᱞᱟᱸᱫᱟᱣᱟᱫᱮᱭᱟ᱾',
            pronunciation: 'Kulai ajag logon dar re adi gorob tahekana. Uni horo landawadeya.',
            visual: '🐇 🐢',
            vocab: [{ hin: 'खरगोश', sat: 'ᱠᱩᱞᱟᱹᱭ' }, { hin: 'कछुआ', sat: 'ᱦᱚᱨᱚ' }]
          },
          {
            id: 208,
            hindi: 'दौड़ शुरू हुई। खरगोश रास्ते में सो गया, लेकिन कछुआ लगातार चलकर जीत गया।',
            santali: 'ᱫᱟᱹᱲ ᱮᱛᱚᱦᱚᱵ ᱮᱱᱟ᱾ ᱠᱩᱞᱟᱹᱭ ᱦᱚᱨ ᱨᱮ ᱡᱟᱹᱯᱤᱫ ᱠᱮᱫᱼᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱦᱚᱨᱚ ᱞᱮᱛᱟᱲ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱡᱤᱛᱠᱟᱹᱨ ᱮᱱᱟ᱾',
            pronunciation: 'Dar etohob ena. Kulai hor re japid keda, menkhan horo letar calaw kate jitkar ena.',
            visual: '💤 🐢 🏆',
            vocab: [{ hin: 'सो गया', sat: 'ᱡᱟᱹᱯᱤᱫ ᱠᱮᱫᱼᱟ' }, { hin: 'जीत गया', sat: 'ᱡᱤᱛᱠᱟᱹᱨ ᱮᱱᱟ' }]
          }
        ]
      },
      {
        page_number: 2,
        section_title_hin: 'पाठ २: हमारा प्यारा गाँव और विद्यालय',
        section_title_sat: 'ᱯᱟᱴᱷ ᱒: ᱟᱵᱚᱣᱟᱜ ᱫᱩᱞᱟᱹᱲ ᱟᱹᱛᱩ ᱟᱨ ᱟᱥᱲᱟ',
        visual_banner: '🏡 🌳 🏫 🌾',
        paragraphs: [
          {
            id: 209,
            hindi: 'हमारा गाँव बहुत सुंदर है। गाँव के चारों ओर हरे-भरे साल और पलाश के पेड़ हैं।',
            santali: 'ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭᱟ᱾ ᱟᱹᱛᱩ ᱟᱰᱮᱯᱟᱥᱮ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱨᱡᱚᱢ ᱟᱨ ᱯᱟᱞᱟᱥ ᱫᱟᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
            pronunciation: 'Abowag atu adi napaya. Atu adepase hariyar sarjom ar palas dare menaga.',
            visual: '🏡 🌲 🌺',
            vocab: [{ hin: 'गाँव', sat: 'ᱟᱹᱛᱩ' }, { hin: 'साल का पेड़', sat: 'ᱥᱟᱨᱡᱚᱢ' }, { hin: 'पलाश', sat: 'ᱯᱟᱞᱟᱥ' }]
          },
          {
            id: 210,
            hindi: 'रोज सुबह हम सब बच्चे तैयार होकर अपने विद्यालय (ᱟᱥᱲᱟ) जाते हैं।',
            santali: 'ᱫᱤᱱᱟᱹᱢ ᱥᱮᱛᱟᱜ ᱟᱵᱚ ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱥᱟᱯᱲᱟᱣ ᱠᱟᱛᱮ ᱟᱵᱚᱣᱟᱜ ᱟᱥᱲᱟ (ᱟᱥᱲᱟ) ᱵᱚᱱ ᱪᱟᱞᱟᱜᱼᱟ᱾',
            pronunciation: 'Dinam setag abo joto gidra sapraw kate abowag asra bon calaga.',
            visual: '🎒 👦👧 🏫',
            vocab: [{ hin: 'विद्यालय / स्कूल', sat: 'ᱟᱥᱲᱟ' }, { hin: 'रोज', sat: 'ᱫᱤᱱᱟᱹᱢ' }]
          }
        ]
      }
    ]
  },

  // ══════════════════ GRADE 2 ══════════════════
  {
    id: 'g2_math_1',
    grade: 'Grade 2',
    subject: 'Mathematics',
    book_code: 'JCERT-G2-MATH-01',
    title_hin: 'JCERT गणित वाटिका: 1 से 100 एवं दहाई-इकाई',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱵᱟᱜᱟᱱ (᱒ ᱪᱟᱱᱟᱪ)',
    cover_color: '#4c51bf',
    icon: '📘',
    total_pages: 2,
    description_hin: 'कक्षा 2: 1 से 100 तक संख्याएँ, दहाई-इकाई (Place Value) और दैनिक जीवन में जोड़-घटाव।',
    description_sat: '᱒ ᱪᱟᱱᱟᱪ ᱮᱞᱠᱷᱟ: ᱑ ᱠᱷᱚᱱ ᱑᱐᱐ ᱦᱟᱹᱵᱤᱡ, ᱜᱮᱞ-ᱢᱤᱫ (Place Value) ᱟᱨ ᱡᱚᱲᱟᱣ-ᱜᱷᱟᱴᱟᱣ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'अध्याय १: दसों का बंडल और स्थानीय मान',
        section_title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱑: ᱜᱮᱞ ᱨᱮᱱᱟᱜ ᱵᱟᱱᱰᱤᱞ ᱟᱨ ᱴᱷᱟᱶ ᱮᱞ',
        visual_banner: '🥢🥢🥢🥢🥢🥢🥢🥢🥢🥢 (10 = ᱜᱮᱞ)',
        paragraphs: [
          {
            id: 301,
            hindi: '10 तीलियों का 1 बंडल = 1 दहाई (10 = ᱜᱮᱞ)। 2 बंडल = 20 (ᱵᱤᱥ / ᱵᱟᱨ ᱜᱮᱞ)।',
            santali: '᱑᱐ ᱠᱟᱹᱴᱷᱤ ᱨᱮᱱᱟᱜ ᱑ ᱵᱟᱱᱰᱤᱞ = ᱑ ᱜᱮᱞ (᱑᱐ = ᱜᱮᱞ)᱾ ᱒ ᱵᱟᱱᱰᱤᱞ = ᱒᱐ (ᱵᱟᱨ ᱜᱮᱞ)᱾',
            pronunciation: '10 kathi renag 1 bandil = 1 Gel (10 = Gel). 2 bandil = 20 (Bar Gel).',
            visual: '📦 (10) | 📦📦 (20)',
            vocab: [{ hin: 'दहाई', sat: 'ᱜᱮᱞ' }, { hin: 'बीस', sat: 'ᱵᱟᱨ ᱜᱮᱞ / ᱵᱤᱥ' }]
          },
          {
            id: 302,
            hindi: '5 दहाई = 50 (ᱯᱚᱧᱪᱟᱥ / ᱢᱚᱬᱮ ᱜᱮᱞ)। 10 दहाई = 100 (ᱥᱟᱭ / ᱥᱚᱣ)।',
            santali: '᱕ ᱜᱮᱞ = ᱕᱐ (ᱢᱚᱬᱮ ᱜᱮᱞ)᱾ ᱑᱐ ᱜᱮᱞ = ᱑᱐᱐ (ᱥᱟᱭ)᱾',
            pronunciation: '5 Gel = 50 (Mone Gel). 10 Gel = 100 (Say).',
            visual: '💯 (100 = ᱥᱟᱭ)',
            vocab: [{ hin: 'पचास', sat: 'ᱢᱚᱬᱮ ᱜᱮᱞ' }, { hin: 'सौ', sat: 'ᱥᱟᱭ' }]
          }
        ]
      },
      {
        page_number: 2,
        section_title_hin: 'अध्याय २: दो अंकों का दैनिक जोड़',
        section_title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱒: ᱵᱟᱨ ᱮᱞ ᱨᱮᱱᱟᱜ ᱡᱚᱲᱟᱣ',
        visual_banner: '🧺 15 + 12 = 27',
        paragraphs: [
          {
            id: 303,
            hindi: 'बाजार में माँ ने 15 केले और 12 अमरूद खरीदे। कुल कितने फल हुए? 15 + 12 = 27',
            santali: 'ᱦᱟᱴ ᱨᱮ ᱟᱭᱳ ᱑᱕ ᱠᱟᱭᱨᱟ ᱟᱨ ᱑᱒ ᱟᱢᱨᱩᱫ ᱮ ᱠᱤᱨᱤᱧ ᱠᱮᱫᱼᱟ᱾ ᱢᱚᱴ ᱛᱤᱱᱟᱹᱜ ᱡᱚ ᱦᱩᱭ ᱮᱱᱟ? ᱑᱕ + ᱑᱒ = ᱒᱗',
            pronunciation: 'Hat re Ayo 15 kayra ar 12 amrud e kirinj keda. Mot tinag jo huy ena? 15 + 12 = 27',
            visual: '🍌 + 🍐 = 27',
            vocab: [{ hin: 'बाजार / हाट', sat: 'ᱦᱟᱴ' }, { hin: 'माँ', sat: 'ᱟᱭᱳ' }, { hin: 'केला', sat: 'ᱠᱟᱭᱨᱟ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'g2_lang_1',
    grade: 'Grade 2',
    subject: 'Language',
    book_code: 'JCERT-G2-LANG-01',
    title_hin: 'JCERT पलाश भाषा मंजरी (Class 2)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱟᱞᱟᱥ ᱯᱟᱹᱨᱥᱤ ᱢᱟᱧᱡᱟᱨᱤ',
    cover_color: '#c53030',
    icon: '📕',
    total_pages: 1,
    description_hin: 'झारखंड के पारंपरिक लोकपर्व (सरहुल, करम), प्रकृति वंदना और सामाजिक सौहार्द।',
    description_sat: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱯᱟᱨᱟᱵᱽ (ᱥᱟᱨᱦᱩᱞ, ᱠᱟᱨᱟᱢ) ᱟᱨ ᱥᱟᱶᱛᱟ ᱫᱩᱞᱟᱹᱲ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'पाठ १: हमारा राज्य झारखंड और सरहुल पर्व',
        section_title_sat: 'ᱯᱟᱴᱷ ᱑: ᱟᱵᱚᱣᱟᱜ ᱯᱚᱱᱚᱛ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱟᱨ ᱥᱟᱨᱦᱩᱞ ᱯᱟᱨᱟᱵᱽ',
        visual_banner: '🌳 🌸 🥁 💃🕺',
        paragraphs: [
          {
            id: 304,
            hindi: 'झारखंड वीरों और प्रकृति की धरती है। रांची इसकी राजधानी है।',
            santali: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱫᱚ ᱵᱤᱨ ᱟᱨ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱦᱚᱲ ᱠᱚᱣᱟᱜ ᱫᱤᱥᱚᱢ ᱠᱟᱱᱟ᱾ ᱨᱟᱺᱪᱤ ᱫᱚ ᱱᱚᱣᱟ ᱨᱮᱱᱟᱜ ᱨᱟᱡᱽᱜᱟᱲ ᱠᱟᱱᱟ᱾',
            pronunciation: 'Jharkhand do bir ar kurumutu hor kowag disom kana. Ranchi do nowag rajgarh kana.',
            visual: '🇮🇳 🏹 🌳',
            vocab: [{ hin: 'झारखंड', sat: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ' }, { hin: 'राजधानी', sat: 'ᱨᱟᱡᱽᱜᱟᱲ' }, { hin: 'रांची', sat: 'ᱨᱟᱺᱪᱤ' }]
          },
          {
            id: 305,
            hindi: 'सरहुल पर्व में साल के नए फूलों (ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ) की पूजा की जाती है। सब मिलकर मांदर की थाप पर नाचते हैं।',
            santali: 'ᱥᱟᱨᱦᱩᱞ ᱯᱟᱨᱟᱵᱽ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ ᱠᱚ ᱵᱚᱸᱜᱟᱭᱟ᱾ ᱡᱚᱛᱚ ᱦᱚᱲ ᱴᱟᱢᱟᱠ-ᱛᱩᱢᱫᱟᱜ ᱨᱟᱦᱟ ᱛᱮᱠᱚ ᱮᱱᱮᱡᱼᱟ᱾',
            pronunciation: 'Sarhul parab re sarjom baha ko bongaya. Joto hor tamak-tumdag raha teko eneja.',
            visual: '🌸 🥁 ✨',
            vocab: [{ hin: 'सरहुल', sat: 'ᱥᱟᱨᱦᱩᱞ' }, { hin: 'साल का फूल', sat: 'ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ' }, { hin: 'नाचते हैं', sat: 'ᱮᱱᱮᱡᱼᱟ ᱠᱚ' }]
          }
        ]
      }
    ]
  },

  // ══════════════════ GRADE 3 ══════════════════
  {
    id: 'g3_math_1',
    grade: 'Grade 3',
    subject: 'Mathematics',
    book_code: 'JCERT-G3-MATH-01',
    title_hin: 'JCERT गणित दीपिका: गुणा और मापन (Class 3)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱫᱤᱯᱤᱠᱟ (᱓ ᱪᱟᱱᱟᱪ)',
    cover_color: '#2b6cb0',
    icon: '📘',
    total_pages: 1,
    description_hin: 'कक्षा 3: संख्याओं की समझ 100 से 500, गुणा की संकल्पना (Repeated Addition) और मापन।',
    description_sat: '᱓ ᱪᱟᱱᱟᱪ ᱮᱞᱠᱷᱟ: ᱑᱐᱐ ᱠᱷᱚᱱ ᱕᱐᱐ ᱦᱟᱹᱵᱤᱡ ᱮᱞᱠᱷᱟ, ᱜᱩᱬᱟᱹᱣ ᱟᱨ ᱡᱚᱠᱷᱟ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'अध्याय १: गुणा का मतलब बार-बार जोड़ना',
        section_title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱑: ᱜᱩᱬᱟᱹᱣ ᱨᱮᱭᱟᱜ ᱢᱮᱱᱮᱛ ᱞᱮᱛᱟᱲ ᱡᱚᱲᱟᱣ',
        visual_banner: '🍎🍎 + 🍎🍎 + 🍎🍎 = 2 × 3 = 6',
        paragraphs: [
          {
            id: 401,
            hindi: 'यदि 1 थाली में 2 सेब हैं, तो 3 थालियों में कुल 2 × 3 = 6 सेब होंगे।',
            santali: 'ᱡᱩᱫᱤ ᱑ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱒ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ, ᱮᱱᱠᱷᱟᱱ ᱓ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱒ × ᱓ = ᱖ ᱥᱮᱣ ᱦᱩᱭᱩᱜᱼᱟ᱾',
            pronunciation: 'Judi 1 thari re 2 sew menaga, enkhan 3 thari re 2 x 3 = 6 sew huyuga.',
            visual: '🍽️ 🍎🍎 | 🍽️ 🍎🍎 | 🍽️ 🍎🍎 = 6',
            vocab: [{ hin: 'गुणा', sat: 'ᱜᱩᱬᱟᱹᱣ' }, { hin: 'थाली', sat: 'ᱛᱷᱟᱹᱨᱤ' }, { hin: 'छह', sat: 'ᱛᱩᱨᱩᱭ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'g3_evs_1',
    grade: 'Grade 3',
    subject: 'EVS',
    book_code: 'JCERT-G3-EVS-01',
    title_hin: 'JCERT हमारा पर्यावरण (EVS Class 3)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱟᱵᱚᱣᱟᱜ ᱪᱟᱹᱨᱤᱭᱟᱹᱲ (᱓ ᱪᱟᱱᱟᱪ)',
    cover_color: '#2f855a',
    icon: '🌿',
    total_pages: 1,
    description_hin: 'जल संरक्षण, पेड़-पौधे, पशु-पक्षी और पर्यावरण संतुलन की समझ।',
    description_sat: 'ᱫᱟᱜ ᱵᱟᱧᱪᱟᱣ, ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ, ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱟᱨ ᱪᱟᱹᱨᱤᱭᱟᱹᱲ ᱵᱟᱧᱪᱟᱣ᱾',
    pages: [
      {
        page_number: 1,
        section_title_hin: 'पाठ १: जल ही जीवन है - पानी की बचत',
        section_title_sat: 'ᱯᱟᱴᱷ ᱑: ᱫᱟᱜ ᱜᱮ ᱡᱤᱭᱚᱱ - ᱫᱟᱜ ᱵᱟᱧᱪᱟᱣ',
        visual_banner: '💧 🚰 🌧️ 🌲 🏞️',
        paragraphs: [
          {
            id: 402,
            hindi: 'पानी के बिना कोई भी जीवित नहीं रह सकता। हमें वर्षा जल का संचयन करना चाहिए।',
            santali: 'ᱫᱟᱜ ᱵᱮᱜᱚᱨ ᱚᱠᱚᱭ ᱦᱚᱸ ᱵᱟᱠᱚ ᱵᱟᱧᱪᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱟᱵᱚ ᱫᱟᱜ ᱡᱟᱹᱲᱤ ᱫᱟᱜ ᱥᱟᱧᱪᱟᱣ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
            pronunciation: 'Dag begor okoy hon bako banchaw dareyaga. Abo dag jari dag sanchaw lakti kana.',
            visual: '🌧️ 💧 🌲',
            vocab: [{ hin: 'पानी / जल', sat: 'ᱫᱟᱜ' }, { hin: 'वर्षा / बारिश', sat: 'ᱫᱟᱜ ᱡᱟᱹᱲᱤ' }, { hin: 'बचत', sat: 'ᱥᱟᱧᱪᱟᱣ' }]
          }
        ]
      }
    ]
  }
];

const JCERTTextbooks: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 1');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('All');
  const [selectedBookId, setSelectedBookId] = useState<string>('g1_math_1');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [activePlayingId, setActivePlayingId] = useState<number | null>(null);

  // Filter books by Grade and Subject
  const booksInGrade = OFFICIAL_JCERT_BOOKS.filter(b => b.grade === selectedGrade);
  const filteredBooks = booksInGrade.filter(b => {
    if (selectedSubject === 'All') return true;
    return b.subject === selectedSubject;
  });

  const selectedBook = OFFICIAL_JCERT_BOOKS.find(b => b.id === selectedBookId) || filteredBooks[0] || OFFICIAL_JCERT_BOOKS[0];
  const currentPage = selectedBook.pages.find(p => p.page_number === currentPageNum) || selectedBook.pages[0];

  const handleSelectGrade = (grade: GradeLevel) => {
    sfx.playTap();
    setSelectedGrade(grade);
    setSelectedSubject('All');
    const firstBook = OFFICIAL_JCERT_BOOKS.find(b => b.grade === grade);
    if (firstBook) {
      setSelectedBookId(firstBook.id);
      setCurrentPageNum(1);
    }
  };

  const handleSelectBook = (bookId: string) => {
    sfx.playTap();
    setSelectedBookId(bookId);
    setCurrentPageNum(1);
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
    <div className="fade-in" style={{ maxWidth: '1060px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ─── Top Header & Badges (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              📖 Official JCERT State Textbooks (Jharkhand)
            </span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              ⚡ Dual-Language PDF Reader (हिन्दी $\leftrightarrow$ ᱚᱞ ᱪᱤᱠᱤ)
            </span>
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            📚 JCERT State Textbooks Repository (ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱩᱛᱷᱤ)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Select class level (Balvatika, Grade 1, 2, 3), pick official state textbooks, and read side-by-side in Hindi and Santali Ol Chiki.
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
          <span>🖨️ Print Page Handout (A4 PDF)</span>
        </button>
      </div>

      {/* ─── STEP 1: CLASS SELECTION BAR (Hidden in Print) ─── */}
      <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2744', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1️⃣ Select Class Level (ᱪᱟᱱᱟᱪ ᱵᱟᱪᱷᱟᱣ):
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Showing official books for: <strong>{selectedGrade}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          {(['Balvatika', 'Grade 1', 'Grade 2', 'Grade 3'] as GradeLevel[]).map(grade => (
            <button
              key={grade}
              onClick={() => handleSelectGrade(grade)}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: selectedGrade === grade ? '2px solid #ed8936' : '1px solid #cbd5e1',
                backgroundColor: selectedGrade === grade ? '#0f2744' : '#f8fafc',
                color: selectedGrade === grade ? '#ffffff' : '#334155',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: selectedGrade === grade ? '0 4px 12px rgba(15,39,68,0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div>{grade === 'Balvatika' ? '🎒 Balvatika' : grade === 'Grade 1' ? '🏫 Class 1' : grade === 'Grade 2' ? '🏫 Class 2' : '🏫 Class 3'}</div>
              <div style={{ fontSize: '0.72rem', opacity: selectedGrade === grade ? 0.85 : 0.6, marginTop: '2px' }}>
                {grade === 'Balvatika' ? 'ᱵᱟᱞᱣᱟᱴᱤᱠᱟ' : grade === 'Grade 1' ? '᱑ ᱪᱟᱱᱟᱪ' : grade === 'Grade 2' ? '᱒ ᱪᱟᱱᱟᱪ' : '᱓ ᱪᱟᱱᱟᱪ'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── STEP 2: SUBJECT & BOOK PICKER (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2744' }}>
            2️⃣ Pick JCERT Textbook ({filteredBooks.length} available):
          </div>

          {/* Subject Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['All', 'Mathematics', 'Language', 'EVS'] as SubjectType[]).map(subj => (
              <button
                key={subj}
                onClick={() => { sfx.playTap(); setSelectedSubject(subj); }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: selectedSubject === subj ? '#3182ce' : '#e2e8f0',
                  color: selectedSubject === subj ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  cursor: 'pointer'
                }}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Books Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {filteredBooks.map(b => (
            <button
              key={b.id}
              onClick={() => handleSelectBook(b.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                border: selectedBookId === b.id ? '2px solid #ed8936' : '1px solid #cbd5e1',
                backgroundColor: selectedBookId === b.id ? '#fffaf0' : '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: selectedBookId === b.id ? '0 4px 14px rgba(237,137,54,0.18)' : '0 2px 4px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '52px',
                  backgroundColor: b.cover_color,
                  color: '#ffffff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                {b.icon}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>{b.book_code} • {b.subject}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: selectedBookId === b.id ? '#c05621' : '#0f2744', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title_hin}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#d97706', fontFamily: 'Noto Sans Ol Chiki, sans-serif', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title_sat}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── STEP 3: OFFICIAL SIDE-BY-SIDE DUAL BOOK READER ─── */}
      <div
        className="printable-document"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #cbd5e1',
          padding: '1.75rem',
          boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* Book Reader Toolbar (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', backgroundColor: '#f1f5f9', padding: '8px 14px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>{selectedBook.icon}</span>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2744' }}>{selectedBook.title_hin}</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{selectedBook.grade} • {selectedBook.subject}</div>
            </div>
          </div>

          {/* Page Pagination Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              disabled={currentPageNum <= 1}
              onClick={() => { sfx.playTap(); setCurrentPageNum(p => Math.max(1, p - 1)); }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: currentPageNum <= 1 ? '#e2e8f0' : '#ffffff',
                color: currentPageNum <= 1 ? '#94a3b8' : '#0f2744',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: currentPageNum <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ◀ Prev Page
            </button>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f2744' }}>
              Page {currentPage.page_number} of {selectedBook.pages.length}
            </span>
            <button
              disabled={currentPageNum >= selectedBook.pages.length}
              onClick={() => { sfx.playTap(); setCurrentPageNum(p => Math.min(selectedBook.pages.length, p + 1)); }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: currentPageNum >= selectedBook.pages.length ? '#e2e8f0' : '#ffffff',
                color: currentPageNum >= selectedBook.pages.length ? '#94a3b8' : '#0f2744',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: currentPageNum >= selectedBook.pages.length ? 'not-allowed' : 'pointer'
              }}
            >
              Next Page ▶
            </button>
          </div>
        </div>

        {/* Official JCERT Header */}
        <div style={{ borderBottom: '2px solid #0f2744', paddingBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c05621', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              झारखंड शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद् (JCERT) • PALASH MTB-MLE পাঠ্যপুস্তক
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2744', margin: '4px 0 2px 0' }}>
              {currentPage.section_title_hin}
            </h2>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706', fontFamily: 'Noto Sans Ol Chiki, sans-serif' }}>
              {currentPage.section_title_sat}
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
            <div><strong>{selectedBook.grade}</strong> • {selectedBook.subject}</div>
            <div><strong>पृष्ठ / Page:</strong> {currentPage.page_number} / {selectedBook.pages.length}</div>
            <div style={{ color: '#059669', fontWeight: 700 }}>हिन्दी $\leftrightarrow$ ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ</div>
          </div>
        </div>

        {/* Visual Banner if present */}
        {currentPage.visual_banner && (
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '1.4rem', border: '1px dashed #cbd5e1' }}>
            {currentPage.visual_banner}
          </div>
        )}

        {/* Side-by-Side Dual Column Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#0f2744', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}>
            <div>🇮🇳 राज्य पाठ्यपुस्तक (हिन्दी मूल पाठ)</div>
            <div>🏹 ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ (Santali Reader)</div>
          </div>

          {currentPage.paragraphs.map((p, idx) => (
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

        {/* Practice Drill or Exercise Box if present */}
        {currentPage.exercise && (
          <div style={{ marginTop: '0.5rem', padding: '12px 16px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.85rem', marginBottom: '4px' }}>
              ✍️ कक्षा अभ्यास एवं मूल्यांकन (Classroom Practice):
            </div>
            <div style={{ fontSize: '0.88rem', color: '#78350f', fontWeight: 600 }}>
              {currentPage.exercise.question_hin}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#b45309', fontFamily: 'Noto Sans Ol Chiki, sans-serif', marginTop: '2px' }}>
              {currentPage.exercise.question_sat}
            </div>
          </div>
        )}
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
