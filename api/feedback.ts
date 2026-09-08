/**
 * api/feedback.ts — Vercel Serverless Function
 * Receives teacher feedback reports from the tablet app.
 * Stores them in a simple JSON log (Vercel KV or in-memory for demo).
 *
 * POST /api/feedback
 * Body: FeedbackReport JSON
 */

// Standalone lightweight interface (no external @vercel/node dependency required)
interface ApiRequest {
  method?: string;
  body?: any;
}
interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(data: any): void;
  end(): void;
}

// In-memory store (persists per function instance — fine for hackathon demo)
// For production: replace with Vercel KV or a database
const reportsStore: unknown[] = [];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const report = req.body;

    if (!report || !report.sourceWord || !report.issueType) {
      return res.status(400).json({ error: 'Missing required fields: sourceWord, issueType' });
    }

    // Validate issue type
    const validTypes = ['wrong_translation', 'missing_word', 'audio_issue', 'other'];
    if (!validTypes.includes(report.issueType)) {
      return res.status(400).json({ error: 'Invalid issueType' });
    }

    // Sanitise
    const sanitised = {
      id:            report.id            || `fb_${Date.now()}`,
      timestamp:     report.timestamp     || new Date().toISOString(),
      receivedAt:    new Date().toISOString(),
      teacherName:   String(report.teacherName   || 'Unknown').slice(0, 80),
      district:      String(report.district      || 'Unknown').slice(0, 80),
      assignedGrade: String(report.assignedGrade || 'Unknown').slice(0, 40),
      issueType:     report.issueType,
      sourceWord:    String(report.sourceWord    || '').slice(0, 200),
      description:   String(report.description   || '').slice(0, 500),
      screenshot:    report.screenshot ? String(report.screenshot) : undefined,
      appVersion:    String(report.appVersion    || '1.0.0').slice(0, 20),
    };

    reportsStore.push(sanitised);
    if (!((global as any).__palashReports)) (global as any).__palashReports = [];
    (global as any).__palashReports.unshift(sanitised);

    // Persist across serverless containers via pub-sub
    try {
      await fetch('https://ntfy.sh/palashsetu_sih26042_complaints', {
        method: 'POST',
        headers: {
          'Title': `${sanitised.teacherName} (${sanitised.district}) - ${sanitised.issueType}`,
          'Priority': 'default'
        },
        body: JSON.stringify(sanitised)
      });
    } catch (e) {
      console.warn('Pubsub persist note:', e);
    }

    console.log('[PalashSetu Feedback Received]', JSON.stringify({ ...sanitised, screenshot: sanitised.screenshot ? '[IMAGE]' : undefined }));

    return res.status(200).json({ success: true, id: sanitised.id });
  } catch (err) {
    console.error('[PalashSetu Feedback Error]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
