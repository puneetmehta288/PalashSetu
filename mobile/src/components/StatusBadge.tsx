import React from 'react';
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#e2e8f0' }}>{status}</span>
);
export default StatusBadge;
