import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionOptions {
  defaultLang?: string;
}

/**
 * Strips speech recognition artifact loops and repetitions
 * e.g. "कैसे कैसे हो कैसे हो बच्चों कैसे हो बच्चों" -> "कैसे हो बच्चों"
 */
function cleanSpeechText(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();

  // 1. Remove consecutive duplicated words: "कैसे कैसे" -> "कैसे"
  const words = cleaned.split(/\s+/);
  const dedupedWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i].toLowerCase() !== words[i - 1].toLowerCase()) {
      dedupedWords.push(words[i]);
    }
  }
  cleaned = dedupedWords.join(' ');

  // 2. Check if string contains doubled sentence: "कैसे हो बच्चों कैसे हो बच्चों" -> "कैसे हो बच्चों"
  const tokens = cleaned.split(/\s+/);
  if (tokens.length >= 2 && tokens.length % 2 === 0) {
    const mid = tokens.length / 2;
    const firstHalf = tokens.slice(0, mid).join(' ');
    const secondHalf = tokens.slice(mid).join(' ');
    if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
      cleaned = firstHalf;
    }
  }

  // 3. Remove 3x or nx subphrase repetition
  const currentTokens = cleaned.split(/\s+/);
  for (let len = 1; len <= Math.floor(currentTokens.length / 2); len++) {
    const candidate = currentTokens.slice(0, len).join(' ');
    const candidatePattern = new RegExp(`^(${candidate}\\s*)+$`, 'i');
    if (candidatePattern.test(cleaned)) {
      cleaned = candidate;
      break;
    }
  }

  return cleaned;
}

export const useSpeechRecognition = (defaultLang = 'hi-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or an Android device.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // Use single-sentence mode to prevent compounding loops on Android
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = defaultLang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let bestTranscript = '';
        let isFinalResult = false;

        // In Android, inspect all results up to latest
        for (let i = 0; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item && item[0] && item[0].transcript) {
            bestTranscript = item[0].transcript;
            if (item.isFinal) {
              isFinalResult = true;
            }
          }
        }

        const cleaned = cleanSpeechText(bestTranscript);
        if (isFinalResult && cleaned) {
          setTranscript(cleaned);
          setInterimTranscript('');
        } else if (cleaned) {
          setInterimTranscript(cleaned);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Normal when user pauses, don't show as fatal error
          return;
        }
        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied. Please allow microphone access in your browser address bar.');
        } else if (event.error === 'network') {
          setError('Network required for online speech recognition in browser. (On Android APK, offline speech engine is used).');
        } else {
          setError(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e: any) {
      console.error('Failed to initialize SpeechRecognition:', e);
      setIsSupported(false);
      setError('Failed to initialize speech engine.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [defaultLang]);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    if (!recognitionRef.current) {
      setError('Speech recognition engine not initialized.');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started, restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      } catch (inner) {
        setError('Could not start microphone. Please refresh or check permissions.');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    setTranscript,
    startListening,
    stopListening,
    error,
    isSupported,
  };
};
