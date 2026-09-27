import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, StudentProfile } from '../services/authService';
import { classroomService, ClassroomEvent, ClassroomTranslationEvent, ClassroomInfo, ConnectionStatus } from '../services/classroomService';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';
import { useTheme } from '../context/ThemeContext';

const StudentClassroom: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [classroomInfo, setClassroomInfo] = useState<ClassroomInfo | null>(null);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>({
    connected: false,
    teacherActive: false
  });
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(true);
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
      {
        id: (profile as any).id || profile.studentName,
        name: profile.studentName,
        grade: profile.grade,
        avatar: profile.avatarEmoji || '🎒'
      },
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
      },
      (info: ClassroomInfo) => {
        setClassroomInfo(info);
        setIsCheckingConnection(false);
      },
      (status: ConnectionStatus) => {
        setConnStatus(status);
        setIsCheckingConnection(false);
      }
    );

    // Timeout check after 4s: if still no teacher ack, show hotspot guidance
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);
    }, 4000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
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
      
      {/* ─── Classroom Info Header Card ─── */}
      <div
        style={{
          background: isDarkMode ? '#1e293b' : 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '1.2rem 1.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)'
            }}
          >
            {student?.avatarEmoji || '🎒'}
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f6ad55', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>{classroomInfo?.schoolName || 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड'}</span>
              <span style={{
                fontSize: '0.75rem',
                backgroundColor: connStatus.teacherActive ? '#16a34a' : '#d97706',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '14px',
                fontWeight: 800
              }}>
                {connStatus.teacherActive ? '● लाइव प्रसारण सक्रिय' : '● शिक्षक स्टैंडबाय'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '3px' }}>
              👩‍🏫 शिक्षिका: <strong>{classroomInfo?.teacherName || 'सुनीता मुर्मू'}</strong> • 🏷️ <strong>{classroomInfo?.grade || student?.grade || 'कक्षा 1'}</strong>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
              कमरा कोड: <strong style={{ color: '#fed7aa', letterSpacing: '1px' }}>#{student?.roomCode}</strong> • छात्र: <strong>{student?.studentName}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <span>👥</span>
            <span>{Math.max(studentCount, 1)} छात्र जुड़े हैं</span>
          </div>

          <button
            onClick={() => {
              sfx.playTap();
              authService.logout();
              navigate('/login');
            }}
            title="कमरा बदलें"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              borderRadius: '12px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🚪 बाहर निकलें
          </button>
        </div>
      </div>

      {/* ─── Hotspot / Wi-Fi Connection Warning (If Teacher Not Reachable) ─── */}
      {!connStatus.teacherActive && !isCheckingConnection && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            padding: '1.25rem',
            color: '#92400e',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>📡⚠️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#78350f' }}>
                शिक्षक से संपर्क नहीं हो पा रहा है (Teacher Not Reachable)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
                कमरा कोड #{student?.roomCode} पर कोई सक्रिय शिक्षक प्रसारण नहीं मिल रहा है।
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.85rem',
              lineHeight: 1.55,
              color: '#334155',
              border: '1px solid #fde68a'
            }}
          >
            <strong style={{ color: '#0f2744' }}>💡 कृपया निम्नलिखित 3 बातें जाँचें:</strong>
            <ol style={{ margin: '8px 0 0 0', paddingLeft: '22px' }}>
              <li>
                क्या आपका फ़ोन <strong>शिक्षक के मोबाइल हॉटस्पॉट (Hotspot)</strong> या स्कूल के उसी वाई-फ़ाई से जुड़ा है?
              </li>
              <li>
                क्या शिक्षक ने अपनी स्क्रीन पर <strong>"📡 प्रसारण शुरू करें (Start Broadcast)"</strong> बटन दबाया है?
              </li>
              <li>
                क्या आपका 4-अंकों का कोड <strong>#{student?.roomCode}</strong> शिक्षक के स्क्रीन पर दिख रहे कोड से मेल खाता है?
              </li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                sfx.playTap();
                window.location.reload();
              }}
              style={{
                backgroundColor: '#d97706',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🔄</span>
              <span>पुनः प्रयास करें (Retry Connection)</span>
            </button>

            <button
              onClick={() => {
                sfx.playTap();
                authService.logout();
                navigate('/login?role=student');
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#b45309',
                border: '1px solid #d97706',
                padding: '9px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              🚪 कोड बदलें / QR दोबारा स्कैन करें
            </button>
          </div>
        </div>
      )}

      {/* ─── Teacher Assigned Worksheet Alert (if present) ─── */}
      {assignedWorksheet && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '1.1rem 1.4rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>📝</span>
            <div>
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '1rem' }}>
                🎉 शिक्षक ने नया कार्यपत्र सौंपा है!
              </div>
              <div style={{ fontSize: '0.85rem', color: '#14532d', marginTop: '2px' }}>
                {assignedWorksheet.title}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              sfx.playTap();
              navigate('/worksheets');
            }}
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
            }}
          >
            <span>✏️ कार्यपत्र हल करें ➔</span>
          </button>
        </div>
      )}

      {/* ─── Hero Display: Live Speech from Teacher ─── */}
      <div
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderRadius: '20px',
          padding: '2rem 1.5rem',
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto', fontSize: '0.82rem', color: '#ed8936', fontWeight: 800, textTransform: 'uppercase' }}>
              <span>🎙️ शिक्षक ने अभी कहा (Teacher just said)</span>
            </div>

            {/* Giant Ol Chiki Script Display */}
            <div
              style={{
                fontFamily: "'Noto Sans Ol Chiki', 'Ol Chiki', sans-serif",
                fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
                fontWeight: 900,
                color: isDarkMode ? '#f8fafc' : '#0f2744',
                lineHeight: 1.25,
                margin: '0.6rem 0',
                wordBreak: 'break-word',
              }}
            >
              {activeSpeech.translatedSantali}
            </div>

            {/* Phonetic Pronunciation Guide */}
            {activeSpeech.phoneticHindi && (
              <div
                style={{
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.4rem)',
                  fontWeight: 700,
                  color: '#b45309',
                  backgroundColor: isDarkMode ? '#334155' : '#fef3c7',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  margin: '0 auto',
                  border: '1px solid #fde68a'
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => playSantaliAudio(activeSpeech.translatedSantali)}
                disabled={isPlayingAudio}
                style={{
                  backgroundColor: '#ed8936',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
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
                  padding: '10px 20px',
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
            <div style={{ fontSize: '3.8rem', animation: 'pulse 2s infinite' }}>🎧</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#1a365d' }}>
              शिक्षक की आवाज़ का इंतज़ार है...
            </div>
            <div style={{ fontSize: '0.92rem', maxWidth: '440px', lineHeight: 1.55 }}>
              जैसे ही शिक्षक अपने टैबलेट पर हिन्दी में बोलेंगे, संथाली अनुवाद यहाँ <strong>ऑल चिकी (ᱚᱞ ᱪᱤᱠᱤ)</strong> और स्पष्ट आवाज़ में तुरंत सुनाई देगा।
            </div>
          </div>
        )}
      </div>

      {/* ─── Student Quick Learning Shortcuts ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div
          onClick={() => {
            sfx.playTap();
            navigate('/flashcards');
          }}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '2.4rem' }}>🃏</span>
          <div>
            <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '1rem' }}>
              शब्द कार्ड (Flashcards)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              चित्रों और ऑल चिकी के साथ संथाली शब्द सीखें
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            sfx.playTap();
            navigate('/jcert');
          }}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '2.4rem' }}>📖</span>
          <div>
            <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '1rem' }}>
              JCERT पाठ्यपुस्तकें
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              कक्षा 1 से 5 की द्विभाषी किताबें ऑडियो सहित पढ़ें
            </div>
          </div>
        </div>
      </div>

      {/* ─── Classroom Speech History ─── */}
      {history.length > 0 && (
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📜</span>
            <span>इस कक्षा में बोले गए वाक्य (Class History)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ed8936', fontFamily: "'Noto Sans Ol Chiki', sans-serif" }}>
                    {item.translatedSantali}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    {item.sourceHindi} {item.phoneticHindi ? `• (${item.phoneticHindi})` : ''}
                  </div>
                </div>

                <button
                  onClick={() => playSantaliAudio(item.translatedSantali)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                  }}
                  title="आवाज़ सुनें"
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
