import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, TeacherProfile } from '../services/authService';

interface AuthRegisterProps {
  onRegisterSuccess: (profile: TeacherProfile) => void;
}

const JHARKHAND_DISTRICTS = [
  'Dumka',
  'East Singhbhum (Jamshedpur)',
  'West Singhbhum (Chaibasa)',
  'Ranchi',
  'Seraikela Kharsawan',
  'Pakur',
  'Sahibganj',
  'Deoghar',
  'Godda',
  'Jamtara',
  'Hazaribagh',
  'Dhanbad',
  'Bokaro',
];

const AuthRegister: React.FC<AuthRegisterProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [district, setDistrict] = useState('Dumka');
  const [block, setBlock] = useState('Kathikund');
  const [assignedGrade, setAssignedGrade] = useState('Class 1');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter teacher full name.');
      return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('4-Digit PIN and Confirm PIN do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProfile = await authService.registerProfile(
        name,
        teacherId,
        district,
        block,
        assignedGrade,
        pin
      );
      onRegisterSuccess(newProfile);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a365d 0%, #2a4365 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          color: '#2d3748',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a365d' }}>
            🌿 Register Teacher Profile
          </div>
          <p style={{ margin: '4px 0 0', color: '#718096', fontSize: '0.9rem' }}>
            PALASH MTB-MLE • Shared Tablet Onboarding
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
              Full Name (पूरा नाम) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Murmu or Sunita Kumari"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
                e-Vidyavahini ID
              </label>
              <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="EVV-JH-849201"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
                Assigned Grade *
              </label>
              <select
                value={assignedGrade}
                onChange={(e) => setAssignedGrade(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '0.9rem',
                  backgroundColor: '#fff',
                }}
              >
                <option value="Balvatika">Balvatika (Age 5-6)</option>
                <option value="Class 1">Class 1 (Grade 1)</option>
                <option value="Class 2">Class 2 (Grade 2)</option>
                <option value="Class 3">Class 3 (Grade 3)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
                District (जिला)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '0.9rem',
                  backgroundColor: '#fff',
                }}
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
                Block (प्रखंड)
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="Kathikund"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* 4-Digit PIN Creation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
                Create 4-Digit PIN *
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '1.2rem',
                  letterSpacing: '6px',
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#2d3748' }}>
                Confirm PIN *
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="••••"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  fontSize: '1.2rem',
                  letterSpacing: '6px',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                backgroundColor: '#edf2f7',
                color: '#4a5568',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ed8936',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(237,137,54,0.3)',
              }}
            >
              {isSubmitting ? 'Registering...' : '💾 Register & Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthRegister;
