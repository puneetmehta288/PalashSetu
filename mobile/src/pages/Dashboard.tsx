import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';
import { getActiveTribalLanguage, adaptDashboardMetadata } from '../services/tribalCurriculumAdapter';
import { TribalLanguage } from '../types';

interface DashboardProps {
  activeTeacher?: TeacherProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTeacher }) => {
  const [tribalLang, setTribalLang] = useState<TribalLanguage>(getActiveTribalLanguage);

  useEffect(() => {
    const onLangChanged = (e: any) => {
      const detail = e.detail || localStorage.getItem('palash_selected_language');
      if (detail === 'hoc_Deva' || detail === 'ho') setTribalLang('ho');
      else if (detail === 'unr_Deva' || detail === 'unx_Deva' || detail === 'mundari') setTribalLang('mundari');
      else setTribalLang('santali');
    };
    window.addEventListener('palash_language_changed', onLangChanged);
    return () => window.removeEventListener('palash_language_changed', onLangChanged);
  }, []);

  const handleLanguageSelect = (lang: TribalLanguage) => {
    sfx.playTap();
    setTribalLang(lang);
    const code = lang === 'ho' ? 'hoc_Deva' : lang === 'mundari' ? 'unr_Deva' : 'sat_Olck';
    localStorage.setItem('palash_selected_language', code);
    window.dispatchEvent(new CustomEvent('palash_language_changed', { detail: code }));
  };

  const meta = adaptDashboardMetadata(tribalLang);
  const teacherName = activeTeacher?.name || 'Sunita Kumari';
  const assignedGrade = activeTeacher?.assignedGrade || 'Class 1';
  const district = activeTeacher?.district || (tribalLang === 'ho' ? 'West Singhbhum' : tribalLang === 'mundari' ? 'Khunti' : 'Dumka');

  const dashboardActions = [
    {
      to: '/translate',
      icon: '🎙️',
      title: 'Live Voice Translation',
      tribal: meta.voiceTitle,
      desc: meta.voiceDesc,
      badge: tribalLang === 'ho' ? 'Ho Kolhan NLP' : tribalLang === 'mundari' ? 'Mundari NLP' : 'Offline 4-Tier NLP',
      color: '#ed8936',
    },
    {
      to: '/flashcards',
      icon: '🃏',
      title: 'Visual Flashcards',
      tribal: meta.cardsTitle,
      desc: meta.cardsDesc,
      badge: tribalLang === 'ho' ? 'Ho SVG Decks' : tribalLang === 'mundari' ? 'Mundari Decks' : '30+ SVG Decks',
      color: '#38a169',
    },
    {
      to: '/lessons',
      icon: '📚',
      title: 'Lesson Studio',
      tribal: meta.lessonsTitle,
      desc: meta.lessonsDesc,
      badge: tribalLang === 'ho' ? 'Ho NIPUN Aligned' : tribalLang === 'mundari' ? 'Mundari Aligned' : 'NIPUN Aligned',
      color: '#3182ce',
    },
    {
      to: '/worksheets',
      icon: '📝',
      title: 'Worksheet Generator',
      tribal: meta.worksheetsTitle,
      desc: meta.worksheetsDesc,
      badge: 'Print PDF',
      color: '#805ad5',
    },
    {
      to: '/books',
      icon: '📖',
      title: 'JCERT Bilingual Books',
      tribal: meta.booksTitle,
      desc: meta.booksDesc,
      badge: 'JCERT State Books',
      color: '#0d9488',
    },
    {
      to: '/attendance',
      icon: '📋',
      title: 'Daily Attendance Register',
      tribal: 'दैनिक उपस्थिति पंजी / ᱦᱟᱡᱤᱨᱟ',
      desc: 'Mark daily attendance, manage classes & tribal cohort statistics',
      badge: 'Daily Register',
      color: '#0284c7',
    },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2744 0%, #1a365d 60%, #2b4c7e 100%)',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          color: '#ffffff',
          boxShadow: '0 12px 30px -6px rgba(15, 39, 68, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(237,137,54,0.3) 0%, rgba(237,137,54,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: '#fbd38d', marginBottom: '0.6rem' }}>
              <span>🌿 PalashSetu</span>
              <span>•</span>
              <span>{assignedGrade} ({district})</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.5px' }}>
              {meta.greeting}, {teacherName}!
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>
              {meta.subGreeting}
            </p>
          </div>

          {/* Quick Language Toggle Pills on Hero Banner */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.25)', padding: '6px 10px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)' }}>
            {(['santali', 'ho', 'mundari'] as TribalLanguage[]).map(lang => {
              const isSel = tribalLang === lang;
              const label = lang === 'santali' ? '🟢 Santali (ᱚᱞ ᱪᱤᱠᱤ)' : lang === 'ho' ? '🔵 Ho (ᱦᱳ / Kolhan)' : '🟣 Mundari (मुंडारी)';
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  style={{
                    backgroundColor: isSel ? '#ed8936' : 'transparent',
                    color: '#ffffff',
                    border: isSel ? '1px solid #fbd38d' : 'none',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              🚀 Classroom Pedagogy & Translation Suite
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Select a module to conduct interactive classroom sessions or prepare bilingual curriculum in {tribalLang === 'ho' ? 'Ho (Kolhan Division)' : tribalLang === 'mundari' ? 'Mundari (Chotanagpur)' : 'Santali (Santhal Pargana)'}.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {dashboardActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              onClick={() => sfx.playTap()}
              style={{
                textDecoration: 'none',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: `${action.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                  }}
                >
                  {action.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--surface-bg)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {action.badge}
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {action.title}
                  </h3>
                </div>
                <div style={{ fontSize: '0.92rem', color: action.color, fontWeight: 700, marginBottom: '6px', fontFamily: tribalLang === 'santali' ? 'Noto Sans Ol Chiki, sans-serif' : 'inherit' }}>
                  {action.tribal}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  {action.desc}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: action.color }}>
                <span>Launch Tool</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
