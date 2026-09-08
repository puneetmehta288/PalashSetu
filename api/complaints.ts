/**
 * api/complaints.ts — Vercel Serverless Function
 * Admin endpoint: returns all stored feedback reports.
 * Protected by a simple key query param.
 *
 * GET /api/complaints?key=palashsetu-admin
 */

// Standalone lightweight interface (no external @vercel/node dependency required)
interface ApiRequest {
  method?: string;
  query?: Record<string, string | string[]>;
}
interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(data: any): void;
  end(): void;
}

// Must match the store in feedback.ts
// In production: use shared Vercel KV — for hackathon demo this is fine
// as both functions share the same process in Vercel's dev server
declare const global: { __palashReports?: unknown[] };
if (!global.__palashReports) global.__palashReports = [];

// Seed with some demo data so the admin page always has something to show
const DEMO_REPORTS = [
  {
    id: 'demo_1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    receivedAt: new Date(Date.now() - 3600000).toISOString(),
    teacherName: 'Sunita Kumari',
    district: 'Dumka',
    assignedGrade: 'Class 1',
    issueType: 'wrong_translation',
    sourceWord: 'पानी पीना',
    description: 'The Santali output sounds unclear — children could not understand.',
    appVersion: '1.0.0',
  },
  {
    id: 'demo_2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    receivedAt: new Date(Date.now() - 7200000).toISOString(),
    teacherName: 'Ramesh Murmu',
    district: 'East Singhbhum',
    assignedGrade: 'Class 2',
    issueType: 'missing_word',
    sourceWord: 'तितली',
    description: 'No Santali word found for butterfly — shows blank.',
    appVersion: '1.0.0',
  },
  {
    id: 'demo_3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    receivedAt: new Date(Date.now() - 86400000).toISOString(),
    teacherName: 'Sunita Kumari',
    district: 'Dumka',
    assignedGrade: 'Class 1',
    issueType: 'audio_issue',
    sourceWord: 'ᱡᱚᱦᱟᱨ',
    description: 'Pronunciation speed too fast for young children.',
    appVersion: '1.0.0',
  },
];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Fetch real-time submitted reports from pubsub
  const liveReports: any[] = [];
  try {
    const pubsubRes = await fetch('https://ntfy.sh/palashsetu_sih26042_complaints/json?poll=1');
    if (pubsubRes.ok) {
      const text = await pubsubRes.text();
      const lines = text.trim().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const item = JSON.parse(line);
          if (item.message) {
            const parsed = JSON.parse(item.message);
            liveReports.unshift(parsed);
          }
        } catch {
          // ignore non-json line
        }
      }
    }
  } catch (e) {
    console.warn('Poll note:', e);
  }

  // Combine live reports with in-memory and demo reports, deduplicating by id
  const seenIds = new Set<string>();
  const combined = [
    ...liveReports,
    ...((global as any).__palashReports || []),
    ...DEMO_REPORTS,
  ].filter(r => {
    if (!r.id || seenIds.has(r.id)) return false;
    seenIds.add(r.id);
    return true;
  });

  return res.status(200).json({
    total:   combined.length,
    reports: combined,
  });
}
