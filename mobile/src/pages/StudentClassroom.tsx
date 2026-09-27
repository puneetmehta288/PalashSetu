import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, StudentProfile } from '../services/authService';
import { classroomService, ClassroomEvent, ClassroomTranslationEvent, ClassroomInfo, ConnectionStatus } from '../services/classroomService';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';
import { useTheme } from '../context/ThemeContext';
import { QRScannerModal } from '../components/QRScannerModal';

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
  const [isAssignedDismissed, setIsAssignedDismissed] = useState<boolean>(false);
  const [submittedWorksheets, setSubmittedWorksheets] = useState<any[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasReaction, setHasReaction] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [showJoinQR, setShowJoinQR] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoinSession = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 4) {
      setJoinError('कृपया 4-अंकों का कोड दर्ज करें');
      return;
    }
    sfx.playSuccess();
    // Update student profile with new room code
    const current = authService.getStudentProfile();
    if (current) {
      authService.loginAsStudent(current.studentName, current.grade, trimmed, current.avatarEmoji);
    }
    setShowJoinModal(false);
    setShowJoinQR(false);
    setJoinRoomCode('');
    setJoinError(null);
    // Reload page to re-init classroom connection with new room code
    window.location.reload();
  };

  const loadSubmissions = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('palash_student_my_submissions') || '[]');
      setSubmittedWorksheets(stored);
    } catch (_) {}
  };

  const loadAssigned = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
      if (stored && stored.length > 0) {
        setAssignedWorksheet({
          id: stored[0].worksheetId || stored[0].worksheet_id,
          title: stored[0].title || stored[0].worksheet_title || 'कक्षा अभ्यास पत्र',
        });
      } else {
        setAssignedWorksheet(null);
      }
    } catch (_) {}
  };

  useEffect(() => {
    const profile = authService.getStudentProfile();
    if (!profile) {
      navigate('/login');
      return;
    }
    setStudent(profile);

    loadSubmissions();
    loadAssigned();

    // Join classroom broadcast bus only if room code is set
    let unsubscribe: () => void = () => {};
    if (profile.roomCode) {
      unsubscribe = classroomService.joinClassroom(
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
            setIsAssignedDismissed(false);
            setAssignedWorksheet({
              id: event.data.worksheetId,
              title: event.data.title,
            });
          } else if (event.type === 'classroom_reset' || event.type === 'clear_worksheet') {
            setAssignedWorksheet(null);
            setIsAssignedDismissed(false);
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
    } else {
      setIsCheckingConnection(false);
    }

    const onWorksheetAssigned = (e: any) => {
      if (e.detail) {
        sfx.playSuccess();
        setIsAssignedDismissed(false);
        setAssignedWorksheet({
          id: e.detail.worksheetId,
          title: e.detail.title,
        });
      }
    };
    const onClassroomReset = () => {
      setAssignedWorksheet(null);
      setIsAssignedDismissed(false);
    };
    const onClearWorksheet = () => {
      try { localStorage.removeItem('palash_assigned_worksheets'); } catch (_) {}
      setAssignedWorksheet(null);
      setIsAssignedDismissed(false);
    };
    const onWorksheetSubmitted = () => {
      loadSubmissions();
      loadAssigned();
    };

    window.addEventListener('palash_worksheet_assigned', onWorksheetAssigned);
    window.addEventListener('palash_classroom_reset', onClassroomReset);
    window.addEventListener('palash_clear_worksheet', onClearWorksheet);
    window.addEventListener('palash_worksheet_submitted', onWorksheetSubmitted);

    // Timeout check after 6s: if still no teacher ack, show hotspot guidance
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);
    }, 6000);

    return () => {
      unsubscribe();
      window.removeEventListener('palash_worksheet_assigned', onWorksheetAssigned);
      window.removeEventListener('palash_classroom_reset', onClassroomReset);
      window.removeEventListener('palash_clear_worksheet', onClearWorksheet);
      window.removeEventListener('palash_worksheet_submitted', onWorksheetSubmitted);
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
      {!student?.roomCode ? (
        /* ─── Self-Study / Not Connected to Class Banner ─── */
        <div
          style={{
            background: isDarkMode ? '#1e293b' : 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '1.4rem 1.6rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)'
              }}
            >
              {student?.avatarEmoji || '🎒'}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f6ad55', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{student?.studentName || 'विद्यार्थी'}</span>
                <span style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#e2e8f0',
                  padding: '2px 10px',
                  borderRadius: '14px',
                  fontWeight: 700
                }}>
                  {student?.grade || 'Class 1'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                स्थिति: <strong>स्वतंत्र अध्ययन मोड (Offline / Self-Study)</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                शिक्षक के लाइव प्रसारण और कार्यपत्र प्राप्त करने के लिए कक्षा में शामिल हों
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playTap();
              setShowJoinModal(true);
            }}
            style={{
              backgroundColor: '#ed8936',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(237, 137, 54, 0.4)'
            }}
          >
            <span>🔍</span>
            <span>कक्षा में शामिल हों (Join Class)</span>
          </button>
        </div>
      ) : (
        /* ─── Classroom Info Header Card (Connected to Room) ─── */
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
                <span>{classroomInfo?.schoolName || 'कक्षा सत्र'}</span>
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
                👩‍🏫 शिक्षिका: <strong>{classroomInfo?.teacherName || 'शिक्षिका'}</strong> • 🏷️ <strong>{classroomInfo?.grade || student?.grade || 'कक्षा 1'}</strong>
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

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  sfx.playTap();
                  setShowJoinModal(true);
                }}
                title="कक्षा बदलें"
                style={{
                  background: 'rgba(237,137,54,0.2)',
                  border: '1px solid rgba(237,137,54,0.5)',
                  color: '#fed7aa',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🔍 कक्षा बदलें
              </button>
              <button
                onClick={() => {
                  sfx.playTap();
                  classroomService.leaveClassroom();
                  authService.leaveSession();
                  navigate('/', { replace: true });
                  window.location.reload();
                }}
                title="सत्र छोड़ें (प्रोफ़ाइल बनी रहेगी)"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                📤 सत्र छोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Hotspot / Wi-Fi Connection Warning (If Teacher Not Reachable) ─── */}
      {student?.roomCode && !connStatus.connected && !connStatus.teacherActive && !isCheckingConnection && (
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
                setShowJoinModal(true);
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
              🔍 कोड बदलें / QR दोबारा स्कैन करें
            </button>
          </div>
        </div>
      )}

      {/* ─── Teacher Assigned Worksheet Alert (if present) ─── */}
      {assignedWorksheet && !isAssignedDismissed && (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

            <button
              onClick={() => {
                sfx.playTap();
                setIsAssignedDismissed(true);
              }}
              title="बाद में हल करने के लिए बंद करें"
              style={{
                backgroundColor: 'rgba(22, 101, 52, 0.1)',
                color: '#166534',
                border: '1px solid rgba(22, 101, 52, 0.25)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <span>✕ बाद में करें</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Compact Pending Worksheet Card (When Closed/Minimized) ─── */}
      {assignedWorksheet && isAssignedDismissed && (
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
            border: isDarkMode ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>📝</span>
            <div>
              <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '0.92rem' }}>
                लंबित कार्यपत्र: {assignedWorksheet.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                शिक्षक द्वारा सौंपा गया • कभी भी हल करें
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
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✏️ हल करें ➔</span>
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
            navigate('/books');
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

      {/* ─── Previous Assignments / Submissions Section ─── */}
      {submittedWorksheets.length > 0 && (
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📚</span>
            <span>पिछले कार्यपत्र एवं परिणाम (Previous Assignments)</span>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px' }}>
              {submittedWorksheets.length} पूर्ण
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {submittedWorksheets.map((sub: any, idx: number) => {
              const score = typeof sub.score === 'number' ? sub.score : 0;
              const total = typeof sub.total_questions === 'number' ? sub.total_questions : (typeof sub.totalQuestions === 'number' ? sub.totalQuestions : 5);
              const pct = typeof sub.percentage === 'number' ? sub.percentage : Math.round((score / Math.max(1, total)) * 100);

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '0.95rem' }}>
                      📝 {sub.worksheet_title || sub.worksheetTitle || 'कक्षा अभ्यास पत्र'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      जमा किया: {new Date(sub.timestamp || sub.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • स्थिति: <strong style={{ color: '#16a34a' }}>✅ सबमिट किया गया</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        backgroundColor: pct >= 60 ? '#dcfce7' : '#fee2e2',
                        color: pct >= 60 ? '#15803d' : '#b91c1c',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}
                    >
                      अंक: {score} / {total} ({pct}%)
                    </div>

                    <button
                      onClick={() => {
                        sfx.playTap();
                        sessionStorage.setItem('palash_review_worksheet', JSON.stringify(sub));
                        navigate('/worksheets');
                      }}
                      style={{
                        backgroundColor: '#0f2744',
                        color: '#ffffff',
                        border: 'none',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>👁️ उत्तर देखें</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* ─── Join Class Modal ─── */}
      {showJoinModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem',
            maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>📡</div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f2744' }}>
                कक्षा में शामिल हों (Join Class)
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                शिक्षक के हॉटस्पॉट से जुड़ें और कोड दर्ज करें
              </div>
            </div>

            <button
              onClick={() => { sfx.playTap(); setShowJoinQR(true); }}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                backgroundColor: '#0f2744', color: '#fff', border: 'none',
                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', marginBottom: '12px'
              }}
            >
              <span>📷</span><span>QR कोड स्कैन करें (Scan QR)</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>या कोड टाइप करें</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            <input
              type="text"
              maxLength={6}
              value={joinRoomCode}
              onChange={(e) => { setJoinRoomCode(e.target.value); setJoinError(null); }}
              placeholder="4-अंकों का कोड (e.g. 4819)"
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                border: '2px solid #ed8936', fontSize: '1.4rem',
                fontWeight: 900, letterSpacing: '6px', textAlign: 'center',
                outline: 'none', boxSizing: 'border-box', color: '#b45309', marginBottom: '8px'
              }}
            />
            {joinError && (
              <div style={{ color: '#e53e3e', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
                ⚠️ {joinError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowJoinModal(false); setJoinError(null); setJoinRoomCode(''); }}
                style={{
                  flex: 1, padding: '11px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', backgroundColor: '#f8fafc',
                  color: '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                }}
              >
                रद्द करें
              </button>
              <button
                onClick={() => handleJoinSession(joinRoomCode)}
                style={{
                  flex: 2, padding: '11px', borderRadius: '12px',
                  border: 'none', backgroundColor: '#ed8936',
                  color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem',
                  boxShadow: '0 4px 14px rgba(237,137,54,0.4)'
                }}
              >
                🚀 कक्षा में शामिल हों
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner for Join */}
      <QRScannerModal
        isOpen={showJoinQR}
        onClose={() => setShowJoinQR(false)}
        onScanSuccess={(code) => handleJoinSession(code)}
      />
    </div>
  );
};

export default StudentClassroom;
