import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, StudentProfile } from '../services/authService';
import { classroomService, ClassroomEvent, ClassroomTranslationEvent } from '../services/classroomService';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';
import { useTheme } from '../context/ThemeContext';

const StudentClassroom: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [activeSpeech, setActiveSpeech] = useState<ClassroomTranslationEvent | null>(null);
  const [history, setHistory] = useState<ClassroomTranslationEvent[]>([]);
  const [studentCount, setStudentCount] = useState<number>(1);
  const [assignedWorksheet, setAssignedWorksheet] = useState<{ id: string; title: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasReaction, setHasReaction] = useState(false);

  useEffect(() => {
    const profile = authService.getStudentProfile();
    if (!profile) {
      navigate('/login');
      return;
    }
    setStudent(profile);

    // Join classroom broadcast bus
    const unsubscribe = classroomService.joinClassroom(
      profile.roomCode,
      profile.studentName,
      (event: ClassroomEvent) => {
        if (event.type === 'translation') {
          sfx.playSuccess();
          setActiveSpeech(event.data);
          setHistory((prev) => [event.data, ...prev.slice(0, 9)]);
          setHasReaction(false);

          // Auto-play pronunciation in Santali for immersive child learning
          playSantaliAudio(event.data.translatedSantali);
        } else if (event.type === 'worksheet_assigned') {
          sfx.playSuccess();
          setAssignedWorksheet({
            id: event.data.worksheetId,
            title: event.data.title,
          });
        }
      },
      (count: number) => {
        setStudentCount(count);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const playSantaliAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakText(text, {
      rate: 0.85,
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleReactThumb = () => {
    sfx.playSuccess();
    setHasReaction(true);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>
      
      {/* Classroom Status Top Bar */}
      <div
        style={{
          background: isDarkMode ? '#1e293b' : 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
            }}
          >
            📡
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f6ad55', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>लाइव डिजिटल कक्षा</span>
              <span style={{ fontSize: '0.8rem', backgroundColor: '#38a169', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                🟢 सक्रिय (Live)
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              कक्षा कोड: <strong>#{student?.roomCode || '----'}</strong> • छात्र: <strong>{student?.studentName}</strong> ({student?.grade})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>👥</span>
            <span>{Math.max(studentCount, 1)} छात्र जुड़े हैं</span>
          </div>
        </div>
      </div>

      {/* Teacher Assigned Worksheet Alert (if present) */}
      {assignedWorksheet && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📝</span>
            <div>
              <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem' }}>
                शिक्षक ने नया अभ्यास पत्र भेजा है!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#78350f' }}>{assignedWorksheet.title}</div>
            </div>
          </div>
          <button
            onClick={() => {
              sfx.playTap();
              navigate('/worksheets');
            }}
            style={{
              backgroundColor: '#d97706',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>हल करें ➔</span>
          </button>
        </div>
      )}

      {/* Hero Display: Live Speech from Teacher */}
      <div
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderRadius: '20px',
          padding: '1.75rem 1.5rem',
          border: `2px solid ${activeSpeech ? '#ed8936' : (isDarkMode ? '#334155' : '#e2e8f0')}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          textAlign: 'center',
          position: 'relative',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {activeSpeech ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top Indicator */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto', fontSize: '0.8rem', color: '#ed8936', fontWeight: 800, textTransform: 'uppercase' }}>
              <span>🎙️ शिक्षक ने अभी कहा (Teacher just said)</span>
            </div>

            {/* Giant Ol Chiki Script Display */}
            <div
              style={{
                fontFamily: "'Noto Sans Ol Chiki', 'Ol Chiki', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 900,
                color: isDarkMode ? '#f8fafc' : '#0f2744',
                lineHeight: 1.25,
                margin: '0.5rem 0',
                wordBreak: 'break-word',
              }}
            >
              {activeSpeech.translatedSantali}
            </div>

            {/* Phonetic Pronunciation Guide */}
            {activeSpeech.phoneticHindi && (
              <div
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                  fontWeight: 700,
                  color: '#b45309',
                  backgroundColor: isDarkMode ? '#334155' : '#fef3c7',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  margin: '0 auto',
                }}
              >
                उच्चारण: <em>"{activeSpeech.phoneticHindi}"</em>
              </div>
            )}

            {/* Original Spoken Hindi */}
            <div style={{ fontSize: '0.95rem', color: isDarkMode ? '#94a3b8' : '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
              हिन्दी मूल: "{activeSpeech.sourceHindi}"
            </div>

            {/* Interactive Action Buttons for Child */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => playSantaliAudio(activeSpeech.translatedSantali)}
                disabled={isPlayingAudio}
                style={{
                  backgroundColor: '#ed8936',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(237, 137, 54, 0.3)',
                }}
              >
                <span>{isPlayingAudio ? '🔊 बोल रहा है...' : '🔊 आवाज़ सुनें (Replay)'}</span>
              </button>

              <button
                onClick={handleReactThumb}
                style={{
                  backgroundColor: hasReaction ? '#22c55e' : (isDarkMode ? '#334155' : '#edf2f7'),
                  color: hasReaction ? '#ffffff' : (isDarkMode ? '#f8fafc' : '#1e293b'),
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{hasReaction ? '✅ समझ आ गया!' : '👍 समझ आया (Got it)'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
            <div style={{ fontSize: '3.5rem', animation: 'pulse 2s infinite' }}>🎧</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#1a365d' }}>
              शिक्षक की आवाज़ का इंतज़ार है...
            </div>
            <div style={{ fontSize: '0.9rem', maxWidth: '420px', lineHeight: 1.5 }}>
              जैसे ही शिक्षक अपने टैबलेट पर हिन्दी में बोलेंगे, संथाली अनुवाद यहाँ <strong>ऑल चिकी (ᱚᱞ ᱪᱤᱠᱤ)</strong> और स्पष्ट आवाज़ में तुरंत सुनाई देगा।
            </div>
          </div>
        )}
      </div>

      {/* Classroom Activity Quick Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div
          onClick={() => {
            sfx.playTap();
            navigate('/worksheets');
          }}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '14px',
            padding: '1rem',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <span style={{ fontSize: '2rem' }}>📝</span>
          <div>
            <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '0.92rem' }}>
              अभ्यास पत्र (Worksheets)
            </div>
            <div style={{ fontSize: '0.74rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              गणित और संथाली प्रश्न हल करें
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            sfx.playTap();
            navigate('/flashcards');
          }}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '14px',
            padding: '1rem',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <span style={{ fontSize: '2rem' }}>🃏</span>
          <div>
            <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '0.92rem' }}>
              शब्द कार्ड (Flashcards)
            </div>
            <div style={{ fontSize: '0.74rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              गिनती व सचित्र शब्द सीखें
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            sfx.playTap();
            navigate('/books');
          }}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '14px',
            padding: '1rem',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <span style={{ fontSize: '2rem' }}>📖</span>
          <div>
            <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '0.92rem' }}>
              JCERT पाठ्यपुस्तक
            </div>
            <div style={{ fontSize: '0.74rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              कक्षा 1 और 2 द्विभाषी अध्याय
            </div>
          </div>
        </div>
      </div>

      {/* History of Teacher's Phrases in this session */}
      {history.length > 1 && (
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📜 कक्षा में सिखाए गए पिछले वाक्य (Session History)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.slice(1).map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontFamily: "'Noto Sans Ol Chiki', 'Ol Chiki', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                    {item.translatedSantali}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    "{item.sourceHindi}" {item.phoneticHindi ? `• (${item.phoneticHindi})` : ''}
                  </div>
                </div>

                <button
                  onClick={() => playSantaliAudio(item.translatedSantali)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                  title="फिर से सुनें"
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClassroom;
