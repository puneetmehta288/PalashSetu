import React, { useState, useEffect, useRef } from 'react';
import { authService, TeacherProfile } from '../services/authService';
import { saveFeedbackLocally, getPendingCount, syncFeedback, checkAndSync, getAllReports } from '../services/feedbackService';
import { sfx } from '../utils/sfx';

interface ReportIssueProps {
  activeTeacher?: TeacherProfile | null;
}

type IssueType = 'wrong_translation' | 'missing_word' | 'audio_issue' | 'other';

const ISSUE_OPTIONS: { value: IssueType; label: string; emoji: string }[] = [
  { value: 'wrong_translation', label: 'Wrong Translation', emoji: '❌' },
  { value: 'missing_word',      label: 'Missing Word / Vocab', emoji: '🔍' },
  { value: 'audio_issue',       label: 'Audio / Voice Pronunciation', emoji: '🔇' },
  { value: 'other',             label: 'Other Classroom Issue', emoji: '📝' },
];

const ReportIssue: React.FC<ReportIssueProps> = ({ activeTeacher }) => {
  const teacher = activeTeacher || authService.getActiveProfile();

  const [issueType, setIssueType] = useState<IssueType>('wrong_translation');
  const [complaintText, setComplaintText] = useState('');
  const [sourceWord, setSourceWord] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshAll = async () => {
    const list = await getAllReports();
    setReportsList([...list].reverse());
    const count = list.filter((r: any) => !r.sent).length;
    setPendingCount(count);
  };

  useEffect(() => {
    refreshAll();
    checkAndSync().then(refreshAll);
  }, []);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2 MB.');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setScreenshotBase64(null);
    setScreenshotName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setSubmitting(true);
    sfx.playTap();

    try {
      await saveFeedbackLocally({
        teacherName: teacher?.name || 'Primary Teacher',
        district: teacher?.district || 'Dumka',
        assignedGrade: teacher?.assignedGrade || 'Class 1',
        issueType,
        sourceWord: sourceWord.trim() || 'General Complaint',
        description: complaintText.trim(),
        screenshot: screenshotBase64 || undefined,
      });

      setSubmittedSuccess(true);
      setComplaintText('');
      setSourceWord('');
      removeImage();
      await refreshAll();

      // Attempt immediate background sync
      const res = await checkAndSync();
      await refreshAll();
      if (res.sent > 0) {
        setSyncMessage(`✅ Auto-synced ${res.sent} report(s) directly to Central Hub!`);
        setTimeout(() => setSyncMessage(null), 5000);
      }

      setTimeout(() => setSubmittedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    sfx.playTap();
    setSyncMessage('Transmitting to https://palashsetu-xi.vercel.app ...');
    const res = await syncFeedback();
    await refreshAll();
    setSyncing(false);

    if (res.sent > 0) {
      setSyncMessage(`✅ Successfully sent ${res.sent} report(s) to Central Hub!`);
    } else if (res.failed > 0) {
      setSyncMessage(`⚠️ Failed to transmit (${res.failed} error). Please check your internet connection.`);
    } else {
      setSyncMessage(`ℹ️ All reports are already synced to Central Hub.`);
    }
    setTimeout(() => setSyncMessage(null), 6000);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(15, 39, 68, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(237,137,54,0.2)', color: '#fbd38d', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>🚩 FIELD COMPLAINTS & FEEDBACK</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Report an Issue
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
            Found a wrong translation or missing word? Submit a complaint — works 100% offline.
          </p>
        </div>

        {/* Teacher identity card */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>REPORTING AS</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{teacher?.name || 'Teacher'}</div>
          <div style={{ fontSize: '0.75rem', color: '#fbd38d' }}>📍 {teacher?.district || 'Jharkhand'} • {teacher?.assignedGrade || 'Class 1'}</div>
        </div>
      </div>

      {/* Offline sync status alert */}
      <div style={{ backgroundColor: '#fffaf0', border: '1px solid #fed7aa', borderRadius: '14px', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>☁️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#9a3412', fontSize: '0.88rem' }}>
              Offline Sync Status: {pendingCount === 0 ? 'All reports synced to central portal' : `${pendingCount} report(s) saved locally`}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#c2410c' }}>
              Complaints are saved on this tablet and automatically sent to the Central Portal whenever internet is detected.
            </div>
          </div>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={syncing}
            style={{
              backgroundColor: '#ed8936',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: syncing ? 'wait' : 'pointer',
            }}
          >
            {syncing ? 'Syncing...' : '🔄 Sync Now'}
          </button>
        )}
      </div>

      {submittedSuccess && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#166534' }}>
          <span style={{ fontSize: '1.6rem' }}>✅</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>Complaint Logged Successfully!</div>
            <div style={{ fontSize: '0.82rem', color: '#15803d' }}>
              Saved locally on tablet. Will automatically transmit to the central team for review and vocabulary updates.
            </div>
          </div>
        </div>
      )}

      {syncMessage && (
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', color: '#1e40af', fontWeight: 700, fontSize: '0.9rem' }}>
          <span>ℹ️</span>
          <div>{syncMessage}</div>
        </div>
      )}

      {/* Main Complaint Form */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 39, 68, 0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Issue Type Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f2744', marginBottom: '8px' }}>
            SELECT ISSUE CATEGORY
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
            {ISSUE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setIssueType(opt.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: `2px solid ${issueType === opt.value ? '#ed8936' : '#e2e8f0'}`,
                  backgroundColor: issueType === opt.value ? '#fff7ed' : '#f8fafc',
                  color: issueType === opt.value ? '#9a3412' : '#475569',
                  fontWeight: issueType === opt.value ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Word / Context (optional) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f2744', marginBottom: '6px' }}>
            WORD / PHRASE (Optional)
          </label>
          <input
            type="text"
            value={sourceWord}
            onChange={(e) => setSourceWord(e.target.value)}
            placeholder="e.g. तितली, पानी पीना, आज हम पढ़ेंगे..."
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Complaint Text */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f2744', marginBottom: '6px' }}>
            WRITE YOUR COMPLAINT / FEEDBACK <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <textarea
            required
            rows={4}
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            placeholder="Describe the issue in detail. What was shown? What should it be? Any missing chapter or pronunciation mistake?"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Optional Screenshot Attachment */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f2744', marginBottom: '6px' }}>
            ATTACH SCREENSHOT (Optional)
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImagePick}
            style={{ display: 'none' }}
          />

          {!screenshotBase64 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '1rem',
                width: '100%',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#64748b',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <span>📷</span>
              <span>Tap to attach screenshot / photo from tablet</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
              <img
                src={screenshotBase64}
                alt="Screenshot preview"
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {screenshotName || 'Attached Screenshot'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#15803d' }}>Ready to send with complaint</div>
              </div>
              <button
                type="button"
                onClick={removeImage}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!complaintText.trim() || submitting}
          style={{
            backgroundColor: complaintText.trim() ? '#ed8936' : '#cbd5e1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '14px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: complaintText.trim() && !submitting ? 'pointer' : 'not-allowed',
            boxShadow: complaintText.trim() ? '0 4px 12px rgba(237,137,54,0.3)' : 'none',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>🚩</span>
          <span>{submitting ? 'Saving Complaint...' : 'Submit Complaint to Central Portal'}</span>
        </button>
      </form>

      {/* Local Complaints Log: Shows Sent vs Pending */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 39, 68, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f2744' }}>
              📋 Complaints Log on this Tablet
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              Track which complaints are saved offline vs synced to Central Hub
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            style={{
              backgroundColor: '#0f2744',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: syncing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔄</span>
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {reportsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.88rem' }}>
            📭 No complaints logged on this device yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reportsList.map((r: any) => (
              <div
                key={r.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: r.sent ? '#f0fdf4' : '#fffaf0',
                  border: `1.5px solid ${r.sent ? '#bbf7d0' : '#fed7aa'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: r.sent ? '#dcfce7' : '#fef3c7',
                      color: r.sent ? '#15803d' : '#92400e',
                    }}>
                      {r.issueType?.replace('_', ' ').toUpperCase()}
                    </span>
                    {r.sourceWord && r.sourceWord !== 'General Complaint' && (
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f2744' }}>
                        "{r.sourceWord}"
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                    {r.description}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                    📅 {new Date(r.timestamp).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {r.sent ? (
                    <span style={{
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(34, 197, 94, 0.3)',
                    }}>
                      ✓ Sent to Central Hub
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
                    }}>
                      ⏳ Pending Sync (Offline)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssue;
