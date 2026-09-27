import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, TeacherProfile, StudentProfile } from '../services/authService';
import { sfx } from '../utils/sfx';

interface AuthLoginProps {
  onLoginSuccess: (profile: TeacherProfile | StudentProfile) => void;
}

const AVATAR_OPTIONS = ['🎒', '✏️', '🌟', '🦁', '🌸', '🏹'];

const AuthLogin: React.FC<AuthLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  // Inspect URL parameters (e.g. from QR scan)
  const searchParams = new URLSearchParams(window.location.search);
  const urlRoom = searchParams.get('room') || '';
  const urlRole = searchParams.get('role') === 'student' || urlRoom ? 'student' : 'teacher';

  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>(urlRole);

  // ── Teacher State ──
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<TeacherProfile | null>(null);
  const [pin, setPin] = useState<string>('');
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // ── Student State ──
  const [studentName, setStudentName] = useState<string>('बिरसा मुर्मू');
  const [studentGrade, setStudentGrade] = useState<string>('Class 1');
  const [roomCode, setRoomCode] = useState<string>(urlRoom || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🎒');
  const [studentError, setStudentError] = useState<string | null>(null);

  useEffect(() => {
    const list = authService.getProfiles();
    setProfiles(list);
    if (list.length > 0 && !selectedProfile) {
      setSelectedProfile(list[0]);
    }
  }, []);

  // ── Teacher PIN Logic ──
  const handleDigitPress = async (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setTeacherError(null);

    if (newPin.length === 4 && selectedProfile) {
      setIsVerifying(true);
      const isValid = await authService.verifyPin(selectedProfile.id, newPin);
      setIsVerifying(false);

      if (isValid) {
        sfx.playSuccess();
        authService.setActiveSession(selectedProfile.id);
        onLoginSuccess(selectedProfile);
        navigate('/');
      } else {
        setTeacherError('गलत 4-अंकों का पिन (Default PIN is 1234)');
        setPin('');
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setTeacherError(null);
  };

  const handleClear = () => {
    setPin('');
    setTeacherError(null);
  };

  // ── Student Join Logic ──
  const handleStudentJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setStudentError('कृपया अपना नाम दर्ज करें (Please enter name)');
      return;
    }
    if (!roomCode.trim()) {
      setStudentError('शिक्षक द्वारा दिया गया 4-अंकों का कोड दर्ज करें (Enter Room Code)');
      return;
    }

    sfx.playSuccess();
    const studentProfile = authService.loginAsStudent(
      studentName,
      studentGrade,
      roomCode,
      selectedAvatar
    );
    onLoginSuccess(studentProfile);
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.25rem 1rem',
        color: '#fff',
      }}
    >
      {/* App Branding */}
      <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
        <img
          src="/favicon.png"
          alt="Palash Vani"
          style={{ width: '56px', height: '56px', borderRadius: '14px', marginBottom: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
        />
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f6ad55', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>Palash Vani</span>
          <span style={{ fontSize: '1.05rem', color: '#fed7aa' }}>(पलाश वाणी)</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
          झारखंड प्राथमिक शिक्षा • द्विभाषी शिक्षण सहायक (SIH 26042)
        </div>
      </div>

      {/* Main Container Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          color: '#2d3748',
          borderRadius: '20px',
          padding: '1.25rem',
          boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
        }}
      >
        {/* Role Toggle Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#edf2f7',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '1.25rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setActiveTab('teacher');
            }}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'teacher' ? '#0f2744' : 'transparent',
              color: activeTab === 'teacher' ? '#ffffff' : '#4a5568',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>👩‍🏫</span>
            <span>शिक्षक (Teacher)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setActiveTab('student');
            }}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'student' ? '#ed8936' : 'transparent',
              color: activeTab === 'student' ? '#ffffff' : '#4a5568',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🎒</span>
            <span>छात्र (Student)</span>
          </button>
        </div>

        {/* ─── TAB 1: TEACHER LOGIN ─── */}
        {activeTab === 'teacher' && (
          <div>
            <h2 style={{ margin: '0 0 0.85rem', fontSize: '1rem', color: '#1a365d', textAlign: 'center', fontWeight: 800 }}>
              शिक्षक प्रोफ़ाइल चुनें (Select Teacher)
            </h2>

            {/* Profiles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {profiles.map((profile) => {
                const isSelected = selectedProfile?.id === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      sfx.playTap();
                      setSelectedProfile(profile);
                      setPin('');
                      setTeacherError(null);
                    }}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: isSelected ? '3px solid #ed8936' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#feebc8' : '#f7fafc',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: profile.avatarColor || '#1a365d',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {profile.name.charAt(0)}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a365d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {profile.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#718096' }}>
                      {profile.assignedGrade}
                    </div>
                  </div>
                );
              })}

              <div
                onClick={() => navigate('/register')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '12px',
                  border: '2px dashed #cbd5e0',
                  backgroundColor: '#fff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '1.4rem', color: '#ed8936', marginBottom: '2px' }}>➕</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4a5568' }}>Add Teacher</div>
              </div>
            </div>

            {selectedProfile && (
              <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a365d' }}>
                  {selectedProfile.name} का 4-अंकों का पिन दर्ज करें
                </div>
                <div style={{ fontSize: '0.74rem', color: '#718096' }}>
                  {selectedProfile.district} • {selectedProfile.teacherId}
                </div>
              </div>
            )}

            {/* PIN Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: pin.length > index ? '#ed8936' : '#e2e8f0',
                    border: '2px solid #cbd5e0',
                    transition: 'background-color 0.15s ease',
                  }}
                />
              ))}
            </div>

            {teacherError && (
              <div style={{ textAlign: 'center', color: '#e53e3e', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                ⚠️ {teacherError}
              </div>
            )}

            {/* Keypad */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                maxWidth: '280px',
                margin: '0 auto',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitPress(digit)}
                  disabled={isVerifying}
                  style={{
                    height: '46px',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#1a365d',
                    backgroundColor: '#edf2f7',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                style={{
                  height: '46px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#e53e3e',
                  backgroundColor: '#fed7d7',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
              <button
                onClick={() => handleDigitPress('0')}
                disabled={isVerifying}
                style={{
                  height: '46px',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1a365d',
                  backgroundColor: '#edf2f7',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                style={{
                  height: '46px',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#4a5568',
                  backgroundColor: '#e2e8f0',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                ⌫
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: '#718096' }}>
              💡 डिफ़ॉल्ट डेमो पिन: <strong>1234</strong>
            </div>
          </div>
        )}

        {/* ─── TAB 2: STUDENT JOIN ─── */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentJoin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744' }}>
                कक्षा में प्रवेश करें (Join Class)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                शिक्षक के हॉटस्पॉट या वाई-फ़ाई से जुड़कर सीखें
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                अवतार चुनें (Select Icon):
              </label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      sfx.playTap();
                      setSelectedAvatar(emoji);
                    }}
                    style={{
                      fontSize: '1.4rem',
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      border: selectedAvatar === emoji ? '2px solid #ed8936' : '1px solid #e2e8f0',
                      backgroundColor: selectedAvatar === emoji ? '#feebc8' : '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Name */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                छात्र का नाम (Student Name):
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="उदा. बिरसा, सुमित्रा..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Grade Selector */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                कक्षा (Class Grade):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {['Balvatika', 'Class 1', 'Class 2', 'Class 3'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      sfx.playTap();
                      setStudentGrade(g);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: studentGrade === g ? '2px solid #0f2744' : '1px solid #e2e8f0',
                      backgroundColor: studentGrade === g ? '#0f2744' : '#f8fafc',
                      color: studentGrade === g ? '#ffffff' : '#334155',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 4-Digit Room Code */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: '4px' }}>
                4-अंकों का कक्षा कोड (Classroom Code from Teacher):
              </label>
              <input
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setStudentError(null);
                }}
                placeholder="उदा. 4819"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '2px solid #ed8936',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#b45309',
                }}
              />
            </div>

            {studentError && (
              <div style={{ textAlign: 'center', color: '#e53e3e', fontSize: '0.8rem', fontWeight: 700 }}>
                ⚠️ {studentError}
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: '4px',
                backgroundColor: '#ed8936',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(237, 137, 54, 0.4)',
              }}
            >
              <span>🚀 कक्षा में प्रवेश करें (Enter Classroom)</span>
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#718096', marginTop: '4px' }}>
              💡 यदि शिक्षक ने QR कोड दिखाया है, तो उसे फ़ोन कैमरा से स्कैन करके भी जुड़ सकते हैं।
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthLogin;
