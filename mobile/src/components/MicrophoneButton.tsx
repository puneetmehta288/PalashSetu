import React from 'react';
export const MicrophoneButton: React.FC<{ listening: boolean; onClick: () => void }> = ({ listening, onClick }) => (
  <button className={`mic-btn ${listening ? 'listening' : ''}`} onClick={onClick}>🎙️</button>
);
export default MicrophoneButton;
