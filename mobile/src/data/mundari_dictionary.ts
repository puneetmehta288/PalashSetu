/**
 * PalashSetu Mundari (ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी भाषा) Offline Edge Dictionary
 * ====================================================================
 * Tribal Region: South Chotanagpur (Ranchi, Khunti, Simdega, Gumla)
 * Script: Mundari Nagari / Devanagari & Mundari Bani / Phonetic Latin
 * Language Family: Austroasiatic (Munda branch)
 * Used for 100% offline classroom pedagogy & live translation
 */

export const MUNDARI_METADATA = {
  name: 'Mundari',
  nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी भाषा',
  script: 'Mundari Nagari & Bani (मुंडारी / ᱢᱩᱱᱰᱟᱨᱤ)',
  region: 'South Chotanagpur (Khunti, Ranchi, Torpa, Murhu, Simdega)',
  districts: ['Ranchi', 'Khunti', 'Simdega', 'Gumla'],
  greeting: 'जोहार (Johar)',
  code: 'unr_Deva'
};

// 1. Core Vocabulary (Hindi -> Mundari)
export const HINDI_TO_MUNDARI_VOCAB: Record<string, { mun: string; phonetic: string }> = {
  // Greetings & Social
  'नमस्ते': { mun: 'जोहार', phonetic: 'Johar' },
  'जोहार': { mun: 'जोहार', phonetic: 'Johar' },
  'धन्यवाद': { mun: 'सारहाव / जोहार', phonetic: 'Sarhao' },
  'स्वागत': { mun: 'सागुन दाराम', phonetic: 'Sagun daram' },
  'अच्छा': { mun: 'बुगिन / बेस', phonetic: 'Bugin' },
  'बहुत अच्छा': { mun: 'बुगिन बेस', phonetic: 'Bugin bes' },
  'शाबाश': { mun: 'साबास', phonetic: 'Sabas' },
  'हाँ': { mun: 'हे', phonetic: 'He' },
  'नहीं': { mun: 'का', phonetic: 'Ka' },
  'ठीक है': { mun: 'ठीक मेनाः', phonetic: 'Thik mena' },

  // Classroom & Roles
  'शिक्षक': { mun: 'माचेत / गुरुजी', phonetic: 'Machet / Guruji' },
  'शिक्षिका': { mun: 'माचेतानी', phonetic: 'Machetai' },
  'गुरुजी': { mun: 'गुरुजी', phonetic: 'Guruji' },
  'बच्चे': { mun: 'होनको', phonetic: 'Honko' },
  'बच्चों': { mun: 'होनको', phonetic: 'Honko' },
  'बच्चा': { mun: 'होन / गिदरा', phonetic: 'Hon' },
  'लड़का': { mun: 'कोड़ा', phonetic: 'Koda' },
  'लड़की': { mun: 'कुड़ी', phonetic: 'Kudi' },
  'छात्र': { mun: 'इतुसांग / पाढ़ुवा', phonetic: 'Itusang' },
  'स्कूल': { mun: 'आसड़ा / इसकुल', phonetic: 'Asda / Iskul' },
  'कक्षा': { mun: 'क्लास / ताहा', phonetic: 'Class' },
  'किताब': { mun: 'पुती', phonetic: 'Puti' },
  'पुस्तिका': { mun: 'पुती', phonetic: 'Puti' },
  'कलम': { mun: 'कलम / ओएलनी', phonetic: 'Kalam' },
  'पेंसिल': { mun: 'पेंसिल', phonetic: 'Pencil' },
  'कॉपी': { mun: 'खाता / पुती', phonetic: 'Khata' },
  'ब्लैकबोर्ड': { mun: 'ब्लैकबोर्ड / हेंदे पाटा', phonetic: 'Blackboard' },
  'चित्र': { mun: 'चितार', phonetic: 'Chitar' },

  // Numbers 1-20 (Counting & FLN Numeracy in Mundari)
  'एक': { mun: 'मिअद', phonetic: 'Miyad' },
  'दो': { mun: 'बारिया', phonetic: 'Baria' },
  'तीन': { mun: 'अपिया', phonetic: 'Apia' },
  'चार': { mun: 'उपुनिया', phonetic: 'Upunia' },
  'पाँच': { mun: 'मोड़ेया', phonetic: 'Modeya' },
  'पांच': { mun: 'मोड़ेया', phonetic: 'Modeya' },
  'छह': { mun: 'तुरुइया', phonetic: 'Turuiya' },
  'सात': { mun: 'आया', phonetic: 'Aaya' },
  'आठ': { mun: 'इरीलिया', phonetic: 'Iriliya' },
  'नौ': { mun: 'आरेया', phonetic: 'Aareya' },
  'दस': { mun: 'गेलेया', phonetic: 'Geleya' },
  '1': { mun: 'मिअद (1)', phonetic: 'Miyad' },
  '2': { mun: 'बारिया (2)', phonetic: 'Baria' },
  '3': { mun: 'अपिया (3)', phonetic: 'Apia' },
  '4': { mun: 'उपुनिया (4)', phonetic: 'Upunia' },
  '5': { mun: 'मोड़ेया (5)', phonetic: 'Modeya' },
  '6': { mun: 'तुरुइया (6)', phonetic: 'Turuiya' },
  '7': { mun: 'आया (7)', phonetic: 'Aaya' },
  '8': { mun: 'इरीलिया (8)', phonetic: 'Iriliya' },
  '9': { mun: 'आरेया (9)', phonetic: 'Aareya' },
  '10': { mun: 'गेलेया (10)', phonetic: 'Geleya' },
  'गिनती': { mun: 'लेका', phonetic: 'Leka' },
  'गिनो': { mun: 'लेकाएमे', phonetic: 'Lekaeme' },
  'संख्या': { mun: 'लेका / नंबर', phonetic: 'Leka' },
  'गणित': { mun: 'हिसाब / लेका', phonetic: 'Hisab' },
  'जोड़': { mun: 'मिशाम / जोड़ाव', phonetic: 'Misham' },
  'जोड़ो': { mun: 'मिशामे', phonetic: 'Mishame' },
  'घटाव': { mun: 'घटाव / ओड़ोः', phonetic: 'Ghatao' },
  'घटाओ': { mun: 'घटावमे', phonetic: 'Ghataome' },
  'बराबर': { mun: 'सोमान / बारबर', phonetic: 'Soman' },

  // Animals (जीव / जानवर)
  'गाय': { mun: 'उरीः', phonetic: 'Uri' },
  'बकरी': { mun: 'मेरम', phonetic: 'Meram' },
  'कुत्ता': { mun: 'सेता', phonetic: 'Seta' },
  'बिल्ली': { mun: 'पुसी', phonetic: 'Pusi' },
  'हाथी': { mun: 'हाती', phonetic: 'Hati' },
  'बाघ': { mun: 'कुला', phonetic: 'Kula' },
  'शेर': { mun: 'सिंह / कुला', phonetic: 'Kula' },
  'भालू': { mun: 'बाना', phonetic: 'Bana' },
  'बंदर': { mun: 'गाड़ी / सारा', phonetic: 'Gadi' },
  'घोड़ा': { mun: 'सादाम', phonetic: 'Sadam' },
  'भैंस': { mun: 'काड़ा', phonetic: 'Kada' },
  'भेड़': { mun: 'मिंदी', phonetic: 'Mindi' },
  'सूअर': { mun: 'सुकुरी', phonetic: 'Sukuri' },
  'मुर्गी': { mun: 'सिम', phonetic: 'Sim' },
  'बतख': { mun: 'गेड़े', phonetic: 'Gede' },
  'मछली': { mun: 'हाकु', phonetic: 'Haku' },
  'सांप': { mun: 'बिंग', phonetic: 'Bing' },
  'मेंढक': { mun: 'चोक़े / रोटे', phonetic: 'Choke' },
  'चिड़िया': { mun: 'चेड़े', phonetic: 'Chede' },
  'कौआ': { mun: 'कावा', phonetic: 'Kawa' },
  'मोर': { mun: 'माराः', phonetic: 'Mara' },

  // Fruits, Vegetables & Food
  'आम': { mun: 'उली', phonetic: 'Uli' },
  'केला': { mun: 'कदली', phonetic: 'Kadali' },
  'सेब': { mun: 'सेब', phonetic: 'Seb' },
  'अमरूद': { mun: 'सपरी', phonetic: 'Sapri' },
  'पपीता': { mun: 'पपीता', phonetic: 'Papita' },
  'कटहल': { mun: 'कंटाड़ा', phonetic: 'Kantada' },
  'पानी': { mun: 'दाः', phonetic: 'Da' },
  'खाना': { mun: 'मांडी / जोमाः', phonetic: 'Mandi' },
  'चावल': { mun: 'चाउली', phonetic: 'Chauli' },
  'भात': { mun: 'मांडी', phonetic: 'Mandi' },
  'दूध': { mun: 'तोआ', phonetic: 'Toa' },
  'रोटी': { mun: 'रोटी / लाड़', phonetic: 'Roti' },
  'फल': { mun: 'जो', phonetic: 'Jo' },
  'फूल': { mun: 'बा', phonetic: 'Ba' },
  'पेड़': { mun: 'दारू', phonetic: 'Daru' },
  'पत्ता': { mun: 'साकाम', phonetic: 'Sakam' },

  // Body Parts
  'सिर': { mun: 'बोहोः', phonetic: 'Boho' },
  'आंख': { mun: 'मेद', phonetic: 'Med' },
  'आँख': { mun: 'मेद', phonetic: 'Med' },
  'कान': { mun: 'लुतुर', phonetic: 'Lutur' },
  'नाक': { mun: 'मुँअ', phonetic: 'Muan' },
  'हाथ': { mun: 'तीः', phonetic: 'Ti' },
  'पैर': { mun: 'काट्टा', phonetic: 'Katta' },
  'मुंह': { mun: 'आ / मोचा', phonetic: 'Aa' },
  'दांत': { mun: 'डाटा', phonetic: 'Data' },
  'पेट': { mun: 'लाज', phonetic: 'Laj' },

  // Colors
  'लाल': { mun: 'अराः', phonetic: 'Ara' },
  'हरा': { mun: 'हरियार', phonetic: 'Hariyar' },
  'पीला': { mun: 'सासांग', phonetic: 'Sasang' },
  'नीला': { mun: 'लिल', phonetic: 'Lil' },
  'सफेद': { mun: 'पोंडी', phonetic: 'Pondi' },
  'काला': { mun: 'हेंदे', phonetic: 'Hende' },

  // Common Classroom Verbs & Directives
  'खोलो': { mun: 'निजमे', phonetic: 'Nijme' },
  'खोलिए': { mun: 'निजपे', phonetic: 'Nijpe' },
  'बंद करो': { mun: 'हाँसेदमे', phonetic: 'Hansedme' },
  'बैठो': { mun: 'दुबमे', phonetic: 'Dubme' },
  'बैठ जाओ': { mun: 'दुबमे', phonetic: 'Dubme' },
  'खड़े हो जाओ': { mun: 'तिंगुमे', phonetic: 'Tingume' },
  'खड़े रहो': { mun: 'तिंगुमे', phonetic: 'Tingume' },
  'पढ़ो': { mun: 'पड़ावमे', phonetic: 'Padaome' },
  'लिखो': { mun: 'ओलमे', phonetic: 'Olme' },
  'सुनो': { mun: 'अयूममे', phonetic: 'Ayumme' },
  'देखो': { mun: 'नेलमे', phonetic: 'Nelme' },
  'दिखाओ': { mun: 'उदुबमे', phonetic: 'Udubme' },
  'बताओ': { mun: 'काजीमे', phonetic: 'Kajime' },
  'आओ': { mun: 'हिजुःमे', phonetic: 'Hijume' },
  'जाओ': { mun: 'सेनोःमे', phonetic: 'Senome' },
  'बोलो': { mun: 'काजीमे', phonetic: 'Kajime' },
  'चुप रहो': { mun: 'थिरमे', phonetic: 'Thirme' },
  'ताली बजाओ': { mun: 'सापड़ांगमे', phonetic: 'Sapadangme' },
  'हंसो': { mun: 'लांदामे', phonetic: 'Landame' },

  // Pronouns & Question Words
  'मैं': { mun: 'आईंग', phonetic: 'Aing' },
  'तुम': { mun: 'आम', phonetic: 'Aam' },
  'आप': { mun: 'अपे', phonetic: 'Ape' },
  'हम': { mun: 'आबू', phonetic: 'Aabu' },
  'यह': { mun: 'नेया', phonetic: 'Neya' },
  'वह': { mun: 'तेया / एनेया', phonetic: 'Teya' },
  'ये': { mun: 'नेको', phonetic: 'Neko' },
  'वे': { mun: 'एनको', phonetic: 'Enko' },
  'क्या': { mun: 'चीनाः', phonetic: 'China' },
  'कहाँ': { mun: 'ओकोरे', phonetic: 'Okore' },
  'कौन': { mun: 'ओकोय', phonetic: 'Okoy' },
  'क्यों': { mun: 'चीनाःमेंते', phonetic: 'Chinamente' },
  'कब': { mun: 'चीमतान', phonetic: 'Chimtan' },
  'कैसे': { mun: 'चिलेका', phonetic: 'Chileka' },
  'कितना': { mun: 'चिमिन', phonetic: 'Chimin' },

  // NIPUN Flashcard Decks & Themes
  'एक (1)': { mun: 'मिअद (1)', phonetic: 'Miyad' },
  'दो (2)': { mun: 'बारिआ (2)', phonetic: 'Baria' },
  'तीन (3)': { mun: 'आपिआ (3)', phonetic: 'Apia' },
  'चार (4)': { mun: 'उपूनिआ (4)', phonetic: 'Upunia' },
  'पाँच (5)': { mun: 'मोड़ेआ (5)', phonetic: 'Morea' },
  'छह (6)': { mun: 'तुरिआ (6)', phonetic: 'Turia' },
  'सात (7)': { mun: 'एअ (7)', phonetic: 'Eya' },
  'आठ (8)': { mun: 'इरलिआ (8)', phonetic: 'Irlia' },
  'नौ (9)': { mun: 'आरेआ (9)', phonetic: 'Areya' },
  'दस (10)': { mun: 'गेलेआ (10)', phonetic: 'Geleya' },
  'गोला (वृत्त)': { mun: 'गुल (वृत्त)', phonetic: 'Gul' },
  'चौकोर (वर्ग)': { mun: 'चारकोना (वर्ग)', phonetic: 'Charkona' },
  'तिकोना (त्रिभुज)': { mun: 'पेकोना (त्रिभुज)', phonetic: 'Pekona' },
  'आयत (Rectangle)': { mun: 'आयत (Rectangle)', phonetic: 'Ayat' },
  'तारा': { mun: 'इपिल (तारा)', phonetic: 'Ipil' },
  'बड़ा / छोटा': { mun: 'मारांग / हुड़िंग', phonetic: 'Marang / Huding' },
  'लंबा / छोटा': { mun: 'जिलिंग / खाटो', phonetic: 'Jiling / Khato' },
  'ज़्यादा / कम': { mun: 'पूरा / कम', phonetic: 'Pura / Kam' },
  'भारी / हल्का': { mun: 'हाम्बल / रावाल', phonetic: 'Hambal / Rawal' },
  'गर्म / ठंडा': { mun: 'लोलो / राबाङ', phonetic: 'Lolo / Rabang' },
  'जोहार (नमस्ते)': { mun: 'जोहार', phonetic: 'Johar' },
  'हाँ / नहीं': { mun: 'हे / का (बांग)', phonetic: 'He / Ka' },
  'बैठो / खड़े हो': { mun: 'दुबमे / तिंगुन्मे', phonetic: 'Dubme / Tinguinme' },
  'दिन / रात': { mun: 'सिंगी / निदा', phonetic: 'Singi / Nida' },
  'गाँव / शहर': { mun: 'हातू / साहार', phonetic: 'Hatu / Sahar' },
  'आना / जाना': { mun: 'हिजुः / सेनोः', phonetic: 'Hiju / Seno' },
  'तेज़ / धीरे': { mun: 'लॉगन / बायो-बायो', phonetic: 'Logon / Bayo-bayo' },
  'सोहराय (त्योहार)': { mun: 'सोहराय / मागे (त्योहार)', phonetic: 'Sohray' },
  'उंगली': { mun: 'गांडा', phonetic: 'Ganda' },
};

// 2. Multi-word Phrases & Classroom Sentences (Longest Match First)
export const MUNDARI_PHRASE_PATTERNS: Array<[RegExp, { mun: string; phonetic: string }]> = [
  [/["'“”«»]?नमस्ते\s+(बच्चों|बच्चन|बच्चो)[!।,.\s"'“”«»]*/gi, { mun: 'जोहार होनको! ', phonetic: 'Johar honko!' }],
  [/["'“”«»]?नमस्ते\s+शिक्षक[!।,.\s"'“”«»]*/gi, { mun: 'जोहार गुरुजी! ', phonetic: 'Johar guruji!' }],
  [/["'“”«»]?कैसे\s+हो\s+(बच्चों|बच्चन|बच्चो)[!।,.\s"'“”«»]*/gi, { mun: 'चिलेका मेनाःपेया होनको? ', phonetic: 'Chileka menapeya honko?' }],
  [/["'“”«»]?आप\s+कैसे\s+हैं[!।,.\s"'“”«»]*/gi, { mun: 'चिलेका मेनाःपेया? ', phonetic: 'Chileka menapeya?' }],
  [/["'“”«»]?तुम\s+कैसे\s+हो[!।,.\s"'“”«»]*/gi, { mun: 'चिलेका मेनाःमा? ', phonetic: 'Chileka menama?' }],
  [/आज हम/gi, { mun: 'तिसिंग आबू ', phonetic: 'Tising aabu ' }],
  [/एक से दस तक/gi, { mun: 'मिअद एते गेलेया जाबी ', phonetic: 'Miyad ete geleya jabi ' }],
  [/1 से 10 तक/gi, { mun: 'मिअद (1) एते गेलेया (10) जाबी ', phonetic: 'Miyad ete geleya jabi ' }],
  [/गिनती सीखेंगे[।.]?/gi, { mun: 'लेका बू इतूना।', phonetic: 'Leka bu ituna.' }],
  [/गिनती सीखो[।.]?/gi, { mun: 'लेका इतूमे।', phonetic: 'Leka itume.' }],
  [/अपनी किताब खोलो[।.]?/gi, { mun: 'अमाः पुती निजमे।', phonetic: 'Ama puti nijme.' }],
  [/अपनी जगह पर बैठ जाओ[।.]?/gi, { mun: 'अमाः ठाई रे दुबमे।', phonetic: 'Ama thai re dubme.' }],
  [/बैठ जाओ[।.]?/gi, { mun: 'दुबमे।', phonetic: 'Dubme.' }],
  [/खड़े हो जाओ[।.]?/gi, { mun: 'तिंगुमे।', phonetic: 'Tingume.' }],
  [/बहुत अच्छा[!।,.\s]*/gi, { mun: 'बुगिन बेस! ', phonetic: 'Bugin bes! ' }],
  [/शाबाश[!।,.\s]*/gi, { mun: 'साबास! ', phonetic: 'Sabas! ' }],
  [/ब्लैकबोर्ड की तरफ देखो[।.]?/gi, { mun: 'ब्लैकबोर्ड पाः नेलमे।', phonetic: 'Blackboard pa nelme.' }],
  [/ध्यान से सुनो और लिखो[।.]?/gi, { mun: 'अयूममे आड़ो ओलमे।', phonetic: 'Ayumme ado olme.' }],
  [/ध्यान से सुनो[।.]?/gi, { mun: 'अयूममे।', phonetic: 'Ayumme.' }],
  [/इन सेबों को गिनो और संख्या बताओ[।.]?/gi, { mun: 'ने सेबको लेकाएमे आड़ो लेका काजीमे।', phonetic: 'Ne sebko lekaeme ado leka kajime.' }],
  [/इन सेबों को गिनो[।.]?/gi, { mun: 'ने सेबको लेकाएमे।', phonetic: 'Ne sebko lekaeme.' }],
  [/संख्या बताओ[।.]?/gi, { mun: 'लेका काजीमे।', phonetic: 'Leka kajime.' }],
  [/पाँच के बाद कौन सी संख्या आती है\??/gi, { mun: 'मोड़ेया तायोम चीनाः लेका हिजुः-आ?', phonetic: 'Modeya tayom china leka hiju-a?' }],
  [/पांच के बाद कौन सी संख्या आती है\??/gi, { mun: 'मोड़ेया तायोम चीनाः लेका हिजुः-आ?', phonetic: 'Modeya tayom china leka hiju-a?' }],
  [/क्या आपको समझ आया\??/gi, { mun: 'ची आम बुझाव केदा?', phonetic: 'Chi aam bujhao keda?' }],
  [/समझ आया\??/gi, { mun: 'बुझाव केदा?', phonetic: 'Bujhao keda?' }],
  [/समझ आ गया[।.]?/gi, { mun: 'बुझाव केदा।', phonetic: 'Bujhao keda.' }],
  [/हाँ शिक्षक[।,.]?/gi, { mun: 'हे माचेत।', phonetic: 'He machet.' }],
  [/यह तीन है[।.]?/gi, { mun: 'नेया अपिया मेनाः।', phonetic: 'Neya apia mena.' }],
  [/यह तीन \(3\) है[।.]?/gi, { mun: 'नेया अपिया (3) मेनाः।', phonetic: 'Neya apia (3) mena.' }],
  [/गाय, बकरी और हाथी को देखो[।.]?/gi, { mun: 'उरीः, मेरम आड़ो हाती नेलकोपे।', phonetic: 'Uri, meram ado hati nelkope.' }],
  [/क्या मैं पानी पीने जा सकता हूँ\??/gi, { mun: 'ची आईंग दाः नू सेनोः दयाईंग?', phonetic: 'Chi aing da nu seno dayaing?' }],
];

// 3. Categorized interactive quick presets for classroom dialogues in Mundari
export const MUNDARI_CATEGORIZED_PHRASES = {
  greetings: [
    { hindi: 'नमस्ते बच्चों!', tribal: 'जोहार होनको!', pronunciation: 'Johar honko!' },
    { hindi: 'नमस्ते शिक्षक!', tribal: 'जोहार गुरुजी!', pronunciation: 'Johar guruji!' },
    { hindi: 'बहुत अच्छा! शाबाश!', tribal: 'बुगिन बेस! साबास!', pronunciation: 'Bugin bes! Sabas!' },
    { hindi: 'धन्यवाद!', tribal: 'सारहाव / जोहार!', pronunciation: 'Sarhao!' },
  ],
  commands: [
    { hindi: 'अपनी किताब खोलो।', tribal: 'अमाः पुती निजमे।', pronunciation: 'Ama puti nijme.' },
    { hindi: 'अपनी जगह पर बैठ जाओ।', tribal: 'अमाः ठाई रे दुबमे।', pronunciation: 'Ama thai re dubme.' },
    { hindi: 'ब्लैकबोर्ड की तरफ देखो।', tribal: 'ब्लैकबोर्ड पाः नेलमे।', pronunciation: 'Blackboard pa nelme.' },
    { hindi: 'ध्यान से सुनो और लिखो।', tribal: 'अयूममे आड़ो ओलमे।', pronunciation: 'Ayumme ado olme.' },
  ],
  numeracy: [
    { hindi: 'आज हम एक से दस तक गिनती सीखेंगे।', tribal: 'तिसिंग आबू मिअद एते गेलेया जाबी लेका बू इतूना।', pronunciation: 'Tising aabu miyad ete geleya jabi leka bu ituna.' },
    { hindi: 'इन सेबों को गिनो।', tribal: 'ने सेबको लेकाएमे।', pronunciation: 'Ne sebko lekaeme.' },
    { hindi: 'यह तीन (3) है।', tribal: 'नेया अपिया (3) मेनाः।', pronunciation: 'Neya apia (3) mena.' },
    { hindi: 'पाँच के बाद कौन सी संख्या आती है?', tribal: 'मोड़ेया तायोम चीनाः लेका हिजुः-आ?', pronunciation: 'Modeya tayom china leka hiju-a?' },
  ],
  responses: [
    { tribal: 'हे माचेत, आईंग बुझाव केदा।', hindi: 'हाँ शिक्षक, मुझे समझ आ गया।', pronunciation: 'He machet, aing bujhao keda.' },
    { tribal: 'का बुझाव केदा, ओड़ोः काजीमे।', hindi: 'मुझे समझ नहीं आया, दोबारा बताइए।', pronunciation: 'Ka bujhao keda, odo kajime.' },
    { tribal: 'नेया अपिया (3) मेनाः।', hindi: 'यह तीन (3) है।', pronunciation: 'Neya apia (3) mena.' },
    { tribal: 'दाः नू सेनोः दयाईंग?', hindi: 'क्या मैं पानी पीने जा सकता हूँ?', pronunciation: 'Da nu seno dayaing?' },
    { tribal: 'उरीः', hindi: 'गाय (Cow)', pronunciation: 'Uri' },
    { tribal: 'हाती', hindi: 'हाथी (Elephant)', pronunciation: 'Hati' },
    { tribal: 'सेब', hindi: 'सेब (Apple)', pronunciation: 'Seb' },
    { tribal: 'हे', hindi: 'हाँ (Yes)', pronunciation: 'He' },
    { tribal: 'का', hindi: 'नहीं (No)', pronunciation: 'Ka' },
  ],
};

// 4. Offline translator function for Mundari
export function translateHindiToMundari(text: string): { translation: string; phonetic: string } {
  let cleanInput = text.replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, '').trim();
  if (!cleanInput) return { translation: '', phonetic: '' };

  // 1. Direct dictionary match
  if (HINDI_TO_MUNDARI_VOCAB[cleanInput]) {
    const entry = HINDI_TO_MUNDARI_VOCAB[cleanInput];
    return { translation: entry.mun, phonetic: entry.phonetic };
  }

  // 2. Phrase matching
  let workingText = cleanInput;
  let matchedPhonetic = '';
  for (const [regex, entry] of MUNDARI_PHRASE_PATTERNS) {
    if (regex.test(workingText)) {
      workingText = workingText.replace(regex, entry.mun);
      matchedPhonetic = entry.phonetic;
      break;
    }
  }

  if (workingText !== cleanInput) {
    return { translation: workingText, phonetic: matchedPhonetic || workingText };
  }

  // 3. Word-by-word token replacement
  const words = cleanInput.split(/\s+/);
  const munWords: string[] = [];
  const phoneticWords: string[] = [];

  for (const w of words) {
    const cleanWord = w.replace(/[।,?!.:;"'()]/g, '').trim();
    const punct = w.match(/[।,?!.:;"'()]+/g)?.[0] || '';

    if (HINDI_TO_MUNDARI_VOCAB[cleanWord]) {
      const entry = HINDI_TO_MUNDARI_VOCAB[cleanWord];
      munWords.push(entry.mun + punct);
      phoneticWords.push(entry.phonetic + punct);
    } else if (HINDI_TO_MUNDARI_VOCAB[w]) {
      const entry = HINDI_TO_MUNDARI_VOCAB[w];
      munWords.push(entry.mun);
      phoneticWords.push(entry.phonetic);
    } else {
      munWords.push(w);
      phoneticWords.push(w);
    }
  }

  return {
    translation: munWords.join(' '),
    phonetic: phoneticWords.join(' ')
  };
}

// 5. Reverse Mundari to Hindi translation
export function translateMundariToHindi(text: string): { translation: string } {
  const clean = text.trim();
  for (const [hin, val] of Object.entries(HINDI_TO_MUNDARI_VOCAB)) {
    if (val.mun.toLowerCase() === clean.toLowerCase() || val.phonetic.toLowerCase() === clean.toLowerCase()) {
      return { translation: hin };
    }
  }
  for (const [regex, entry] of MUNDARI_PHRASE_PATTERNS) {
    if (entry.mun.includes(clean) || clean.includes(entry.mun.trim())) {
      return { translation: 'सटीक उत्तर (Correct Answer)' };
    }
  }
  return { translation: clean };
}
