export type GradeLevel = 'Balvatika' | 'Grade 1' | 'Grade 2' | 'Grade 3';
export type SubjectType = 'All' | 'Mathematics' | 'Language' | 'EVS';

export interface BookParagraph {
  id: number;
  hindi: string;
  santali: string;
  pronunciation: string;
  visual?: string;
  vocab?: Array<{ hin: string; sat: string }>;
}

export interface BookChapter {
  id: string;
  chapter_no: number;
  title_hin: string;
  title_sat: string;
  summary_hin: string;
  summary_sat: string;
  visual_banner?: string;
  paragraphs: BookParagraph[];
  exercise?: {
    question_hin: string;
    question_sat: string;
    type: string;
  };
}

export interface FullOfficialBook {
  id: string;
  grade: GradeLevel;
  subject: 'Mathematics' | 'Language' | 'EVS';
  book_code: string;
  title_hin: string;
  title_sat: string;
  cover_color: string;
  icon: string;
  chapters: BookChapter[];
}

export const ALL_JCERT_TEXTBOOKS: FullOfficialBook[] = [
  // ═══════════════════════════════════════════════════════════
  // 🎒 BALVATIKA (PRE-PRIMARY)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'bal_math_full',
    grade: 'Balvatika',
    subject: 'Mathematics',
    book_code: 'JCERT-BAL-MATH',
    title_hin: 'जादुई पिटारा: गणित एवं संख्या पूर्व अवधारणा',
    title_sat: 'ᱡᱟᱹᱫᱩᱭ ᱯᱤᱴᱟᱨᱟ: ᱮᱞᱠᱷᱟ ᱟᱨ ᱞᱮᱠᱷᱟ ᱵᱩᱡᱷᱟᱹᱣ',
    cover_color: '#0d9488',
    icon: '🎒',
    chapters: [
      {
        id: 'bal_m_c1',
        chapter_no: 1,
        title_hin: 'छोटा और बड़ा, भारी और हल्का',
        title_sat: 'ᱦᱩᱰᱤᱧ ᱟᱨ ᱢᱟᱨᱟᱝ, ᱦᱟᱢᱟᱞ ᱟᱨ ᱨᱟᱣᱟᱞ',
        summary_hin: 'आकार और वजन की प्राथमिक तुलना।',
        summary_sat: 'ᱢᱩᱴᱷᱟᱹᱱ ᱟᱨ ᱦᱟᱢᱟᱞ ᱵᱟᱪᱷᱟᱣ ᱵᱩᱡᱷᱟᱹᱣ᱾',
        visual_banner: '🐘 (ᱢᱟᱨᱟᱝ - Big) | 🐁 (ᱦᱩᱰᱤᱧ - Small)',
        paragraphs: [
          {
            id: 1001,
            hindi: 'हाथी बहुत बड़ा और भारी होता है। चूहा छोटा और हल्का होता है।',
            santali: 'ᱦᱟᱹᱛᱤ ᱫᱚ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱟᱨ ᱦᱟᱢᱟᱞ ᱜᱮᱭᱟ᱾ ᱪᱩᱛᱤᱭᱟᱹ ᱫᱚ ᱦᱩᱰᱤᱧ ᱟᱨ ᱨᱟᱣᱟᱞ ᱜᱮᱭᱟ᱾',
            pronunciation: 'Hati do adi marang ar hamal geya. Cutiya do hudinj ar rawal geya.',
            visual: '🐘 🐁',
            vocab: [{ hin: 'बड़ा', sat: 'ᱢᱟᱨᱟᱝ' }, { hin: 'छोटा', sat: 'ᱦᱩᱰᱤᱧ' }, { hin: 'भारी', sat: 'ᱦᱟᱢᱟᱞ' }, { hin: 'हल्का', sat: 'ᱨᱟᱣᱟᱞ' }]
          },
          {
            id: 1002,
            hindi: 'तरबूज भारी है और पत्ता हल्का है। भारी को संताली में "हामाल" (ᱦᱟᱢᱟᱞ) कहते हैं।',
            santali: 'ᱛᱟᱨᱵᱩᱡ ᱫᱚ ᱦᱟᱢᱟᱞ ᱜᱮᱭᱟ ᱟᱨ ᱥᱟᱠᱟᱢ ᱫᱚ ᱨᱟᱣᱟᱞ ᱜᱮᱭᱟ᱾ ᱦᱟᱢᱟᱞ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱦᱟᱢᱟᱞ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
            pronunciation: 'Tarbuj do hamal geya ar sakam do rawal geya. Hamal do Santali te "Hamal" bon metaga.',
            visual: '🍉 🍃',
            vocab: [{ hin: 'पत्ता', sat: 'ᱥᱟᱠᱟᱢ' }, { hin: 'तरबूज', sat: 'ᱛᱟᱨᱵᱩᱡ' }]
          }
        ],
        exercise: {
          question_hin: 'अभ्यास: भारी वस्तु पर गोला लगाओ और हल्की वस्तु पर सही का निशान लगाओ।',
          question_sat: 'ᱟᱵᱷᱭᱟᱥ: ᱦᱟᱢᱟᱞ ᱡᱤᱱᱤᱥ ᱨᱮ ᱜᱩᱞ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱨᱟᱣᱟᱞ ᱡᱤᱱᱤᱥ ᱨᱮ ᱴᱤᱠ ᱪᱤᱱᱦᱟᱹ ᱮᱢ ᱢᱮ᱾',
          type: 'Comparison Drill'
        }
      },
      {
        id: 'bal_m_c2',
        chapter_no: 2,
        title_hin: 'आकृतियाँ और रंग: गोल, चौकोर, लाल, हरा',
        title_sat: 'ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱨᱚᱝ: ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ, ᱟᱨᱟᱜ, ᱦᱟᱹᱨᱭᱟᱹᱲ',
        summary_hin: 'बुनियादी आकृतियों और प्राथमिक रंगों की पहचान।',
        summary_sat: 'ᱢᱩᱴᱷᱟᱹᱱ ᱟᱨ ᱨᱚᱝ ᱪᱤᱱᱦᱟᱹᱣ᱾',
        visual_banner: '☀️ 🔴 ⭕ | 📦 🟩 🔲',
        paragraphs: [
          {
            id: 1003,
            hindi: 'सूरज गोल (ᱜᱩᱞ) है और सेब लाल (ᱟᱨᱟᱜ) है।',
            santali: 'ᱵᱮᱨᱟ ᱫᱚ ᱜᱩᱞ (ᱜᱩᱞ) ᱜᱮᱭᱟ ᱟᱨ ᱥᱮᱣ ᱫᱚ ᱟᱨᱟᱜ (ᱟᱨᱟᱜ) ᱜᱮᱭᱟ᱾',
            pronunciation: 'Bera do gul geya ar sew do arag geya.',
            visual: '☀️ 🔴',
            vocab: [{ hin: 'गोल', sat: 'ᱜᱩᱞ' }, { hin: 'लाल', sat: 'ᱟᱨᱟᱜ' }]
          },
          {
            id: 1004,
            hindi: 'घास हरी (ᱦᱟᱹᱨᱭᱟᱹᱲ) होती है और आसमान नीला (ᱞᱤᱞ) होता है।',
            santali: 'ᱜᱷᱟᱥ ᱫᱚ ᱦᱟᱹᱨᱭᱟᱹᱲ (ᱦᱟᱹᱨᱭᱟᱹᱲ) ᱜᱮᱭᱟ ᱟᱨ ᱥᱮᱨᱢᱟ ᱫᱚ ᱞᱤᱞ (ᱞᱤᱞ) ᱜᱮᱭᱟ᱾',
            pronunciation: 'Ghas do hariyar geya ar serma do lil geya.',
            visual: '🌱 🌌',
            vocab: [{ hin: 'हरा', sat: 'ᱦᱟᱹᱨᱭᱟᱹᱲ' }, { hin: 'नीला', sat: 'ᱞᱤᱞ' }, { hin: 'आसमान', sat: 'ᱥᱮᱨᱢᱟ' }]
          }
        ]
      },
      {
        id: 'bal_m_c3',
        chapter_no: 3,
        title_hin: '1 से 5 तक संख्या बोध और गिनती',
        title_sat: '᱑ ᱠᱷᱚᱱ ᱕ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱟᱨ ᱮᱞᱠᱷᱟ',
        summary_hin: 'उँगलियों और वस्तुओं की सहायता से 1 से 5 तक की गिनती।',
        summary_sat: 'ᱠᱟᱹᱴᱩᱵ ᱟᱨ ᱡᱤᱱᱤᱥ ᱦᱚᱛᱮᱛᱮ ᱑ ᱠᱷᱚᱱ ᱕ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ᱾',
        visual_banner: '☝️ 1 = ᱢᱤᱫ | ✌️ 2 = ᱵᱟᱨ | 🤟 3 = ᱯᱮ | 🖖 4 = ᱯᱩᱱ | 🖐️ 5 = ᱢᱚᱬᱮ',
        paragraphs: [
          {
            id: 1005,
            hindi: '1 (मिद - ᱢᱤᱫ), 2 (बार - ᱵᱟᱨ), 3 (पे - ᱯᱮ)।',
            santali: '᱑ (ᱢᱤᱫ), ᱒ (ᱵᱟᱨ), ᱓ (ᱯᱮ)᱾',
            pronunciation: '1 (Mid), 2 (Bar), 3 (Pe).',
            visual: '🍎 | 🍎🍎 | 🍎🍎🍎',
            vocab: [{ hin: 'एक', sat: 'ᱢᱤᱫ' }, { hin: 'दो', sat: 'ᱵᱟᱨ' }, { hin: 'तीन', sat: 'ᱯᱮ' }]
          },
          {
            id: 1006,
            hindi: '4 (पुन - ᱯᱩᱱ), 5 (मोणे - ᱢᱚᱬᱮ)। एक हाथ में पाँच उँगलियाँ होती हैं।',
            santali: '᱔ (ᱯᱩᱱ), ᱕ (ᱢᱚᱬᱮ)᱾ ᱢᱤᱫ ᱛᱤ ᱨᱮ ᱢᱚᱬᱮ ᱠᱟᱹᱴᱩᱵ ᱛᱟᱦᱮᱸᱱᱟ᱾',
            pronunciation: '4 (Pun), 5 (Mone). Mid ti re mone katub tahena.',
            visual: '🖐️ (5 = ᱢᱚᱬᱮ)',
            vocab: [{ hin: 'चार', sat: 'ᱯᱩᱱ' }, { hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }, { hin: 'हाथ', sat: 'ᱛᱤ' }]
          }
        ]
      },
      {
        id: 'bal_m_c4',
        chapter_no: 4,
        title_hin: 'वस्तुओं का मिलान और समूह बनाना',
        title_sat: 'ᱡᱤᱱᱤᱥ ᱡᱚᱲᱟᱣ ᱟᱨ ᱜᱟᱫᱮᱞ ᱛᱮᱭᱟᱨ',
        summary_hin: 'समान वस्तुओं का मिलान और 3-3 के समूह बनाना।',
        summary_sat: 'ᱢᱤᱫ ᱞᱮᱠᱟᱱ ᱡᱤᱱᱤᱥ ᱡᱚᱲᱟᱣ ᱟᱨ ᱜᱟᱫᱮᱞ ᱵᱮᱱᱟᱣ᱾',
        visual_banner: '⚽ ⚽ ⚽ (ᱜᱟᱫᱮᱞ - Group of 3)',
        paragraphs: [
          {
            id: 1007,
            hindi: 'इन तीन गेंदों को एक घेरे में रखो। यह 3 का एक समूह (ᱜᱟᱫᱮᱞ) बन गया।',
            santali: 'ᱱᱚᱣᱟ ᱯᱮᱭᱟ ᱵᱚᱞ ᱢᱤᱫ ᱜᱩᱞ ᱨᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱓ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱜᱟᱫᱮᱞ (ᱜᱟᱫᱮᱞ) ᱦᱩᱭ ᱮᱱᱟ᱾',
            pronunciation: 'Nowa peya bol mid gul re dohoy me. Nowa do 3 renag mid gadel huy ena.',
            visual: '⭕ (⚽⚽⚽)',
            vocab: [{ hin: 'समूह / ग्रुप', sat: 'ᱜᱟᱫᱮᱞ' }, { hin: 'तीन', sat: 'ᱯᱮ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'bal_lang_full',
    grade: 'Balvatika',
    subject: 'Language',
    book_code: 'JCERT-BAL-LANG',
    title_hin: 'भाषा वाटिका: सुनो, बोलो और कहानी सीखो',
    title_sat: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱜᱟᱱ: ᱟᱸᱡᱚᱢ, ᱨᱚᱲ ᱟᱨ ᱠᱟᱹᱦᱱᱤ ᱪᱮᱫᱚᱜ',
    cover_color: '#ea580c',
    icon: '📕',
    chapters: [
      {
        id: 'bal_l_c1',
        chapter_no: 1,
        title_hin: 'प्रभात गीत: जोहार शिक्षक, जोहार बच्चे',
        title_sat: 'ᱥᱮᱛᱟᱜ ᱥᱮᱨᱮᱧ: ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ, ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ',
        summary_hin: 'कक्षा की शुरुआत में सुबह का अभिवादन और गीत।',
        summary_sat: 'ᱪᱟᱱᱟᱪ ᱮᱛᱚᱦᱚᱵ ᱨᱮ ᱡᱚᱦᱟᱨ ᱥᱮᱨᱮᱧ᱾',
        visual_banner: '🌄 🏫 👦👧 🙏',
        paragraphs: [
          {
            id: 1008,
            hindi: 'सूरज निकला, हुआ सवेरा। सब बच्चों ने हाथ जोड़कर कहा: "जोहार शिक्षक जी!"',
            santali: 'ᱵᱮᱨᱟ ᱨᱟᱠᱟᱵ ᱮᱱᱟ, ᱥᱮᱛᱟᱜ ᱮᱱᱟ᱾ ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱤ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱠᱚ ᱢᱮᱱ ᱠᱮᱫᱼᱟ: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ!"',
            pronunciation: 'Bera rakab ena, setag ena. Joto gidra ti joraw kate ko men keda: "Johar macet gomke!"',
            visual: '🌄 🙏',
            vocab: [{ hin: 'सवेरा', sat: 'ᱥᱮᱛᱟᱜ' }, { hin: 'शिक्षक', sat: 'ᱢᱟᱪᱮᱛ' }]
          },
          {
            id: 1009,
            hindi: 'शिक्षक ने कहा: "जोहार बच्चों! आओ आज हम सब मिलकर नई कहानी सुनें।"',
            santali: 'ᱢᱟᱪᱮᱛ ᱮ ᱢᱮᱱ ᱠᱮᱫᱼᱟ: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱫᱮᱞᱟ ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱱᱟᱣᱟ ᱠᱟᱹᱦᱱᱤ ᱵᱚᱱ ᱟᱸᱡᱚᱢᱟ᱾"',
            pronunciation: 'Macet e men keda: "Johar gidrako! Dela tehen abo nawa kahni bon anjoma."',
            visual: '📖 ✨',
            vocab: [{ hin: 'कहानी', sat: 'ᱠᱟᱹᱦᱱᱤ' }, { hin: 'नया', sat: 'ᱱᱟᱣᱟ' }]
          }
        ]
      },
      {
        id: 'bal_l_c2',
        chapter_no: 2,
        title_hin: 'प्यासा कौवा और मिट्टी का घड़ा',
        title_sat: 'ᱛᱮᱛᱟᱝ ᱠᱟᱦᱩ ᱟᱨ ᱦᱟᱥᱟ ᱴᱩᱠᱩᱡ',
        summary_hin: 'चतुर कौवे की कहानी और मेहनत का फल।',
        summary_sat: 'ᱪᱟᱞᱟᱠ ᱠᱟᱦᱩ ᱟᱨ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱚᱨᱡᱚ᱾',
        visual_banner: '🌲 🦅 🏺 💧',
        paragraphs: [
          {
            id: 1010,
            hindi: 'एक कौवे को बहुत तेज प्यास लगी थी। घड़े में बहुत कम पानी था।',
            santali: 'ᱢᱤᱫ ᱠᱟᱦᱩ ᱟᱹᱰᱤ ᱛᱮᱛᱟᱝ ᱠᱮᱫᱮᱭᱟ᱾ ᱴᱩᱠᱩᱡ ᱨᱮ ᱟᱹᱰᱤ ᱠᱚᱢ ᱫᱟᱜ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾',
            pronunciation: 'Mid kahu adi tetang kedeya. Tukuj re adi kom dag tahekana.',
            visual: '🦅 🏺',
            vocab: [{ hin: 'कौवा', sat: 'ᱠᱟᱦᱩ' }, { hin: 'घड़ा', sat: 'ᱴᱩᱠᱩᱡ' }, { hin: 'पानी', sat: 'ᱫᱟᱜ' }]
          },
          {
            id: 1011,
            hindi: 'कौवे ने एक-एक कंकड़ घड़े में डाला। पानी ऊपर आया, कौवे ने पानी पिया।',
            santali: 'ᱠᱟᱦᱩ ᱢᱤᱫ-ᱢᱤᱫ ᱫᱷᱤᱨᱤ ᱴᱩᱠᱩᱡ ᱨᱮ ᱠᱷᱟᱫᱞᱮ ᱠᱮᱫᱼᱟ᱾ ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ ᱮᱱᱟ, ᱠᱟᱦᱩ ᱫᱟᱜ ᱮ ᱧᱩ ᱠᱮᱫᱼᱟ᱾',
            pronunciation: 'Kahu mid-mid dhiri tukuj re khadle keda. Dag cetan rakab ena, kahu dag e nyu keda.',
            visual: '🪨 💧 🦅',
            vocab: [{ hin: 'कंकड़', sat: 'ᱫᱷᱤᱨᱤ' }, { hin: 'ऊपर', sat: 'ᱪᱮᱛᱟᱱ' }]
          }
        ]
      },
      {
        id: 'bal_l_c3',
        chapter_no: 3,
        title_hin: 'शेर और नन्हा चूहा (दया की सीख)',
        title_sat: 'ᱛᱟᱹᱨᱩᱵ ᱟᱨ ᱦᱩᱰᱤᱧ ᱪᱩᱛᱤᱭᱟᱹ (ᱫᱟᱭᱟ ᱥᱤᱠᱷᱱᱟᱹᱛ)',
        summary_hin: 'छोटा जीव भी समय आने पर बड़ा उपकार कर सकता है।',
        summary_sat: 'ᱦᱩᱰᱤᱧ ᱡᱤᱵᱽ ᱦᱚᱸ ᱚᱠᱛᱚ ᱨᱮ ᱢᱟᱨᱟᱝ ᱜᱚᱲᱚᱭ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾',
        visual_banner: '🦁 🐁 🌲',
        paragraphs: [
          {
            id: 1012,
            hindi: 'एक दिन शेर जाल में फँस गया। छोटे चूहे ने अपने तेज दाँतों से जाल काट दिया।',
            santali: 'ᱢᱤᱫ ᱫᱤᱱ ᱛᱟᱹᱨᱩᱵ ᱡᱷᱟᱹᱞᱤ ᱨᱮ ᱯᱷᱟᱥᱟᱣ ᱮᱱᱟ᱾ ᱦᱩᱰᱤᱧ ᱪᱩᱛᱤᱭᱟᱹ ᱟᱡᱟᱜ ᱞᱟᱥᱮᱨ ᱰᱟᱴᱟ ᱛᱮ ᱡᱷᱟᱹᱞᱤ ᱜᱮᱫ ᱠᱮᱫᱼᱟ᱾',
            pronunciation: 'Mid din tarub jhali re phasaw ena. Hudinj cutiya ajag laser data te jhali ged keda.',
            visual: '🦁 🕸️ 🐁',
            vocab: [{ hin: 'शेर / बाघ', sat: 'ᱛᱟᱹᱨᱩᱵ' }, { hin: 'चूहा', sat: 'ᱪᱩᱛᱤᱭᱟᱹ' }, { hin: 'जाल', sat: 'ᱡᱷᱟᱹᱞᱤ' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // 🏫 GRADE 1 (CLASS 1)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'g1_math_full',
    grade: 'Grade 1',
    subject: 'Mathematics',
    book_code: 'JCERT-G1-MATH',
    title_hin: 'JCERT गणित खेल (Class 1 Math Magic)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱮᱱᱮᱡ (᱑ ᱪᱟᱱᱟᱪ)',
    cover_color: '#2563eb',
    icon: '📘',
    chapters: [
      {
        id: 'g1_m_c1',
        chapter_no: 1,
        title_hin: 'संख्याएँ और गिनती: 1 से 10 तक',
        title_sat: 'ᱮᱞᱠᱷᱟ ᱟᱨ ᱞᱮᱠᱷᱟ: ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ',
        summary_hin: 'वस्तुओं को गिनना और 1 से 10 तक संख्याओं की पहचान।',
        summary_sat: 'ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟ ᱟᱨ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱮᱞᱠᱷᱟ ᱪᱤᱱᱦᱟᱹᱣ᱾',
        visual_banner: '🍎 🐄 🐦 🖐️ 🔟',
        paragraphs: [
          {
            id: 2001,
            hindi: '1 सेब = ᱢᱤᱫ (मिद), 2 गाय = ᱵᱟᱨ (बार), 3 चिड़ियाँ = ᱯᱮ (पे)।',
            santali: '᱑ ᱥᱮᱣ = ᱢᱤᱫ, ᱒ ᱜᱟᱹᱭ = ᱵᱟᱨ, ᱓ ᱪᱮᱬᱮ = ᱯᱮ᱾',
            pronunciation: '1 sew = Mid, 2 gai = Bar, 3 chene = Pe.',
            visual: '🍎 | 🐄🐄 | 🐦🐦🐦',
            vocab: [{ hin: 'एक', sat: 'ᱢᱤᱫ' }, { hin: 'दो', sat: 'ᱵᱟᱨ' }, { hin: 'तीन', sat: 'ᱯᱮ' }]
          },
          {
            id: 2002,
            hindi: '4 किताबें = ᱯᱩᱱ (पुन), 5 उँगलियाँ = ᱢᱚᱬᱮ (मोणे), 6 गेंदें = ᱛᱩᱨᱩᱭ (तुरुय)।',
            santali: '᱔ ᱯᱩᱛᱷᱤ = ᱯᱩᱱ, ᱕ ᱠᱟᱹᱴᱩᱵ = ᱢᱚᱬᱮ, ᱖ ᱵᱚᱞ = ᱛᱩᱨᱩᱭ᱾',
            pronunciation: '4 puthi = Pun, 5 katub = Mone, 6 bol = Turui.',
            visual: '📚 | 🖐️ | ⚽',
            vocab: [{ hin: 'चार', sat: 'ᱯᱩᱱ' }, { hin: 'पाँच', sat: 'ᱢᱚᱬᱮ' }, { hin: 'छह', sat: 'ᱛᱩᱨᱩᱭ' }]
          },
          {
            id: 2003,
            hindi: '7 फूल = ᱮᱭᱟᱭ (एयाय), 8 पत्ते = ᱤᱨᱟᱹᱞ (इरल), 9 पेंसिल = ᱟᱨᱮ (आरे), 10 तारे = ᱜᱮᱞ (गेल)।',
            santali: '᱗ ᱵᱟᱦᱟ = ᱮᱭᱟᱭ, ᱘ ᱥᱟᱠᱟᱢ = ᱤᱨᱟᱹᱞ, ᱙ ᱯᱮᱱᱥᱤᱞ = ᱟᱨᱮ, ᱑᱐ ᱤᱯᱤᱞ = ᱜᱮᱞ᱾',
            pronunciation: '7 baha = Eyay, 8 sakam = Iral, 9 pencil = Are, 10 ipil = Gel.',
            visual: '🌸 | 🍃 | ✏️ | ⭐',
            vocab: [{ hin: 'सात', sat: 'ᱮᱭᱟᱭ' }, { hin: 'आठ', sat: 'ᱤᱨᱟᱹᱞ' }, { hin: 'नौ', sat: 'ᱟᱨᱮ' }, { hin: 'दस', sat: 'ᱜᱮᱞ' }]
          }
        ],
        exercise: {
          question_hin: 'प्रश्न: 5 के बाद कौन सी संख्या आती है? अपनी कॉपी में लिखो।',
          question_sat: 'ᱠᱩᱠᱞᱤ: ᱕ ᱛᱟᱭᱚᱢ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ? ᱟᱢᱟᱜ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ᱾',
          type: 'Number Recall'
        }
      },
      {
        id: 'g1_m_c2',
        chapter_no: 2,
        title_hin: 'आकृतियाँ और स्थान: गोल, चौकोर और तिकोना',
        title_sat: 'ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱴᱷᱟᱶ: ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ ᱟᱨ ᱯᱮ ᱠᱳᱬ',
        summary_hin: 'विभिन्न ज्यामितीय आकृतियों और आकार की समझ।',
        summary_sat: 'ᱟᱭᱢᱟ ᱞᱮᱠᱟᱱ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱢᱩᱴᱷᱟᱹᱱ ᱵᱩᱡᱷᱟᱹᱣ᱾',
        visual_banner: '⭕ 🔲 🔺',
        paragraphs: [
          {
            id: 2004,
            hindi: 'सिक्का और चूड़ी गोल (ᱜᱩᱞ) हैं। कैरम बोर्ड चौकोर (ᱪᱟᱹᱨᱠᱷᱤ) है।',
            santali: 'ᱯᱩᱭᱥᱟᱹ ᱟᱨ ᱥᱟᱠᱚᱢ ᱫᱚ ᱜᱩᱞ (ᱜᱩᱞ) ᱜᱮᱭᱟ᱾ ᱠᱮᱨᱚᱢ ᱵᱳᱨᱰ ᱫᱚ ᱪᱟᱹᱨᱠᱷᱤ (ᱪᱟᱹᱨᱠᱷᱤ) ᱜᱮᱭᱟ᱾',
            pronunciation: 'Puysa ar sakom do gul geya. Carrom board do carkhi geya.',
            visual: '🪙 ⭕ | 🔲',
            vocab: [{ hin: 'गोल', sat: 'ᱜᱩᱞ' }, { hin: 'चौकोर', sat: 'ᱪᱟᱹᱨᱠᱷᱤ' }]
          },
          {
            id: 2005,
            hindi: 'समोसा और पहाड़ तिकोना (ᱯᱮ ᱠᱳᱬ) होते हैं। तिकोने में 3 कोने होते हैं।',
            santali: 'ᱥᱟᱢᱚᱥᱟ ᱟᱨ ᱵᱩᱨᱩ ᱫᱚ ᱯᱮ ᱠᱳᱬ (ᱯᱮ ᱠᱳᱬ) ᱜᱮᱭᱟ᱾ ᱯᱮ ᱠᱳᱬ ᱨᱮ ᱓ ᱠᱳᱬ ᱛᱟᱦᱮᱸᱱᱟ᱾',
            pronunciation: 'Samosa ar buru do pe kon geya. Pe kon re 3 kon tahena.',
            visual: '⛰️ 🔺',
            vocab: [{ hin: 'पहाड़', sat: 'ᱵᱩᱨᱩ' }, { hin: 'तिकोना', sat: 'ᱯᱮ ᱠᱳᱬ' }]
          }
        ]
      },
      {
        id: 'g1_m_c3',
        chapter_no: 3,
        title_hin: 'जोड़ का खेल: एक साथ मिलाना (1 से 9)',
        title_sat: 'ᱡᱚᱲᱟᱣ ᱮᱱᱮᱡ: ᱢᱤᱫ ᱴᱷᱮᱱ ᱢᱮᱥᱟ (᱑ ᱠᱷᱚᱱ ᱙)',
        summary_hin: 'वस्तुओं को मिलाकर कुल संख्या ज्ञात करना।',
        summary_sat: 'ᱡᱤᱱᱤᱥ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱢᱚᱴ ᱮᱞᱠᱷᱟ ᱧᱟᱢ᱾',
        visual_banner: '🥭🥭 + 🥭 = 🥭🥭🥭 (3)',
        paragraphs: [
          {
            id: 2006,
            hindi: 'सीता के पास 2 आम हैं। रामू ने 1 आम और दिया। अब कुल 3 आम हो गए। 2 + 1 = 3',
            santali: 'ᱥᱤᱛᱟ ᱴᱷᱮᱱ ᱒ ᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱨᱟᱢᱩ ᱑ ᱩᱞ ᱮ ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱱᱤᱛᱚᱜ ᱓ ᱩᱞ ᱦᱩᱭ ᱮᱱᱟ᱾ ᱒ + ᱑ = ᱓',
            pronunciation: 'Sita then 2 ul menaga. Ramu 1 ul e emadeya. Nitog 3 ul huy ena. 2 + 1 = 3',
            visual: '🥭🥭 + 🥭 = 3',
            vocab: [{ hin: 'आम', sat: 'ᱩᱞ' }, { hin: 'जोड़', sat: 'ᱡᱚᱲᱟᱣ' }]
          }
        ]
      },
      {
        id: 'g1_m_c4',
        chapter_no: 4,
        title_hin: 'घटाव का खेल: कितना बचा? (1 से 9)',
        title_sat: 'ᱜᱷᱟᱴᱟᱣ ᱮᱱᱮᱡ: ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ? (᱑ ᱠᱷᱚᱱ ᱙)',
        summary_hin: 'वस्तुओं को हटाने पर शेष संख्या ज्ञात करना।',
        summary_sat: 'ᱡᱤᱱᱤᱥ ᱚᱪᱚᱜ ᱠᱟᱛᱮ ᱥᱟᱨᱮᱡ ᱮᱞᱠᱷᱟ ᱧᱟᱢ᱾',
        visual_banner: '🍎🍎🍎🍎 - 🍎 = 🍎🍎🍎 (3)',
        paragraphs: [
          {
            id: 2007,
            hindi: 'पेड़ पर 4 चिड़ियाँ थीं। 1 चिड़िया उड़ गई। अब 3 चिड़ियाँ बचीं। 4 - 1 = 3',
            santali: 'ᱫᱟᱨᱮ ᱨᱮ ᱔ ᱪᱮᱬᱮ ᱠᱚ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱑ ᱪᱮᱬᱮ ᱩᱰᱟᱹᱣ ᱮᱱᱟᱭ᱾ ᱱᱤᱛᱚᱜ ᱓ ᱪᱮᱬᱮ ᱠᱚ ᱥᱟᱨᱮᱡ ᱮᱱᱟ᱾ ᱔ - ᱑ = ᱓',
            pronunciation: 'Dare re 4 chene ko tahekana. 1 chene udaw enay. Nitog 3 chene ko sarej ena. 4 - 1 = 3',
            visual: '🐦🐦🐦 (3)',
            vocab: [{ hin: 'घटाव', sat: 'ᱜᱷᱟᱴᱟᱣ' }, { hin: 'बचा / शेष', sat: 'ᱥᱟᱨᱮᱡ' }]
          }
        ]
      },
      {
        id: 'g1_m_c5',
        chapter_no: 5,
        title_hin: 'शून्य (0) की समझ',
        title_sat: 'ᱥᱩᱱ (᱐) ᱨᱮᱭᱟᱜ ᱵᱩᱡᱷᱟᱹᱣ',
        summary_hin: 'जब कुछ भी न बचे तो उसे शून्य (0) कहते हैं।',
        summary_sat: 'ᱡᱚᱠᱷᱚᱱ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱥᱟᱨᱮᱡᱚᱜᱼᱟ ᱩᱱᱫᱚ ᱥᱩᱱ (᱐) ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ᱾',
        visual_banner: '🧺 (ᱯᱷᱟᱸᱠᱟ - Empty basket = 0)',
        paragraphs: [
          {
            id: 2008,
            hindi: 'टोकरी में 3 अमरूद थे। बच्चों ने तीनों खा लिए। अब टोकरी में 0 अमरूद बचे। 3 - 3 = 0',
            santali: 'ᱴᱩᱠᱨᱤ ᱨᱮ ᱓ ᱟᱢᱨᱩᱫ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱜᱤᱫᱽᱨᱟᱹ ᱡᱚᱛᱚ ᱠᱚ ᱡᱚᱢ ᱠᱮᱫᱼᱟ᱾ ᱱᱤᱛᱚᱜ ᱴᱩᱠᱨᱤ ᱨᱮ ᱐ ᱟᱢᱨᱩᱫ ᱥᱟᱨᱮᱡ ᱮᱱᱟ᱾ ᱓ - ᱓ = ᱐',
            pronunciation: 'Tukri re 3 amrud tahekana. Gidra joto ko jom keda. Nitog tukri re 0 amrud sarej ena. 3 - 3 = 0',
            visual: '🧺 0 = ᱥᱩᱱ',
            vocab: [{ hin: 'शून्य', sat: 'ᱥᱩᱱ' }, { hin: 'खा लिया', sat: 'ᱡᱚᱢ ᱠᱮᱫᱼᱟ' }]
          }
        ]
      },
      {
        id: 'g1_m_c6',
        chapter_no: 6,
        title_hin: 'संख्याएँ 11 से 20 और दहाई',
        title_sat: 'ᱮᱞᱠᱷᱟ ᱑᱑ ᱠᱷᱚᱱ ᱒᱐ ᱟᱨ ᱜᱮᱞ',
        summary_hin: '10 में संख्याएँ जोड़कर 11 से 20 बनाना।',
        summary_sat: '᱑᱐ ᱨᱮ ᱮᱞᱠᱷᱟ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱑᱑ ᱠᱷᱚᱱ ᱒᱐ ᱵᱮᱱᱟᱣ᱾',
        visual_banner: '📦 (10) + ✏️ = 11 (ᱜᱮᱞ ᱢᱤᱫ)',
        paragraphs: [
          {
            id: 2009,
            hindi: '10 और 1 = 11 (गेल मिद - ᱜᱮᱞ ᱢᱤᱫ)। 10 और 2 = 12 (गेल बार - ᱜᱮᱞ ᱵᱟᱨ)।',
            santali: '᱑᱐ ᱟᱨ ᱑ = ᱑᱑ (ᱜᱮᱞ ᱢᱤᱫ)᱾ ᱑᱐ ᱟᱨ ᱒ = ᱑᱒ (ᱜᱮᱞ ᱵᱟᱨ)᱾',
            pronunciation: '10 ar 1 = 11 (Gel Mid). 10 ar 2 = 12 (Gel Bar).',
            visual: '11 = ᱜᱮᱞ ᱢᱤᱫ | 12 = ᱜᱮᱞ ᱵᱟᱨ',
            vocab: [{ hin: 'ग्यारह', sat: 'ᱜᱮᱞ ᱢᱤᱫ' }, { hin: 'बारह', sat: 'ᱜᱮᱞ ᱵᱟᱨ' }]
          },
          {
            id: 2010,
            hindi: '10 और 10 = 20 (बार गेल / बीस - ᱵᱟᱨ ᱜᱮᱞ / ᱵᱤᱥ)।',
            santali: '᱑᱐ ᱟᱨ ᱑᱐ = ᱒᱐ (ᱵᱟᱨ ᱜᱮᱞ / ᱵᱤᱥ)᱾',
            pronunciation: '10 ar 10 = 20 (Bar Gel / Bis).',
            visual: '20 = ᱵᱟᱨ ᱜᱮᱞ',
            vocab: [{ hin: 'बीस', sat: 'ᱵᱟᱨ ᱜᱮᱞ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'g1_lang_full',
    grade: 'Grade 1',
    subject: 'Language',
    book_code: 'JCERT-G1-LANG',
    title_hin: 'JCERT भाषा वाटिका / ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱜᱟᱱ (᱑ ᱪᱟᱱᱟᱪ)',
    cover_color: '#7c3aed',
    icon: '📕',
    chapters: [
      {
        id: 'g1_l_c1',
        chapter_no: 1,
        title_hin: 'कछुआ और खरगोश की दौड़',
        title_sat: 'ᱦᱚᱨᱚ ᱟᱨ ᱠᱩᱞᱟᱹᱭ ᱨᱮᱭᱟᱜ ᱫᱟᱹᱲ',
        summary_hin: 'लगातार और धैर्य से काम करने पर सफलता मिलती है।',
        summary_sat: 'ᱞᱮᱛᱟᱲ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱛᱮ ᱡᱤᱛᱠᱟᱹᱨ ᱧᱟᱢᱚᱜᱼᱟ᱾',
        visual_banner: '🐇 🐢 🌳 🏁',
        paragraphs: [
          {
            id: 2011,
            hindi: 'खरगोश को अपनी तेज चाल पर गर्व था। उसने कछुए को दौड़ की चुनौती दी।',
            santali: 'ᱠᱩᱞᱟᱹᱭ ᱟᱡᱟᱜ ᱞᱚᱜᱚᱱ ᱫᱟᱹᱲ ᱨᱮ ᱟᱹᱰᱤ ᱜᱚᱨᱚᱵᱽ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱩᱱᱤ ᱦᱚᱨᱚ ᱫᱟᱹᱲ ᱞᱟᱹᱜᱤᱫ ᱮ ᱦᱚᱦᱚᱣᱟᱫᱮᱭᱟ᱾',
            pronunciation: 'Kulai ajag logon dar re adi gorob tahekana. Uni horo dar lagid e hohowadeya.',
            visual: '🐇 🐢',
            vocab: [{ hin: 'खरगोश', sat: 'ᱠᱩᱞᱟᱹᱭ' }, { hin: 'कछुआ', sat: 'ᱦᱚᱨᱚ' }]
          },
          {
            id: 2012,
            hindi: 'खरगोश रास्ते में सो गया। कछुआ धीरे-धीरे चलता रहा और पहले पहुँचकर जीत गया।',
            santali: 'ᱠᱩᱞᱟᱹᱭ ᱦᱚᱨ ᱨᱮ ᱡᱟᱹᱯᱤᱫ ᱠᱮᱫᱼᱟ᱾ ᱦᱚᱨᱚ ᱫᱚ ᱵᱟᱹᱭᱼᱵᱟᱹᱭ ᱛᱮ ᱪᱟᱞᱟᱣ ᱮᱱᱟ ᱟᱨ ᱞᱟᱦᱟ ᱥᱮᱴᱮᱨ ᱠᱟᱛᱮ ᱡᱤᱛᱠᱟᱹᱨ ᱮᱱᱟ᱾',
            pronunciation: 'Kulai hor re japid keda. Horo do bay-bay te calaw ena ar laha seter kate jitkar ena.',
            visual: '💤 🐢 🏆',
            vocab: [{ hin: 'सो गया', sat: 'ᱡᱟᱹᱯᱤᱫ ᱠᱮᱫᱼᱟ' }, { hin: 'जीत गया', sat: 'ᱡᱤᱛᱠᱟᱹᱨ ᱮᱱᱟ' }]
          }
        ]
      },
      {
        id: 'g1_l_c2',
        chapter_no: 2,
        title_hin: 'हमारा प्यारा गाँव और विद्यालय',
        title_sat: 'ᱟᱵᱚᱣᱟᱜ ᱫᱩᱞᱟᱹᱲ ᱟᱹᱛᱩ ᱟᱨ ᱟᱥᱲᱟ',
        summary_hin: 'गाँव की सुंदरता, प्रकृति और विद्यालय का दैनिक जीवन।',
        summary_sat: 'ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱱᱟᱯᱟᱭ, ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱟᱨ ᱟᱥᱲᱟ ᱡᱤᱭᱚᱱ᱾',
        visual_banner: '🏡 🌳 🏫 🌾',
        paragraphs: [
          {
            id: 2013,
            hindi: 'हमारा गाँव बहुत सुंदर है। गाँव में साल और पलाश के सुंदर पेड़ हैं।',
            santali: 'ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭᱟ᱾ ᱟᱹᱛᱩ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱟᱨ ᱯᱟᱞᱟᱥ ᱨᱮᱱᱟᱜ ᱱᱟᱯᱟᱭ ᱫᱟᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
            pronunciation: 'Abowag atu adi napaya. Atu re sarjom ar palas renag napay dare menaga.',
            visual: '🏡 🌲 🌺',
            vocab: [{ hin: 'गाँव', sat: 'ᱟᱹᱛᱩ' }, { hin: 'साल का पेड़', sat: 'ᱥᱟᱨᱡᱚᱢ' }, { hin: 'पलाश', sat: 'ᱯᱟᱞᱟᱥ' }]
          }
        ]
      },
      {
        id: 'g1_l_c3',
        chapter_no: 3,
        title_hin: 'चालाक लोमड़ी और खट्टे अंगूर',
        title_sat: 'ᱪᱟᱞᱟᱠ ᱛᱩᱭᱩ ᱟᱨ ᱡᱚᱡᱚ ᱟᱝᱜᱩᱨ',
        summary_hin: 'जब कोई चीज न मिले तो उसमें दोष नहीं निकालना चाहिए।',
        summary_sat: 'ᱡᱚᱠᱷᱚᱱ ᱡᱟᱦᱟᱱᱟᱜ ᱵᱟᱝ ᱧᱟᱢᱚᱜᱼᱟ ᱩᱱᱫᱚ ᱵᱟᱹᱲᱤᱡ ᱵᱟᱝ ᱢᱮᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
        visual_banner: '🦊 🍇 ☀️',
        paragraphs: [
          {
            id: 2014,
            hindi: 'लोमड़ी ने ऊँचे पेड़ पर लटके अंगूर देखे। वह कई बार कूदी लेकिन पहुँच नहीं पाई।',
            santali: 'ᱛᱩᱭᱩ ᱪᱮᱛᱟᱱ ᱫᱟᱨᱮ ᱨᱮ ᱡᱷᱩᱞᱟᱹᱣ ᱟᱠᱟᱱ ᱟᱝᱜᱩᱨ ᱮ ᱧᱮᱞ ᱠᱮᱫᱼᱟ᱾ ᱩᱱᱤ ᱟᱭᱢᱟ ᱫᱷᱟᱣ ᱫᱚᱱ ᱠᱮᱫᱼᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱵᱟᱭ ᱥᱮᱴᱮᱨ ᱫᱟᱲᱮᱭᱟᱫᱼᱟ᱾',
            pronunciation: 'Tuyu cetan dare re jhulaw akan angur e nel keda. Uni ayma dhaw don keda menkhan bay seter dareyada.',
            visual: '🦊 🍇',
            vocab: [{ hin: 'लोमड़ी', sat: 'ᱛᱩᱭᱩ' }, { hin: 'अंगूर', sat: 'ᱟᱝᱜᱩᱨ' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // 🏫 GRADE 2 (CLASS 2)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'g2_math_full',
    grade: 'Grade 2',
    subject: 'Mathematics',
    book_code: 'JCERT-G2-MATH',
    title_hin: 'JCERT गणित वाटिका (Class 2 Math)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱵᱟᱜᱟᱱ (᱒ ᱪᱟᱱᱟᱪ)',
    cover_color: '#4338ca',
    icon: '📘',
    chapters: [
      {
        id: 'g2_m_c1',
        chapter_no: 1,
        title_hin: '1 से 100 तक गिनती और स्थानीय मान',
        title_sat: '᱑ ᱠᱷᱚᱱ ᱑᱐᱐ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱟᱨ ᱴᱷᱟᱶ ᱮᱞ',
        summary_hin: 'दहाई-इकाई और 100 तक संख्याओं का अभ्यास।',
        summary_sat: 'ᱜᱮᱞ-ᱢᱤᱫ ᱟᱨ ᱑᱐᱐ ᱦᱟᱹᱵᱤᱡ ᱮᱞᱠᱷᱟ ᱟᱵᱷᱭᱟᱥ᱾',
        visual_banner: '🥢🥢🥢🥢🥢🥢🥢🥢🥢🥢 (10 = ᱜᱮᱞ) | 💯 (100 = ᱥᱟᱭ)',
        paragraphs: [
          {
            id: 3001,
            hindi: '10 तीलियों का 1 बंडल = 1 दहाई (10 = ᱜᱮᱞ)। 5 दहाई = 50 (ᱢᱚᱬᱮ ᱜᱮᱞ)। 10 दहाई = 100 (ᱥᱟᱭ)।',
            santali: '᱑᱐ ᱠᱟᱹᱴᱷᱤ ᱨᱮᱱᱟᱜ ᱑ ᱵᱟᱱᱰᱤᱞ = ᱑ ᱜᱮᱞ (᱑᱐ = ᱜᱮᱞ)᱾ ᱕ ᱜᱮᱞ = ᱕᱐ (ᱢᱚᱬᱮ ᱜᱮᱞ)᱾ ᱑᱐ ᱜᱮᱞ = ᱑᱐᱐ (ᱥᱟᱭ)᱾',
            pronunciation: '10 kathi renag 1 bandil = 1 Gel. 5 Gel = 50 (Mone Gel). 10 Gel = 100 (Say).',
            visual: '📦 (10) | 💯 (100)',
            vocab: [{ hin: 'दहाई', sat: 'ᱜᱮᱞ' }, { hin: 'पचास', sat: 'ᱢᱚᱬᱮ ᱜᱮᱞ' }, { hin: 'सौ', sat: 'ᱥᱟᱭ' }]
          }
        ]
      },
      {
        id: 'g2_m_c2',
        chapter_no: 2,
        title_hin: 'दो अंकों का जोड़ और घटाव (दैनिक जीवन)',
        title_sat: 'ᱵᱟᱨ ᱮᱞ ᱡᱚᱲᱟᱣ ᱟᱨ ᱜᱷᱟᱴᱟᱣ',
        summary_hin: 'दुकान और बाजार में पैसों एवं वस्तुओं का दैनिक हिसाब।',
        summary_sat: 'ᱦᱟᱴ-ᱵᱟᱡᱟᱨ ᱨᱮ ᱴᱟᱠᱟ-ᱯᱩᱭᱥᱟᱹ ᱦᱤᱥᱟᱹᱵᱽ᱾',
        visual_banner: '🧺 15 + 12 = 27',
        paragraphs: [
          {
            id: 3002,
            hindi: 'माँ ने 15 केले और 12 अमरूद खरीदे। कुल कितने फल हुए? 15 + 12 = 27',
            santali: 'ᱟᱭᱳ ᱑᱕ ᱠᱟᱭᱨᱟ ᱟᱨ ᱑᱒ ᱟᱢᱨᱩᱫ ᱮ ᱠᱤᱨᱤᱧ ᱠᱮᱫᱼᱟ᱾ ᱢᱚᱴ ᱛᱤᱱᱟᱹᱜ ᱡᱚ ᱦᱩᱭ ᱮᱱᱟ? ᱑᱕ + ᱑᱒ = ᱒᱗',
            pronunciation: 'Ayo 15 kayra ar 12 amrud e kirinj keda. Mot tinag jo huy ena? 15 + 12 = 27',
            visual: '🍌 + 🍐 = 27',
            vocab: [{ hin: 'माँ', sat: 'ᱟᱭᱳ' }, { hin: 'केला', sat: 'ᱠᱟᱭᱨᱟ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'g2_lang_full',
    grade: 'Grade 2',
    subject: 'Language',
    book_code: 'JCERT-G2-LANG',
    title_hin: 'JCERT पलाश भाषा मंजरी (Class 2 Language)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱟᱞᱟᱥ ᱯᱟᱹᱨᱥᱤ ᱢᱟᱧᱡᱟᱨᱤ (᱒ ᱪᱟᱱᱟᱪ)',
    cover_color: '#b91c1c',
    icon: '📕',
    chapters: [
      {
        id: 'g2_l_c1',
        chapter_no: 1,
        title_hin: 'हमारा राज्य झारखंड और सरहुल पर्व',
        title_sat: 'ᱟᱵᱚᱣᱟᱜ ᱯᱚᱱᱚᱛ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱟᱨ ᱥᱟᱨᱦᱩᱞ ᱯᱟᱨᱟᱵᱽ',
        summary_hin: 'झारखंड की संस्कृति, सरहुल का प्राकृतिक महत्व और मांदर की धुन।',
        summary_sat: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱞᱟᱠᱪᱟᱨ ᱟᱨ ᱥᱟᱨᱦᱩᱞ ᱯᱟᱨᱟᱵᱽ ᱢᱟᱹᱱ᱾',
        visual_banner: '🌳 🌸 🥁 💃🕺',
        paragraphs: [
          {
            id: 3003,
            hindi: 'झारखंड वीरों और प्रकृति की धरती है। रांची इसकी राजधानी है।',
            santali: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱫᱚ ᱵᱤᱨ ᱟᱨ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱦᱚᱲ ᱠᱚᱣᱟᱜ ᱫᱤᱥᱚᱢ ᱠᱟᱱᱟ᱾ ᱨᱟᱺᱪᱤ ᱫᱚ ᱱᱚᱣᱟ ᱨᱮᱱᱟᱜ ᱨᱟᱡᱽᱜᱟᱲ ᱠᱟᱱᱟ᱾',
            pronunciation: 'Jharkhand do bir ar kurumutu hor kowag disom kana. Ranchi do nowag rajgarh kana.',
            visual: '🇮🇳 🏹 🌳',
            vocab: [{ hin: 'झारखंड', sat: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ' }, { hin: 'रांची', sat: 'ᱨᱟᱺᱪᱤ' }]
          },
          {
            id: 3004,
            hindi: 'सरहुल पर्व में साल के नए फूलों (ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ) की पूजा होती है।',
            santali: 'ᱥᱟᱨᱦᱩᱞ ᱯᱟᱨᱟᱵᱽ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ ᱠᱚ ᱵᱚᱸᱜᱟᱭᱟ᱾',
            pronunciation: 'Sarhul parab re sarjom baha ko bongaya.',
            visual: '🌸 🥁',
            vocab: [{ hin: 'सरहुल', sat: 'ᱥᱟᱨᱦᱩᱞ' }, { hin: 'साल का फूल', sat: 'ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // 🏫 GRADE 3 (CLASS 3)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'g3_math_full',
    grade: 'Grade 3',
    subject: 'Mathematics',
    book_code: 'JCERT-G3-MATH',
    title_hin: 'JCERT गणित दीपिका: गुणा और मापन (Class 3)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱮᱞᱠᱷᱟ ᱫᱤᱯᱤᱠᱟ (᱓ ᱪᱟᱱᱟᱪ)',
    cover_color: '#1d4ed8',
    icon: '📘',
    chapters: [
      {
        id: 'g3_m_c1',
        chapter_no: 1,
        title_hin: 'गुणा की संकल्पना (बार-बार जोड़ना)',
        title_sat: 'ᱜᱩᱬᱟᱹᱣ ᱨᱮᱭᱟᱜ ᱵᱩᱡᱷᱟᱹᱣ (ᱞᱮᱛᱟᱲ ᱡᱚᱲᱟᱣ)',
        summary_hin: 'समान समूहों को मिलाकर गुणा करना (2 × 3 = 6)।',
        summary_sat: 'ᱢᱤᱫ ᱞᱮᱠᱟᱱ ᱜᱟᱫᱮᱞ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱜᱩᱬᱟᱹᱣ (᱒ × ᱓ = ᱖)᱾',
        visual_banner: '🍽️ 🍎🍎 | 🍽️ 🍎🍎 | 🍽️ 🍎🍎 = 2 × 3 = 6',
        paragraphs: [
          {
            id: 4001,
            hindi: 'यदि 1 थाली में 2 सेब हैं, तो 3 थालियों में कुल 2 × 3 = 6 सेब होंगे।',
            santali: 'ᱡᱩᱫᱤ ᱑ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱒ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ, ᱮᱱᱠᱷᱟᱱ ᱓ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱒ × ᱓ = ᱖ ᱥᱮᱣ ᱦᱩᱭᱩᱜᱼᱟ᱾',
            pronunciation: 'Judi 1 thari re 2 sew menaga, enkhan 3 thari re 2 x 3 = 6 sew huyuga.',
            visual: '🍽️ 2 × 3 = 6',
            vocab: [{ hin: 'गुणा', sat: 'ᱜᱩᱬᱟᱹᱣ' }, { hin: 'थाली', sat: 'ᱛᱷᱟᱹᱨᱤ' }, { hin: 'छह', sat: 'ᱛᱩᱨᱩᱭ' }]
          }
        ]
      }
    ]
  },
  {
    id: 'g3_evs_full',
    grade: 'Grade 3',
    subject: 'EVS',
    book_code: 'JCERT-G3-EVS',
    title_hin: 'JCERT हमारा पर्यावरण (Class 3 EVS)',
    title_sat: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱟᱵᱚᱣᱟᱜ ᱪᱟᱹᱨᱤᱭᱟᱹᱲ (᱓ ᱪᱟᱱᱟᱪ)',
    cover_color: '#059669',
    icon: '🌿',
    chapters: [
      {
        id: 'g3_e_c1',
        chapter_no: 1,
        title_hin: 'जल ही जीवन है: जल संरक्षण',
        title_sat: 'ᱫᱟᱜ ᱜᱮ ᱡᱤᱭᱚᱱ: ᱫᱟᱜ ᱵᱟᱧᱪᱟᱣ',
        summary_hin: 'पानी का महत्व, वर्षा जल संचयन और प्रकृति की देखभाल।',
        summary_sat: 'ᱫᱟᱜ ᱨᱮᱱᱟᱜ ᱢᱟᱹᱱ, ᱫᱟᱜ ᱡᱟᱹᱲᱤ ᱫᱟᱜ ᱥᱟᱧᱪᱟᱣ᱾',
        visual_banner: '💧 🚰 🌧️ 🌲',
        paragraphs: [
          {
            id: 4002,
            hindi: 'पानी के बिना कोई भी जीवित नहीं रह सकता। हमें वर्षा जल का संचयन करना चाहिए।',
            santali: 'ᱫᱟᱜ ᱵᱮᱜᱚᱨ ᱚᱠᱚᱭ ᱦᱚᱸ ᱵᱟᱠᱚ ᱵᱟᱧᱪᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱟᱵᱚ ᱫᱟᱜ ᱡᱟᱹᱲᱤ ᱫᱟᱜ ᱥᱟᱧᱪᱟᱣ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
            pronunciation: 'Dag begor okoy hon bako banchaw dareyaga. Abo dag jari dag sanchaw lakti kana.',
            visual: '🌧️ 💧 🌲',
            vocab: [{ hin: 'पानी', sat: 'ᱫᱟᱜ' }, { hin: 'वर्षा', sat: 'ᱫᱟᱜ ᱡᱟᱹᱲᱤ' }, { hin: 'बचत', sat: 'ᱥᱟᱧᱪᱟᱣ' }]
          }
        ]
      }
    ]
  }
];
