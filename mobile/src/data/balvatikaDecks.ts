/**
 * Complete NIPUN Bharat Balvatika Vector Asset Datasets
 * Lightweight Vector/Emoji datasets ensuring active memory <350MB and zero disk bloat.
 */

export interface FlashcardItem {
  id: number;
  category: 'animals' | 'fruits' | 'body_parts' | 'shapes' | 'comparisons' | 'counting';
  grade: 'Balvatika' | 'Class 1' | 'Class 2' | 'Class 3';
  hindi: string;
  santali: string;
  pronunciation: string;
  emoji: string;
  description: string;
}

export const BALVATIKA_ANIMALS: FlashcardItem[] = [
  { id: 101, category: 'animals', grade: 'Balvatika', hindi: 'गाय', santali: 'ᱜᱟᱹᱭ', pronunciation: 'Gai', emoji: '🐮', description: 'Cow • Domestic farm animal' },
  { id: 102, category: 'animals', grade: 'Balvatika', hindi: 'बकरी', santali: 'ᱢᱮᱨᱚᱢ', pronunciation: 'Merom', emoji: '🐐', description: 'Goat • Domestic animal' },
  { id: 103, category: 'animals', grade: 'Balvatika', hindi: 'कुत्ता', santali: 'ᱥᱮᱛᱟ', pronunciation: 'Seta', emoji: '🐶', description: 'Dog • Faithful animal' },
  { id: 104, category: 'animals', grade: 'Balvatika', hindi: 'बिल्ली', santali: 'ᱯᱩᱥᱤ', pronunciation: 'Pusi', emoji: '🐱', description: 'Cat • Domestic pet' },
  { id: 105, category: 'animals', grade: 'Balvatika', hindi: 'हाथी', santali: 'ᱦᱟᱹᱛᱤ', pronunciation: 'Hati', emoji: '🐘', description: 'Elephant • Big animal' },
  { id: 106, category: 'animals', grade: 'Balvatika', hindi: 'बाघ', santali: 'ᱛᱟᱹᱨᱩᱵ', pronunciation: 'Tarub', emoji: '🐯', description: 'Tiger • Wild striped cat' },
  { id: 107, category: 'animals', grade: 'Balvatika', hindi: 'शेर', santali: 'ᱠᱩᱞ', pronunciation: 'Kul', emoji: '🦁', description: 'Lion • King of forest' },
  { id: 108, category: 'animals', grade: 'Balvatika', hindi: 'भालू', santali: 'ᱵᱟᱱᱟ', pronunciation: 'Bana', emoji: '🐻', description: 'Bear • Forest animal' },
  { id: 109, category: 'animals', grade: 'Balvatika', hindi: 'बंदर', santali: 'ᱜᱟᱹᱰᱤ', pronunciation: 'Gadi', emoji: '🐵', description: 'Monkey • Tree climber' },
  { id: 110, category: 'animals', grade: 'Balvatika', hindi: 'घोड़ा', santali: 'ᱥᱟᱫᱚᱢ', pronunciation: 'Sadom', emoji: '🐴', description: 'Horse • Fast runner' },
  { id: 111, category: 'animals', grade: 'Balvatika', hindi: 'भैंस', santali: 'ᱠᱟᱰᱟ', pronunciation: 'Kada', emoji: '🐃', description: 'Buffalo • Farm animal' },
  { id: 112, category: 'animals', grade: 'Balvatika', hindi: 'भेड़', santali: 'ᱵᱷᱤᱰᱤ', pronunciation: 'Bhidi', emoji: '🐑', description: 'Sheep • Wool producer' },
  { id: 113, category: 'animals', grade: 'Balvatika', hindi: 'सूअर', santali: 'ᱥᱩᱠᱨᱤ', pronunciation: 'Sukri', emoji: '🐷', description: 'Pig • Farm animal' },
  { id: 114, category: 'animals', grade: 'Balvatika', hindi: 'मुर्गी', santali: 'ᱥᱤᱢ', pronunciation: 'Sim', emoji: '🐔', description: 'Hen • Farm bird' },
  { id: 115, category: 'animals', grade: 'Balvatika', hindi: 'बतख', santali: 'ᱜᱮᱰᱮ', pronunciation: 'Gede', emoji: '🦆', description: 'Duck • Water bird' },
  { id: 116, category: 'animals', grade: 'Balvatika', hindi: 'हिरण', santali: 'ᱡᱷᱤᱸᱠ', pronunciation: 'Jhink', emoji: '🦌', description: 'Deer • Forest runner' },
  { id: 117, category: 'animals', grade: 'Balvatika', hindi: 'लोमड़ी', santali: 'ᱛᱩᱭᱩ', pronunciation: 'Tuyu', emoji: '🦊', description: 'Fox • Clever animal' },
  { id: 118, category: 'animals', grade: 'Balvatika', hindi: 'खरगोश', santali: 'ᱠᱩᱞᱟᱹᱭ', pronunciation: 'Kulai', emoji: '🐰', description: 'Rabbit • Soft jumper' },
  { id: 119, category: 'animals', grade: 'Balvatika', hindi: 'गिलहरी', santali: 'ᱜᱩᱰᱩ', pronunciation: 'Gudu', emoji: '🐿️', description: 'Squirrel • Nut gatherer' },
  { id: 120, category: 'animals', grade: 'Balvatika', hindi: 'चूहा', santali: 'ᱪᱩᱴᱤᱭᱟᱹ', pronunciation: 'Chutiya', emoji: '🐭', description: 'Mouse • Small rodent' },
  { id: 121, category: 'animals', grade: 'Balvatika', hindi: 'मोर', santali: 'ᱢᱟᱨᱟᱜ', pronunciation: 'Marag', emoji: '🦚', description: 'Peacock • National bird' },
  { id: 122, category: 'animals', grade: 'Balvatika', hindi: 'चिड़िया', santali: 'ᱪᱮᱬᱮ', pronunciation: 'Cere', emoji: '🐦', description: 'Bird • Small flyer' },
  { id: 123, category: 'animals', grade: 'Balvatika', hindi: 'कौआ', santali: 'ᱠᱟᱹᱦᱩ', pronunciation: 'Kahu', emoji: '🐦‍⬛', description: 'Crow • Black bird' },
  { id: 124, category: 'animals', grade: 'Balvatika', hindi: 'कबूतर', santali: 'ᱯᱚᱛᱟᱢ', pronunciation: 'Potam', emoji: '🕊️', description: 'Pigeon • Peaceful bird' },
  { id: 125, category: 'animals', grade: 'Balvatika', hindi: 'सांप', santali: 'ᱵᱤᱧ', pronunciation: 'Bing', emoji: '🐍', description: 'Snake • Crawler' },
  { id: 126, category: 'animals', grade: 'Balvatika', hindi: 'मेंढक', santali: 'ᱨᱚᱴᱮ', pronunciation: 'Rote', emoji: '🐸', description: 'Frog • Pond hopper' },
  { id: 127, category: 'animals', grade: 'Balvatika', hindi: 'मछली', santali: 'ᱦᱟᱹᱠᱩ', pronunciation: 'Haku', emoji: '🐟', description: 'Fish • Swimmer' },
  { id: 128, category: 'animals', grade: 'Balvatika', hindi: 'कछुआ', santali: 'ᱦᱚᱨᱚ', pronunciation: 'Horo', emoji: '🐢', description: 'Turtle • Slow walker' },
  { id: 129, category: 'animals', grade: 'Balvatika', hindi: 'तितली', santali: 'ᱯᱤᱯᱤᱲᱤᱭᱟᱹ', pronunciation: 'Pipiriya', emoji: '🦋', description: 'Butterfly • Colorful flyer' },
  { id: 130, category: 'animals', grade: 'Balvatika', hindi: 'मधुमक्खी', santali: 'ᱧᱮᱸᱞᱮ', pronunciation: 'Nele', emoji: '🐝', description: 'Bee • Honey maker' },
];

export const BALVATIKA_FRUITS: FlashcardItem[] = [
  { id: 201, category: 'fruits', grade: 'Balvatika', hindi: 'आम', santali: 'ᱟᱢ', pronunciation: 'Am', emoji: '🥭', description: 'Mango • King of fruits' },
  { id: 202, category: 'fruits', grade: 'Balvatika', hindi: 'केला', santali: 'ᱠᱟᱭᱨᱟ', pronunciation: 'Kaira', emoji: '🍌', description: 'Banana • Sweet fruit' },
  { id: 203, category: 'fruits', grade: 'Balvatika', hindi: 'सेब', santali: 'ᱥᱮᱣ', pronunciation: 'Sew', emoji: '🍎', description: 'Apple • Red fruit' },
  { id: 204, category: 'fruits', grade: 'Balvatika', hindi: 'कटहल', santali: 'ᱠᱟᱸᱴᱷᱟᱲ', pronunciation: 'Kanthar', emoji: '🍈', description: 'Jackfruit • Big fruit' },
  { id: 205, category: 'fruits', grade: 'Balvatika', hindi: 'तरबूज', santali: 'ᱛᱟᱨᱵᱩᱡᱽ', pronunciation: 'Tarbuj', emoji: '🍉', description: 'Watermelon • Summer fruit' },
  { id: 206, category: 'fruits', grade: 'Balvatika', hindi: 'अमरूद', santali: 'ᱥᱚᱯᱨᱤ', pronunciation: 'Sopri', emoji: '🍐', description: 'Guava • Green fruit' },
  { id: 207, category: 'fruits', grade: 'Balvatika', hindi: 'पपीता', santali: 'ᱯᱟᱯᱟᱭᱛᱟ', pronunciation: 'Papayta', emoji: '🍈', description: 'Papaya • Yellow fruit' },
  { id: 208, category: 'fruits', grade: 'Balvatika', hindi: 'संतरा', santali: 'ᱠᱚᱢᱞᱟ', pronunciation: 'Komla', emoji: '🍊', description: 'Orange • Citrus fruit' },
  { id: 209, category: 'fruits', grade: 'Balvatika', hindi: 'अंगूर', santali: 'ᱟᱝᱜᱩᱨ', pronunciation: 'Angur', emoji: '🍇', description: 'Grapes • Juicy fruit' },
  { id: 210, category: 'fruits', grade: 'Balvatika', hindi: 'अनन्नास', santali: 'ᱟᱱᱟᱨᱚᱥ', pronunciation: 'Anaros', emoji: '🍍', description: 'Pineapple • Tropical fruit' },
  { id: 211, category: 'fruits', grade: 'Balvatika', hindi: 'नींबू', santali: 'ᱞᱤᱢᱵᱩ', pronunciation: 'Limbu', emoji: '🍋', description: 'Lemon • Sour fruit' },
  { id: 212, category: 'fruits', grade: 'Balvatika', hindi: 'अनार', santali: 'ᱟᱱᱟᱨ', pronunciation: 'Anar', emoji: '🍎', description: 'Pomegranate • Seed fruit' },
  { id: 213, category: 'fruits', grade: 'Balvatika', hindi: 'नारियल', santali: 'ᱱᱟᱹᱨᱠᱚᱲ', pronunciation: 'Narkol', emoji: '🥥', description: 'Coconut • Palm fruit' },
  { id: 214, category: 'fruits', grade: 'Balvatika', hindi: 'जामुन', santali: 'ᱠᱩᱫᱽ', pronunciation: 'Kud', emoji: '🫐', description: 'Blackberry • Forest fruit' },
  { id: 215, category: 'fruits', grade: 'Balvatika', hindi: 'शरीफा', santali: 'ᱥᱟᱨᱤᱯᱷᱟ', pronunciation: 'Saripha', emoji: '🍈', description: 'Custard Apple' },
  { id: 216, category: 'fruits', grade: 'Balvatika', hindi: 'खजूर', santali: 'ᱠᱷᱟᱹᱡᱩᱨ', pronunciation: 'Khajur', emoji: '🌴', description: 'Dates • Sweet fruit' },
  { id: 217, category: 'fruits', grade: 'Balvatika', hindi: 'लीची', santali: 'ᱞᱤᱪᱩ', pronunciation: 'Lichu', emoji: '🍓', description: 'Lychee • Sweet fruit' },
  { id: 218, category: 'fruits', grade: 'Balvatika', hindi: 'अंजीर', santali: 'ᱟᱱᱡᱤᱨ', pronunciation: 'Anjir', emoji: '🫒', description: 'Fig fruit' },
  { id: 219, category: 'fruits', grade: 'Balvatika', hindi: 'नाशपाती', santali: 'ᱱᱟᱥᱯᱟᱛᱤ', pronunciation: 'Naspati', emoji: '🍐', description: 'Pear fruit' },
  { id: 220, category: 'fruits', grade: 'Balvatika', hindi: 'आड़ू', santali: 'ᱟᱰᱩ', pronunciation: 'Adu', emoji: '🍑', description: 'Peach fruit' },
];

export const BALVATIKA_BODY_PARTS: FlashcardItem[] = [
  { id: 301, category: 'body_parts', grade: 'Balvatika', hindi: 'सिर', santali: 'ᱵᱚᱦᱚᱜ', pronunciation: 'Bohog', emoji: '👤', description: 'Head' },
  { id: 302, category: 'body_parts', grade: 'Balvatika', hindi: 'आंख', santali: 'ᱢᱮᱫ', pronunciation: 'Med', emoji: '👁️', description: 'Eye • Sight' },
  { id: 303, category: 'body_parts', grade: 'Balvatika', hindi: 'कान', santali: 'ᱞᱩᱛᱩᱨ', pronunciation: 'Lutur', emoji: '👂', description: 'Ear • Hearing' },
  { id: 304, category: 'body_parts', grade: 'Balvatika', hindi: 'नाक', santali: 'ᱢᱩᱸ', pronunciation: 'Mu', emoji: '👃', description: 'Nose • Smell' },
  { id: 305, category: 'body_parts', grade: 'Balvatika', hindi: 'हाथ', santali: 'ᱛᱤ', pronunciation: 'Ti', emoji: '✋', description: 'Hand • Grasping' },
  { id: 306, category: 'body_parts', grade: 'Balvatika', hindi: 'पैर', santali: 'ᱡᱟᱝᱜᱟ', pronunciation: 'Janga', emoji: '🦶', description: 'Foot • Walking' },
  { id: 307, category: 'body_parts', grade: 'Balvatika', hindi: 'मुंह', santali: 'ᱢᱚᱪᱟ', pronunciation: 'Mocha', emoji: '👄', description: 'Mouth • Eating' },
  { id: 308, category: 'body_parts', grade: 'Balvatika', hindi: 'दांत', santali: 'ᱰᱟᱴᱟ', pronunciation: 'Data', emoji: '🦷', description: 'Teeth • Chewing' },
  { id: 309, category: 'body_parts', grade: 'Balvatika', hindi: 'जीभ', santali: 'ᱟᱞᱟᱝ', pronunciation: 'Alang', emoji: '👅', description: 'Tongue • Taste' },
  { id: 310, category: 'body_parts', grade: 'Balvatika', hindi: 'बाल', santali: 'ᱩᱵᱽ', pronunciation: 'Ub', emoji: '💇', description: 'Hair' },
  { id: 311, category: 'body_parts', grade: 'Balvatika', hindi: 'उंगली', santali: 'ᱠᱟᱹᱴᱩᱵ', pronunciation: 'Katub', emoji: '👉', description: 'Finger' },
  { id: 312, category: 'body_parts', grade: 'Balvatika', hindi: 'गर्दन', santali: 'ᱦᱚᱛᱚᱜ', pronunciation: 'Hotog', emoji: '🧣', description: 'Neck' },
  { id: 313, category: 'body_parts', grade: 'Balvatika', hindi: 'पेट', santali: 'ᱞᱟᱡ', pronunciation: 'Laj', emoji: '🤰', description: 'Stomach' },
  { id: 314, category: 'body_parts', grade: 'Balvatika', hindi: 'पीठ', santali: 'ᱫᱮᱭᱟ', pronunciation: 'Deya', emoji: '🧍', description: 'Back' },
  { id: 315, category: 'body_parts', grade: 'Balvatika', hindi: 'हृदय / दिल', santali: 'ᱠᱚᱞᱮᱡᱟ', pronunciation: 'Koleja', emoji: '❤️', description: 'Heart' },
];

export const BALVATIKA_SHAPES: FlashcardItem[] = [
  { id: 401, category: 'shapes', grade: 'Balvatika', hindi: 'गोला / वृत्त', santali: 'ᱜᱩᱞ', pronunciation: 'Gul', emoji: '⭕', description: 'Circle shape' },
  { id: 402, category: 'shapes', grade: 'Balvatika', hindi: 'चौकोर / वर्ग', santali: 'ᱪᱟᱹᱨᱠᱷᱤ', pronunciation: 'Charkhi', emoji: '⏹️', description: 'Square shape' },
  { id: 403, category: 'shapes', grade: 'Balvatika', hindi: 'तिकोना / त्रिभुज', santali: 'ᱯᱮ ᱠᱳᱬ', pronunciation: 'Pe Kon', emoji: '🔺', description: 'Triangle shape' },
  { id: 404, category: 'shapes', grade: 'Balvatika', hindi: 'आयताकार', santali: 'ᱟᱭᱚᱛ', pronunciation: 'Ayot', emoji: '🟦', description: 'Rectangle shape' },
  { id: 405, category: 'shapes', grade: 'Balvatika', hindi: 'तारा', santali: 'ᱤᱯᱤᱞ', pronunciation: 'Ipil', emoji: '⭐', description: 'Star shape' },
];

export const BALVATIKA_COMPARISONS: FlashcardItem[] = [
  { id: 501, category: 'comparisons', grade: 'Balvatika', hindi: 'बड़ा / छोटा', santali: 'ᱢᱟᱨᱟᱝ / ᱦᱩᱰᱤᱧ', pronunciation: 'Marang / Hudinj', emoji: '🐘 🐭', description: 'Big (Elephant) vs Small (Mouse)' },
  { id: 502, category: 'comparisons', grade: 'Balvatika', hindi: 'लंबा / नाटा', santali: 'ᱩᱥᱩᱞ / ᱪᱟᱯᱮ', pronunciation: 'Usul / Chape', emoji: '🦒 🐢', description: 'Tall (Giraffe) vs Short (Turtle)' },
  { id: 503, category: 'comparisons', grade: 'Balvatika', hindi: 'भारी / हल्का', santali: 'ᱦᱟᱢᱟᱞ / ᱨᱟᱣᱟᱞ', pronunciation: 'Hamal / Rawal', emoji: '🪨 🪶', description: 'Heavy (Rock) vs Light (Feather)' },
  { id: 504, category: 'comparisons', grade: 'Balvatika', hindi: 'ज्यादा / कम', santali: 'ᱰᱷᱮᱨ / ᱠᱚᱢ', pronunciation: 'Dher / Kom', emoji: '🍎🍎🍎 🍎', description: 'More (Many apples) vs Less (One)' },
  { id: 505, category: 'comparisons', grade: 'Balvatika', hindi: 'गर्म / ठंडा', santali: 'ᱞᱚᱞᱚ / ᱨᱮᱭᱟᱲ', pronunciation: 'Lolo / Reyar', emoji: '🔥 ❄️', description: 'Hot (Fire) vs Cold (Ice)' },
];

export const COUNTING_DECK: FlashcardItem[] = [
  { id: 1, category: 'counting', grade: 'Class 1', hindi: 'एक (1)', santali: 'ᱢᱤᱫ', pronunciation: 'Mid', emoji: '🍎', description: '1 Apple • ᱢᱤᱫ ᱥᱮᱣ' },
  { id: 2, category: 'counting', grade: 'Class 1', hindi: 'दो (2)', santali: 'ᱵᱟᱨ', pronunciation: 'Bar', emoji: '🍎🍎', description: '2 Apples • ᱵᱟᱨ ᱥᱮᱣ' },
  { id: 3, category: 'counting', grade: 'Class 1', hindi: 'तीन (3)', santali: 'ᱯᱮ', pronunciation: 'Pe', emoji: '🍎🍎🍎', description: '3 Apples • ᱯᱮ ᱥᱮᱣ' },
  { id: 4, category: 'counting', grade: 'Class 1', hindi: 'चार (4)', santali: 'ᱯᱩᱱ', pronunciation: 'Pun', emoji: '🍎🍎🍎🍎', description: '4 Apples • ᱯᱩᱱ ᱥᱮᱣ' },
  { id: 5, category: 'counting', grade: 'Class 1', hindi: 'पाँच (5)', santali: 'ᱢᱚᱬᱮ', pronunciation: 'Mone', emoji: '🍎🍎🍎🍎🍎', description: '5 Apples • ᱢᱚᱬᱮ ᱥᱮᱣ' },
  { id: 6, category: 'counting', grade: 'Class 1', hindi: 'छह (6)', santali: 'ᱛᱩᱨᱩᱭ', pronunciation: 'Turui', emoji: '⭐⭐⭐⭐⭐⭐', description: '6 Stars • ᱛᱩᱨᱩᱭ ᱤᱯᱤᱞ' },
  { id: 7, category: 'counting', grade: 'Class 1', hindi: 'सात (7)', santali: 'ᱮᱨᱟᱭ', pronunciation: 'Eray', emoji: '⭐⭐⭐⭐⭐⭐⭐', description: '7 Stars • ᱮᱨᱟᱭ ᱤᱯᱤᱞ' },
  { id: 8, category: 'counting', grade: 'Class 1', hindi: 'आठ (8)', santali: 'ᱤᱨᱟᱹᱞ', pronunciation: 'Iral', emoji: '⭐⭐⭐⭐⭐⭐⭐⭐', description: '8 Stars • ᱤᱨᱟᱹᱞ ᱤᱯᱤᱞ' },
  { id: 9, category: 'counting', grade: 'Class 1', hindi: 'नौ (9)', santali: 'ᱟᱨᱮ', pronunciation: 'Are', emoji: '⭐⭐⭐⭐⭐⭐⭐⭐⭐', description: '9 Stars • ᱟᱨᱮ ᱤᱯᱤᱞ' },
  { id: 10, category: 'counting', grade: 'Class 1', hindi: 'दस (10)', santali: 'ᱜᱮᱞ', pronunciation: 'Gel', emoji: '🔟 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟', description: '10 Stars • ᱜᱮᱞ ᱤᱯᱤᱞ' },
];
