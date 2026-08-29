import React from 'react';
import { TeacherProfile } from '../services/authService';

interface HeaderProps {
  isOnline?: boolean;
  activeTeacher?: TeacherProfile | null;
  onSwitchTeacher?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTeacher, onSwitchTeacher, onToggleSidebar }) => {
  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.65rem 1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {/* Left: Mobile Hamburger + App Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Hamburger button for mobile */}
          <button
            onClick={onToggleSidebar}
            className="mobile-hamburger-btn"
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#0f2744',
            }}
          >
            ☰
          </button>

          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2744', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🌿 PalashSetu</span>
              <span style={{ fontSize: '0.8rem', color: '#c05621', fontWeight: 700 }}>(पलाश सेतु)</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
              Govt. of Jharkhand • PALASH MTB-MLE (SIH 26042)
            </div>
          </div>
        </div>

        {/* Center: Language Selector & Active AI Model Badge (Hidden on very small screens or responsive) */}
        <div className="header-meta-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Target Language Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Language:</span>
            <select
              defaultValue="sat_Olck"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0f2744',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="sat_Olck">🟢 Santali (Ol Chiki • ᱚᱞ ᱪᱤᱠᱤ)</option>
              <option value="ho_Wara" disabled>🔒 Ho (Warang Citi) - Soon</option>
              <option value="unx_Deva" disabled>🔒 Mundari - Soon</option>
            </select>
          </div>

          {/* Active AI Translation Model Indicator */}
          <div
            className="header-model-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ebf8ff',
              border: '1px solid #bee3f8',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              color: '#2b6cb0',
              fontWeight: 700,
            }}
          >
            <span>🤖 AI4Bharat IndicTrans2 320M</span>
          </div>
        </div>

        {/* Right: Active Teacher Badge & Switch Teacher */}
        {activeTeacher && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f2744' }}>
                Johar, {activeTeacher.name}!
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {activeTeacher.assignedGrade} • {activeTeacher.district}
              </div>
            </div>

            <button
              onClick={onSwitchTeacher}
              style={{
                backgroundColor: '#edf2f7',
                border: '1px solid #cbd5e0',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              🔄 Switch
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
