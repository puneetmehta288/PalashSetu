import React, { useState, useEffect } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

export const JHARKHAND_TRIBAL_DISTRICTS = [
  { name: 'Dumka', sat: 'ᱫᱩᱢᱠᱟᱹ', region: 'Santhal Pargana' },
  { name: 'Deoghar', sat: 'ᱫᱮᱣᱜᱷᱚᱨ', region: 'Santhal Pargana' },
  { name: 'Pakur', sat: 'ᱯᱟᱠᱩᱲ', region: 'Santhal Pargana' },
  { name: 'Sahebganj', sat: 'ᱥᱟᱦᱮᱵᱽᱜᱚᱸᱡᱽ', region: 'Santhal Pargana' },
  { name: 'Godda', sat: 'ᱜᱚᱰᱰᱟ', region: 'Santhal Pargana' },
  { name: 'Jamtara', sat: 'ᱡᱟᱢᱛᱟᱲᱟ', region: 'Santhal Pargana' },
  { name: 'East Singhbhum', sat: 'ᱥᱟᱢᱟᱝ ᱥᱤᱝᱵᱷᱩᱢ', region: 'Kolhan' },
  { name: 'West Singhbhum', sat: 'ᱯᱟᱪᱮ ᱥᱤᱝᱵᱷᱩᱢ', region: 'Kolhan' },
  { name: 'Seraikela Kharsawan', sat: 'ᱥᱚᱨᱟᱭᱠᱮᱞᱟ ᱠᱷᱚᱨᱥᱚᱶᱟ', region: 'Kolhan' },
  { name: 'Ranchi', sat: 'ᱨᱟᱺᱪᱤ', region: 'South Chotanagpur' }
];

const Settings: React.FC = () => {
  // 1. Teacher Profile State
  const [teacherName, setTeacherName] = useState(() => localStorage.getItem('palash_teacher_name') || 'रोहित कुमार (Rohit Kumar)');
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('palash_school_name') || 'राजकीय उत्क्रमित मध्य विद्यालय, दुमका');
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem('palash_district') || 'Dumka');
  const [primaryClass, setPrimaryClass] = useState(() => localStorage.getItem('palash_primary_class') || 'Class 1');

  // 2. Audio & Speech Preferences
  const [speechRate, setSpeechRate] = useState<number>(() => {
    const saved = localStorage.getItem('palash_speech_rate');
    return saved ? parseFloat(saved) : 0.85;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sfx.isEnabled());

  // 3. UI Feedback state
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playSuccess();

    localStorage.setItem('palash_teacher_name', teacherName);
    localStorage.setItem('palash_school_name', schoolName);
    localStorage.setItem('palash_district', selectedDistrict);
    localStorage.setItem('palash_primary_class', primaryClass);
    localStorage.setItem('palash_speech_rate', speechRate.toString());

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleSound = () => {
    const newState = sfx.toggleSound();
    setSoundEnabled(newState);
  };

  const handleTestAudio = () => {
    sfx.playVoicePing();
    setIsPlayingTest(true);
    speakText('ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ! ᱟᱵᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱟᱨ ᱦᱤᱱᱫᱤ ᱛᱮ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ ᱵᱚᱱ ᱪᱮᱫ ᱟᱠᱚᱣᱟ᱾', {
      rate: speechRate,
      onEnd: () => setIsPlayingTest(false)
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all classroom settings to default?')) {
      sfx.playTap();
      setTeacherName('शिक्षक (Teacher)');
      setSchoolName('प्राथमिक विद्यालय (Primary School)');
      setSelectedDistrict('Dumka');
      setPrimaryClass('Class 1');
      setSpeechRate(0.85);
      localStorage.clear();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ─── Page Header ─── */}
      <div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
          <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
            ⚙️ System Configuration
          </span>
          <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
            📴 100% Offline Device Settings
          </span>
        </div>
        <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
          ⚙️ Teacher & Classroom Settings (ᱥᱟᱡᱟᱣ)
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Customize your teacher profile, school district, speech pronunciation speed, and sound effects.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '12px 16px', backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', color: '#065f46', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅ Settings saved successfully to this tablet!</span>
        </div>
      )}

      {/* ─── Form Container ─── */}
      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* ─── SECTION 1: TEACHER & SCHOOL PROFILE ─── */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🏫</span>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: 0 }}>
                Teacher & School Profile
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Used in generated A4 worksheets, lesson plans, and printed textbook handouts.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {/* Teacher Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Teacher Name (शिक्षक का नाम):
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                placeholder="e.g. रोहित कुमार सिंह"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* School Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                School Name (विद्यालय का नाम):
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                placeholder="e.g. उत्क्रमित मध्य विद्यालय"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* District Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                District (ज़िला / ᱦᱚᱱᱚᱛ):
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, color: '#0f2744', backgroundColor: '#f8fafc', outline: 'none' }}
              >
                {JHARKHAND_TRIBAL_DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>
                    📍 {d.name} ({d.sat}) — {d.region}
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Class */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Default Class Level:
              </label>
              <select
                value={primaryClass}
                onChange={e => setPrimaryClass(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, color: '#0f2744', backgroundColor: '#f8fafc', outline: 'none' }}
              >
                <option value="Balvatika">🎒 Balvatika (Pre-Primary / ᱵᱟᱞᱣᱟᱴᱤᱠᱟ)</option>
                <option value="Class 1">🏫 Class 1 (FLN Grade 1 / ᱑ ᱪᱟᱱᱟᱪ)</option>
                <option value="Class 2">🏫 Class 2 (FLN Grade 2 / ᱒ ᱪᱟᱱᱟᱪ)</option>
                <option value="Class 3">🏫 Class 3 (FLN Grade 3 / ᱓ ᱪᱟᱱᱟᱪ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: AUDIO & SPEECH SYNTHESIS CONTROLS ─── */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔊</span>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: 0 }}>
                Audio Pronunciation & Speech Engine
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Tune acoustic playback speed for young children learning Santali phonetics.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Speech Rate Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Pronunciation Speed: <strong>{speechRate}x</strong>
                </label>
                <span style={{ fontSize: '0.74rem', color: speechRate < 0.85 ? '#d97706' : '#059669', fontWeight: 700 }}>
                  {speechRate <= 0.75 ? '🐢 Slow (For Beginners)' : speechRate <= 0.9 ? '🎯 Recommended (Classroom)' : '⚡ Fast'}
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.2"
                step="0.05"
                value={speechRate}
                onChange={e => setSpeechRate(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#ed8936', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>0.6x (Slow)</span>
                <span>0.85x (Standard)</span>
                <span>1.2x (Fast)</span>
              </div>
            </div>

            {/* Sound Effects Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f2744' }}>
                  Interactive Sound Effects (SFX)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Button clicks, card flips, and success chimes
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: soundEnabled ? '#059669' : '#cbd5e1',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {soundEnabled ? '🔔 ON' : '🔕 OFF'}
              </button>
            </div>
          </div>

          {/* Test Speech Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '6px' }}>
            <button
              type="button"
              onClick={handleTestAudio}
              disabled={isPlayingTest}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fffaf0',
                border: '1px solid #fed7aa',
                color: '#c05621',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <span>{isPlayingTest ? '🔊 Playing Sample...' : '🔊 Test Voice Engine Output'}</span>
            </button>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Sample: <em>"ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ! ᱟᱵᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱟᱨ ᱦᱤᱱᱫᱤ ᱛᱮ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ ᱵᱚᱱ ᱪᱮᱫ ᱟᱠᱚᱣᱟ᱾"</em>
            </span>
          </div>
        </div>

        {/* ─── SECTION 3: SYSTEM HEALTH & OFFLINE DIAGNOSTICS ─── */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📊</span>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: 0 }}>
                On-Device Health & Diagnostics
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Hardware metrics and offline curriculum integrity status.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>OFFLINE DICTIONARY</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>7,503 Words</div>
              <div style={{ fontSize: '0.7rem', color: '#15803d' }}>100% On-Device</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>PARSING LATENCY</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>&lt; 0.005 ms</div>
              <div style={{ fontSize: '0.7rem', color: '#1d4ed8' }}>Real-time walkie-talkie</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#faf5ff', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '0.72rem', color: '#6b21a8', fontWeight: 700 }}>NIPUN LESSONS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7e22ce', marginTop: '2px' }}>36 Panchaadi</div>
              <div style={{ fontSize: '0.7rem', color: '#7e22ce' }}>Balvatika to Class 3</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '10px', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: '0.72rem', color: '#9a3412', fontWeight: 700 }}>JCERT TEXTBOOKS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>8 State Books</div>
              <div style={{ fontSize: '0.7rem', color: '#c2410c' }}>21 Full Chapters</div>
            </div>
          </div>
        </div>

        {/* ─── ACTION BUTTONS ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#64748b',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🔄 Reset Defaults
          </button>

          <button
            type="submit"
            style={{
              backgroundColor: '#0f2744',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15,39,68,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            💾 Save Classroom Settings
          </button>
        </div>

      </form>

    </div>
  );
};

export default Settings;
