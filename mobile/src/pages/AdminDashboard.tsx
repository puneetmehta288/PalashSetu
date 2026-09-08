import React, { useState, useEffect } from 'react';

interface FeedbackReport {
  id: string;
  timestamp: string;
  teacherName: string;
  district: string;
  assignedGrade: string;
  issueType: string;
  sourceWord: string;
  description: string;
  appVersion: string;
  sent: boolean;
}

const ISSUE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  wrong_translation: { label: 'Wrong Translation', color: '#991b1b', bg: '#fee2e2' },
  missing_word:      { label: 'Missing Word',       color: '#92400e', bg: '#fef3c7' },
  audio_issue:       { label: 'Audio Issue',         color: '#1e40af', bg: '#dbeafe' },
  other:             { label: 'Other',               color: '#374151', bg: '#f3f4f6' },
};

const AdminDashboard: React.FC = () => {
  const [reports, setReports]       = useState<FeedbackReport[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/complaints?key=' + encodeURIComponent(import.meta.env.VITE_ADMIN_KEY || 'palashsetu-admin'));
      if (!res.ok) throw new Error('Unauthorised or server error');
      const data = await res.json();
      setReports(data.reports || []);
      setLastRefresh(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const filtered = filter === 'all' ? reports : reports.filter((r) => r.issueType === filter);
  const sorted   = [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>

      {/* Top Bar */}
      <div style={{ backgroundColor: '#0f2744', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>PalashSetu — Admin Dashboard</div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Teacher Feedback & Complaint Reports</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchReports}
            style={{
              backgroundColor: '#ed8936', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '8px 16px', fontWeight: 700,
              fontSize: '0.85rem', cursor: 'pointer',
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Reports',       value: reports.length,                                                      color: '#0f2744' },
            { label: 'Wrong Translation',   value: reports.filter(r => r.issueType === 'wrong_translation').length,     color: '#991b1b' },
            { label: 'Missing Word',        value: reports.filter(r => r.issueType === 'missing_word').length,          color: '#92400e' },
            { label: 'Audio Issues',        value: reports.filter(r => r.issueType === 'audio_issue').length,           color: '#1e40af' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['all', 'wrong_translation', 'missing_word', 'audio_issue', 'other'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                backgroundColor: filter === f ? '#0f2744' : '#e2e8f0',
                color: filter === f ? '#fff' : '#475569',
                fontWeight: filter === f ? 700 : 500,
                fontSize: '0.82rem',
                transition: 'all 0.15s ease',
              }}
            >
              {f === 'all' ? 'All Reports' : ISSUE_LABELS[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            ⏳ Loading reports...
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fee2e2', borderRadius: '12px', padding: '1rem 1.25rem', color: '#991b1b', fontWeight: 600 }}>
            ❌ {error}
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
            No reports yet.
          </div>
        )}

        {/* Report Cards */}
        {!loading && sorted.map((report) => {
          const issue = ISSUE_LABELS[report.issueType] || ISSUE_LABELS.other;
          return (
            <div
              key={report.id}
              style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '1.25rem',
                marginBottom: '0.875rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                borderLeft: `4px solid ${issue.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Issue type badge */}
                  <span style={{
                    backgroundColor: issue.bg, color: issue.color,
                    fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '20px',
                  }}>
                    {issue.label}
                  </span>
                  {/* Word */}
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f2744' }}>
                    "{report.sourceWord}"
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {new Date(report.timestamp).toLocaleString('en-IN')}
                </div>
              </div>

              {report.description && (
                <div style={{ marginTop: '0.6rem', fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
                  {report.description}
                </div>
              )}

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>👩‍🏫 {report.teacherName}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {report.district}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🏫 {report.assignedGrade}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📱 v{report.appVersion}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
