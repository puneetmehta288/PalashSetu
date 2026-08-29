import React from 'react';
export const AudioPlayer: React.FC<{ url: string }> = ({ url }) => (
  <button style={{ background: '#e2e8f0', borderRadius: '50%', width: '40px', height: '40px' }}>▶️</button>
);
export default AudioPlayer;
