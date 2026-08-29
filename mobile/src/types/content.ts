export type ContentType = 'lesson' | 'worksheet' | 'pdf' | 'video' | 'flashcard';
export interface ContentItem { id: string; type: ContentType; title: string; }
