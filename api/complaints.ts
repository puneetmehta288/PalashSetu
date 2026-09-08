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

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const adminKey = process.env.ADMIN_KEY || 'palashsetu-admin';
  const provided  = String(req.query.key || '');

  if (provided !== adminKey) {
    return res.status(401).json({ error: 'Unauthorised. Wrong admin key.' });
  }

  const allReports = [
    ...DEMO_REPORTS,
    ...(global.__palashReports || []),
  ];

  return res.status(200).json({
    total:   allReports.length,
    reports: allReports,
  });
}
