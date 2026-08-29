import React, { useState, useMemo } from 'react';
import { sfx } from '../utils/sfx';

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
      { id: 'c2_reading_comp', label: '📖 Short Story Comprehension Questions', desc: '3-question bilingual comprehension drill', nipunRef: 'Grade 2 Literacy: Re-tell 8–10 sentence story; 30–45 WPM' },
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
  { emoji: '✋', hin: 'हाथ', sat: 'ᱦᱟᱹᱛᱤ', pron: 'Haati' },
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
  { hin: 'आना', sat: 'ᱟᱠᱟᱱᱟ', opp_hin: 'जाना', opp_sat: 'ᱜᱮᱭᱟ' },
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
];

function generateQuestions(questionType: string, numQuestions: number): Question[] {
  const generated: Question[] = [];

  for (let i = 1; i <= numQuestions; i++) {
    // ── BALVATIKA NUMERACY ──────────────────────────────────────────────
    if (questionType === 'bal_counting') {
      const count = Math.ceil((i % 5) + 1 > 5 ? 5 : (i % 5) + 1);
      const emojis = ['🐮', '🐐', '🍎', '🌸', '⭐', '🍌'];
      const em = emojis[i % emojis.length];
      generated.push({
        id: i, type: questionType,
        question_hin: `गिनो और Ol Chiki में लिखो: ${Array(count).fill(em).join(' ')} = ___`,
        question_sat: `ᱞᱮᱠᱷᱟᱭ ᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱞᱮᱠᱷᱮ: ${Array(count).fill(em).join(' ')} = ___`,
        correct_answer: `${count} = ${OL_DIGITS[count]}`,
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
        options: [p.a, p.b],
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
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} + ${b} = ___  (उत्तर Ol Chiki में भी लिखो)`,
        question_sat: `${OL_DIGITS[a]} + ${OL_DIGITS[b]} = ___ (ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱞᱮᱠᱷᱮ)`,
        correct_answer: `${a + b}  (Santali: ${SANTALI_NUMS[a + b - 1] || (a + b)})`,
        hint: `गिनती करें: ${a} से आगे ${b} कदम गिनें (${SANTALI_NUMS[a-1]} ᱟᱨ ${SANTALI_NUMS[b-1]} = ${SANTALI_NUMS[a+b-1] || a+b})`,
      });
    }

    else if (questionType === 'c1_subtraction') {
      const a = Math.floor(Math.random() * 5) + 4;
      const b = Math.floor(Math.random() * 3) + 1;
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} - ${b} = ___`,
        question_sat: `${OL_DIGITS[a]} - ${OL_DIGITS[b]} = ___`,
        correct_answer: `${a - b}  (${SANTALI_NUMS[a - b - 1] || (a - b)})`,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `खाली स्थान भरो: ${start}, ${start + 1}, ___, ${start + 3}`,
        question_sat: `ᱯᱮᱨᱮᱡᱽ ᱢᱮ: ${OL_DIGITS[start]}, ${OL_DIGITS[start + 1]}, ___, ${OL_DIGITS[start + 3]}`,
        correct_answer: `${start + 2}  (${SANTALI_NUMS[start + 1]})`,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `पैटर्न पहचानो और अगला बताओ: ${p.q}`,
        question_sat: `ᱯᱮᱴᱟᱨᱱ ᱜᱟ ᱱᱚᱣᱟ ᱟᱜᱩ ᱞᱮᱠᱷᱟ ᱢᱮᱱᱟᱜ: ${p.q}`,
        correct_answer: p.ans,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} + ${b} = ___  (कॉलम में हल करो)`,
        question_sat: `${a} + ${b} = ___  (ᱠᱳᱞᱚᱢ ᱛᱮ ᱦᱟᱹᱞ ᱠᱟᱹᱢᱤ)`,
        correct_answer: `${a + b}`,
        hint: 'Add ones first, then tens',
      });
    }

    else if (questionType === 'c2_subtraction') {
      const a = Math.floor(Math.random() * 40) + 50;
      const b = Math.floor(Math.random() * 30) + 10;
      generated.push({
        id: i, type: questionType,
        question_hin: `${a} - ${b} = ___`,
        question_sat: `${a} - ${b} = ___`,
        correct_answer: `${a - b}`,
        hint: 'Subtract ones first, then tens',
      });
    }

    else if (questionType === 'c2_place_value') {
      const num = Math.floor(Math.random() * 80) + 15;
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      generated.push({
        id: i, type: questionType,
        question_hin: `${num} में ᱜᱮᱞ (दहाई) और ᱢᱤᱫ (इकाई) बताओ:`,
        question_sat: `${num} ᱨᱮ ᱜᱮᱞ ᱟᱨ ᱢᱤᱫ ᱞᱟᱹᱭ ᱢᱮ:`,
        correct_answer: `${tens} ᱜᱮᱞ (Tens) + ${ones} ᱢᱤᱫ (Ones)`,
        hint: `${num} = ${tens}×10 + ${ones}`,
      });
    }

    else if (questionType === 'c2_multiplication_intro') {
      const num = Math.floor(Math.random() * 4) + 2;
      const times = Math.floor(Math.random() * 3) + 2;
      const sumStr = Array(times).fill(num).join(' + ');
      generated.push({
        id: i, type: questionType,
        question_hin: `बार-बार जोड़ को गुणा में बदलो: ${sumStr} = ${num} × ___ = ___`,
        question_sat: `ᱫᱚᱦᱲᱟ ᱡᱚᱲᱟᱣ ᱜᱩᱱᱟᱭ: ${sumStr} = ${num} × ___ = ___`,
        correct_answer: `${num} × ${times} = ${num * times}`,
        hint: `Count the groups of ${num}`,
      });
    }

    else if (questionType === 'c2_money') {
      const coins = [5, 10, 20];
      const coin = coins[i % coins.length];
      const count = Math.floor(Math.random() * 3) + 2;
      generated.push({
        id: i, type: questionType,
        question_hin: `₹${coin} के ${count} सिक्के/नोट हों तो कुल ᱴᱟᱠᱟ (रुपये) कितने?`,
        question_sat: `₹${coin} ᱨᱮᱱᱟᱜ ${count} ᱴᱟᱠᱟ ᱢᱮᱱᱟᱜᱼᱟ, ᱛᱚᱵᱮ ᱡᱚᱛᱚ ᱴᱟᱠᱟ ᱛᱤᱱᱟᱹᱜ?`,
        correct_answer: `₹${coin * count}  (${coin} × ${count} = ${coin * count})`,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `📖 पढ़ो और उत्तर दो:\n"${story.story_hin}"\n❓ ${story.q_hin}`,
        question_sat: `📖 ᱯᱟᱲᱦᱟᱭ ᱟᱨ ᱛᱮᱞᱟ ᱫᱮ:\n"${story.story_sat}"\n❓ ${story.q_sat}`,
        correct_answer: story.answer,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `कॉलम विधि से हल करो: ${op === '+' ? `${a} + ${b}` : `${bigger} - ${smaller}`} = ___`,
        question_sat: `ᱠᱳᱞᱚᱢ ᱵᱤᱫᱷᱤ ᱛᱮ: ${op === '+' ? `${a} + ${b}` : `${bigger} - ${smaller}`} = ___`,
        correct_answer: op === '+' ? `${a + b}` : `${bigger - smaller}`,
        hint: `Align ones/tens/hundreds in columns, then solve step by step`,
      });
    }

    else if (questionType === 'c3_tables') {
      const tableNum = (i % 8) + 2;
      const mul = Math.floor(Math.random() * 9) + 1;
      generated.push({
        id: i, type: questionType,
        question_hin: `${OL_DIGITS[tableNum]} × ${OL_DIGITS[mul]} = ___  (${tableNum} × ${mul})`,
        question_sat: `${OL_DIGITS[tableNum]} × ${OL_DIGITS[mul]} = ___ (ᱜᱩᱬᱟᱹᱣ)`,
        correct_answer: `${tableNum * mul}`,
        hint: `Table of ${tableNum}: think ${tableNum} + ${tableNum} + ... (${mul} times)`,
      });
    }

    else if (questionType === 'c3_division') {
      const divisor = Math.floor(Math.random() * 4) + 2;
      const quotient = Math.floor(Math.random() * 6) + 2;
      const dividend = divisor * quotient;
      generated.push({
        id: i, type: questionType,
        question_hin: `${dividend} आम को ${divisor} बच्चों में बराबर बाँटो। हर बच्चे को कितने? (${dividend} ÷ ${divisor})`,
        question_sat: `${dividend} ᱟᱢ ${divisor} ᱜᱤᱫᱽᱨᱟᱹ ᱨᱮ ᱵᱟᱨᱟᱵᱟᱹᱨᱤ ᱦᱟᱹᱴᱤᱧᱟ᱾ ᱡᱚᱱᱚ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ ᱛᱤᱱᱟᱹ ᱧᱟᱢᱚᱜᱼᱟ?`,
        correct_answer: `${quotient} आम (ᱟᱢ) प्रत्येक को`,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `ᱥᱩᱱᱤᱛᱟ के पास ${a} आम थे। उसने अपनी दोस्त को ${b} आम दिए। कितने बचे?`,
        question_sat: `ᱥᱩᱱᱤᱛᱟ ᱴᱷᱮᱱ ${a} ᱟᱢ ᱛᱟᱦᱮᱸᱠᱟᱱᱟᱭ᱾ ᱟᱡ ᱫᱚᱥᱛᱩᱭ ᱫᱚ ${b} ᱟᱢ ᱮᱢᱟᱫᱮᱭᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱲᱚᱜᱼᱟ?`,
        correct_answer: `${a - b} आम (ᱟᱢ)`,
        hint: `Subtraction: ${a} - ${b} = ?`,
      });
    }

    // ── CLASS 3 LITERACY ─────────────────────────────────────────────
    else if (questionType === 'c3_comprehension') {
      const story = CLASS3_STORIES[i % CLASS3_STORIES.length];
      generated.push({
        id: i, type: questionType,
        question_hin: `📖 NIPUN ORF Practice — पढ़ो और उत्तर दो (60 WPM लक्ष्य):\n"${story.story_hin}"\n❓ ${story.q_hin}`,
        question_sat: `📖 NIPUN ᱯᱟᱲᱦᱟᱣ — ᱯᱟᱲᱦᱟᱭ ᱟᱨ ᱛᱮᱞᱟ ᱫᱮ:\n"${story.story_sat}"\n❓ ${story.q_sat}`,
        correct_answer: story.answer,
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
      generated.push({
        id: i, type: questionType,
        question_hin: `✍️ रचनात्मक लेखन: ${t.hin}`,
        question_sat: `✍️ ᱧᱤᱫᱼᱟᱱ ᱞᱮᱠᱷᱟ: ${t.sat}`,
        correct_answer: '(Open-ended — Teacher evaluates for content, clarity, and Ol Chiki usage)',
        hint: 'Write full sentences. Use Ol Chiki script for Santali words.',
      });
    }

    else {
      // Generic fallback
      generated.push({
        id: i, type: questionType,
        question_hin: `प्रश्न ${i}: इस प्रकार के सवाल पर काम करो।`,
        question_sat: `ᱠᱩᱠᱞᱤ ${i}: ᱱᱚᱣᱟ ᱵᱟᱵᱚᱛ ᱠᱟᱹᱢᱤ ᱠᱟᱹᱢᱤ᱾`,
        correct_answer: 'See teacher',
      });
    }
  }

  return generated;
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const Worksheets: React.FC = () => {
  const [grade, setGrade] = useState<string>('Class 1');
  const [domain, setDomain] = useState<string>('Foundational Numeracy');
  const [questionType, setQuestionType] = useState<string>('c1_addition');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);

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

  // Auto-generate initial worksheet so teachers immediately see content
  React.useEffect(() => {
    const qs = generateQuestions('c1_addition', 5);
    setQuestions(qs);
  }, []);

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
    <div className="fade-in" style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '3px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            📝 NIPUN Bharat Grade-Adaptive Worksheet Engine
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Bilingual Worksheet Generator
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Select Grade → Domain (Literacy/Numeracy) → Drill Type → Generate. Each worksheet uses real NIPUN Bharat competency targets.
          </p>
        </div>
        {questions.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => { sfx.playTap(); setShowHints(!showHints); }}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: showHints ? '#fef3c7' : '#fff', color: showHints ? '#92400e' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: showHints ? '0 0 8px rgba(234, 179, 8, 0.4)' : 'none' }}>
              💡 {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
            <button onClick={() => { if (!showAnswers) sfx.playSuccess(); else sfx.playTap(); setShowAnswers(!showAnswers); }}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: showAnswers ? '#f0fdf4' : '#fff', color: showAnswers ? '#166534' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
              {showAnswers ? '👁️ Hide Answers' : '🔑 Show Answer Key'}
            </button>
            <button onClick={handlePrint}
              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: '#0f2744', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,39,68,0.25)' }}>
              🖨️ Print / PDF
            </button>
          </div>
        )}
      </div>

      {/* Configuration Panel */}
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
              {Object.keys(GRADE_DRILL_TYPES).map(g => (
                <option key={g} value={g}>{GRADE_ICONS[g]} {g}</option>
              ))}
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

      {/* Printable Worksheet */}
      {questions.length > 0 && (
        <div className="printable-sheet" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '2px solid #e2e8f0' }}>
          {/* School Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
              Govt. of Jharkhand • PALASH MTB-MLE Programme (SIH 26042)
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2744', margin: '4px 0' }}>
              PalashSetu NIPUN Practice Worksheet (ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ)
            </h2>
            <div style={{ fontSize: '0.88rem', color: '#c05621', fontWeight: 700, marginBottom: '4px' }}>
              {grade} • {domain} • {selectedDrill?.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              🎯 {selectedDrill?.nipunRef}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1rem', textAlign: 'left', fontSize: '0.82rem', color: '#334155' }}>
              <div><strong>Student Name (ᱧᱩᱛᱩᱢ):</strong> _________________</div>
              <div><strong>Roll No.:</strong> _______</div>
              <div><strong>Date (ᱛᱟᱨᱤᱠ):</strong> ___________</div>
              <div><strong>Score (ᱮᱞ):</strong> ______ / {questions.length}</div>
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
                      ✅ {q.correct_answer}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f2744', marginBottom: '4px', whiteSpace: 'pre-wrap' }}>
                  {q.question_hin}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#c05621', fontWeight: 600, fontFamily: 'serif', marginBottom: q.options ? '10px' : '0', whiteSpace: 'pre-wrap' }}>
                  {q.question_sat}
                </div>

                {q.options && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #94a3b8', display: 'inline-block', flexShrink: 0 }} />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!q.options && (
                  <div style={{ marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
                    Answer: _______________________________________________
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
        </div>
      )}

      {/* Empty state */}
      {questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📝</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f2744', marginBottom: '6px' }}>Select Grade, Domain & Drill Type</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Then click <strong>Generate Worksheet</strong> to create a printable bilingual NIPUN practice sheet.
          </div>
        </div>
      )}
    </div>
  );
};

export default Worksheets;
