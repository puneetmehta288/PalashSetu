import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sfx } from '../utils/sfx';
import { getActiveTribalLanguage } from '../services/tribalCurriculumAdapter';
import { TribalLanguage, TRIBAL_LANGUAGES } from '../types';
import { translateHindiToHo } from '../data/ho_dictionary';
import { translateHindiToMundari } from '../data/mundari_dictionary';
import { authService } from '../services/authService';
import { classroomService, WorksheetSubmission, StudentAnswerItem } from '../services/classroomService';

// ════════════════════════════════════════════════════════════════════════════
// NIPUN Bharat Grade-Adaptive Worksheet Generator
// Research: NCF Foundational Stage 2022, NIPUN Bharat Lakshyas
// Covers: Balvatika (FLN L1) → Class 3 (FLN L4)
// Both FLN Domains: Foundational Literacy + Foundational Numeracy
// ════════════════════════════════════════════════════════════════════════════

interface Question {
  id: number;
  question_hin: string;
  question_sat: string;
  options?: string[];
  correct_answer: string;
  type: string;
  hint?: string;
}

interface DrillTypeOption {
  id: string;
  label: string;
  desc: string;
  nipunRef: string;
}

// ─────────────────────────────────────────────
// GRADE × SUBJECT × DRILL TYPE MAP
// ─────────────────────────────────────────────
const GRADE_DRILL_TYPES: Record<string, Record<string, DrillTypeOption[]>> = {
  Balvatika: {
    'Foundational Numeracy': [
      { id: 'bal_counting', label: '🍎 Visual Object Counting 1–5', desc: 'Count emojis → write Ol Chiki digit', nipunRef: 'Balvatika Numeracy: 1–1 correspondence, count 1–5' },
      { id: 'bal_shapes', label: '⭕ 2D Shape Recognition (ᱜᱩᱞ, ᱪᱟᱹᱨᱠᱷᱤ, ᱯᱮ ᱠᱳᱬ)', desc: 'Identify Circle, Square, Triangle, Star', nipunRef: 'Balvatika Numeracy: Recognize shapes in environment' },
      { id: 'bal_comparison', label: '⚖️ Big vs Small Comparison (ᱢᱟᱨᱟᱝ/ᱦᱩᱰᱤᱧ)', desc: 'Pre-number comparison: Big / Small / More / Less', nipunRef: 'Balvatika Numeracy: Comparison concepts' },
      { id: 'bal_patterns', label: '🎯 AB Pattern Recognition (ᱯᱮᱴᱟᱨᱱ)', desc: 'Complete simple 2-item repeating pattern', nipunRef: 'Balvatika Numeracy: Identify and continue patterns' },
    ],
    'Foundational Literacy': [
      { id: 'bal_vocab_animals', label: '🐾 Animal Names in Santali (ᱡᱤᱵᱽ ᱧᱩᱛᱩᱢ)', desc: 'Match animal emoji to Santali name', nipunRef: 'BOX2: Uses class-theme vocabulary in conversation' },
      { id: 'bal_vocab_body', label: '🧍 Body Parts Matching (ᱦᱚᱲ ᱜᱟᱹᱭ)', desc: 'Match body part emoji to Santali word', nipunRef: 'BOX1: Communicates needs; BOX2: Theme vocabulary' },
    ],
  },
  'Class 1': {
    'Foundational Numeracy': [
      { id: 'c1_addition', label: '➕ Single-Digit Addition 1–9 (ᱡᱚᱲᱟᱣ)', desc: 'Basic addition sums up to 20', nipunRef: 'Grade 1 Numeracy: Add single digits, sums up to 20' },
      { id: 'c1_subtraction', label: '➖ Single-Digit Subtraction 1–9 (ᱜᱷᱟᱴᱟᱣ)', desc: 'Subtraction within 9', nipunRef: 'Grade 1 Numeracy: Subtract single digits up to 9' },
      { id: 'c1_counting', label: '🔢 Ol Chiki Number Names 1–10', desc: 'Match Hindi number to Santali Ol Chiki name', nipunRef: 'Grade 1 Numeracy: Read & write numbers 1–99' },
      { id: 'c1_sequence', label: '🔍 Missing Number in Sequence', desc: 'Fill in the missing number in 1–20 sequence', nipunRef: 'Grade 1 Numeracy: Number sequences 1–20' },
      { id: 'c1_patterns', label: '🎯 Number Patterns (Even / Odd)', desc: 'Identify even/odd, forward/backward sequences', nipunRef: 'Grade 1 Numeracy: Number patterns' },
    ],
    'Foundational Literacy': [
      { id: 'c1_olchiki_letters', label: '🔤 Ol Chiki Letter Identification', desc: 'Identify Ol Chiki letters and their sounds', nipunRef: 'Grade 1 Literacy: Letter recognition & sound correspondence' },
      { id: 'c1_word_match', label: '🔡 Santali–Hindi Word Match', desc: 'Match Santali word with its Hindi meaning', nipunRef: 'Grade 1 Literacy: Read 4–5 word sentences; vocabulary' },
    ],
  },
  'Class 2': {
    'Foundational Numeracy': [
      { id: 'c2_addition', label: '➕ 2-Digit Addition without Regrouping', desc: '2-digit sums up to 99', nipunRef: 'Grade 2 Numeracy: 2-digit addition up to 99' },
      { id: 'c2_subtraction', label: '➖ 2-Digit Subtraction', desc: '2-digit subtraction drills', nipunRef: 'Grade 2 Numeracy: 2-digit subtraction up to 99' },
      { id: 'c2_place_value', label: '📊 Place Value: Tens & Ones (ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ)', desc: 'Decompose numbers into Tens and Ones', nipunRef: 'Grade 2 Numeracy: Place value up to 999' },
      { id: 'c2_multiplication_intro', label: '✖️ Repeated Addition → Multiplication', desc: 'Foundation for times tables', nipunRef: 'Grade 2 Numeracy: Introduction to multiplication concept' },
      { id: 'c2_money', label: '💰 Indian Coins & Rupee Math (ᱴᱟᱠᱟ)', desc: 'Count rupee denominations', nipunRef: 'Grade 2 Numeracy: Money & measurement' },
    ],
    'Foundational Literacy': [
      { id: 'c2_opposites', label: '↔️ Opposites Vocabulary (ᱩᱞᱴᱟ ᱥᱮᱨᱮᱧ)', desc: 'Day/Night, Hot/Cold, Big/Small pairs', nipunRef: 'Grade 2 Literacy: Vocabulary pairs, 30–45 WPM target' },
      { id: 'c2_reading_comp', label: '📖 Short Story Comprehension Questions', desc: 'Bilingual reading comprehension drill', nipunRef: 'Grade 2 Literacy: Re-tell 8–10 sentence story; 30–45 WPM' },
    ],
  },
  'Class 3': {
    'Foundational Numeracy': [
      { id: 'c3_3digit_add', label: '➕ 3-Digit Addition & Subtraction (up to 999)', desc: 'Column arithmetic up to 999', nipunRef: 'Grade 3 Numeracy: Multi-digit addition & subtraction' },
      { id: 'c3_tables', label: '✖️ Multiplication Tables 2–10 in Ol Chiki', desc: 'Times tables in Santali numerals', nipunRef: 'Grade 3 Numeracy: Multiplication tables 2–10' },
      { id: 'c3_division', label: '➗ Equal Sharing Division (ᱵᱟᱝᱜᱤ ᱦᱟᱹᱴᱤᱧ)', desc: 'Division as fair sharing — village context', nipunRef: 'Grade 3 Numeracy: Division as equal sharing' },
      { id: 'c3_time', label: '🕒 Clock Time & Calendar Months (ᱚᱠᱛᱚ)', desc: 'Read hours; name months', nipunRef: 'Grade 3 Numeracy: Time measurement — hours & minutes' },
      { id: 'c3_word_problems', label: '🧮 Village Life Word Problems (ᱠᱟᱹᱦᱱᱤ ᱵᱟᱹᱦᱱᱟᱹ)', desc: 'Bilingual contextual story problems', nipunRef: 'Grade 3 Numeracy: Apply math to daily-life situations' },
    ],
    'Foundational Literacy': [
      { id: 'c3_comprehension', label: '📚 Reading Comprehension (60 WPM NIPUN)', desc: 'Unknown text + 3 comprehension questions', nipunRef: 'Grade 3 NIPUN Lakshya: 60 WPM from unknown text' },
      { id: 'c3_sentence_write', label: '✍️ Bilingual Sentence Construction', desc: 'Write 3 sentences about home/village in Ol Chiki + Hindi', nipunRef: 'Grade 3 Literacy: Write with purpose and clarity' },
    ],
  },
};

// ─────────────────────────────────────────────
// QUESTION GENERATORS
// ─────────────────────────────────────────────

const SANTALI_NUMS = ['ᱢᱤᱫ', 'ᱵᱟᱨ', 'ᱯᱮ', 'ᱯᱩᱱ', 'ᱢᱚᱬᱮ', 'ᱛᱩᱨᱩᱭ', 'ᱮᱭᱟᱭ', 'ᱤᱨᱞ', 'ᱟᱨᱮ', 'ᱜᱮᱞ'];
const OL_DIGITS = ['᱐', '᱑', '᱒', '᱓', '᱔', '᱕', '᱖', '᱗', '᱘', '᱙', '᱑᱐'];

const ANIMAL_VOCAB = [
  { emoji: '🐮', hin: 'गाय', sat: 'ᱜᱟᱹᱭ', pron: 'Gaay' },
  { emoji: '🐐', hin: 'बकरी', sat: 'ᱢᱮᱨᱚᱢ', pron: 'Merom' },
  { emoji: '🐘', hin: 'हाथी', sat: 'ᱦᱟᱹᱛᱤ', pron: 'Haati' },
  { emoji: '🐟', hin: 'मछली', sat: 'ᱦᱟᱹᱠᱩ', pron: 'Haaku' },
  { emoji: '🐶', hin: 'कुत्ता', sat: 'ᱥᱮᱛᱟ', pron: 'Seta' },
  { emoji: '🐔', hin: 'मुर्गी', sat: 'ᱥᱤᱢ', pron: 'Sim' },
  { emoji: '🐵', hin: 'बंदर', sat: 'ᱜᱟᱹᱰᱤ', pron: 'Gaadi' },
  { emoji: '🐱', hin: 'बिल्ली', sat: 'ᱯᱩᱥᱤ', pron: 'Pusi' },
];

const BODY_VOCAB = [
  { emoji: '👁️', hin: 'आंख', sat: 'ᱢᱮᱫ', pron: 'Med' },
  { emoji: '👃', hin: 'नाक', sat: 'ᱢᱩᱸ', pron: 'Mu' },
  { emoji: '✋', hin: 'हाथ', sat: 'ᱛᱤ', pron: 'Ti' },
  { emoji: '👄', hin: 'मुंह', sat: 'ᱢᱚᱪᱟ', pron: 'Mocha' },
  { emoji: '👂', hin: 'कान', sat: 'ᱞᱩᱛᱩᱨ', pron: 'Lutur' },
  { emoji: '🦶', hin: 'पैर', sat: 'ᱡᱟᱝᱜᱟ', pron: 'Janga' },
];

const OLCHIKI_LETTERS = [
  { letter: 'ᱚ', sound: 'O', example: 'ᱚᱞ (Ol)' },
  { letter: 'ᱛ', sound: 'T', example: 'ᱛᱤ (Hand)' },
  { letter: 'ᱜ', sound: 'G', example: 'ᱜᱟᱹᱭ (Cow)' },
  { letter: 'ᱟ', sound: 'A', example: 'ᱟᱢ (Mango)' },
  { letter: 'ᱡ', sound: 'J', example: 'ᱡᱚᱦᱟᱨ (Hello)' },
  { letter: 'ᱢ', sound: 'M', example: 'ᱢᱮᱫ (Eye)' },
  { letter: 'ᱯ', sound: 'P', example: 'ᱯᱩᱛᱷᱤ (Book)' },
  { letter: 'ᱦ', sound: 'H', example: 'ᱦᱚᱲ (Person)' },
  { letter: 'ᱠ', sound: 'K', example: 'ᱠᱟᱹᱦᱱᱤ (Story)' },
  { letter: 'ᱥ', sound: 'S', example: 'ᱥᱤᱢ (Hen)' },
];

const WORD_PAIRS_HIN_SAT = [
  { hin: 'दिन', sat: 'ᱢᱟᱦᱟ', opp_hin: 'रात', opp_sat: 'ᱧᱤᱸᱫᱟᱹ' },
  { hin: 'बड़ा', sat: 'ᱢᱟᱨᱟᱝ', opp_hin: 'छोटा', opp_sat: 'ᱦᱩᱰᱤᱧ' },
  { hin: 'गर्म', sat: 'ᱞᱚᱞᱚ', opp_hin: 'ठंडा', opp_sat: 'ᱨᱮᱭᱟᱲ' },
  { hin: 'आना', sat: 'ᱦᱤᱡᱩᱜ', opp_hin: 'जाना', opp_sat: 'ᱥᱮᱱᱚᱜ' },
  { hin: 'ऊपर', sat: 'ᱩᱯᱩᱨ', opp_hin: 'नीचे', opp_sat: 'ᱛᱟᱞᱮ' },
];

const CLASS3_STORIES = [
  {
    story_hin: 'सुनिता के घर में 3 गाय थीं। उसकी माँ ने 2 और गाय खरीदी। अब कुल कितनी गाय हैं?',
    story_sat: 'ᱥᱩᱱᱤᱛᱟᱟᱜ ᱜᱮᱦᱽ ᱨᱮ ᱯᱮ ᱜᱟᱹᱭ ᱠᱟᱱᱟᱭ᱾ ᱟᱢᱟᱜ ᱟᱹᱭᱩ ᱵᱟᱨ ᱜᱟᱹᱭ ᱟᱨᱚ ᱠᱤᱱᱮᱭᱟ᱾ ᱱᱤᱛᱚᱜ ᱡᱚᱛᱚ ᱛᱤᱱᱟᱹ ᱜᱟᱹᱭ ᱦᱩᱭᱩᱜᱼᱟ?',
    q_hin: 'सुनिता के घर में अब कुल कितनी गाय हैं?', q_sat: 'ᱥᱩᱱᱤᱛᱟᱟᱜ ᱜᱮᱦᱽ ᱨᱮ ᱱᱤᱛᱚᱜ ᱛᱤᱱᱟᱹ ᱜᱟᱹᱭ ᱦᱩᱭᱩᱜᱼᱟ?',
    answer: '5 गाय = ᱢᱚᱬᱮ ᱜᱟᱹᱭ', type: 'addition',
  },
  {
    story_hin: 'बाजार में रोहन के पास ₹50 थे। उसने ₹23 की दाल खरीदी। कितने रुपये बचे?',
    story_sat: 'ᱦᱟᱴ ᱨᱮ ᱨᱚᱦᱚᱱ ᱴᱷᱮᱱ ᱕᱐ ᱴᱟᱠᱟ ᱠᱟᱱᱟᱭ᱾ ᱒᱓ ᱴᱟᱠᱟᱟᱜ ᱫᱟᱹᱞᱤ ᱠᱤᱱᱮᱭᱟ᱾ ᱛᱤᱱᱟᱹ ᱴᱟᱠᱟ ᱥᱟᱨᱮᱲᱚᱜᱼᱟ?',
    q_hin: 'रोहन के पास कितने रुपये बचे?', q_sat: 'ᱨᱚᱦᱚᱱ ᱛᱤᱱᱟᱹ ᱴᱟᱠᱟ ᱥᱟᱨᱮᱲ ᱮᱱᱟ?',
    answer: '₹27 = ᱒᱗ ᱴᱟᱠᱟ', type: 'subtraction',
  },
  {
    story_hin: 'पेड़ पर 7 चिड़ियाँ बैठी थीं। 3 चिड़ियाँ उड़ गईं। अब पेड़ पर कितनी चिड़ियाँ हैं?',
    story_sat: 'ᱫᱟᱨᱮ ᱨᱮ ᱮᱭᱟᱭ (᱗) ᱪᱮᱬᱮ ᱫᱩᱲᱩᱵ ᱛᱟᱦᱮᱸᱠᱟᱱᱟᱠᱚ᱾ ᱯᱮ (᱓) ᱪᱮᱬᱮ ᱩᱰᱟᱹᱣ ᱮᱱᱟᱠᱚ᱾ ᱱᱤᱛᱚᱜ ᱫᱟᱨᱮ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱪᱮᱬᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ?',
    q_hin: 'पेड़ पर अब कितनी चिड़ियाँ बची हैं?', q_sat: 'ᱫᱟᱨᱮ ᱨᱮ ᱱᱤᱛᱚᱜ ᱛᱤᱱᱟᱹᱜ ᱪᱮᱬᱮ ᱥᱟᱨᱮᱲ ᱮᱱᱟᱠᱚ?',
    answer: '4 चिड़ियाँ = ᱯᱩᱱ ᱪᱮᱬᱮ', type: 'subtraction',
  },
  {
    story_hin: 'मीना के पास 4 पेंसिल थीं। शिक्षक ने उसे 4 और पेंसिल दीं। अब उसके पास कितनी पेंसिल हैं?',
    story_sat: 'ᱢᱤᱱᱟ ᱴᱷᱮᱱ ᱯᱩᱱ (᱔) ᱯᱮᱱᱥᱤᱞ ᱛᱟᱦᱮᱸᱠᱟᱱᱟ᱾ ᱢᱟᱪᱮᱛ ᱟᱨᱦᱚᱸ ᱯᱩᱱ (᱔) ᱯᱮᱱᱥᱤᱞ ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱱᱤᱛᱚᱜ ᱛᱤᱱᱟᱹᱜ ᱯᱮᱱᱥᱤᱞ ᱦᱩᱭᱮᱱᱟ?',
    q_hin: 'मीना के पास कुल कितनी पेंसिल हैं?', q_sat: 'ᱢᱤᱱᱟ ᱴᱷᱮᱱ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱯᱮᱱᱥᱤᱞ ᱢᱮᱱᱟᱜᱼᱟ?',
    answer: '8 पेंसिल = ᱤᱨᱞ ᱯᱮᱱᱥᱤᱞ', type: 'addition',
  },
];

function generateQuestions(questionType: string, numQuestions: number): Question[] {
  const generated: Question[] = [];

  for (let i = 1; i <= numQuestions; i++) {
    // ── BALVATIKA NUMERACY ──────────────────────────────────────────────
    if (questionType === 'bal_counting') {
      const count = Math.ceil((i % 5) + 1 > 5 ? 5 : (i % 5) + 1);
      const emojis = ['🐮', '🐐', '🍎', '🌸', '⭐', '🍌'];
      const em = emojis[i % emojis.length];
      const opt1 = `${count} = ${OL_DIGITS[count]}`;
      const opt2 = `${(count % 5) + 1} = ${OL_DIGITS[(count % 5) + 1]}`;
      const opt3 = `${count > 1 ? count - 1 : count + 2} = ${OL_DIGITS[count > 1 ? count - 1 : count + 2]}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `गिनो और Ol Chiki में लिखो: ${Array(count).fill(em).join(' ')} = ___`,
        question_sat: `ᱞᱮᱠᱷᱟᱭ ᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱞᱮᱠᱷᱮ: ${Array(count).fill(em).join(' ')} = ___`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Santali: ${SANTALI_NUMS[count - 1]}`,
      });
    }

    else if (questionType === 'bal_shapes') {
      const shapes = [
        { hin: 'गोला (Circle)', sat: 'ᱜᱩᱞ', emoji: '⭕' },
        { hin: 'चौकोर (Square)', sat: 'ᱪᱟᱹᱨᱠᱷᱤ', emoji: '⏹️' },
        { hin: 'तिकोना (Triangle)', sat: 'ᱯᱮ ᱠᱳᱬ', emoji: '🔺' },
        { hin: 'तारा (Star)', sat: 'ᱤᱯᱤᱞ', emoji: '⭐' },
      ];
      const s = shapes[i % shapes.length];
      const distractors = shapes.filter(x => x.hin !== s.hin).slice(0, 2).map(x => x.sat);
      generated.push({
        id: i, type: questionType,
        question_hin: `इस आकार का नाम संथाली में क्या है? ${s.emoji}`,
        question_sat: `ᱱᱚᱣᱟ ᱨᱩᱯᱟᱜ ᱥᱟᱱᱛᱟᱲᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫ? ${s.emoji}`,
        options: [s.sat, ...distractors].sort(() => Math.random() - 0.5),
        correct_answer: s.sat,
        hint: `Pronunciation: ${s.sat} (${s.hin})`,
      });
    }

    else if (questionType === 'bal_comparison') {
      const pairs = [
        { a: '🐘 हाथी', b: '🐜 चींटी', a_sat: 'ᱦᱟᱹᱛᱤ', b_sat: 'ᱠᱩᱨᱤ', bigger: '🐘 हाथी (ᱢᱟᱨᱟᱝ)' },
        { a: '🦒 जिराफ', b: '🐢 कछुआ', a_sat: 'ᱡᱤᱨᱟᱯᱷ', b_sat: 'ᱦᱚᱨᱚ', bigger: '🦒 जिराफ (ᱩᱥᱩᱞ)' },
        { a: '🍎🍎🍎 ३ सेब', b: '🍎 १ सेब', a_sat: 'ᱯᱮ ᱥᱮᱣ', b_sat: 'ᱢᱤᱫ ᱥᱮᱣ', bigger: '🍎🍎🍎 (ᱰᱷᱮᱨ)' },
      ];
      const p = pairs[i % pairs.length];
      generated.push({
        id: i, type: questionType,
        question_hin: `इनमें कौन बड़ा / ज़्यादा है? ${p.a} या ${p.b}`,
        question_sat: `ᱱᱚᱣᱟ ᱠᱤᱱ ᱨᱮ ᱚᱠᱚᱭ ᱢᱟᱨᱟᱝ/ᱰᱷᱮᱨ? ${p.a_sat} ᱠᱟ ${p.b_sat}`,
        options: [p.bigger, p.b + ' (ᱦᱩᱰᱤᱧ)'],
        correct_answer: p.bigger,
      });
    }

    else if (questionType === 'bal_patterns') {
      const patterns = [
        { q: '🍎, 🍌, 🍎, 🍌, ___', ans: '🍎', opts: ['🍎', '🍌', '🥭', '🍇'] },
        { q: '🔴, 🟦, 🔴, 🟦, ___', ans: '🔴', opts: ['🔴', '🟦', '🔺', '⭐'] },
        { q: '⭐, ⭐, 🌙, ⭐, ⭐, ___', ans: '🌙', opts: ['⭐', '🌙', '☀️', '☁️'] },
        { q: '🐮, 🐐, 🐮, 🐐, ___', ans: '🐮', opts: ['🐮', '🐐', '🐟', '🐶'] },
      ];
      const p = patterns[i % patterns.length];
      generated.push({
        id: i, type: questionType,
        question_hin: `पैटर्न पूरा करो: ${p.q}`,
        question_sat: `ᱯᱮᱴᱟᱨᱱ ᱯᱩᱨᱟᱹᱣ ᱢᱮ: ${p.q}`,
        options: p.opts,
        correct_answer: p.ans,
      });
    }

    // ── BALVATIKA LITERACY ─────────────────────────────────────────────
    else if (questionType === 'bal_vocab_animals') {
      const a = ANIMAL_VOCAB[i % ANIMAL_VOCAB.length];
      const others = ANIMAL_VOCAB.filter(x => x.sat !== a.sat).slice(0, 2).map(x => x.sat);
      generated.push({
        id: i, type: questionType,
        question_hin: `इस जानवर को संथाली में क्या कहते हैं? ${a.emoji} (${a.hin})`,
        question_sat: `ᱱᱚᱣᱟ ᱡᱤᱵᱽᱟᱜ ᱥᱟᱱᱛᱟᱲᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫ? ${a.emoji} (${a.hin})`,
        options: [a.sat, ...others].sort(() => Math.random() - 0.5),
        correct_answer: `${a.sat} (${a.pron})`,
        hint: `Pronunciation: ${a.pron}`,
      });
    }

    else if (questionType === 'bal_vocab_body') {
      const b = BODY_VOCAB[i % BODY_VOCAB.length];
      const others = BODY_VOCAB.filter(x => x.sat !== b.sat).slice(0, 2).map(x => x.sat);
      generated.push({
        id: i, type: questionType,
        question_hin: `इस अंग को संथाली में क्या कहते हैं? ${b.emoji} (${b.hin})`,
        question_sat: `ᱱᱚᱣᱟ ᱜᱟᱹᱭᱟᱜ ᱥᱟᱱᱛᱟᱲᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫ? ${b.emoji} (${b.hin})`,
        options: [b.sat, ...others].sort(() => Math.random() - 0.5),
        correct_answer: `${b.sat} (${b.pron})`,
        hint: `Pronunciation: ${b.pron}`,
      });
    }

    // ── CLASS 1 NUMERACY ─────────────────────────────────────────────
    else if (questionType === 'c1_addition') {
      const a = Math.floor(Math.random() * 8) + 1;
      const b = Math.floor(Math.random() * 8) + 1;
      const sum = a + b;
      const opt1 = `${sum}  (${OL_DIGITS[sum] || sum})`;
      const opt2 = `${sum + 1}  (${OL_DIGITS[sum + 1] || sum + 1})`;
      const opt3 = `${Math.max(1, sum - 1)}  (${OL_DIGITS[Math.max(1, sum - 1)]})`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} + ${b} = ___  (उत्तर Ol Chiki में भी लिखो)`,
        question_sat: `${OL_DIGITS[a]} + ${OL_DIGITS[b]} = ___ (ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱞᱮᱠᱷᱮ)`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `गिनती करें: ${a} से आगे ${b} कदम गिनें (${SANTALI_NUMS[a-1]} ᱟᱨ ${SANTALI_NUMS[b-1]} = ${SANTALI_NUMS[a+b-1] || a+b})`,
      });
    }

    else if (questionType === 'c1_subtraction') {
      const a = Math.floor(Math.random() * 5) + 4;
      const b = Math.floor(Math.random() * 3) + 1;
      const diff = a - b;
      const opt1 = `${diff}  (${OL_DIGITS[diff] || diff})`;
      const opt2 = `${diff + 1}  (${OL_DIGITS[diff + 1] || diff + 1})`;
      const opt3 = `${Math.max(0, diff - 1)}  (${OL_DIGITS[Math.max(0, diff - 1)]})`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} - ${b} = ___`,
        question_sat: `${OL_DIGITS[a]} - ${OL_DIGITS[b]} = ___`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `उलटी गिनती करें: ${a} में से ${b} घटाएँ (${SANTALI_NUMS[a-1]} ᱠᱷᱚᱱ ${SANTALI_NUMS[b-1]} ᱜᱷᱟᱴᱟᱣ)`,
      });
    }

    else if (questionType === 'c1_counting') {
      const n = (i % 10) + 1;
      const correct = `${OL_DIGITS[n]} = ${SANTALI_NUMS[n - 1]}`;
      const wrong1 = `${OL_DIGITS[(n % 10) + 1] || '᱐'} = ${SANTALI_NUMS[(n + 1) % 10]}`;
      const wrong2 = `${OL_DIGITS[n > 2 ? n - 2 : n + 2]} = ${SANTALI_NUMS[n > 2 ? n - 3 : n + 1]}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `संख्या ${n} को Ol Chiki और संथाली में क्या कहते हैं?`,
        question_sat: `ᱞᱮᱠᱷᱟ ${n} ᱫᱚ ᱚᱞ ᱪᱤᱠᱤ ᱟᱨ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ?`,
        options: [correct, wrong1, wrong2].sort(() => Math.random() - 0.5),
        correct_answer: correct,
        hint: `संथाली गिनती: 1=ᱢᱤᱫ, 2=ᱵᱟᱨ, 3=ᱯᱮ, 4=ᱯᱩᱱ, 5=ᱢᱚᱬᱮ, 6=ᱛᱩᱨᱩᱭ...`,
      });
    }

    else if (questionType === 'c1_sequence') {
      const start = Math.floor(Math.random() * 7) + 1;
      const missing = start + 2;
      const opt1 = `${missing}  (${OL_DIGITS[missing] || missing})`;
      const opt2 = `${start + 1}  (${OL_DIGITS[start + 1]})`;
      const opt3 = `${start + 4}  (${OL_DIGITS[start + 4] || start + 4})`;
      generated.push({
        id: i, type: questionType,
        question_hin: `खाली स्थान भरो: ${start}, ${start + 1}, ___, ${start + 3}`,
        question_sat: `ᱯᱮᱨᱮᱡᱽ ᱢᱮ: ${OL_DIGITS[start]}, ${OL_DIGITS[start + 1]}, ___, ${OL_DIGITS[start + 3]}`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: 'Count forward by 1 each time',
      });
    }

    else if (questionType === 'c1_patterns') {
      const patterns = [
        { q: '2, 4, 6, 8, ___', ans: '10', hint: 'Even numbers: +2 each' },
        { q: '1, 3, 5, 7, ___', ans: '9', hint: 'Odd numbers: +2 each' },
        { q: '10, 9, 8, 7, ___', ans: '6', hint: 'Count backward: -1 each' },
        { q: '1, 2, 1, 2, ___', ans: '1', hint: 'Repeating pattern' },
        { q: '5, 10, 15, 20, ___', ans: '25', hint: 'Skip count by 5' },
      ];
      const p = patterns[i % patterns.length];
      const opt1 = p.ans;
      const opt2 = String(parseInt(p.ans, 10) + 2 || 12);
      const opt3 = String(Math.max(1, parseInt(p.ans, 10) - 2) || 4);
      generated.push({
        id: i, type: questionType,
        question_hin: `पैटर्न पहचानो और अगला बताओ: ${p.q}`,
        question_sat: `ᱯᱮᱴᱟᱨᱱ ᱜᱟ ᱱᱚᱣᱟ ᱟᱜᱩ ᱞᱮᱠᱷᱟ ᱢᱮᱱᱟᱜ: ${p.q}`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: p.hint,
      });
    }

    // ── CLASS 1 LITERACY ────────────────────────────────────────────
    else if (questionType === 'c1_olchiki_letters') {
      const l = OLCHIKI_LETTERS[i % OLCHIKI_LETTERS.length];
      const others = OLCHIKI_LETTERS.filter(x => x.letter !== l.letter).slice(0, 2).map(x => x.sound);
      generated.push({
        id: i, type: questionType,
        question_hin: `इस Ol Chiki अक्षर का उच्चारण क्या है? "${l.letter}"`,
        question_sat: `ᱱᱚᱣᱟ ᱚᱞ ᱪᱤᱠᱤ ᱞᱟᱹᱜᱤᱫᱟᱜ ᱩᱪᱪᱟᱨᱚᱱ ᱪᱮᱫ? "${l.letter}"`,
        options: [l.sound, ...others].sort(() => Math.random() - 0.5),
        correct_answer: `${l.sound} — Example: ${l.example}`,
        hint: `Example word: ${l.example}`,
      });
    }

    else if (questionType === 'c1_word_match') {
      const a = ANIMAL_VOCAB[i % ANIMAL_VOCAB.length];
      const others = ANIMAL_VOCAB.filter(x => x.hin !== a.hin).slice(0, 2).map(x => x.hin);
      generated.push({
        id: i, type: questionType,
        question_hin: `"${a.sat}" का हिंदी अर्थ क्या है?`,
        question_sat: `"${a.sat}" ᱫᱚ ᱦᱤᱱᱫᱤ ᱛᱮ ᱪᱮᱫ ᱢᱮᱱᱟᱜ?`,
        options: [a.hin, ...others].sort(() => Math.random() - 0.5),
        correct_answer: `${a.hin} (${a.emoji})`,
        hint: `Pronunciation: ${a.pron}`,
      });
    }

    // ── CLASS 2 NUMERACY ────────────────────────────────────────────
    else if (questionType === 'c2_addition') {
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 40) + 10;
      const sum = a + b;
      const opt1 = `${sum}`;
      const opt2 = `${sum + 10}`;
      const opt3 = `${Math.max(1, sum - 10)}`;
      const opt4 = `${sum + 2}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} + ${b} = ___  (कॉलम में हल करो)`,
        question_sat: `${a} + ${b} = ___  (ᱠᱳᱞᱚᱢ ᱛᱮ ᱦᱟᱹᱞ ᱠᱟᱹᱢᱤ)`,
        options: [opt1, opt2, opt3, opt4].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: 'Add ones first, then tens',
      });
    }

    else if (questionType === 'c2_subtraction') {
      const a = Math.floor(Math.random() * 40) + 50;
      const b = Math.floor(Math.random() * 30) + 10;
      const diff = a - b;
      const opt1 = `${diff}`;
      const opt2 = `${diff + 10}`;
      const opt3 = `${Math.max(1, diff - 5)}`;
      const opt4 = `${diff + 2}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} - ${b} = ___`,
        question_sat: `${a} - ${b} = ___`,
        options: [opt1, opt2, opt3, opt4].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: 'Subtract ones first, then tens',
      });
    }

    else if (questionType === 'c2_place_value') {
      const num = Math.floor(Math.random() * 80) + 15;
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      const opt1 = `${tens} ᱜᱮᱞ (Tens) + ${ones} ᱢᱤᱫ (Ones)`;
      const opt2 = `${ones} ᱜᱮᱞ (Tens) + ${tens} ᱢᱤᱫ (Ones)`;
      const opt3 = `${tens + 1} ᱜᱮᱞ (Tens) + ${ones} ᱢᱤᱫ (Ones)`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${num} में ᱜᱮᱞ (दहाई) और ᱢᱤᱫ (इकाई) बताओ:`,
        question_sat: `${num} ᱨᱮ ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ ᱞᱟᱹᱭ ᱢᱮ:`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `${num} = ${tens}×10 + ${ones}`,
      });
    }

    else if (questionType === 'c2_multiplication_intro') {
      const num = Math.floor(Math.random() * 4) + 2;
      const times = Math.floor(Math.random() * 3) + 2;
      const sumStr = Array(times).fill(num).join(' + ');
      const prod = num * times;
      const opt1 = `${num} × ${times} = ${prod}`;
      const opt2 = `${num} × ${times + 1} = ${num * (times + 1)}`;
      const opt3 = `${num} × ${Math.max(1, times - 1)} = ${num * Math.max(1, times - 1)}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `बार-बार जोड़ को गुणा में बदलो: ${sumStr} = ${num} × ___ = ___`,
        question_sat: `ᱫᱚᱦᱲᱟ ᱡᱚᱲᱟᱣ ᱜᱩᱱᱟᱭ: ${sumStr} = ${num} × ___ = ___`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Count the groups of ${num}`,
      });
    }

    else if (questionType === 'c2_money') {
      const coins = [5, 10, 20];
      const coin = coins[i % coins.length];
      const count = Math.floor(Math.random() * 3) + 2;
      const totalMoney = coin * count;
      const opt1 = `₹${totalMoney}`;
      const opt2 = `₹${coin * (count + 1)}`;
      const opt3 = `₹${coin * Math.max(1, count - 1)}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `₹${coin} के ${count} सिक्के/नोट हों तो कुल ᱴᱟᱠᱟ (रुपये) कितने?`,
        question_sat: `₹${coin} ᱨᱮᱱᱟᱜ ${count} ᱴᱟᱠᱟ ᱢᱮᱱᱟᱜᱼᱟ, ᱛᱚᱵᱮ ᱡᱚᱛᱚ ᱴᱟᱠᱟ ᱛᱤᱱᱟᱹᱜ?`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Multiply: ${coin} × ${count}`,
      });
    }

    // ── CLASS 2 LITERACY ─────────────────────────────────────────────
    else if (questionType === 'c2_opposites') {
      const wp = WORD_PAIRS_HIN_SAT[i % WORD_PAIRS_HIN_SAT.length];
      generated.push({
        id: i, type: questionType,
        question_hin: `"${wp.hin}" का विपरीत (उल्टा) संथाली में क्या है?`,
        question_sat: `"${wp.sat}" ᱟᱜ ᱩᱞᱴᱟ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ?`,
        options: [wp.opp_sat, WORD_PAIRS_HIN_SAT[(i + 1) % WORD_PAIRS_HIN_SAT.length].opp_sat, WORD_PAIRS_HIN_SAT[(i + 2) % WORD_PAIRS_HIN_SAT.length].opp_sat].sort(() => Math.random() - 0.5),
        correct_answer: `${wp.opp_sat} (${wp.opp_hin})`,
        hint: `Opposite of "${wp.hin}" = "${wp.opp_hin}"`,
      });
    }

    else if (questionType === 'c2_reading_comp') {
      const story = CLASS3_STORIES[i % CLASS3_STORIES.length];
      const opt1 = story.answer;
      const opt2 = '6 गाय = ᱛᱩᱨᱩᱭ ᱜᱟᱹᱭ';
      const opt3 = '2 गाय = ᱵᱟᱨ ᱜᱟᱹᱭ';
      generated.push({
        id: i, type: questionType,
        question_hin: `📖 पढ़ो और उत्तर दो:\n"${story.story_hin}"\n❓ ${story.q_hin}`,
        question_sat: `📖 ᱯᱟᱲᱦᱟᱭ ᱟᱨ ᱛᱮᱞᱟ ᱫᱮ:\n"${story.story_sat}"\n❓ ${story.q_sat}`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Read the story carefully — answer is ${story.type} problem`,
      });
    }

    // ── CLASS 3 NUMERACY ─────────────────────────────────────────────
    else if (questionType === 'c3_3digit_add') {
      const a = Math.floor(Math.random() * 400) + 100;
      const b = Math.floor(Math.random() * 300) + 100;
      const op = i % 2 === 0 ? '+' : '-';
      const bigger = Math.max(a, b);
      const smaller = Math.min(a, b);
      const ansVal = op === '+' ? a + b : bigger - smaller;
      const opt1 = `${ansVal}`;
      const opt2 = `${ansVal + 10}`;
      const opt3 = `${Math.max(10, ansVal - 10)}`;
      const opt4 = `${ansVal + 100}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `कॉलम विधि से हल करो: ${op === '+' ? `${a} + ${b}` : `${bigger} - ${smaller}`} = ___`,
        question_sat: `ᱠᱳᱞᱚᱢ ᱵᱤᱫᱷᱤ ᱛᱮ: ${op === '+' ? `${a} + ${b}` : `${bigger} - ${smaller}`} = ___`,
        options: [opt1, opt2, opt3, opt4].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Align ones/tens/hundreds in columns, then solve step by step`,
      });
    }

    else if (questionType === 'c3_tables') {
      const tableNum = (i % 9) + 2;
      const mul = Math.floor(Math.random() * 9) + 1;
      const prod = tableNum * mul;
      const opt1 = `${prod}`;
      const opt2 = `${prod + tableNum}`;
      const opt3 = `${Math.max(1, prod - tableNum)}`;
      const opt4 = `${prod + 2}`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${OL_DIGITS[tableNum]} × ${OL_DIGITS[mul]} = ___  (${tableNum} × ${mul})`,
        question_sat: `${OL_DIGITS[tableNum]} × ${OL_DIGITS[mul]} = ___ (ᱜᱩᱬᱟᱹᱣ)`,
        options: [opt1, opt2, opt3, opt4].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Table of ${tableNum}: think ${tableNum} + ${tableNum} + ... (${mul} times)`,
      });
    }

    else if (questionType === 'c3_division') {
      const divisor = Math.floor(Math.random() * 4) + 2;
      const quotient = Math.floor(Math.random() * 6) + 2;
      const dividend = divisor * quotient;
      const opt1 = `${quotient} आम (ᱟᱢ)`;
      const opt2 = `${quotient + 1} आम (ᱟᱢ)`;
      const opt3 = `${Math.max(1, quotient - 1)} आम (ᱟᱢ)`;
      generated.push({
        id: i, type: questionType,
        question_hin: `${dividend} आम को ${divisor} बच्चों में बराबर बाँटो। हर बच्चे को कितने? (${dividend} ÷ ${divisor})`,
        question_sat: `${dividend} ᱟᱢ ${divisor} ᱜᱤᱫᱽᱨᱟᱹ ᱨᱮ ᱵᱟᱨᱟᱵᱟᱹᱨᱤ ᱦᱟᱹᱴᱤᱧᱟ᱾ ᱡᱚᱱᱚ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ ᱛᱤᱱᱟᱹ ᱧᱟᱢᱚᱜᱼᱟ?`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `${dividend} ÷ ${divisor} = ?  Think: ${divisor} × ? = ${dividend}`,
      });
    }

    else if (questionType === 'c3_time') {
      const hour = (i % 12) + 1;
      generated.push({
        id: i, type: questionType,
        question_hin: `घड़ी में छोटी सुई ${hour} पर और बड़ी सुई 12 पर है। समय = ?`,
        question_sat: `ᱜᱷᱩᱲᱤ ᱨᱮ ᱦᱩᱰᱤᱧ ᱠᱟᱹᱴᱩᱵ ${hour} ᱨᱮ ᱟᱨ ᱢᱟᱨᱟᱝ ᱠᱟᱹᱴᱩᱵ ᱑᱒ ᱨᱮ᱾ ᱚᱠᱛᱚ = ?`,
        options: [`${hour}:00 बजे`, `${hour}:30 बजे`, `${hour + 1 > 12 ? 1 : hour + 1}:00 बजे`],
        correct_answer: `${hour}:00 बजे  (${SANTALI_NUMS[hour - 1]} ᱵᱮᱡᱮ)`,
      });
    }

    else if (questionType === 'c3_word_problems') {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 15) + 5;
      const diff = a - b;
      const opt1 = `${diff} आम (ᱟᱢ)`;
      const opt2 = `${diff + 2} आम (ᱟᱢ)`;
      const opt3 = `${Math.max(1, diff - 2)} आम (ᱟᱢ)`;
      generated.push({
        id: i, type: questionType,
        question_hin: `सुनीता के पास ${a} आम थे। उसने अपनी दोस्त को ${b} आम दिए। कितने बचे?`,
        question_sat: `ᱥᱩᱱᱤᱛᱟ ᱴᱷᱮᱱ ${a} ᱟᱢ ᱛᱟᱦᱮᱸᱠᱟᱱᱟᱭ᱾ ᱟᱡ ᱫᱚᱥᱛᱩᱭ ᱫᱚ ${b} ᱟᱢ ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱲᱚᱜᱼᱟ?`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: `Subtraction: ${a} - ${b} = ?`,
      });
    }

    // ── CLASS 3 LITERACY ─────────────────────────────────────────────
    else if (questionType === 'c3_comprehension') {
      const story = CLASS3_STORIES[i % CLASS3_STORIES.length];
      const opt1 = story.answer;
      const opt2 = '10 = ᱜᱮᱞ';
      const opt3 = '2 = ᱵᱟᱨ';
      generated.push({
        id: i, type: questionType,
        question_hin: `📖 NIPUN ORF Practice — पढ़ो और उत्तर दो (60 WPM लक्ष्य):\n"${story.story_hin}"\n❓ ${story.q_hin}`,
        question_sat: `📖 NIPUN ᱯᱟᱲᱦᱟᱣ — ᱯᱟᱲᱦᱟᱭ ᱟᱨ ᱛᱮᱞᱟ ᱫᱮ:\n"${story.story_sat}"\n❓ ${story.q_sat}`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: 'Read the full passage first, then answer from it',
      });
    }

    else if (questionType === 'c3_sentence_write') {
      const topics = [
        { hin: 'अपने घर के बारे में 3 वाक्य लिखो।', sat: 'ᱟᱯᱱᱟᱜ ᱜᱮᱦᱽ ᱵᱟᱵᱚᱛ ᱯᱮ ᱩᱫᱩ ᱞᱮᱠᱷᱮ᱾' },
        { hin: 'अपने गाँव के बारे में 3 वाक्य हिंदी और संथाली में लिखो।', sat: 'ᱟᱯᱱᱟᱜ ᱟᱥᱲᱟ ᱵᱟᱵᱚᱛ ᱯᱮ ᱩᱫᱩ ᱦᱤᱱᱫᱤ ᱟᱨ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱮᱠᱷᱮ᱾' },
        { hin: 'अपने पसंदीदा त्योहार के बारे में लिखो।', sat: 'ᱟᱯᱱᱟᱜ ᱠᱩᱞᱤ ᱯᱟᱨᱟᱵᱽ ᱵᱟᱵᱚᱛ ᱞᱮᱠᱷᱮ᱾' },
      ];
      const t = topics[i % topics.length];
      const opt1 = 'ᱥᱮᱨᱢᱟ ᱨᱮ ᱤᱧᱟᱜ ᱚᱲᱟᱜ ᱢᱮᱱᱟᱜᱼᱟ (गाँव में मेरा घर है)';
      const opt2 = 'ᱟᱞᱮ ᱫᱚ ᱟᱥᱲᱟ ᱵᱚᱱ ᱪᱟᱞᱟᱜᱼᱟ (हम सब स्कूल जाते हैं)';
      const opt3 = 'ᱢᱟᱪᱮᱛ ᱫᱚ ᱵᱮᱥ ᱮ ᱯᱟᱲᱦᱟᱣ ᱮᱫ ᱵᱚᱱᱟ (शिक्षक अच्छा पढ़ाते हैं)';
      generated.push({
        id: i, type: questionType,
        question_hin: `✍️ रचनात्मक लेखन: ${t.hin}`,
        question_sat: `✍️ ᱧᱤᱫᱼᱟᱱ ᱞᱮᱠᱷᱟ: ${t.sat}`,
        options: [opt1, opt2, opt3].sort(() => Math.random() - 0.5),
        correct_answer: opt1,
        hint: 'Write full sentences. Use Ol Chiki script for Santali words.',
      });
    }

    else {
      // Generic fallback
      generated.push({
        id: i, type: questionType,
        question_hin: `प्रश्न ${i}: इस प्रकार के सवाल पर काम करो।`,
        question_sat: `ᱠᱩᱠᱞᱤ ${i}: ᱱᱚᱣᱟ ᱵᱟᱵᱚᱛ ᱠᱟᱹᱢᱤ ᱠᱟᱹᱢᱤ᱾`,
        options: ['विकल्प A (ᱥᱟᱹᱨᱤ)', 'विकल्प B (ᱮᱲᱮ)', 'विकल्प C (ᱮᱴᱟᱜᱟᱜ)'],
        correct_answer: 'विकल्प A (ᱥᱟᱹᱨᱤ)',
      });
    }
  }

  return generated;
}

// ─────────────────────────────────────────────
// GUARANTEED FALLBACK OPTION SYNTHESIZER
// ─────────────────────────────────────────────
export function ensureQuestionOptions(q: Question): string[] {
  if (q.options && q.options.length > 0) return q.options;

  const ans = q.correct_answer.trim();
  const numMatch = ans.match(/\d+/);
  if (numMatch) {
    const base = parseInt(numMatch[0], 10);
    const step = base <= 5 ? 1 : Math.max(1, Math.round(base * 0.25));
    const opt1 = ans;
    const opt2 = ans.replace(numMatch[0], String(base + step));
    const opt3 = ans.replace(numMatch[0], String(Math.max(1, base - step)));
    return [opt1, opt2, opt3].sort(() => 0.5 - Math.random());
  }

  return [ans, 'ᱵᱟᱝ ᱠᱟᱱᱟ (गलत)', 'ᱮᱴᱟᱜ ᱩᱛᱛᱚᱨ (अन्य)'];
}

// ─────────────────────────────────────────────
// SMART EVALUATION CHECKER
// ─────────────────────────────────────────────
export const checkIsCorrect = (q: Question, selected: string | undefined): boolean => {
  if (!selected) return false;
  const s = selected.trim().toLowerCase();
  const c = q.correct_answer.trim().toLowerCase();
  if (s === c) return true;

  // Extract pure numbers
  const sNum = s.match(/\d+/)?.[0];
  const cNum = c.match(/\d+/)?.[0];
  if (sNum && cNum && sNum === cNum) return true;

  // Substring inclusion
  if (c.includes(s) || s.includes(c)) return true;

  return false;
};

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const Worksheets: React.FC = () => {
  const navigate = useNavigate();
  const userRole = authService.getUserRole();
  const [tribalLang, setTribalLang] = useState<TribalLanguage>(getActiveTribalLanguage);
  const [grade, setGrade] = useState<string>('Class 1');
  const [domain, setDomain] = useState<string>('Foundational Numeracy');
  const [questionType, setQuestionType] = useState<string>('c1_addition');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [assignedList, setAssignedList] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
    } catch (_) {
      return [];
    }
  });
  const [selectedAssignedTitle, setSelectedAssignedTitle] = useState<string>('');
  const [studentSelections, setStudentSelections] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<WorksheetSubmission | null>(null);
  const [teacherSubmissions, setTeacherSubmissions] = useState<WorksheetSubmission[]>([]);
  const [showTeacherReportsModal, setShowTeacherReportsModal] = useState<boolean>(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState<WorksheetSubmission | null>(null);

  useEffect(() => {
    const unsub = classroomService.onSubmissionsUpdate((subs) => {
      setTeacherSubmissions(subs);
    });

    const onClassroomReset = () => {
      setAssignedList([]);
      if (userRole === 'student') {
        setQuestions([]);
        setIsSubmitted(false);
        setSubmissionResult(null);
        setStudentSelections({});
      }
    };
    window.addEventListener('palash_classroom_reset', onClassroomReset);

    return () => {
      unsub();
      window.removeEventListener('palash_classroom_reset', onClassroomReset);
    };
  }, [userRole]);

  useEffect(() => {
    const onLangChanged = (e: any) => {
      const detail = e.detail || localStorage.getItem('palash_selected_language');
      if (detail === 'hoc_Deva' || detail === 'ho') setTribalLang('ho');
      else if (detail === 'unr_Deva' || detail === 'unx_Deva' || detail === 'mundari') setTribalLang('mundari');
      else setTribalLang('santali');
    };
    window.addEventListener('palash_language_changed', onLangChanged);
    return () => window.removeEventListener('palash_language_changed', onLangChanged);
  }, []);

  const handleLanguageSelect = (lang: TribalLanguage) => {
    sfx.playTap();
    setTribalLang(lang);
    const code = lang === 'ho' ? 'hoc_Deva' : lang === 'mundari' ? 'unr_Deva' : 'sat_Olck';
    localStorage.setItem('palash_selected_language', code);
    window.dispatchEvent(new CustomEvent('palash_language_changed', { detail: code }));
  };

  const getQuestionTribalText = (q: Question) => {
    if (tribalLang === 'santali') return q.question_sat;
    if (tribalLang === 'ho') {
      const res = translateHindiToHo(q.question_hin);
      return res.translation || q.question_sat;
    }
    const res = translateHindiToMundari(q.question_hin);
    return res.translation || q.question_sat;
  };

  const getQuestionAnswerText = (q: Question) => {
    if (tribalLang === 'santali') return q.correct_answer;
    if (tribalLang === 'ho') {
      const res = translateHindiToHo(q.correct_answer);
      return res.translation || q.correct_answer;
    }
    const res = translateHindiToMundari(q.correct_answer);
    return res.translation || q.correct_answer;
  };

  const availableDomains = useMemo(() => Object.keys(GRADE_DRILL_TYPES[grade] || {}), [grade]);
  const availableDrills = useMemo(() => (GRADE_DRILL_TYPES[grade]?.[domain] || []), [grade, domain]);
  const selectedDrill = useMemo(() => availableDrills.find(d => d.id === questionType), [availableDrills, questionType]);

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    setQuestions([]);
    setShowAnswers(false);
    const firstDomain = Object.keys(GRADE_DRILL_TYPES[newGrade] || {})[0] || '';
    setDomain(firstDomain);
    const firstDrill = (GRADE_DRILL_TYPES[newGrade]?.[firstDomain] || [])[0];
    if (firstDrill) setQuestionType(firstDrill.id);
  };

  const handleDomainChange = (newDomain: string) => {
    setDomain(newDomain);
    setQuestions([]);
    setShowAnswers(false);
    const firstDrill = (GRADE_DRILL_TYPES[grade]?.[newDomain] || [])[0];
    if (firstDrill) setQuestionType(firstDrill.id);
  };

  const generateWorksheet = () => {
    sfx.playGenerate();
    setShowAnswers(false);
    setShowHints(false);
    const qs = generateQuestions(questionType, numQuestions);
    setQuestions(qs);
  };

  // Live event listener for incoming worksheet assignments
  useEffect(() => {
    const handleAssigned = (e: any) => {
      const data = e.detail;
      if (data) {
        setAssignedList(prev => [data, ...prev.filter((w: any) => w.worksheetId !== data.worksheetId)]);
        setSelectedAssignedTitle(data.title || 'कक्षा अभ्यास पत्र');
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          const qs = generateQuestions(data.topic || 'c1_addition', 5);
          setQuestions(qs);
        }
        setStudentSelections({});
        setIsSubmitted(false);
        setSubmissionResult(null);
        sfx.playSuccess();
      }
    };
    window.addEventListener('palash_worksheet_assigned', handleAssigned);
    return () => window.removeEventListener('palash_worksheet_assigned', handleAssigned);
  }, []);

  // Role-adaptive initial load
  React.useEffect(() => {
    if (userRole === 'teacher') {
      const qs = generateQuestions('c1_addition', 5);
      setQuestions(qs);
    } else {
      // Student mode: check assigned worksheets
      if (assignedList.length > 0) {
        const first = assignedList[0];
        setSelectedAssignedTitle(first.title || 'कक्षा अभ्यास पत्र');
        if (first.questions && first.questions.length > 0) {
          setQuestions(first.questions);
        } else {
          const qs = generateQuestions(first.topic || 'c1_addition', 5);
          setQuestions(qs);
        }
      } else {
        setQuestions([]);
      }
    }
  }, [userRole]);

  const handleOpenAssigned = (ws: any) => {
    sfx.playSuccess();
    setSelectedAssignedTitle(ws.title || 'कक्षा अभ्यास पत्र');
    if (ws.questions && ws.questions.length > 0) {
      setQuestions(ws.questions);
    } else {
      const qs = generateQuestions(ws.topic || 'c1_addition', 5);
      setQuestions(qs);
    }
    setStudentSelections({});
    setIsSubmitted(false);
    setSubmissionResult(null);
  };

  const handleSubmitStudentWorksheet = () => {
    sfx.playSuccess();
    const student = authService.getStudentProfile();

    const answersList: StudentAnswerItem[] = questions.map((q) => {
      const selected = studentSelections[q.id] || '';
      const isCorrect = checkIsCorrect(q, selected);
      return {
        question_id: q.id,
        question_text: q.question_hin,
        selected_answer: selected,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
      };
    });

    const correctCount = answersList.filter((a) => a.is_correct).length;
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);

    const submission: WorksheetSubmission = {
      worksheet_id: (assignedList[0]?.worksheetId) || `ws_${Date.now()}`,
      worksheet_title: selectedAssignedTitle || selectedDrill?.label || 'कक्षा अभ्यास कार्यपत्र',
      student_id: student?.studentId || 'std_' + Math.random().toString(36).slice(2, 6),
      student_name: student?.studentName || 'विद्यार्थी',
      total_questions: total,
      score: correctCount,
      percentage: pct,
      timestamp: Date.now(),
      answers: answersList,
    };

    setSubmissionResult(submission);
    setIsSubmitted(true);
    setShowAnswers(true);

    classroomService.submitWorksheetResult(submission);
  };

  const handlePrint = () => {
    sfx.playTap();
    if (typeof window !== 'undefined' && (window as any).AndroidVoiceBridge?.print) {
      (window as any).AndroidVoiceBridge.print();
    } else {
      window.print();
    }
  };

  const GRADE_ICONS: Record<string, string> = {
    Balvatika: '🧸', 'Class 1': '🎒', 'Class 2': '📖', 'Class 3': '🧮',
  };

  return (
    <div className="fade-in worksheet-page-container" style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          {userRole === 'student' ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#dcfce7', color: '#166534', padding: '3px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                🎒 छात्र अभ्यास कार्यपत्र (Student Practice Worksheets)
              </div>
              <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                {selectedAssignedTitle || 'कक्षा अभ्यास कार्यपत्र (Classroom Worksheets)'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                शिक्षिका/शिक्षक द्वारा सौंपे गए कार्यपत्र को हल करें और सबमिट करें।
              </p>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '3px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                📝 NIPUN Bharat Worksheet Engine ({tribalLang === 'ho' ? 'Ho • Kolhan' : tribalLang === 'mundari' ? 'Mundari • Chotanagpur' : 'Santali Ol Chiki'})
              </div>
              <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                Bilingual Worksheet Generator ({tribalLang === 'ho' ? 'कामी साकाम' : tribalLang === 'mundari' ? 'कामी साकाम' : 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ'})
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Select Grade → Domain (Literacy/Numeracy) → Drill Type → Generate in {tribalLang === 'ho' ? 'Ho language' : tribalLang === 'mundari' ? 'Mundari language' : 'Santali Ol Chiki'}.
              </p>
            </>
          )}
        </div>
        {questions.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {userRole === 'teacher' && (
              <>
                <button
                  onClick={() => {
                    sfx.playSuccess();
                    classroomService.broadcastWorksheet({
                      worksheetId: `ws_${Date.now()}`,
                      title: `${grade} ${domain}: ${selectedDrill?.label || 'Practice'}`,
                      grade,
                      topic: questionType,
                      questions: questions,
                      timestamp: Date.now()
                    });
                    alert('📡 अभ्यास पत्र कक्षा को लाइव सौंप दिया गया है! (Worksheet assigned to connected student screens!)');
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📡 कक्षा को सौंपें (Assign Live)</span>
                </button>

                <button
                  onClick={() => {
                    sfx.playTap();
                    setShowTeacherReportsModal(true);
                    if (teacherSubmissions.length > 0) {
                      setSelectedReportStudent(teacherSubmissions[0]);
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #3b82f6',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📊 छात्र मूल्यांकन रिपोर्ट ({teacherSubmissions.length})</span>
                </button>
              </>
            )}
            <button onClick={() => { sfx.playTap(); setShowHints(!showHints); }}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: showHints ? '#fef3c7' : '#fff', color: showHints ? '#92400e' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: showHints ? '0 0 8px rgba(234, 179, 8, 0.4)' : 'none' }}>
              💡 {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
            {userRole === 'teacher' && (
              <button onClick={() => { if (!showAnswers) sfx.playSuccess(); else sfx.playTap(); setShowAnswers(!showAnswers); }}
                style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: showAnswers ? '#f0fdf4' : '#fff', color: showAnswers ? '#166534' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                {showAnswers ? '👁️ Hide Answers' : '🔑 Show Answer Key'}
              </button>
            )}
            <button onClick={handlePrint}
              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: '#0f2744', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,39,68,0.25)' }}>
              🖨️ Print / PDF
            </button>
          </div>
        )}
      </div>

      {/* Configuration Panel (TEACHER ONLY - RESTRICTED FROM STUDENTS) */}
      {userRole === 'teacher' && (
        <div className="no-print generator-panel" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,39,68,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0f2744', fontSize: '1rem', fontWeight: 800 }}>
            ⚙️ Configure Worksheet
          </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {/* Grade */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Grade (NIPUN Level):
            </label>
            <select value={grade} onChange={e => handleGradeChange(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 700, color: '#0f2744', outline: 'none', fontSize: '0.88rem' }}>
              <option value="Balvatika">🧸 Balvatika</option>
              <option value="Class 1">🎒 Class 1</option>
              <option value="Class 2">📖 Class 2</option>
              <option value="Class 3">🧮 Class 3</option>
            </select>
          </div>

          {/* Domain */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              FLN Domain:
            </label>
            <select value={domain} onChange={e => handleDomainChange(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 700, color: '#0f2744', outline: 'none', fontSize: '0.88rem' }}>
              {availableDomains.map(d => (
                <option key={d} value={d}>{d.includes('Literacy') ? '📖' : '🔢'} {d}</option>
              ))}
            </select>
          </div>

          {/* Drill Type */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Drill Type ({grade} — {domain}):
            </label>
            <select value={questionType} onChange={e => { setQuestionType(e.target.value); setQuestions([]); }}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 700, color: '#c05621', outline: 'none', fontSize: '0.88rem' }}>
              {availableDrills.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Number of Questions:
            </label>
            <select value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600, outline: 'none', fontSize: '0.88rem' }}>
              <option value={5}>5 Questions (Quick Drill)</option>
              <option value={10}>10 Questions (Full Page)</option>
              <option value={15}>15 Questions (Weekend Sheet)</option>
            </select>
          </div>
        </div>

        {/* NIPUN Reference Badge */}
        {selectedDrill && (
          <div style={{ backgroundColor: '#f0f9ff', borderRadius: '10px', padding: '8px 14px', marginBottom: '1rem', fontSize: '0.8rem', color: '#0369a1', border: '1px solid #bae6fd' }}>
            🎯 <strong>NIPUN Lakshya:</strong> {selectedDrill.nipunRef}
            <span style={{ marginLeft: '8px', color: '#64748b' }}>• {selectedDrill.desc}</span>
          </div>
        )}

        <button onClick={generateWorksheet}
          style={{ width: '100%', backgroundColor: '#805ad5', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(128,90,213,0.25)' }}>
          🎲 Generate {numQuestions}-Question {grade} Worksheet ➔
        </button>
      </div>
      )}

      {/* Student Assigned Worksheets List (When No Worksheet Currently Open) */}
      {userRole === 'student' && questions.length === 0 && assignedList.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0f2744', fontSize: '1.1rem', fontWeight: 800 }}>
            📝 शिक्षिका/शिक्षक द्वारा सौंपे गए कार्यपत्र (Assigned Worksheets):
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {assignedList.map((ws: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f2744', fontSize: '1rem' }}>{ws.title || 'कक्षा अभ्यास कार्यपत्र'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {ws.grade || 'Class 1'} • सौंपा गया: {new Date(ws.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenAssigned(ws)}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(22,163,74,0.25)'
                  }}
                >
                  ✏️ हल करें ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Empty Waiting State (When No Worksheet Assigned Yet) */}
      {userRole === 'student' && questions.length === 0 && assignedList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>⏳</div>
          <h3 style={{ color: '#0f2744', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            अभी कोई कार्यपत्र नहीं सौंपा गया है
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.55 }}>
            जब आपके शिक्षक कक्षा में लाइव कार्यपत्र सौंपेंगे, वह यहाँ तुरंत दिखाई देगा। तब तक आप शब्द कार्ड या JCERT पाठ्यपुस्तकें पढ़ सकते हैं!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                sfx.playTap();
                navigate('/flashcards');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: '#0f2744',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              🃏 शब्द कार्ड पढ़ें
            </button>
            <button
              onClick={() => {
                sfx.playTap();
                navigate('/books');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: '#ed8936',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              📖 JCERT पाठ्यपुस्तकें
            </button>
          </div>
        </div>
      )}

      {/* Printable Worksheet */}
      {questions.length > 0 && (
        <div className="printable-sheet" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '2px solid #e2e8f0' }}>
          {/* School Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
              Govt. of Jharkhand • PALASH MTB-MLE Programme (SIH 26042)
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2744', margin: '4px 0' }}>
              Palash Vani NIPUN Practice Worksheet ({tribalLang === 'ho' ? 'कामी साकाम' : tribalLang === 'mundari' ? 'कामी साकाम' : 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ'})
            </h2>
            <div style={{ fontSize: '0.88rem', color: '#c05621', fontWeight: 700, marginBottom: '4px' }}>
              {grade} • {domain} • {selectedDrill?.label} ({tribalLang.toUpperCase()})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              🎯 {selectedDrill?.nipunRef}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1rem', textAlign: 'left', fontSize: '0.82rem', color: '#334155' }}>
              <div><strong>Student Name ({tribalLang === 'santali' ? 'ᱧᱩᱛᱩᱢ' : 'नुतुम'}):</strong> _________________</div>
              <div><strong>Roll No.:</strong> _______</div>
              <div><strong>Date ({tribalLang === 'santali' ? 'ᱛᱟᱨᱤᱠ' : 'तारीख'}):</strong> ___________</div>
              <div><strong>Score ({tribalLang === 'santali' ? 'ᱮᱞ' : 'नंबर'}):</strong> ______ / {questions.length}</div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="print-card" style={{ padding: '1.1rem 1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', position: 'relative' }}>
                {/* Question number + type badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    Q{idx + 1}
                  </span>
                  {showAnswers && (
                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem' }}>
                      ✅ {getQuestionAnswerText(q)}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f2744', marginBottom: '4px', whiteSpace: 'pre-wrap' }}>
                  {q.question_hin}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#c05621', fontWeight: 600, fontFamily: tribalLang === 'santali' ? 'serif' : 'inherit', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                  {getQuestionTribalText(q)}
                </div>

                {/* Guaranteed Interactive MCQ Options */}
                {(() => {
                  const cardOptions = ensureQuestionOptions(q);
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                      {cardOptions.map((opt, oi) => {
                        const displayOpt = tribalLang === 'santali'
                          ? opt
                          : tribalLang === 'ho'
                          ? (translateHindiToHo(opt).translation || opt)
                          : (translateHindiToMundari(opt).translation || opt);
                        const isSelected = studentSelections[q.id] === opt;
                        const isRightChoice = checkIsCorrect(q, opt);

                        let bgColor = isSelected ? '#dcfce7' : '#ffffff';
                        let borderColor = isSelected ? '#22c55e' : '#cbd5e1';
                        if (isSubmitted) {
                          if (isSelected && isRightChoice) {
                            bgColor = '#dcfce7';
                            borderColor = '#16a34a';
                          } else if (isSelected && !isRightChoice) {
                            bgColor = '#fee2e2';
                            borderColor = '#ef4444';
                          } else if (!isSelected && isRightChoice) {
                            bgColor = '#f0fdf4';
                            borderColor = '#86efac';
                          }
                        }

                        return (
                          <div
                            key={oi}
                            onClick={() => {
                              if (userRole === 'student' && !isSubmitted) {
                                sfx.playTap();
                                setStudentSelections(prev => ({ ...prev, [q.id]: opt }));
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '0.9rem',
                              cursor: (userRole === 'student' && !isSubmitted) ? 'pointer' : 'default',
                              padding: '8px 14px',
                              borderRadius: '12px',
                              backgroundColor: bgColor,
                              border: `1.5px solid ${borderColor}`,
                              fontWeight: isSelected ? 800 : 500,
                              boxShadow: isSelected ? '0 2px 6px rgba(34,197,94,0.2)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: isSelected ? '2px solid #16a34a' : '1.5px solid #94a3b8',
                                backgroundColor: isSelected ? '#22c55e' : 'transparent',
                                display: 'inline-block',
                                flexShrink: 0
                              }}
                            />
                            <span>{displayOpt}</span>
                            {isSubmitted && isSelected && isRightChoice && <span>✅</span>}
                            {isSubmitted && isSelected && !isRightChoice && <span>❌</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Question Feedback when submitted */}
                {isSubmitted && (
                  <div style={{ marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
                    {checkIsCorrect(q, studentSelections[q.id]) ? (
                      <div style={{ backgroundColor: '#dcfce7', border: '1.5px solid #22c55e', color: '#15803d', padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✅ शाबाश! आपका उत्तर बिल्कुल सही है! (+1 अंक)</span>
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>❌ गलत उत्तर!</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>(आपका चयन: {studentSelections[q.id] || 'कोई उत्तर नहीं चुना'})</span>
                        </div>
                        <div style={{ marginTop: '6px', color: '#166534', backgroundColor: '#dcfce7', padding: '6px 12px', borderRadius: '8px', fontWeight: 700 }}>
                          🎯 सही उत्तर: <strong>{getQuestionAnswerText(q)}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {showHints && q.hint && (
                  <div style={{ marginTop: '8px', backgroundColor: '#fef3c7', borderRadius: '8px', padding: '5px 10px', fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>
                    💡 Hint: {q.hint}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Answers Button & Live Score Banner for Student Mode */}
          {userRole === 'student' && (
            <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
              {isSubmitted ? (
                <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '18px', padding: '1.75rem', color: '#166534', maxWidth: '520px', margin: '0 auto', boxShadow: '0 6px 20px rgba(34,197,94,0.15)' }}>
                  <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>
                    {submissionResult && submissionResult.percentage >= 80 ? '🌟' : '🎉'}
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: 800, color: '#0f2744' }}>
                    {submissionResult
                      ? `परिणाम: ${submissionResult.score} / ${submissionResult.total_questions} (${submissionResult.percentage}% सही)`
                      : 'शाबाश! कार्यपत्र जमा हो गया है!'}
                  </h3>
                  <p style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#15803d' }}>
                    आपके उत्तर शिक्षिका/शिक्षक के पास सफलतापूर्वक जमा हो चुके हैं। ऊपर प्रत्येक प्रश्न की विस्तृत जाँच देखें!
                  </p>
                  <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', backgroundColor: '#ffffff', padding: '6px 16px', borderRadius: '20px', border: '1px solid #86efac', fontWeight: 700, fontSize: '0.85rem' }}>
                    <span>✅ शिक्षिका के टैबलेट पर भेजा गया</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSubmitStudentWorksheet}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 34px',
                    borderRadius: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>✅ शिक्षक को उत्तर जमा करें (Submit Answers)</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Teacher Empty state */}
      {userRole === 'teacher' && questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📝</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f2744', marginBottom: '6px' }}>Select Grade, Domain & Drill Type</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Then click <strong>Generate Worksheet</strong> to create a printable bilingual NIPUN practice sheet.
          </div>
        </div>
      )}

      {/* ─── TEACHER: STUDENT ASSESSMENT REPORTS MODAL ─── */}
      {showTeacherReportsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0f2744',
              color: '#ffffff'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📊 छात्र मूल्यांकन रिपोर्ट (Student Assessment Reports)</span>
                  <span style={{ fontSize: '0.78rem', backgroundColor: '#16a34a', color: '#fff', padding: '2px 10px', borderRadius: '12px' }}>
                    {teacherSubmissions.length} छात्र जमा
                  </span>
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '3px' }}>
                  कक्षा में छात्रों द्वारा सबमिट किए गए कार्यपत्र के अंक एवं विस्तृत उत्तर
                </div>
              </div>
              <button
                onClick={() => setShowTeacherReportsModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
              {teacherSubmissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏳</div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#0f2744', fontWeight: 800 }}>
                    अभी तक किसी छात्र ने उत्तर सबमिट नहीं किए हैं
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                    जैसे ही छात्र अपने फोन या टैबलेट पर कार्यपत्र हल करके सबमिट करेंगे, उनके अंक और उत्तर यहाँ तुरंत प्रदर्शित होंगे।
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.25rem' }}>
                  {/* Students Roster List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      छात्र सूची ({teacherSubmissions.length})
                    </div>
                    {teacherSubmissions.map((sub, sidx) => {
                      const isSelected = selectedReportStudent?.student_id === sub.student_id;
                      return (
                        <div
                          key={sidx}
                          onClick={() => {
                            sfx.playTap();
                            setSelectedReportStudent(sub);
                          }}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '14px',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f2744', fontSize: '0.95rem' }}>
                              🎒 {sub.student_name}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                              {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: sub.percentage >= 60 ? '#dcfce7' : '#fee2e2',
                            color: sub.percentage >= 60 ? '#15803d' : '#b91c1c',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '0.82rem'
                          }}>
                            {sub.score} / {sub.total_questions} ({sub.percentage}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Student Answer Sheet */}
                  {selectedReportStudent ? (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '14px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f2744' }}>
                            👤 {selectedReportStudent.student_name} की उत्तर पुस्तिका
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            कार्यपत्र: {selectedReportStudent.worksheet_title}
                          </div>
                        </div>
                        <div style={{
                          backgroundColor: selectedReportStudent.percentage >= 60 ? '#16a34a' : '#d97706',
                          color: '#ffffff',
                          padding: '6px 14px',
                          borderRadius: '14px',
                          fontWeight: 800,
                          fontSize: '0.95rem'
                        }}>
                          अंक: {selectedReportStudent.score} / {selectedReportStudent.total_questions} ({selectedReportStudent.percentage}%)
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedReportStudent.answers.map((ans, aidx) => (
                          <div
                            key={aidx}
                            style={{
                              padding: '12px',
                              borderRadius: '12px',
                              border: `1.5px solid ${ans.is_correct ? '#86efac' : '#fca5a5'}`,
                              backgroundColor: ans.is_correct ? '#f0fdf4' : '#fff5f5'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f2744' }}>
                                प्रश्न {aidx + 1}: {ans.question_text}
                              </span>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: ans.is_correct ? '#166534' : '#991b1b',
                                backgroundColor: ans.is_correct ? '#dcfce7' : '#fee2e2',
                                padding: '2px 8px',
                                borderRadius: '10px'
                              }}>
                                {ans.is_correct ? '✅ 1/1 अंक' : '❌ 0/1 अंक'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                              छात्र का चयन: <strong style={{ color: ans.is_correct ? '#166534' : '#b91c1c' }}>{ans.selected_answer || '(अनुत्तरित / कोई विकल्प नहीं चुना)'}</strong>
                            </div>
                            {!ans.is_correct && (
                              <div style={{ fontSize: '0.82rem', color: '#166534', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '6px', marginTop: '6px', fontWeight: 700 }}>
                                🎯 सही उत्तर: {ans.correct_answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      विवरण देखने के लिए बाएँ से किसी छात्र का चयन करें।
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Worksheets;
