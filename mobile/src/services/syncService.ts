import { api } from './api';
export const syncData = async (data: any) => api.fetch('/api/v1/sync', { method: 'POST', body: JSON.stringify(data) });
