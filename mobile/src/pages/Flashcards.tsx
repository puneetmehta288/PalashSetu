import React, { useState, useMemo } from 'react';
import { ALL_DECKS, DeckMeta, FlashcardItem } from '../data/nipunDecks';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

// ─── Grade config ────────────────────────────────────────────────────────────
const GRADES = ['Balvatika', 'Class 1', 'Class 2', 'Class 3'] as const;
type Grade = typeof GRADES[number];

const GRADE_LABELS: Record<Grade, string> = {
  Balvatika: '🧸 Balvatika',
  'Class 1': '🎒 Class 1',
  'Class 2': '📖 Class 2',
  'Class 3': '🧮 Class 3',
};

const GRADE_NIPUN: Record<Grade, string> = {
  Balvatika: 'FLN Level 1 • Oral vocab, shapes, counting 1–5, Jaadui Pitara play-based',
  'Class 1': 'FLN Level 2 • Ol Chiki letters, number words 1–10, single-digit addition',
  'Class 2': 'FLN Level 3 • Place value, 2-digit arithmetic, 30–45 WPM reading',
  'Class 3': 'FLN Level 4 • Times tables 2–10, 3-digit math, 60 WPM NIPUN Lakshya',
};

// ─── Visual renderer for each card type ─────────────────────────────────────
// Instead of one broken emoji field, render rich visuals per deck type
function CardVisual({ card }: { card: FlashcardItem }) {
  const id = card.deckId;

  // ── COUNTING: show actual dot array for 1-5 ──────────────────────────────
  if (id === 'bal_counting') {
    const count = card.id - 500; // 501→1, 502→2, ...
    const dots = Array(count).fill(0);
    const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {/* Object dots */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {dots.map((_, i) => (
            <div key={i} style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: colors[count - 1],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
            }}>🍎</div>
          ))}
        </div>
        {/* Big numeral */}
        <div style={{ fontSize: '5rem', fontWeight: 900, color: colors[count - 1], lineHeight: 1 }}>
          {count}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          Count the objects above
        </div>
      </div>
    );
  }

  // ── SHAPES: render actual geometric shapes with SVG ─────────────────────
  if (id === 'bal_shapes') {
    const shapeMap: Record<number, React.ReactNode> = {
      301: <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="#fb923c" stroke="#ea580c" strokeWidth="4"/></svg>,
      302: <svg width="120" height="120" viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="4"/></svg>,
      303: <svg width="130" height="120" viewBox="0 0 130 120"><polygon points="65,8 120,112 10,112" fill="#22c55e" stroke="#15803d" strokeWidth="4"/></svg>,
      304: <svg width="150" height="100" viewBox="0 0 150 100"><rect x="8" y="8" width="134" height="84" rx="5" fill="#a855f7" stroke="#7e22ce" strokeWidth="4"/></svg>,
      305: <svg width="120" height="120" viewBox="0 0 120 120"><polygon points="60,5 74,42 114,42 82,66 94,104 60,82 26,104 38,66 6,42 46,42" fill="#f59e0b" stroke="#d97706" strokeWidth="3"/></svg>,
    };
    const corners: Record<number, string> = { 301: '0 corners', 302: '4 equal corners', 303: '3 corners', 304: '4 corners (unequal)', 305: '5 points' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {shapeMap[card.id] || <div style={{ fontSize: '5rem' }}>{card.emoji}</div>}
        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
          {corners[card.id] || ''}
        </div>
      </div>
    );
  }

  // ── COMPARISON: two-column visual comparison ─────────────────────────────
  if (id === 'bal_compare') {
    const comparisons: Record<number, { left: string; right: string; label: string }> = {
      401: { left: '🐘', right: '🐭', label: 'Which is bigger?' },
      402: { left: '🦒', right: '🐢', label: 'Which is taller?' },
      403: { left: '🍎🍎🍎🍎', right: '🍎', label: 'Which has more?' },
      404: { left: '🪨', right: '🪶', label: 'Which is heavier?' },
      405: { left: '🔥', right: '❄️', label: 'Which is hotter?' },
    };
    const c = comparisons[card.id] || { left: '?', right: '?', label: 'Compare' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' }}>{c.label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '16px', padding: '12px 18px', fontSize: '3.5rem', border: '2px solid #86efac', minWidth: '90px' }}>
            {c.left}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#94a3b8' }}>vs</div>
          <div style={{ textAlign: 'center', backgroundColor: '#fff1f2', borderRadius: '16px', padding: '12px 18px', fontSize: '3.5rem', border: '2px solid #fca5a5', minWidth: '90px' }}>
            {c.right}
          </div>
        </div>
      </div>
    );
  }

  // ── OL CHIKI LETTERS: big bold letter with colour block ──────────────────
  if (id === 'c1_olchiki') {
    const letterColors = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b'];
    const idx = card.id - 601;
    const color = letterColors[idx % letterColors.length];
    // Extract just the letter (hindi field holds the Ol Chiki letter character for this deck)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '120px', height: '120px', borderRadius: '24px',
          backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${color}55`,
          fontFamily: 'serif'
        }}>
          <span style={{ fontSize: '5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            {card.hindi}
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: color, backgroundColor: `${color}15`, padding: '3px 12px', borderRadius: '20px' }}>
          Ol Chiki • Sound: {card.pronunciation.split(' ')[0]}
        </div>
      </div>
    );
  }

  // ── NUMBERS 1-10: dot representation + numeral ───────────────────────────
  if (id === 'c1_numbers') {
    const num = card.id - 700; // 701→1, 702→2...
    const dotColors = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b'];
    const color = dotColors[(num - 1) % 10];
    const dots = Array(num).fill(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {/* Dot array in rows of 5 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', maxWidth: '180px' }}>
          {dots.map((_, i) => (
            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 2px 6px ${color}66` }} />
          ))}
        </div>
        {/* Big Arabic numeral */}
        <div style={{ fontSize: '5rem', fontWeight: 900, color, lineHeight: 1 }}>{num}</div>
        {/* Ol Chiki digit */}
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#475569', lineHeight: 1, fontFamily: 'serif' }}>
          {['᱑','᱒','᱓','᱔','᱕','᱖','᱗','᱘','᱙','᱑᱐'][num - 1]}
        </div>
      </div>
    );
  }

  // ── ADDITION facts: equation display ────────────────────────────────────
  if (id === 'c1_addition') {
    const parts = card.hindi.split(/([+−])/);
    const nums = card.hindi.match(/\d+/g) || [];
    const [a, b] = nums.map(Number);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {/* Finger / dot visual */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array(a).fill(0).map((_, i) => <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#f97316' }} />)}
          </div>
          <div style={{ fontSize: '1.8rem', color: '#64748b', fontWeight: 800 }}>+</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array(b).fill(0).map((_, i) => <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />)}
          </div>
        </div>
        {/* Equation text */}
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f2744', letterSpacing: '2px' }}>
          {card.hindi}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Use your fingers to count!</div>
      </div>
    );
  }

  // ── PLACE VALUE: bundle visual ──────────────────────────────────────────
  if (id === 'c2_place') {
    const lineMap: Record<number, { tens: number; ones: number }> = {
      1001: { tens: 1, ones: 0 },
      1002: { tens: 0, ones: 3 },
      1003: { tens: 2, ones: 3 },
      1004: { tens: 4, ones: 7 },
      1005: { tens: 9, ones: 0 },
    };
    const pv = lineMap[card.id] || { tens: 1, ones: 1 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          {/* Tens bundles */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>ᱜᱮᱞ (Tens)</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80px' }}>
              {Array(pv.tens).fill(0).map((_, i) => (
                <div key={i} style={{ width: '18px', height: '44px', backgroundColor: '#3b82f6', borderRadius: '4px', boxShadow: '0 2px 4px #3b82f655', display: 'flex', flexDirection: 'column', gap: '2px', padding: '2px', alignItems: 'center' }}>
                  {Array(5).fill(0).map((_, j) => <div key={j} style={{ width: '10px', height: '6px', backgroundColor: '#bfdbfe', borderRadius: '2px' }} />)}
                </div>
              ))}
              {pv.tens === 0 && <div style={{ color: '#cbd5e1', fontSize: '1.2rem', fontWeight: 700 }}>0</div>}
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', color: '#94a3b8', paddingBottom: '8px' }}>+</div>
          {/* Ones singles */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>ᱢᱤᱫ (Ones)</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80px' }}>
              {Array(pv.ones).fill(0).map((_, i) => (
                <div key={i} style={{ width: '18px', height: '18px', backgroundColor: '#ef4444', borderRadius: '3px', boxShadow: '0 2px 4px #ef444455' }} />
              ))}
              {pv.ones === 0 && <div style={{ color: '#cbd5e1', fontSize: '1.2rem', fontWeight: 700 }}>0</div>}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f2744' }}>{card.hindi.split(' ')[0]}</div>
      </div>
    );
  }

  // ── MULTIPLICATION TABLES: visual grouping ──────────────────────────────
  if (id === 'c3_tables') {
    const match = card.hindi.match(/(\d+)\s*×\s*(\d+)/);
    if (match) {
      const a = Math.min(parseInt(match[1]), 10);
      const b = Math.min(parseInt(match[2]), 10);
      const total = a * b;
      const showDots = total <= 25;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {showDots ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              {Array(b).fill(0).map((_, row) => (
                <div key={row} style={{ display: 'flex', gap: '4px' }}>
                  {Array(a).fill(0).map((_, col) => (
                    <div key={col} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6'][row % 8] }} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '2.5rem' }}>{b} groups of {a}</div>
          )}
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0f2744' }}>{card.hindi}</div>
        </div>
      );
    }
  }

  // ── DIVISION: sharing visual ─────────────────────────────────────────────
  if (id === 'c3_division') {
    const match = card.hindi.match(/(\d+)\s*÷\s*(\d+)/);
    if (match) {
      const dividend = parseInt(match[1]);
      const divisor = parseInt(match[2]);
      const quotient = dividend / divisor;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array(divisor).fill(0).map((_, g) => (
              <div key={g} style={{ backgroundColor: '#f0fdf4', border: '2px solid #86efac', borderRadius: '12px', padding: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '80px', justifyContent: 'center' }}>
                {Array(quotient).fill(0).map((_, i) => (
                  <div key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f2744' }}>{card.hindi.split('÷')[0].trim()} ÷ {divisor}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Share equally into {divisor} groups</div>
        </div>
      );
    }
  }

  // ── DEFAULT: just a big emoji ────────────────────────────────────────────
  return (
    <div style={{ fontSize: '5rem', lineHeight: 1, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.1))' }}>
      {card.emoji}
    </div>
  );
}

// ─── Reveal panel shown after tap ───────────────────────────────────────────
function CardReveal({ card }: { card: FlashcardItem }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      {/* Main Santali answer */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          ᱚᱞ ᱪᱤᱠᱤ • Santali
        </div>
        <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'serif', letterSpacing: '2px', lineHeight: 1.2, textShadow: '0 2px 8px rgba(251,191,36,0.3)' }}>
          {card.santali}
        </div>
        <div style={{ fontSize: '1.1rem', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
          "{card.pronunciation}"
        </div>
      </div>

      {/* Context description */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 14px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          {card.description}
        </div>
      </div>

      {/* NIPUN target */}
      {card.nipunTarget && (
        <div style={{ backgroundColor: 'rgba(59,130,246,0.15)', border: '1px solid rgba(147,197,253,0.25)', borderRadius: '8px', padding: '5px 12px', width: '100%', maxWidth: '320px' }}>
          <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 700 }}>
            🎯 {card.nipunTarget}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const Flashcards: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade>('Class 1');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('c1_numbers');
  const [domainFilter, setDomainFilter] = useState<'All' | 'Literacy' | 'Numeracy'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);

  const gradeDecks: DeckMeta[] = useMemo(() =>
    ALL_DECKS.filter(d => d.grade === selectedGrade && (domainFilter === 'All' || d.domain === domainFilter)),
    [selectedGrade, domainFilter]
  );

  const activeDeck: DeckMeta | undefined = useMemo(() =>
    ALL_DECKS.find(d => d.id === selectedDeckId) || gradeDecks[0],
    [selectedDeckId, gradeDecks]
  );

  const currentCards = activeDeck?.cards || [];
  const currentCard = currentCards[currentIndex];
  const progressPercent = currentCards.length > 0 ? ((currentIndex + 1) / currentCards.length) * 100 : 0;
  const masteredCount = currentCards.filter(c => mastered.has(c.id)).length;
  const isMastered = currentCard ? mastered.has(currentCard.id) : false;

  const advance = (dir: 'next' | 'prev') => {
    sfx.playTap();
    setSlideDir(dir === 'next' ? 'left' : 'right');
    setRevealed(false);
    setTimeout(() => {
      setCurrentIndex(prev => dir === 'next'
        ? (prev + 1) % currentCards.length
        : (prev - 1 + currentCards.length) % currentCards.length
      );
      setSlideDir(null);
    }, 180);
  };

  const handleGradeChange = (grade: Grade) => {
    sfx.playTap();
    setSelectedGrade(grade);
    setCurrentIndex(0);
    setRevealed(false);
    setMastered(new Set());
    const first = ALL_DECKS.find(d => d.grade === grade);
    if (first) setSelectedDeckId(first.id);
  };

  const handleDeckChange = (deckId: string) => {
    sfx.playTap();
    setSelectedDeckId(deckId);
    setCurrentIndex(0);
    setRevealed(false);
  };

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const willMaster = !mastered.has(currentCard.id);
    if (willMaster) {
      sfx.playSuccess();
    } else {
      sfx.playTap();
    }
    setMastered(prev => {
      const n = new Set(prev);
      n.has(currentCard.id) ? n.delete(currentCard.id) : n.add(currentCard.id);
      return n;
    });
  };

  const playAudio = (text: string, lang = 'hi-IN', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playVoicePing();
    speakText(text, { lang, rate: 0.85 });
  };

  // Animation style
  const cardAnimStyle: React.CSSProperties = {
    transition: slideDir ? 'transform 0.18s ease, opacity 0.18s ease' : 'none',
    transform: slideDir === 'left' ? 'translateX(-40px)' : slideDir === 'right' ? 'translateX(40px)' : 'none',
    opacity: slideDir ? 0 : 1,
  };

  return (
    <div className="fade-in" style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fed7aa', color: '#c05621', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          🃏 NIPUN Bharat Bilingual Flashcard Decks
        </div>
        <h1 style={{ color: '#0f2744', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px' }}>
          Visual Vocabulary Cards
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
          Tap card to reveal Santali Ol Chiki answer • Grade-wise NIPUN content
        </p>
      </div>

      {/* Grade tabs */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '16px', gap: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {GRADES.map(g => (
            <button key={g} onClick={() => handleGradeChange(g)}
              style={{ padding: '8px 14px', borderRadius: '12px', border: 'none', backgroundColor: selectedGrade === g ? '#0f2744' : 'transparent', color: selectedGrade === g ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', transition: 'all 0.15s' }}>
              {GRADE_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {/* NIPUN badge */}
      <div style={{ backgroundColor: '#f0f9ff', borderRadius: '10px', padding: '8px 14px', border: '1px solid #bae6fd', fontSize: '0.8rem', color: '#0369a1', textAlign: 'center', fontWeight: 600 }}>
        🎯 <strong>{selectedGrade}</strong> • {GRADE_NIPUN[selectedGrade]}
      </div>

      {/* Domain filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {(['All', 'Literacy', 'Numeracy'] as const).map(d => (
          <button key={d} onClick={() => { setDomainFilter(d); setCurrentIndex(0); setRevealed(false); }}
            style={{ padding: '6px 14px', borderRadius: '20px', border: domainFilter === d ? '2px solid #0f2744' : '1px solid #cbd5e1', backgroundColor: domainFilter === d ? '#0f2744' : '#fff', color: domainFilter === d ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            {d === 'All' ? '📦 All' : d === 'Literacy' ? '📖 Literacy' : '🔢 Numeracy'}
          </button>
        ))}
      </div>

      {/* Deck pills */}
      {gradeDecks.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
          {gradeDecks.map(deck => (
            <button key={deck.id} onClick={() => handleDeckChange(deck.id)}
              style={{ padding: '6px 12px', borderRadius: '20px', border: selectedDeckId === deck.id ? '2px solid #ed8936' : '1px solid #cbd5e1', backgroundColor: selectedDeckId === deck.id ? '#fffaf0' : '#fff', color: selectedDeckId === deck.id ? '#c05621' : '#475569', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {deck.emoji} {deck.label}
              <span style={{ fontSize: '0.68rem', backgroundColor: selectedDeckId === deck.id ? '#fed7aa' : '#f1f5f9', color: selectedDeckId === deck.id ? '#c05621' : '#64748b', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                {deck.cards.length}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', fontSize: '0.85rem' }}>
          No decks for this combination — try "All Decks"
        </div>
      )}

      {/* Deck info bar */}
      {activeDeck && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '7px 12px', border: '1px solid #e2e8f0', fontSize: '0.78rem', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontWeight: 700, color: '#0f2744' }}>{activeDeck.emoji} {activeDeck.label}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              🎯 {activeDeck.nipunBadge}
            </span>
            {masteredCount > 0 && (
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                ✅ {masteredCount}/{currentCards.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── THE CARD ── */}
      {currentCard ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '7px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: isMastered ? '#22c55e' : '#ed8936', borderRadius: '10px', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', minWidth: '52px', textAlign: 'right' }}>
              {currentIndex + 1}/{currentCards.length}
            </span>
          </div>

          {/* Card container — NO 3D CSS flip, just show/reveal */}
          <div style={{ width: '100%', maxWidth: '500px', ...cardAnimStyle }}>
            <div
              style={{
                backgroundColor: revealed ? '#1e293b' : '#ffffff',
                borderRadius: '20px',
                border: isMastered ? '2.5px solid #22c55e' : revealed ? '2px solid #334155' : '2px solid #fed7aa',
                boxShadow: revealed
                  ? '0 12px 32px rgba(0,0,0,0.22)'
                  : '0 8px 24px rgba(237,137,54,0.12)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={() => {
                sfx.playFlip();
                setRevealed(r => !r);
              }}
            >
              {/* TOP LABEL ROW */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 8px', borderBottom: `1px solid ${revealed ? '#334155' : '#f1f5f9'}` }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: revealed ? '#94a3b8' : '#94a3b8' }}>
                  {activeDeck?.domain === 'Literacy' ? '📖 Literacy' : '🔢 Numeracy'} • {selectedGrade}
                </span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {isMastered && <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700 }}>✅ Got it</span>}
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>#{currentIndex + 1}</span>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px', gap: '14px', transition: 'all 0.3s ease' }}>
                {!revealed ? (
                  /* ── FRONT: Visual + Hindi ── */
                  <>
                    <CardVisual card={currentCard} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f2744', lineHeight: 1.2 }}>
                        {/* For Ol Chiki letter cards, show "What sound?" instead of the letter again */}
                        {currentCard.deckId === 'c1_olchiki' ? 'What sound does this make?' : currentCard.hindi}
                      </div>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff7ed', color: '#c05621', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #fed7aa' }}>
                      👆 Tap to reveal Santali Ol Chiki
                    </div>
                  </>
                ) : (
                  /* ── REVEALED: Santali answer ── */
                  <CardReveal card={currentCard} />
                )}
              </div>

              {/* BOTTOM ACTION ROW */}
              <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', borderTop: `1px solid ${revealed ? '#334155' : '#f1f5f9'}`, backgroundColor: revealed ? '#0f172a' : '#fafafa' }}
                onClick={e => e.stopPropagation()}>
                {!revealed ? (
                  <>
                    <button onClick={e => playAudio(currentCard.hindi, 'hi-IN', e)}
                      style={{ flex: 1, backgroundColor: '#2f855a', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                      🔊 Hindi
                    </button>
                    <button onClick={toggleMastered}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: isMastered ? '1px solid #22c55e' : '1px solid #cbd5e1', backgroundColor: isMastered ? '#dcfce7' : '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', color: isMastered ? '#166534' : '#475569', whiteSpace: 'nowrap' }}>
                      {isMastered ? '✅ Got it!' : '⬜ Mark done'}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={e => playAudio(currentCard.pronunciation, 'hi-IN', e)}
                      style={{ flex: 1, backgroundColor: '#ed8936', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                      🔊 Pronounce Santali
                    </button>
                    <button onClick={toggleMastered}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: isMastered ? '1px solid #22c55e' : '1px solid #4b5563', backgroundColor: isMastered ? '#166534' : '#1e293b', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', color: isMastered ? '#dcfce7' : '#94a3b8', whiteSpace: 'nowrap' }}>
                      {isMastered ? '✅ Got it!' : '⬜ Mark done'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => advance('prev')}
              style={{ padding: '11px 20px', borderRadius: '14px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#0f2744', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
              ← Prev
            </button>
            <button onClick={() => { setRevealed(false); const r = Math.floor(Math.random() * currentCards.length); setCurrentIndex(r); }}
              style={{ padding: '11px 14px', borderRadius: '14px', border: '1px solid #fed7aa', backgroundColor: '#fffaf0', color: '#c05621', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              🔀
            </button>
            <button onClick={() => advance('next')}
              style={{ padding: '11px 22px', borderRadius: '14px', border: 'none', backgroundColor: '#ed8936', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(237,137,54,0.3)' }}>
              Next →
            </button>
          </div>

          {/* Mastery bar */}
          {masteredCount > 0 && (
            <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#f0fdf4', borderRadius: '10px', padding: '8px 14px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#dcfce7', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(masteredCount / currentCards.length) * 100}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: '10px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700, whiteSpace: 'nowrap' }}>
                ✅ {masteredCount}/{currentCards.length} mastered
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🃏</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f2744' }}>Select a deck above to start!</div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
