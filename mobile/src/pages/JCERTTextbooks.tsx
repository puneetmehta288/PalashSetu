import React, { useState, useEffect } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';
import { ALL_JCERT_TEXTBOOKS, GradeLevel, SubjectType, FullOfficialBook, BookChapter } from '../data/jcert_full_textbooks_data';
import { adaptTextbookParagraph, getActiveTribalLanguage } from '../services/tribalCurriculumAdapter';
import { TribalLanguage, TRIBAL_LANGUAGES } from '../types';
import { translateHindiToHo } from '../data/ho_dictionary';
import { translateHindiToMundari } from '../data/mundari_dictionary';

const JCERTTextbooks: React.FC = () => {
  const [tribalLang, setTribalLang] = useState<TribalLanguage>(getActiveTribalLanguage);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 1');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('All');
  const [selectedBookId, setSelectedBookId] = useState<string>('g1_math_full');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('g1_m_c1');
  const [activePlayingId, setActivePlayingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const onLangChanged = (e: any) => {
      const detail = e.detail || localStorage.getItem('palash_selected_language');
      if (detail === 'hoc_Deva' || detail === 'ho') setTribalLang('ho');
      else if (detail === 'unx_Deva' || detail === 'mundari') setTribalLang('mundari');
      else setTribalLang('santali');
    };
    window.addEventListener('palash_language_changed', onLangChanged);
    return () => window.removeEventListener('palash_language_changed', onLangChanged);
  }, []);

  const handleLanguageSelect = (lang: TribalLanguage) => {
    sfx.playTap();
    setTribalLang(lang);
    const code = lang === 'ho' ? 'hoc_Deva' : lang === 'mundari' ? 'unx_Deva' : 'sat_Olck';
    localStorage.setItem('palash_selected_language', code);
    window.dispatchEvent(new CustomEvent('palash_language_changed', { detail: code }));
  };

  const getTranslatedTitle = (titleHin: string, titleSat: string) => {
    if (tribalLang === 'santali') return titleSat;
    if (tribalLang === 'ho') return translateHindiToHo(titleHin).translation || titleHin;
    return translateHindiToMundari(titleHin).translation || titleHin;
  };

  // 1. Filter books by Grade and Subject
  const booksInGrade = ALL_JCERT_TEXTBOOKS.filter(b => b.grade === selectedGrade);
  const filteredBooks = booksInGrade.filter(b => {
    if (selectedSubject === 'All') return true;
    return b.subject === selectedSubject;
  });

  const selectedBook: FullOfficialBook = ALL_JCERT_TEXTBOOKS.find(b => b.id === selectedBookId) || filteredBooks[0] || ALL_JCERT_TEXTBOOKS[0];
  
  // 2. Filter chapters by search if any
  const availableChapters = selectedBook.chapters;
  const currentChapter: BookChapter = availableChapters.find(c => c.id === selectedChapterId) || availableChapters[0];

  const handleSelectGrade = (grade: GradeLevel) => {
    if (grade !== 'Grade 1') return;
    sfx.playTap();
    setSelectedGrade(grade);
    setSelectedSubject('All');
    const firstBook = ALL_JCERT_TEXTBOOKS.find(b => b.grade === grade);
    if (firstBook) {
      setSelectedBookId(firstBook.id);
      if (firstBook.chapters.length > 0) {
        setSelectedChapterId(firstBook.chapters[0].id);
      }
    }
  };

  const handleSelectBook = (bookId: string) => {
    sfx.playTap();
    setSelectedBookId(bookId);
    const book = ALL_JCERT_TEXTBOOKS.find(b => b.id === bookId);
    if (book && book.chapters.length > 0) {
      setSelectedChapterId(book.chapters[0].id);
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    sfx.playTap();
    setSelectedChapterId(chapterId);
  };

  const handlePlayAudio = (text: string, id: number, lang: TribalLanguage = tribalLang) => {
    sfx.playVoicePing();
    setActivePlayingId(id);
    speakText(text, {
      rate: 0.85,
      lang: lang === 'santali' ? 'sat' : 'hi-IN',
      onEnd: () => setActivePlayingId(null)
    });
  };

  const handlePrint = () => {
    sfx.playTap();
    window.print();
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1060px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ─── Top Header & Badges (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              📖 Official JCERT Jharkhand Textbooks
            </span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              {tribalLang === 'ho' ? '🏹 Complete Syllabus in ᱦᱳ (Warang Citi & Devanagari)' : tribalLang === 'mundari' ? '🏹 Complete Syllabus in ᱢᱩᱱᱰᱟᱨᱤ (Mundari Nagari & Bani)' : '🏹 Complete Syllabus in ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ'}
            </span>
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            📚 JCERT State Textbooks Library ({tribalLang === 'ho' ? 'जेसीईआरटी पोथी' : tribalLang === 'mundari' ? 'जेसीईआरटी पुती' : 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱩᱛᱷᱤ'})
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Complete primary textbooks for Balvatika, Class 1, 2, and 3 localized in {tribalLang === 'ho' ? 'Ho (Kolhan Division)' : tribalLang === 'mundari' ? 'Mundari (South Chotanagpur)' : 'Santali Ol Chiki'}.
          </p>
        </div>

        {/* Print / Export Action Button */}
        <button
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1a365d',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(26,54,93,0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>🖨️ Print Chapter Handout (A4 PDF)</span>
        </button>
      </div>

      {/* ─── TRIBAL LANGUAGE SWITCHER PILLS (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
          🗣️ Textbook Language:
        </span>
        {(['santali', 'ho', 'mundari'] as TribalLanguage[]).map(lang => {
          const isSel = tribalLang === lang;
          const label = lang === 'santali' ? '🟢 Santali (ᱚᱞ ᱪᱤᱠᱤ)' : lang === 'ho' ? '🔵 Ho (ᱦᱳ / Kolhan)' : '🟣 Mundari (मुंडारी / Bani)';
          return (
            <button
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              style={{
                backgroundColor: isSel ? '#0f2744' : '#ffffff',
                color: isSel ? '#ffffff' : '#334155',
                border: isSel ? '2px solid #0f2744' : '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ─── STEP 1: CLASS SELECTION BAR (Hidden in Print) ─── */}
      <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2744', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1️⃣ Select Class Level (ᱪᱟᱱᱟᱪ ᱵᱟᱪᱷᱟᱣ):
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Current Class: <strong>{selectedGrade}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          {(['Balvatika', 'Grade 1', 'Grade 2', 'Grade 3'] as GradeLevel[]).map(grade => {
            const isSelected = selectedGrade === grade;
            const gradeTitle = grade === 'Balvatika' ? '🧸 Balvatika' : grade === 'Grade 1' ? '🏫 Class 1' : grade === 'Grade 2' ? '📖 Class 2' : '🧮 Class 3';
            return (
              <button
                key={grade}
                onClick={() => handleSelectGrade(grade)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #ed8936' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#0f2744' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  opacity: 1,
                  textAlign: 'center',
                  boxShadow: isSelected ? '0 4px 12px rgba(15,39,68,0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>{gradeTitle}</div>
                <div style={{ fontSize: '0.72rem', opacity: isSelected ? 0.85 : 0.6, marginTop: '2px' }}>
                  {grade === 'Balvatika' ? 'ᱵᱟᱞᱣᱟᱴᱤᱠᱟ' : grade === 'Grade 1' ? '᱑ ᱪᱟᱱᱟᱪ' : grade === 'Grade 2' ? '᱒ ᱪᱟᱱᱟᱪ' : '᱓ ᱪᱟᱱᱟᱪ'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── STEP 2: PICK BOOK (Hidden in Print) ─── */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2744' }}>
            2️⃣ Pick JCERT Textbook ({filteredBooks.length} books in {selectedGrade}):
          </div>

          {/* Subject Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['All', 'Mathematics', 'Language', 'EVS'] as SubjectType[]).map(subj => (
              <button
                key={subj}
                onClick={() => { sfx.playTap(); setSelectedSubject(subj); }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: selectedSubject === subj ? '#3182ce' : '#e2e8f0',
                  color: selectedSubject === subj ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  cursor: 'pointer'
                }}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Books Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {filteredBooks.map(b => (
            <button
              key={b.id}
              onClick={() => handleSelectBook(b.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                border: selectedBookId === b.id ? '2px solid #ed8936' : '1px solid #cbd5e1',
                backgroundColor: selectedBookId === b.id ? '#fffaf0' : '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: selectedBookId === b.id ? '0 4px 14px rgba(237,137,54,0.18)' : '0 2px 4px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '52px',
                  backgroundColor: b.cover_color,
                  color: '#ffffff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                {b.icon}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                  {b.book_code} • {b.chapters.length} Chapters
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: selectedBookId === b.id ? '#c05621' : '#0f2744', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title_hin}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#d97706', fontFamily: 'Noto Sans Ol Chiki, sans-serif', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title_sat}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── STEP 3: CHAPTER SELECTOR CAROUSEL (Hidden in Print) ─── */}
      <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2744' }}>
            3️⃣ Select Chapter in {selectedBook.title_hin} ({availableChapters.length} Total Chapters):
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {availableChapters.map(ch => (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch.id)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: selectedChapterId === ch.id ? '2px solid #ed8936' : '1px solid #cbd5e1',
                backgroundColor: selectedChapterId === ch.id ? '#fffaf0' : '#f8fafc',
                color: selectedChapterId === ch.id ? '#c05621' : '#334155',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'left',
                boxShadow: selectedChapterId === ch.id ? '0 2px 8px rgba(237,137,54,0.15)' : 'none'
              }}
            >
              <div>Ch {ch.chapter_no}: {ch.title_hin.slice(0, 22)}...</div>
              <div style={{ fontSize: '0.74rem', color: '#d97706', marginTop: '2px', fontFamily: tribalLang === 'santali' ? 'Noto Sans Ol Chiki, sans-serif' : 'inherit' }}>
                {getTranslatedTitle(ch.title_hin, ch.title_sat).slice(0, 18)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── STEP 4: DUAL COLUMN BILINGUAL CHAPTER READER ─── */}
      <div
        className="printable-document"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #cbd5e1',
          padding: '1.75rem',
          boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* Official JCERT Document Header */}
        <div style={{ borderBottom: '2px solid #0f2744', paddingBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c05621', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              झारखंड शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद् (JCERT) • PALASH MTB-MLE पाठ्यपुस्तक
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2744', margin: '4px 0 2px 0' }}>
              {selectedBook.title_hin} — अध्याय {currentChapter.chapter_no}: {currentChapter.title_hin}
            </h2>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706', fontFamily: tribalLang === 'santali' ? 'Noto Sans Ol Chiki, sans-serif' : 'inherit' }}>
              {getTranslatedTitle(selectedBook.title_hin, selectedBook.title_sat)} — {tribalLang === 'santali' ? 'ᱦᱟᱹᱴᱤᱧ' : 'हाटिंञ'} {currentChapter.chapter_no}: {getTranslatedTitle(currentChapter.title_hin, currentChapter.title_sat)}
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
            <div><strong>{selectedBook.grade}</strong> • {selectedBook.subject}</div>
            <div><strong>अध्याय / Chapter:</strong> {currentChapter.chapter_no} of {selectedBook.chapters.length}</div>
            <div style={{ color: '#059669', fontWeight: 700 }}>
              हिन्दी ↔ {tribalLang === 'ho' ? 'ᱦᱳ / हो भाषा' : tribalLang === 'mundari' ? 'ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी' : 'ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ'}
            </div>
          </div>
        </div>

        {/* Printable Student Details Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.82rem', color: '#475569' }}>
          <div>विद्यार्थी का नाम: ____________________</div>
          <div>दिनांक: ____________________</div>
          <div>विद्यालय: ____________________</div>
          <div>रोल नं: ________</div>
        </div>

        {/* Visual Banner if present */}
        {currentChapter.visual_banner && (
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '1.3rem', border: '1px dashed #cbd5e1' }}>
            {currentChapter.visual_banner}
          </div>
        )}

        {/* Side-by-Side Dual Column Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#0f2744', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}>
            <div>🇮🇳 राज्य पाठ्यपुस्तक (हिन्दी मूल पाठ)</div>
            <div>
              {tribalLang === 'ho'
                ? '🏹 ᱦᱳ / हो भाषा पाठ (Ho Reader • Kolhan)'
                : tribalLang === 'mundari'
                ? '🏹 ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी पाठ (Mundari Reader • Chotanagpur)'
                : '🏹 ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ ᱯᱟᱲᱦᱟᱣ (Santali Reader)'}
            </div>
          </div>

          {currentChapter.paragraphs.map((p, idx) => {
            const adapted = adaptTextbookParagraph(p, tribalLang);
            return (
              <div
                key={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  border: '1px solid #edf2f7',
                  alignItems: 'start',
                  position: 'relative'
                }}
              >
                {/* Left Column: Hindi */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                      {idx + 1}
                    </span>
                    {p.visual && <span style={{ fontSize: '1rem' }}>{p.visual}</span>}
                  </div>
                  <div style={{ fontSize: '0.98rem', lineHeight: 1.6, color: '#1e293b', fontWeight: 500 }}>
                    {p.hindi}
                  </div>
                </div>

                {/* Right Column: Tribal Reader (Santali / Ho / Mundari) */}
                <div style={{ borderLeft: '2px solid #fed7aa', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                      fontSize: '1.05rem',
                      lineHeight: 1.6,
                      color: '#9a3412',
                      fontWeight: 700,
                      fontFamily: tribalLang === 'santali' ? 'Noto Sans Ol Chiki, sans-serif' : 'inherit'
                    }}>
                      {adapted.text}
                    </div>

                    {/* 🔊 Audio Speaker Button (Hidden in Print) */}
                    <button
                      className="no-print"
                      onClick={() => handlePlayAudio(adapted.text, p.id, tribalLang)}
                      title={`Play ${tribalLang} pronunciation aloud`}
                      style={{
                        backgroundColor: activePlayingId === p.id ? '#c2410c' : '#fffaf0',
                        border: '1px solid #ffedd5',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: activePlayingId === p.id ? '#ffffff' : '#ea580c',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0
                      }}
                    >
                      <span>{activePlayingId === p.id ? '🔊 Playing' : '🔊 Pronounce'}</span>
                    </button>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                    🗣️ {adapted.pronunciation}
                  </div>

                  {/* Word-level vocabulary tags */}
                  {p.vocab && p.vocab.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {p.vocab.map((v, vi) => {
                        const targetWord = tribalLang === 'ho'
                          ? (translateHindiToHo(v.hin).translation || v.sat)
                          : tribalLang === 'mundari'
                          ? (translateHindiToMundari(v.hin).translation || v.sat)
                          : v.sat;
                        return (
                          <span key={vi} style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                            {v.hin} = {targetWord}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Practice Drill or Exercise Box if present */}
        {currentChapter.exercise && (
          <div style={{ marginTop: '0.5rem', padding: '12px 16px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.85rem', marginBottom: '4px' }}>
              ✍️ कक्षा अभ्यास एवं मूल्यांकन (Classroom Practice Drill):
            </div>
            <div style={{ fontSize: '0.88rem', color: '#78350f', fontWeight: 600 }}>
              {currentChapter.exercise.question_hin}
            </div>
            <div style={{
              fontSize: '0.88rem',
              color: '#b45309',
              fontFamily: tribalLang === 'santali' ? 'Noto Sans Ol Chiki, sans-serif' : 'inherit',
              marginTop: '2px',
              fontWeight: 700
            }}>
              {tribalLang === 'ho'
                ? translateHindiToHo(currentChapter.exercise.question_hin).translation
                : tribalLang === 'mundari'
                ? translateHindiToMundari(currentChapter.exercise.question_hin).translation
                : currentChapter.exercise.question_sat}
            </div>
          </div>
        )}
      </div>

      {/* ─── PRINT CSS STYLES ─── */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-document {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
};

export default JCERTTextbooks;
