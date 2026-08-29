import React from 'react';
import { sfx } from '../utils/sfx';
import { speakText } from '../utils/santaliSpeech';

interface OfflineVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineVoiceModal: React.FC<OfflineVoiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOpenVoiceSettings = () => {
    sfx.playTap();
    if (typeof window !== 'undefined' && (window as any).AndroidVoiceBridge?.openVoiceInputSettings) {
      (window as any).AndroidVoiceBridge.openVoiceInputSettings();
    } else {
      alert('On your Android device: Go to Settings > System > Languages > Voice input > Offline speech recognition > Download Hindi.');
    }
  };

  const handleOpenTtsSettings = () => {
    sfx.playTap();
    if (typeof window !== 'undefined' && (window as any).AndroidVoiceBridge?.installTtsData) {
      (window as any).AndroidVoiceBridge.installTtsData();
    } else if (typeof window !== 'undefined' && (window as any).AndroidVoiceBridge?.openTtsSettings) {
      (window as any).AndroidVoiceBridge.openTtsSettings();
    } else {
      alert('On your Android device: Go to Settings > Speech > Text-to-speech output > Download Hindi voice data.');
    }
  };

  const handleTestAudio = () => {
    sfx.playSuccess();
    speakText('ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱯᱟᱞᱟᱥ ᱥᱮᱛᱩ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ।', { rate: 0.85 });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 39, 68, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          color: '#1a202c',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.75rem' }}>⚡</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f2744', fontWeight: 800 }}>
                1-Tap Offline Voice Setup
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>
                झारखंड स्कूलों के लिए ऑफलाइन माइक और आवाज़
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 800,
              color: '#4a5568',
            }}
          >
            ✕
          </button>
        </div>

        {/* Intro */}
        <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
          PalashSetu works <strong>100% offline</strong> in rural classrooms. Tap the buttons below to enable offline voice directly from your device:
        </p>

        {/* Step 1: Microphone */}
        <div
          style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ backgroundColor: '#ed8936', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              STEP 1
            </span>
            <strong style={{ color: '#0f2744', fontSize: '0.95rem' }}>🎙️ Offline Microphone (माइक)</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#718096', margin: '0 0 10px', lineHeight: 1.4 }}>
            Allows speaking Hindi in <strong>Airplane Mode</strong> with zero internet.
          </p>
          <button
            onClick={handleOpenVoiceSettings}
            style={{
              width: '100%',
              backgroundColor: '#3182ce',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(49, 130, 206, 0.3)',
            }}
          >
            📲 Open Voice Settings ➔ Tap "Hindi" (~35MB)
          </button>
        </div>

        {/* Step 2: Speaker / TTS */}
        <div
          style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ backgroundColor: '#38a169', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              STEP 2
            </span>
            <strong style={{ color: '#0f2744', fontSize: '0.95rem' }}>🔊 Audio Pronunciation (आवाज़)</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#718096', margin: '0 0 10px', lineHeight: 1.4 }}>
            Enables natural Santali & Hindi speech playback without data.
          </p>
          <button
            onClick={handleOpenTtsSettings}
            style={{
              width: '100%',
              backgroundColor: '#38a169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(56, 161, 105, 0.3)',
            }}
          >
            🔊 Check / Install Speech Audio
          </button>
        </div>

        {/* Test & Done Footer */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleTestAudio}
            style={{
              flex: 1,
              backgroundColor: '#edf2f7',
              color: '#2d3748',
              border: '1px solid #cbd5e0',
              borderRadius: '10px',
              padding: '0.7rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ▶️ Test Sound
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: '#0f2744',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.7rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ✓ Done, Ready!
          </button>
        </div>
      </div>
    </div>
  );
};
