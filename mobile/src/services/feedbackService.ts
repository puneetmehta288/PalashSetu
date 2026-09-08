/**
 * feedbackService.ts
 * Manages teacher complaint reports.
 * - Saves offline to Capacitor Preferences queue
 * - Auto-syncs to Vercel API when internet is available
 */

import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';

const QUEUE_KEY = 'palashsetu_feedback_queue';

// Absolute Vercel URL — works from Android APK on any network
const SYNC_ENDPOINT = 'https://palash-setu.vercel.app/api/feedback';

export interface FeedbackReport {
  id: string;
  timestamp: string;
  teacherName: string;
  district: string;
  assignedGrade: string;
  issueType: 'wrong_translation' | 'missing_word' | 'audio_issue' | 'other';
  sourceWord: string;
  description: string;
  appVersion: string;
  sent: boolean;
}

// ── Save a new report to local queue ──────────────────────────────────────────
export async function saveFeedbackLocally(
  report: Omit<FeedbackReport, 'id' | 'timestamp' | 'appVersion' | 'sent'>
): Promise<void> {
  const queue = await getPendingFeedback();
  const newReport: FeedbackReport = {
    ...report,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    appVersion: '1.0.0',
    sent: false,
  };
  queue.push(newReport);
  await Preferences.set({ key: QUEUE_KEY, value: JSON.stringify(queue) });
}

// ── Get all unsent reports ────────────────────────────────────────────────────
export async function getPendingFeedback(): Promise<FeedbackReport[]> {
  const { value } = await Preferences.get({ key: QUEUE_KEY });
  if (!value) return [];
  try {
    return JSON.parse(value) as FeedbackReport[];
  } catch {
    return [];
  }
}

// ── Count unsent reports (for Settings badge) ─────────────────────────────────
export async function getPendingCount(): Promise<number> {
  const queue = await getPendingFeedback();
  return queue.filter((r) => !r.sent).length;
}

// ── Send pending reports when online ─────────────────────────────────────────
export async function syncFeedback(): Promise<{ sent: number; failed: number }> {
  const queue = await getPendingFeedback();
  const unsent = queue.filter((r) => !r.sent);
  if (unsent.length === 0) return { sent: 0, failed: 0 };

  let sentCount = 0;
  let failedCount = 0;

  for (const report of unsent) {
    try {
      const res = await fetch(SYNC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (res.ok) {
        report.sent = true;
        sentCount++;
      } else {
        failedCount++;
      }
    } catch {
      failedCount++;
    }
  }

  // Update queue with sent flags
  await Preferences.set({ key: QUEUE_KEY, value: JSON.stringify(queue) });
  return { sent: sentCount, failed: failedCount };
}

// ── Check network and auto-sync if online ─────────────────────────────────────
export async function checkAndSync(): Promise<void> {
  try {
    const status = await Network.getStatus();
    if (status.connected) {
      await syncFeedback();
    }
  } catch {
    // Silently fail — offline is fine
  }
}

// ── Clear all sent reports (housekeeping) ─────────────────────────────────────
export async function clearSentReports(): Promise<void> {
  const queue = await getPendingFeedback();
  const unsent = queue.filter((r) => !r.sent);
  await Preferences.set({ key: QUEUE_KEY, value: JSON.stringify(unsent) });
}
