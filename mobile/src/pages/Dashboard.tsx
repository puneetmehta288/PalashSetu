import React from 'react';
import { Link } from 'react-router-dom';
import { TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';

interface DashboardProps {
  activeTeacher?: TeacherProfile | null;
}

const DASHBOARD_ACTIONS = [
  {
    to: '/translate',
    icon: '🎙️',
    title: 'Live Voice Translation',
    santali: 'ᱥᱟᱱᱛᱟᱲᱤ ᱨᱚᱲ',
    desc: 'Real-time Hindi ↔ Santali dialogue with sub-3s latency and native speech.',
    badge: 'Real-Time ASR',
    color: '#ed8936',
  },
  {
    to: '/flashcards',
    icon: '🃏',
    title: 'Visual Flashcards',
    santali: 'ᱪᱤᱛᱟᱹᱨ ᱠᱟᱨᱰ',
    desc: 'Interactive 3D flip cards: 30 Animals, Fruits, Body Parts, and Shapes.',
    badge: '30+ SVG Decks',
    color: '#38a169',
  },
  {
    to: '/lessons',
    icon: '📚',
    title: 'Lesson Studio',
    santali: 'ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱷᱤ',
    desc: 'Auto-generate structured 5-part NIPUN Bharat lessons with Ol Chiki scripts.',
    badge: 'NIPUN Aligned',
    color: '#3182ce',
  },
  {
    to: '/worksheets',
    icon: '📝',
    title: 'Worksheet Generator',
    santali: 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ',
    desc: 'Infinite randomized arithmetic and 10 pattern drills with printable export.',
    badge: 'Print PDF',
    color: '#805ad5',
  },
  {
    to: '/video',
    icon: '🎬',
    title: 'Video Localizer',
    santali: 'ᱵᱷᱤᱰᱤᱭᱳ ᱛᱚᱨᱡᱚᱢᱟ',
    desc: 'Universal video player with synchronized Santali subtitles and voiceover.',
    badge: 'Universal Player',
    color: '#dd6b20',
  },
  {
    to: '/pdf',
    icon: '📄',
    title: 'PDF Textbook Localizer',
    santali: 'ᱯᱤᱰᱤᱮᱯᱷ ᱛᱚᱨᱡᱚᱢᱟ',
    desc: 'Translate standard state Hindi textbook PDFs into side-by-side bilingual sheets.',
    badge: 'Side-by-Side',
    color: '#319795',
  },
  {
    to: '/library',
    icon: '📦',
    title: 'Offline Content Library',
    santali: 'ᱥᱟᱧᱪᱟᱣ ᱛᱷᱟᱠ',
    desc: 'Access saved lessons, worksheets, and audio clips without any internet.',
    badge: 'IndexedDB',
    color: '#4a5568',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ activeTeacher }) => {
  const teacherName = activeTeacher?.name || 'Sunita Kumari';
  const assignedGrade = activeTeacher?.assignedGrade || 'Class 1';
  const district = activeTeacher?.district || 'Dumka';

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: '#fbd38d', marginBottom: '0.75rem' }}>
              <span>🌿 PALASH MTB-MLE</span>
              <span>•</span>
              <span>Govt. of Jharkhand (SIH 26042)</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.5px' }}>
              ᱡᱚᱦᱟᱨ, {teacherName}!
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: 0, maxWidth: '600px' }}>
              Mother-Tongue-Based Teaching Assistant for <strong>{assignedGrade}</strong> in <strong>{district}</strong>. Empowering Santali primary education with on-device AI.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f6ad55' }}>30+</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>SVG Decks</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#68d391' }}>0 ms</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>FLN Latency</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#63b3ed' }}>100%</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>Offline Edge</div>
            </div>
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
              Select a module to conduct interactive classroom sessions or prepare bilingual curriculum.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {DASHBOARD_ACTIONS.map((action) => (
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
                <div style={{ fontSize: '0.9rem', color: action.color, fontWeight: 700, marginBottom: '6px' }}>
                  {action.santali}
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
