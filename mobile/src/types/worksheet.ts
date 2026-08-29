export interface Question { qHindi: string; qSantali: string; ans: string; }
export interface Worksheet { id: string; title: string; questions: Question[]; }
export interface WorksheetGenerateRequest { topic: string; difficulty: string; count: number; }
