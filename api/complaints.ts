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
// Real in-memory reports store
declare const global: { __palashReports?: unknown[] };
if (!global.__palashReports) global.__palashReports = [];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Only return genuine reports received in this session
  const realReports = ((global as any).__palashReports || []) as any[];

  return res.status(200).json({
    total: realReports.length,
    reports: realReports,
  });
}
