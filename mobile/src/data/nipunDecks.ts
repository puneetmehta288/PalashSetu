/**
 * NIPUN Bharat Complete Flashcard Deck Data
 * Research-Based: NCF Foundational Stage 2022, NIPUN Bharat Lakshyas
 * MTB-MLE: Santali (Ol Chiki) → Hindi bilingual decks
 * Covers: Balvatika (FLN L1) through Class 3 (FLN L4)
 */

export interface FlashcardItem {
  id: number;
  deckId: string;
  grade: 'Balvatika' | 'Class 1' | 'Class 2' | 'Class 3';
  domain: 'Literacy' | 'Numeracy';
  hindi: string;
  santali: string;           // Ol Chiki script
  pronunciation: string;     // Romanised pronunciation
  emoji: string;
  description: string;       // Context details
  nipunTarget?: string;      // NIPUN Lakshya connection
}

// ─────────────────────────────────────────────
//  BALVATIKA — FLN Level 1
// ─────────────────────────────────────────────

export const DECK_BAL_ANIMALS: FlashcardItem[] = [
  { id: 101, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'गाय', santali: 'ᱜᱟᱹᱭ', pronunciation: 'Gaay', emoji: '🐮', description: 'Cow • Domestic farm animal • ᱫᱩᱫᱷ ᱮᱢᱚᱜ', nipunTarget: 'BOX2: Uses theme vocabulary in conversation' },
  { id: 102, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'बकरी', santali: 'ᱢᱮᱨᱚᱢ', pronunciation: 'Merom', emoji: '🐐', description: 'Goat • Domestic animal • ᱜᱟᱹᱥᱤ ᱡᱚᱢ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 103, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'हाथी', santali: 'ᱦᱟᱹᱛᱤ', pronunciation: 'Haati', emoji: '🐘', description: 'Elephant • Biggest forest animal • ᱢᱟᱨᱟᱝ ᱡᱤᱵᱽ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 104, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'बंदर', santali: 'ᱜᱟᱹᱰᱤ', pronunciation: 'Gaadi', emoji: '🐵', description: 'Monkey • Tree climber • ᱫᱟᱨᱮ ᱫᱮᱡᱚᱜ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 105, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'मछली', santali: 'ᱦᱟᱹᱠᱩ', pronunciation: 'Haaku', emoji: '🐟', description: 'Fish • Lives in river/pond • ᱫᱟᱜ ᱨᱮ ᱛᱟᱦᱮᱸᱱ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 106, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'कुत्ता', santali: 'ᱥᱮᱛᱟ', pronunciation: 'Seta', emoji: '🐶', description: 'Dog • Faithful friend • ᱚᱲᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 107, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'मुर्गी', santali: 'ᱥᱤᱢ', pronunciation: 'Sim', emoji: '🐔', description: 'Hen • Farm bird • ᱵᱤᱞᱤ ᱮᱢᱚᱜ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 108, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'भैंस', santali: 'ᱠᱟᱰᱟ', pronunciation: 'Kaada', emoji: '🐃', description: 'Buffalo • Field worker & milk giver', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 109, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'बिल्ली', santali: 'ᱯᱩᱥᱤ', pronunciation: 'Pusi', emoji: '🐱', description: 'Cat • Domestic pet • ᱪᱩᱴᱤᱭᱟᱹ ᱥᱟᱵ', nipunTarget: 'BOX2: Oral vocabulary development' },
  { id: 110, deckId: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', hindi: 'चिड़िया', santali: 'ᱪᱮᱬᱮ', pronunciation: 'Chere', emoji: '🐦', description: 'Bird • Small flyer in trees • ᱩᱰᱟᱹᱣ', nipunTarget: 'BOX2: Oral vocabulary development' },
];

export const DECK_BAL_BODY: FlashcardItem[] = [
  { id: 201, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'आंख', santali: 'ᱢᱮᱫ', pronunciation: 'Med', emoji: '👁️', description: 'Eye • For seeing things • ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ', nipunTarget: 'BRX3: Letter-sound awareness through familiar words' },
  { id: 202, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'हाथ', santali: 'ᱛᱤ', pronunciation: 'Ti', emoji: '✋', description: 'Hand • For writing & working • ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ', nipunTarget: 'BOX1: Communicate with teachers and peers' },
  { id: 203, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'नाक', santali: 'ᱢᱩᱸ', pronunciation: 'Mu', emoji: '👃', description: 'Nose • For breathing & smelling • ᱥᱩᱸᱜᱷᱟᱹᱣ', nipunTarget: 'BOX2: Theme vocabulary usage' },
  { id: 204, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'मुंह', santali: 'ᱢᱚᱪᱟ', pronunciation: 'Mocha', emoji: '👄', description: 'Mouth • For speaking & eating • ᱨᱚᱲ ᱟᱨ ᱡᱚᱢ', nipunTarget: 'BOX2: Theme vocabulary usage' },
  { id: 205, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'कान', santali: 'ᱞᱩᱛᱩᱨ', pronunciation: 'Lutur', emoji: '👂', description: 'Ear • For listening carefully • ᱟᱸᱡᱚᱢ ᱞᱟᱹᱜᱤᱫ', nipunTarget: 'BOE1: Listens attentively' },
  { id: 206, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'पैर', santali: 'ᱡᱟᱝᱜᱟ', pronunciation: 'Janga', emoji: '🦶', description: 'Foot • For walking & running • ᱛᱟᱲᱟᱢ ᱞᱟᱹᱜᱤᱫ', nipunTarget: 'BOX2: Theme vocabulary usage' },
  { id: 207, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'सिर', santali: 'ᱵᱚᱦᱚᱜ', pronunciation: 'Bohog', emoji: '🧠', description: 'Head • Center of thinking • ᱩᱭᱦᱟᱹᱨ', nipunTarget: 'BOX2: Theme vocabulary usage' },
  { id: 208, deckId: 'bal_body', grade: 'Balvatika', domain: 'Literacy', hindi: 'उंगली', santali: 'ᱠᱟᱹᱴᱩᱵ', pronunciation: 'Katub', emoji: '👆', description: 'Finger • We count with our fingers • ᱞᱮᱠᱷᱟ', nipunTarget: 'BOX2 + Number sense connection' },
];

export const DECK_BAL_SHAPES: FlashcardItem[] = [
  { id: 301, deckId: 'bal_shapes', grade: 'Balvatika', domain: 'Numeracy', hindi: 'गोला (वृत्त)', santali: 'ᱜᱩᱞ', pronunciation: 'Gul', emoji: '⭕', description: 'Circle • Round, zero corners • Full moon is a circle ᱪᱟᱸᱫᱚ', nipunTarget: 'Balvatika Numeracy: Recognize 2D shapes' },
  { id: 302, deckId: 'bal_shapes', grade: 'Balvatika', domain: 'Numeracy', hindi: 'चौकोर (वर्ग)', santali: 'ᱪᱟᱹᱨᱠᱷᱤ', pronunciation: 'Charkhi', emoji: '⏹️', description: 'Square • 4 equal sides • Slate & window frames', nipunTarget: 'Balvatika Numeracy: Recognize 2D shapes' },
  { id: 303, deckId: 'bal_shapes', grade: 'Balvatika', domain: 'Numeracy', hindi: 'तिकोना (त्रिभुज)', santali: 'ᱯᱮ ᱠᱳᱬ', pronunciation: 'Pe Kon', emoji: '🔺', description: 'Triangle • 3 corners and 3 sides • Mountain peaks ᱵᱩᱨᱩ', nipunTarget: 'Balvatika Numeracy: Recognize 2D shapes' },
  { id: 304, deckId: 'bal_shapes', grade: 'Balvatika', domain: 'Numeracy', hindi: 'आयत (Rectangle)', santali: 'ᱟᱭᱚᱛ', pronunciation: 'Ayot', emoji: '🟦', description: 'Rectangle • 2 long sides, 2 short sides • Classroom door ᱫᱩᱣᱟᱹᱨ', nipunTarget: 'Balvatika Numeracy: Recognize 2D shapes' },
  { id: 305, deckId: 'bal_shapes', grade: 'Balvatika', domain: 'Numeracy', hindi: 'तारा', santali: 'ᱤᱯᱤᱞ', pronunciation: 'Ipil', emoji: '⭐', description: 'Star • 5 points • Night sky stars ᱧᱤᱫᱟᱹ ᱤᱯᱤᱞ', nipunTarget: 'Balvatika Numeracy: Recognize 2D shapes' },
];

export const DECK_BAL_COMPARE: FlashcardItem[] = [
  { id: 401, deckId: 'bal_compare', grade: 'Balvatika', domain: 'Numeracy', hindi: 'बड़ा / छोटा', santali: 'ᱢᱟᱨᱟᱝ / ᱦᱩᱰᱤᱧ', pronunciation: 'Marang / Hudinj', emoji: '🐘🐭', description: 'Big (Elephant) vs Small (Mouse) • ᱢᱟᱨᱟᱝ ᱟᱨ ᱦᱩᱰᱤᱧ', nipunTarget: 'Balvatika Numeracy: Size comparison concepts' },
  { id: 402, deckId: 'bal_compare', grade: 'Balvatika', domain: 'Numeracy', hindi: 'लंबा / छोटा', santali: 'ᱩᱥᱩᱞ / ᱪᱟᱯᱮ', pronunciation: 'Usul / Chape', emoji: '🦒🐢', description: 'Tall (Giraffe) vs Short (Turtle)', nipunTarget: 'Balvatika Numeracy: Size comparison concepts' },
  { id: 403, deckId: 'bal_compare', grade: 'Balvatika', domain: 'Numeracy', hindi: 'ज़्यादा / कम', santali: 'ᱰᱷᱮᱨ / ᱠᱚᱢ', pronunciation: 'Dher / Kom', emoji: '🍎🍎🍎🍎 / 🍎', description: 'More vs Less • Count and compare quantities', nipunTarget: 'Balvatika Numeracy: Pre-number concepts' },
  { id: 404, deckId: 'bal_compare', grade: 'Balvatika', domain: 'Numeracy', hindi: 'भारी / हल्का', santali: 'ᱦᱟᱢᱟᱞ / ᱨᱟᱣᱟᱞ', pronunciation: 'Hamal / Rawal', emoji: '🪨🪶', description: 'Heavy (Rock) vs Light (Feather)', nipunTarget: 'Balvatika Numeracy: Measurement concepts' },
  { id: 405, deckId: 'bal_compare', grade: 'Balvatika', domain: 'Numeracy', hindi: 'गर्म / ठंडा', santali: 'ᱞᱚᱞᱚ / ᱨᱮᱭᱟᱲ', pronunciation: 'Lolo / Reyar', emoji: '🔥❄️', description: 'Hot vs Cold', nipunTarget: 'Balvatika Numeracy: Classification concepts' },
];

export const DECK_BAL_COUNTING: FlashcardItem[] = [
  { id: 501, deckId: 'bal_counting', grade: 'Balvatika', domain: 'Numeracy', hindi: 'एक (1)', santali: 'ᱢᱤᱫ', pronunciation: 'Mid', emoji: '1️⃣', description: '1 object • One-to-one correspondence • ᱢᱤᱫᱴᱟᱝ', nipunTarget: 'Balvatika Numeracy: Count 1–5 with one-to-one correspondence' },
  { id: 502, deckId: 'bal_counting', grade: 'Balvatika', domain: 'Numeracy', hindi: 'दो (2)', santali: 'ᱵᱟᱨ', pronunciation: 'Bar', emoji: '2️⃣', description: '2 objects • A pair of eyes • ᱵᱟᱨᱭᱟ ᱢᱮᱫ', nipunTarget: 'Balvatika Numeracy: Count 1–5' },
  { id: 503, deckId: 'bal_counting', grade: 'Balvatika', domain: 'Numeracy', hindi: 'तीन (3)', santali: 'ᱯᱮ', pronunciation: 'Pe', emoji: '3️⃣', description: '3 objects • Triangle has 3 corners • ᱯᱮᱭᱟ', nipunTarget: 'Balvatika Numeracy: Count 1–5' },
  { id: 504, deckId: 'bal_counting', grade: 'Balvatika', domain: 'Numeracy', hindi: 'चार (4)', santali: 'ᱯᱩᱱ', pronunciation: 'Pun', emoji: '4️⃣', description: '4 objects • Table has 4 legs • ᱯᱩᱱᱭᱟ', nipunTarget: 'Balvatika Numeracy: Count 1–5' },
  { id: 505, deckId: 'bal_counting', grade: 'Balvatika', domain: 'Numeracy', hindi: 'पाँच (5)', santali: 'ᱢᱚᱬᱮ', pronunciation: 'Mone', emoji: '5️⃣', description: '5 objects • One full hand of fingers • ᱢᱚᱬᱮᱭᱟ', nipunTarget: 'Balvatika Numeracy: Count 1–5' },
];

// ─────────────────────────────────────────────
//  CLASS 1 — FLN Level 2
// ─────────────────────────────────────────────

export const DECK_C1_OLCHIKI: FlashcardItem[] = [
  { id: 601, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱚ', santali: 'O', pronunciation: 'O (as in ᱚᱞ = Write)', emoji: '✍️', description: '1st Ol Chiki letter • Shape inspired by human mouth opening • Pandit Raghunath Murmu (1925)', nipunTarget: 'Grade 1 Literacy: Letter recognition and sound correspondence' },
  { id: 602, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱛ', santali: 'T', pronunciation: 'Ot / T (as in ᱛᱤ = Hand)', emoji: '✋', description: 'Ol Chiki consonant T • Shape inspired by ground/earth', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 603, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱜ', santali: 'G', pronunciation: 'Og / G (as in ᱜᱟᱹᱭ = Cow)', emoji: '🐮', description: 'Ol Chiki letter G • Example word: ᱜᱮᱞ = 10', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 604, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱟ', santali: 'A', pronunciation: 'Laa / A (as in ᱟᱢ = You / Mango)', emoji: '🥭', description: 'Ol Chiki vowel A • Example word: ᱟᱨᱮ = 9', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 605, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱡ', santali: 'J', pronunciation: 'Aj / J (as in ᱡᱚᱦᱟᱨ = Hello)', emoji: '🙏', description: 'Ol Chiki J • Key greeting: ᱡᱚᱦᱟᱨ', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 606, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱢ', santali: 'M', pronunciation: 'Am / M (as in ᱢᱮᱫ = Eye)', emoji: '👁️', description: 'Ol Chiki M • Example word: ᱢᱤᱫ = 1', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 607, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱯ', santali: 'P', pronunciation: 'Ep / P (as in ᱯᱩᱛᱷᱤ = Book)', emoji: '📚', description: 'Ol Chiki P • Example word: ᱯᱮ = 3', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 608, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱦ', santali: 'H', pronunciation: 'Oh / H (as in ᱦᱚᱲ = Person)', emoji: '🧑', description: 'Ol Chiki H • Santali self-identity: ᱦᱚᱲ', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 609, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱠ', santali: 'K', pronunciation: 'Ak / K (as in ᱠᱟᱹᱦᱱᱤ = Story)', emoji: '📖', description: 'Ol Chiki K • Example word: ᱠᱞᱟᱥ = Class', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
  { id: 610, deckId: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', hindi: 'ᱥ', santali: 'S', pronunciation: 'Is / S (as in ᱥᱟᱱᱛᱟᱲᱤ = Santali)', emoji: '🗣️', description: 'Ol Chiki S • Identity word: ᱥᱟᱱᱛᱟᱲᱤ', nipunTarget: 'Grade 1 Literacy: Letter recognition' },
];

export const DECK_C1_NUMBERS: FlashcardItem[] = [
  { id: 701, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'एक (1)', santali: 'ᱢᱤᱫ', pronunciation: 'Mid', emoji: '1️⃣', description: 'Number 1 • Ol Chiki digit: ᱑ • ᱢᱤᱫᱴᱟᱝ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 702, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'दो (2)', santali: 'ᱵᱟᱨ', pronunciation: 'Bar', emoji: '2️⃣', description: 'Number 2 • Ol Chiki digit: ᱒ • ᱵᱟᱨᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 703, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'तीन (3)', santali: 'ᱯᱮ', pronunciation: 'Pe', emoji: '3️⃣', description: 'Number 3 • Ol Chiki digit: ᱓ • ᱯᱮᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 704, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'चार (4)', santali: 'ᱯᱩᱱ', pronunciation: 'Pun', emoji: '4️⃣', description: 'Number 4 • Ol Chiki digit: ᱔ • ᱯᱩᱱᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 705, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'पाँच (5)', santali: 'ᱢᱚᱬᱮ', pronunciation: 'Mone', emoji: '5️⃣', description: 'Number 5 • Ol Chiki digit: ᱕ • ᱢᱚᱬᱮᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 706, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'छह (6)', santali: 'ᱛᱩᱨᱩᱭ', pronunciation: 'Turuy', emoji: '6️⃣', description: 'Number 6 • Ol Chiki digit: ᱖ • ᱛᱩᱨᱩᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 707, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'सात (7)', santali: 'ᱮᱭᱟᱭ', pronunciation: 'Eyay', emoji: '7️⃣', description: 'Number 7 • Ol Chiki digit: ᱗ • ᱮᱭᱟᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 708, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'आठ (8)', santali: 'ᱤᱨᱞ', pronunciation: 'Iral', emoji: '8️⃣', description: 'Number 8 • Ol Chiki digit: ᱘ • ᱤᱨᱞᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 709, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'नौ (9)', santali: 'ᱟᱨᱮ', pronunciation: 'Are', emoji: '9️⃣', description: 'Number 9 • Ol Chiki digit: ᱙ • ᱟᱨᱮᱭᱟ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
  { id: 710, deckId: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', hindi: 'दस (10)', santali: 'ᱜᱮᱞ', pronunciation: 'Gel', emoji: '🔟', description: 'Number 10 • Ol Chiki digit: ᱑᱐ • ᱜᱮᱞᱴᱟᱝ', nipunTarget: 'Grade 1 Numeracy: Read, write, count 1–99' },
];

export const DECK_C1_ADDITION: FlashcardItem[] = [
  { id: 801, deckId: 'c1_addition', grade: 'Class 1', domain: 'Numeracy', hindi: '1 + 1 = 2', santali: 'ᱢᱤᱫ + ᱢᱤᱫ = ᱵᱟᱨ', pronunciation: 'Mid + Mid = Bar', emoji: '➕', description: '1 and 1 together make 2 • ᱢᱤᱫ ᱟᱨ ᱢᱤᱫ ᱡᱚᱲᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱵᱟᱨ', nipunTarget: 'Grade 1 Numeracy: Single-digit addition, sums up to 20' },
  { id: 802, deckId: 'c1_addition', grade: 'Class 1', domain: 'Numeracy', hindi: '2 + 3 = 5', santali: 'ᱵᱟᱨ + ᱯᱮ = ᱢᱚᱬᱮ', pronunciation: 'Bar + Pe = Mone', emoji: '➕', description: '2 and 3 together make 5 • One full hand', nipunTarget: 'Grade 1 Numeracy: Single-digit addition' },
  { id: 803, deckId: 'c1_addition', grade: 'Class 1', domain: 'Numeracy', hindi: '4 + 3 = 7', santali: 'ᱯᱩᱱ + ᱯᱮ = ᱮᱭᱟᱭ', pronunciation: 'Pun + Pe = Eyay', emoji: '➕', description: '4 and 3 make 7 • Days of week', nipunTarget: 'Grade 1 Numeracy: Single-digit addition' },
  { id: 804, deckId: 'c1_addition', grade: 'Class 1', domain: 'Numeracy', hindi: '5 + 4 = 9', santali: 'ᱢᱚᱬᱮ + ᱯᱩᱱ = ᱟᱨᱮ', pronunciation: 'Mone + Pun = Are', emoji: '➕', description: '5 and 4 make 9 • One less than 10', nipunTarget: 'Grade 1 Numeracy: Single-digit addition' },
  { id: 805, deckId: 'c1_addition', grade: 'Class 1', domain: 'Numeracy', hindi: '6 + 4 = 10', santali: 'ᱛᱩᱨᱩᱭ + ᱯᱩᱱ = ᱜᱮᱞ', pronunciation: 'Turuy + Pun = Gel', emoji: '🔟', description: '6 and 4 make 10 • All 10 fingers (ᱜᱮᱞ)', nipunTarget: 'Grade 1 Numeracy: Single-digit addition, sum up to 20' },
];

export const DECK_C1_CLASSROOMS: FlashcardItem[] = [
  { id: 901, deckId: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', hindi: 'जोहार (नमस्ते)', santali: 'ᱡᱚᱦᱟᱨ', pronunciation: 'Johar', emoji: '🙏', description: 'Traditional Santali greeting • Morning and evening greeting in school', nipunTarget: 'Grade 1 Literacy: Classroom dialogues and greetings' },
  { id: 902, deckId: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', hindi: 'किताब', santali: 'ᱯᱩᱛᱷᱤ', pronunciation: 'Puthi', emoji: '📚', description: 'Book • ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ = Open your book', nipunTarget: 'Grade 1 Literacy: Classroom vocabulary' },
  { id: 903, deckId: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', hindi: 'पानी', santali: 'ᱫᱟᱜ', pronunciation: 'Daak', emoji: '💧', description: 'Water • ᱫᱟᱜ ᱧᱩ ᱞᱟᱹᱜᱤᱫ = For drinking water', nipunTarget: 'Grade 1 Literacy: Classroom dialogues' },
  { id: 904, deckId: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', hindi: 'शिक्षक', santali: 'ᱢᱟᱪᱮᱛ', pronunciation: 'Machet', emoji: '👩‍🏫', description: 'Teacher • Male teacher: ᱢᱟᱪᱮᱛ, Female: ᱢᱟᱪᱮᱛᱟᱹᱱᱤ', nipunTarget: 'Grade 1 Literacy: Classroom vocabulary' },
  { id: 905, deckId: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', hindi: 'हाँ / नहीं', santali: 'ᱦᱮᱸ / ᱵᱟᱝ', pronunciation: 'He / Bang', emoji: '✅', description: 'Yes (ᱦᱮᱸ) / No (ᱵᱟᱝ) • Core communication response', nipunTarget: 'Grade 1 Literacy: Oral communication' },
  { id: 906, deckId: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', hindi: 'बैठो / खड़े हो', santali: 'ᱫᱩᱲᱩᱵ / ᱛᱤᱸᱜᱩ', pronunciation: 'Durup / Tingu', emoji: '🪑', description: 'Sit (ᱫᱩᱲᱩᱵ) / Stand up (ᱛᱤᱸᱜᱩ) • Classroom instructions', nipunTarget: 'Grade 1 Literacy: Follow classroom instructions' },
];

// ─────────────────────────────────────────────
//  CLASS 2 — FLN Level 3
// ─────────────────────────────────────────────

export const DECK_C2_PLACE_VALUE: FlashcardItem[] = [
  { id: 1001, deckId: 'c2_place', grade: 'Class 2', domain: 'Numeracy', hindi: 'दहाई (Tens) = ᱜᱮᱞ', santali: 'ᱜᱮᱞ', pronunciation: 'Gel (Tens)', emoji: '📦', description: '1 bundle of 10 sticks = 1 Ten (ᱜᱮᱞ) • 10 ones make 1 ten', nipunTarget: 'Grade 2 Numeracy: Place value up to 99' },
  { id: 1002, deckId: 'c2_place', grade: 'Class 2', domain: 'Numeracy', hindi: 'इकाई (Ones) = ᱢᱤᱫ', santali: 'ᱢᱤᱫ', pronunciation: 'Mid (Ones)', emoji: '🪵', description: 'Loose single sticks = Ones (ᱢᱤᱫ) • Not yet in a bundle', nipunTarget: 'Grade 2 Numeracy: Place value up to 99' },
  { id: 1003, deckId: 'c2_place', grade: 'Class 2', domain: 'Numeracy', hindi: '23 = 2 दहाई + 3 इकाई', santali: '᱒᱓ = ᱒ ᱜᱮᱞ + ᱓ ᱢᱤᱫ', pronunciation: '23 = Bar Gel + Pe Mid', emoji: '📊', description: '23 = 2 bundles of 10 + 3 loose sticks', nipunTarget: 'Grade 2 Numeracy: Place value decomposition' },
  { id: 1004, deckId: 'c2_place', grade: 'Class 2', domain: 'Numeracy', hindi: '47 = 4 दहाई + 7 इकाई', santali: '᱔᱗ = ᱔ ᱜᱮᱞ + ᱗ ᱢᱤᱫ', pronunciation: '47 = Pun Gel + Eyay Mid', emoji: '📊', description: '47 = 4 bundles of 10 + 7 loose sticks', nipunTarget: 'Grade 2 Numeracy: Place value decomposition' },
  { id: 1005, deckId: 'c2_place', grade: 'Class 2', domain: 'Numeracy', hindi: '90 = 9 दहाई + 0 इकाई', santali: '᱙᱐ = ᱙ ᱜᱮᱞ + ᱐ ᱢᱤᱫ', pronunciation: '90 = Are Gel + Zero Mid', emoji: '📊', description: '90 = 9 full bundles of 10 with 0 loose ones', nipunTarget: 'Grade 2 Numeracy: Place value with zero' },
];

export const DECK_C2_ADDITION: FlashcardItem[] = [
  { id: 1101, deckId: 'c2_addition', grade: 'Class 2', domain: 'Numeracy', hindi: '23 + 14 = 37', santali: '᱒᱓ + ᱑᱔ = ᱓᱗', pronunciation: '23 + 14 = 37', emoji: '➕', description: 'Add ones: 3+4=7. Add tens: 2+1=3. Answer: 37 = ᱓᱗', nipunTarget: 'Grade 2 Numeracy: 2-digit addition up to 99' },
  { id: 1102, deckId: 'c2_addition', grade: 'Class 2', domain: 'Numeracy', hindi: '45 + 23 = 68', santali: '᱔᱕ + ᱒᱓ = ᱖᱘', pronunciation: '45 + 23 = 68', emoji: '➕', description: 'Ones: 5+3=8. Tens: 4+2=6. Answer: 68 = ᱖᱘', nipunTarget: 'Grade 2 Numeracy: 2-digit addition' },
  { id: 1103, deckId: 'c2_addition', grade: 'Class 2', domain: 'Numeracy', hindi: '36 + 47 = 83', santali: '᱓᱖ + ᱔᱗ = ᱘᱓', pronunciation: '36 + 47 = 83', emoji: '➕', description: 'Ones: 6+7=13 (carry 1). Tens: 3+4+1=8. Answer: 83', nipunTarget: 'Grade 2 Numeracy: 2-digit addition with carrying' },
  { id: 1104, deckId: 'c2_addition', grade: 'Class 2', domain: 'Numeracy', hindi: '55 - 23 = 32', santali: '᱕᱕ - ᱒᱓ = ᱓᱒', pronunciation: '55 - 23 = 32', emoji: '➖', description: 'Ones: 5-3=2. Tens: 5-2=3. Answer: 32 = ᱓᱒', nipunTarget: 'Grade 2 Numeracy: 2-digit subtraction' },
  { id: 1105, deckId: 'c2_addition', grade: 'Class 2', domain: 'Numeracy', hindi: '₹10 + ₹5 = ₹15', santali: '₹ᱜᱮᱞ + ₹ᱢᱚᱬᱮ = ₹ᱜᱮᱞ ᱢᱚᱬᱮ', pronunciation: 'Rupee Gel + Rupee Mone', emoji: '💰', description: 'Money addition in market • ᱦᱟᱴ ᱨᱮ ᱴᱟᱠᱟ ᱞᱮᱠᱷᱟ', nipunTarget: 'Grade 2 Numeracy: Money and measurement' },
];

export const DECK_C2_STORY: FlashcardItem[] = [
  { id: 1201, deckId: 'c2_story', grade: 'Class 2', domain: 'Literacy', hindi: 'सोहराय (त्योहार)', santali: 'ᱥᱚᱦᱨᱟᱭ', pronunciation: 'Sohray', emoji: '🎉', description: 'Sohrai = Santali harvest festival • Cattle celebration & village wall art', nipunTarget: 'Grade 2 Literacy: Reading culturally relevant stories' },
  { id: 1202, deckId: 'c2_story', grade: 'Class 2', domain: 'Literacy', hindi: 'दिन / रात', santali: 'ᱢᱟᱦᱟ / ᱧᱤᱫᱟᱹ', pronunciation: 'Maha / Nhinda', emoji: '☀️', description: 'Day (ᱢᱟᱦᱟ) vs Night (ᱧᱤᱫᱟᱹ) • Opposites pair target', nipunTarget: 'Grade 2 Literacy: Opposites and vocabulary pairs' },
  { id: 1203, deckId: 'c2_story', grade: 'Class 2', domain: 'Literacy', hindi: 'गाँव / शहर', santali: 'ᱟᱛᱳ / ᱵᱟᱡᱟᱨ', pronunciation: 'Aato / Bajar', emoji: '🏡', description: 'Village (ᱟᱛᱳ) vs Town (ᱵᱟᱡᱟᱨ) • Experience vocabulary', nipunTarget: 'Grade 2 Literacy: Writing about own experiences' },
  { id: 1204, deckId: 'c2_story', grade: 'Class 2', domain: 'Literacy', hindi: 'आना / जाना', santali: 'ᱦᱤᱡᱩᱜ / ᱥᱮᱱᱚᱜ', pronunciation: 'Hijug / Senog', emoji: '🚶', description: 'Come (ᱦᱤᱡᱩᱜ) / Go (ᱥᱮᱱᱚᱜ) • Action opposites', nipunTarget: 'Grade 2 Literacy: Opposites vocabulary' },
  { id: 1205, deckId: 'c2_story', grade: 'Class 2', domain: 'Literacy', hindi: 'तेज़ / धीरे', santali: 'ᱞᱚᱜᱚᱱ / ᱵᱟᱹᱭ-ᱵᱟᱹᱭ', pronunciation: 'Logon / Bai-Bai', emoji: '⚡', description: 'Fast (ᱞᱚᱜᱚᱱ) vs Slow (ᱵᱟᱹᱭ-ᱵᱟᱹᱭ) • Pace adverbs', nipunTarget: 'Grade 2 Literacy: Opposites vocabulary' },
];

// ─────────────────────────────────────────────
//  CLASS 3 — FLN Level 4
// ─────────────────────────────────────────────

export const DECK_C3_MULTIPLICATION: FlashcardItem[] = [
  { id: 1301, deckId: 'c3_tables', grade: 'Class 3', domain: 'Numeracy', hindi: '2 × 1 = 2', santali: '᱒ × ᱢᱤᱫ = ᱵᱟᱨ', pronunciation: '2 ekam 2', emoji: '✖️', description: 'Table of 2 • 1 group of 2 = 2', nipunTarget: 'Grade 3 Numeracy: Multiplication tables 2–10' },
  { id: 1302, deckId: 'c3_tables', grade: 'Class 3', domain: 'Numeracy', hindi: '2 × 5 = 10', santali: '᱒ × ᱢᱚᱬᱮ = ᱜᱮᱞ', pronunciation: '2 × Mone = Gel', emoji: '✖️', description: '5 groups of 2 = 10 • All 10 fingers', nipunTarget: 'Grade 3 Numeracy: Multiplication tables' },
  { id: 1303, deckId: 'c3_tables', grade: 'Class 3', domain: 'Numeracy', hindi: '3 × 4 = 12', santali: '᱓ × ᱯᱩᱱ = ᱑᱒', pronunciation: 'Pe × Pun = 12', emoji: '✖️', description: '4 groups of 3 = 12', nipunTarget: 'Grade 3 Numeracy: Multiplication tables' },
  { id: 1304, deckId: 'c3_tables', grade: 'Class 3', domain: 'Numeracy', hindi: '5 × 5 = 25', santali: 'ᱢᱚᱬᱮ × ᱢᱚᱬᱮ = ᱒᱕', pronunciation: 'Mone × Mone = 25', emoji: '✖️', description: '5 groups of 5 = 25 • Square of 5', nipunTarget: 'Grade 3 Numeracy: Multiplication tables' },
  { id: 1305, deckId: 'c3_tables', grade: 'Class 3', domain: 'Numeracy', hindi: '10 × 3 = 30', santali: 'ᱜᱮᱞ × ᱯᱮ = ᱓᱐', pronunciation: 'Gel × Pe = 30', emoji: '🔟', description: '3 groups of 10 = 30 • ᱯᱮ ᱜᱮᱞ', nipunTarget: 'Grade 3 Numeracy: Multiplication tables up to 10' },
];

export const DECK_C3_DIVISION: FlashcardItem[] = [
  { id: 1401, deckId: 'c3_division', grade: 'Class 3', domain: 'Numeracy', hindi: '10 ÷ 2 = 5', santali: 'ᱜᱮᱞ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱨ = ᱢᱚᱬᱮ', pronunciation: 'Gel Hatinj Bar = Mone', emoji: '➗', description: '10 shared equally between 2 children = 5 each', nipunTarget: 'Grade 3 Numeracy: Division as equal sharing' },
  { id: 1402, deckId: 'c3_division', grade: 'Class 3', domain: 'Numeracy', hindi: '12 ÷ 3 = 4', santali: '᱑᱒ ᱦᱟᱹᱴᱤᱧ ᱯᱮ = ᱯᱩᱱ', pronunciation: '12 Hatinj Pe = Pun', emoji: '➗', description: '12 mangoes shared among 3 = 4 each', nipunTarget: 'Grade 3 Numeracy: Division as equal sharing' },
  { id: 1403, deckId: 'c3_division', grade: 'Class 3', domain: 'Numeracy', hindi: '20 ÷ 4 = 5', santali: '᱒᱐ ᱦᱟᱹᱴᱤᱧ ᱯᱩᱱ = ᱢᱚᱬᱮ', pronunciation: '20 Hatinj Pun = Mone', emoji: '➗', description: '20 sweets shared among 4 friends = 5 each', nipunTarget: 'Grade 3 Numeracy: Division' },
];

export const DECK_C3_3DIGIT: FlashcardItem[] = [
  { id: 1501, deckId: 'c3_3digit', grade: 'Class 3', domain: 'Numeracy', hindi: 'सैकड़ा = ᱥᱟᱭ', santali: 'ᱥᱟᱭ', pronunciation: 'Saay (Hundred)', emoji: '🧮', description: '100 = 1 hundred = ᱢᱤᱫ ᱥᱟᱭ • 10 bundles of 10', nipunTarget: 'Grade 3 Numeracy: Numbers up to 9999, place value' },
  { id: 1502, deckId: 'c3_3digit', grade: 'Class 3', domain: 'Numeracy', hindi: '234 = 2 सैकड़ा + 3 दहाई + 4 इकाई', santali: '᱒᱓᱔ = ᱒ ᱥᱟᱭ + ᱓ ᱜᱮᱞ + ᱔ ᱢᱤᱫ', pronunciation: '234 = Bar Saay + Pe Gel + Pun Mid', emoji: '🧮', description: '234 broken into hundreds, tens, and ones', nipunTarget: 'Grade 3 Numeracy: 3-digit place value' },
  { id: 1503, deckId: 'c3_3digit', grade: 'Class 3', domain: 'Numeracy', hindi: '450 + 230 = 680', santali: '᱔᱕᱐ + ᱒᱓᱐ = ᱖᱘᱐', pronunciation: '450 + 230 = 680', emoji: '➕', description: 'Ones: 0+0=0, Tens: 5+3=8, Hundreds: 4+2=6. Sum: 680', nipunTarget: 'Grade 3 Numeracy: 3-digit addition' },
  { id: 1504, deckId: 'c3_3digit', grade: 'Class 3', domain: 'Numeracy', hindi: '786 - 342 = 444', santali: '᱗᱘᱖ - ᱓᱔᱒ = ᱔᱔᱔', pronunciation: '786 - 342 = 444', emoji: '➖', description: 'Ones: 6-2=4, Tens: 8-4=4, Hundreds: 7-3=4. Difference: 444', nipunTarget: 'Grade 3 Numeracy: 3-digit subtraction' },
];

export const DECK_C3_READING: FlashcardItem[] = [
  { id: 1601, deckId: 'c3_reading', grade: 'Class 3', domain: 'Literacy', hindi: '60 शब्द/मिनट = NIPUN', santali: '᱖᱐ ᱟᱹᱲᱟᱹ/ᱴᱤᱯᱤᱡ = NIPUN', pronunciation: '60 Ara / Tipij', emoji: '⏱️', description: 'NIPUN Grade 3 target: Read 60 words/min from age-appropriate unknown text with comprehension', nipunTarget: 'Grade 3 NIPUN Lakshya: 60 WPM reading fluency' },
  { id: 1602, deckId: 'c3_reading', grade: 'Class 3', domain: 'Literacy', hindi: 'हापड़ाम काहनी (लोककथा)', santali: 'ᱦᱟᱯᱲᱟᱢ ᱠᱟᱹᱦᱱᱤ', pronunciation: 'Hapram Kahni', emoji: '📖', description: 'Folk Tale • Cultural ancestral narratives for reading comprehension', nipunTarget: 'Grade 3 Literacy: Reading comprehension from literature' },
  { id: 1603, deckId: 'c3_reading', grade: 'Class 3', domain: 'Literacy', hindi: 'मुख्य पात्र / मुख्य घटना', santali: 'ᱢᱩᱬᱩᱛ ᱦᱚᱲ / ᱢᱩᱬᱩᱛ ᱠᱟᱛᱷᱟ', pronunciation: 'Murut Hor / Murut Katha', emoji: '🧑', description: 'Main character / Core event • Key elements of story comprehension', nipunTarget: 'Grade 3 Literacy: Comprehension — character and events' },
  { id: 1604, deckId: 'c3_reading', grade: 'Class 3', domain: 'Literacy', hindi: 'विराम चिह्न . , ? !', santali: 'ᱛᱷᱟᱠᱮᱫ ᱪᱤᱱᱦᱟᱹ . , ? !', pronunciation: 'Thaked Chinha', emoji: '❓', description: 'Punctuation marks • Full stop (ᱢᱩᱪᱟᱹᱫ), comma (ᱛᱷᱟᱠᱮᱫ), question mark', nipunTarget: 'Grade 3 Literacy: Punctuation in Ol Chiki writing' },
];

// ─────────────────────────────────────────────
//  DECK REGISTRY
// ─────────────────────────────────────────────

export interface DeckMeta {
  id: string;
  grade: string;
  domain: 'Literacy' | 'Numeracy';
  label: string;
  emoji: string;
  nipunBadge: string;
  cards: FlashcardItem[];
}

export const ALL_DECKS: DeckMeta[] = [
  // Balvatika
  { id: 'bal_animals', grade: 'Balvatika', domain: 'Literacy', label: 'Animals (ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ)', emoji: '🐾', nipunBadge: 'BOX2 Oral Vocab', cards: DECK_BAL_ANIMALS },
  { id: 'bal_body', grade: 'Balvatika', domain: 'Literacy', label: 'Body Parts (ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ)', emoji: '🧍', nipunBadge: 'BOX1 Communication', cards: DECK_BAL_BODY },
  { id: 'bal_shapes', grade: 'Balvatika', domain: 'Numeracy', label: 'Shapes (ᱜᱩᱞ ᱪᱟᱹᱨᱠᱷᱤ)', emoji: '⭕', nipunBadge: 'Numeracy 2D Shapes', cards: DECK_BAL_SHAPES },
  { id: 'bal_compare', grade: 'Balvatika', domain: 'Numeracy', label: 'Big vs Small (ᱢᱟᱨᱟᱝ/ᱦᱩᱰᱤᱧ)', emoji: '⚖️', nipunBadge: 'Numeracy Comparison', cards: DECK_BAL_COMPARE },
  { id: 'bal_counting', grade: 'Balvatika', domain: 'Numeracy', label: 'Counting 1–5 (ᱢᱤᱫ ᱠᱷᱚᱱ ᱢᱚᱬᱮ)', emoji: '🔢', nipunBadge: 'Numeracy 1–5 Count', cards: DECK_BAL_COUNTING },

  // Class 1
  { id: 'c1_olchiki', grade: 'Class 1', domain: 'Literacy', label: 'Ol Chiki Letters (ᱚᱞ ᱪᱤᱠᱤ ᱟᱠᱷᱚᱨ)', emoji: '✍️', nipunBadge: 'Gr1 Letter Recognition', cards: DECK_C1_OLCHIKI },
  { id: 'c1_classroom', grade: 'Class 1', domain: 'Literacy', label: 'Classroom Words (ᱠᱞᱟᱥ ᱨᱚᱲ)', emoji: '🏫', nipunBadge: 'Gr1 Classroom Dialogues', cards: DECK_C1_CLASSROOMS },
  { id: 'c1_numbers', grade: 'Class 1', domain: 'Numeracy', label: 'Numbers 1–10 (ᱞᱮᱠᱷᱟ ᱑-᱑᱐)', emoji: '🔢', nipunBadge: 'Gr1 Number Reading', cards: DECK_C1_NUMBERS },
  { id: 'c1_addition', grade: 'Class 1', domain: 'Numeracy', label: 'Addition Facts (ᱡᱚᱲᱟᱣ)', emoji: '➕', nipunBadge: 'Gr1 Single-digit Add', cards: DECK_C1_ADDITION },

  // Class 2
  { id: 'c2_place', grade: 'Class 2', domain: 'Numeracy', label: 'Place Value (ᱜᱮᱞ & ᱢᱤᱫ)', emoji: '📊', nipunBadge: 'Gr2 Tens & Ones', cards: DECK_C2_PLACE_VALUE },
  { id: 'c2_addition', grade: 'Class 2', domain: 'Numeracy', label: '2-Digit Math (ᱡᱚᱲᱟᱣ/ᱜᱷᱟᱴᱟᱣ)', emoji: '🔢', nipunBadge: 'Gr2 2-Digit Ops', cards: DECK_C2_ADDITION },
  { id: 'c2_story', grade: 'Class 2', domain: 'Literacy', label: 'Vocabulary & Opposites (ᱩᱞᱴᱟᱹ)', emoji: '📖', nipunBadge: 'Gr2 45 WPM Reading', cards: DECK_C2_STORY },

  // Class 3
  { id: 'c3_tables', grade: 'Class 3', domain: 'Numeracy', label: 'Times Tables ᱒-᱑᱐ (ᱜᱩᱬᱟᱹᱣ)', emoji: '✖️', nipunBadge: 'Gr3 Times Tables', cards: DECK_C3_MULTIPLICATION },
  { id: 'c3_division', grade: 'Class 3', domain: 'Numeracy', label: 'Division & Sharing (ᱦᱟᱹᱴᱤᱧ)', emoji: '➗', nipunBadge: 'Gr3 Equal Sharing', cards: DECK_C3_DIVISION },
  { id: 'c3_3digit', grade: 'Class 3', domain: 'Numeracy', label: '3-Digit Math (ᱥᱟᱭ ᱞᱮᱠᱷᱟ)', emoji: '🧮', nipunBadge: 'Gr3 3-Digit Math', cards: DECK_C3_3DIGIT },
  { id: 'c3_reading', grade: 'Class 3', domain: 'Literacy', label: 'Reading Fluency (60 WPM)', emoji: '📚', nipunBadge: 'Gr3 NIPUN Lakshya', cards: DECK_C3_READING },
];

// Compatibility exports
export const BALVATIKA_ANIMALS = DECK_BAL_ANIMALS;
export const BALVATIKA_FRUITS: FlashcardItem[] = [];
export const BALVATIKA_BODY_PARTS = DECK_BAL_BODY;
export const BALVATIKA_SHAPES = DECK_BAL_SHAPES;
export const BALVATIKA_COMPARISONS = DECK_BAL_COMPARE;
export const COUNTING_DECK = DECK_C1_NUMBERS;
