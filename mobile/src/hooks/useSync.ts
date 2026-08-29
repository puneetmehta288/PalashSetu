import { useState } from 'react';
export const useSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const sync = async () => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 1000); };
  return { isSyncing, sync };
};
