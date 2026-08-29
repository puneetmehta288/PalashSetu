/**
 * Extracts 100% of Santali (Ol Chiki) vocabulary tokens from AI4Bharat IndicTrans2 dict.TGT.json
 * Generates mobile/src/data/santali_model_vocabulary.ts
 */
const fs = require('fs');

const tgtDict = JSON.parse(fs.readFileSync('models/indictrans2-indic-indic-dist-320M/dict.TGT.json', 'utf8'));

// Ol Chiki to phonetic Devanagari mapping
const olToDev = {
  'ᱚ': 'अ', 'ᱛ': 'त', 'ᱜ': 'ग', 'ᱝ': 'ङ', 'ᱞ': 'ल',
  'ᱟ': 'आ', 'ᱠ': 'क', 'ᱡ': 'ज', 'ᱢ': 'म', 'ᱣ': 'व',
  'ᱤ': 'इ', 'ᱥ': 'स', 'ᱦ': 'ह', 'ᱧ': 'ञ', 'ᱨ': 'र',
  'ᱩ': 'उ', 'ᱪ': 'च', 'ᱫ': 'द', 'ᱬ': 'ण', 'ᱭ': 'य',
  'ᱮ': 'ए', 'ᱯ': 'प', 'ᱰ': 'ड', 'ᱱ': 'न', 'ᱲ': 'ड़',
  'ᱳ': 'ओ', 'ᱴ': 'ट', 'ᱵ': 'ब', 'ᱶ': 'व्', 'ᱷ': 'ह',
  'ᱸ': 'ं', 'ᱹ': '', 'ᱺ': 'ः', 'ᱻ': '', 'ᱼ': '-',
  'ᱽ': '्', '᱾': '।', '᱿': '॥',
  '᱐': '०', '᱑': '१', '᱒': '२', '᱓': '३', '᱔': '४',
  '᱕': '५', '᱖': '६', '᱗': '७', '᱘': '८', '᱙': '९'
};

function olChikiToDev(text) {
  let dev = '';
  for (const char of text) {
    dev += olToDev[char] || char;
  }
  return dev;
}

const olTokens = Object.keys(tgtDict).filter(k => /[\u1C50-\u1C7F]/.test(k));

console.log('Processing all', olTokens.length, 'Santali tokens from IndicTrans2 model...');

const list = [];
olTokens.forEach(t => {
  const clean = t.replace(/^[▁\s_]+/, '').trim();
  if (clean) {
    list.push({
      token: clean,
      raw: t,
      phonetic: olChikiToDev(clean),
      id: tgtDict[t]
    });
  }
});

let out = `/**
 * Complete 100% Santali (Ol Chiki) Vocabulary from AI4Bharat IndicTrans2 Model
 * ============================================================================
 * Model Source: ai4bharat/indictrans2-indic-indic-dist-320M
 * File: dict.TGT.json
 * Total Santali Tokens: ${list.length} (100% of model's Santali vocabulary)
 */

export interface ModelSantaliToken {
  token: string;
  phonetic: string;
  id: number;
}

export const INDIC_TRANS_MODEL_SANTALI_COUNT = ${list.length};

export const INDIC_TRANS_MODEL_SANTALI_TOKENS: ModelSantaliToken[] = [
`;

list.forEach(item => {
  const escapedToken = item.token.replace(/'/g, "\\'");
  const escapedPhonetic = item.phonetic.replace(/'/g, "\\'");
  out += `  { token: '${escapedToken}', phonetic: '${escapedPhonetic}', id: ${item.id} },\n`;
});

out += `];\n\n`;

out += `// Fast O(1) Set of all 100% Santali tokens recognized by the AI4Bharat model\n`;
out += `export const MODEL_SANTALI_WORDS_SET = new Set<string>(\n`;
out += `  INDIC_TRANS_MODEL_SANTALI_TOKENS.map((item) => item.token)\n`;
out += `);\n`;

fs.writeFileSync('mobile/src/data/santali_model_vocabulary.ts', out, 'utf8');
console.log('Successfully wrote 100% of Santali tokens (' + list.length + ') to mobile/src/data/santali_model_vocabulary.ts');
