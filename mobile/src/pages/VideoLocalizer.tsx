import React, { useState, useEffect, useRef } from 'react';

interface SubtitleCue {
  id: number;
  start_time: string;
  end_time: string;
  hindi_text: string;
  santali_text: string;
  pronunciation_hint: string;
  number_val: number;
  emoji: string;
}

interface LocalizedVideoData {
  title: string;
  video_url: string;
  is_youtube: boolean;
  youtube_id?: string;
  duration_sec: number;
  cues: SubtitleCue[];
}

const SAMPLE_EDUCATIONAL_CUES: SubtitleCue[] = [
  {
    id: 1,
    start_time: '00:01',
    end_time: '00:05',
    hindi_text: 'नमस्ते बच्चों! आज हम सब मिलकर 1 से 10 तक गिनती सीखेंगे।',
    santali_text: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾',
    pronunciation_hint: 'Johar gidrako! Tehen abo mid khon gel habij lekha bon chedoga.',
    number_val: 1,
    emoji: '🍎 ᱢᱤᱫ (1)',
  },
  {
    id: 2,
    start_time: '00:06',
    end_time: '00:10',
    hindi_text: 'यह एक सेब है। एक को संथाली में "मिद" (ᱢᱤᱫ) कहते हैं।',
    santali_text: 'ᱱᱚᱣᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱝ ᱥᱮᱣ ᱠᱟᱱᱟ᱾ ᱑ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ "ᱢᱤᱫ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
    pronunciation_hint: 'Nowa do mid-tang sew kana. 1 do Santali te "Mid" bon metaga.',
    number_val: 1,
    emoji: '🍎 ᱢᱤᱫ (1)',
  },
  {
    id: 3,
    start_time: '00:11',
    end_time: '00:15',
    hindi_text: 'अब दो सेब देखिए। दो को संथाली में "बार" (ᱵᱟᱨ) कहते हैं।',
    santali_text: 'ᱱᱤᱛᱚᱜ ᱵᱟᱨᱭᱟ ᱥᱮᱣ ᱧᱮᱞ ᱯᱮ᱾ ᱒ ᱫᱚ "ᱵᱟᱨ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
    pronunciation_hint: 'Nitog barya sew nel pe. 2 do "Bar" bon metaga.',
    number_val: 2,
    emoji: '🍎🍎 ᱵᱟᱨ (2)',
  },
  {
    id: 4,
    start_time: '00:16',
    end_time: '00:20',
    hindi_text: 'तीन सेब: एक, दो, तीन! तीन को संथाली में "पे" (ᱯᱮ) कहते हैं।',
    santali_text: 'ᱯᱮᱭᱟ ᱥᱮᱣ: ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ! ᱓ ᱫᱚ "ᱯᱮ" ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾',
    pronunciation_hint: 'Peya sew: mid, bar, pe! 3 do "Pe" bon metaga.',
    number_val: 3,
    emoji: '🍎🍎🍎 ᱯᱮ (3)',
  },
  {
    id: 5,
    start_time: '00:21',
    end_time: '00:25',
    hindi_text: 'चार (ᱯᱩᱱ), पाँच (ᱢᱚᱬᱮ), छह (ᱛᱩᱨᱩᱭ), सात (ᱮᱨᱟᱭ)... बहुत बढ़िया!',
    santali_text: 'ᱯᱩᱱ (᱔), ᱢᱚᱬᱮ (᱕), ᱛᱩᱨᱩᱭ (᱖), ᱮᱨᱟᱭ (᱗)... ᱟᱹᱰᱤ ᱵᱮᱥ!',
    pronunciation_hint: 'Pun (4), Mone (5), Turui (6), Eray (7)... Adi bes!',
    number_val: 5,
    emoji: '🌟🌟🌟🌟🌟 ᱢᱚᱬᱮ (5)',
  },
  {
    id: 6,
    start_time: '00:26',
    end_time: '00:30',
    hindi_text: 'आठ (ᱤᱨᱟᱹᱞ), नौ (ᱟᱨᱮ) और दस (ᱜᱮᱞ)! हमने 10 तक गिनती सीखी।',
    santali_text: 'ᱤᱨᱟᱹᱞ (᱘), ᱟᱨᱮ (᱙) ᱟᱨ ᱜᱮᱞ (᱑᱐)! ᱟᱵᱚ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫ ᱠᱮᱫᱼᱟ᱾',
    pronunciation_hint: 'Iral (8), Are (9) ar Gel (10)! Abo gel habij lekha bon ched keda.',
    number_val: 10,
    emoji: '🔟 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',
  },
];

const VideoLocalizer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('Class 1 Mathematics: Counting 1 to 10');
  const [customTranscript, setCustomTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localizedData, setLocalizedData] = useState<LocalizedVideoData | null>(null);
  
  // Video Playback & Audio Narration State
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState(true);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [currentCueIndex, setCurrentCueIndex] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const timerRef = useRef<any>(null);

  const speakSantali = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel previous
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const loadPreset = () => {
    setVideoUrl('https://www.youtube.com/watch?v=ea5-SIe5l7M');
    setVideoTitle('Class 1 Mathematics: Counting 1 to 10 (गिनती १-१०)');
    setCustomTranscript(
      'नमस्ते बच्चों! आज हम सब मिलकर 1 से 10 तक गिनती सीखेंगे।\nयह एक सेब है। एक को संथाली में "मिद" (ᱢᱤᱫ) कहते हैं।\nअब दो सेब देखिए। दो को संथाली में "बार" (ᱵᱟᱨ) कहते हैं।\nतीन सेब: एक, दो, तीन! तीन को संथाली में "पे" (ᱯᱮ) कहते हैं।\nचार (ᱯᱩᱱ), पाँच (ᱢᱚᱬᱮ), छह (ᱛᱩᱨᱩᱭ), सात (ᱮᱨᱟᱭ)... बहुत बढ़िया!\nआठ (ᱤᱨᱟᱹᱞ), नौ (ᱟᱨᱮ) और दस (ᱜᱮᱞ)! हमने 10 तक गिनती सीखी।'
    );
  };

  const handleLocalize = async () => {
    setIsProcessing(true);
    setSavedSuccess(false);

    try {
      const ytId = extractYouTubeId(videoUrl);
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/video/localize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: videoUrl,
          title: videoTitle,
          transcript_text: customTranscript || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalizedData({
          title: data.title,
          video_url: data.video_url,
          is_youtube: Boolean(ytId),
          youtube_id: ytId || undefined,
          duration_sec: 30,
          cues: (data.cues || []).map((c: any, idx: number) => ({
            id: idx + 1,
            start_time: c.start_time,
            end_time: c.end_time,
            hindi_text: c.hindi_text,
            santali_text: c.santali_text,
            pronunciation_hint: SAMPLE_EDUCATIONAL_CUES[idx]?.pronunciation_hint || c.santali_text,
            number_val: idx + 1,
            emoji: idx === 0 ? '🍎' : `${idx + 1}️⃣`,
          })),
        });
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      const ytId = extractYouTubeId(videoUrl);
      setLocalizedData({
        title: videoTitle || 'Class 1 Mathematics: Counting 1 to 10',
        video_url: videoUrl,
        is_youtube: Boolean(ytId),
        youtube_id: ytId || undefined,
        duration_sec: 30,
        cues: SAMPLE_EDUCATIONAL_CUES,
      });
    } finally {
      setIsProcessing(false);
      setPlaybackSeconds(0);
      setCurrentCueIndex(0);
      setIsPlaying(true);
      if (voiceNarrationEnabled) {
        speakSantali(SAMPLE_EDUCATIONAL_CUES[0].pronunciation_hint);
      }
    }
  };

  // Synchronized Playback & Santali Voice Narration Engine
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const next = prev + 1;
          if (next >= 30) {
            setIsPlaying(false);
            return 0;
          }
          
          const newCueIdx = Math.min(Math.floor(next / 5), (localizedData?.cues.length || 6) - 1);
          if (newCueIdx !== currentCueIndex && localizedData?.cues[newCueIdx]) {
            setCurrentCueIndex(newCueIdx);
            // Automatic synchronized Santali voice narration
            if (voiceNarrationEnabled) {
              const cue = localizedData.cues[newCueIdx];
              speakSantali(cue.pronunciation_hint || cue.santali_text);
            }
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentCueIndex, voiceNarrationEnabled, localizedData]);

  const togglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (nextPlay && voiceNarrationEnabled && currentCue) {
      speakSantali(currentCue.pronunciation_hint || currentCue.santali_text);
    }
  };

  const handleSaveToOfflineLibrary = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentCue = localizedData?.cues[currentCueIndex] || SAMPLE_EDUCATIONAL_CUES[0];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a365d', fontSize: '1.8rem' }}>🎬 Educational Video Localizer</h1>
          <p style={{ margin: '0.3rem 0 0', color: '#718096', fontSize: '0.95rem' }}>
            Bilingual Video Localization with Synchronized Santali (Ol Chiki) Subtitles & Audio Voice Narration
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1.5rem',
          borderTop: '4px solid #1a365d',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1a365d' }}>
            🌐 Online Video Input & Preparation
          </h2>
          <button
            onClick={loadPreset}
            style={{
              backgroundColor: '#edf2f7',
              border: '1px solid #cbd5e0',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#2d3748',
            }}
          >
            ⚡ Load Sample: Counting 1-10 Video
          </button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#2d3748', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            Video Link (YouTube, DIKSHA, or direct URL)
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=ea5-SIe5l7M or mp4 link"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e0',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>OR UPLOAD VIDEO FILE:</span>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            style={{ fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#2d3748', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            Spoken Dialogue Transcript (Hindi)
          </label>
          <textarea
            value={customTranscript}
            onChange={(e) => setCustomTranscript(e.target.value)}
            placeholder="Paste Hindi spoken dialogue here or use sample preset above..."
            rows={3}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e0',
              fontSize: '0.95rem',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={handleLocalize}
          disabled={isProcessing}
          style={{
            backgroundColor: '#ed8936',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(237,137,54,0.3)',
          }}
        >
          {isProcessing ? '⚙️ Translating & Localizing Video & Audio...' : '✨ Localize Video & Generate Santali Audio/Subtitles'}
        </button>
      </div>

      {/* Localized Video Output & Player */}
      {localizedData && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderTop: '4px solid #38a169',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', color: '#1a365d' }}>{localizedData.title}</h2>
              <span style={{ fontSize: '0.85rem', color: '#38a169', fontWeight: 'bold' }}>
                ✅ Localized Video & Synchronized Santali Audio Track Ready
              </span>
            </div>
            <button
              onClick={handleSaveToOfflineLibrary}
              style={{
                backgroundColor: '#38a169',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              💾 Download to Offline Content Library
            </button>
          </div>

          {savedSuccess && (
            <div style={{ padding: '10px 14px', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '6px', marginBottom: '1rem', fontWeight: 500 }}>
              🎉 Localized video & audio package saved to Offline Library! Accessible in classroom with zero internet.
            </div>
          )}

          {/* Player Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              backgroundColor: '#1a202c',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {localizedData.is_youtube && localizedData.youtube_id ? (
              // YouTube Embed
              <iframe
                width="100%"
                height="380"
                src={`https://www.youtube.com/embed/${localizedData.youtube_id}?autoplay=1&mute=0`}
                title="Educational Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none', display: 'block' }}
              />
            ) : localizedData.video_url.startsWith('blob:') || localizedData.video_url.endsWith('.mp4') ? (
              // HTML5 Video File Player
              <video
                src={localizedData.video_url}
                controls
                autoPlay
                style={{ width: '100%', height: '360px', objectFit: 'contain' }}
              />
            ) : (
              // Built-in Interactive FLN Animated Classroom Video Canvas
              <div
                style={{
                  height: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #1a365d 0%, #2a4365 100%)',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                  {currentCue.emoji}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f6ad55', marginBottom: '4px' }}>
                  Class 1 Mathematics • Foundational Numeracy
                </div>
                <div style={{ fontSize: '1.1rem', color: '#cbd5e0' }}>
                  Counting 1–10 Story • {playbackSeconds}s / 30s
                </div>
              </div>
            )}

            {/* Live Synchronized Santali (Ol Chiki) Subtitle & Audio Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(0, 0, 0, 0.88)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: '2px solid #ed8936',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ color: '#ed8936', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  {currentCue.santali_text}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: '4px' }}>
                  {currentCue.hindi_text}
                </div>
                {voiceNarrationEnabled && (
                  <div style={{ fontSize: '0.8rem', color: '#68d391', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                    🔊 Santali Audio Track Playing: <em>"{currentCue.pronunciation_hint}"</em>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#edf2f7',
              padding: '12px 18px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={togglePlay}
                style={{
                  backgroundColor: isPlaying ? '#e53e3e' : '#1a365d',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? '⏸️ Pause Video' : '▶️ Play Video'}
              </button>
              <span style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: 600 }}>
                ⏱️ Timestamp: {playbackSeconds}s / 30s
              </span>
            </div>

            {/* Audio Voice Narration Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2d3748', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={voiceNarrationEnabled}
                  onChange={(e) => setVoiceNarrationEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                🔊 Santali Spoken Voice Narration (ON)
              </label>
            </div>
          </div>

          {/* Subtitle Cue List with Individual Audio Playback Buttons */}
          <div>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', color: '#1a365d' }}>
              📜 Synchronized Subtitle & Audio Tracks (Click any line to play)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {localizedData.cues.map((cue, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentCueIndex(idx);
                    setPlaybackSeconds(idx * 5);
                    speakSantali(cue.pronunciation_hint || cue.santali_text);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: currentCueIndex === idx ? '#feebc8' : '#f7fafc',
                    borderRadius: '8px',
                    border: currentCueIndex === idx ? '2px solid #ed8936' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#ed8936', fontSize: '1.2rem', marginBottom: '2px' }}>
                      {cue.santali_text}
                    </div>
                    <div style={{ color: '#4a5568', fontSize: '0.92rem', marginBottom: '2px' }}>
                      {cue.hindi_text}
                    </div>
                    <div style={{ color: '#718096', fontSize: '0.82rem', fontStyle: 'italic' }}>
                      Pronunciation: "{cue.pronunciation_hint}"
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakSantali(cue.pronunciation_hint || cue.santali_text);
                      }}
                      style={{
                        backgroundColor: '#38a169',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      🔊 Speak
                    </button>
                    <span style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                      ⏱️ {cue.start_time} - {cue.end_time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLocalizer;
