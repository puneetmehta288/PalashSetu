/**
 * api/complaints.ts — Vercel Serverless Function
 * Receives teacher feedback reports from rural tablets and serves them to CentralHub.
 * Identical persistent handler matching api/feedback.ts.
 *
 * POST /api/complaints -> Ingest new teacher report
 * GET  /api/complaints -> Return all stored reports (with baseline seeds)
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

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

const TMP_FILE = path.join(os.tmpdir(), 'palash_reports.json');

const DEFAULT_SEED_REPORTS = [
  {
    id: 'fb_seed_01',
    timestamp: new Date(Date.now() - 3600000 * 4.2).toISOString(),
    receivedAt: new Date(Date.now() - 3600000 * 4.2).toISOString(),
    teacherName: 'Sunita Kumari',
    district: 'Dumka',
    assignedGrade: 'Class 1',
    issueType: 'missing_word',
    sourceWord: 'खरगोश',
    description: 'कक्षा 1 के बच्चों को कहानी सुनाते समय "खरगोश" का संथाली अनुवाद पूछा गया। कृपया शब्दकोश में "ᱠᱩᱞᱟᱹᱭ" (Kulai) को प्राथमिकता दें।',
    appVersion: '1.0.0'
  },
  {
    id: 'fb_seed_02',
    timestamp: new Date(Date.now() - 3600000 * 11.5).toISOString(),
    receivedAt: new Date(Date.now() - 3600000 * 11.5).toISOString(),
    teacherName: 'Manoj Marandi',
    district: 'Pakur',
    assignedGrade: 'Class 2',
    issueType: 'audio_issue',
    sourceWord: 'संख्या 1 से 10',
    description: 'ऑडियो प्लेबैक बहुत उपयोगी है, लेकिन कक्षा के शोर में संथाली उच्चारण की गति थोड़ी धीमी (0.85x) करने का विकल्प बहुत मददगार रहेगा।',
    appVersion: '1.0.0'
  },
  {
    id: 'fb_seed_03',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    receivedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    teacherName: 'Anil Hembram',
    district: 'East Singhbhum',
    assignedGrade: 'Class 1',
    issueType: 'wrong_translation',
    sourceWord: 'किताब खोलो',
    description: 'वाक्य "किताब खोलो" का संथाली अनुवाद "ᱯᱚᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ" (Pothi jhij me) बहुत सटीक है, छात्रों को तुरंत समझ आया।',
    appVersion: '1.0.0'
  }
];

function loadReports(): any[] {
  // 1. Try reading from /tmp file
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Complaints API] Could not read /tmp file:', e);
  }

  // 2. Memory fallback
  if ((global as any).__palashReports && Array.isArray((global as any).__palashReports) && (global as any).__palashReports.length > 0) {
    return (global as any).__palashReports;
  }

  // 3. Return defaults
  const seeded = [...DEFAULT_SEED_REPORTS];
  (global as any).__palashReports = seeded;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(seeded), 'utf-8');
  } catch (e) {}
  return seeded;
}

function saveReports(reports: any[]): void {
  (global as any).__palashReports = reports;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(reports), 'utf-8');
  } catch (e) {
    console.warn('[Complaints API] Could not write /tmp file:', e);
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET: Return all stored complaints / feedback ───
  if (req.method === 'GET') {
    const reports = loadReports();
    return res.status(200).json({
      total: reports.length,
      reports
    });
  }

  // ─── POST: Ingest new report from tablet application ───
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body) {
        return res.status(400).json({ error: 'Missing request body' });
      }

      const validTypes = ['wrong_translation', 'missing_word', 'audio_issue', 'other'];
      const issueType = validTypes.includes(body.issueType) ? body.issueType : 'other';

      const sanitised = {
        id: body.id || `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: body.timestamp || new Date().toISOString(),
        receivedAt: new Date().toISOString(),
        teacherName: String(body.teacherName || 'Primary Teacher').slice(0, 100),
        district: String(body.district || 'Dumka').slice(0, 80),
        assignedGrade: String(body.assignedGrade || 'Class 1').slice(0, 40),
        issueType,
        sourceWord: String(body.sourceWord || 'General Feedback').slice(0, 200),
        description: String(body.description || '').slice(0, 1000),
        screenshot: body.screenshot ? String(body.screenshot) : undefined,
        appVersion: String(body.appVersion || '1.0.0').slice(0, 20),
      };

      const current = loadReports();
      current.unshift(sanitised);
      if (current.length > 500) current.length = 500;
      saveReports(current);

      console.log('[PalashCentralHub Complaint Ingested]', sanitised.id, sanitised.teacherName, sanitised.sourceWord);

      return res.status(200).json({
        success: true,
        id: sanitised.id,
        total: current.length
      });
    } catch (err: any) {
      console.error('[Complaints API Error]', err);
      return res.status(500).json({ error: 'Internal server error: ' + (err?.message || '') });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
