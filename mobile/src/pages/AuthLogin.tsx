import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, TeacherProfile } from '../services/authService';

interface AuthLoginProps {
  onLoginSuccess: (profile: TeacherProfile) => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<TeacherProfile | null>(null);
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const list = authService.getProfiles();
    setProfiles(list);
    if (list.length > 0 && !selectedProfile) {
      setSelectedProfile(list[0]);
    }
  }, []);

  const handleDigitPress = async (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setErrorMessage(null);

    if (newPin.length === 4 && selectedProfile) {
      setIsVerifying(true);
      const isValid = await authService.verifyPin(selectedProfile.id, newPin);
      setIsVerifying(false);

      if (isValid) {
        authService.setActiveSession(selectedProfile.id);
        onLoginSuccess(selectedProfile);
        navigate('/');
      } else {
        setErrorMessage('Incorrect 4-Digit PIN. (Default demo PIN is 1234)');
        setPin('');
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage(null);
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
        padding: '1rem',
        color: '#fff',
      }}
    >
      {/* Sleek Minimal Branding */}
      <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f6ad55', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>🌿 PalashSetu</span>
          <span style={{ fontSize: '1.05rem', color: '#fed7aa' }}>(पलाश सेतु)</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          color: '#2d3748',
          borderRadius: '16px',
          padding: '1.25rem 1.25rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ margin: '0 0 0.85rem', fontSize: '1.05rem', color: '#1a365d', textAlign: 'center', fontWeight: 800 }}>
          Select Teacher Profile
        </h2>

        {/* Profile Avatars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {profiles.map((profile) => {
            const isSelected = selectedProfile?.id === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => {
                  setSelectedProfile(profile);
                  setPin('');
                  setErrorMessage(null);
                }}
                style={{
                  padding: '12px 8px',
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
                    width: '46px',
                    height: '46px',
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
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a365d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                  {profile.assignedGrade}
                </div>
              </div>
            );
          })}

          {/* Add Profile Button */}
          <div
            onClick={() => navigate('/register')}
            style={{
              padding: '12px 8px',
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
            <div style={{ fontSize: '1.5rem', color: '#ed8936', marginBottom: '2px' }}>➕</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568' }}>Add Teacher</div>
          </div>
        </div>

        {/* Selected Teacher Greeting */}
        {selectedProfile && (
          <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1a365d' }}>
              Enter 4-Digit PIN for {selectedProfile.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>
              {selectedProfile.district} • {selectedProfile.teacherId}
            </div>
          </div>
        )}

        {/* 4-Digit PIN Indicator Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: pin.length > index ? '#ed8936' : '#e2e8f0',
                border: '2px solid #cbd5e0',
                transition: 'background-color 0.15s ease',
              }}
            />
          ))}
        </div>

        {errorMessage && (
          <div style={{ textAlign: 'center', color: '#e53e3e', fontSize: '0.82rem', marginBottom: '0.75rem', fontWeight: 600 }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* 4x3 Touch Numeric Keypad */}
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
                height: '48px',
                fontSize: '1.3rem',
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
              height: '48px',
              fontSize: '0.85rem',
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
              height: '48px',
              fontSize: '1.3rem',
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
              height: '48px',
              fontSize: '1.2rem',
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

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#718096' }}>
          💡 Offline Authentication • Default PIN: <strong>1234</strong>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
