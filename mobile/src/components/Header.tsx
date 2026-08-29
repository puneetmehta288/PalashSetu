import React from 'react';
import { TeacherProfile } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  isOnline?: boolean;
  activeTeacher?: TeacherProfile | null;
  onSwitchTeacher?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTeacher, onSwitchTeacher, onToggleSidebar }) => {
  const { isDarkMode, toggleDarkMode, isSfxEnabled, toggleSfx } = useTheme();

  return (
    <header
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`,
        padding: '0.65rem 1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
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
              backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
              border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: isDarkMode ? '#f8fafc' : '#0f2744',
            }}
          >
            ☰
          </button>

          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🌿 PalashSetu</span>
              <span style={{ fontSize: '0.8rem', color: '#ed8936', fontWeight: 700 }}>(पलाश सेतु)</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
              Govt. of Jharkhand • PALASH MTB-MLE (SIH 26042)
            </div>
          </div>
        </div>

        {/* Center/Right: Action Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Language Selector */}
          <div className="header-meta-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              defaultValue="sat_Olck"
              style={{
                padding: '5px 8px',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e0'}`,
                fontSize: '0.8rem',
                fontWeight: 700,
                color: isDarkMode ? '#f8fafc' : '#0f2744',
                backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="sat_Olck">🟢 Santali (Ol Chiki • ᱚᱞ ᱪᱤᱠᱤ)</option>
              <option value="ho_Wara" disabled>🔒 Ho (Warang Citi) - Soon</option>
              <option value="unx_Deva" disabled>🔒 Mundari - Soon</option>
            </select>
          </div>

          {/* Sound Effects Toggle Button */}
          <button
            onClick={toggleSfx}
            title={isSfxEnabled ? 'Sound Effects Enabled (Click to mute)' : 'Sound Effects Muted (Click to enable)'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isSfxEnabled ? (isDarkMode ? '#14532d' : '#dcfce7') : (isDarkMode ? '#1e293b' : '#f1f5f9'),
              border: `1px solid ${isSfxEnabled ? '#86efac' : (isDarkMode ? '#334155' : '#cbd5e1')}`,
              padding: '6px 10px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: isSfxEnabled ? (isDarkMode ? '#86efac' : '#166534') : (isDarkMode ? '#94a3b8' : '#64748b'),
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isSfxEnabled ? '🔊 SFX' : '🔇 Mute'}</span>
          </button>



          {/* Active Teacher Badge & Switch Teacher */}
          {activeTeacher && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                  {activeTeacher.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  {activeTeacher.assignedGrade}
                </div>
              </div>

              <button
                onClick={onSwitchTeacher}
                style={{
                  backgroundColor: isDarkMode ? '#1e293b' : '#edf2f7',
                  border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e0'}`,
                  padding: '5px 9px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isDarkMode ? '#f8fafc' : '#334155',
                  cursor: 'pointer',
                }}
              >
                🔄 Switch
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
