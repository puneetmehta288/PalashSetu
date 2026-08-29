import React from 'react';
export const QuestionCard: React.FC<{ qHindi: string; qSantali: string; ans: string }> = ({ qHindi, qSantali, ans }) => (
  <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem' }}>
    <p className="hindi-text"><strong>Q:</strong> {qHindi}</p>
    <p className="santali-text"><strong>Q:</strong> {qSantali}</p>
    <p><strong>A:</strong> {ans}</p>
  </div>
);
export default QuestionCard;
