import React from 'react';
export const ContentCard: React.FC<{ title: string; type: string }> = ({ title, type }) => (
  <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
    <h3>{title}</h3><p>{type}</p>
  </div>
);
export default ContentCard;
