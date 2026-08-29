export interface UserSettings {
  teacherName: string;
  className: string;
  backendUrl: string;
}

export interface ContentItem {
  id: string;
  type: 'lesson' | 'worksheet' | 'pdf' | 'video' | 'flashcard';
  title: string;
  topic: string;
  grade: string;
  isOffline: boolean;
  syncStatus: 'synced' | 'syncing' | 'needs_update' | 'not_synced';
}
