/**
 * PalashSetu Ho (ᱦᱳ / हो भाषा) Offline Edge Dictionary
 * =======================================================
 * Tribal Region: Kolhan Division (West Singhbhum, East Singhbhum, Seraikela Kharsawan)
 * Script: Devanagari (हो) & Warang Citi (𑢹𑣉) / Phonetic Latin
 * Language Family: Austroasiatic (Munda branch)
 * Used for 100% offline classroom pedagogy & live translation
 */

export const HO_METADATA = {
  name: 'Ho',
  nativeName: 'ᱦᱳ / हो भाषा',
  script: 'Devanagari & Warang Citi (𑢹𑣉)',
  region: 'Kolhan Division (Chaibasa, Jamshedpur, Seraikela)',
  districts: ['West Singhbhum', 'East Singhbhum', 'Seraikela Kharsawan'],
  greeting: 'जोहार (Johar)',
  code: 'hoc_Deva'
};

// 1. Core Vocabulary (Hindi -> Ho)
export const HINDI_TO_HO_VOCAB: Record<string, { ho: string; phonetic: string; warang?: string }> = {
  // Greetings & Social
  'नमस्ते': { ho: 'जोहार', phonetic: 'Johar', warang: '𑢮𑣉𑣎𑣉' },
  'जोहार': { ho: 'जोहार', phonetic: 'Johar', warang: '𑢮𑣉𑣎𑣉' },
  'धन्यवाद': { ho: 'जोहार / सारहाव', phonetic: 'Sarhao' },
  'स्वागत': { ho: 'सागुन दाराम', phonetic: 'Sagun daram' },
  'अच्छा': { ho: 'बेस / एनांग', phonetic: 'Bes / Enang' },
  'बहुत अच्छा': { ho: 'एनांग बेस', phonetic: 'Enang bes' },
  'शाबाश': { ho: 'साबास', phonetic: 'Sabas' },
  'हाँ': { ho: 'हे', phonetic: 'He' },
  'नहीं': { ho: 'का / बांग', phonetic: 'Ka / Bang' },
  'ठीक है': { ho: 'ठीक मेनाः', phonetic: 'Thik mena' },

  // Classroom & Roles
  'शिक्षक': { ho: 'माचेत', phonetic: 'Machet' },
  'शिक्षिका': { ho: 'माचेताई', phonetic: 'Machetai' },
  'गुरुजी': { ho: 'गुरुजी / माचेत', phonetic: 'Guruji' },
  'बच्चे': { ho: 'होनको', phonetic: 'Honko', warang: '𑢹𑣉𑣒𑣌𑣉' },
  'बच्चों': { ho: 'होनको', phonetic: 'Honko', warang: '𑢹𑣉𑣒𑣌𑣉' },
  'बच्चा': { ho: 'होन', phonetic: 'Hon' },
  'लड़का': { ho: 'कोड़ा', phonetic: 'Koda' },
  'लड़की': { ho: 'कुड़ी', phonetic: 'Kudi' },
  'छात्र': { ho: 'इतुसांग / पाढ़ुवा', phonetic: 'Itusang' },
  'स्कूल': { ho: 'इसकुल / आसड़ा', phonetic: 'Iskul' },
  'कक्षा': { ho: 'क्लास', phonetic: 'Class' },
  'किताब': { ho: 'पोथी', phonetic: 'Pothi', warang: '𑢾𑣉𑢶𑣂' },
  'पुस्तिका': { ho: 'पोथी', phonetic: 'Pothi' },
  'कलम': { ho: 'कलम / ओएलनी', phonetic: 'Kalam' },
  'पेंसिल': { ho: 'पेंसिल', phonetic: 'Pencil' },
  'कॉपी': { ho: 'खाता / पोथी', phonetic: 'Khata' },
  'ब्लैकबोर्ड': { ho: 'ब्लैकबोर्ड / हेंदे पाटा', phonetic: 'Blackboard' },
  'चित्र': { ho: 'चितार', phonetic: 'Chitar' },

  // Numbers 1-20 (Counting & FLN Numeracy in Ho)
  'एक': { ho: 'मियद', phonetic: 'Miyad', warang: '𑣡' },
  'दो': { ho: 'बारिया', phonetic: 'Baria', warang: '𑣢' },
  'तीन': { ho: 'अपिया', phonetic: 'Apia', warang: '𑣣' },
  'चार': { ho: 'उपुनिया', phonetic: 'Upunia', warang: '𑣤' },
  'पाँच': { ho: 'मोया', phonetic: 'Moya', warang: '𑣥' },
  'पांच': { ho: 'मोया', phonetic: 'Moya', warang: '𑣥' },
  'छह': { ho: 'तुरुइया', phonetic: 'Turuiya', warang: '𑣦' },
  'सात': { ho: 'आया', phonetic: 'Aaya', warang: '𑣧' },
  'आठ': { ho: 'इरीलिया', phonetic: 'Iriliya', warang: '𑣨' },
  'नौ': { ho: 'आरेया', phonetic: 'Aareya', warang: '𑣩' },
  'दस': { ho: 'गेलेया', phonetic: 'Geleya', warang: '𑣠𑣡' },
  '1': { ho: 'मियद (1)', phonetic: 'Miyad' },
  '2': { ho: 'बारिया (2)', phonetic: 'Baria' },
  '3': { ho: 'अपिया (3)', phonetic: 'Apia' },
  '4': { ho: 'उपुनिया (4)', phonetic: 'Upunia' },
  '5': { ho: 'मोया (5)', phonetic: 'Moya' },
  '6': { ho: 'तुरुइया (6)', phonetic: 'Turuiya' },
  '7': { ho: 'आया (7)', phonetic: 'Aaya' },
  '8': { ho: 'इरीलिया (8)', phonetic: 'Iriliya' },
  '9': { ho: 'आरेया (9)', phonetic: 'Aareya' },
  '10': { ho: 'गेलेया (10)', phonetic: 'Geleya' },
  'गिनती': { ho: 'लेका', phonetic: 'Leka' },
  'गिनो': { ho: 'लेकायमे', phonetic: 'Lekayme' },
  'संख्या': { ho: 'लेका / नंबर', phonetic: 'Leka' },
  'गणित': { ho: 'हिसाब / लेका', phonetic: 'Hisab' },
  'जोड़': { ho: 'जोड़ाव / मिशा', phonetic: 'Jodao' },
  'जोड़ो': { ho: 'जोड़ावमे', phonetic: 'Jodaome' },
  'घटाव': { ho: 'घटाव / ओड़ोः', phonetic: 'Ghatao' },
  'घटाओ': { ho: 'घटावमे', phonetic: 'Ghataome' },
  'बराबर': { ho: 'बारबर / सोमान', phonetic: 'Barbar' },

  // Animals (जंतु / जीव)
  'गाय': { ho: 'गय', phonetic: 'Gai' },
  'बकरी': { ho: 'मेरम', phonetic: 'Meram' },
  'कुत्ता': { ho: 'सेता', phonetic: 'Seta' },
  'बिल्ली': { ho: 'पुसी', phonetic: 'Pusi' },
  'हाथी': { ho: 'हाती', phonetic: 'Hati' },
  'बाघ': { ho: 'कुला', phonetic: 'Kula' },
  'शेर': { ho: 'कुला / सिंह', phonetic: 'Kula' },
  'भालू': { ho: 'बाना', phonetic: 'Bana' },
  'बंदर': { ho: 'साड़ा', phonetic: 'Sada' },
  'घोड़ा': { ho: 'सादाम', phonetic: 'Sadam' },
  'भैंस': { ho: 'काड़ा', phonetic: 'Kada' },
  'भेड़': { ho: 'मिंदी', phonetic: 'Mindi' },
  'सूअर': { ho: 'सुकुरी', phonetic: 'Sukuri' },
  'मुर्गी': { ho: 'सिम', phonetic: 'Sim' },
  'बतख': { ho: 'गेड़े', phonetic: 'Gede' },
  'मछली': { ho: 'हाकु', phonetic: 'Haku' },
  'सांप': { ho: 'बिंग', phonetic: 'Bing' },
  'मेंढक': { ho: 'चोक़े', phonetic: 'Choke' },
  'चिड़िया': { ho: 'चेड़े', phonetic: 'Chede' },
  'कौआ': { ho: 'कावा', phonetic: 'Kawa' },
  'मोर': { ho: 'माराः', phonetic: 'Mara' },

  // Fruits, Vegetables & Food
  'आम': { ho: 'उली', phonetic: 'Uli' },
  'केला': { ho: 'कदली', phonetic: 'Kadali' },
  'सेब': { ho: 'सेब', phonetic: 'Seb' },
  'अमरूद': { ho: 'सपरी', phonetic: 'Sapri' },
  'पपीता': { ho: 'पपीता', phonetic: 'Papita' },
  'कटहल': { ho: 'कंटाड़ा', phonetic: 'Kantada' },
  'पानी': { ho: 'दाः', phonetic: 'Da' },
  'खाना': { ho: 'मांडी / जोमाः', phonetic: 'Mandi' },
  'चावल': { ho: 'चाउली', phonetic: 'Chauli' },
  'भात': { ho: 'मांडी', phonetic: 'Mandi' },
  'दूध': { ho: 'तोवा', phonetic: 'Towa' },
  'रोटी': { ho: 'रोटी / लाड़', phonetic: 'Roti' },
  'फल': { ho: 'जो', phonetic: 'Jo' },
  'फूल': { ho: 'बाहा', phonetic: 'Baha' },
  'पेड़': { ho: 'दारे', phonetic: 'Dare' },
  'पत्ता': { ho: 'साकाम', phonetic: 'Sakam' },

  // Body Parts
  'सिर': { ho: 'बोहोः', phonetic: 'Boho' },
  'आंख': { ho: 'मेद', phonetic: 'Med' },
  'आँख': { ho: 'मेद', phonetic: 'Med' },
  'कान': { ho: 'लुतुर', phonetic: 'Lutur' },
  'नाक': { ho: 'मुँअ', phonetic: 'Muan' },
  'हाथ': { ho: 'तीः', phonetic: 'Ti' },
  'पैर': { ho: 'कट्टा', phonetic: 'Katta' },
  'मुंह': { ho: 'मोचा', phonetic: 'Mocha' },
  'दांत': { ho: 'डाटा', phonetic: 'Data' },
  'पेट': { ho: 'लाज', phonetic: 'Laj' },

  // Colors
  'लाल': { ho: 'अराः', phonetic: 'Ara' },
  'हरा': { ho: 'हरियार', phonetic: 'Hariyar' },
  'पीला': { ho: 'सासांग', phonetic: 'Sasang' },
  'नीला': { ho: 'लिल', phonetic: 'Lil' },
  'सफेद': { ho: 'पोंड', phonetic: 'Pond' },
  'काला': { ho: 'हेंदे', phonetic: 'Hende' },

  // Common Classroom Verbs & Directives
  'खोलो': { ho: 'झिज्मे', phonetic: 'Jhijme' },
  'खोलिए': { ho: 'झिज्पे', phonetic: 'Jhijpe' },
  'बंद करो': { ho: 'कुलुपमे', phonetic: 'Kulupme' },
  'बैठो': { ho: 'दुबमे', phonetic: 'Dubme' },
  'बैठ जाओ': { ho: 'दुबमे', phonetic: 'Dubme' },
  'खड़े हो जाओ': { ho: 'तिंगुन्मे', phonetic: 'Tinguinme' },
  'खड़े रहो': { ho: 'तिंगुन्मे', phonetic: 'Tinguinme' },
  'पढ़ो': { ho: 'पाड़ावमे', phonetic: 'Padaome' },
  'लिखो': { ho: 'ओएलमे', phonetic: 'Oelme' },
  'सुनो': { ho: 'अयूममे', phonetic: 'Ayumme' },
  'देखो': { ho: 'नेलमे', phonetic: 'Nelme' },
  'दिखाओ': { ho: 'उदुबमे', phonetic: 'Udubme' },
  'बताओ': { ho: 'काजीमे', phonetic: 'Kajime' },
  'आओ': { ho: 'हिजुःमे', phonetic: 'Hijume' },
  'जाओ': { ho: 'सेनोःमे', phonetic: 'Senome' },
  'बोलो': { ho: 'काजीमे', phonetic: 'Kajime' },
  'चुप रहो': { ho: 'थिरमे', phonetic: 'Thirme' },
  'ताली बजाओ': { ho: 'सापड़ांगमे', phonetic: 'Sapadangme' },
  'हंसो': { ho: 'लांदामे', phonetic: 'Landame' },

  // Pronouns & Question Words
  'मैं': { ho: 'आइंग', phonetic: 'Aing' },
  'तुम': { ho: 'आम', phonetic: 'Aam' },
  'आप': { ho: 'अबेन', phonetic: 'Aben' },
  'हम': { ho: 'आबू', phonetic: 'Aabu' },
  'यह': { ho: 'नेया', phonetic: 'Neya' },
  'वह': { ho: 'तेया', phonetic: 'Teya' },
  'ये': { ho: 'नेको', phonetic: 'Neko' },
  'वे': { ho: 'एनको', phonetic: 'Enko' },
  'क्या': { ho: 'चीनाः', phonetic: 'China' },
  'कहाँ': { ho: 'ओकोरे', phonetic: 'Okore' },
  'कौन': { ho: 'ओकोय', phonetic: 'Okoy' },
  'क्यों': { ho: 'चीनाःमेंते', phonetic: 'Chinamente' },
  'कब': { ho: 'चीमतान', phonetic: 'Chimtan' },
  'कैसे': { ho: 'चिलेका', phonetic: 'Chileka' },
  'कितना': { ho: 'चिमिन', phonetic: 'Chimin' },
};

// 2. Multi-word Phrases & Classroom Sentences (Longest Match First)
export const HO_PHRASE_PATTERNS: Array<[RegExp, { ho: string; phonetic: string }]> = [
  [/["'“”«»]?नमस्ते\s+(बच्चों|बच्चन|बच्चो)[!।,.\s"'“”«»]*/gi, { ho: 'जोहार होनको! ', phonetic: 'Johar honko!' }],
  [/["'“”«»]?नमस्ते\s+शिक्षक[!।,.\s"'“”«»]*/gi, { ho: 'जोहार माचेत! ', phonetic: 'Johar machet!' }],
  [/["'“”«»]?कैसे\s+हो\s+(बच्चों|बच्चन|बच्चो)[!।,.\s"'“”«»]*/gi, { ho: 'चिलेका मेनाःपेया होनको? ', phonetic: 'Chileka menapeya honko?' }],
  [/["'“”«»]?आप\s+कैसे\s+हैं[!।,.\s"'“”«»]*/gi, { ho: 'चिलेका मेनाःबिना? ', phonetic: 'Chileka menabina?' }],
  [/["'“”«»]?तुम\s+कैसे\s+हो[!।,.\s"'“”«»]*/gi, { ho: 'चिलेका मेनाःमा? ', phonetic: 'Chileka menama?' }],
  [/आज हम/gi, { ho: 'तेहेंगे आबू ', phonetic: 'Tehenge aabu ' }],
  [/एक से दस तक/gi, { ho: 'मियद एते गेलेया जाबी ', phonetic: 'Miyad ete geleya jabi ' }],
  [/1 से 10 तक/gi, { ho: 'मियद (1) एते गेलेया (10) जाबी ', phonetic: 'Miyad ete geleya jabi ' }],
  [/गिनती सीखेंगे[।.]?/gi, { ho: 'लेका बू चेदोः-आ।', phonetic: 'Leka bu chedo-a.' }],
  [/गिनती सीखो[।.]?/gi, { ho: 'लेका चेदोःमे।', phonetic: 'Leka chedome.' }],
  [/अपनी किताब खोलो[।.]?/gi, { ho: 'अमाः पोथी झिज्मे।', phonetic: 'Ama pothi jhijme.' }],
  [/अपनी जगह पर बैठ जाओ[।.]?/gi, { ho: 'अमाः ठाई रे दुबमे।', phonetic: 'Ama thai re dubme.' }],
  [/बैठ जाओ[।.]?/gi, { ho: 'दुबमे।', phonetic: 'Dubme.' }],
  [/खड़े हो जाओ[।.]?/gi, { ho: 'तिंगुन्मे।', phonetic: 'Tinguinme.' }],
  [/बहुत अच्छा[!।,.\s]*/gi, { ho: 'एनांग बेस! ', phonetic: 'Enang bes! ' }],
  [/शाबाश[!।,.\s]*/gi, { ho: 'साबास! ', phonetic: 'Sabas! ' }],
  [/ब्लैकबोर्ड की तरफ देखो[।.]?/gi, { ho: 'ब्लैकबोर्ड पाः नेलमे।', phonetic: 'Blackboard pa nelme.' }],
  [/ध्यान से सुनो और लिखो[।.]?/gi, { ho: 'अयूममे आड़ो ओएलमे।', phonetic: 'Ayumme ado oelme.' }],
  [/ध्यान से सुनो[।.]?/gi, { ho: 'अयूममे।', phonetic: 'Ayumme.' }],
  [/इन सेबों को गिनो और संख्या बताओ[।.]?/gi, { ho: 'ने सेबको लेकायमे आड़ो लेका काजीमे।', phonetic: 'Ne sebko lekayme ado leka kajime.' }],
  [/इन सेबों को गिनो[।.]?/gi, { ho: 'ने सेबको लेकायमे।', phonetic: 'Ne sebko lekayme.' }],
  [/संख्या बताओ[।.]?/gi, { ho: 'लेका काजीमे।', phonetic: 'Leka kajime.' }],
  [/पाँच के बाद कौन सी संख्या आती है\??/gi, { ho: 'मोया तायोम चीनाः लेका हिजुः-आ?', phonetic: 'Moya tayom china leka hiju-a?' }],
  [/पांच के बाद कौन सी संख्या आती है\??/gi, { ho: 'मोया तायोम चीनाः लेका हिजुः-आ?', phonetic: 'Moya tayom china leka hiju-a?' }],
  [/क्या आपको समझ आया\??/gi, { ho: 'ची आम बुझाव केदा?', phonetic: 'Chi aam bujhao keda?' }],
  [/समझ आया\??/gi, { ho: 'बुझाव केदा?', phonetic: 'Bujhao keda?' }],
  [/समझ आ गया[।.]?/gi, { ho: 'बुझाव केदा।', phonetic: 'Bujhao keda.' }],
  [/हाँ शिक्षक[।,.]?/gi, { ho: 'हे माचेत।', phonetic: 'He machet.' }],
  [/यह तीन है[।.]?/gi, { ho: 'नेया अपिया तनाः।', phonetic: 'Neya apia tana.' }],
  [/यह तीन \(3\) है[।.]?/gi, { ho: 'नेया अपिया (3) तनाः।', phonetic: 'Neya apia (3) tana.' }],
  [/गाय, बकरी और हाथी को देखो[।.]?/gi, { ho: 'गय, मेरम आड़ो हाती नेलकोपे।', phonetic: 'Gai, meram ado hati nelkope.' }],
  [/क्या मैं पानी पीने जा सकता हूँ\??/gi, { ho: 'ची आइंग दाः नू सेनोः दयाईंग?', phonetic: 'Chi aing da nu seno dayaing?' }],
];

// 3. Categorized interactive quick presets for classroom dialogues in Ho
export const HO_CATEGORIZED_PHRASES = {
  greetings: [
    { hindi: 'नमस्ते बच्चों!', tribal: 'जोहार होनको!', pronunciation: 'Johar honko!', warang: '𑢮𑣉𑣎𑣉 𑢹𑣉𑣒𑣌𑣉!' },
    { hindi: 'नमस्ते शिक्षक!', tribal: 'जोहार माचेत!', pronunciation: 'Johar machet!' },
    { hindi: 'बहुत अच्छा! शाबाश!', tribal: 'एनांग बेस! साबास!', pronunciation: 'Enang bes! Sabas!' },
    { hindi: 'धन्यवाद!', tribal: 'जोहार / सारहाव!', pronunciation: 'Sarhao!' },
  ],
  commands: [
    { hindi: 'अपनी किताब खोलो।', tribal: 'अमाः पोथी झिज्मे।', pronunciation: 'Ama pothi jhijme.' },
    { hindi: 'अपनी जगह पर बैठ जाओ।', tribal: 'अमाः ठाई रे दुबमे।', pronunciation: 'Ama thai re dubme.' },
    { hindi: 'ब्लैकबोर्ड की तरफ देखो।', tribal: 'ब्लैकबोर्ड पाः नेलमे।', pronunciation: 'Blackboard pa nelme.' },
    { hindi: 'ध्यान से सुनो और लिखो।', tribal: 'अयूममे आड़ो ओएलमे।', pronunciation: 'Ayumme ado oelme.' },
  ],
  numeracy: [
    { hindi: 'आज हम एक से दस तक गिनती सीखेंगे।', tribal: 'तेहेंगे आबू मियद एते गेलेया जाबी लेका बू चेदोः-आ।', pronunciation: 'Tehenge aabu miyad ete geleya jabi leka bu chedo-a.' },
    { hindi: 'इन सेबों को गिनो।', tribal: 'ने सेबको लेकायमे।', pronunciation: 'Ne sebko lekayme.' },
    { hindi: 'यह तीन (3) है।', tribal: 'नेया अपिया (3) तनाः।', pronunciation: 'Neya apia (3) tana.' },
    { hindi: 'पाँच के बाद कौन सी संख्या आती है?', tribal: 'मोया तायोम चीनाः लेका हिजुः-आ?', pronunciation: 'Moya tayom china leka hiju-a?' },
  ],
  responses: [
    { tribal: 'हे माचेत, आइंग बुझाव केदा।', hindi: 'हाँ शिक्षक, मुझे समझ आ गया।', pronunciation: 'He machet, aing bujhao keda.' },
    { tribal: 'का बुझाव केदा, ओड़ोः काजीमे।', hindi: 'मुझे समझ नहीं आया, दोबारा बताइए।', pronunciation: 'Ka bujhao keda, odo kajime.' },
    { tribal: 'नेया अपिया (3) तनाः।', hindi: 'यह तीन (3) है।', pronunciation: 'Neya apia (3) tana.' },
    { tribal: 'दाः नू सेनोः दयाईंग?', hindi: 'क्या मैं पानी पीने जा सकता हूँ?', pronunciation: 'Da nu seno dayaing?' },
    { tribal: 'गय', hindi: 'गाय (Cow)', pronunciation: 'Gai' },
    { tribal: 'हाती', hindi: 'हाथी (Elephant)', pronunciation: 'Hati' },
    { tribal: 'सेब', hindi: 'सेब (Apple)', pronunciation: 'Seb' },
    { tribal: 'हे', hindi: 'हाँ (Yes)', pronunciation: 'He' },
    { tribal: 'का', hindi: 'नहीं (No)', pronunciation: 'Ka' },
  ],
};

// 4. Offline translator function for Ho
export function translateHindiToHo(text: string): { translation: string; phonetic: string } {
  let cleanInput = text.replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, '').trim();
  if (!cleanInput) return { translation: '', phonetic: '' };

  // 1. Direct dictionary match
  if (HINDI_TO_HO_VOCAB[cleanInput]) {
    const entry = HINDI_TO_HO_VOCAB[cleanInput];
    return { translation: entry.ho, phonetic: entry.phonetic };
  }

  // 2. Phrase matching
  let workingText = cleanInput;
  let matchedPhonetic = '';
  for (const [regex, entry] of HO_PHRASE_PATTERNS) {
    if (regex.test(workingText)) {
      workingText = workingText.replace(regex, entry.ho);
      matchedPhonetic = entry.phonetic;
      break;
    }
  }

  if (workingText !== cleanInput) {
    return { translation: workingText, phonetic: matchedPhonetic || workingText };
  }

  // 3. Word-by-word token replacement
  const words = cleanInput.split(/\s+/);
  const hoWords: string[] = [];
  const phoneticWords: string[] = [];

  for (const w of words) {
    const cleanWord = w.replace(/[।,?!.:;"'()]/g, '').trim();
    const punct = w.match(/[।,?!.:;"'()]+/g)?.[0] || '';

    if (HINDI_TO_HO_VOCAB[cleanWord]) {
      const entry = HINDI_TO_HO_VOCAB[cleanWord];
      hoWords.push(entry.ho + punct);
      phoneticWords.push(entry.phonetic + punct);
    } else if (HINDI_TO_HO_VOCAB[w]) {
      const entry = HINDI_TO_HO_VOCAB[w];
      hoWords.push(entry.ho);
      phoneticWords.push(entry.phonetic);
    } else {
      hoWords.push(w);
      phoneticWords.push(w);
    }
  }

  return {
    translation: hoWords.join(' '),
    phonetic: phoneticWords.join(' ')
  };
}

// 5. Reverse Ho to Hindi translation
export function translateHoToHindi(text: string): { translation: string } {
  const clean = text.trim();
  for (const [hin, val] of Object.entries(HINDI_TO_HO_VOCAB)) {
    if (val.ho.toLowerCase() === clean.toLowerCase() || val.phonetic.toLowerCase() === clean.toLowerCase()) {
      return { translation: hin };
    }
  }
  for (const [regex, entry] of HO_PHRASE_PATTERNS) {
    if (entry.ho.includes(clean) || clean.includes(entry.ho.trim())) {
      return { translation: 'सटीक उत्तर (Correct Answer)' };
    }
  }
  return { translation: clean };
}
