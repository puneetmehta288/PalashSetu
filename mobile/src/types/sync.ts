export type SyncStatus = 'synced' | 'syncing' | 'needs_update' | 'not_synced';
export interface SyncManifest { lastSynced: string; items: string[]; }
