import { speakText, isOlChiki } from '../utils/santaliSpeech';

export class AudioService {
  play(urlOrText: string, options?: { lang?: string }) {
    if (!urlOrText) return;

    // If it's an audio URL / file path
    if (urlOrText.endsWith('.mp3') || urlOrText.endsWith('.wav') || urlOrText.endsWith('.ogg') || urlOrText.startsWith('http') || urlOrText.startsWith('blob:')) {
      try {
        const audio = new Audio(urlOrText);
        audio.play().catch(() => {
          // If audio URL fails (e.g. offline), synthesize speech
          speakText(urlOrText, { lang: options?.lang });
        });
      } catch {
        speakText(urlOrText, { lang: options?.lang });
      }
    } else {
      // It's a text phrase (Hindi or Santali Ol Chiki) -> Synthesize offline
      speakText(urlOrText, { lang: options?.lang });
    }
  }

  speakSantali(text: string) {
    speakText(text, { lang: 'hi-IN', rate: 0.85 });
  }

  speakHindi(text: string) {
    speakText(text, { lang: 'hi-IN', rate: 0.9 });
  }
}

export const audioService = new AudioService();
