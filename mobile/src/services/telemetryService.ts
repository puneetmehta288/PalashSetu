/**
 * telemetryService.ts — Offline Store-and-Forward Classroom Telemetry
 * 
 * Records classroom translations locally (Hindi & Tribal phrases) on rural tablets.
 * When online or synced via Settings, pushes the batch to PalashCentralHub
 * (https://palashsetu-xi.vercel.app/api/telemetry).
 * 
 * Once successfully sent, transmitted items are purged locally to prevent duplicate transmissions.
 */

import { authService } from './authService';

export interface TelemetryRecord {
  id: string;
  timestamp: string; // ISO string
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
  sent: boolean;
}

const STORAGE_KEY_QUEUE = 'palash_telemetry_queue_v1';
const STORAGE_KEY_AUTO_SYNC = 'palash_telemetry_auto_sync';
const STORAGE_KEY_LAST_SYNC = 'palash_telemetry_last_sync';

// Cloud endpoint on PalashCentralHub Vercel deployment
const HUB_ENDPOINT = 'https://palashsetu-xi.vercel.app/api/telemetry';

export const telemetryService = {
  /**
   * Log a classroom translation into local offline queue.
   */
  logSentence(params: {
    sourceText: string;
    translatedText: string;
    language: 'santali' | 'ho' | 'mundari';
    mode: 'teacher' | 'student';
    confidence?: 'verified' | 'lexicon' | 'partial';
    source?: 'voice' | 'manual' | 'phrasebook';
  }): TelemetryRecord | null {
    const cleanSource = (params.sourceText || '').trim();
    if (!cleanSource || cleanSource.length < 2) return null;

    const teacher = authService.getActiveProfile();
    const storedSchool = localStorage.getItem('palash_school_name') || 'राजकीय उत्क्रमित मध्य विद्यालय, काठीकुंड';
    const record: TelemetryRecord = {
      id: `tel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      teacherId: teacher?.teacherId || 'EVV-DEMO-01',
      teacherName: teacher?.name || 'Classroom Teacher',
      schoolName: storedSchool,
      district: teacher?.district || 'Dumka',
      block: teacher?.block || 'Kathikund',
      grade: teacher?.assignedGrade || 'Class 1',
      language: params.language,
      mode: params.mode,
      sourceText: cleanSource,
      translatedText: (params.translatedText || '').trim(),
      confidence: params.confidence || 'lexicon',
      source: params.source || 'manual',
      sent: false,
    };

    const queue = this.getQueue();
    // Prepend newest first; keep up to 1500 items max to conserve disk
    queue.unshift(record);
    if (queue.length > 1500) {
      queue.length = 1500;
    }
    this.saveQueue(queue);

    // If auto-sync is enabled and online, attempt a quiet push
    if (this.isAutoSyncEnabled() && navigator.onLine) {
      this.pushTelemetryToHub().catch(() => {});
    }

    return record;
  },

  /**
   * Get all queued records from localStorage.
   */
  getQueue(): TelemetryRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUEUE);
      if (!raw) return [];
      return JSON.parse(raw) as TelemetryRecord[];
    } catch {
      return [];
    }
  },

  /**
   * Save queue to localStorage.
   */
  saveQueue(queue: TelemetryRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('[Telemetry] Storage quota exceeded, trimming queue', e);
      if (queue.length > 200) {
        localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue.slice(0, 200)));
      }
    }
  },

  /**
   * Return number of pending (unsent) records.
   */
  getPendingCount(): number {
    return this.getQueue().filter((r) => !r.sent).length;
  },

  /**
   * Push all pending classroom records to PalashCentralHub.
   * On HTTP 200 success, sent items are deleted so they are NEVER re-sent.
   */
  async pushTelemetryToHub(): Promise<{ success: boolean; pushedCount: number; error?: string }> {
    const queue = this.getQueue();
    const unsent = queue.filter((r) => !r.sent);

    if (unsent.length === 0) {
      return { success: true, pushedCount: 0 };
    }

    try {
      const payload = {
        batchId: `batch_${Date.now()}`,
        items: unsent,
      };

      const res = await fetch(HUB_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Hub returned HTTP ${res.status}`);
      }

      // Success! Mark/purge transmitted items so duplicates never happen
      const sentIds = new Set(unsent.map((u) => u.id));
      const remaining = queue.filter((item) => !sentIds.has(item.id));
      this.saveQueue(remaining);

      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);

      return { success: true, pushedCount: unsent.length };
    } catch (err: any) {
      console.warn('[Telemetry] Failed to push queue to PalashCentralHub:', err);
      return { success: false, pushedCount: 0, error: err?.message || 'Network error' };
    }
  },

  /**
   * Clear all queued records.
   */
  clearQueue(): void {
    localStorage.removeItem(STORAGE_KEY_QUEUE);
  },

  /**
   * Last sync timestamp string.
   */
  getLastSyncTime(): string | null {
    return localStorage.getItem(STORAGE_KEY_LAST_SYNC);
  },

  /**
   * Auto-sync preference toggle.
   */
  isAutoSyncEnabled(): boolean {
    const val = localStorage.getItem(STORAGE_KEY_AUTO_SYNC);
    return val === null ? true : val === 'true'; // Default enabled
  },

  setAutoSyncEnabled(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEY_AUTO_SYNC, enabled ? 'true' : 'false');
  },

  /**
   * Export local telemetry queue as a JSON file (for offline manual officer audits).
   */
  exportToJSON(): string {
    return JSON.stringify(this.getQueue(), null, 2);
  },
};
