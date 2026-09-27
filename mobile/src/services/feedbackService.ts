/**
 * feedbackService.ts
 * Manages teacher complaint reports.
 * - Saves offline to Capacitor Preferences queue
 * - Auto-syncs to Vercel API when internet is available
 */

import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';

const QUEUE_KEY = 'palashvani_feedback_queue';

// Absolute Vercel URL — points to the live Vercel deployment
const SYNC_ENDPOINT = 'https://palashsetu-xi.vercel.app/api/feedback';

export interface FeedbackReport {
  id: string;
  timestamp: string;
  teacherName: string;
  district: string;
  assignedGrade: string;
  issueType: 'wrong_translation' | 'missing_word' | 'audio_issue' | 'other';
  sourceWord: string;
  description: string;
  screenshot?: string;
  appVersion: string;
  sent: boolean;
}

// ── Helper to mirror queue to localStorage ─────────────────────────────────────
function mirrorToLocalStorage(queue: FeedbackReport[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (_) {
    // Ignore storage quota or security errors in strict web contexts
  }
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
  mirrorToLocalStorage(queue);
}

// ── Get all unsent reports ────────────────────────────────────────────────────
export async function getPendingFeedback(): Promise<FeedbackReport[]> {
  let value: string | null = null;
  try {
    const prefResult = await Preferences.get({ key: QUEUE_KEY });
    value = prefResult.value;
  } catch (_) {}

  if (!value) {
    try {
      const legacy = await Preferences.get({ key: 'palashsetu_feedback_queue' });
      value = legacy.value;
    } catch (_) {}
  }

  // Web localStorage fallback
  if (!value && typeof window !== 'undefined' && window.localStorage) {
    value = window.localStorage.getItem(QUEUE_KEY) || window.localStorage.getItem('palashsetu_feedback_queue');
  }

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
      let res: Response | null = await fetch(SYNC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      }).catch(() => null);

      // Relative path fallback for web deployments / localhost testing
      if ((!res || !res.ok) && typeof window !== 'undefined') {
        res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        }).catch(() => null);
      }

      if (res && res.ok) {
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
  mirrorToLocalStorage(queue);
  return { sent: sentCount, failed: failedCount };
}

// ── Alias for clarity ────────────────────────────────────────────────────────
export const getAllReports = getPendingFeedback;

// ── Check network and auto-sync if online ─────────────────────────────────────
export async function checkAndSync(): Promise<{ sent: number; failed: number }> {
  try {
    const isOnline = navigator.onLine || (await Network.getStatus().then(s => s.connected).catch(() => true));
    if (isOnline) {
      return await syncFeedback();
    }
  } catch {
    // Silently handle
  }
  return { sent: 0, failed: 0 };
}

// ── Clear all sent reports (housekeeping) ─────────────────────────────────────
export async function clearSentReports(): Promise<void> {
  const queue = await getPendingFeedback();
  const unsent = queue.filter((r) => !r.sent);
  await Preferences.set({ key: QUEUE_KEY, value: JSON.stringify(unsent) });
  mirrorToLocalStorage(unsent);
}

