import { api } from './api';
export const generateWorksheet = async (data: any) => api.fetch('/api/v1/worksheets', { method: 'POST', body: JSON.stringify(data) });
