import { api } from './api';
export const generateFlashcards = async (data: any) => api.fetch('/api/v1/flashcards', { method: 'POST', body: JSON.stringify(data) });
