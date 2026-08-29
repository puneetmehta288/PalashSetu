import { api } from './api';
export const localizeVideo = async (data: any) => api.fetch('/api/v1/video', { method: 'POST', body: JSON.stringify(data) });
