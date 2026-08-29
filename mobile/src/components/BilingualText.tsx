import React from 'react';
export const BilingualText: React.FC<{ hindi: string; santali: string }> = ({ hindi, santali }) => (
  <div>
    <p className="hindi-text">{hindi}</p>
    <p className="santali-text">{santali}</p>
  </div>
);
export default BilingualText;
