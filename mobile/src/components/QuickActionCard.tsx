import React from 'react';
export const QuickActionCard: React.FC<{ icon: string; title: string; onClick?: () => void }> = ({ icon, title, onClick }) => (
  <button className="action-card" onClick={onClick}>
    <span className="action-icon">{icon}</span>
    <span className="action-title">{title}</span>
  </button>
);
export default QuickActionCard;
