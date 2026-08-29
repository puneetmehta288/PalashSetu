import React from 'react';
export const FlashcardComponent: React.FC<{ hindi: string; santali: string }> = ({ hindi, santali }) => (
  <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '12px', textAlign: 'center' }}>
    <h2 className="hindi-text">{hindi}</h2>
    <h2 className="santali-text">{santali}</h2>
  </div>
);
export default FlashcardComponent;
