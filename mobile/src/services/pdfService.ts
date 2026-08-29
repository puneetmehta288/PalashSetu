import { api } from './api';
export const localizePDF = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.fetch('/api/v1/pdf', { method: 'POST', body: formData });
};
