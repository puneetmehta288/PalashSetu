/**
 * api/telemetry.ts — Vercel Serverless Function
 * PalashCentralHub Classroom Speech & Telemetry Harvest Engine
 * 
 * Receives batches of spoken Hindi/Tribal sentences queued offline on rural tablets.
 * Provides analytical aggregations: word frequency, missing vocabulary discovery,
 * school-wise and teacher-wise hierarchical breakdown, and district FLN activity.
 * 
 * POST /api/telemetry  -> Upload batch of records
 * GET  /api/telemetry  -> Return records + aggregated linguistic & school intelligence
 * DELETE /api/telemetry -> Clear or reset store
 */

interface ApiRequest {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(data: any): void;
  end(): void;
}

export interface TelemetryItem {
  id: string;
  timestamp: string;
  receivedAt?: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  district: string;
  block: string;
  grade: string;
  language: 'santali' | 'ho' | 'mundari';
  mode: 'teacher' | 'student';
  sourceText: string;
  translatedText: string;
  confidence: 'verified' | 'lexicon' | 'partial';
  source: 'voice' | 'manual' | 'phrasebook';
}

declare const global: { __palashTelemetry?: TelemetryItem[] };

// Seed realistic field baseline telemetry if store is empty
// Features multiple schools and multiple teachers per school for drill-down testing!
const DEFAULT_BASELINE_TELEMETRY: TelemetryItem[] = [
  // School 1: राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका) - Teacher: Sunita Kumari
  {
    id: 'tel_init_01',
    timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    teacherId: 'EVV-JH-849201',
    teacherName: 'Sunita Kumari',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 1',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'आज हम एक से दस तक गिनती सीखेंगे।',
    translatedText: 'ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾',
    confidence: 'verified',
    source: 'voice'
  },
  {
    id: 'tel_init_02',
    timestamp: new Date(Date.now() - 3600000 * 3.2).toISOString(),
    teacherId: 'EVV-JH-849201',
    teacherName: 'Sunita Kumari',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 1',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'अपनी किताब खोलो।',
    translatedText: 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾',
    confidence: 'verified',
    source: 'phrasebook'
  },
  {
    id: 'tel_init_03',
    timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(),
    teacherId: 'EVV-JH-849201',
    teacherName: 'Sunita Kumari',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 1',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'पेड़ पर तीन चिड़िया बैठी हैं',
    translatedText: 'ᱫᱟᱨᱮ ᱨᱮ ᱯᱮ ᱪᱮᱬᱮ ᱫᱩᱲᱩᱵ ᱠᱟᱱᱟᱠᱚ',
    confidence: 'verified',
    source: 'voice'
  },
  {
    id: 'tel_init_04',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    teacherId: 'EVV-JH-849201',
    teacherName: 'Sunita Kumari',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 1',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'बहुत अच्छा! शाबाश!',
    translatedText: 'ᱟᱹᱰᱤ ᱵᱮᱥ! ᱥᱟᱵᱟᱥ!',
    confidence: 'verified',
    source: 'phrasebook'
  },
  {
    id: 'tel_init_05',
    timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(),
    teacherId: 'EVV-JH-849201',
    teacherName: 'Sunita Kumari',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 1',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'ब्लैकबोर्ड की तरफ देखो।',
    translatedText: 'ᱵᱞᱮᱠᱵᱳᱨᱰ ᱥᱮᱫ ᱧᱮᱞ ᱢᱮ᱾',
    confidence: 'verified',
    source: 'voice'
  },

  // School 1 - Teacher 2: Anil Hembram
  {
    id: 'tel_init_06',
    timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    teacherId: 'EVV-JH-849205',
    teacherName: 'Anil Hembram',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 2',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'इन वस्तुओं को गिनो और संख्या बताओ।',
    translatedText: 'ᱱᱚᱣᱟ ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ ᱟᱨ ᱮᱞᱠᱷᱟ ᱞᱟᱹᱭ ᱢᱮ᱾',
    confidence: 'lexicon',
    source: 'voice'
  },
  {
    id: 'tel_init_07',
    timestamp: new Date(Date.now() - 3600000 * 1.6).toISOString(),
    teacherId: 'EVV-JH-849205',
    teacherName: 'Anil Hembram',
    schoolName: 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड (दुमका)',
    district: 'Dumka',
    block: 'Kathikund',
    grade: 'Class 2',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'पाँच के बाद कौन सी संख्या आती है?',
    translatedText: 'ᱢᱚᱬᱮ ᱛᱟᱭᱚᱢ ᱫᱚ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ?',
    confidence: 'verified',
    source: 'voice'
  },

  // School 2: उत्क्रमित उच्च विद्यालय, घाटशिला (पूर्वी सिंहभूम) - Teacher: Ramesh Murmu
  {
    id: 'tel_init_08',
    timestamp: new Date(Date.now() - 3600000 * 1.4).toISOString(),
    teacherId: 'EVV-JH-912044',
    teacherName: 'Ramesh Murmu',
    schoolName: 'उत्क्रमित उच्च विद्यालय, घाटशिला (पूर्वी सिंहभूम)',
    district: 'East Singhbhum',
    block: 'Ghatshila',
    grade: 'Balvatika',
    language: 'santali',
    mode: 'student',
    sourceText: 'ᱫᱟᱜ ᱧᱩᱧ ᱥᱮᱱᱚᱜᱼᱟ?',
    translatedText: 'क्या मैं पानी पीने जा सकता हूँ?',
    confidence: 'verified',
    source: 'phrasebook'
  },
  {
    id: 'tel_init_09',
    timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    teacherId: 'EVV-JH-912044',
    teacherName: 'Ramesh Murmu',
    schoolName: 'उत्क्रमित उच्च विद्यालय, घाटशिला (पूर्वी सिंहभूम)',
    district: 'East Singhbhum',
    block: 'Ghatshila',
    grade: 'Balvatika',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'गाय, बकरी और हाथी को देखो।',
    translatedText: 'ᱜᱟᱹᱭ, ᱢᱮᱨᱚᱢ ᱟᱨ ᱦᱟᱹᱛᱤ ᱠᱚ ᱧᱮᱞ ᱢᱮ᱾',
    confidence: 'verified',
    source: 'voice'
  },
  {
    id: 'tel_init_10',
    timestamp: new Date(Date.now() - 3600000 * 0.9).toISOString(),
    teacherId: 'EVV-JH-912044',
    teacherName: 'Ramesh Murmu',
    schoolName: 'उत्क्रमित उच्च विद्यालय, घाटशिला (पूर्वी सिंहभूम)',
    district: 'East Singhbhum',
    block: 'Ghatshila',
    grade: 'Balvatika',
    language: 'ho',
    mode: 'teacher',
    sourceText: 'इन सेबों को गिनो और संख्या बताओ।',
    translatedText: 'ने सेबको लेकाएपे आड़ो संख्या काजीपे।',
    confidence: 'partial',
    source: 'voice'
  },

  // School 2 - Teacher 2: Pooja Mahato
  {
    id: 'tel_init_11',
    timestamp: new Date(Date.now() - 3600000 * 0.7).toISOString(),
    teacherId: 'EVV-JH-912050',
    teacherName: 'Pooja Mahato',
    schoolName: 'उत्क्रमित उच्च विद्यालय, घाटशिला (पूर्वी सिंहभूम)',
    district: 'East Singhbhum',
    block: 'Ghatshila',
    grade: 'Class 1',
    language: 'ho',
    mode: 'teacher',
    sourceText: 'बच्चों, अपनी कलम और कॉपी निकालो।',
    translatedText: 'होनको, आपन कलम आड़ो कापी उडुकुयेपे।',
    confidence: 'lexicon',
    source: 'voice'
  },

  // School 3: राजकीय बुनियादी विद्यालय, हिरणपुर (पाकुड़) - Teacher: Anjali Soren
  {
    id: 'tel_init_12',
    timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    teacherId: 'EVV-JH-721098',
    teacherName: 'Anjali Soren',
    schoolName: 'राजकीय बुनियादी विद्यालय, हिरणपुर (पाकुड़)',
    district: 'Pakur',
    block: 'Hiranpur',
    grade: 'Class 2',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'कलम और कॉपी निकालो।',
    translatedText: 'ᱠᱚᱞᱚᱢ ᱟᱨ ᱠᱟᱯᱤ ᱚᱰᱚᱠ ᱢᱮ᱾',
    confidence: 'lexicon',
    source: 'voice'
  },
  {
    id: 'tel_init_13',
    timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString(),
    teacherId: 'EVV-JH-721098',
    teacherName: 'Anjali Soren',
    schoolName: 'राजकीय बुनियादी विद्यालय, हिरणपुर (पाकुड़)',
    district: 'Pakur',
    block: 'Hiranpur',
    grade: 'Class 2',
    language: 'santali',
    mode: 'teacher',
    sourceText: 'ध्यान से सुनो और लिखो।',
    translatedText: 'ᱟᱧᱡᱚᱢ ᱢᱮ ᱟᱨ ᱚᱞ ᱢᱮ᱾',
    confidence: 'verified',
    source: 'phrasebook'
  },

  // School 4: कस्तूरबा गांधी बालिका विद्यालय, तोरपा (खूंटी) - Teacher: Birsa Munda
  {
    id: 'tel_init_14',
    timestamp: new Date(Date.now() - 3600000 * 0.3).toISOString(),
    teacherId: 'EVV-JH-654312',
    teacherName: 'Birsa Munda',
    schoolName: 'कस्तूरबा गांधी बालिका विद्यालय, तोरपा (खूंटी)',
    district: 'Khunti',
    block: 'Torpa',
    grade: 'Class 3',
    language: 'mundari',
    mode: 'teacher',
    sourceText: 'आज हम जोड़ और घटाव का अभ्यास करेंगे।',
    translatedText: 'तिसिंग आबू मेसा आड़ो ओड़ो रियाः अभ्यास बू बईया।',
    confidence: 'partial',
    source: 'manual'
  },

  // School 5: राजकीय प्राथमिक विद्यालय, तमाड़ (राँची) - Teacher: Deepali Toppo
  {
    id: 'tel_init_15',
    timestamp: new Date(Date.now() - 3600000 * 0.1).toISOString(),
    teacherId: 'EVV-JH-554109',
    teacherName: 'Deepali Toppo',
    schoolName: 'राजकीय प्राथमिक विद्यालय, तमाड़ (राँची)',
    district: 'Ranchi',
    block: 'Tamar',
    grade: 'Class 1',
    language: 'mundari',
    mode: 'teacher',
    sourceText: 'कक्षा में शांति बनाए रखो।',
    translatedText: 'क्लास रे शांति बई के ताएन पे।',
    confidence: 'lexicon',
    source: 'voice'
  }
];

if (!global.__palashTelemetry) {
  global.__palashTelemetry = [...DEFAULT_BASELINE_TELEMETRY];
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const store = global.__palashTelemetry!;

  // ─── POST: Ingest batch of telemetry records ───
  if (req.method === 'POST') {
    try {
      const body = req.body;
      let rawItems: any[] = [];

      if (Array.isArray(body)) {
        rawItems = body;
      } else if (body && Array.isArray(body.items)) {
        rawItems = body.items;
      } else if (body && body.sourceText) {
        rawItems = [body];
      } else {
        return res.status(400).json({ error: 'Invalid payload: array or { items: [...] } required' });
      }

      const receivedAt = new Date().toISOString();
      const existingIds = new Set(store.map(s => s.id));
      let addedCount = 0;

      for (const item of rawItems) {
        if (!item || !item.sourceText) continue;
        const id = item.id || `tel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

        if (existingIds.has(id)) continue; // Deduplicate

        const record: TelemetryItem = {
          id,
          timestamp: item.timestamp || receivedAt,
          receivedAt,
          teacherId: String(item.teacherId || 'EVV-UNKNOWN').slice(0, 40),
          teacherName: String(item.teacherName || 'Teacher').slice(0, 80),
          schoolName: String(item.schoolName || 'राजकीय उत्क्रमित मध्य विद्यालय').slice(0, 140),
          district: String(item.district || 'Dumka').slice(0, 60),
          block: String(item.block || 'Sadar').slice(0, 60),
          grade: String(item.grade || 'Class 1').slice(0, 40),
          language: (['santali', 'ho', 'mundari'].includes(item.language) ? item.language : 'santali') as any,
          mode: (item.mode === 'student' ? 'student' : 'teacher') as any,
          sourceText: String(item.sourceText).trim().slice(0, 500),
          translatedText: String(item.translatedText || '').trim().slice(0, 500),
          confidence: (['verified', 'lexicon', 'partial'].includes(item.confidence) ? item.confidence : 'lexicon') as any,
          source: (['voice', 'manual', 'phrasebook'].includes(item.source) ? item.source : 'manual') as any,
        };

        store.unshift(record);
        existingIds.add(id);
        addedCount++;
      }

      if (store.length > 5000) {
        store.length = 5000;
      }

      console.log(`[PalashCentralHub Telemetry] Ingested ${addedCount} items. Total: ${store.length}`);

      return res.status(200).json({
        success: true,
        ingested: addedCount,
        totalInHub: store.length
      });
    } catch (err: any) {
      console.error('[PalashCentralHub Telemetry Error]', err);
      return res.status(500).json({ error: 'Internal server error: ' + err?.message });
    }
  }

  // ─── GET: Return harvested speech logs + analytical summary ───
  if (req.method === 'GET') {
    const schoolFilter = req.query?.school ? String(req.query.school).trim() : undefined;
    const teacherFilter = req.query?.teacher ? String(req.query.teacher).trim() : undefined;
    const districtFilter = req.query?.district ? String(req.query.district).trim() : undefined;
    const langFilter = req.query?.language ? String(req.query.language).trim() : undefined;
    const limit = req.query?.limit ? parseInt(String(req.query.limit), 10) : 300;

    let filtered = [...store];
    if (schoolFilter && schoolFilter !== 'all') {
      filtered = filtered.filter(f => f.schoolName.toLowerCase() === schoolFilter.toLowerCase());
    }
    if (teacherFilter && teacherFilter !== 'all') {
      filtered = filtered.filter(f => f.teacherId.toLowerCase() === teacherFilter.toLowerCase() || f.teacherName.toLowerCase() === teacherFilter.toLowerCase());
    }
    if (districtFilter && districtFilter !== 'all') {
      filtered = filtered.filter(f => f.district.toLowerCase() === districtFilter.toLowerCase());
    }
    if (langFilter && langFilter !== 'all') {
      filtered = filtered.filter(f => f.language.toLowerCase() === langFilter.toLowerCase());
    }

    // Analytics Aggregations
    const districtCounts: Record<string, number> = {};
    const langCounts: Record<string, number> = { santali: 0, ho: 0, mundari: 0 };
    const teacherSet = new Set<string>();
    let verifiedCount = 0;
    const wordFreq: Record<string, number> = {};
    const missingVocabCandidates: Array<{ word: string; count: number; sampleSentence: string }> = [];

    // Hierarchical School -> Teachers map
    const schoolMap: Record<string, {
      schoolName: string;
      district: string;
      totalSentences: number;
      teachers: Record<string, { teacherId: string; teacherName: string; grade: string; count: number }>;
    }> = {};

    const stopWords = new Set(['है', 'हैं', 'का', 'के', 'की', 'को', 'में', 'पर', 'से', 'और', 'यह', 'वह', 'आज', 'हम', 'तुम', 'करो', 'लो', 'दो', 'एक']);

    for (const item of store) {
      districtCounts[item.district] = (districtCounts[item.district] || 0) + 1;
      langCounts[item.language] = (langCounts[item.language] || 0) + 1;
      teacherSet.add(item.teacherId);
      if (item.confidence === 'verified' || item.confidence === 'lexicon') {
        verifiedCount++;
      }

      // School & Teacher hierarchical aggregation
      const sName = item.schoolName || 'राजकीय उत्क्रमित मध्य विद्यालय';
      if (!schoolMap[sName]) {
        schoolMap[sName] = {
          schoolName: sName,
          district: item.district,
          totalSentences: 0,
          teachers: {}
        };
      }
      schoolMap[sName].totalSentences++;

      const tKey = item.teacherId;
      if (!schoolMap[sName].teachers[tKey]) {
        schoolMap[sName].teachers[tKey] = {
          teacherId: item.teacherId,
          teacherName: item.teacherName,
          grade: item.grade,
          count: 0
        };
      }
      schoolMap[sName].teachers[tKey].count++;

      // Word frequency from Hindi text
      if (item.mode === 'teacher') {
        const words = item.sourceText.replace(/[।,?!.:'"“”\(\)\[\]]/g, ' ').split(/\s+/).filter(Boolean);
        for (const w of words) {
          if (w.length > 1 && !stopWords.has(w)) {
            wordFreq[w] = (wordFreq[w] || 0) + 1;
          }
        }
      }

      // Identify missing/low-confidence vocabulary
      if (item.confidence === 'partial') {
        const words = item.sourceText.replace(/[।,?!.:'"“”]/g, ' ').split(/\s+/).filter(Boolean);
        for (const w of words) {
          if (w.length > 2 && !stopWords.has(w)) {
            const existing = missingVocabCandidates.find(c => c.word === w);
            if (existing) {
              existing.count++;
            } else if (missingVocabCandidates.length < 15) {
              missingVocabCandidates.push({
                word: w,
                count: 1,
                sampleSentence: item.sourceText
              });
            }
          }
        }
      }
    }

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word, count]) => ({ word, count }));

    // Transform school map to array
    const schoolsDirectory = Object.values(schoolMap).map(s => ({
      schoolName: s.schoolName,
      district: s.district,
      totalSentences: s.totalSentences,
      teachers: Object.values(s.teachers)
    })).sort((a, b) => b.totalSentences - a.totalSentences);

    return res.status(200).json({
      total: store.length,
      filteredCount: filtered.length,
      records: filtered.slice(0, limit),
      analytics: {
        totalHarvested: store.length,
        uniqueTeachers: teacherSet.size,
        uniqueSchools: schoolsDirectory.length,
        coverageRate: store.length > 0 ? Math.round((verifiedCount / store.length) * 100) : 100,
        districtCounts,
        langCounts,
        topWords,
        missingVocabCandidates: missingVocabCandidates.sort((a, b) => b.count - a.count),
        schoolsDirectory
      }
    });
  }

  // ─── DELETE: Reset store ───
  if (req.method === 'DELETE') {
    const key = req.query?.key;
    if (key !== 'palashsetu-admin' && key !== 'palashvani-admin') {
      return res.status(403).json({ error: 'Unauthorized: admin key required' });
    }
    global.__palashTelemetry = [...DEFAULT_BASELINE_TELEMETRY];
    return res.status(200).json({ success: true, message: 'Reset to baseline telemetry' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
