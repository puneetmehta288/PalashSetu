import { useState } from 'react';
export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const play = (url: string) => { setIsPlaying(true); };
  const stop = () => { setIsPlaying(false); };
  
  return { isPlaying, play, stop, duration, currentTime };
};
