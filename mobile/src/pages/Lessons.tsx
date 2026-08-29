import React, { useState } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

// ============================================================
// NIPUN Bharat - Panchaadi (5-Step) Lesson Plan Engine
// Based on: NCF Foundational Stage 2022, NIPUN Bharat Mission
// MTB-MLE: Mother Tongue Based Multilingual Education (Santali → Hindi)
// Script: Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)
// Covers: Balvatika (FLN L1) → Class 3 (FLN L4)
// ALL 36 CURRICULUM TOPICS FULLY IMPLEMENTED
// ============================================================

interface AssessmentPrompt {
  question_hin: string;
  question_sat: string;
  answer_hin: string;
  answer_sat: string;
}

interface LessonSection {
  step: number;
  step_name: string;
  step_sat: string;
  icon: string;
  duration: string;
  hin: string;
  sat: string;
}

interface LessonData {
  title_hin: string;
  title_sat: string;
  grade: string;
  subject: string;
  topic: string;
  nipun_target: string;
  sections: LessonSection[];
  assessment_prompts: AssessmentPrompt[];
  materials: string[];
}

// ============================================================
// CURRICULUM MAP: Grade → Subject → Topics
// ============================================================

const CURRICULUM: Record<string, Record<string, string[]>> = {
  Balvatika: {
    'ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Foundational Literacy)': [
      'Oral Santali Vocabulary: Animals (ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ)',
      'Oral Santali Vocabulary: Body Parts (ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ)',
      'Santali Nursery Rhyme: Johar Song (ᱡᱚᱦᱟᱨ ᱥᱮᱨᱮᱧ)',
      'Print Awareness: Ol Chiki Script Shapes (ᱚᱞ ᱪᱤᱠᱤ ᱪᱤᱱᱦᱟᱹ)',
    ],
    'ᱮᱞᱠᱷᱟ ᱵᱩᱡᱷᱟᱣ (Foundational Numeracy)': [
      'Visual Counting 1 to 5 (ᱢᱤᱫ ᱠᱷᱚᱱ ᱢᱚᱬᱮ)',
      'Shape Recognition: Circle, Square, Triangle (ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ, ᱯᱮ ᱠᱳᱬ)',
      'Size Comparison: Big and Small (ᱢᱟᱨᱟᱝ ᱟᱨ ᱦᱩᱰᱤᱧ)',
      'Sorting & Grouping Objects by Colour (ᱨᱚᱝ ᱞᱮᱠᱟᱛᱮ ᱦᱟᱹᱴᱤᱧ)',
    ],
  },
  'Class 1': {
    'ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Foundational Literacy)': [
      'Ol Chiki Alphabet: Letters 1–10 (ᱚᱞ ᱪᱤᱠᱤ ᱑-᱑᱐)',
      'Ol Chiki Alphabet: Letters 11–20 (ᱚᱞ ᱪᱤᱠᱤ ᱑᱑-᱒᱐)',
      'CVC Word Reading in Ol Chiki (ᱟᱹᱲᱟᱹ ᱯᱟᱲᱦᱟᱣ)',
      'Simple Dialogues: Classroom Greetings (ᱠᱞᱟᱥ ᱨᱚᱯᱚᱲ)',
      'Short Story Listening & Retelling (ᱠᱟᱹᱦᱱᱤ ᱟᱸᱡᱚᱢ ᱟᱨ ᱞᱟᱹᱭ)',
    ],
    'ᱮᱞᱠᱷᱟ ᱵᱩᱡᱷᱟᱣ (Foundational Numeracy)': [
      'Counting & Writing Numbers 1–10 (ᱞᱮᱠᱷᱟ ᱑-᱑᱐)',
      'Numbers 11–20 & Number Names in Santali (ᱞᱮᱠᱷᱟ ᱑᱑-᱒᱐)',
      'Single-Digit Addition up to 9 (ᱡᱚᱲᱟᱣ ᱑-᱙)',
      'Single-Digit Subtraction up to 9 (ᱜᱷᱟᱴᱟᱣ ᱑-᱙)',
      'Missing Number in Sequence 1–20 (ᱛᱟᱞᱟ ᱨᱮ ᱮᱞ ᱯᱮᱨᱮᱡ)',
    ],
  },
  'Class 2': {
    'ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Foundational Literacy)': [
      'Reading Fluency: 45 Words/Min from Unknown Text (ᱢᱟᱦᱟᱫ ᱯᱟᱲᱦᱟᱣ ᱔᱕)',
      'Sohrai Festival Story Reading (ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ ᱠᱟᱹᱦᱱᱤ)',
      'Opposites Vocabulary Pairs (ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ)',
      'Writing 3–5 Sentences About My Village (ᱟᱹᱛᱩ ᱵᱟᱵᱚᱛ ᱚᱞ)',
    ],
    'ᱮᱞᱠᱷᱟ ᱵᱩᱡᱷᱟᱣ (Foundational Numeracy)': [
      'Place Value: Tens and Ones up to 99 (ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ)',
      '2-Digit Addition without Regrouping (ᱵᱟᱨ ᱮᱞ ᱡᱚᱲᱟᱣ)',
      '2-Digit Subtraction with Regrouping (ᱵᱟᱨ ᱮᱞ ᱜᱷᱟᱴᱟᱣ)',
      'Repeated Addition → Intro to Multiplication (ᱫᱚᱦᱲᱟ ᱡᱚᱲᱟᱣ ᱠᱷᱚᱱ ᱜᱩᱬᱟᱹᱣ)',
      'Indian Coins & Rupee Calculations (ᱴᱟᱠᱟ ᱞᱮᱠᱷᱟ)',
    ],
  },
  'Class 3': {
    'ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Foundational Literacy)': [
      'Reading Fluency: 60+ Words/Min from Unknown Text (ᱯᱟᱲᱦᱟᱣ ᱖᱐+ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ)',
      'Traditional Santali Folk Tale with 3 Comprehension Qs (ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ)',
      'Paragraph Writing: 5 Sentences on Nature (ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱵᱟᱵᱚᱛ ᱚᱞ)',
      'Punctuation & Ol Chiki Sentence Construction (ᱛᱷᱟᱠᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱟᱹᱭᱟᱹᱛ ᱵᱮᱱᱟᱣ)',
    ],
    'ᱮᱞᱠᱷᱟ ᱵᱩᱡᱷᱟᱣ (Foundational Numeracy)': [
      '3-Digit Addition & Subtraction up to 999 (ᱯᱮ ᱮᱞ ᱡᱚᱲᱟᱣ-ᱜᱷᱟᱴᱟᱣ)',
      'Multiplication Tables 2 to 10 in Ol Chiki (ᱜᱩᱬᱟᱹᱣ ᱦᱮᱱᱫᱮ ᱒-᱑᱐)',
      'Division as Equal Sharing (ᱵᱟᱨᱟᱵᱟᱹᱨᱤ ᱦᱟᱹᱴᱤᱧ)',
      'Reading Clock Time & Calendar Months (ᱚᱠᱛᱚ ᱟᱨ ᱪᱟᱸᱫᱚ ᱞᱮᱠᱷᱟ)',
      'Word Problems: Market & Village Life (ᱦᱟᱴ ᱟᱨ ᱟᱹᱛᱩ ᱡᱤᱭᱚᱱ ᱮᱞᱠᱷᱟ)',
    ],
  },
};

// ============================================================
// ALL 36 FULL BILINGUAL PANCHAADI LESSON PLANS
// Key format: `${grade}||${Literacy|Numeracy}||${topicIndex}`
// ============================================================

const LESSON_DB: Record<string, LessonData> = {

  // ----------------------------------------------------------
  // BALVATIKA — LITERACY (4 TOPICS)
  // ----------------------------------------------------------

  'Balvatika||Literacy||0': {
    title_hin: 'जानवरों की संथाली शब्दावली सीखें',
    title_sat: 'ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱥᱟᱱᱛᱟᱲᱤ ᱥᱮᱨᱮᱧ',
    grade: 'Balvatika', subject: 'Foundational Literacy',
    topic: 'Oral Santali Vocabulary: Animals',
    nipun_target: 'Balvatika Literacy (BOX2): Child orally names 5 common domestic and forest animals in Santali through voice mimicking and picture cards.',
    materials: ['Animal flashcards (गाय, बकरी, हाथी, बंदर, मछली)', 'Soft toy / puppets', 'Crayons'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक गाय का अभिनय करें: "मूं-मूं! बताओ यह कौन है?" बच्चे कहें: "गाय!" शिक्षक: "संथाली में गाय को ᱜᱟᱹᱭ (Gaay) कहते हैं!"', sat: 'ᱢᱟᱪᱮᱛ ᱜᱟᱹᱭ ᱞᱮᱠᱟ ᱢᱩᱸ-ᱢᱩᱸ ᱨᱟᱣᱟᱭ: "ᱱᱚᱣᱟ ᱚᱠᱚᱭ ᱡᱤᱵᱽ?" ᱜᱤᱫᱽᱨᱟᱹ: "ᱜᱟᱹᱭ!" ᱢᱟᱪᱮᱛ: "ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱜᱟᱹᱭ ᱠᱚ ᱢᱮᱛᱟᱭᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: '5 जानवरों के चित्र दिखाएं और बुलवाएं:\n• गाय = ᱜᱟᱹᱭ (Gaay)\n• बकरी = ᱢᱮᱨᱚᱢ (Merom)\n• हाथी = ᱦᱟᱹᱛᱤ (Haati)\n• बंदर = ᱜᱟᱹᱰᱤ (Gaadi)\n• मछली = ᱦᱟᱹᱠᱩ (Haaku)', sat: '᱕ ᱡᱤᱵᱽ ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱦᱚᱪᱚ:\n• ᱜᱟᱹᱭ (Gaay)\n• ᱢᱮᱨᱚᱢ (Merom)\n• ᱦᱟᱹᱛᱤ (Haati)\n• ᱜᱟᱹᱰᱤ (Gaadi)\n• ᱦᱟᱹᱠᱩ (Haaku)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'ध्वनि पहचान खेल: शिक्षक आवाज निकालें, बच्चे संथाली में जानवर का नाम बोलकर उस कार्ड को उठाएं।', sat: 'ᱨᱟᱣ ᱩᱯᱨᱩᱢ ᱠᱷᱮᱞᱳᱰ: ᱢᱟᱪᱮᱛ ᱨᱟᱣ ᱟᱸᱡᱚᱢᱟᱭ, ᱜᱤᱫᱽᱨᱟᱹ ᱥᱟᱱᱛᱟᱲᱤ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱠᱟᱛᱮ ᱠᱟᱨᱰ ᱠᱚ ᱛᱩᱞᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बच्चे अपने पसंदीदा जानवर का चित्र बनाएं और संथाली में 1 वाक्य बोलें: "ᱱᱩᱭ ᱫᱚ ᱜᱟᱹᱭ ᱠᱟᱱᱟᱭ (यह गाय है)"।', sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱩᱥᱤᱭᱟᱜ ᱡᱤᱵᱽ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ: "ᱱᱩᱭ ᱫᱚ ᱜᱟᱹᱭ ᱠᱟᱱᱟᱭ"᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'पूरी कक्षा "ᱜᱟᱹᱭ, ᱢᱮᱨᱚᱢ, ᱦᱟᱹᱛᱤ, ᱜᱟᱹᱰᱤ, ᱦᱟᱹᱠᱩ" की तुकबंदी गीत गाए। घर में माँ-पिता को सिखाएं।', sat: 'ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ "ᱜᱟᱹᱭ, ᱢᱮᱨᱚᱢ, ᱦᱟᱹᱛᱤ..." ᱥᱮᱨᱮᱧ ᱠᱚ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮ ᱥᱮᱨᱮᱧᱟ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'हाथी का चित्र दिखाकर पूछें: "इसे संथाली में क्या कहते हैं?"', question_sat: 'ᱦᱟᱹᱛᱤ ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱯᱩᱪᱷᱟᱹᱣ ᱢᱮ: "ᱱᱚᱣᱟ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ?"', answer_hin: 'ᱦᱟᱹᱛᱤ (Haati) = हाथी', answer_sat: 'ᱛᱮᱞᱟ: ᱦᱟᱹᱛᱤ' },
      { question_hin: '"बकरी को संथाली में क्या बोलते हैं?"', question_sat: '"ᱵᱟᱠᱨᱤ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱭᱟ?"', answer_hin: 'ᱢᱮᱨᱚᱢ (Merom)', answer_sat: 'ᱛᱮᱞᱟ: ᱢᱮᱨᱚᱢ' },
      { question_hin: '"इनमें से कौन पानी में रहता है? संथाली नाम बताओ"', question_sat: '"ᱱᱚᱣᱟ ᱠᱚ ᱢᱩᱫᱽ ᱨᱮ ᱚᱠᱚᱭ ᱫᱟᱜ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟᱭ?"', answer_hin: 'मछली = ᱦᱟᱹᱠᱩ (Haaku)', answer_sat: 'ᱛᱮᱞᱟ: ᱦᱟᱹᱠᱩ' },
    ],
  },

  'Balvatika||Literacy||1': {
    title_hin: 'शरीर के अंग — संथाली में मौखिक पहचान',
    title_sat: 'ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱩᱯᱨᱩᱢ',
    grade: 'Balvatika', subject: 'Foundational Literacy',
    topic: 'Oral Santali Vocabulary: Body Parts',
    nipun_target: 'Balvatika Literacy (BOX1): Child orally names 5 external body parts with correct physical touch gestures in Santali and Hindi.',
    materials: ['Body parts chart', 'Mirror for self-observation', 'Stickers for body parts'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक अपनी आंख पर उंगली रखें: "यह क्या है?" बच्चे: "आंख!" शिक्षक: "संथाली में आंख को ᱢᱮᱫ (Med) कहते हैं!" सब बच्चे आंख छूएं।', sat: 'ᱢᱟᱪᱮᱛ ᱢᱮᱫ ᱨᱮ ᱛᱤ ᱫᱚᱦᱚ ᱠᱟᱛᱮ: "ᱱᱚᱣᱟ ᱪᱮᱫ ᱠᱟᱱᱟ?" ᱜᱤᱫᱽᱨᱟᱹ: "ᱢᱮᱫ!" ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱢᱮᱫ ᱡᱚᱴᱮᱫ ᱠᱟᱛᱮ "ᱢᱮᱫ" ᱢᱮᱱ ᱢᱮ᱾' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: '5 अंग सिखाएं (छूएं + बोलें):\n• आंख = ᱢᱮᱫ (Med)\n• हाथ = ᱛᱤ (Ti)\n• नाक = ᱢᱩᱸ (Mu)\n• मुंह = ᱢᱚᱪᱟ (Mocha)\n• कान = ᱞᱩᱛᱩᱨ (Lutur)\n• पैर = ᱡᱟᱝᱜᱟ (Janga)', sat: '᱕ ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ:\n• ᱢᱮᱫ (Med)\n• ᱛᱤ (Ti)\n• ᱢᱩᱸ (Mu)\n• ᱢᱚᱪᱟ (Mocha)\n• ᱞᱩᱛᱩᱨ (Lutur)\n• ᱡᱟᱝᱜᱟ (Janga)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: '"माचॆत मेन-आ" (Simon Says खेल): शिक्षक बोलें "ᱢᱩᱸ ᱡᱚᱴᱮᱫ ᱢᱮ!" (नाक छुओ)। बच्चे तुरंत अपनी नाक छुएंगे।', sat: 'ᱠᱷᱮᱞᱳᱰ: "ᱢᱟᱪᱮᱛ ᱢᱮᱱ-ᱟ: ᱛᱤ ᱛᱩᱞ ᱢᱮ! ᱢᱮᱫ ᱡᱚᱴᱮᱫ ᱢᱮ! ᱞᱩᱛᱩᱨ ᱡᱚᱴᱮᱫ ᱢᱮ!" ᱜᱤᱫᱽᱨᱟᱹ ᱞᱚᱜᱚᱱ ᱠᱚ ᱡᱚᱴᱮᱫᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'जोड़ी गतिविधि: बच्चे एक-दूसरे से पूछें "ᱟᱢᱟᱜ ᱢᱩᱸ ᱚᱠᱟᱨᱮ?" (तुम्हारी नाक कहाँ है?) और दोस्त की नाक की तरफ इशारा करें।', sat: 'ᱡᱩᱲᱤ ᱠᱟᱹᱢᱤ: ᱜᱤᱫᱽᱨᱟᱹ ᱠᱩᱠᱞᱤ ᱠᱚᱯᱚᱭᱟ "ᱟᱢᱟᱜ ᱢᱮᱫ ᱚᱠᱟᱨᱮ?" ᱟᱨ ᱩᱫᱩᱜ ᱟᱠᱤᱱ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: '"ᱢᱮᱫ, ᱛᱤ, ᱢᱩᱸ, ᱞᱩᱛᱩᱨ..." एक्शन राइम गाएं। घर पर दादा-दादी को सुनाएं।', sat: '"ᱢᱮᱫ ᱛᱮ ᱧᱮᱞᱟ, ᱞᱩᱛᱩᱨ ᱛᱮ ᱟᱸᱡᱚᱢᱟ..." ᱮᱠᱥᱚᱱ ᱥᱮᱨᱮᱧ ᱠᱚ ᱥᱮᱨᱮᱧᱟ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"हाथ को संथाली में क्या कहते हैं?"', question_sat: '"ᱦᱟᱛᱷ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?"', answer_hin: 'ᱛᱤ (Ti)', answer_sat: 'ᱛᱮᱞᱟ: ᱛᱤ' },
      { question_hin: '"सुनने के लिए किस अंग का उपयोग करते हैं?"', question_sat: '"ᱟᱸᱡᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱦᱟᱹᱴᱤᱧ ᱵᱚᱱ ᱵᱮᱵᱷᱟᱨᱟ?"', answer_hin: 'ᱞᱩᱛᱩᱨ (Lutur) = कान', answer_sat: 'ᱛᱮᱞᱟ: ᱞᱩᱛᱩᱨ' },
      { question_hin: '"ᱢᱮᱫ का क्या काम है?"', question_sat: '"ᱢᱮᱫ ᱛᱮ ᱟᱵᱚ ᱪᱮᱫ ᱵᱚᱱ ᱠᱟᱹᱢᱤᱭᱟ?"', answer_hin: 'देखना (ᱧᱮᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ' },
    ],
  },

  'Balvatika||Literacy||2': {
    title_hin: 'संथाली बाल कविता — जोहार सेरेंग (ᱡᱚᱦᱟᱨ ᱥᱮᱨᱮᱧ)',
    title_sat: 'ᱡᱚᱦᱟᱨ ᱥᱮᱨᱮᱧ — ᱟᱲᱟᱝ ᱥᱮᱨᱮᱧ ᱠᱷᱮᱞᱳᱰ',
    grade: 'Balvatika', subject: 'Foundational Literacy',
    topic: 'Santali Nursery Rhyme: Johar Song',
    nipun_target: 'Balvatika Literacy (BOE1): Child listens attentively to a local rhyme and recites 4 lines with expressive gestures and rhythm.',
    materials: ['Clapping rhythm', 'Small bell/dholak or desk tapping', 'Action lyric chart'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक दोनों हाथ जोड़कर "ᱡᱚᱦᱟᱨ" (Johar) बोलें। बच्चों से पूछें: "जब हम सुबह मिलते हैं तो क्या कहते हैं?"', sat: 'ᱢᱟᱪᱮᱛ ᱵᱟᱱᱟᱨ ᱛᱤ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ "ᱡᱚᱦᱟᱨ" ᱢᱮᱱ ᱢᱮ᱾ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱹᱭᱟ: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: '4 पंक्तियों की कविता गाएं और सिखाएं:\n"ᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱟᱭᱳ-ᱵᱟᱵᱟ,\nᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱝᱠᱮ,\nᱥᱮᱛᱟᱜ ᱵᱮᱨᱟ ᱵᱮᱨᱮᱫ ᱠᱟᱛᱮ,\nᱤᱥᱠᱩᱞ ᱛᱮ ᱵᱚᱱ ᱦᱤᱡᱩᱜ-ᱟ।"', sat: 'ᱥᱮᱨᱮᱧ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ:\n"ᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱟᱭᱳ-ᱵᱟᱵᱟ,\nᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱝᱠᱮ,\nᱥᱮᱛᱟᱜ ᱵᱮᱨᱟ ᱵᱮᱨᱮᱫ ᱠᱟᱛᱮ,\nᱤᱥᱠᱩᱞ ᱛᱮ ᱵᱚᱱ ᱦᱤᱡᱩᱜ-ᱟ।"' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'ताली बजाकर लय में दोहराना (Call and Response)। शिक्षक 1 पंक्ति गाएं → बच्चे नाचते हुए दोहराएं।', sat: 'ᱛᱟᱞᱤ ᱛᱷᱟᱭᱚ ᱠᱟᱛᱮ ᱢᱤᱫ ᱛᱮ ᱥᱮᱨᱮᱧ ᱫᱚᱦᱲᱟᱭ ᱢᱮ᱾ ᱢᱟᱪᱮᱛ ᱢᱤᱫ ᱫᱷᱟᱣ → ᱜᱤᱫᱽᱨᱟᱹ ᱵᱟᱨ ᱫᱷᱟᱣ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: '3-3 बच्चों की टोली बनाकर मंच पर आकर अभिनय के साथ कविता प्रस्तुत करें।', sat: 'ᱯᱮ ᱯᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱜᱟᱫᱮᱞ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱥᱟᱢᱟᱝ ᱨᱮ ᱮᱠᱥᱚᱱ ᱥᱟᱶ ᱥᱮᱨᱮᱧ ᱩᱫᱩᱜ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर जाकर अपने माता-पिता को सुबह उठकर हाथ जोड़कर "ᱡᱚᱦᱟᱨ" बोलें और यह गीत सुनाएं।', sat: 'ᱚᱲᱟᱜ ᱥᱮᱱ ᱠᱟᱛᱮ ᱟᱭᱳ-ᱵᱟᱵᱟ ᱥᱟᱶ ᱡᱚᱦᱟᱨ ᱠᱟᱛᱮ ᱱᱚᱣᱟ ᱥᱮᱨᱮᱧ ᱟᱸᱡᱚᱢ ᱟᱠᱤᱱ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"संथाली में नमस्ते को क्या कहते हैं?"', question_sat: '"ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱱᱟᱢᱟᱥᱛᱮ ᱫᱚ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?"', answer_hin: 'ᱡᱚᱦᱟᱨ (Johar)', answer_sat: 'ᱛᱮᱞᱟ: ᱡᱚᱦᱟᱨ' },
      { question_hin: '"कविता की पहली पंक्ति सुनाओ"', question_sat: '"ᱥᱮᱨᱮᱧ ᱨᱮᱱᱟᱜ ᱯᱩᱭᱞᱩ ᱟᱹᱭᱟᱹᱛ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱟᱭᱳ-ᱵᱟᱵᱟ', answer_sat: 'ᱛᱮᱞᱟ: ᱡᱚᱦᱟᱨ ᱡᱚᱦᱟᱨ ᱟᱭᱳ-ᱵᱟᱵᱟ' },
      { question_hin: '"हम सुबह उठकर कहाँ जाते हैं?"', question_sat: '"ᱥᱮᱛᱟᱜ ᱵᱮᱨᱮᱫ ᱠᱟᱛᱮ ᱵᱚᱱ ᱚᱠᱟ ᱛᱮ ᱵᱚᱱ ᱪᱟᱞᱟᱜᱼᱟ?"', answer_hin: 'स्कूल (ᱤᱥᱠᱩᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱤᱥᱠᱩᱞ ᱛᱮ' },
    ],
  },

  'Balvatika||Literacy||3': {
    title_hin: 'प्रिंट जागरूकता — ओल चिकी लिपि के आकार',
    title_sat: 'ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱨᱩᱯ ᱪᱤᱱᱦᱟᱹᱣ',
    grade: 'Balvatika', subject: 'Foundational Literacy',
    topic: 'Print Awareness: Ol Chiki Script Shapes',
    nipun_target: 'Balvatika Literacy (BRX1): Child distinguishes print from pictures, traces Ol Chiki base glyphs in sand/air, and understands left-to-right reading direction.',
    materials: ['Sand tray / clay', 'Large Ol Chiki cutouts (ᱚ, ᱛ, ᱜ, ᱟ)', 'Picture books in Ol Chiki'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक रेत में अपनी उंगली से ᱚ बनाएं। बच्चों को दिखाएं: "यह चित्र नहीं, यह हमारी भाषा का अक्षर है!"', sat: 'ᱢᱟᱪᱮᱛ ᱜᱤᱛᱤᱞ ᱨᱮ ᱚ ᱚᱞ ᱠᱟᱛᱮ ᱩᱫᱩᱜ ᱢᱮ: "ᱱᱚᱣᱟ ᱫᱚ ᱪᱤᱛᱟᱹᱨ ᱵᱟᱝ ᱠᱟᱱᱟ, ᱱᱚᱣᱟ ᱫᱚ ᱚᱞ ᱪᱤᱠᱤ ᱟᱠᱷᱚᱨ ᱠᱟᱱᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: 'हवा में उंगली से आकृतियां बनाना सिखाएं:\n• गोल चक्र जैसा → ᱚ (O)\n• सीधी डंडी और मोड़ → ᱛ (T)\n• गाय के सींग जैसा → ᱜ (G)\nबाएं से दाएं उंगली घुमाना सिखाएं।', sat: 'ᱦᱚᱭ ᱨᱮ ᱛᱤ ᱛᱮ ᱪᱤᱠᱤ ᱨᱩᱯ ᱵᱮᱱᱟᱣ:\n• ᱜᱩᱞ ᱞᱮᱠᱟ → ᱚ\n• ᱛᱤᱸᱜᱩ ᱫᱟᱺᱰᱤ → ᱛ\n• ᱜᱟᱹᱭ ᱫᱮᱨᱮᱧ ᱞᱮᱠᱟ → ᱜ\nᱞᱮᱸᱜᱟ ᱠᱷᱚᱱ ᱡᱚᱡᱚᱢ ᱥᱮᱫ ᱛᱤ ᱤᱫᱤ ᱢᱮ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'रेत की थाली में बच्चे अपनी उंगली से ᱚ और ᱛ को 5 बार उकेरें। फिर मिट्टी से अक्षर बनाएं।', sat: 'ᱜᱤᱛᱤᱞ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱚ ᱟᱨ ᱛ ᱠᱚ ᱠᱟᱹᱴᱩᱵ ᱛᱮ ᱠᱚ ᱚᱞᱟ᱾ ᱦᱟᱥᱟ ᱛᱮ ᱪᱤᱠᱤ ᱠᱚ ᱵᱮᱱᱟᱣᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'पुस्तक में चित्र और लिखे हुए अक्षर के बीच अंतर पहचानना। "चित्र पर हाथ रखो" फिर "अक्षर पर हाथ रखो"।', sat: 'ᱯᱩᱛᱷᱤ ᱨᱮ ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱛᱟᱞᱟ ᱨᱮ ᱯᱷᱟᱨᱟᱠ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर के आंगन में कोयले या खड़िया से ᱚ बनाकर माँ को दिखाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱪᱩᱱ ᱥᱮ ᱠᱩᱭᱞᱟᱹ ᱛᱮ ᱚ ᱚᱞ ᱠᱟᱛᱮ ᱟᱭᱳ ᱩᱫᱩᱜ ᱟᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"रेत पर ᱚ बनाकर दिखाओ"', question_sat: '"ᱜᱤᱛᱤᱞ ᱨᱮ ᱚ ᱚᱞ ᱠᱟᱛᱮ ᱩᱫᱩᱜ ᱢᱮ"', answer_hin: 'Child traces round ᱚ shape correctly', answer_sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱚ ᱨᱩᱯ ᱥᱟᱹᱦᱤᱡ ᱵᱮᱱᱟᱣᱟᱭ' },
      { question_hin: '"किताब किस तरफ से किस तरफ पढ़ते हैं?"', question_sat: '"ᱯᱩᱛᱷᱤ ᱫᱚ ᱚᱠᱟ ᱥᱮᱫ ᱠᱷᱚᱱ ᱚᱠᱟ ᱥᱮᱫ ᱵᱚᱱ ᱯᱟᱲᱦᱟᱣᱟ?"', answer_hin: 'बाएं से दाएं (Left to Right)', answer_sat: 'ᱞᱮᱸᱜᱟ ᱠᱷᱚᱱ ᱡᱚᱡᱚᱢ ᱥᱮᱫ' },
      { question_hin: '"यह चित्र है या अक्षर?" (ᱚ दिखाकर)', question_sat: '"ᱱᱚᱣᱟ ᱪᱤᱛᱟᱹᱨ ᱠᱟᱱᱟ ᱥᱮ ᱪᱤᱠᱤ ᱠᱟᱱᱟ?" (ᱚ ᱩᱫᱩᱜ ᱠᱟᱛᱮ)', answer_hin: 'अक्षर (ᱪᱤᱠᱤ)', answer_sat: 'ᱪᱤᱠᱤ ᱠᱟᱱᱟ' },
    ],
  },

  // ----------------------------------------------------------
  // BALVATIKA — NUMERACY (4 TOPICS)
  // ----------------------------------------------------------

  'Balvatika||Numeracy||0': {
    title_hin: '1 से 5 तक गिनती — खेल-खेल में (ᱢᱤᱫ ᱠᱷᱚᱱ ᱢᱚᱬᱮ)',
    title_sat: 'ᱞᱮᱠᱷᱟ ᱢᱤᱫ ᱠᱷᱚᱱ ᱢᱚᱬᱮ ᱠᱚ ᱵᱩᱡᱷᱟᱹᱣᱟ',
    grade: 'Balvatika', subject: 'Foundational Numeracy',
    topic: 'Visual Counting 1 to 5',
    nipun_target: 'Balvatika Numeracy: Child counts 1–5 objects with one-to-one correspondence and recites Santali number words.',
    materials: ['5 pebbles/fruits', 'Ol Chiki number cards ᱑ to ᱕', 'Dot cards'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक 1 आम दिखाकर पूछें: "यहाँ कितने आम हैं?" बच्चे: "एक!" शिक्षक: "संथाली में एक को ᱢᱤᱫ (Mid) कहते हैं।"', sat: 'ᱢᱟᱪᱮᱛ ᱢᱤᱫ ᱩᱞ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱱᱚᱸᱰᱮ ᱛᱤᱱᱟᱹᱜ ᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ?" ᱜᱤᱫᱽᱨᱟᱹ: "ᱢᱤᱫ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: '1 से 5 तक वस्तुएं रखकर गिनें:\n• 1 = ᱑ = ᱢᱤᱫ (Mid)\n• 2 = ᱒ = ᱵᱟᱨ (Bar)\n• 3 = ᱓ = ᱯᱮ (Pe)\n• 4 = ᱔ = ᱯᱩᱱ (Pun)\n• 5 = ᱕ = ᱢᱚᱬᱮ (Mone)', sat: '᱑ ᱠᱷᱚᱱ ᱕ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱷᱟᱭ ᱢᱮ:\n• ᱑ = ᱢᱤᱫ\n• ᱒ = ᱵᱟᱨ\n• ᱓ = ᱯᱮ\n• ᱔ = ᱯᱩᱱ\n• ᱕ = ᱢᱚᱬᱮ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'उंगली खेल: शिक्षक 3 उंगलियां दिखाएं → बच्चे "ᱯᱮ!" बोलें। फिर बच्चे ताली बजाकर 5 तक गिनें।', sat: 'ᱠᱟᱹᱴᱩᱵ ᱠᱷᱮᱞᱳᱰ: ᱢᱟᱪᱮᱛ ᱓ ᱠᱟᱹᱴᱩᱵ ᱩᱫᱩᱜ → ᱜᱤᱫᱽᱨᱟᱹ "ᱯᱮ!" ᱢᱮᱱᱟ᱾ ᱛᱟᱞᱤ ᱛᱷᱟᱭᱚ ᱠᱟᱛᱮ ᱕ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'कक्षा में खिड़कियां, दरवाजे और बैग गिनकर संथाली अंकों में बताना।', sat: 'ᱠᱞᱟᱥ ᱨᱮ ᱡᱷᱚᱨᱠᱷᱟ, ᱫᱩᱣᱟᱹᱨ ᱟᱨ ᱡᱷᱳᱞᱟ ᱠᱚ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: '"ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ" गीत लय में गाएं। घर में 5 पत्तियां चुनकर लाएं।', sat: '"ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ..." ᱥᱮᱨᱮᱧ ᱠᱟᱛᱮ ᱚᱲᱟᱜ ᱠᱷᱚᱱ ᱕ ᱥᱟᱠᱟᱢ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '3 पत्थर रखकर पूछें: "यह कितने पत्थर हैं? संथाली में बोलो"', question_sat: '᱓ ᱫᱷᱤᱨᱤ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱱᱚᱣᱟ ᱛᱤᱱᱟᱹᱜ ᱫᱷᱤᱨᱤ? ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: '3 = ᱯᱮ (Pe)', answer_sat: 'ᱛᱮᱞᱟ: ᱯᱮ' },
      { question_hin: '"हाथ में कितनी उंगलियां हैं?"', question_sat: '"ᱢᱤᱫ ᱛᱤ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱠᱟᱹᱴᱩᱵ ᱢᱮᱱᱟᱜᱼᱟ?"', answer_hin: '5 = ᱢᱚᱬᱮ (Mone)', answer_sat: 'ᱛᱮᱞᱟ: ᱢᱚᱬᱮ' },
      { question_hin: '"Ol Chiki में ᱒ का मतलब कितना?"', question_sat: '"ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱒ ᱢᱮᱱᱮᱛ ᱛᱤᱱᱟᱹᱜ?"', answer_hin: 'दो = ᱵᱟᱨ (Bar)', answer_sat: 'ᱛᱮᱞᱟ: ᱵᱟᱨ' },
    ],
  },

  'Balvatika||Numeracy||1': {
    title_hin: 'आकृतियों की पहचान — गोला, चौकोर, तिकोना (ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ, ᱯᱮ ᱠᱳᱬ)',
    title_sat: 'ᱨᱩᱯ ᱪᱤᱱᱦᱟᱹᱣ — ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ, ᱯᱮ ᱠᱳᱬ',
    grade: 'Balvatika', subject: 'Foundational Numeracy',
    topic: 'Shape Recognition: Circle, Square, Triangle',
    nipun_target: 'Balvatika Numeracy: Child identifies and names 2D shapes (Circle, Square, Triangle) in classroom objects in Santali and Hindi.',
    materials: ['Cardboard cutouts: Circle, Square, Triangle', 'Bangle (chudi), Slate, Samosa toy', 'Drawing sheets'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक चूड़ी दिखाकर पूछें: "यह कैसी दिखती है? गोल-गोल रोटी जैसी!" संथाली में गोल को ᱜᱩᱞ (Gul) कहते हैं।', sat: 'ᱢᱟᱪᱮᱛ ᱪᱩᱲᱤ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱱᱚᱣᱟ ᱪᱮᱫ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ? ᱪᱟᱸᱫᱚ ᱞᱮᱠᱟ ᱜᱩᱞ!" ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱜᱩᱞ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ᱾' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: '3 मुख्य आकृतियां सिखाएं:\n• गोल (वृत्त) = ᱜᱩᱞ (Gul) — जैसे सूरज, रोटी, पहिया\n• चौकोर (वर्ग) = ᱪᱟᱹᱨᱠᱷᱤ (Charkhi) — 4 बराबर कोने\n• तिकोना (त्रिभुज) = ᱯᱮ ᱠᱳᱬ (Pe Kon) — 3 कोने जैसे पहाड़', sat: '᱓ ᱢᱩᱬᱩᱛ ᱨᱩᱯ ᱪᱮᱫ ᱢᱮ:\n• ᱜᱩᱞ (Circle) — ᱵᱮᱨᱟ, ᱨᱩᱴᱤ ᱞᱮᱠᱟ\n• ᱪᱟᱹᱨᱠᱷᱤ (Square) — ᱯᱩᱱ ᱠᱳᱬ ᱥᱚᱢᱟᱱ\n• ᱯᱮ ᱠᱳᱬ (Triangle) — ᱯᱮ ᱠᱳᱬ ᱵᱩᱨᱩ ᱪᱩᱲᱟᱹ ᱞᱮᱠᱟ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'आकृति छांटने का खेल: डिब्बे में से शिक्षक जो आकृति बोलें, बच्चे वही कार्ड उठाकर दिखाएं।', sat: 'ᱨᱩᱯ ᱵᱟᱪᱷᱟᱣ ᱠᱷᱮᱞᱳᱰ: ᱢᱟᱪᱮᱛ "ᱪᱟᱹᱨᱠᱷᱤ!" ᱢᱮᱱ ᱠᱷᱟᱱ ᱜᱤᱫᱽᱨᱟᱹ ᱪᱟᱹᱨᱠᱷᱤ ᱠᱟᱨᱰ ᱠᱚ ᱛᱩᱞᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'कक्षा में आकृतियां ढूंढो: "ब्लैकबोर्ड कैसा है?" → चौकोर। "घड़ी कैसी है?" → गोल।', sat: 'ᱠᱞᱟᱥ ᱨᱮ ᱨᱩᱯ ᱯᱟᱱᱛᱮ: "ᱵᱽᱞᱟᱠᱵᱳᱨᱰ ᱪᱮᱫ ᱞᱮᱠᱟ?" → ᱪᱟᱹᱨᱠᱷᱤ᱾ "ᱜᱷᱩᱲᱤ ᱪᱮᱫ ᱞᱮᱠᱟ?" → ᱜᱩᱞ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'बच्चे स्लेट पर एक ᱜᱩᱞ और एक ᱯᱮ ᱠᱳᱬ का चित्र बनाएं और घर पर दिखाएं।', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱢᱤᱫ ᱜᱩᱞ ᱟᱨ ᱢᱤᱫ ᱯᱮ ᱠᱳᱬ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'रोटी का आकार कैसा होता है? संथाली में बताओ', question_sat: 'ᱨᱩᱴᱤ ᱫᱚ ᱪᱮᱫ ᱞᱮᱠᱟᱱ ᱨᱩᱯ ᱠᱟᱱᱟ? ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: 'ᱜᱩᱞ (Gul) = गोल / वृत्त', answer_sat: 'ᱛᱮᱞᱟ: ᱜᱩᱞ' },
      { question_hin: 'त्रिभुज में कितने कोने होते हैं?', question_sat: 'ᱯᱮ ᱠᱳᱬ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱠᱳᱬ ᱛᱟᱦᱮᱸᱱᱟ?', answer_hin: '3 कोने = ᱯᱮ ᱠᱳᱬ', answer_sat: 'ᱛᱮᱞᱟ: ᱯᱮ (᱓)' },
      { question_hin: 'स्लेट का आकार कैसा है?', question_sat: 'ᱥᱞᱮᱴ ᱫᱚ ᱪᱮᱫ ᱞᱮᱠᱟᱱ ᱨᱩᱯ ᱠᱟᱱᱟ?', answer_hin: 'ᱪᱟᱹᱨᱠᱷᱤ (Charkhi) = चौकोर', answer_sat: 'ᱛᱮᱞᱟ: ᱪᱟᱹᱨᱠᱷᱤ' },
    ],
  },

  'Balvatika||Numeracy||2': {
    title_hin: 'आकार तुलना — बड़ा और छोटा (ᱢᱟᱨᱟᱝ ᱟᱨ ᱦᱩᱰᱤᱧ)',
    title_sat: 'ᱢᱟᱨᱟᱝ ᱟᱨ ᱦᱩᱰᱤᱧ ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ',
    grade: 'Balvatika', subject: 'Foundational Numeracy',
    topic: 'Size Comparison: Big and Small',
    nipun_target: 'Balvatika Numeracy: Child compares two objects and uses comparative terms: Big (ᱢᱟᱨᱟᱝ) / Small (ᱦᱩᱰᱤᱧ), Tall (ᱩᱥᱩᱞ) / Short (ᱪᱟᱯᱮ).',
    materials: ['Big and small balls', 'Elephant vs Ant pictures', 'Two water bottles of different heights'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक एक बड़ी गेंद और छोटी कंचे दिखाएं: "कौन सी बड़ी है?" संथाली में: "ᱢᱟᱨᱟᱝ (बड़ा) और ᱦᱩᱰᱤᱧ (छोटा)"।', sat: 'ᱢᱟᱪᱮᱛ ᱢᱟᱨᱟᱝ ᱵᱚᱞ ᱟᱨ ᱦᱩᱰᱤᱧ ᱜᱩᱞᱤ ᱩᱫᱩᱜ ᱠᱟᱛᱮ ᱯᱩᱪᱷᱟᱹᱣ ᱢᱮ: "ᱚᱠᱟ ᱢᱟᱨᱟᱝ ᱟᱨ ᱚᱠᱟ ᱦᱩᱰᱤᱧ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: 'जोड़ियों में तुलना सिखाएं:\n• हाथी = ᱢᱟᱨᱟᱝ (बड़ा) 🐘 vs चींटी = ᱦᱩᱰᱤᱧ (छोटा) 🐜\n• पेड़ = ᱩᱥᱩᱞ (लंबा) 🌲 vs पौधा = ᱪᱟᱯᱮ (नाटा) 🌱\n• पत्थर = ᱦᱟᱢᱟᱞ (भारी) 🪨 vs पत्ता = ᱨᱟᱣᱟᱞ (हल्का) 🍃', sat: 'ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ ᱪᱮᱫ ᱢᱮ:\n• ᱦᱟᱹᱛᱤ = ᱢᱟᱨᱟᱝ 🐘 vs ᱪᱩᱴᱤᱭᱟᱹ = ᱦᱩᱰᱤᱧ 🐜\n• ᱫᱟᱨᱮ = ᱩᱥᱩᱞ 🌲 vs ᱜᱷᱟᱸᱥ = ᱪᱟᱯᱮ 🌱\n• ᱫᱷᱤᱨᱤ = ᱦᱟᱢᱟᱞ 🪨 vs ᱥᱟᱠᱟᱢ = ᱨᱟᱣᱟᱞ 🍃' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'कक्षा में दो बच्चों को खड़ा करके तुलना करना: "किसका बस्ता ᱢᱟᱨᱟᱝ (बड़ा) है?" बच्चे छूकर बताएं।', sat: 'ᱠᱞᱟᱥ ᱨᱮ ᱵᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱡᱷᱳᱞᱟ ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ ᱢᱮ: "ᱚᱠᱚᱭᱟᱜ ᱡᱷᱳᱞᱟ ᱢᱟᱨᱟᱝ?"' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'कागज पर एक बड़ा गोला (ᱢᱟᱨᱟᱝ ᱜᱩᱞ) और एक छोटा गोला (ᱦᱩᱰᱤᱧ ᱜᱩᱞ) बनाना।', sat: 'ᱠᱟᱜᱚᱡᱽ ᱨᱮ ᱢᱤᱫ ᱢᱟᱨᱟᱝ ᱜᱩᱞ ᱟᱨ ᱢᱤᱫ ᱦᱩᱰᱤᱧ ᱜᱩᱞ ᱵᱮᱱᱟᱣ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर जाकर सबसे बड़ी थाली और सबसे छोटी कटोरी खोजकर माँ को संथाली में बताना।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱨᱟᱝ ᱛᱷᱟᱹᱨᱤ ᱟᱨ ᱦᱩᱰᱤᱧ ᱵᱟᱹᱴᱤ ᱯᱟᱱᱛᱮ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'हाथी और चूहे में कौन ᱢᱟᱨᱟᱝ (बड़ा) है?', question_sat: 'ᱦᱟᱹᱛᱤ ᱟᱨ ᱪᱩᱴᱤᱭᱟᱹ ᱢᱩᱫᱽ ᱨᱮ ᱚᱠᱚᱭ ᱢᱟᱨᱟᱝ?', answer_hin: 'ᱦᱟᱹᱛᱤ (हाथी)', answer_sat: 'ᱛᱮᱞᱟ: ᱦᱟᱹᱛᱤ' },
      { question_hin: '"छोटे को संथाली में क्या कहते हैं?"', question_sat: '"ᱦᱩᱰᱤᱧ ᱫᱚ ᱦᱤᱱᱫᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?"', answer_hin: 'ᱦᱩᱰᱤᱧ (Hudinj) = छोटा', answer_sat: 'ᱛᱮᱞᱟ: ᱦᱩᱰᱤᱧ (छोटा)' },
      { question_hin: 'पत्थर भारी (ᱦᱟᱢᱟᱞ) है या पत्ता?', question_sat: 'ᱫᱷᱤᱨᱤ ᱦᱟᱢᱟᱞᱟ ᱥᱮ ᱥᱟᱠᱟᱢ ᱦᱟᱢᱟᱞᱟ?', answer_hin: 'ᱫᱷᱤᱨᱤ = पत्थर भारी है', answer_sat: 'ᱛᱮᱞᱟ: ᱫᱷᱤᱨᱤ (ᱦᱟᱢᱟᱞ)' },
    ],
  },

  'Balvatika||Numeracy||3': {
    title_hin: 'रंगों के आधार पर वस्तुओं का वर्गीकरण (ᱨᱚᱝ ᱞᱮᱠᱟᱛᱮ ᱦᱟᱹᱴᱤᱧ)',
    title_sat: 'ᱨᱚᱝ ᱞᱮᱠᱟᱛᱮ ᱡᱤᱱᱤᱥ ᱵᱷᱮᱜᱟᱨ ᱠᱷᱮᱞᱳᱰ',
    grade: 'Balvatika', subject: 'Foundational Numeracy',
    topic: 'Sorting & Grouping Objects by Colour',
    nipun_target: 'Balvatika Numeracy: Child classifies and sorts at least 10 mixed objects into 3 groups based on primary colors (Red, Yellow, Green).',
    materials: ['Colored plastic beads/blocks (Red, Yellow, Green, Blue)', '3 small baskets/bowls', 'Color charts'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक लाल सेब और हरा पत्ता दिखाएं: "क्या दोनों का रंग एक जैसा है? नहीं!" संथाली में लाल को ᱟᱨᱟᱜ (Arag) और हरे को ᱦᱟᱹᱨᱭᱟᱹᱲ (Haryar) कहते हैं।', sat: 'ᱢᱟᱪᱮᱛ ᱟᱨᱟᱜ ᱥᱮᱣ ᱟᱨ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱠᱟᱢ ᱩᱫᱩᱜ ᱢᱮ: "ᱟᱨᱟᱜ ᱟᱨ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱨᱚᱝ ᱩᱯᱨᱩᱢ ᱢᱮ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '8 min', hin: '3 मुख्य रंग सिखाएं:\n• लाल = ᱟᱨᱟᱜ (Arag) — जैसे टमाटर, फूल\n• हरा = ᱦᱟᱹᱨᱭᱟᱹᱲ (Haryar) — जैसे पत्तियां, घास\n• पीला = ᱥᱟᱥᱟᱝ (Sasang) — जैसे हल्दी, केला, सूरजमुखी', sat: '᱓ ᱢᱩᱬᱩᱛ ᱨᱚᱝ:\n• ᱟᱨᱟᱜ (Red) — ᱴᱚᱢᱟᱴᱚᱨ ᱞᱮᱠᱟ\n• ᱦᱟᱹᱨᱭᱟᱹᱲ (Green) — ᱥᱟᱠᱟᱢ ᱞᱮᱠᱟ\n• ᱥᱟᱥᱟᱝ (Yellow) — ᱥᱟᱥᱟᱝ, ᱠᱟᱭᱨᱟ ᱞᱮᱠᱟ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'छांटने का खेल: टोकरी में मिले-जुले मोती हैं। 3 टोलियां लाल मोती को लाल कटोरी में, हरे को हरी कटोरी में रखें।', sat: 'ᱵᱷᱮᱜᱟᱨ ᱠᱷᱮᱞᱳᱰ: ᱟᱨᱟᱜ ᱢᱚᱛᱤ ᱟᱨᱟᱜ ᱵᱟᱹᱴᱤ ᱨᱮ, ᱦᱟᱹᱨᱭᱟᱹᱲ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱵᱟᱹᱴᱤ ᱨᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बच्चे अपने पहने हुए कपड़ों के रंगों को पहचानें और संथाली में नाम बोलें।', sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱟᱠᱚᱣᱟᱜ ᱞᱩᱜᱽᱲᱤ ᱨᱚᱝ ᱪᱤᱱᱦᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर के आस-पास से 2 हरी पत्तियां और 2 लाल फूल चुनकर कल कक्षा में लाएं।', sat: 'ᱚᱲᱟᱜ ᱥᱩᱨ ᱠᱷᱚᱱ ᱒ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱠᱟᱢ ᱟᱨ ᱒ ᱟᱨᱟᱜ ᱵᱟᱦᱟ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"पत्ते का रंग कैसा होता है? संथाली में बोलो"', question_sat: '"ᱥᱟᱠᱟᱢ ᱨᱮᱱᱟᱜ ᱨᱚᱝ ᱪᱮᱫ ᱞᱮᱠᱟ? ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱦᱟᱹᱨᱭᱟᱹᱲ (Haryar) = हरा', answer_sat: 'ᱛᱮᱞᱟ: ᱦᱟᱹᱨᱭᱟᱹᱲ' },
      { question_hin: '"टमाटर का रंग क्या है?"', question_sat: '"ᱴᱚᱢᱟᱴᱚᱨ ᱫᱚ ᱪᱮᱫ ᱨᱚᱝ ᱠᱟᱱᱟ?"', answer_hin: 'ᱟᱨᱟᱜ (Arag) = लाल', answer_sat: 'ᱛᱮᱞᱟ: ᱟᱨᱟᱜ' },
      { question_hin: '"हल्दी का रंग संथाली में क्या है?"', question_sat: '"ᱥᱟᱥᱟᱝ ᱫᱚ ᱪᱮᱫ ᱨᱚᱝ?"', answer_hin: 'ᱥᱟᱥᱟᱝ (Sasang) = पीला', answer_sat: 'ᱛᱮᱞᱟ: ᱥᱟᱥᱟᱝ' },
    ],
  },

  // ----------------------------------------------------------
  // CLASS 1 — LITERACY (5 TOPICS)
  // ----------------------------------------------------------

  'Class 1||Literacy||0': {
    title_hin: 'ओल चिकी वर्णमाला: पहले 10 अक्षर (ᱚᱞ ᱪᱤᱠᱤ ᱑-᱑᱐)',
    title_sat: 'ᱚᱞ ᱪᱤᱠᱤ ᱯᱩᱭᱞᱩ ᱑᱐ ᱟᱠᱷᱚᱨ ᱪᱮᱫᱚᱜ',
    grade: 'Class 1', subject: 'Foundational Literacy',
    topic: 'Ol Chiki Alphabet: Letters 1–10',
    nipun_target: 'NIPUN Lakshya (Class 1): Child identifies and writes first 10 Ol Chiki letters (ᱚ, ᱛ, ᱜ, ᱝ, ᱞ, ᱟ, ᱠ, ᱡ, ᱢ, ᱣ) with correct phonics.',
    materials: ['Ol Chiki alphabet chart', 'Slate and chalk', 'Flashcards of 10 letters'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक ᱚ बोर्ड पर लिखें: "यह हमारी संथाली भाषा की अपनी लिपि ओल चिकी का पहला अक्षर है! पंडित रघुनाथ मुर्मू जी ने इसे बनाया था।"', sat: 'ᱢᱟᱪᱮᱛ ᱵᱳᱨᱰ ᱨᱮ ᱚ ᱚᱞ ᱠᱟᱛᱮ: "ᱱᱚᱣᱟ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱚᱞ ᱪᱤᱠᱤ ᱨᱮᱱᱟᱜ ᱯᱩᱭᱞᱩ ᱟᱠᱷᱚᱨ ᱠᱟᱱᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '10 अक्षरों का ध्वनि व आकार परिचय:\n• ᱚ = O (ᱚᱞ = लिखना)\n• ᱛ = T (ᱛᱤ = हाथ)\n• ᱜ = G (ᱜᱟᱹᱭ = गाय)\n• ᱝ = NG\n• ᱞ = L (ᱞᱩᱛᱩᱨ = कान)\n• ᱟ = A (ᱟᱢ = तुम/आम)\n• ᱠ = K (ᱠᱟᱹᱴᱩᱵ = उंगली)\n• ᱡ = J (ᱡᱚᱦᱟᱨ)\n• ᱢ = M (ᱢᱮᱫ = आंख)\n• ᱣ = W', sat: '᱑᱐ ᱟᱠᱷᱚᱨ ᱪᱮᱫ ᱢᱮ:\n• ᱚ, ᱛ, ᱜ, ᱝ, ᱞ\n• ᱟ, ᱠ, ᱡ, ᱢ, ᱣ\nᱡᱚᱛᱚ ᱟᱠᱷᱚᱨ ᱨᱮᱱᱟᱜ ᱥᱟᱰᱮ ᱟᱨ ᱟᱹᱲᱟᱹ ᱪᱮᱫ ᱢᱮ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर लिखाई: शिक्षक बोर्ड पर लिखें → बच्चे अपनी स्लेट पर ᱚ, ᱛ, ᱜ को 3-3 बार सुंदर लिखें।', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱚᱞ ᱟᱵᱷᱭᱟᱥ: ᱢᱟᱪᱮᱛ ᱩᱫᱩᱜ → ᱜᱤᱫᱽᱨᱟᱹ ᱥᱞᱮᱴ ᱨᱮ ᱚ, ᱛ, ᱜ ᱯᱮ ᱫᱷᱟᱣ ᱠᱚ ᱚᱞᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'शब्द में अक्षर ढूंढना: "ᱡᱚᱦᱟᱨ" में कौन सा अक्षर है? बच्चे ᱡ और ᱦ पहचानें।', sat: '"ᱡᱚᱦᱟᱨ" ᱟᱹᱲᱟᱹ ᱨᱮ ᱚᱠᱟ ᱟᱠᱷᱚᱨ ᱢᱮᱱᱟᱜᱼᱟ ᱯᱟᱱᱛᱮ ᱧᱟᱢ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'गृहकार्य: ᱚ, ᱛ, ᱜ, ᱞ, ᱢ अक्षरों को कॉपी में 5-5 बार लिखकर लाएं।', sat: 'ᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ: ᱚ, ᱛ, ᱜ ᱟᱠᱷᱚᱨ ᱠᱷᱟᱛᱟ ᱨᱮ ᱕ ᱫᱷᱟᱣ ᱚᱞ ᱠᱟᱛᱮ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"ᱜ से शुरू होने वाला एक संथाली शब्द बोलो"', question_sat: '"ᱜ ᱛᱮ ᱮᱦᱚᱵᱚᱜ ᱢᱤᱫ ᱥᱟᱱᱛᱟᱲᱤ ᱟᱹᱲᱟᱹ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱜᱟᱹᱭ (Gaay) = गाय', answer_sat: 'ᱛᱮᱞᱟ: ᱜᱟᱹᱭ' },
      { question_hin: '"स्लेट पर ᱛ लिखकर दिखाओ"', question_sat: '"ᱥᱞᱮᱴ ᱨᱮ ᱛ ᱚᱞ ᱠᱟᱛᱮ ᱩᱫᱩᱜ ᱢᱮ"', answer_hin: 'Child writes ᱛ correctly on slate', answer_sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱛ ᱥᱟᱹᱦᱤᱡ ᱮ ᱚᱞᱟ' },
      { question_hin: '"ᱢᱮᱫ में पहला अक्षर कौन सा है?"', question_sat: '"ᱢᱮᱫ ᱨᱮ ᱯᱩᱭᱞᱩ ᱟᱠᱷᱚᱨ ᱪᱮᱫ ᱠᱟᱱᱟ?"', answer_hin: 'ᱢ (M)', answer_sat: 'ᱛᱮᱞᱟ: ᱢ' },
    ],
  },

  'Class 1||Literacy||1': {
    title_hin: 'ओल चिकी वर्णमाला: अक्षर 11 से 20 (ᱚᱞ ᱪᱤᱠᱤ ᱑᱑-᱒᱐)',
    title_sat: 'ᱚᱞ ᱪᱤᱠᱤ ᱫᱚᱥᱟᱨ ᱑᱐ ᱟᱠᱷᱚᱨ (᱑᱑-᱒᱐)',
    grade: 'Class 1', subject: 'Foundational Literacy',
    topic: 'Ol Chiki Alphabet: Letters 11–20',
    nipun_target: 'NIPUN Lakshya (Class 1): Child recognizes and writes Ol Chiki letters 11 to 20 (ᱤ, ᱥ, ᱦ, ᱧ, ᱨ, ᱩ, ᱪ, ᱫ, ᱬ, ᱭ) with correct letter sounds.',
    materials: ['Ol Chiki alphabet grid 11–20', 'Chalk and slate', 'Phonics blending flashcards'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक ᱤ (I) और ᱥ (S) बोर्ड पर लिखें: "हमने पहले 10 सीखे, आज अगले 10 मजेदार अक्षर सीखेंगे!"', sat: 'ᱢᱟᱪᱮᱛ ᱤ ᱟᱨ ᱥ ᱵᱳᱨᱰ ᱨᱮ ᱚᱞ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ: "ᱛᱮᱦᱮᱧ ᱫᱚᱥᱟᱨ ᱑᱐ ᱟᱠᱷᱚᱨ ᱵᱚᱱ ᱪᱮᱫᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'अक्षर 11–20 परिचय:\n• ᱤ = I (ᱤᱯᱤᱞ = तारा)\n• ᱥ = S (ᱥᱤᱢ = मुर्गी)\n• ᱦ = H (ᱦᱚᱲ = मनुष्य)\n• ᱧ = NY\n• ᱨ = R (ᱨᱚᱴᱮ = मेंढक)\n• ᱩ = U (ᱩᱞ = आम)\n• ᱪ = CH (ᱪᱮᱬᱮ = पक्षी)\n• ᱫ = D (ᱫᱟᱜ = पानी)\n• ᱬ = N (ण)\n• ᱭ = Y', sat: '᱑᱑-᱒᱐ ᱟᱠᱷᱚᱨ ᱩᱯᱨᱩᱢ:\n• ᱤ (ᱤᱯᱤᱞ = तारा)\n• ᱥ (ᱥᱤᱢ = ᱢᱩᱨᱜᱤ)\n• ᱦ (ᱦᱚᱲ = ᱦᱚᱲ)\n• ᱨ (ᱨᱚᱴᱮ), ᱩ (ᱩᱞ), ᱪ (ᱪᱮᱬᱮ), ᱫ (ᱫᱟᱜ)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'अक्षर मिलान खेल: शिक्षक कार्ड दिखाएं (जैसे ᱫ), बच्चे आवाज बोलें "ᱫᱟᱜ!" और स्लेट पर लिखें।', sat: 'ᱠᱟᱨᱰ ᱢᱮᱲᱟᱣ ᱠᱷᱮᱞᱳᱰ: ᱢᱟᱪᱮᱛ ᱫ ᱩᱫᱩᱜ → ᱜᱤᱫᱽᱨᱟᱹ "ᱫᱟᱜ!" ᱢᱮᱱ ᱠᱟᱛᱮ ᱥᱞᱮᱴ ᱨᱮ ᱚᱞ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: '"ᱫᱟᱜ" (पानी) और "ᱩᱞ" (आम) शब्दों को अक्षरों में तोड़कर लिखना: ᱫ + ᱟ + ᱜ = ᱫᱟᱜ।', sat: 'ᱟᱹᱲᱟᱹ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱚᱞ: ᱫ + ᱟ + ᱜ = ᱫᱟᱜ; ᱩ + ᱞ = ᱩᱞ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर में ᱫ (पानी = ᱫᱟᱜ) और ᱩ (आम = ᱩᱞ) लिखकर पानी पीने वाले बर्तन पर लेबल लगाएं।', sat: 'ᱫᱟᱜ ᱟᱹᱲᱟᱹ ᱚᱞ ᱠᱟᱛᱮ ᱚᱲᱟᱜ ᱨᱮ ᱫᱟᱜ ᱴᱩᱠᱩᱡ ᱨᱮ ᱩᱫᱩᱜ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"ᱫᱟᱜ (पानी) में पहला अक्षर कौन सा है?"', question_sat: '"ᱫᱟᱜ ᱟᱹᱲᱟᱹ ᱨᱮ ᱯᱩᱭᱞᱩ ᱟᱠᱷᱚᱨ ᱪᱮᱫ ᱠᱟᱱᱟ?"', answer_hin: 'ᱫ (D)', answer_sat: 'ᱛᱮᱞᱟ: ᱫ' },
      { question_hin: '"ᱩ से शुरू होने वाला एक फल का नाम बोलो"', question_sat: '"ᱩ ᱛᱮ ᱮᱦᱚᱵᱚᱜ ᱢᱤᱫ ᱡᱚ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱩᱞ (Ul) = आम', answer_sat: 'ᱛᱮᱞᱟ: ᱩᱞ (आम)' },
      { question_hin: '"चिड़िया को संथाली में ᱪᱮᱬᱮ कहते हैं, पहला अक्षर क्या है?"', question_sat: '"ᱪᱮᱬᱮ ᱨᱮ ᱯᱩᱭᱞᱩ ᱟᱠᱷᱚᱨ ᱚᱠᱟ?"', answer_hin: 'ᱪ (CH)', answer_sat: 'ᱛᱮᱞᱟ: ᱪ' },
    ],
  },

  'Class 1||Literacy||2': {
    title_hin: 'ओल चिकी में सरल 2-3 अक्षरीय शब्दों का पठन (CVC Words)',
    title_sat: 'ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱠᱷᱟᱴᱚ ᱟᱹᱲᱟᱹ ᱯᱟᱲᱦᱟᱣ',
    grade: 'Class 1', subject: 'Foundational Literacy',
    topic: 'CVC Word Reading in Ol Chiki',
    nipun_target: 'NIPUN Lakshya (Class 1): Child blends letter sounds to read simple 2-3 letter meaningful words in Ol Chiki (ᱫᱟᱜ, ᱩᱞ, ᱥᱤᱢ, ᱢᱮᱫ, ᱚᱞ).',
    materials: ['Letter sliding strips', 'Word cards with pictures', 'Reading pointer'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक दो कार्ड जोड़ें: [ᱩ] + [ᱞ] → "ᱩᱞ!" (आम)। बच्चों को दिखाएं कि कैसे दो अक्षर मिलकर एक शब्द बनाते हैं।', sat: 'ᱢᱟᱪᱮᱛ ᱵᱟᱨ ᱠᱟᱨᱰ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱩᱫᱩᱜ ᱢᱮ: [ᱩ] + [ᱞ] = ᱩᱞ! ᱟᱠᱷᱚᱨ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱟᱹᱲᱟᱹ ᱵᱮᱱᱟᱣᱜᱼᱟ᱾' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'ध्वनि जोड़ (Blending) सिखाएं:\n• ᱫ + ᱟ + ᱜ = ᱫᱟᱜ (Daak = पानी)\n• ᱥ + ᱤ + ᱢ = ᱥᱤᱢ (Sim = मुर्गी)\n• ᱚ + ᱞ = ᱚᱞ (Ol = लिखना)\n• ᱢ + ᱮ + ᱫ = ᱢᱮᱫ (Med = आंख)\n• ᱛ + ᱤ = ᱛᱤ (Ti = हाथ)', sat: 'ᱟᱠᱷᱚᱨ ᱥᱟᱰᱮ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱯᱟᱲᱦᱟᱣ:\n• ᱫ + ᱟ + ᱜ = ᱫᱟᱜ (Water)\n• ᱥ + ᱤ + ᱢ = ᱥᱤᱢ (Hen)\n• ᱚ + ᱞ = ᱚᱞ (Write)\n• ᱢ + ᱮ + ᱫ = ᱢᱮᱫ (Eye)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'शब्द कार्ड पढ़ना: बच्चे जोड़ियों में एक-एक कार्ड उठाएं, उंगली रखकर ज़ोर से पढ़ें और उसका हिंदी अर्थ बताएं।', sat: 'ᱟᱹᱲᱟᱹ ᱠᱟᱨᱰ ᱯᱟᱲᱦᱟᱣ: ᱜᱤᱫᱽᱨᱟᱹ ᱡᱩᱲᱤ ᱛᱮ ᱠᱟᱨᱰ ᱛᱩᱞ ᱠᱟᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ ᱟᱨ ᱢᱮᱱᱮᱛ ᱞᱟᱹᱭ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'चित्र से शब्द का मिलान: बोर्ड पर चित्र (पानी, आम, मुर्गी) के सामने सही ओल चिकी शब्द चिपकाओ।', sat: 'ᱪᱤᱛᱟᱹᱨ ᱥᱟᱶ ᱥᱟᱹᱦᱤᱡ ᱚᱞ ᱪᱤᱠᱤ ᱟᱹᱲᱟᱹ ᱡᱚᱲᱟᱣ ᱢᱮ (ᱫᱟᱜ, ᱩᱞ, ᱥᱤᱢ)᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'बच्चे ᱫᱟᱜ, ᱩᱞ, ᱥᱤᱢ, ᱚᱞ शब्दों को 3-3 बार कॉपी में लिखें।', sat: 'ᱫᱟᱜ, ᱩᱞ, ᱥᱤᱢ, ᱚᱞ ᱟᱹᱲᱟᱹ ᱠᱚ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱠᱟᱛᱮ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"ᱫᱟᱜ शब्द को पढ़कर इसका अर्थ बताओ"', question_sat: '"ᱫᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱠᱟᱛᱮ ᱱᱚᱣᱟ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱫᱟᱜ = पानी (Water)', answer_sat: 'ᱛᱮᱞᱟ: ᱫᱟᱜ (ᱯᱟᱱᱤ)' },
      { question_hin: '"मुर्गी को ओल चिकी में कैसे लिखते हैं?"', question_sat: '"ᱥᱤᱢ ᱫᱚ ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱚ ᱚᱞᱟ?"', answer_hin: 'ᱥᱤᱢ (S-I-M)', answer_sat: 'ᱛᱮᱞᱟ: ᱥᱤᱢ' },
      { question_hin: '"ᱚ + ᱞ मिलकर क्या बनता है?"', question_sat: '"ᱚ + ᱞ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱪᱮᱫ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: 'ᱚᱞ (Ol = लिखना)', answer_sat: 'ᱛᱮᱞᱟ: ᱚᱞ' },
    ],
  },

  'Class 1||Literacy||3': {
    title_hin: 'कक्षा के सरल संवाद — संथाली में अभिवादन और बातचीत',
    title_sat: 'ᱠᱞᱟᱥ ᱨᱮ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱨᱚᱯᱚᱲ ᱟᱨ ᱡᱚᱦᱟᱨ',
    grade: 'Class 1', subject: 'Foundational Literacy',
    topic: 'Simple Dialogues: Classroom Greetings',
    nipun_target: 'NIPUN Lakshya (Class 1): Child uses basic conversational phrases and classroom instructions in Santali with peers and teacher.',
    materials: ['Role play name tags', 'Greeting cards', 'Dialogue chart'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक कक्षा में प्रवेश करते हुए: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! (नमस्ते बच्चो!)"। बच्चे उत्तर दें: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!"।', sat: 'ᱢᱟᱪᱮᱛ ᱠᱞᱟᱥ ᱵᱚᱞᱚ ᱠᱟᱛᱮ: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!" ᱜᱤᱫᱽᱨᱟᱹ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '5 जरूरी कक्षा वाक्य सिखाएं:\n• "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?" = तुम्हारा नाम क्या है?\n• "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ___ ᱠᱟᱱᱟ।" = मेरा नाम ___ है।\n• "ᱫᱩᱲᱩᱵ ᱢᱮ" = बैठ जाओ\n• "ᱛᱤᱸᱜᱩᱱ ᱢᱮ" = खड़े हो जाओ\n• "ᱫᱟᱜ ᱤᱧ ᱧᱩᱭᱟ?" = क्या मैं पानी पी लूं?', sat: '᱕ ᱢᱩᱬᱩᱛ ᱨᱚᱯᱚᱲ:\n• ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?\n• ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱥᱩᱱᱤᱛᱟ ᱠᱟᱱᱟ᱾\n• ᱫᱩᱲᱩᱵ ᱢᱮ / ᱛᱤᱸᱜᱩᱱ ᱢᱮ\n• ᱫᱟᱜ ᱤᱧ ᱧᱩᱭᱟ?' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'जोड़ी में बातचीत (Pair Work): एक बच्चा पूछे "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?", दूसरा अपना नाम संथाली में बताए। फिर बारी बदलें।', sat: 'ᱡᱩᱲᱤ ᱨᱚᱯᱚᱲ: ᱢᱤᱫ ᱜᱤᱫᱽᱨᱟᱹ "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?" ᱠᱩᱞᱤᱭᱟᱭ, ᱫᱚᱥᱟᱨ ᱟᱡᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭᱟᱭ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'रोल प्ले: एक बच्चा शिक्षक बने और दूसरे बच्चों को "ᱫᱩᱲᱩᱵ ᱢᱮ", "ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ" (किताब खोलो) निर्देश दे।', sat: 'ᱨᱳᱞ ᱯᱞᱮ: ᱢᱤᱫ ᱜᱤᱫᱽᱨᱟᱹ ᱢᱟᱪᱮᱛ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ "ᱫᱩᱲᱩᱵ ᱢᱮ", "ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ" ᱢᱮᱱ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर जाकर अपने भाई/बहन से संथाली में नाम पूछने का संवाद करें।', sat: 'ᱚᱲᱟᱜ ᱥᱮᱱ ᱠᱟᱛᱮ ᱵᱚᱭᱦᱟ-ᱢᱤᱥᱨᱟ ᱥᱟᱶ ᱱᱚᱣᱟ ᱨᱚᱯᱚᱲ ᱫᱚᱦᱲᱟᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"तुम्हारा नाम क्या है?" को संथाली में कैसे पूछोगे?', question_sat: '"ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?" ᱦᱤᱱᱫᱤ ᱛᱮ ᱪᱮᱫ ᱢᱮᱱᱮᱛ?', answer_hin: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ? (Aamag nyutum ched?)', answer_sat: 'ᱛᱮᱞᱟ: ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?' },
      { question_hin: '"बैठ जाओ" को संथाली में क्या कहते हैं?', question_sat: '"ᱵᱮᱭᱴᱷ ᱡᱟᱣ" ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?', answer_hin: 'ᱫᱩᱲᱩᱵ ᱢᱮ (Durup me)', answer_sat: 'ᱛᱮᱞᱟ: ᱫᱩᱲᱩᱵ ᱢᱮ' },
      { question_hin: 'अगर पानी पीना हो तो शिक्षक से संथाली में कैसे मांगोगे?', question_sat: 'ᱫᱟᱜ ᱧᱩ ᱞᱟᱹᱜᱤᱫ ᱢᱟᱪᱮᱛ ᱪᱮᱫ ᱞᱮᱠᱟᱢ ᱠᱩᱞᱤᱭᱟ?', answer_hin: 'ᱫᱟᱜ ᱤᱧ ᱧᱩᱭᱟ, ᱢᱟᱪᱮᱛ? (Daak inj nyuya, machet?)', answer_sat: 'ᱛᱮᱞᱟ: ᱫᱟᱜ ᱤᱧ ᱧᱩᱭᱟ, ᱢᱟᱪᱮᱛ?' },
    ],
  },

  'Class 1||Literacy||4': {
    title_hin: 'लघु कहानी श्रवण और पुनः कथन (ᱠᱟᱹᱦᱱᱤ ᱟᱸᱡᱚᱢ ᱟᱨ ᱞᱟᱹᱭ)',
    title_sat: 'ᱠᱟᱹᱦᱱᱤ ᱟᱸᱡᱚᱢ ᱠᱟᱛᱮ ᱟᱯᱱᱟᱨ ᱟᱲᱟᱝ ᱛᱮ ᱞᱟᱹᱭ',
    grade: 'Class 1', subject: 'Foundational Literacy',
    topic: 'Short Story Listening & Retelling',
    nipun_target: 'NIPUN Lakshya (Class 1): Child listens to a 4–5 sentence story in Santali, answers 3 factual questions, and retells main events in own words.',
    materials: ['Story picture cards (The thirsty crow / ᱠᱟᱹᱦᱩ ᱟᱨ ᱫᱟᱜ)', 'Puppet'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक कौवे का चित्र दिखाकर पूछें: "जब तुम्हें बहुत प्यास लगती है तो तुम क्या करते हो?" आज हम चतुर कौवे (ᱠᱟᱹᱦᱩ) की कहानी सुनेंगे!', sat: 'ᱢᱟᱪᱮᱛ ᱠᱟᱹᱦᱩ ᱪᱤᱛᱟᱹᱨ ᱩᱫᱩᱜ ᱢᱮ: "ᱟᱢ ᱡᱚᱠᱷᱚᱱ ᱫᱟᱜ ᱛᱮᱛᱟᱝ ᱢᱮᱭᱟ, ᱪᱮᱫ ᱮᱢ ᱪᱤᱠᱟᱹᱭᱟ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'कहानी हाव-भाव के साथ सुनाएं:\n"ᱢᱤᱫᱴᱟᱝ ᱠᱟᱹᱦᱩ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟᱭ᱾ ᱩᱱᱤ ᱫᱚ ᱟᱹᱰᱤ ᱫᱟᱜ ᱛᱮᱛᱟᱝ ᱞᱮᱫᱮᱭᱟ᱾\nᱩᱱᱤ ᱢᱤᱫ ᱴᱩᱠᱩᱡ ᱨᱮ ᱠᱚᱢ ᱫᱟᱜ ᱮ ᱧᱟᱢ ᱠᱮᱫᱼᱟ᱾\nᱠᱟᱹᱦᱩ ᱫᱷᱤᱨᱤ ᱟᱹᱜᱩ ᱠᱟᱛᱮ ᱴᱩᱠᱩᱡ ᱨᱮ ᱠᱷᱟᱫᱞᱮ ᱠᱮᱫᱼᱟ᱾\nᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ ᱮᱱᱟ ᱟᱨ ᱠᱟᱹᱦᱩ ᱫᱟᱜ ᱮ ᱧᱩ ᱠᱮᱫᱼᱟ।"', sat: 'ᱠᱟᱹᱦᱱᱤ ᱟᱸᱡᱚᱢ ᱢᱮ:\nᱢᱤᱫ ᱠᱟᱹᱦᱩ ᱟᱹᱰᱤ ᱫᱟᱜ ᱛᱮᱛᱟᱝ ᱞᱮᱫᱮᱭᱟ᱾ ᱴᱩᱠᱩᱡ ᱨᱮ ᱫᱷᱤᱨᱤ ᱠᱷᱟᱫᱞᱮ ᱠᱟᱛᱮ ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ ᱠᱮᱫᱼᱟ ᱟᱨ ᱫᱟᱜ ᱮ ᱧᱩ ᱠᱮᱫᱼᱟ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'चित्र क्रमबद्ध करना: शिक्षक 4 चित्र आगे-पीछे रखें, बच्चे उन्हें कहानी की घटना के अनुसार सही क्रम में लगाएं।', sat: 'ᱪᱤᱛᱟᱹᱨ ᱛᱷᱟᱨ ᱥᱟᱡᱟᱣ: ᱠᱟᱹᱦᱱᱤ ᱞᱮᱠᱟᱛᱮ ᱔ ᱪᱤᱛᱟᱹᱨ ᱞᱟᱦᱟ-ᱛᱟᱭᱚᱢ ᱥᱟᱡᱟᱣ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बच्चे अपने शब्दों में 2-3 वाक्यों में कहानी दोबारा सुनाएं: "ᱠᱟᱹᱦᱩ ᱫᱟᱜ ᱮ ᱧᱩ ᱠᱮᱫᱼᱟ।"', sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱟᱠᱚᱣᱟᱜ ᱟᱲᱟᱝ ᱛᱮ ᱠᱟᱹᱦᱱᱤ ᱞᱟᱹᱭ ᱫᱚᱦᱲᱟᱭ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर जाकर अपने छोटे भाई-बहन को कौवे की यह कहानी संथाली में सुनाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱵᱚᱭᱦᱟ ᱠᱚ ᱠᱟᱹᱦᱩ ᱟᱜ ᱠᱟᱹᱦᱱᱤ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱟᱠᱚ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'कहानी में किसे प्यास लगी थी?', question_sat: 'ᱠᱟᱹᱦᱱᱤ ᱨᱮ ᱚᱠᱚᱭ ᱫᱟᱜ ᱛᱮᱛᱟᱝ ᱞᱮᱫᱮᱭᱟ?', answer_hin: 'कौवे को = ᱠᱟᱹᱦᱩ (Kahu)', answer_sat: 'ᱛᱮᱞᱟ: ᱠᱟᱹᱦᱩ' },
      { question_hin: 'कौवे ने पानी ऊपर लाने के लिए घड़े में क्या डाला?', question_sat: 'ᱠᱟᱹᱦᱩ ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ ᱞᱟᱹᱜᱤᱫ ᱴᱩᱠᱩᱡ ᱨᱮ ᱪᱮᱫ ᱮ ᱠᱷᱟᱫᱞᱮ ᱠᱮᱫᱼᱟ?', answer_hin: 'कंकड़ / पत्थर = ᱫᱷᱤᱨᱤ (Dhiri)', answer_sat: 'ᱛᱮᱞᱟ: ᱫᱷᱤᱨᱤ' },
      { question_hin: 'कौवा कैसा था — मूर्ख या चतुर?', question_sat: 'ᱠᱟᱹᱦᱩ ᱫᱚ ᱪᱮᱫ ᱞᱮᱠᱟᱱ ᱠᱟᱹᱦᱩ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟᱭ?', answer_hin: 'चतुर (ᱞᱟᱹᱥᱠᱟᱹᱨ / ᱪᱟᱞᱟᱠ)', answer_sat: 'ᱛᱮᱞᱟ: ᱪᱟᱞᱟᱠ' },
    ],
  },

  // ----------------------------------------------------------
  // CLASS 1 — NUMERACY (5 TOPICS)
  // ----------------------------------------------------------

  'Class 1||Numeracy||0': {
    title_hin: '1 से 10 तक गिनती और लिखाई (ᱞᱮᱠᱷᱟ ᱑-᱑᱐)',
    title_sat: 'ᱞᱮᱠᱷᱟ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱞᱮᱠᱷᱟ ᱟᱨ ᱚᱞ',
    grade: 'Class 1', subject: 'Foundational Numeracy',
    topic: 'Counting & Writing Numbers 1–10',
    nipun_target: 'NIPUN Lakshya (Class 1): Child reads, writes and says numbers 1–10 in Ol Chiki and Devanagari with accurate quantity matching.',
    materials: ['Number cards 1–10 (Ol Chiki ᱑-᱑᱐)', 'Pebbles / counting sticks', 'Number line 1–10'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक दोनों हाथों की 10 उंगलियां खोलें: "हमारे दोनों हाथों में कुल कितनी उंगलियां हैं? 10! संथाली में ᱜᱮᱞ (Gel)!"', sat: 'ᱢᱟᱪᱮᱛ ᱑᱐ ᱠᱟᱹᱴᱩᱵ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱟᱵᱚᱣᱟᱜ ᱵᱟᱱᱟᱨ ᱛᱤ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱠᱟᱹᱴᱩᱵ? ᱜᱮᱞ (᱑᱐)!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '1 से 10 तक संख्याएं, ओल चिकी अंक और नाम:\n1 = ᱑ = ᱢᱤᱫ (Mid)\n2 = ᱒ = ᱵᱟᱨ (Bar)\n3 = ᱓ = ᱯᱮ (Pe)\n4 = ᱔ = ᱯᱩᱱ (Pun)\n5 = ᱕ = ᱢᱚᱬᱮ (Mone)\n6 = ᱖ = ᱛᱩᱨᱩᱭ (Turuy)\n7 = ᱗ = ᱮᱭᱟᱭ (Eyay)\n8 = ᱘ = ᱤᱨᱞ (Iral)\n9 = ᱙ = ᱟᱨᱮ (Are)\n10 = ᱑᱐ = ᱜᱮᱞ (Gel)', sat: '᱑ ᱠᱷᱚᱱ ᱑᱐ ᱞᱮᱠᱷᱟ ᱪᱮᱫ ᱢᱮ:\n᱑ (ᱢᱤᱫ), ᱒ (ᱵᱟᱨ), ᱓ (ᱯᱮ), ᱔ (ᱯᱩᱱ), ᱕ (ᱢᱚᱬᱮ)\n᱖ (ᱛᱩᱨᱩᱭ), ᱗ (ᱮᱭᱟᱭ), ᱘ (ᱤᱨᱞ), ᱙ (ᱟᱨᱮ), ᱑᱐ (ᱜᱮᱞ)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'पत्थर गिनना: शिक्षक 7 पत्थर निकालें → बच्चे संथाली में गिनें "ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ, ᱛᱩᱨᱩᱭ, ᱮᱭᱟᱭ = 7!" और स्लेट पर ᱗ लिखें।', sat: 'ᱫᱷᱤᱨᱤ ᱞᱮᱠᱷᱟ: ᱗ ᱫᱷᱤᱨᱤ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱥᱞᱮᱴ ᱨᱮ ᱗ ᱚᱞ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'कक्षा में बच्चे संथाली में लड़कों और लड़कियों की संख्या गिनकर बोर्ड पर ओल चिकी में दर्ज करें।', sat: 'ᱠᱞᱟᱥ ᱨᱮ ᱠᱚᱲᱟ ᱟᱨ ᱠᱩᱲᱤ ᱜᱤᱫᱽᱨᱟᱹ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱵᱳᱨᱰ ᱨᱮ ᱚᱞ ᱪᱤᱠᱤ ᱮᱞ ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'गृहकार्य: 1 से 10 तक ओल चिकी अंक (᱑-᱑᱐) को 3 बार कॉपी में लिखकर लाएं।', sat: 'ᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ: ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱮᱞ ᱠᱚ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"8 को ओल चिकी में क्या लिखते हैं और संथाली में क्या बोलते हैं?"', question_sat: '"᱘ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?"', answer_hin: '᱘ = ᱤᱨᱞ (Iral)', answer_sat: 'ᱛᱮᱞᱟ: ᱘ (ᱤᱨᱞ)' },
      { question_hin: '"ᱜᱮᱞ का मतलब कितना?"', question_sat: '"ᱜᱮᱞ ᱢᱮᱱᱮᱛ ᱛᱤᱱᱟᱹᱜ?"', answer_hin: '10 = दस (᱑᱐)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱐ (ᱫᱚᱥ)' },
      { question_hin: 'स्लेट पर ᱕ लिखकर 5 बिंदियां बनाओ', question_sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱕ ᱚᱞ ᱠᱟᱛᱮ ᱕ ᱴᱩᱰᱟᱹᱜ ᱵᱮᱱᱟᱣ ᱢᱮ', answer_hin: 'Child writes ᱕ and draws 5 dots', answer_sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱕ ᱚᱞ ᱠᱟᱛᱮ ᱕ ᱴᱩᱰᱟᱹᱜ ᱮ ᱵᱮᱱᱟᱣᱟ' },
    ],
  },

  'Class 1||Numeracy||1': {
    title_hin: '11 से 20 तक संख्याएं और संथाली नाम (ᱞᱮᱠᱷᱟ ᱑᱑-᱒᱐)',
    title_sat: 'ᱞᱮᱠᱷᱟ ᱑᱑ ᱠᱷᱚᱱ ᱒᱐ — ᱜᱮᱞ ᱢᱤᱫ ᱠᱷᱚᱱ ᱵᱟᱨ ᱜᱮᱞ',
    grade: 'Class 1', subject: 'Foundational Numeracy',
    topic: 'Numbers 11–20 & Number Names in Santali',
    nipun_target: 'NIPUN Lakshya (Class 1): Child counts, reads and writes numbers 11 to 20 understanding 10 + ones structure (10 + 1 = 11 / ᱜᱮᱞ ᱢᱤᱫ).',
    materials: ['Bundle of 10 sticks + loose sticks', 'Cards 11–20 (᱑᱑-᱒᱐)', 'Counting frame'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक 10 लकड़ियों का 1 बंडल (ᱜᱮᱞ) + 1 खुली लकड़ी दिखाएं: "10 और 1 मिलकर क्या बना? 11! संथाली में: ᱜᱮᱞ ᱢᱤᱫ (Gel Mid)!"', sat: 'ᱢᱟᱪᱮᱛ ᱑᱐ ᱠᱟᱹᱴᱷᱤ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱵᱚᱱᱰᱤᱞ + ᱑ ᱠᱟᱹᱴᱷᱤ ᱩᱫᱩᱜ ᱢᱮ: "᱑᱐ + ᱑ = ᱑᱑ (ᱜᱮᱞ ᱢᱤᱫ)!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '11 से 20 का ढांचा सिखाएं (10 + इकाई):\n• 11 = ᱑᱑ = ᱜᱮᱞ ᱢᱤᱫ (10+1)\n• 12 = ᱑᱒ = ᱜᱮᱞ ᱵᱟᱨ (10+2)\n• 13 = ᱑᱓ = ᱜᱮᱞ ᱯᱮ (10+3)\n• 14 = ᱑᱔ = ᱜᱮᱞ ᱯᱩᱱ (10+4)\n• 15 = ᱑᱕ = ᱜᱮᱞ ᱢᱚᱬᱮ (10+5)\n• 16 = ᱑᱖ = ᱜᱮᱞ ᱛᱩᱨᱩᱭ\n• 17 = ᱑᱗ = ᱜᱮᱞ ᱮᱭᱟᱭ\n• 18 = ᱑᱘ = ᱜᱮᱞ ᱤᱨᱞ\n• 19 = ᱑᱙ = ᱜᱮᱞ ᱟᱨᱮ\n• 20 = ᱒᱐ = ᱵᱟᱨ ᱜᱮᱞ (2 దहाई / 2 Tens)', sat: '᱑᱑ ᱠᱷᱚᱱ ᱒᱐ ᱮᱞᱠᱷᱟ ᱵᱮᱱᱟᱣ:\n• ᱑᱑ = ᱜᱮᱞ ᱢᱤᱫ, ᱑᱒ = ᱜᱮᱞ ᱵᱟᱨ, ᱑᱓ = ᱜᱮᱞ ᱯᱮ\n• ᱑᱔ = ᱜᱮᱞ ᱯᱩᱱ, ᱑᱕ = ᱜᱮᱞ ᱢᱚᱬᱮ, ᱑᱖ = ᱜᱮᱞ ᱛᱩᱨᱩᱭ\n• ᱑᱗ = ᱜᱮᱞ ᱮᱭᱟᱭ, ᱑᱘ = ᱜᱮᱞ ᱤᱨᱞ, ᱑᱙ = ᱜᱮᱞ ᱟᱨᱮ, ᱒᱐ = ᱵᱟᱨ ᱜᱮᱞ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'बंडल-तीली खेल: शिक्षक बोलें "᱑᱕", बच्चे 1 बंडल (10) और 5 तीलियां उठाकर दिखाएं और "ᱜᱮᱞ ᱢᱚᱬᱮ" बोलें।', sat: 'ᱵᱚᱱᱰᱤᱞ-ᱠᱟᱹᱴᱷᱤ ᱠᱷᱮᱞᱳᱰ: ᱢᱟᱪᱮᱛ "᱑᱕" ᱢᱮᱱ ᱠᱷᱟᱱ ᱜᱤᱫᱽᱨᱟᱹ ᱑ ᱵᱚᱱᱰᱤᱞ + ᱕ ᱠᱟᱹᱴᱷᱤ ᱠᱚ ᱛᱩᱞᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'स्लेट पर 11 से 20 तक की गिनती ओल चिकी (᱑᱑, ᱑᱒, ᱑᱓... ᱒᱐) में बिना देखे लिखना।', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱑᱑ ᱠᱷᱚᱱ ᱒᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱮᱞ ᱵᱤᱱ ᱧᱮᱞ ᱛᱮ ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर माचिस की 15 तीलियां गिनकर 1 बंडल (10) + 5 तीलियों का पैकेट बनाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱑᱕ ᱠᱟᱹᱴᱷᱤ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱑ ᱵᱚᱱᱰᱤᱞ (᱑᱐) + ᱕ ᱵᱮᱱᱟᱣ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"15 को संथाली में क्या कहते हैं?"', question_sat: '"᱑᱕ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?"', answer_hin: 'ᱜᱮᱞ ᱢᱚᱬᱮ (Gel Mone = 10+5)', answer_sat: 'ᱛᱮᱞᱟ: ᱜᱮᱞ ᱢᱚᱬᱮ' },
      { question_hin: '"20 का मतलब कितनी दहाई?"', question_sat: '"᱒᱐ ᱢᱮᱱᱮᱛ ᱛᱤᱱᱟᱹᱜ ᱜᱮᱞ?"', answer_hin: '2 दहाई = ᱵᱟᱨ ᱜᱮᱞ (Bar Gel)', answer_sat: 'ᱛᱮᱞᱟ: ᱵᱟᱨ ᱜᱮᱞ' },
      { question_hin: '"10 + 4 कितना होता है? ओल चिकी में लिखो"', question_sat: '"᱑᱐ + ᱔ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ? ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱚᱞ ᱢᱮ"', answer_hin: '14 = ᱑᱔ (ᱜᱮᱞ ᱯᱩᱱ)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱔' },
    ],
  },

  'Class 1||Numeracy||2': {
    title_hin: 'एकल अंक जोड़ — 1 से 9 तक (ᱡᱚᱲᱟᱣ ᱑-᱙)',
    title_sat: 'ᱢᱤᱫ ᱮᱞ ᱡᱚᱲᱟᱣ ᱑ ᱠᱷᱚᱱ ᱙ ᱫᱷᱟᱹᱵᱤᱡ',
    grade: 'Class 1', subject: 'Foundational Numeracy',
    topic: 'Single-Digit Addition up to 9',
    nipun_target: 'NIPUN Lakshya (Class 1): Child adds two single-digit numbers with sums up to 20 using concrete objects and pictures.',
    materials: ['Counting beans/pebbles', 'Addition flashcards', 'Dice'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'कहानी: "सुनिता के पास 3 बेर थे। रोहन ने 2 और दिए। अब सुनिता के पास कुल कितने बेर हैं?" 3 + 2 = ?', sat: 'ᱠᱟᱹᱦᱱᱤ: "ᱥᱩᱱᱤᱛᱟ ᱴᱷᱮᱱ ᱯᱮ (᱓) ᱡᱟᱹᱱᱩᱢ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾ ᱨᱚᱦᱚᱱ ᱟᱨᱦᱚᱸ ᱵᱟᱨ (᱒) ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'पत्थरों से जोड़ दिखाना:\n[●●●] (3) + [●●] (2) = [●●●●●] (5)\n"तीन और दो मिलकर पांच बनते हैं!"\nᱥᱟᱱᱛᱟᱲᱤ: "ᱯᱮ ᱟᱨ ᱵᱟᱨ ᱡᱚᱲᱟᱣ ᱠᱷᱟᱱ ᱢᱚᱬᱮ ᱦᱩᱭᱩᱜᱼᱟ᱾"\nᱵᱳᱨᱰ ᱨᱮ: ᱓ + ᱒ = ᱕', sat: 'ᱫᱷᱤᱨᱤ ᱛᱮ ᱡᱚᱲᱟᱣ ᱩᱫᱩᱜ:\n[●●●] (᱓) + [●●] (᱒) = [●●●●●] (᱕)\n"ᱯᱮ ᱟᱨ ᱵᱟᱨ ᱡᱚᱲᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱢᱚᱬᱮ ᱦᱩᱭᱩᱜᱼᱟ!"\n᱓ + ᱒ = ᱕' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर हल करें:\n• 4 + 3 = 7 (᱔ + ᱓ = ᱗)\n• 5 + 2 = 7 (᱕ + ᱒ = ᱗)\n• 6 + 3 = 9 (᱖ + ᱓ = ᱙)', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ:\n• ᱔ + ᱓ = ᱗ (ᱯᱩᱱ + ᱯᱮ = ᱮᱭᱟᱭ)\n• ᱕ + ᱒ = ᱗ (ᱢᱚᱬᱮ + ᱵᱟᱨ = ᱮᱭᱟᱭ)\n• ᱖ + ᱓ = ᱙ (ᱛᱩᱨᱩᱭ + ᱯᱮ = ᱟᱨᱮ)' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बाजार खेल: 4 रुपये की पेंसिल + 5 रुपये की रबर = कुल कितने रुपये? 4 + 5 = 9 रुपये (ᱴᱟᱠᱟ)।', sat: 'ᱦᱟᱴ ᱠᱷᱮᱞᱳᱰ: ᱔ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱯᱮᱱᱥᱤᱞ + ᱕ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱨᱚᱵᱚᱨ = ᱡᱚᱛᱚ ᱛᱮ ᱙ ᱴᱟᱠᱟ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'बच्चे घर में 3 चम्मच और 4 कटोरी गिनकर जोड़ें और कुल संख्या बताएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱓ ᱪᱟᱢᱚᱪ + ᱔ ᱵᱟᱹᱴᱤ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"4 + 4 कितना होता है? संथाली में बोलो"', question_sat: '"᱔ + ᱔ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ? ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: '8 = ᱤᱨᱞ (Iral)', answer_sat: 'ᱛᱮᱞᱟ: ᱤᱨᱞ (᱘)' },
      { question_hin: '"5 + 3 = ?" स्लेट पर Ol Chiki में लिखो', question_sat: '"᱕ + ᱓ = ?" ᱥᱞᱮᱴ ᱨᱮ ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱚᱞ ᱢᱮ', answer_hin: '8 = ᱘ (ᱤᱨᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱘' },
      { question_hin: '"6 आम और 3 आम मिलकर कितने आम बनेंगे?"', question_sat: '"᱖ ᱩᱞ ᱟᱨ ᱓ ᱩᱞ ᱡᱚᱲᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱛᱤᱱᱟᱹᱜ ᱩᱞ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: '9 आम = ᱟᱨᱮ ᱩᱞ (᱙)', answer_sat: 'ᱛᱮᱞᱟ: ᱟᱨᱮ ᱩᱞ (᱙)' },
    ],
  },

  'Class 1||Numeracy||3': {
    title_hin: 'एकल अंक घटाव — 1 से 9 तक (ᱜᱷᱟᱴᱟᱣ ᱑-᱙)',
    title_sat: 'ᱢᱤᱫ ᱮᱞ ᱜᱷᱟᱴᱟᱣ ᱑ ᱠᱷᱚᱱ ᱙ ᱫᱷᱟᱹᱵᱤᱡ',
    grade: 'Class 1', subject: 'Foundational Numeracy',
    topic: 'Single-Digit Subtraction up to 9',
    nipun_target: 'NIPUN Lakshya (Class 1): Child performs single-digit subtraction (up to 9) using real objects and picture crossing method.',
    materials: ['Pebbles / counting buttons', 'Crossing-out worksheet', 'Number line 1–9'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'कहानी: "पेड़ पर 5 चिड़िया बैठी थीं। 2 चिड़िया उड़ गईं। अब पेड़ पर कितनी चिड़िया बचीं?" 5 - 2 = ?', sat: 'ᱠᱟᱹᱦᱱᱤ: "ᱫᱟᱨᱮ ᱨᱮ ᱕ ᱪᱮᱬᱮ ᱠᱚ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾ ᱒ ᱪᱮᱬᱮ ᱠᱤᱱ ᱩᱰᱟᱹᱣ ᱮᱱᱟ᱾ ᱱᱤᱛᱚᱜ ᱛᱤᱱᱟᱹᱜ ᱪᱮᱬᱮ ᱠᱚ ᱥᱟᱨᱮᱡ ᱮᱱᱟ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'घटाव को "अलग करना / निकाल लेना" के रूप में सिखाएं:\n[●●●●●] (5) में से 2 हटा दिए → बचे [●●●] (3)\n"पांच में से दो घटाने पर तीन बचते हैं!"\nᱥᱟᱱᱛᱟᱲᱤ: "ᱢᱚᱬᱮ ᱠᱷᱚᱱ ᱵᱟᱨ ᱜᱷᱟᱴᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱯᱮ ᱥᱟᱨᱮᱡᱚᱜᱼᱟ᱾"\nᱵᱳᱨᱰ ᱨᱮ: ᱕ - ᱒ = ᱓', sat: 'ᱜᱷᱟᱴᱟᱣ ᱵᱩᱡᱷᱟᱹᱣ:\n[●●●●●] ᱠᱷᱚᱱ ᱒ ᱚᱪᱚᱜ ᱠᱮᱫᱼᱟ → ᱥᱟᱨᱮᱡ ᱮᱱᱟ [●●●] (᱓)\n"ᱢᱚᱬᱮ ᱠᱷᱚᱱ ᱵᱟᱨ ᱜᱷᱟᱴᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱯᱮ ᱥᱟᱨᱮᱡᱚᱜᱼᱟ!"\n᱕ - ᱒ = ᱓' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर हल करें:\n• 7 - 3 = 4 (᱗ - ᱓ = ᱔)\n• 8 - 5 = 3 (᱘ - ᱕ = ᱓)\n• 9 - 4 = 5 (᱙ - ᱔ = ᱕)\n• 6 - 2 = 4 (᱖ - ᱒ = ᱔)', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ:\n• ᱗ - ᱓ = ᱔ (ᱮᱭᱟᱭ ᱠᱷᱚᱱ ᱯᱮ = ᱯᱩᱱ)\n• ᱘ - ᱕ = ᱓ (ᱤᱨᱞ ᱠᱷᱚᱱ ᱢᱚᱬᱮ = ᱯᱮ)\n• ᱙ - ᱔ = ᱕ (ᱟᱨᱮ ᱠᱷᱚᱱ ᱯᱩᱱ = ᱢᱚᱬᱮ)' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बाजार समस्या: रोहन के पास ₹8 थे। उसने ₹3 का बिस्कुट खरीदा। उसके पास कितने रुपये बचे? 8 - 3 = ₹5 (ᱢᱚᱬᱮ ᱴᱟᱠᱟ)।', sat: 'ᱦᱟᱴ ᱮᱞᱠᱷᱟ: ᱘ ᱴᱟᱠᱟ ᱠᱷᱚᱱ ᱓ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱵᱤᱥᱠᱩᱴ ᱠᱤᱨᱤᱧ ᱠᱮᱫᱼᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ? ᱕ ᱴᱟᱠᱟ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर 6 फल रखकर 2 खाने के बाद कितने बचे, इसका खेल खेलें।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱖ ᱡᱚ ᱠᱷᱚᱱ ᱒ ᱡᱚᱢ ᱠᱟᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡᱚᱜᱼᱟ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"7 - 2 = ?" संथाली में बोलो', question_sat: '"᱗ - ᱒ = ?" ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: '5 = ᱢᱚᱬᱮ (Mone)', answer_sat: 'ᱛᱮᱞᱟ: ᱢᱚᱬᱮ (᱕)' },
      { question_hin: '"9 में से 5 घटाने पर कितना बचेगा?"', question_sat: '"᱙ ᱠᱷᱚᱱ ᱕ ᱜᱷᱟᱴᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡᱚᱜᱼᱟ?"', answer_hin: '4 = ᱯᱩᱱ (Pun)', answer_sat: 'ᱛᱮᱞᱟ: ᱯᱩᱱ (᱔)' },
      { question_hin: '"मेरे पास 6 गेंदें थीं, 3 खो गईं। कितनी बचीं?"', question_sat: '"᱖ ᱵᱚᱞ ᱠᱷᱚᱱ ᱓ ᱟᱫ ᱮᱱᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ?"', answer_hin: '3 गेंद = ᱯᱮ ᱵᱚᱞ (᱓)', answer_sat: 'ᱛᱮᱞᱟ: ᱯᱮ (᱓)' },
    ],
  },

  'Class 1||Numeracy||4': {
    title_hin: 'संख्या क्रम में लुप्त संख्या पहचानना 1–20 (ᱛᱟᱞᱟ ᱨᱮ ᱮᱞ ᱯᱮᱨᱮᱡ)',
    title_sat: 'ᱮᱞᱠᱷᱟ ᱛᱷᱟᱨ ᱨᱮ ᱟᱫ ᱟᱠᱟᱱ ᱮᱞ ᱯᱟᱱᱛᱮ ᱧᱟᱢ',
    grade: 'Class 1', subject: 'Foundational Numeracy',
    topic: 'Missing Number in Sequence 1–20',
    nipun_target: 'NIPUN Lakshya (Class 1): Child identifies missing numbers in forward and backward sequence from 1 to 20.',
    materials: ['Number train cards 1–20', 'Missing number strips', 'Chalk for floor hopscotch'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक फर्श पर रेलगाड़ी डिब्बे बनाएं: 1, 2, [ ? ], 4, 5। "तीसरे डिब्बे का नंबर कहाँ गया? बताओ!" बच्चे: "3! ᱯᱮ!"', sat: 'ᱢᱟᱪᱮᱛ ᱵᱳᱨᱰ ᱨᱮ ᱨᱮᱞᱜᱟᱹᱰᱤ ᱮᱞ ᱚᱞ ᱢᱮ: ᱑, ᱒, [ ? ], ᱔, ᱕᱾ "ᱛᱟᱞᱟ ᱨᱮ ᱚᱠᱟ ᱮᱞ ᱟᱫ ᱮᱱᱟ?" ᱜᱤᱫᱽᱨᱟᱹ: "᱓!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'संख्या क्रम के नियम सिखाएं:\n• आगे की गिनती (+1): 5 के बाद 6, 11 के बाद 12\n• पहले की गिनती (-1): 10 से पहले 9\n• बीच की संख्या: 7 और 9 के बीच में 8\nᱥᱟᱱᱛᱟᱲᱤ: "᱗ ᱟᱨ ᱙ ᱛᱟᱞᱟ ᱨᱮ ᱘ (ᱤᱨᱞ) ᱦᱤᱡᱩᱜᱼᱟ।"', sat: 'ᱮᱞᱠᱷᱟ ᱛᱷᱟᱨ ᱪᱮᱫ ᱢᱮ:\n• ᱞᱟᱦᱟ ᱥᱮᱫ: ᱕ ᱛᱟᱭᱚᱢ ᱖, ᱑᱑ ᱛᱟᱭᱚᱢ ᱑᱒\n• ᱛᱟᱭᱚᱢ ᱥᱮᱫ: ᱑᱐ ᱞᱟᱦᱟ ᱨᱮ ᱙\n• ᱛᱟᱞᱟ ᱮᱞ: ᱗ ᱟᱨ ᱙ ᱛᱟᱞᱟ ᱨᱮ ᱘ (ᱤᱨᱞ)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'खाली स्थान भरो (स्लेट पर):\n1) ᱑, ᱒, ___, ᱔ (उत्तर: ᱓)\n2) ᱖, ᱗, ᱘, ___, ᱑᱐ (उत्तर: ᱙)\n3) ᱑᱑, ᱑᱒, ___, ᱑᱔ (उत्तर: ᱑᱓)\n4) ᱑᱖, ___, ᱑᱘, ᱑᱙ (उत्तर: ᱑᱗)', sat: 'ᱠᱷᱟᱹᱞᱤ ᱡᱟᱭᱜᱟ ᱯᱮᱨᱮᱡ ᱢᱮ:\n᱑) ᱑, ᱒, ___, ᱔ (ᱛᱮᱞᱟ: ᱓)\n᱒) ᱖, ᱗, ᱘, ___, ᱑᱐ (ᱛᱮᱞᱟ: ᱙)\n᱓) ᱑᱑, ᱑᱒, ___, ᱑᱔ (ᱛᱮᱞᱟ: ᱑᱓)\n᱔) ᱑᱖, ___, ᱑᱘, ᱑᱙ (ᱛᱮᱞᱟ: ᱑᱗)' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'संख्या कूद खेल (Hopscotch): बच्चे 1 से 10 तक के खानों में कूदें, जो नंबर छिपा हो, उस पर कूदते समय ज़ोर से संथाली में बोलें।', sat: 'ᱮᱞ ᱫᱚᱱ ᱠᱷᱮᱞᱳᱰ: ᱜᱤᱫᱽᱨᱟᱹ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱫᱚᱱ ᱠᱟᱛᱮ ᱟᱫ ᱟᱠᱟᱱ ᱮᱞ ᱨᱚᱲ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर 1 से 20 की उल्टी गिनती (᱒᱐, ᱑᱙, ᱑᱘... ᱑) अपने माता-पिता को सुनाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱒᱐ ᱠᱷᱚᱱ ᱑ ᱫᱷᱟᱹᱵᱤᱡ ᱩᱞᱴᱟᱹ ᱞᱮᱠᱷᱟ ᱟᱭᱳ-ᱵᱟᱵᱟ ᱟᱸᱡᱚᱢ ᱟᱠᱤᱱ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"7 और 9 के बीच कौन सी संख्या आती है?"', question_sat: '"᱗ ᱟᱨ ᱙ ᱛᱟᱞᱟ ᱨᱮ ᱚᱠᱟ ᱮᱞ ᱦᱤᱡᱩᱜᱼᱟ?"', answer_hin: '8 = ᱘ (ᱤᱨᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱘ (ᱤᱨᱞ)' },
      { question_hin: '"14 के ठीक बाद कौन सी संख्या आती है?"', question_sat: '"᱑᱔ ᱛᱟᱭᱚᱢ ᱥᱟᱶᱛᱮ ᱚᱠᱟ ᱮᱞ ᱦᱤᱡᱩᱜᱼᱟ?"', answer_hin: '15 = ᱑᱕ (ᱜᱮᱞ ᱢᱚᱬᱮ)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱕' },
      { question_hin: '"10 से ठीक पहले क्या आता है?"', question_sat: '"᱑᱐ ᱞᱟᱦᱟ ᱨᱮ ᱚᱠᱟ ᱮᱞ ᱦᱤᱡᱩᱜᱼᱟ?"', answer_hin: '9 = ᱙ (ᱟᱨᱮ)', answer_sat: 'ᱛᱮᱞᱟ: ᱙' },
    ],
  },

  // ----------------------------------------------------------
  // CLASS 2 — LITERACY (4 TOPICS)
  // ----------------------------------------------------------

  'Class 2||Literacy||0': {
    title_hin: 'धाराप्रवाह पठन — अज्ञात पाठ से 45 शब्द/मिनट (ᱢᱟᱦᱟᱫ ᱯᱟᱲᱦᱟᱣ ᱔᱕)',
    title_sat: 'ᱢᱟᱦᱟᱫ ᱯᱟᱲᱦᱟᱣ — ᱔᱕ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ ᱵᱩᱡᱷᱟᱹᱣ ᱥᱟᱶ',
    grade: 'Class 2', subject: 'Foundational Literacy',
    topic: 'Reading Fluency: 45 Words/Min from Unknown Text',
    nipun_target: 'NIPUN Lakshya (Class 2): Child reads an age-appropriate unknown text at minimum 45 correct words per minute with reading comprehension.',
    materials: ['Grade 2 story passage (8–10 sentences)', 'Stopwatch/timer', 'Comprehension question cards'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक आदर्श वाचन (Model Reading) करें: "आज हम एक नई संथाली कहानी पढ़ेंगे — स्पष्ट और सही गति के साथ। सब बच्चे उंगली से शब्द ट्रैक करें।"', sat: 'ᱢᱟᱪᱮᱛ ᱢᱳᱰᱮᱞ ᱯᱟᱲᱦᱟᱣ ᱩᱫᱩᱜ ᱢᱮ: "ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱱᱟᱣᱟ ᱠᱟᱹᱦᱱᱤ ᱥᱟᱹᱦᱤᱡ ᱛᱮ ᱵᱚᱱ ᱯᱟᱲᱦᱟᱣᱟ᱾"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'पठन तकनीक सिखाएं:\n• पूर्णविराम (।) पर थोड़ा रुकना\n• शब्दों को तोड़कर नहीं, पूरे वाक्य को अर्थ के साथ पढ़ना\n• कठिन शब्द आने पर रुककर अक्षर मिलाना\nलक्ष्य: 1 मिनट में 45 शब्द बिना अटके।', sat: 'ᱯᱟᱲᱦᱟᱣ ᱦᱩᱱᱟᱹᱨ ᱪᱮᱫ:\n• ᱢᱩᱪᱟᱹᱫ (।) ᱨᱮ ᱛᱷᱟᱠᱮᱫ ᱛᱤᱸᱜᱩᱱ\n• ᱟᱹᱭᱟᱹᱛ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱵᱩᱡᱷᱟᱹᱣ ᱥᱟᱶ ᱯᱟᱲᱦᱟᱣ\n• ᱴᱟᱨᱜᱮᱴ: ᱑ ᱢᱤᱱᱤᱴ ᱨᱮ ᱔᱕ ᱟᱹᱲᱟᱹ ᱥᱟᱹᱦᱤᱡ ᱯᱟᱲᱦᱟᱣ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'जोड़ी पठन (Paired Reading): एक बच्चा 1 मिनट टाइमर के साथ पढ़े, दूसरा बच्चा सुने और पढ़े गए शब्दों की गिनती करे। फिर भूमिका बदलें।', sat: 'ᱡᱩᱲᱤ ᱯᱟᱲᱦᱟᱣ: ᱢᱤᱫ ᱜᱤᱫᱽᱨᱟᱹ ᱑ ᱢᱤᱱᱤᱴ ᱯᱟᱲᱦᱟᱣᱟᱭ, ᱫᱚᱥᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱹᱲᱟᱹ ᱞᱮᱠᱷᱟᱭᱟᱭ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'पढ़ी गई कहानी से 3 बोध प्रश्नों के उत्तर संथाली में देना: "कहानी में मुख्य पात्र कौन था?"', sat: 'ᱯᱟᱲᱦᱟᱣ ᱠᱟᱛᱮ ᱓ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ: "ᱠᱟᱹᱦᱱᱤ ᱨᱮ ᱢᱩᱬᱩᱛ ᱦᱚᱲ ᱚᱠᱚᱭ?"' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर कहानी को 3 बार पढ़कर अपनी पढ़ने की गति में सुधार करें।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱱᱚᱣᱟ ᱠᱟᱹᱦᱱᱤ ᱓ ᱫᱷᱟᱣ ᱯᱟᱲᱦᱟᱣ ᱠᱟᱛᱮ ᱜᱟᱹᱛ ᱵᱟᱲᱦᱟᱣ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '1 मिनट में बच्चे ने कितने सही शब्द पढ़े? (ORF टेस्ट)', question_sat: '᱑ ᱢᱤᱱᱤᱴ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱹᱦᱤᱡ ᱟᱹᱲᱟᱹ ᱯᱟᱲᱦᱟᱣ ᱮᱱᱟ?', answer_hin: 'Target: 45+ Words/Min = NIPUN Grade 2 Pass ✅', answer_sat: 'ᱴᱟᱨᱜᱮᱴ: ᱔᱕+ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ = NIPUN ✅' },
      { question_hin: 'कहानी के आधार पर बताओ: "सुनिता कहाँ जा रही थी?"', question_sat: 'ᱠᱟᱹᱦᱱᱤ ᱞᱮᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ: "ᱥᱩᱱᱤᱛᱟ ᱚᱠᱟ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ?"', answer_hin: 'स्कूल / हाट जा रही थी', answer_sat: 'ᱛᱮᱞᱟ: ᱤᱥᱠᱩᱞ / ᱦᱟᱴ ᱛᱮ' },
      { question_hin: 'कहानी का मुख्य संदेश 1 वाक्य में बताओ', question_sat: 'ᱠᱟᱹᱦᱱᱤ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱠᱟᱛᱷᱟ ᱢᱤᱫ ᱟᱹᱭᱟᱹᱛ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: 'Open-ended comprehension response', answer_sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱟᱡᱟᱜ ᱟᱲᱟᱝ ᱛᱮ ᱥᱟᱨᱟᱝᱥᱚ ᱞᱟᱹᱭᱟ' },
    ],
  },

  'Class 2||Literacy||1': {
    title_hin: 'सोहराय पर्व की कहानी और पठन (ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ ᱠᱟᱹᱦᱱᱤ)',
    title_sat: 'ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ — ᱥᱟᱱᱛᱟᱲᱤ ᱥᱟᱶᱛᱟ ᱟᱨ ᱞᱟᱠᱪᱟᱨ',
    grade: 'Class 2', subject: 'Foundational Literacy',
    topic: 'Sohrai Festival Story Reading',
    nipun_target: 'NIPUN Lakshya (Class 2): Child reads cultural texts with comprehension, explains harvest festival traditions and writes 3 sentences on Sohrai in Ol Chiki.',
    materials: ['Sohrai wall-art paintings picture', 'Story text in Ol Chiki', 'Crayons for drawing cattle art'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक सोहराय चित्र दिखाकर पूछें: "हमारे गाँव में सोहराय पर गाय-बैलों को कैसे सजाते हैं? दीवारों पर क्या बनाते हैं?" बच्चे अपने अनुभव बताएं।', sat: 'ᱢᱟᱪᱮᱛ ᱥᱚᱦᱨᱟᱭ ᱪᱤᱛᱟᱹᱨ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱥᱚᱦᱨᱟᱭ ᱨᱮ ᱜᱟᱹᱭ-ᱠᱟᱰᱟ ᱪᱮᱫ ᱞᱮᱠᱟ ᱵᱚᱱ ᱥᱟᱡᱟᱣ ᱠᱚᱣᱟ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'सोहराय पाठ का सस्वर वाचन:\n"ᱥᱚᱦᱨᱟᱭ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱢᱟᱨᱟᱝ ᱯᱟᱨᱟᱵᱽ ᱠᱟᱱᱟ᱾\nᱱᱚᱣᱟ ᱫᱚ ᱫᱟᱥᱟᱸᱭ ᱛᱟᱭᱚᱢ ᱦᱩᱭᱩᱜᱼᱟ᱾\nᱜᱟᱹᱭ-ᱠᱟᱰᱟ ᱠᱚ ᱛᱩᱯᱩ ᱠᱟᱛᱮ ᱥᱟᱡᱟᱣ ᱠᱚᱣᱟ᱾\nᱚᱲᱟᱜ ᱵᱷᱤᱛ ᱨᱮ ᱪᱚᱨᱚᱠ ᱪᱤᱛᱟᱹᱨ ᱠᱚ ᱵᱮᱱᱟᱣᱟ᱾\nᱡᱚᱛᱚ ᱦᱚᱲ ᱢᱤᱞᱟᱹᱣ ᱠᱟᱛᱮ ᱠᱚ ᱮᱱᱮᱡ-ᱥᱮᱨᱮᱧᱟ᱾"', sat: 'ᱯᱟᱲᱦᱟᱣ ᱢᱮ:\nᱥᱚᱦᱨᱟᱭ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱢᱟᱨᱟᱝ ᱯᱟᱨᱟᱵᱽ ᱠᱟᱱᱟ᱾ ᱜᱟᱹᱭ-ᱠᱟᱰᱟ ᱠᱚ ᱥᱟᱡᱟᱣ ᱠᱚᱣᱟ ᱟᱨ ᱵᱷᱤᱛ ᱨᱮ ᱪᱤᱛᱟᱹᱨ ᱠᱚ ᱚᱞᱟ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'पाठ से कठिन शब्दों का उच्चारण और अर्थ अभ्यास:\n• ᱯᱟᱨᱟᱵᱽ (Parab = पर्व/त्योहार)\n• ᱜᱟᱹᱭ-ᱠᱟᱰᱟ (Gay-Kada = गाय-बैल)\n• ᱵᱷᱤᱛ ᱪᱤᱛᱟᱹᱨ (Bhit Chitar = दीवार चित्र/Wall Art)\n• ᱮᱱᱮᱡ-ᱥᱮᱨᱮᱧ (Enej-Sereng = नाच-गान)', sat: 'ᱟᱹᱲᱟᱹ ᱟᱵᱷᱭᱟᱥ:\n• ᱯᱟᱨᱟᱵᱽ (Festival)\n• ᱵᱷᱤᱛ ᱪᱤᱛᱟᱹᱨ (Wall Painting)\n• ᱮᱱᱮᱡ-ᱥᱮᱨᱮᱧ (Dance and Song)' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बच्चे सोहराय पर अपनी पसंद का 1 दीवार चित्र (ᱵᱷᱤᱛ ᱪᱤᱛᱟᱹᱨ) स्लेट पर बनाएं और 1 वाक्य ओल चिकी में लिखें।', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱥᱚᱦᱨᱟᱭ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱢᱤᱫ ᱟᱹᱭᱟᱹᱛ ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर जाकर दादी से पूछें कि सोहराय के पहले दिन क्या करते हैं (ᱜᱚᱰ ᱯᱩᱡᱟ)। कल कक्षा में बताएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱵᱩᱰᱷᱤ ᱟᱭᱳ ᱠᱩᱞᱤᱭᱮ ᱢᱮ ᱥᱚᱦᱨᱟᱭ ᱯᱩᱭᱞᱩ ᱢᱟᱦᱟᱸ ᱪᱮᱫ ᱠᱚ ᱪᱤᱠᱟᱹᱭᱟ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"सोहराय पर्व में किनकी पूजा और सेवा की जाती है?"', question_sat: '"ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ ᱨᱮ ᱚᱠᱚᱭ ᱠᱚ ᱥᱮᱵᱟ ᱟᱨ ᱯᱩᱡᱟᱹ ᱠᱚᱣᱟ?"', answer_hin: 'गाय-बैलों की = ᱜᱟᱹᱭ-ᱠᱟᱰᱟ (Gay-Kada)', answer_sat: 'ᱛᱮᱞᱟ: ᱜᱟᱹᱭ-ᱠᱟᱰᱟ ᱠᱚ' },
      { question_hin: '"सोहराय के समय घर की दीवारों पर क्या बनाया जाता है?"', question_sat: '"ᱥᱚᱦᱨᱟᱭ ᱚᱠᱛᱚ ᱚᱲᱟᱜ ᱵᱷᱤᱛ ᱨᱮ ᱪᱮᱫ ᱠᱚ ᱵᱮᱱᱟᱣᱟ?"', answer_hin: 'दीवार चित्र = ᱵᱷᱤᱛ ᱪᱤᱛᱟᱹᱨ (Sohrai Art)', answer_sat: 'ᱛᱮᱞᱟ: ᱵᱷᱤᱛ ᱪᱤᱛᱟᱹᱨ' },
      { question_hin: '"ᱯᱟᱨᱟᱵᱽ का हिंदी अर्थ क्या है?"', question_sat: '"ᱯᱟᱨᱟᱵᱽ ᱟᱹᱲᱟᱹ ᱨᱮᱱᱟᱜ ᱦᱤᱱᱫᱤ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?"', answer_hin: 'त्योहार / पर्व (Festival)', answer_sat: 'ᱛᱮᱞᱟ: ᱛᱭᱳᱦᱟᱨ (Festival)' },
    ],
  },

  'Class 2||Literacy||2': {
    title_hin: 'विलोम (विपरीत) शब्द युग्म — संथाली और हिंदी (ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ)',
    title_sat: 'ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ ᱡᱩᱲᱤ ᱪᱮᱫᱚᱜ ᱟᱨ ᱵᱮᱵᱷᱟᱨ',
    grade: 'Class 2', subject: 'Foundational Literacy',
    topic: 'Opposites Vocabulary Pairs',
    nipun_target: 'NIPUN Lakshya (Class 2): Child matches and uses at least 8 opposite word pairs (antonyms) in spoken sentences and written Ol Chiki.',
    materials: ['Opposite flashcard matching pairs', 'Pictorial comparison cards', 'Pocket chart'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक दिन और रात का चित्र दिखाएं: "सूरज निकला तो दिन (ᱢᱟᱦᱟᱸ), चांद निकला तो रात (ᱧᱤᱫᱟᱹ)। यह एक-दूसरे के उल्टे (विलोम) शब्द हैं!"', sat: 'ᱢᱟᱪᱮᱛ ᱢᱟᱦᱟᱸ ᱟᱨ ᱧᱤᱫᱟᱹ ᱪᱤᱛᱟᱹᱨ ᱩᱫᱩᱜ ᱢᱮ: "ᱢᱟᱦᱟᱸ ᱟᱨ ᱧᱤᱫᱟᱹ ᱫᱚ ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ ᱠᱟᱱᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '6 मुख्य विलोम शब्द युग्म सिखाएं:\n• दिन (ᱢᱟᱦᱟᱸ) ↔ रात (ᱧᱤᱫᱟᱹ)\n• बड़ा (ᱢᱟᱨᱟᱝ) ↔ छोटा (ᱦᱩᱰᱤᱧ)\n• गर्म (ᱞᱚᱞᱚ) ↔ ठंडा (ᱨᱮᱭᱟᱲ)\n• आना (ᱦᱤᱡᱩᱜ) ↔ जाना (ᱥᱮᱱᱚᱜ)\n• ऊपर (ᱪᱮᱛᱟᱱ) ↔ नीचे (ᱞᱟᱛᱟᱨ)\n• तेज (ᱞᱚᱜᱚᱱ) ↔ धीरे (ᱵᱟᱹᱭ-ᱵᱟᱹᱭ)', sat: '᱖ ᱢᱩᱬᱩᱛ ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ:\n• ᱢᱟᱦᱟᱸ (Day) ↔ ᱧᱤᱫᱟᱹ (Night)\n• ᱢᱟᱨᱟᱝ (Big) ↔ ᱦᱩᱰᱤᱧ (Small)\n• ᱞᱚᱞᱚ (Hot) ↔ ᱨᱮᱭᱟᱲ (Cold)\n• ᱦᱤᱡᱩᱜ (Come) ↔ ᱥᱮᱱᱚᱜ (Go)\n• ᱪᱮᱛᱟᱱ (Up) ↔ ᱞᱟᱛᱟᱨ (Down)' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'विलोम कार्ड मिलान खेल: शिक्षक ᱢᱟᱨᱟᱝ कार्ड दिखाएं, बच्चे दौड़कर ᱦᱩᱰᱤᱧ कार्ड खोजकर उसके पास खड़े हों।', sat: 'ᱠᱟᱨᱰ ᱡᱚᱲᱟᱣ ᱠᱷᱮᱞᱳᱰ: ᱢᱟᱪᱮᱛ "ᱞᱚᱞᱚ" ᱩᱫᱩᱜ ᱠᱷᱟᱱ ᱜᱤᱫᱽᱨᱟᱹ "ᱨᱮᱭᱟᱲ" ᱠᱟᱨᱰ ᱯᱟᱱᱛᱮ ᱧᱟᱢ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'वाक्य में विलोम शब्द का प्रयोग: "ᱫᱟᱜ ᱫᱚ ᱞᱚᱞᱚ ᱜᱮᱭᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱵᱚᱨᱚᱯᱷ ᱫᱚ ᱨᱮᱭᱟᱲ ᱜᱮᱭᱟ।"', sat: 'ᱟᱹᱭᱟᱹᱛ ᱨᱮ ᱵᱮᱵᱷᱟᱨ: "ᱫᱟᱜ ᱫᱚ ᱞᱚᱞᱚ ᱜᱮᱭᱟ, ᱟᱨ ᱦᱚᱭ ᱫᱚ ᱨᱮᱭᱟᱲ ᱜᱮᱭᱟ᱾"' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'स्लेट पर 4 विलोम शब्द जोड़ियां ओल चिकी में लिखकर लाएं।', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱔ ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ ᱡᱩᱲᱤ ᱚᱞ ᱠᱟᱛᱮ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"ᱞᱚᱞᱚ (गर्म) का विलोम शब्द संथाली में क्या है?"', question_sat: '"ᱞᱚᱞᱚ ᱨᱮᱱᱟᱜ ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ ᱪᱮᱫ?"', answer_hin: 'ᱨᱮᱭᱟᱲ (Reyar = ठंडा)', answer_sat: 'ᱛᱮᱞᱟ: ᱨᱮᱭᱟᱲ' },
      { question_hin: '"ᱪᱮᱛᱟᱱ (ऊपर) का उल्टा क्या होता है?"', question_sat: '"ᱪᱮᱛᱟᱱ ᱨᱮᱱᱟᱜ ᱩᱞᱴᱟᱹ ᱪᱮᱫ ᱠᱟᱱᱟ?"', answer_hin: 'ᱞᱟᱛᱟᱨ (Latar = नीचे)', answer_sat: 'ᱛᱮᱞᱟ: ᱞᱟᱛᱟᱨ' },
      { question_hin: '"ᱢᱟᱦᱟᱸ (दिन) का उल्टा संथाली में बताओ"', question_sat: '"ᱢᱟᱦᱟᱸ ᱨᱮᱱᱟᱜ ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱧᱤᱫᱟᱹ (Nhinda = रात)', answer_sat: 'ᱛᱮᱞᱟ: ᱧᱤᱫᱟᱹ' },
    ],
  },

  'Class 2||Literacy||3': {
    title_hin: 'मेरे गाँव पर 3–5 वाक्य रचना (ᱟᱹᱛᱩ ᱵᱟᱵᱚᱛ ᱚᱞ)',
    title_sat: 'ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱵᱟᱵᱚᱛ ᱯᱮ-ᱢᱚᱬᱮ ᱟᱹᱭᱟᱹᱛ ᱚᱞ',
    grade: 'Class 2', subject: 'Foundational Literacy',
    topic: 'Writing 3–5 Sentences About My Village',
    nipun_target: 'NIPUN Lakshya (Class 2): Child writes 3–5 coherent sentences about their village/home using correct Ol Chiki script and word spacing.',
    materials: ['Village scene picture chart', 'Lined writing sheets', 'Sentence frame cards'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक गाँव का चित्र दिखाएं: "हमारे गाँव का नाम क्या है? गाँव में नदी, पहाड़, पेड़ और स्कूल कहाँ हैं?" बच्चे बातचीत करें।', sat: 'ᱢᱟᱪᱮᱛ ᱟᱹᱛᱩ ᱪᱤᱛᱟᱹᱨ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱪᱮᱫ? ᱟᱹᱛᱩ ᱨᱮ ᱪᱮᱫ ᱪᱮᱫ ᱢᱮᱱᱟᱜᱼᱟ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '3 वाक्य संरचना सिखाएं (वाक्य ढांचा):\n1) "ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱫᱚ ___ ᱠᱟᱱᱟ।" (मेरे गाँव का नाम ___ है)\n2) "ᱟᱞᱮ ᱟᱹᱛᱩ ᱨᱮ ᱢᱤᱫ ᱪᱚᱨᱚᱠ ᱤᱥᱠᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ।" (हमारे गाँव में एक सुंदर स्कूल है)\n3) "ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱤᱧ ᱟᱹᱰᱤ ᱠᱩᱥᱤᱭᱟᱜᱼᱟ।" (मुझे अपना गाँव बहुत पसंद है)', sat: '᱓ ᱟᱹᱭᱟᱹᱛ ᱚᱞ ᱪᱮᱫ ᱢᱮ:\n᱑) ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱫᱚ ___ ᱠᱟᱱᱟ᱾\n᱒) ᱟᱞᱮ ᱟᱹᱛᱩ ᱨᱮ ᱢᱤᱫ ᱤᱥᱠᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ᱾\n᱓) ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱤᱧ ᱟᱹᱰᱤ ᱠᱩᱥᱤᱭᱟᱜᱼᱟ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'रिक्त स्थान पूर्ति से वाक्य बनाना: बच्चे खाली जगह में अपने गाँव का नाम और पसंदीदा जगह भरकर स्लेट पर लिखें।', sat: 'ᱠᱷᱟᱹᱞᱤ ᱡᱟᱭᱜᱟ ᱯᱮᱨᱮᱡ ᱠᱟᱛᱮ ᱟᱹᱭᱟᱹᱛ ᱵᱮᱱᱟᱣ ᱢᱮ ᱟᱨ ᱥᱞᱮᱴ ᱨᱮ ᱚᱞ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'अपनी कॉपी में "ᱤᱧᱟᱜ ᱟᱹᱛᱩ" (मेरा गाँव) शीर्षक डालकर 3 पूरे वाक्य सही ओल चिकी में लिखना।', sat: 'ᱠᱷᱟᱛᱟ ᱨᱮ "ᱤᱧᱟᱜ ᱟᱹᱛᱩ" ᱵᱟᱵᱚᱛ ᱯᱮ ᱥᱟᱹᱦᱤᱡ ᱟᱹᱭᱟᱹᱛ ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'अपने लिखे हुए वाक्यों के साथ अपने गाँव का एक छोटा चित्र बनाकर लाएं।', sat: 'ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱪᱚᱨᱚᱠ ᱪᱤᱛᱟᱹᱨ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"मेरे गाँव का नाम ___ है" को संथाली में बोलो और लिखो', question_sat: '"ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱫᱚ ___ ᱠᱟᱱᱟ" ᱥᱟᱹᱦᱤᱡ ᱚᱞ ᱢᱮ', answer_hin: 'ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱫᱚ [गाँव का नाम] ᱠᱟᱱᱟ᱾', answer_sat: 'ᱛᱮᱞᱟ: ᱤᱧᱟᱜ ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱫᱚ ___ ᱠᱟᱱᱟ᱾' },
      { question_hin: 'वाक्य के अंत में कौन सा विराम चिह्न लगाते हैं?', question_sat: 'ᱟᱹᱭᱟᱹᱛ ᱢᱩᱪᱟᱹᱫ ᱨᱮ ᱪᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱞᱟᱜᱟᱣᱜᱼᱟ?', answer_hin: 'पूर्णविराम (।) = ᱢᱩᱪᱟᱹᱫ ᱪᱤᱱᱦᱟᱹ', answer_sat: 'ᱛᱮᱞᱟ: ᱢᱩᱪᱟᱹᱫ (।)' },
      { question_hin: 'गाँव में नदी को संथाली में क्या कहते हैं?', question_sat: 'ᱟᱹᱛᱩ ᱨᱮ ᱱᱟᱹᱭ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ?', answer_hin: 'ᱜᱟᱰᱟ (Gada = नदी)', answer_sat: 'ᱛᱮᱞᱟ: ᱜᱟᱰᱟ' },
    ],
  },

  // ----------------------------------------------------------
  // CLASS 2 — NUMERACY (5 TOPICS)
  // ----------------------------------------------------------

  'Class 2||Numeracy||0': {
    title_hin: 'स्थानीय मान — दहाई और इकाई 99 तक (ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ)',
    title_sat: 'ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ ᱴᱷᱟᱶ ᱢᱟᱱ ᱙᱙ ᱫᱷᱟᱹᱵᱤᱡ',
    grade: 'Class 2', subject: 'Foundational Numeracy',
    topic: 'Place Value: Tens and Ones up to 99',
    nipun_target: 'NIPUN Lakshya (Class 2): Child represents 2-digit numbers up to 99 as Tens (ᱜᱮᱞ) and Ones (ᱢᱤᱫ) using bundled sticks and place value chart.',
    materials: ['Bundled sticks (10s bundles) and single sticks', 'Place value chart (ᱜᱮᱞ | ᱢᱤᱫ)', 'Number cards 10–99'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक 23 तीलियां निकालें: "इन्हें जल्दी कैसे गिनें? 10-10 के 2 बंडल + 3 खुली तीलियां = 2 दहाई 3 इकाई!"', sat: 'ᱢᱟᱪᱮᱛ ᱒᱓ ᱠᱟᱹᱴᱷᱤ ᱩᱫᱩᱜ ᱢᱮ: "᱑᱐ ᱨᱮᱱᱟᱜ ᱒ ᱵᱚᱱᱰᱤᱞ + ᱓ ᱠᱟᱹᱴᱷᱤ = ᱒ ᱜᱮᱞ ᱓ ᱢᱤᱫ = ᱒᱓!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'स्थानीय मान चार्ट समझाएं:\n| ᱜᱮᱞ (दहाई/Tens) | ᱢᱤᱫ (इकाई/Ones) |\n| 2 | 3 | = 23 (᱒᱓)\n\n• 47 = 4 ᱜᱮᱞ + 7 ᱢᱤᱫ (᱔᱗ = ᱔ ᱜᱮᱞ + ᱗ ᱢᱤᱫ)\n• 60 = 6 ᱜᱮᱞ + 0 ᱢᱤᱫ (᱖᱐ = ᱖ ᱜᱮᱞ + ᱐ ᱢᱤᱫ)\n• 85 = 8 ᱜᱮᱞ + 5 ᱢᱤᱫ (᱘᱕ = ᱘ ᱜᱮᱞ + ᱕ ᱢᱤᱫ)', sat: 'ᱴᱷᱟᱶ ᱢᱟᱱ ᱪᱟᱨᱴ:\n| ᱜᱮᱞ (Tens) | ᱢᱤᱫ (Ones) |\n| ᱒ | ᱓ | = ᱒᱓\n\n• ᱔᱗ = ᱔ ᱜᱮᱞ + ᱗ ᱢᱤᱫ\n• ᱖᱐ = ᱖ ᱜᱮᱞ + ᱐ ᱢᱤᱫ\n• ᱘᱕ = ᱘ ᱜᱮᱞ + ᱕ ᱢᱤᱫ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'बंडल तोड़ना और जोड़ना: शिक्षक संख्या बोलें "54", बच्चे लिखें "5 दहाई + 4 इकाई" = ᱕ ᱜᱮᱞ + ᱔ ᱢᱤᱫ।', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱚᱞ ᱢᱮ: ᱕᱔ = ᱕ ᱜᱮᱞ + ᱔ ᱢᱤᱫ; ᱓᱖ = ᱓ ᱜᱮᱞ + ᱖ ᱢᱤᱫ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'हाट में ₹75 के लिए ₹10-10 के 7 नोट (7 दहाई) और ₹1-1 के 5 सिक्के (5 इकाई) का हिसाब लगाना।', sat: 'ᱦᱟᱴ ᱨᱮ ᱗᱕ ᱴᱟᱠᱟ ᱞᱟᱹᱜᱤᱫ ᱑᱐ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱗ ᱱᱳᱴ + ᱕ ᱥᱤᱠᱟᱹ ᱦᱤᱥᱟᱹᱵᱽ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर 34, 58, 72, 91 संख्याओं का दहाई और इकाई तोड़कर चार्ट बनाकर लाएं।', sat: 'ᱚᱲᱟᱜ ᱠᱷᱚᱱ ᱓᱔, ᱕᱘, ᱗᱒ ᱮᱞ ᱠᱚ ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱚᱞ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"68 में कितनी दहाई (ᱜᱮᱞ) और कितनी इकाई (ᱢᱤᱫ) हैं?"', question_sat: '"᱖᱘ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱜᱮᱞ ᱟᱨ ᱛᱤᱱᱟᱹᱜ ᱢᱤᱫ ᱢᱮᱱᱟᱜᱼᱟ?"', answer_hin: '6 दहाई + 8 इकाई (᱖ ᱜᱮᱞ + ᱘ ᱢᱤᱫ)', answer_sat: 'ᱛᱮᱞᱟ: ᱖ ᱜᱮᱞ + ᱘ ᱢᱤᱫ' },
      { question_hin: '"5 दहाई और 0 इकाई से कौन सी संख्या बनेगी?"', question_sat: '"᱕ ᱜᱮᱞ ᱟᱨ ᱐ ᱢᱤᱫ ᱡᱚᱲᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: '50 = ᱕᱐ (ᱢᱚᱬᱮ ᱜᱮᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱕᱐' },
      { question_hin: '"94 में 9 का स्थानीय मान क्या है?"', question_sat: '"᱙᱔ ᱨᱮ ᱙ ᱨᱮᱱᱟᱜ ᱴᱷᱟᱶ ᱢᱟᱱ ᱪᱮᱫ?"', answer_hin: '90 = 9 दहाई (᱙ ᱜᱮᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱙᱐ (᱙ ᱜᱮᱞ)' },
    ],
  },

  'Class 2||Numeracy||1': {
    title_hin: '2-अंकीय जोड़ — बिना हासिल (ᱵᱟᱨ ᱮᱞ ᱡᱚᱲᱟᱣ ᱵᱤᱱ ᱦᱟᱥᱤᱞ)',
    title_sat: 'ᱵᱟᱨ ᱮᱞ ᱮᱞᱠᱷᱟ ᱡᱚᱲᱟᱣ ᱙᱙ ᱫᱷᱟᱹᱵᱤᱡ',
    grade: 'Class 2', subject: 'Foundational Numeracy',
    topic: '2-Digit Addition without Regrouping',
    nipun_target: 'NIPUN Lakshya (Class 2): Child adds two 2-digit numbers (up to 99) without regrouping using column addition method.',
    materials: ['Column addition grid slates', 'Place value mat', 'Tens/Ones blocks'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'समस्या: "कक्षा 2 में 24 लड़के और 32 लड़कियाँ हैं। कुल कितने बच्चे हैं?" 24 + 32 = ?', sat: 'ᱠᱟᱹᱦᱱᱤ: "ᱠᱞᱟᱥ ᱨᱮ ᱒᱔ ᱠᱚᱲᱟ ᱟᱨ ᱓᱒ ᱠᱩᱲᱤ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ᱾ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ?" ᱒᱔ + ᱓᱒ = ?' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'कॉलम विधि (इकाई में इकाई, दहाई में दहाई जोड़ना):\n```\n  ᱜᱮᱞ (द) | ᱢᱤᱫ (इ)\n     2    |    4\n  +  3    |    2\n  --------|-------\n     5    |    6   = 56 (᱕᱖)\n```\n1) पहले इकाई जोड़ो: 4 + 2 = 6\n2) फिर दहाई जोड़ो: 2 + 3 = 5', sat: 'ᱠᱳᱞᱚᱢ ᱵᱤᱫᱷᱤ:\n  ᱜᱮᱞ | ᱢᱤᱫ\n   ᱒  |  ᱔\n+  ᱓  |  ᱒\n------|-----\n   ᱕  |  ᱖  = ᱕᱖\nᱯᱩᱭᱞᱩ ᱢᱤᱫ ᱡᱚᱲᱟᱣ: ᱔ + ᱒ = ᱖; ᱛᱟᱭᱚᱢ ᱜᱮᱞ ᱡᱚᱲᱟᱣ: ᱒ + ᱓ = ᱕᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर हल करें:\n1) 43 + 25 = 68 (᱔᱓ + ᱒᱕ = ᱖᱘)\n2) 51 + 37 = 88 (᱕᱑ + ᱓᱗ = ᱘᱘)\n3) 62 + 16 = 78 (᱖᱒ + ᱑᱖ = ᱗᱘)', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ:\n᱑) ᱔᱓ + ᱒᱕ = ᱖᱘\n᱒) ᱕᱑ + ᱓᱗ = ᱘᱘\n᱓) ᱖᱒ + ᱑᱖ = ᱗᱘' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'बाजार हिसाब: ₹45 का चावल + ₹23 की दाल = कुल कितने रुपये? 45 + 23 = ₹68 (᱖᱘ ᱴᱟᱠᱟ)।', sat: 'ᱦᱟᱴ ᱦᱤᱥᱟᱹᱵᱽ: ᱔᱕ ᱴᱟᱠᱟ ᱪᱟᱣᱞᱮ + ᱒᱓ ᱴᱟᱠᱟ ᱫᱟᱹᱞ = ᱖᱘ ᱴᱟᱠᱟ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'गृहकार्य: अपनी कॉपी में 35+24, 42+36, 60+28 के 3 सवाल हल करके लाएं।', sat: 'ᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ: ᱓᱕+᱒᱔, ᱔᱒+᱓᱖, ᱖᱐+᱒᱘ ᱠᱷᱟᱛᱟ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"34 + 23 = ?" कॉलम में जोड़कर बताओ', question_sat: '"᱓᱔ + ᱒᱓ = ?" ᱠᱳᱞᱚᱢ ᱛᱮ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: '57 = ᱕᱗', answer_sat: 'ᱛᱮᱞᱟ: ᱕᱗' },
      { question_hin: 'जोड़ते समय पहले किस तरफ से जोड़ते हैं — इकाई या दहाई?', question_sat: 'ᱡᱚᱲᱟᱣ ᱚᱠᱛᱚ ᱯᱩᱭᱞᱩ ᱚᱠᱟ ᱥᱮᱫ ᱠᱷᱚᱱ ᱡᱚᱲᱟᱣᱟ — ᱢᱤᱫ ᱥᱮ ᱜᱮᱞ?', answer_hin: 'इकाई से (ᱢᱤᱫ ᱥᱮᱫ ᱠᱷᱚᱱ)', answer_sat: 'ᱛᱮᱞᱟ: ᱢᱤᱫ ᱥᱮᱫ ᱠᱷᱚᱱ' },
      { question_hin: '"50 + 40 कितना होता है?"', question_sat: '"᱕᱐ + ᱔᱐ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: '90 = ᱙᱐ (Are Gel)', answer_sat: 'ᱛᱮᱞᱟ: ᱙᱐' },
    ],
  },

  'Class 2||Numeracy||2': {
    title_hin: '2-अंकीय घटाव — हासिल के साथ (ᱵᱟᱨ ᱮᱞ ᱜᱷᱟᱴᱟᱣ ᱦᱟᱥᱤᱞ ᱥᱟᱶ)',
    title_sat: 'ᱵᱟᱨ ᱮᱞ ᱮᱞᱠᱷᱟ ᱜᱷᱟᱴᱟᱣ ᱦᱟᱥᱤᱞ ᱥᱟᱶ',
    grade: 'Class 2', subject: 'Foundational Numeracy',
    topic: '2-Digit Subtraction with Regrouping',
    nipun_target: 'NIPUN Lakshya (Class 2): Child subtracts 2-digit numbers with regrouping (borrowing from tens) accurately using column method.',
    materials: ['Bundled sticks (untying bundle demonstration)', 'Base 10 blocks', 'Subtraction slates'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'समस्या: "रोहन के पास 52 रुपये थे। उसने 27 रुपये की किताब खरीदी। अब कितने रुपये बचे?" 52 - 27 = ? 2 में से 7 कैसे घटाएं?', sat: 'ᱠᱟᱹᱦᱱᱤ: "᱕᱒ ᱴᱟᱠᱟ ᱠᱷᱚᱱ ᱒᱗ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱯᱩᱛᱷᱤ ᱠᱤᱨᱤᱧ ᱮᱱᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ? ᱒ ᱠᱷᱚᱱ ᱗ ᱪᱮᱫ ᱞᱮᱠᱟᱢ ᱜᱷᱟᱴᱟᱣᱟ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'दहाई से उधार (Regrouping) सिखाएं:\n1) इकाई में 2 में से 7 नहीं घट सकता।\n2) 5 दहाई में से 1 दहाई (10) उधार ली → दहाई बची 4।\n3) इकाई बन गई: 10 + 2 = 12।\n4) 12 - 7 = 5 (इकाई)\n5) 4 - 2 = 2 (दहाई)\nउत्तर = 25 (᱒᱕)', sat: 'ᱜᱮᱞ ᱠᱷᱚᱱ ᱦᱟᱥᱤᱞ ᱦᱟᱛᱟᱣ:\n᱑) ᱒ ᱠᱷᱚᱱ ᱗ ᱵᱟᱝ ᱜᱷᱟᱴᱟᱣᱜᱼᱟ᱾\n᱒) ᱕ ᱜᱮᱞ ᱠᱷᱚᱱ ᱑ ᱜᱮᱞ ᱦᱟᱛᱟᱣ ᱠᱷᱟᱱ ᱑᱐ + ᱒ = ᱑᱒ ᱦᱩᱭ ᱮᱱᱟ᱾\n᱓) ᱑᱒ - ᱗ = ᱕ ᱟᱨ ᱔ - ᱒ = ᱒᱾\nᱛᱮᱞᱟ = ᱒᱕᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर हल करें:\n• 63 - 28 = 35 (᱖᱓ - ᱒᱘ = ᱓᱕)\n• 71 - 36 = 35 (᱗᱑ - ᱓᱖ = ᱓᱕)\n• 84 - 49 = 35 (᱘᱔ - ᱔᱙ = ᱓᱕)', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ:\n• ᱖᱓ - ᱒᱘ = ᱓᱕\n• ᱗᱑ - ᱓᱖ = ᱓᱕\n• ᱘᱔ - ᱔᱙ = ᱓᱕' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'गाँव की समस्या: टोकरी में 65 आम थे। 38 आम बेच दिए। टोकरी में कितने आम बचे? 65 - 38 = 27 आम (᱒᱗ ᱩᱞ)।', sat: 'ᱟᱹᱛᱩ ᱮᱞᱠᱷᱟ: ᱖᱕ ᱩᱞ ᱠᱷᱚᱱ ᱓᱘ ᱟᱹᱠᱷᱨᱤᱧ ᱮᱱᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ? ᱒᱗ ᱩᱞ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'गृहकार्य: 53-27, 72-45, 90-36 के 3 सवाल कॉपी में हल करें।', sat: 'ᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ: ᱕᱓-᱒᱗, ᱗᱒-᱔᱕ ᱠᱷᱟᱛᱟ ᱨᱮ ᱦᱟᱹᱞ ᱠᱟᱛᱮ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"43 - 18 = ?" हासिल लेकर हल करो', question_sat: '"᱔᱓ - ᱑᱘ = ?" ᱦᱟᱥᱤᱞ ᱦᱟᱛᱟᱣ ᱠᱟᱛᱮ ᱦᱟᱹᱞ ᱢᱮ', answer_hin: '25 = ᱒᱕', answer_sat: 'ᱛᱮᱞᱟ: ᱒᱕' },
      { question_hin: 'जब 1 दहाई उधार लेते हैं, तो इकाई में कितना जुड़ता है?', question_sat: '᱑ ᱜᱮᱞ ᱦᱟᱥᱤᱞ ᱦᱟᱛᱟᱣ ᱠᱷᱟᱱ ᱢᱤᱫ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱡᱚᱲᱟᱣᱜᱼᱟ?', answer_hin: '10 (ᱜᱮᱞ)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱐ (ᱜᱮᱞ)' },
      { question_hin: '"60 - 25 कितना होगा?"', question_sat: '"᱖᱐ - ᱒᱕ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: '35 = ᱓᱕', answer_sat: 'ᱛᱮᱞᱟ: ᱓᱕' },
    ],
  },

  'Class 2||Numeracy||3': {
    title_hin: 'बार-बार जोड़ से गुणा की समझ (ᱫᱚᱦᱲᱟ ᱡᱚᱲᱟᱣ ᱠᱷᱚᱱ ᱜᱩᱬᱟᱹᱣ)',
    title_sat: 'ᱫᱚᱦᱲᱟ ᱡᱚᱲᱟᱣ ᱠᱷᱚᱱ ᱜᱩᱬᱟᱹᱣ ᱨᱮᱱᱟᱜ ᱮᱛᱚᱦᱚᱵ',
    grade: 'Class 2', subject: 'Foundational Numeracy',
    topic: 'Repeated Addition → Intro to Multiplication',
    nipun_target: 'NIPUN Lakshya (Class 2): Child explains multiplication as repeated addition of equal groups using concrete dot arrays (e.g., 3 + 3 + 3 + 3 = 4 × 3 = 12).',
    materials: ['Pebble/button grid arrays', 'Multiplication flashcards', 'Grouping plates'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक 4 प्लेटों में 2-2 बेर रखें: "कुल कितने बेर हैं? 2 + 2 + 2 + 2 = 8! इसे जल्दी बोलने का तरीका है: 4 बार 2 = 4 × 2 = 8!"', sat: 'ᱢᱟᱪᱮᱛ ᱔ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱒-᱒ ᱡᱚ ᱫᱚᱦᱚ ᱠᱟᱛᱮ: "᱒ + ᱒ + ᱒ + ᱒ = ᱘! ᱱᱚᱣᱟ ᱫᱚ ᱔ × ᱒ = ᱘ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'बार-बार जोड़ को गुणा चिह्न (×) से जोड़ना:\n• 3 + 3 + 3 = 3 बार 3 = 3 × 3 = 9 (᱓ × ᱓ = ᱙)\n• 5 + 5 + 5 + 5 = 4 बार 5 = 4 × 5 = 20 (᱔ × ᱕ = ᱒᱐)\n• 2 + 2 + 2 + 2 + 2 = 5 बार 2 = 5 × 2 = 10 (᱕ × ᱒ = ᱑᱐)', sat: 'ᱫᱚᱦᱲᱟ ᱡᱚᱲᱟᱣ ᱠᱷᱚᱱ ᱜᱩᱬᱟᱹᱣ (×):\n• ᱓ + ᱓ + ᱓ = ᱓ ᱫᱷᱟᱣ ᱓ = ᱓ × ᱓ = ᱙\n• ᱕ + ᱕ + ᱕ + ᱕ = ᱔ ᱫᱷᱟᱣ ᱕ = ᱔ × ᱕ = ᱒᱐\n• ᱒ + ᱒ + ᱒ + ᱒ + ᱒ = ᱕ ᱫᱷᱟᱣ ᱒ = ᱕ × ᱒ = ᱑᱐' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर जोड़ को गुणा में बदलो:\n1) 4 + 4 + 4 = 3 × 4 = 12\n2) 2 + 2 + 2 = 3 × 2 = 6\n3) 6 + 6 = 2 × 6 = 12', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱡᱚᱲᱟᱣ ᱠᱷᱚᱱ ᱜᱩᱬᱟᱹᱣ ᱨᱩᱯ ᱚᱞ ᱢᱮ:\n᱑) ᱔ + ᱔ + ᱔ = ᱓ × ᱔ = ᱑᱒\n᱒) ᱒ + ᱒ + ᱒ = ᱓ × ᱒ = ᱖' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'पौधारोपण समस्या: 5 क्यारियों में 3-3 पौधे लगाए। कुल कितने पौधे? 5 × 3 = 15 पौधे (᱑᱕ ᱫᱟᱨᱮ)।', sat: 'ᱫᱟᱨᱮ ᱨᱚᱦᱚᱭ: ᱕ ᱦᱟᱨ ᱨᱮ ᱓-᱓ ᱫᱟᱨᱮ ᱨᱚᱦᱚᱭ ᱮᱱᱟ᱾ ᱡᱚᱛᱚ ᱛᱮ ᱕ × ᱓ = ᱑᱕ ᱫᱟᱨᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर 3 कटोरियों में 4-4 चने रखकर 3 × 4 = 12 का प्रदर्शन माता-पिता को दिखाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱓ ᱵᱟᱹᱴᱤ ᱨᱮ ᱔-᱔ ᱪᱟᱱᱟ ᱫᱚᱦᱚ ᱠᱟᱛᱮ ᱓ × ᱔ = ᱑᱒ ᱩᱫᱩᱜ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"4 + 4 + 4 को गुणा में कैसे लिखेंगे?"', question_sat: '"᱔ + ᱔ + ᱔ ᱫᱚ ᱜᱩᱬᱟᱹᱣ ᱨᱩᱯ ᱛᱮ ᱪᱮᱫ ᱞᱮᱠᱟᱢ ᱚᱞᱟ?"', answer_hin: '3 × 4 = 12 (᱓ × ᱔ = ᱑᱒)', answer_sat: 'ᱛᱮᱞᱟ: ᱓ × ᱔ = ᱑᱒' },
      { question_hin: '"5 × 2 का मतलब क्या है?"', question_sat: '"᱕ × ᱒ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?"', answer_hin: '5 बार 2 का जोड़ (2+2+2+2+2 = 10)', answer_sat: 'ᱛᱮᱞᱟ: ᱕ ᱫᱷᱟᱣ ᱒ ᱡᱚᱲᱟᱣ (᱑᱐)' },
      { question_hin: '"3 बकरियों के कुल कितने पैर होंगे?"', question_sat: '"ᱯᱮ ᱢᱮᱨᱚᱢ ᱨᱮᱱ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱡᱟᱝᱜᱟ?"', answer_hin: '3 × 4 = 12 पैर (᱑᱒ ᱡᱟᱝᱜᱟ)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱒' },
    ],
  },

  'Class 2||Numeracy||4': {
    title_hin: 'भारतीय मुद्रा — सिक्के और नोटों का हिसाब (ᱴᱟᱠᱟ ᱞᱮᱠᱷᱟ)',
    title_sat: 'ᱵᱷᱟᱨᱚᱛ ᱴᱟᱠᱟ — ᱥᱤᱠᱟᱹ ᱟᱨ ᱱᱳᱴ ᱞᱮᱠᱷᱟ',
    grade: 'Class 2', subject: 'Foundational Numeracy',
    topic: 'Indian Coins & Rupee Calculations',
    nipun_target: 'NIPUN Lakshya (Class 2): Child identifies Indian coins (₹1, ₹2, ₹5, ₹10) and notes (₹10, ₹20, ₹50, ₹100) and calculates total money for simple purchases.',
    materials: ['Play currency coins and notes (₹1, ₹2, ₹5, ₹10, ₹20, ₹50)', 'Mock village market stall with priced items', 'Price tags'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक ₹10 का नोट और ₹5 का सिक्का दिखाएं: "हाट में यह लेकर जाओगे तो कुल कितने रुपये हैं? 10 + 5 = 15 रुपये (ᱴᱟᱠᱟ)!"', sat: 'ᱢᱟᱪᱮᱛ ᱑᱐ ᱴᱟᱠᱟ ᱱᱳᱴ + ᱕ ᱴᱟᱠᱟ ᱥᱤᱠᱟᱹ ᱩᱫᱩᱜ ᱢᱮ: "ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱴᱟᱠᱟ? ᱑᱕ ᱴᱟᱠᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'मुद्रा संयोजन सिखाएं:\n• ₹5 = ₹2 + ₹2 + ₹1\n• ₹10 = ₹5 + ₹5\n• ₹20 = ₹10 + ₹10\n• ₹50 = ₹20 + ₹20 + ₹10\n• ₹100 = ₹50 + ₹50', sat: 'ᱴᱟᱠᱟ ᱢᱮᱥᱟ ᱪᱮᱫ ᱢᱮ:\n• ᱕ ᱴᱟᱠᱟ = ᱒ + ᱒ + ᱑\n• ᱑᱐ ᱴᱟᱠᱟ = ᱕ + ᱕\n• ᱒᱐ ᱴᱟᱠᱟ = ᱑᱐ + ᱑᱐\n• ᱕᱐ ᱴᱟᱠᱟ = ᱒᱐ + ᱒᱐ + ᱑᱐' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'जोड़ी में हिसाब: शिक्षक मूल्य बोलें "₹35", बच्चे ₹20 + ₹10 + ₹5 के नोट/सिक्के चुनकर दिखाएं।', sat: 'ᱴᱟᱠᱟ ᱵᱟᱪᱷᱟᱣ: "᱓᱕ ᱴᱟᱠᱟ" ᱞᱟᱹᱜᱤᱫ ᱒᱐ + ᱑᱐ + ᱕ ᱴᱟᱠᱟ ᱱᱳᱴ ᱩᱫᱩᱜ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'कक्षा हाट (Mock Market): पेंसिल ₹5 + कॉपी ₹15 = ₹20। बच्चे नकली नोट देकर सामान खरीदें और बचे पैसे लें।', sat: 'ᱠᱞᱟᱥ ᱦᱟᱴ: ᱕ ᱴᱟᱠᱟ ᱯᱮᱱᱥᱤᱞ + ᱑᱕ ᱴᱟᱠᱟ ᱠᱷᱟᱛᱟ = ᱒᱐ ᱴᱟᱠᱟ ᱮᱢ ᱠᱟᱛᱮ ᱠᱤᱨᱤᱧ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर जाकर माता-पिता से पूछें कि हाट में 1 किलो आलू कितने रुपये का मिलता है।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱟᱭᱳ ᱠᱩᱞᱤᱭᱮ ᱢᱮ ᱦᱟᱴ ᱨᱮ ᱑ ᱠᱤᱞᱳ ᱟᱹᱞᱩ ᱛᱤᱱᱟᱹᱜ ᱴᱟᱠᱟ ᱠᱟᱱᱟ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"₹10 के 3 नोट हों तो कुल कितने रुपये होंगे?"', question_sat: '"᱑᱐ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱓ ᱱᱳᱴ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱴᱟᱠᱟ?"', answer_hin: '₹30 = ᱓᱐ ᱴᱟᱠᱟ', answer_sat: 'ᱛᱮᱞᱟ: ᱓᱐ ᱴᱟᱠᱟ' },
      { question_hin: '"₹50 में से ₹20 की दाल खरीदी। कितने रुपये बचे?"', question_sat: '"᱕᱐ ᱴᱟᱠᱟ ᱠᱷᱚᱱ ᱒᱐ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱫᱟᱹᱞ ᱠᱤᱨᱤᱧ ᱮᱱᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ?"', answer_hin: '₹30 बचे = ᱓᱐ ᱴᱟᱠᱟ', answer_sat: 'ᱛᱮᱞᱟ: ᱓᱐ ᱴᱟᱠᱟ' },
      { question_hin: '"₹20 बनाने के लिए ₹5 के कितने सिक्के चाहिए?"', question_sat: '"᱒᱐ ᱴᱟᱠᱟ ᱵᱮᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱕ ᱴᱟᱠᱟ ᱨᱮᱱᱟᱜ ᱛᱤᱱᱟᱹᱜ ᱥᱤᱠᱟᱹ ᱞᱟᱹᱠᱛᱤᱜᱼᱟ?"', answer_hin: '4 सिक्के = ᱔ ᱥᱤᱠᱟᱹ', answer_sat: 'ᱛᱮᱞᱟ: ᱔ ᱥᱤᱠᱟᱹ' },
    ],
  },

  // ----------------------------------------------------------
  // CLASS 3 — LITERACY (4 TOPICS)
  // ----------------------------------------------------------

  'Class 3||Literacy||0': {
    title_hin: '60 शब्द/मिनट — अज्ञात पाठ पठन और बोध (ᱯᱟᱲᱦᱟᱣ ᱖᱐+ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ)',
    title_sat: 'ᱯᱟᱲᱦᱟᱣ ᱖᱐+ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ — ᱵᱩᱡᱷᱟᱹᱣ ᱟᱨ ᱥᱟᱨᱟᱝᱥᱚ ᱥᱟᱶ',
    grade: 'Class 3', subject: 'Foundational Literacy',
    topic: 'Reading Fluency: 60+ Words/Min from Unknown Text',
    nipun_target: 'NIPUN Lakshya (Class 3 Benchmark): Child reads an unknown age-appropriate text at minimum 60 correct words per minute with full comprehension and answers inferential questions.',
    materials: ['Grade 3 unknown story passage (150 words)', 'Stopwatch/timer', 'Comprehension rubric sheet'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक NIPUN लक्ष्य समझाएं: "कक्षा 3 के अंत में हर बच्चे को 1 मिनट में 60 शब्द धाराप्रवाह पढ़ना है! आज हम टाइमर के साथ इसका अभ्यास करेंगे।"', sat: 'ᱢᱟᱪᱮᱛ NIPUN ᱴᱟᱨᱜᱮᱴ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ: "ᱠᱞᱟᱥ ᱓ ᱢᱩᱪᱟᱹᱫ ᱨᱮ ᱑ ᱢᱤᱱᱤᱴ ᱨᱮ ᱖᱐ ᱟᱹᱲᱟᱹ ᱯᱟᱲᱦᱟᱣ ᱞᱟᱹᱠᱛᱤᱜ ᱠᱟᱱᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'तेज और समझदार पठन की रणनीतियां सिखाएं:\n1) शब्दों को एक-एक करके नहीं, 3-4 शब्दों के समूह में पढ़ना\n2) अज्ञात शब्द आने पर संदर्भ (Context) से अर्थ समझना\n3) विराम चिह्नों पर सही ठहराव लेना', sat: 'ᱞᱚᱜᱚᱱ ᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ ᱯᱟᱲᱦᱟᱣ ᱦᱩᱱᱟᱹᱨ:\n᱑) ᱓-᱔ ᱟᱹᱲᱟᱹ ᱜᱟᱫᱮᱞ ᱛᱮ ᱯᱟᱲᱦᱟᱣ\n᱒) ᱱᱟᱣᱟ ᱟᱹᱲᱟᱹ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱯᱟᱥᱱᱟᱣ ᱠᱷᱚᱱ ᱵᱩᱡᱷᱟᱹᱣ\n᱓) ᱛᱷᱟᱠᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱨᱮ ᱥᱟᱹᱦᱤᱡ ᱛᱤᱸᱜᱩᱱ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'ORF टाइमर अभ्यास: बच्चे 1 मिनट का टाइमर चलाकर संथाली पाठ पढ़ें और साथी पढ़े गए सही शब्दों की संख्या गिने।', sat: 'ORF ᱴᱟᱭᱢᱟᱨ ᱟᱵᱷᱭᱟᱥ: ᱜᱤᱫᱽᱨᱟᱹ ᱑ ᱢᱤᱱᱤᱴ ᱯᱟᱲᱦᱟᱣ ᱠᱟᱛᱮ ᱟᱹᱲᱟᱹ ᱞᱮᱠᱷᱟᱭ ᱢᱮ (Target: 60+)।' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'पढ़े गए पाठ से 3 उच्च स्तरीय प्रश्न: "कहानी में मुख्य समस्या क्या थी? अगर तुम उसकी जगह होते तो क्या करते?"', sat: 'ᱯᱟᱲᱦᱟᱣ ᱠᱟᱛᱮ ᱓ ᱜᱟᱹᱦᱤᱨ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ: "ᱠᱟᱹᱦᱱᱤ ᱨᱮ ᱢᱩᱬᱩᱛ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱪᱮᱫ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ?"' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'कहानी का अंत अपने मन से 3 वाक्यों में बदलकर कॉपी में लिखें।', sat: 'ᱠᱟᱹᱦᱱᱤ ᱨᱮᱱᱟᱜ ᱢᱩᱪᱟᱹᱫ ᱟᱯᱱᱟᱨ ᱢᱚᱱᱮ ᱞᱮᱠᱟᱛᱮ ᱓ ᱟᱹᱭᱟᱹᱛ ᱚᱞ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '1 मिनट में पढ़े गए सही शब्दों की संख्या (ORF स्कोर)', question_sat: '᱑ ᱢᱤᱱᱤᱴ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱹᱦᱤᱡ ᱟᱹᱲᱟᱹ ᱯᱟᱲᱦᱟᱣ ᱮᱱᱟ?', answer_hin: 'Target: 60+ Words/Min = NIPUN Grade 3 Passed ✅', answer_sat: 'ᱴᱟᱨᱜᱮᱴ: ᱖᱐+ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ = NIPUN ✅' },
      { question_hin: 'कहानी के मुख्य पात्र का नाम और उसका स्वभाव बताओ', question_sat: 'ᱠᱟᱹᱦᱱᱤ ᱨᱮᱱ ᱢᱩᱬᱩᱛ ᱦᱚᱲᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱜᱩᱱ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: 'Text-dependent comprehension answer', answer_sat: 'ᱯᱟᱹᱴᱷᱩ ᱞᱮᱠᱟᱛᱮ ᱥᱟᱹᱦᱤᱡ ᱛᱮᱞᱟ' },
      { question_hin: 'कहानी से क्या सीख मिली?', question_sat: 'ᱱᱚᱣᱟ ᱠᱟᱹᱦᱱᱤ ᱠᱷᱚᱱ ᱪᱮᱫ ᱥᱮᱪᱮᱫ ᱧᱟᱢ ᱮᱱᱟ?', answer_hin: 'Moral/inference response from child', answer_sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱟᱡᱟᱜ ᱵᱩᱡᱷᱟᱹᱣ ᱞᱮᱠᱟᱛᱮ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱭᱟ' },
    ],
  },

  'Class 3||Literacy||1': {
    title_hin: 'संथाली लोककथा और बोध प्रश्न (ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ)',
    title_sat: 'ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ — ᱥᱟᱱᱛᱟᱲᱤ ᱞᱟᱠᱪᱟᱨ ᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ',
    grade: 'Class 3', subject: 'Foundational Literacy',
    topic: 'Traditional Santali Folk Tale with 3 Comprehension Qs',
    nipun_target: 'NIPUN Lakshya (Class 3): Child reads ancestral folk tales in Ol Chiki, identifies central theme, character traits, and answers cause-and-effect questions.',
    materials: ['Santhal folk tale booklet', 'Story map graphic organizer', 'Character sketch sheet'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक सारहुल और करम से जुड़ी पूर्वजों (ᱦᱟᱯᱲᱟᱢ) की कहानी की प्रस्तावना दें: "हमारे पूर्वज जंगलों और जानवरों से कैसे प्रेम करते थे?"', sat: 'ᱢᱟᱪᱮᱛ ᱦᱟᱯᱲᱟᱢ ᱠᱚᱣᱟᱜ ᱠᱟᱹᱦᱱᱤ ᱮᱛᱚᱦᱚᱵ ᱢᱮ: "ᱟᱵᱚᱨᱮᱱ ᱦᱟᱯᱲᱟᱢ ᱠᱚ ᱵᱤᱨ-ᱵᱩᱨᱩ ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱚ ᱫᱩᱞᱟᱹᱲᱮᱫ ᱛᱟᱦᱮᱸᱫ?"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'पारंपरिक लोककथा का पठन:\n"ᱥᱮᱫᱟᱭ ᱡᱩᱜᱽ ᱨᱮ ᱢᱤᱫ ᱥᱟᱱᱛᱟᱲ ᱵᱤᱨ ᱛᱮ ᱥᱮᱱ ᱞᱮᱱᱟᱭ᱾\nᱩᱱᱤ ᱫᱚ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱟᱨ ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱥᱟᱶ ᱜᱟᱛᱮ ᱮᱱᱟᱭ᱾\nᱩᱱᱤ ᱪᱮᱬᱮ ᱠᱚᱣᱟᱜ ᱟᱲᱟᱝ ᱮ ᱵᱩᱡᱷᱟᱹᱣ ᱫᱟᱲᱮᱭᱟᱜ ᱛᱟᱦᱮᱸᱫ᱾\nᱢᱤᱫ ᱫᱤᱱ ᱵᱤᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱮᱱ ᱠᱷᱟᱱ ᱩᱱᱤ ᱡᱚᱛᱚ ᱡᱤᱵᱽ ᱮ ᱵᱟᱧᱪᱟᱣ ᱠᱮᱫ ᱠᱚᱣᱟ᱾"', sat: 'ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ: ᱥᱮᱫᱟᱭ ᱡᱩᱜᱽ ᱨᱮ ᱢᱤᱫ ᱥᱟᱱᱛᱟᱲ ᱵᱤᱨ ᱨᱮ ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱠᱚ ᱵᱟᱧᱪᱟᱣ ᱠᱮᱫ ᱠᱚᱣᱟ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'कहानी मानचित्र (Story Map): स्लेट पर लिखें —\n• शीर्षक (ᱧᱩᱛᱩᱢ)\n• पात्र (ᱦᱚᱲ/ᱡᱤᱵᱽ)\n• स्थान (ᱡᱟᱭᱜᱟ)\n• घटना (ঘটনা/ᱠᱟᱛᱷᱟ)', sat: 'ᱠᱟᱹᱦᱱᱤ ᱢᱮᱯ ᱥᱞᱮᱴ ᱨᱮ ᱚᱞ ᱢᱮ: ᱧᱩᱛᱩᱢ, ᱦᱚᱲ, ᱡᱟᱭᱜᱟ, ᱠᱟᱛᱷᱟ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: '3 बोध प्रश्नों के उत्तर कॉपी में ओल चिकी में लिखना: "उस संथाली व्यक्ति ने जानवरों को कैसे बचाया?"', sat: '᱓ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर जाकर अपने दादा जी से अपने गाँव की कोई पुरानी लोककथा सुनें और कल कक्षा में सुनाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱦᱟᱲᱟᱢ ᱵᱟᱵᱟ ᱴᱷᱮᱱ ᱠᱷᱚᱱ ᱢᱤᱫ ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ ᱟᱸᱡᱚᱢ ᱠᱟᱛᱮ ᱜᱟᱯᱟ ᱞᱟᱹᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'कहानी में व्यक्ति ने किसकी जान बचाई?', question_sat: 'ᱠᱟᱹᱦᱱᱤ ᱨᱮ ᱩᱱᱤ ᱦᱚᱲ ᱚᱠᱚᱭ ᱠᱚᱭ ᱵᱟᱧᱪᱟᱣ ᱠᱮᱫ ᱠᱚᱣᱟ?', answer_hin: 'जंगल के जानवरों और पक्षियों की (ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱟᱨ ᱪᱮᱬᱮ)', answer_sat: 'ᱛᱮᱞᱟ: ᱵᱤᱨ ᱨᱮᱱ ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱠᱚ' },
      { question_hin: 'जंगल में क्या विपत्ति आई थी?', question_sat: 'ᱵᱤᱨ ᱨᱮ ᱪᱮᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱩᱭ ᱞᱮᱱᱟ?', answer_hin: 'आग लग गई थी (ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱮᱱᱟ)', answer_sat: 'ᱛᱮᱞᱟ: ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱮᱱᱟ' },
      { question_hin: '"ᱦᱟᱯᱲᱟᱢ का हिंदी अर्थ क्या है?"', question_sat: '"ᱦᱟᱯᱲᱟᱢ ᱟᱹᱲᱟᱹ ᱨᱮᱱᱟᱜ ᱦᱤᱱᱫᱤ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?"', answer_hin: 'पूर्वज / बुजुर्ग (Ancestors / Elders)', answer_sat: 'ᱛᱮᱞᱟ: ᱯᱩᱨᱵᱚᱡᱽ (Ancestors)' },
    ],
  },

  'Class 3||Literacy||2': {
    title_hin: 'प्रकृति और पर्यावरण पर 5 वाक्यों का अनुच्छेद लेखन (ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱵᱟᱵᱚᱛ ᱚᱞ)',
    title_sat: 'ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱟᱨ ᱯᱚᱨᱤᱵᱮᱥ ᱵᱟᱵᱚᱛ ᱯᱮᱨᱟᱜᱽᱨᱟᱯᱷ ᱚᱞ',
    grade: 'Class 3', subject: 'Foundational Literacy',
    topic: 'Paragraph Writing: 5 Sentences on Nature',
    nipun_target: 'NIPUN Lakshya (Class 3): Child composes a structured paragraph of 5 meaningful sentences on nature/trees with correct grammar and Ol Chiki spelling.',
    materials: ['Tree & nature flashcards', 'Paragraph writing template', 'Word bank (ᱫᱟᱨᱮ, ᱫᱟᱜ, ᱦᱚᱭ, ᱡᱚ, ᱥᱟᱠᱟᱢ)'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक एक पेड़ का चित्र दिखाकर पूछें: "पेड़ हमें क्या-क्या देते हैं? फल, छाया, लकड़ी और साफ हवा!" आज हम पेड़ पर 5 वाक्य लिखेंगे।', sat: 'ᱢᱟᱪᱮᱛ ᱫᱟᱨᱮ ᱪᱤᱛᱟᱹᱨ ᱩᱫᱩᱜ ᱢᱮ: "ᱫᱟᱨᱮ ᱟᱵᱚ ᱪᱮᱫ ᱪᱮᱫ ᱮᱢᱟᱵᱚᱱᱟ? ᱡᱚ, ᱩᱢᱩᱞ, ᱥᱟᱠᱟᱢ ᱟᱨ ᱦᱚᱭ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '5 वाक्यों का प्रारूप तैयार करना:\n1) "ᱫᱟᱨᱮ ᱫᱚ ᱟᱵᱚᱨᱤᱱ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱜᱟᱛᱮ ᱠᱟᱱᱟᱠᱚ᱾" (पेड़ हमारे सबसे बड़े मित्र हैं)\n2) "ᱫᱟᱨᱮ ᱠᱷᱚᱱ ᱟᱵᱚ ᱡᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱡᱚ ᱟᱨ ᱥᱟᱠᱟᱢ ᱵᱚᱱ ᱧᱟᱢᱟ᱾" (पेड़ों से हमें फल-पत्तियां मिलती हैं)\n3) "ᱫᱟᱨᱮ ᱟᱵᱚ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱮᱢᱟᱵᱚᱱᱟ᱾" (पेड़ हमें साफ हवा देते हैं)\n4) "ᱪᱮᱬᱮ ᱠᱚ ᱫᱟᱨᱮ ᱨᱮ ᱛᱩᱠᱟᱹ ᱠᱚ ᱵᱮᱱᱟᱣᱟ᱾" (पक्षी पेड़ों पर घोंसला बनाते हैं)\n5) "ᱟᱵᱚ ᱡᱚᱛᱚ ᱦᱚᱲ ᱫᱟᱨᱮ ᱵᱚᱱ ᱨᱚᱦᱚᱭᱟ ᱟᱨ ᱵᱚᱱ ᱡᱚᱛᱚᱱᱟ᱾" (हम सब पेड़ लगाएंगे और बचाएंगे)', sat: '᱕ ᱟᱹᱭᱟᱹᱛ ᱵᱮᱱᱟᱣ ᱪᱮᱫ ᱢᱮ:\n᱑) ᱫᱟᱨᱮ ᱫᱚ ᱟᱵᱚᱨᱤᱱ ᱢᱟᱨᱟᱝ ᱜᱟᱛᱮ ᱠᱟᱱᱟᱠᱚ᱾\n᱒) ᱫᱟᱨᱮ ᱠᱷᱚᱱ ᱡᱚ ᱟᱨ ᱥᱟᱠᱟᱢ ᱵᱚᱱ ᱧᱟᱢᱟ᱾\n᱓) ᱫᱟᱨᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱮᱢᱟᱵᱚᱱᱟ᱾\n᱔) ᱪᱮᱬᱮ ᱠᱚ ᱫᱟᱨᱮ ᱨᱮ ᱛᱩᱠᱟᱹ ᱠᱚ ᱵᱮᱱᱟᱣᱟ᱾\n᱕) ᱟᱵᱚ ᱫᱟᱨᱮ ᱵᱚᱱ ᱨᱚᱦᱚᱭᱟ᱾' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'शब्द बैंक की सहायता से बच्चे स्लेट पर 3 वाक्य खुद बनाएं और शिक्षक से वर्तनी (Spelling) जाँच कराएं।', sat: 'ᱟᱹᱲᱟᱹ ᱜᱟᱫᱮᱞ ᱜᱚᱲᱚ ᱛᱮ ᱥᱞᱮᱴ ᱨᱮ ᱓ ᱟᱹᱭᱟᱹᱛ ᱚᱞ ᱢᱮ ᱟᱨ ᱢᱟᱪᱮᱛ ᱩᱫᱩᱜ ᱟᱭ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'अपनी कॉपी में "ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱜᱩᱱ" (पेड़ का महत्व) शीर्षक से 5 पूरे वाक्यों का सुंदर अनुच्छेद लिखना।', sat: 'ᱠᱷᱟᱛᱟ ᱨᱮ "ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱜᱩᱱ" ᱵᱟᱵᱚᱛ ᱕ ᱟᱹᱭᱟᱹᱛ ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'स्कूल प्रांगण में 1 पौधा लगाएं और उसकी देखभाल का संकल्प लें।', sat: 'ᱤᱥᱠᱩᱞ ᱨᱮ ᱢᱤᱫ ᱫᱟᱨᱮ ᱨᱚᱦᱚᱭ ᱠᱟᱛᱮ ᱡᱚᱛᱚᱱ ᱦᱟᱛᱟᱣ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"पेड़ हमें क्या देते हैं? 2 चीजें संथाली में बताओ"', question_sat: '"ᱫᱟᱨᱮ ᱟᱵᱚ ᱪᱮᱫ ᱮᱢᱟᱵᱚᱱᱟ? ᱵᱟᱨᱭᱟ ᱡᱤᱱᱤᱥ ᱞᱟᱹᱭ ᱢᱮ"', answer_hin: 'ᱡᱚ (फल) और ᱦᱚᱭ (हवा/Oxygen)', answer_sat: 'ᱛᱮᱞᱟ: ᱡᱚ ᱟᱨ ᱥᱟᱯᱷᱟ ᱦᱚᱭ' },
      { question_hin: '"पक्षी पेड़ों पर क्या बनाते हैं?"', question_sat: '"ᱪᱮᱬᱮ ᱠᱚ ᱫᱟᱨᱮ ᱨᱮ ᱪᱮᱫ ᱠᱚ ᱵᱮᱱᱟᱣᱟ?"', answer_hin: 'घोंसला = ᱛᱩᱠᱟᱹ (Tuka)', answer_sat: 'ᱛᱮᱞᱟ: ᱛᱩᱠᱟᱹ' },
      { question_hin: '"ᱫᱟᱨᱮ ᱵᱚᱱ ᱨᱚᱦᱚᱭᱟ का हिंदी अर्थ क्या है?"', question_sat: '"ᱫᱟᱨᱮ ᱵᱚᱱ ᱨᱚᱦᱚᱭᱟ ᱨᱮᱱᱟᱜ ᱦᱤᱱᱫᱤ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?"', answer_hin: 'हम पेड़ लगाएंगे (We will plant trees)', answer_sat: 'ᱛᱮᱞᱟ: ᱦᱟᱢ ᱯᱮᱲ ᱞᱟᱜᱟᱭᱮᱝᱜᱮ' },
    ],
  },

  'Class 3||Literacy||3': {
    title_hin: 'विराम चिह्न और शुद्ध वाक्य निर्माण (ᱛᱷᱟᱠᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱟᱹᱭᱟᱹᱛ ᱵᱮᱱᱟᱣ)',
    title_sat: 'ᱛᱷᱟᱠᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱵᱮᱵᱷᱟᱨ ᱠᱟᱛᱮ ᱥᱟᱹᱦᱤᱡ ᱟᱹᱭᱟᱹᱛ ᱚᱞ',
    grade: 'Class 3', subject: 'Foundational Literacy',
    topic: 'Punctuation & Ol Chiki Sentence Construction',
    nipun_target: 'NIPUN Lakshya (Class 3): Child uses punctuation marks appropriately (Full stop ।, Comma ,, Question mark ?) in Ol Chiki sentences.',
    materials: ['Punctuation mark cards (।, ,, ?, !)', 'Unpunctuated sentence strips', 'Chalk & blackboard'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक दो वाक्य पढ़ें: "तुम कहाँ जा रहे हो?" (प्रश्न) और "मैं स्कूल जा रहा हूँ।" (कथन)। पूछें: "दोनों के अंत में अलग-अलग चिह्न क्यों हैं?"', sat: 'ᱢᱟᱪᱮᱛ ᱵᱟᱨ ᱟᱹᱭᱟᱹᱛ ᱯᱟᱲᱦᱟᱣ ᱢᱮ: "ᱟᱢ ᱚᱠᱟ ᱛᱮᱢ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ?" ᱟᱨ "ᱤᱧ ᱤᱥᱠᱩᱞ ᱤᱧ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '3 मुख्य विराम चिह्न सिखाएं:\n• ᱢᱩᱪᱟᱹᱫ ᱪᱤᱱᱦᱟᱹ / पूर्णविराम (।) — वाक्य पूरा होने पर: "ᱤᱧ ᱯᱩᱛᱷᱤᱧ ᱯᱟᱲᱦᱟᱣ ᱠᱟᱱᱟ᱾"\n• ᱛᱷᱟᱠᱮᱫ / अल्पविराम (,) — थोड़ा रुकने पर: "ᱩᱞ, ᱥᱮᱣ, ᱠᱟᱭᱨᱟ ᱡᱚᱢ ᱢᱮ᱾"\n• ᱠᱩᱠᱞᱤ ᱪᱤᱱᱦᱟᱹ / प्रश्नचिह्न (?) — सवाल पूछने पर: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?"', sat: '᱓ ᱢᱩᱬᱩᱛ ᱛᱷᱟᱠᱮᱫ ᱪᱤᱱᱦᱟᱹ:\n• ᱢᱩᱪᱟᱹᱫ (।) — ᱟᱹᱭᱟᱹᱛ ᱢᱩᱪᱟᱹᱫ ᱨᱮ\n• ᱛᱷᱟᱠᱮᱫ (,) — ᱠᱟᱹᱡ ᱛᱤᱸᱜᱩᱱ ᱨᱮ\n• ᱠᱩᱠᱞᱤ (?) — ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤ ᱚᱠᱛᱚ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'विराम चिह्न लगाओ अभ्यास:\n1) "ᱟᱢ ᱫᱟᱠᱟᱢ ᱡᱚᱢ ᱠᱮᱫᱼᱟ [ ? ]"\n2) "ᱤᱧ ᱫᱚ ᱵᱟᱡᱟᱨ ᱤᱧ ᱪᱟᱞᱟᱜᱼᱟ [ । ]"\n3) "ᱜᱟᱹᱭ ᱢᱮᱨᱚᱢ ᱟᱨ ᱥᱤᱢ [ , ]"', sat: 'ᱪᱤᱱᱦᱟᱹ ᱞᱟᱜᱟᱣ ᱢᱮ:\n᱑) ᱟᱢ ᱫᱟᱠᱟᱢ ᱡᱚᱢ ᱠᱮᱫᱼᱟ [ ? ]\n᱒) ᱤᱧ ᱫᱚ ᱵᱟᱡᱟᱨ ᱤᱧ ᱪᱟᱞᱟᱜᱼᱟ [ । ]' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'अपनी कॉपी में 1 प्रश्नवाचक वाक्य (?) और 2 साधारण वाक्य (।) सही ओल चिकी में लिखना।', sat: 'ᱠᱷᱟᱛᱟ ᱨᱮ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱟᱹᱭᱟᱹᱛ (?) ᱟᱨ ᱵᱟᱨ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱟᱹᱭᱟᱹᱛ (।) ᱚᱞ ᱢᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'किताब का कोई एक पाठ खोलकर उसमें लगे सभी ? और । चिह्नों पर गोला बनाकर गिनें।', sat: 'ᱯᱩᱛᱷᱤ ᱨᱮ ? ᱟᱨ । ᱪᱤᱱᱦᱟᱹ ᱠᱚ ᱯᱟᱱᱛᱮ ᱠᱟᱛᱮ ᱜᱩᱞ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'प्रश्न पूछने पर वाक्य के अंत में कौन सा चिह्न लगाते हैं?', question_sat: 'ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤ ᱚᱠᱛᱚ ᱟᱹᱭᱟᱹᱛ ᱢᱩᱪᱟᱹᱫ ᱨᱮ ᱪᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱞᱟᱜᱟᱣᱜᱼᱟ?', answer_hin: 'प्रश्नचिह्न (?) = ᱠᱩᱠᱞᱤ ᱪᱤᱱᱦᱟᱹ', answer_sat: 'ᱛᱮᱞᱟ: ᱠᱩᱠᱞᱤ ᱪᱤᱱᱦᱟᱹ (?)' },
      { question_hin: '"ᱟᱢ ᱪᱮᱫ ᱮᱢ ᱪᱤᱠᱟᱹᱭᱮᱫᱼᱟ" के अंत में क्या लगेगा?', question_sat: '"ᱟᱢ ᱪᱮᱫ ᱮᱢ ᱪᱤᱠᱟᱹᱭᱮᱫᱼᱟ" ᱢᱩᱪᱟᱹᱫ ᱨᱮ ᱪᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱦᱩᱭᱩᱜᱼᱟ?', answer_hin: '?', answer_sat: 'ᱛᱮᱞᱟ: ? (ᱠᱩᱠᱞᱤ ᱪᱤᱱᱦᱟᱹ)' },
      { question_hin: 'वाक्य पूरा होने पर कौन सा चिह्न लगता है?', question_sat: 'ᱟᱹᱭᱟᱹᱛ ᱯᱩᱨᱟᱹᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱪᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱞᱟᱜᱟᱣᱜᱼᱟ?', answer_hin: 'पूर्णविराम (।) = ᱢᱩᱪᱟᱹᱫ ᱪᱤᱱᱦᱟᱹ', answer_sat: 'ᱛᱮᱞᱟ: ᱢᱩᱪᱟᱹᱫ (।)' },
    ],
  },

  // ----------------------------------------------------------
  // CLASS 3 — NUMERACY (5 TOPICS)
  // ----------------------------------------------------------

  'Class 3||Numeracy||0': {
    title_hin: '3 अंकों का जोड़ और घटाव — 999 तक (ᱯᱮ ᱮᱞ ᱡᱚᱲᱟᱣ-ᱜᱷᱟᱴᱟᱣ)',
    title_sat: 'ᱯᱮ ᱮᱞ ᱮᱞᱠᱷᱟ ᱡᱚᱲᱟᱣ ᱟᱨ ᱜᱷᱟᱴᱟᱣ ᱙᱙᱙ ᱫᱷᱟᱹᱵᱤᱡ',
    grade: 'Class 3', subject: 'Foundational Numeracy',
    topic: '3-Digit Addition & Subtraction up to 999',
    nipun_target: 'NIPUN Lakshya (Class 3): Child adds and subtracts 3-digit numbers up to 999 in column format with regrouping/borrowing across hundreds, tens, and ones.',
    materials: ['Hundreds-Tens-Ones chart (ᱥᱟᱭ | ᱜᱮᱞ | ᱢᱤᱫ)', 'Column arithmetic slates', 'Base 10 flats/rods/units'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'समस्या: "गाँव के स्कूल में 234 लड़के और 312 लड़कियाँ हैं। पूरे स्कूल में कुल कितने बच्चे हैं?" 234 + 312 = ?', sat: 'ᱠᱟᱹᱦᱱᱤ: "ᱤᱥᱠᱩᱞ ᱨᱮ ᱒᱓᱔ ᱠᱚᱲᱟ ᱟᱨ ᱓᱑᱒ ᱠᱩᱲᱤ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ᱾ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ?" ᱒᱓᱔ + ᱓᱑᱒ = ?' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '3-अंकीय कॉलम विधि (सैकड़ा = ᱥᱟᱭ, दहाई = ᱜᱮᱞ, इकाई = ᱢᱤᱫ):\n```\n  ᱥᱟᱭ (100s) | ᱜᱮᱞ (10s) | ᱢᱤᱫ (1s)\n       2     |    3     |    4\n  +    3     |    1     |    2\n  -----------|----------|---------\n       5     |    4     |    6   = 546 (᱕᱔᱖)\n```\n1) इकाई: 4 + 2 = 6\n2) दहाई: 3 + 1 = 4\n3) सैकड़ा: 2 + 3 = 5', sat: 'ᱯᱮ ᱮᱞ ᱠᱳᱞᱚᱢ ᱵᱤᱫᱷᱤ:\n  ᱥᱟᱭ | ᱜᱮᱞ | ᱢᱤᱫ\n   ᱒  |  ᱓  |  ᱔\n+  ᱓  |  ᱑  |  ᱒\n------|-----|-----\n   ᱕  |  ᱔  |  ᱖  = ᱕᱔᱖' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'स्लेट पर हल करें:\n1) 450 + 230 = 680 (᱔᱕᱐ + ᱒᱓᱐ = ᱖᱘᱐)\n2) 689 - 345 = 344 (᱖᱘᱙ - ᱓᱔᱕ = ᱓᱔᱔)\n3) 538 + 247 = 785 (᱕᱓᱘ + ᱒᱔᱗ = ᱗᱘᱕)', sat: 'ᱥᱞᱮᱴ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ:\n᱑) ᱔᱕᱐ + ᱒᱓᱐ = ᱖᱘᱐\n᱒) ᱖᱘᱙ - ᱓᱔᱕ = ᱓᱔᱔\n᱓) ᱕᱓᱘ + ᱒᱔᱗ = ᱗᱘᱕' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'हाट हिसाब: सुनिता ने ₹325 का चावल और ₹142 की दाल खरीदी। कुल खर्च = ₹467 (᱔᱖᱗ ᱴᱟᱠᱟ)। ₹500 में से बचे = ₹33 (᱓᱓ ᱴᱟᱠᱟ)।', sat: 'ᱦᱟᱴ ᱦᱤᱥᱟᱹᱵᱽ: ᱓᱒᱕ ᱴᱟᱠᱟ + ᱑᱔᱒ ᱴᱟᱠᱟ = ᱔᱖᱗ ᱴᱟᱠᱟ᱾ ᱕᱐᱐ ᱠᱷᱚᱱ ᱥᱟᱨᱮᱡ = ᱓᱓ ᱴᱟᱠᱟ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'गृहकार्य: 642+153 और 784-251 के 2 सवाल कॉपी में हल करें।', sat: 'ᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ: ᱖᱔᱒+᱑᱕᱓ ᱟᱨ ᱗᱘᱔-᱒᱕᱑ ᱠᱷᱟᱛᱟ ᱨᱮ ᱦᱟᱹᱞ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"356 + 213 = ?" कॉलम में जोड़कर बताओ', question_sat: '"᱓᱕᱖ + ᱒᱑᱓ = ?" ᱠᱳᱞᱚᱢ ᱛᱮ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: '569 = ᱕᱖᱙', answer_sat: 'ᱛᱮᱞᱟ: ᱕᱖᱙' },
      { question_hin: '"700 - 300 कितना होगा?"', question_sat: '"᱗᱐᱐ - ᱓᱐᱐ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: '400 = ᱔᱐᱐ (ᱯᱩᱱ ᱥᱟᱭ)', answer_sat: 'ᱛᱮᱞᱟ: ᱔᱐᱐' },
      { question_hin: '"427 में ᱥᱟᱭ (सैकड़ा) का अंक कौन सा है?"', question_sat: '"᱔᱒᱗ ᱨᱮ ᱥᱟᱭ ᱴᱷᱟᱶ ᱨᱮ ᱚᱠᱟ ᱮᱞ ᱢᱮᱱᱟᱜᱼᱟ?"', answer_hin: '4 = ᱔ (ᱯᱩᱱ ᱥᱟᱭ)', answer_sat: 'ᱛᱮᱞᱟ: ᱔' },
    ],
  },

  'Class 3||Numeracy||1': {
    title_hin: 'पहाड़ा 2 से 10 — ओल चिकी में (ᱜᱩᱬᱟᱹᱣ ᱦᱮᱱᱫᱮ ᱒-᱑᱐)',
    title_sat: 'ᱜᱩᱬᱟᱹᱣ ᱦᱮᱱᱫᱮ ᱒ ᱠᱷᱚᱱ ᱑᱐ — ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ',
    grade: 'Class 3', subject: 'Foundational Numeracy',
    topic: 'Multiplication Tables 2 to 10 in Ol Chiki',
    nipun_target: 'NIPUN Lakshya (Class 3): Child recites and applies multiplication tables from 2 to 10 fluently to solve 2-digit × 1-digit problems.',
    materials: ['Multiplication table chart (2–10)', 'Array dot cards', 'Dice multiplication game'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक 4 बच्चों को 3-3 बेर दें: "कुल कितने बेर हैं? 3+3+3+3 = 12! पहाड़े से: 4 × 3 = 12! आज हम ओल चिकी में पहाड़ा सीखेंगे!"', sat: 'ᱢᱟᱪᱮᱛ ᱔ ᱜᱤᱫᱽᱨᱟᱹ ᱓-᱓ ᱡᱚ ᱮᱢ ᱠᱟᱛᱮ: "ᱡᱚᱛᱚ ᱛᱮ ᱔ × ᱓ = ᱑᱒! ᱛᱮᱦᱮᱧ ᱜᱩᱬᱟᱹᱣ ᱦᱮᱱᱫᱮ ᱵᱚᱱ ᱪᱮᱫᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: '2 और 3 का पहाड़ा ओल चिकी में:\n• ᱒ × ᱑ = ᱒ (2×1=2)\n• ᱒ × ᱒ = ᱔ (2×2=4)\n• ᱒ × ᱓ = ᱖ (2×3=6)\n• ᱒ × ᱔ = ᱘ (2×4=8)\n• ᱒ × ᱕ = ᱑᱐ (2×5=10)\n• ᱓ × ᱑ = ᱓, ᱓ × ᱒ = ᱖, ᱓ × ᱓ = ᱙, ᱓ × ᱔ = ᱑᱒, ᱓ × ᱕ = ᱑᱕', sat: '᱒ ᱟᱨ ᱓ ᱨᱮᱱᱟᱜ ᱦᱮᱱᱫᱮ:\n• ᱒ × ᱑ = ᱒, ᱒ × ᱒ = ᱔, ᱒ × ᱓ = ᱖, ᱒ × ᱔ = ᱘, ᱒ × ᱕ = ᱑᱐\n• ᱓ × ᱑ = ᱓, ᱓ × ᱒ = ᱖, ᱓ × ᱓ = ᱙, ᱓ × ᱔ = ᱑᱒, ᱓ × ᱕ = ᱑᱕' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'लय में पहाड़ा गायन (Rhythm Chanting): शिक्षक "᱒ ᱮᱠᱟᱢ" → बच्चे "᱒!", शिक्षक "᱒ ᱫᱩᱱᱤ" → बच्चे "᱔!"।', sat: 'ᱥᱮᱨᱮᱧ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮ ᱦᱮᱱᱫᱮ: ᱢᱟᱪᱮᱛ "᱒ ᱮᱠᱟᱢ" → ᱜᱤᱫᱽᱨᱟᱹ "᱒!" ᱢᱮᱱ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'पेड़ पंक्ति समस्या: 6 क्यारियों में 4-4 पौधे हैं। कुल कितने पौधे? 6 × 4 = 24 पौधे (᱒᱔ ᱫᱟᱨᱮ)।', sat: '᱖ ᱦᱟᱨ ᱨᱮ ᱔-᱔ ᱫᱟᱨᱮ: ᱖ × ᱔ = ᱒᱔ ᱫᱟᱨᱮ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर पर 4 और 5 का पहाड़ा ओल चिकी में लिखकर याद करें।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱔ ᱟᱨ ᱕ ᱨᱮᱱᱟᱜ ᱦᱮᱱᱫᱮ ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱚᱞ ᱠᱟᱛᱮ ᱢᱩᱠᱷᱚᱥᱛᱚ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"᱒ × ᱗ = ?" जल्दी बोलो', question_sat: '"᱒ × ᱗ = ?" ᱞᱚᱜᱚᱱ ᱞᱟᱹᱭ ᱢᱮ', answer_hin: '14 = ᱑᱔', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱔' },
      { question_hin: '"3 × 5 कितना होता है?"', question_sat: '"᱓ × ᱕ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱩᱜᱼᱟ?"', answer_hin: '15 = ᱑᱕ (ᱜᱮᱞ ᱢᱚᱬᱮ)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱕' },
      { question_hin: '"4 गायों के कुल कितने पैर होंगे?"', question_sat: '"᱔ ᱜᱟᱹᱭ ᱨᱮᱱ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱡᱟᱝᱜᱟ?"', answer_hin: '4 × 4 = 16 पैर (᱑᱖ ᱡᱟᱝᱜᱟ)', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱖' },
    ],
  },

  'Class 3||Numeracy||2': {
    title_hin: 'भाग की अवधारणा — बराबर-बराबर बांटना (ᱵᱟᱨᱟᱵᱟᱹᱨᱤ ᱦᱟᱹᱴᱤᱧ)',
    title_sat: 'ᱦᱟᱹᱴᱤᱧ ᱮᱞᱠᱷᱟ — ᱥᱚᱢᱟᱱ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱨᱮᱱᱟᱜ ᱱᱤᱭᱚᱢ',
    grade: 'Class 3', subject: 'Foundational Numeracy',
    topic: 'Division as Equal Sharing',
    nipun_target: 'NIPUN Lakshya (Class 3): Child understands division as equal sharing and repeated subtraction, solving 1-digit divisor division problems with real context.',
    materials: ['20 counters/sweets/beans', '4 sharing plates', 'Division symbol card (÷)'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक 12 टॉफियां 3 बच्चों को बराबर बांटें: "हर बच्चे को कितनी मिलीं? 4 टॉफियां! 12 ÷ 3 = 4! इसी को भाग (ᱦᱟᱹᱴᱤᱧ) कहते हैं!"', sat: 'ᱢᱟᱪᱮᱛ ᱑᱒ ᱴᱚᱯᱷᱤ ᱓ ᱜᱤᱫᱽᱨᱟᱹ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ: "ᱡᱚᱛᱚ ᱦᱚᱲ ᱔-᱔ ᱴᱚᱯᱷᱤ ᱠᱚ ᱧᱟᱢ ᱠᱮᱫᱼᱟ! ᱑᱒ ÷ ᱓ = ᱔!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'बराबर बंटवारे के रूप में भाग सिखाएं:\n• 10 ÷ 2 = 5 (10 को 2 में बांटा → 5)\n• 15 ÷ 3 = 5 (15 को 3 में बांटा → 5)\n• 20 ÷ 4 = 5 (20 को 4 में बांटा → 5)\n• 18 ÷ 3 = 6 (18 को 3 में बांटा → 6)\nᱥᱟᱱᱛᱟᱲᱤ: "᱑᱐ ᱦᱟᱹᱴᱤᱧ ᱒ = ᱕ (ᱜᱮᱞ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱨ = ᱢᱚᱬᱮ)"', sat: 'ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱪᱮᱫ ᱢᱮ:\n• ᱑᱐ ÷ ᱒ = ᱕\n• ᱑᱕ ÷ ᱓ = ᱕\n• ᱒᱐ ÷ ᱔ = ᱕\n• ᱑᱘ ÷ ᱓ = ᱖' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'कंकड़ से बंटवारा अभ्यास: बच्चे 16 कंकड़ लें और 4 बराबर ढेरों में बांटें → हर ढेर में 4 कंकड़ (16 ÷ 4 = 4)।', sat: 'ᱫᱷᱤᱨᱤ ᱦᱟᱹᱴᱤᱧ: ᱑᱖ ᱫᱷᱤᱨᱤ ᱔ ᱵᱟᱹᱴᱤ ᱨᱮ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱢᱮ → ᱑᱖ ÷ ᱔ = ᱔᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'गाँव समस्या: माँ ने 18 आम लाए और 6 बच्चों में बराबर बांटे। प्रत्येक बच्चे को कितने आम मिले? 18 ÷ 6 = 3 आम (᱓ ᱩᱞ)।', sat: 'ᱟᱹᱛᱩ ᱮᱞᱠᱷᱟ: ᱑᱘ ᱩᱞ ᱖ ᱜᱤᱫᱽᱨᱟᱹ ᱨᱮ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱠᱷᱟᱱ ᱡᱚᱛᱚ ᱦᱚᱲ ᱓ ᱩᱞ ᱠᱚ ᱧᱟᱢᱟ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर में 12 रोटियों को 4 सदस्यों में बराबर बांटने का हिसाब लगाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱑᱒ ᱨᱩᱴᱤ ᱔ ᱦᱚᱲ ᱛᱟᱞᱟ ᱨᱮ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: '"15 सेब को 3 बच्चों में बराबर बांटने पर हर एक को कितने मिलेंगे?"', question_sat: '"᱑᱕ ᱥᱮᱣ ᱓ ᱜᱤᱫᱽᱨᱟᱹ ᱨᱮ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱠᱷᱟᱱ ᱛᱤᱱᱟᱹᱜ ᱧᱟᱢᱚᱜᱼᱟ?"', answer_hin: '5 सेब = ᱢᱚᱬᱮ ᱥᱮᱣ (15 ÷ 3 = 5)', answer_sat: 'ᱛᱮᱞᱟ: ᱕ ᱥᱮᱣ' },
      { question_hin: '"24 ÷ 4 = ?"', question_sat: '"᱒᱔ ÷ ᱔ = ?"', answer_hin: '6 = ᱖ (ᱛᱩᱨᱩᱭ)', answer_sat: 'ᱛᱮᱞᱟ: ᱖' },
      { question_hin: 'भाग का मतलब क्या होता है?', question_sat: 'ᱦᱟᱹᱴᱤᱧ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?', answer_hin: 'बराबर-बराबर बांटना (ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ)', answer_sat: 'ᱛᱮᱞᱟ: ᱥᱚᱢᱟᱱ ᱥᱚᱢᱟᱱ ᱦᱟᱹᱴᱤᱧ' },
    ],
  },

  'Class 3||Numeracy||3': {
    title_hin: 'समय और कैलेंडर पढ़ना — घड़ी के घंटे और महीने (ᱚᱠᱛᱚ ᱟᱨ ᱪᱟᱸᱫᱚ ᱞᱮᱠᱷᱟ)',
    title_sat: 'ᱜᱷᱩᱲᱤ ᱚᱠᱛᱚ ᱟᱨ ᱠᱮᱞᱮᱱᱰᱟᱨ ᱪᱟᱸᱫᱚ ᱯᱟᱲᱦᱟᱣ',
    grade: 'Class 3', subject: 'Foundational Numeracy',
    topic: 'Reading Clock Time & Calendar Months',
    nipun_target: 'NIPUN Lakshya (Class 3): Child reads analog clock time (hours and half hours) and recites 12 calendar months in Santali and Hindi.',
    materials: ['Demonstration analog clock with movable hands', 'Calendar chart (12 months)', 'Daily schedule timetable'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक घड़ी दिखाकर पूछें: "स्कूल की घंटी कब बजती है? 9 बजे! छोटी सुई 9 पर और बड़ी सुई 12 पर!"', sat: 'ᱢᱟᱪᱮᱛ ᱜᱷᱩᱲᱤ ᱩᱫᱩᱜ ᱠᱟᱛᱮ: "ᱤᱥᱠᱩᱞ ᱛᱤᱱᱟᱹᱜ ᱵᱟᱡᱟᱣ ᱨᱮ ᱡᱷᱤᱡᱚᱜᱼᱟ? ᱙ ᱵᱟᱡᱟᱣ ᱨᱮ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'घड़ी और कैलेंडर के नियम सिखाएं:\n• छोटी सुई (घंटा) = ᱴᱟᱲᱟᱝ / ᱜᱷᱚᱱᱴᱟ\n• बड़ी सुई (मिनट) = ᱴᱤᱯᱤᱡ / ᱢᱤᱱᱤᱴ\n• 1 घंटे में 60 मिनट (1 ᱴᱟᱲᱟᱝ = 60 ᱴᱤᱯᱤᱡ)\n• 1 साल में 12 महीने: ᱢᱟᱜᱷ, ᱯᱷᱟᱹᱜᱩᱱ, ᱪᱟᱹᱛ, ᱵᱟᱹᱭᱥᱟᱹᱠ, ᱡᱷᱮᱴ, ᱟᱥᱟᱲ, ᱥᱟᱱ, ᱵᱷᱟᱫᱚᱨ, ᱫᱟᱥᱟᱸᱭ, ᱥᱚᱦᱨᱟᱭ, ᱟᱜᱷᱟᱬ, ᱯᱩᱥ', sat: 'ᱜᱷᱩᱲᱤ ᱟᱨ ᱪᱟᱸᱫᱚ ᱪᱮᱫ ᱢᱮ:\n• ᱦᱩᱰᱤᱧ ᱠᱟᱹᱴᱩᱵ = ᱴᱟᱲᱟᱝ (Hour)\n• ᱢᱟᱨᱟᱝ ᱠᱟᱹᱴᱩᱵ = ᱴᱤᱯᱤᱡ (Minute)\n• ᱑᱒ ᱪᱟᱸᱫᱚ: ᱢᱟᱜᱷ, ᱯᱷᱟᱹᱜᱩᱱ, ᱪᱟᱹᱛ, ᱵᱟᱹᱭᱥᱟᱹᱠ, ᱡᱷᱮᱴ, ᱟᱥᱟᱲ, ᱥᱟᱱ, ᱵᱷᱟᱫᱚᱨ, ᱫᱟᱥᱟᱸᱭ, ᱥᱚᱦᱨᱟᱭ, ᱟᱜᱷᱟᱬ, ᱯᱩᱥ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'घड़ी में समय दिखाना: शिक्षक मॉडल घड़ी में सुई 3:00 पर रखें, बच्चे ज़ोर से बोलें "3:00 बजे! ᱯᱮ ᱵᱟᱡᱟᱣ ᱮᱱᱟ!"।', sat: 'ᱜᱷᱩᱲᱤ ᱨᱮ ᱚᱠᱛᱚ ᱩᱫᱩᱜ: ᱢᱟᱪᱮᱛ ᱓:᱐᱐ ᱥᱩᱭ ᱫᱚᱦᱚ → ᱜᱤᱫᱽᱨᱟᱹ "ᱯᱮ ᱵᱟᱡᱟᱣ ᱮᱱᱟ!" ᱢᱮᱱ ᱢᱮ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'अपनी दिनचर्या की तालिका बनाना: "मैं सुबह 6:00 बजे उठता हूँ, 9:00 बजे स्कूल आता हूँ, 4:00 बजे खेलता हूँ।"', sat: 'ᱫᱤᱱᱟᱹᱢ ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ ᱚᱞ: ᱥᱮᱛᱟᱜ ᱖ ᱵᱟᱡᱟᱣ ᱵᱮᱨᱮᱫ, ᱙ ᱵᱟᱡᱟᱣ ᱤᱥᱠᱩᱞ, ᱔ ᱵᱟᱡᱟᱣ ᱮᱱᱮᱡ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'घर की दीवार घड़ी देखकर रात के भोजन का समय नोट करके कल लाएं।', sat: 'ᱚᱲᱟᱜ ᱜᱷᱩᱲᱤ ᱧᱮᱞ ᱠᱟᱛᱮ ᱧᱤᱫᱟᱹ ᱫᱟᱠᱟ ᱡᱚᱢ ᱚᱠᱛᱚ ᱚᱞ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'छोटी सुई 5 पर और बड़ी सुई 12 पर हो तो समय कितना हुआ?', question_sat: 'ᱦᱩᱰᱤᱧ ᱠᱟᱹᱴᱩᱵ ᱕ ᱨᱮ ᱟᱨ ᱢᱟᱨᱟᱝ ᱠᱟᱹᱴᱩᱵ ᱑᱒ ᱨᱮ ᱠᱷᱟᱱ ᱛᱤᱱᱟᱹᱜ ᱵᱟᱡᱟᱣ ᱮᱱᱟ?', answer_hin: '5:00 बजे = ᱢᱚᱬᱮ ᱵᱟᱡᱟᱣ (5 o\'clock)', answer_sat: 'ᱛᱮᱞᱟ: ᱕:᱐᱐ ᱵᱟᱡᱟᱣ' },
      { question_hin: '1 साल में कितने महीने होते हैं?', question_sat: 'ᱢᱤᱫ ᱥᱮᱨᱢᱟ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱪᱟᱸᱫᱚ ᱛᱟᱦᱮᱸᱱᱟ?', answer_hin: '12 महीने = ᱑᱒ ᱪᱟᱸᱫᱚ', answer_sat: 'ᱛᱮᱞᱟ: ᱑᱒ ᱪᱟᱸᱫᱚ' },
      { question_hin: '1 घंटे में कितने मिनट होते हैं?', question_sat: 'ᱢᱤᱫ ᱴᱟᱲᱟᱝ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱴᱤᱯᱤᱡ ᱦᱩᱭᱩᱜᱼᱟ?', answer_hin: '60 मिनट = ᱖᱐ ᱴᱤᱯᱤᱡ', answer_sat: 'ᱛᱮᱞᱟ: ᱖᱐ ᱴᱤᱯᱤᱡ' },
    ],
  },

  'Class 3||Numeracy||4': {
    title_hin: 'दैनिक जीवन और हाट बाजार के व्यावहारिक शब्द प्रश्न (ᱦᱟᱴ ᱟᱨ ᱟᱹᱛᱩ ᱡᱤᱭᱚᱱ ᱮᱞᱠᱷᱟ)',
    title_sat: 'ᱦᱟᱴ ᱟᱨ ᱫᱤᱱᱟᱹᱢ ᱡᱤᱭᱚᱱ ᱨᱮᱱᱟᱜ ᱵᱮᱵᱷᱟᱨᱤᱠ ᱮᱞᱠᱷᱟ ᱵᱟᱹᱦᱱᱟᱹ',
    grade: 'Class 3', subject: 'Foundational Numeracy',
    topic: 'Word Problems: Market & Village Life',
    nipun_target: 'NIPUN Lakshya (Class 3): Child reads and solves multi-step contextual word problems involving addition, subtraction and multiplication in village market scenarios.',
    materials: ['Mock village market price chart (चार्ट)', 'Play money tokens (₹)', 'Word problem task cards'],
    sections: [
      { step: 1, step_name: 'Adarsh (Ideation)', step_sat: 'ᱟᱫᱚᱨᱥᱚ', icon: '🌟', duration: '5 min', hin: 'शिक्षक हाट बाजार का दृश्य बनाएं: "रविवार को हाट में धान, सब्जियां और गुड़ बिकते हैं। हिसाब सही नहीं लगाएंगे तो नुकसान होगा! आज हम हाट का हिसाब सीखेंगे।"', sat: 'ᱢᱟᱪᱮᱛ ᱦᱟᱴ ᱨᱮᱱᱟᱜ ᱠᱟᱛᱷᱟ ᱞᱟᱹᱭ ᱢᱮ: "ᱦᱟᱴ ᱨᱮ ᱪᱟᱣᱞᱮ, ᱜᱩᱲ ᱟᱨ ᱩᱞ ᱦᱤᱥᱟᱹᱵᱽ ᱵᱚᱱ ᱪᱮᱫᱟ!"' },
      { step: 2, step_name: 'Bodhan (Conceptualization)', step_sat: 'ᱵᱳᱫᱷᱚᱱ', icon: '💡', duration: '10 min', hin: 'शब्द समस्या हल करने के 4 चरण सिखाएं:\n1) प्रश्न ध्यान से पढ़ो (ᱪᱮᱫ ᱠᱩᱞᱤ ᱟᱠᱟᱱᱟ?)\n2) संख्याएं पहचानो (ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱢᱮᱱᱟᱜᱼᱟ?)\n3) संक्रिया चुनो (+ जोड़, - घटाव, × गुणा)\n4) हल करो और उत्तर जांचो', sat: 'ᱮᱞᱠᱷᱟ ᱦᱟᱹᱞ ᱨᱮᱱᱟᱜ ᱔ ᱰᱟᱦᱟᱨ:\n᱑) ᱠᱩᱠᱞᱤ ᱵᱷᱟᱹᱜᱤ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ\n᱒) ᱮᱞᱠᱷᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ\n᱓) ᱡᱚᱲᱟᱣ (+), ᱜᱷᱟᱴᱟᱣ (-), ᱜᱩᱬᱟᱹᱣ (×) ᱵᱟᱪᱷᱟᱣ ᱢᱮ\n᱔) ᱦᱟᱹᱞ ᱠᱟᱛᱮ ᱛᱮᱞᱟ ᱧᱟᱢ ᱢᱮ' },
      { step: 3, step_name: 'Abhyas (Practice)', step_sat: 'ᱟᱵᱷᱭᱟᱥ', icon: '🎯', duration: '8 min', hin: 'समस्या 1: "रोहन ने ₹45 का तेल और ₹38 का गुड़ खरीदा। उसने दुकानदार को ₹100 दिए। दुकानदार कितने रुपये वापस करेगा?"\nहल: 45 + 38 = ₹83 खर्च। 100 - 83 = ₹17 वापस।', sat: 'ᱮᱞᱠᱷᱟ: ᱔᱕ ᱴᱟᱠᱟ ᱥᱩᱱᱩᱢ + ᱓᱘ ᱴᱟᱠᱟ ᱜᱩᱲ = ᱘᱓ ᱴᱟᱠᱟ᱾ ᱑᱐᱐ - ᱘᱓ = ᱑᱗ ᱴᱟᱠᱟ ᱨᱩᱣᱟᱹᱲ᱾' },
      { step: 4, step_name: 'Prayog (Application)', step_sat: 'ᱯᱨᱟᱭᱳᱜ', icon: '🌍', duration: '7 min', hin: 'समस्या 2: "एक किसान ने 4 बकरियां ₹800 प्रति बकरी के हिसाब से बेचीं। उसे कुल कितने रुपये मिले?" 4 × 800 = ₹3200 (᱓᱒᱐᱐ ᱴᱟᱠᱟ)।', sat: 'ᱮᱞᱠᱷᱟ: ᱔ ᱢᱮᱨᱚᱢ ᱘᱐᱐ ᱴᱟᱠᱟ ᱫᱚᱨ ᱛᱮ ᱟᱹᱠᱷᱨᱤᱧ ᱮᱱᱟ᱾ ᱔ × ᱘᱐᱐ = ᱓᱒᱐᱐ ᱴᱟᱠᱟ ᱧᱟᱢ ᱮᱱᱟ᱾' },
      { step: 5, step_name: 'Prasaran (Extension)', step_sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', icon: '🚀', duration: '5 min', hin: 'बच्चे अपने घर के साप्ताहिक हाट के खर्च का एक शब्द प्रश्न खुद बनाकर लाएं।', sat: 'ᱚᱲᱟᱜ ᱨᱮ ᱦᱟᱯᱛᱟᱠᱤᱭᱟᱹ ᱦᱟᱴ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱮᱞᱠᱷᱟ ᱠᱩᱠᱞᱤ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱟᱹᱜᱩᱭ ᱢᱮ᱾' },
    ],
    assessment_prompts: [
      { question_hin: 'सुनिता ने 5 पेन ₹10 प्रत्येक के हिसाब से खरीदे। कुल खर्च कितना?', question_sat: 'ᱥᱩᱱᱤᱛᱟ ᱕ ᱯᱮᱱ ᱑᱐ ᱴᱟᱠᱟ ᱫᱚᱨ ᱛᱮ ᱠᱤᱨᱤᱧ ᱠᱮᱫᱼᱟ᱾ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ?', answer_hin: '5 × 10 = ₹50 (᱕᱐ ᱴᱟᱠᱟ)', answer_sat: 'ᱛᱮᱞᱟ: ᱕᱐ ᱴᱟᱠᱟ' },
      { question_hin: 'टोकरी में 120 अमरूद थे, 45 बेच दिए। कितने बचे?', question_sat: '᱑᱒᱐ ᱥᱚᱯᱨᱤ ᱠᱷᱚᱱ ᱔᱕ ᱟᱹᱠᱷᱨᱤᱧ ᱮᱱᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ?', answer_hin: '120 - 45 = 75 अमरूद (᱗᱕)', answer_sat: 'ᱛᱮᱞᱟ: ᱗᱕' },
      { question_hin: 'शब्द समस्या हल करते समय पहला कदम क्या है?', question_sat: 'ᱮᱞᱠᱷᱟ ᱵᱟᱹᱦᱱᱟᱹ ᱦᱟᱹᱞ ᱚᱠᱛᱚ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱪᱤᱠᱟᱹ ᱞᱟᱹᱠᱛᱤᱜᱼᱟ?', answer_hin: 'प्रश्न को ध्यान से पढ़ना और समझना', answer_sat: 'ᱛᱮᱞᱟ: ᱠᱩᱠᱞᱤ ᱵᱷᱟᱹᱜᱤ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ' },
    ],
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getLessonKey(grade: string, subject: string, topicIndex: number): string {
  const subjectKey = subject.includes('Literacy') ? 'Literacy' : 'Numeracy';
  return `${grade}||${subjectKey}||${topicIndex}`;
}

function getTopicsForGradeSubject(grade: string, subject: string): string[] {
  const curriculumSubjects = CURRICULUM[grade] || {};
  for (const [key, topics] of Object.entries(curriculumSubjects)) {
    if (subject.includes('Literacy') && key.includes('Literacy')) return topics;
    if (subject.includes('Numeracy') && key.includes('Numeracy')) return topics;
  }
  return [];
}

const STEP_COLORS: Record<number, { bg: string; border: string; header: string; label: string }> = {
  1: { bg: '#fef3c7', border: '#fcd34d', header: '#92400e', label: '#b45309' },
  2: { bg: '#dbeafe', border: '#93c5fd', header: '#1e40af', label: '#1d4ed8' },
  3: { bg: '#d1fae5', border: '#6ee7b7', header: '#065f46', label: '#047857' },
  4: { bg: '#ede9fe', border: '#c4b5fd', header: '#5b21b6', label: '#7c3aed' },
  5: { bg: '#fce7f3', border: '#f9a8d4', header: '#9d174d', label: '#be185d' },
};

// ============================================================
// COMPONENT
// ============================================================

const Lessons: React.FC = () => {
  const [grade, setGrade] = useState('Class 1');
  const [subject, setSubject] = useState('ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Foundational Literacy)');
  const [topicIndex, setTopicIndex] = useState(0);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(1); // Open step 1 by default
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  const availableSubjects = Object.keys(CURRICULUM[grade] || {});
  const availableTopics = getTopicsForGradeSubject(grade, subject);

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    const firstSubject = Object.keys(CURRICULUM[newGrade] || {})[0] || '';
    setSubject(firstSubject);
    setTopicIndex(0);
    setLesson(null);
    setOpenSection(1);
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    setTopicIndex(0);
    setLesson(null);
    setOpenSection(1);
  };

  const handleGenerate = async () => {
    sfx.playGenerate();
    setIsGenerating(true);
    setOpenSection(1);
    setShowAnswers({});

    // Local instant retrieval from complete database
    const key = getLessonKey(grade, subject, topicIndex);
    const preset = LESSON_DB[key];

    if (preset) {
      await new Promise(r => setTimeout(r, 400));
      setLesson(preset);
      setIsGenerating(false);
      sfx.playSuccess();
      return;
    }

    // Fallback if key missing
    const subjectKey = subject.includes('Literacy') ? 'Literacy' : 'Numeracy';
    const fallbackKey = `${grade}||${subjectKey}||0`;
    const fallback = LESSON_DB[fallbackKey];
    setLesson(fallback || null);
    setIsGenerating(false);
  };

  const playVoice = (text: string) => {
    sfx.playVoicePing();
    speakText(text, { rate: 0.85 });
  };

  const toggleSection = (idx: number) => {
    sfx.playTap();
    setOpenSection(openSection === idx ? null : idx);
  };

  const toggleAnswer = (idx: number) => {
    if (!showAnswers[idx]) sfx.playSuccess();
    else sfx.playTap();
    setShowAnswers(s => ({ ...s, [idx]: !s[idx] }));
  };

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    sfx.playTap();
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 1000);
    }, 200);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div className="no-print">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          📚 NIPUN Bharat Panchaadi (5-Step) Lesson Studio
        </div>
        <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
          Bilingual Lesson Generator
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Generates structured <strong>Panchaadi</strong> (Adarsh → Bodhan → Abhyas → Prayog → Prasaran) lesson plans based on NIPUN Bharat Lakshyas with real Ol Chiki bilingual content.
        </p>
      </div>

      {/* NIPUN Framework Quick Reference */}
      <div className="no-print panchaadi-overview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {[
          { step: '1', name: 'Adarsh', sat: 'ᱟᱫᱚᱨᱥᱚ', desc: 'Connect to child\'s life', icon: '🌟', color: '#fef3c7' },
          { step: '2', name: 'Bodhan', sat: 'ᱵᱳᱫᱷᱚᱱ', desc: 'Teach core concept', icon: '💡', color: '#dbeafe' },
          { step: '3', name: 'Abhyas', sat: 'ᱟᱵᱷᱭᱟᱥ', desc: 'Guided practice', icon: '🎯', color: '#d1fae5' },
          { step: '4', name: 'Prayog', sat: 'ᱯᱨᱟᱭᱳᱜ', desc: 'Apply in context', icon: '🌍', color: '#ede9fe' },
          { step: '5', name: 'Prasaran', sat: 'ᱯᱨᱟᱥᱟᱨᱚᱱ', desc: 'Creative extension', icon: '🚀', color: '#fce7f3' },
        ].map(s => (
          <div key={s.step} style={{ backgroundColor: s.color, borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b' }}>{s.name}</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{s.sat}</div>
            <div style={{ fontSize: '0.62rem', color: '#475569', marginTop: '2px' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Generator Panel */}
      <div className="no-print generator-panel" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,39,68,0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 1rem', color: '#0f2744', fontSize: '1rem', fontWeight: 800 }}>
          ⚙️ Select Grade, Domain & NIPUN Competency
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Grade */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Grade / NIPUN Level:
            </label>
            <select value={grade} onChange={e => handleGradeChange(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f2744', backgroundColor: '#f8fafc', outline: 'none' }}>
              <option value="Balvatika">🧸 Balvatika (Pre-Primary / FLN L1)</option>
              <option value="Class 1">🎒 Class 1 (FLN Level 2)</option>
              <option value="Class 2">📖 Class 2 (FLN Level 3)</option>
              <option value="Class 3">🧮 Class 3 (FLN Level 4)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              FLN Domain:
            </label>
            <select value={subject} onChange={e => handleSubjectChange(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f2744', backgroundColor: '#f8fafc', outline: 'none' }}>
              {availableSubjects.map(s => (
                <option key={s} value={s}>{s.includes('Literacy') ? '📖' : '🔢'} {s}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              NIPUN Lakshya / Lesson Topic:
            </label>
            <select value={topicIndex} onChange={e => { setTopicIndex(Number(e.target.value)); setLesson(null); }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, color: '#c05621', backgroundColor: '#f8fafc', outline: 'none' }}>
              {availableTopics.map((t, i) => (
                <option key={i} value={i}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NIPUN Target badge */}
        {availableTopics[topicIndex] && (
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', fontSize: '0.82rem', color: '#0369a1' }}>
            <strong>📌 Selected:</strong> {grade} → {subject.includes('Literacy') ? 'ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Literacy)' : 'ᱮᱞᱠᱷᱟ ᱵᱩᱡᱷᱟᱣ (Numeracy)'} → <em>{availableTopics[topicIndex]}</em>
          </div>
        )}

        <button onClick={handleGenerate} disabled={isGenerating}
          style={{ width: '100%', backgroundColor: isGenerating ? '#64748b' : '#0f2744', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: isGenerating ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(15,39,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
          {isGenerating ? '⏳ Generating Panchaadi Lesson Plan...' : '✨ Generate 5-Part NIPUN Lesson Plan ➔'}
        </button>
      </div>

      {/* Lesson Output */}
      {lesson && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Official Printable Sheet Header */}
          <div style={{ display: isPrinting ? 'block' : 'none', borderBottom: '2px solid #0f2744', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Government of Jharkhand • Department of School Education & Literacy
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2744' }}>
              PALASH MTB-MLE: 5-Part Panchaadi Bilingual Lesson Plan
            </div>
          </div>

          {/* Lesson Title Card */}
          <div className="print-card" style={{ background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)', borderRadius: '16px', padding: '1.5rem', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                  {lesson.grade} • {lesson.subject} • NIPUN Bharat MTB-MLE
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  📄 {lesson.title_hin}
                </h2>
                <div style={{ fontSize: '1rem', color: '#fed7aa', fontWeight: 700, marginTop: '4px', fontFamily: 'serif' }}>
                  {lesson.title_sat}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={handlePrint} className="no-print" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', color: '#ffffff', cursor: 'pointer' }}>
                  🖨️ Print / PDF
                </button>
              </div>
            </div>

            {/* NIPUN Target */}
            <div style={{ marginTop: '1rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#bae6fd', border: '1px solid rgba(255,255,255,0.1)' }}>
              🎯 <strong>NIPUN Lakshya:</strong> {lesson.nipun_target}
            </div>

            {/* Materials */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>📦 Materials Needed:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {lesson.materials.map((m, i) => (
                  <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#e2e8f0' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Panchaadi Steps (Accordion) */}
          {lesson.sections.map((section) => {
            const colors = STEP_COLORS[section.step];
            const isOpen = isPrinting || openSection === section.step;
            return (
              <div key={section.step} style={{ borderRadius: '14px', border: `1px solid ${colors.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(section.step)}
                  style={{ width: '100%', backgroundColor: colors.bg, border: 'none', padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: colors.label, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Step {section.step} • ⏱️ {section.duration}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: colors.header }}>
                        {section.step_name} ({section.step_sat})
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.2rem', color: colors.label, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    ▼
                  </span>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div style={{ backgroundColor: '#ffffff', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Hindi Script */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          🇮🇳 Hindi (Teacher Instruction)
                        </span>
                        <button onClick={() => playVoice(section.hin)} className="no-print" style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#334155', cursor: 'pointer', fontWeight: 700 }}>
                          🔊 Listen Hindi
                        </button>
                      </div>
                      <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 14px', fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.65, whiteSpace: 'pre-line', border: '1px solid #e2e8f0' }}>
                        {section.hin}
                      </div>
                    </div>

                    {/* Santali Script */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          🔤 Santali Ol Chiki (ᱢᱟᱪᱮᱛ ᱟᱲᱟᱝ)
                        </span>
                        <button onClick={() => playVoice(section.sat)} className="no-print" style={{ backgroundColor: '#fffaf0', border: '1px solid #fed7aa', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#c05621', cursor: 'pointer', fontWeight: 700 }}>
                          🔊 Listen Santali
                        </button>
                      </div>
                      <div style={{ backgroundColor: '#fffaf0', borderRadius: '10px', padding: '12px 14px', fontSize: '0.9rem', color: '#92400e', lineHeight: 1.65, whiteSpace: 'pre-line', border: '1px solid #fed7aa', fontFamily: 'serif', fontWeight: 600 }}>
                        {section.sat}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* NIPUN Assessment Prompts */}
          <div className="print-card" style={{ backgroundColor: '#fffaf0', borderRadius: '16px', padding: '1.5rem', border: '2px solid #fed7aa', boxShadow: '0 4px 12px rgba(237,137,54,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.4rem' }}>📝</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#c05621' }}>
                  NIPUN Oral Assessment Prompts (ᱢᱚᱪᱟ ᱠᱩᱠᱞᱤ)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#7c2d12', fontWeight: 600 }}>
                  3 formative oral questions — tap to reveal answers
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lesson.assessment_prompts.map((p, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fbd38d', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#0f2744', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Q{idx + 1}: {p.question_hin}
                    </div>
                    <div style={{ color: '#c05621', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'serif' }}>
                      {p.question_sat}
                    </div>
                    <button onClick={() => toggleAnswer(idx)} className="no-print" style={{ marginTop: '8px', backgroundColor: showAnswers[idx] ? '#dcfce7' : '#f1f5f9', border: `1px solid ${showAnswers[idx] ? '#86efac' : '#cbd5e1'}`, padding: '5px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: showAnswers[idx] ? '#166534' : '#334155', cursor: 'pointer' }}>
                      {showAnswers[idx] ? '🔽 Hide Answer' : '👁️ Show Answer'}
                    </button>
                  </div>
                  {(showAnswers[idx] || isPrinting) && (
                    <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderTop: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 700 }}>✅ {p.answer_hin}</div>
                      <div style={{ fontSize: '0.88rem', color: '#065f46', fontWeight: 600, fontFamily: 'serif' }}>{p.answer_sat}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!lesson && !isGenerating && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📚</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f2744', marginBottom: '6px' }}>Select Grade, Domain & Topic</div>
          <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Then click <strong>Generate 5-Part NIPUN Lesson Plan</strong> to create a complete Panchaadi lesson with bilingual Ol Chiki content.
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;
