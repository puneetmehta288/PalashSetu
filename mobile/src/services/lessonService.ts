import { api } from './api';
export const generateLesson = async (data: any) => api.fetch('/api/v1/lessons', { method: 'POST', body: JSON.stringify(data) });
