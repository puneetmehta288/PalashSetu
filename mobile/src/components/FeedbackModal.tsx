import React, { useState } from 'react';
import { saveFeedbackLocally, checkAndSync } from '../services/feedbackService';
import { authService } from '../services/authService';
import { sfx } from '../utils/sfx';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceWord?: string; // pre-filled from current translation
}

type IssueType = 'wrong_translation' | 'missing_word' | 'audio_issue' | 'other';

const ISSUE_OPTIONS: { value: IssueType; label: string; emoji: string }[] = [
  { value: 'wrong_translation', label: 'Wrong Translation', emoji: '❌' },
  { value: 'missing_word',      label: 'Missing Word',       emoji: '🔍' },
  { value: 'audio_issue',       label: 'Audio / Voice Issue', emoji: '🔇' },
  { value: 'other',             label: 'Other',               emoji: '📝' },
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, sourceWord = '' }) => {
  const [issueType, setIssueType] = useState<IssueType>('wrong_translation');
  const [wordInput, setWordInput] = useState(sourceWord);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const teacher = authService.getActiveProfile();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!wordInput.trim()) return;
    setStatus('saving');
    sfx.playTap();

    await saveFeedbackLocally({
      teacherName:   teacher?.name        || 'Unknown Teacher',
      district:      teacher?.district    || 'Unknown District',
      assignedGrade: teacher?.assignedGrade || 'Unknown Grade',
      issueType,
      sourceWord:    wordInput.trim(),
      description:   description.trim(),
    });

    // Try to sync immediately if online
    await checkAndSync();

    setStatus('saved');
    setTimeout(() => {
      setStatus('idle');
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '1.75rem',
        width: 'min(420px, 92vw)',
        zIndex: 9999,
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2744' }}>🚩 Report an Issue</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              Saved offline · Auto-syncs when internet available
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>

        {status === 'saved' ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
            <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1.1rem' }}>Report Saved!</div>
            <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>
              Will sync to central team when internet is available.
            </div>
          </div>
        ) : (
          <>
            {/* Issue Type */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>ISSUE TYPE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {ISSUE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIssueType(opt.value)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: `2px solid ${issueType === opt.value ? '#ed8936' : '#e2e8f0'}`,
                      backgroundColor: issueType === opt.value ? '#fff7ed' : '#f8fafc',
                      color: issueType === opt.value ? '#9a3412' : '#475569',
                      fontWeight: issueType === opt.value ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Word / Phrase */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                WORD / PHRASE WITH ISSUE
              </div>
              <input
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                placeholder="e.g. पानी, आज हम पढ़ेंगे..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                NOTES (optional)
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 120))}
                placeholder="What was wrong? What should it say?"
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'right' }}>{description.length}/120</div>
            </div>

            {/* Teacher info auto-fill notice */}
            <div style={{
              backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '8px 12px',
              fontSize: '0.75rem', color: '#166534', marginBottom: '1.25rem',
            }}>
              📍 Reporting as <strong>{teacher?.name || 'Teacher'}</strong> · {teacher?.district || 'District'} · {teacher?.assignedGrade || 'Class'}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!wordInput.trim() || status === 'saving'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: wordInput.trim() ? '#ed8936' : '#e2e8f0',
                color: wordInput.trim() ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: wordInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              {status === 'saving' ? '⏳ Saving...' : '🚩 Submit Report'}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default FeedbackModal;
