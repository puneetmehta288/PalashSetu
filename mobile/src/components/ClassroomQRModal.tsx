import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface ClassroomQRModalProps {
  roomCode: string;
  teacherName: string;
  onClose: () => void;
}

export const ClassroomQRModal: React.FC<ClassroomQRModalProps> = ({ roomCode, teacherName, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [teacherIp, setTeacherIp] = useState<string>('');

  useEffect(() => {
    const localIp = (typeof window !== 'undefined' && (window as any).AndroidVoiceBridge?.getLocalIp?.()) || '';
    if (localIp) setTeacherIp(localIp);

    // Determine target URL for student device scanning
    let joinUrl = `https://palashsetu-xi.vercel.app/login?room=${roomCode}&role=student${localIp ? `&ip=${localIp}` : ''}`;
    if (typeof window !== 'undefined' && window.location) {
      const origin = window.location.origin;
      if (!origin.includes('localhost') && !origin.includes('capacitor://')) {
        joinUrl = `${origin}/login?room=${roomCode}&role=student${localIp ? `&ip=${localIp}` : ''}`;
      }
    }

    QRCode.toDataURL(
      joinUrl,
      {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#0f2744',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [roomCode]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 39, 68, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '1.75rem',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '1rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2744', marginBottom: '4px' }}>
          📡 कक्षा से जुड़ें (Join Classroom)
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          शिक्षक: <strong>{teacherName}</strong> • छात्र टैबलेट या फोन से स्कैन करें
        </div>

        {/* QR Code Frame */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '12px',
            display: 'inline-block',
            marginBottom: '1rem',
          }}
        >
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Classroom QR Code" style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }} />
          ) : (
            <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              QR कोड बन रहा है...
            </div>
          )}
        </div>

        {/* Big 4-digit PIN Code */}
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '10px 14px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            या 4-अंकों का कोड दर्ज करें (Class Code)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#b45309', letterSpacing: '6px', marginTop: '2px' }}>
            {roomCode}
          </div>
          {teacherIp && (
            <div style={{ fontSize: '0.72rem', color: '#78350f', fontWeight: 700, marginTop: '4px' }}>
              📶 हॉटस्पॉट IP: {teacherIp}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#0f2744',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 24px',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          ✓ समझ गया (Done)
        </button>
      </div>
    </div>
  );
};
