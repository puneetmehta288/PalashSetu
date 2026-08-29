import React from 'react';
export const SyncStatusBar: React.FC<{ isSyncing: boolean }> = ({ isSyncing }) => (
  <div style={{ background: isSyncing ? '#ed8936' : '#38a169', color: 'white', padding: '0.25rem', textAlign: 'center' }}>
    {isSyncing ? 'Syncing...' : 'Synced'}
  </div>
);
export default SyncStatusBar;
