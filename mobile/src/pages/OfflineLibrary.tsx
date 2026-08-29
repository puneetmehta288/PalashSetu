import React, { useState } from 'react';

const OfflineLibrary: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Lessons', 'Worksheets', 'PDFs', 'Videos', 'Flashcards'];
  
  const content = [
    { id: 1, title: 'Counting 1-10', type: 'Lesson', status: 'synced', date: 'Today' },
    { id: 2, title: 'Animals', type: 'Flashcards', status: 'syncing', date: 'Yesterday' },
    { id: 3, title: 'Math Quiz', type: 'Worksheet', status: 'not_synced', date: '2 days ago' }
  ];

  return (
    <div>
      <h2>Offline Library</h2>
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {filters.map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: filter === f ? '#1a365d' : '#e2e8f0', color: filter === f ? '#fff' : '#000', whiteSpace: 'nowrap' }}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="input-group" style={{ marginTop: '1rem' }}>
        <input className="input-field" placeholder="Search library..." />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {content.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div>
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>{item.type} • {item.date}</p>
            </div>
            <div style={{ fontSize: '1.5rem' }}>
              {item.status === 'synced' ? '✅' : item.status === 'syncing' ? '🔄' : '⚠️'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OfflineLibrary;
