import React, { useState } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';
import {
  CURRICULUM,
  LESSON_DB,
  getLessonKey,
  getTopicsForGradeSubject,
  STEP_COLORS,
  LessonData,
  LessonSection,
  AssessmentPrompt
} from '../data/nipun_lessons_data';

const Lessons: React.FC = () => {
  const [grade, setGrade] = useState('Class 1');
  const [subject, setSubject] = useState('ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Foundational Literacy)');
  const [topicIndex, setTopicIndex] = useState(0);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(1); // Open step 1 by default
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  const availableSubjects = Object.keys(CURRICULUM[grade] || {});
  const availableTopics = getTopicsForGradeSubject(grade, subject);

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    const firstSubject = Object.keys(CURRICULUM[newGrade] || {})[0] || '';
    setSubject(firstSubject);
    setTopicIndex(0);
    setLesson(null);
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    setTopicIndex(0);
    setLesson(null);
  };

  const handleGenerate = async () => {
    sfx.playFlip();
    setIsGenerating(true);
    setShowAnswers({});

    // Local instant retrieval from complete database
    const key = getLessonKey(grade, subject, topicIndex);
    const preset = LESSON_DB[key];

    if (preset) {
      await new Promise(r => setTimeout(r, 400));
      setLesson(preset);
      setIsGenerating(false);
      sfx.playSuccess();
      return;
    }

    // Fallback if key missing
    const subjectKey = subject.includes('Literacy') ? 'Literacy' : 'Numeracy';
    const fallbackKey = `${grade}||${subjectKey}||0`;
    const fallback = LESSON_DB[fallbackKey];
    setLesson(fallback || null);
    setIsGenerating(false);
  };

  const playVoice = (text: string) => {
    sfx.playVoicePing();
    speakText(text, { rate: 0.85 });
  };

  const toggleSection = (idx: number) => {
    sfx.playTap();
    setOpenSection(openSection === idx ? null : idx);
  };

  const toggleAnswer = (idx: number) => {
    if (!showAnswers[idx]) sfx.playSuccess();
    else sfx.playTap();
    setShowAnswers(s => ({ ...s, [idx]: !s[idx] }));
  };

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    sfx.playTap();
    if (typeof window !== 'undefined' && (window as any).AndroidVoiceBridge?.print) {
      (window as any).AndroidVoiceBridge.print();
    } else {
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        setTimeout(() => setIsPrinting(false), 1000);
      }, 200);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header Banner */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              🏛️ NIPUN Bharat Mission
            </span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              ✨ Panchaadi 5-Step Pedagogy
            </span>
            <span style={{ backgroundColor: '#fdf4ff', color: '#7e22ce', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              🏹 Santali MTB-MLE
            </span>
          </div>
          <h1 style={{ color: '#0f2744', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            📚 NIPUN Bharat Lesson Studio
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Generate structured 5-part Panchaadi lesson plans with dual Hindi & Santali Ol Chiki scripts, teacher talk scripts, and assessments.
          </p>
        </div>
      </div>

      {/* Selection Control Panel */}
      <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1rem' }}>

          {/* Grade Level */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Grade Level:
            </label>
            <select value={grade} onChange={e => handleGradeChange(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, color: '#0f2744', backgroundColor: '#f8fafc', outline: 'none' }}>
              {Object.keys(CURRICULUM).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              FLN Domain:
            </label>
            <select value={subject} onChange={e => handleSubjectChange(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f2744', backgroundColor: '#f8fafc', outline: 'none' }}>
              {availableSubjects.map(s => (
                <option key={s} value={s}>{s.includes('Literacy') ? '📖' : '🔢'} {s}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              NIPUN Lakshya / Lesson Topic:
            </label>
            <select value={topicIndex} onChange={e => { setTopicIndex(Number(e.target.value)); setLesson(null); }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, color: '#c05621', backgroundColor: '#f8fafc', outline: 'none' }}>
              {availableTopics.map((t: string, i: number) => (
                <option key={i} value={i}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NIPUN Target badge */}
        {availableTopics[topicIndex] && (
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', fontSize: '0.82rem', color: '#0369a1' }}>
            <strong>📌 Selected:</strong> {grade} → {subject.includes('Literacy') ? 'ᱚᱞ ᱪᱤᱠᱤ ᱮᱞᱠᱷᱟᱹ (Literacy)' : 'ᱮᱞᱠᱷᱟ ᱵᱩᱡᱷᱟᱣ (Numeracy)'} → <em>{availableTopics[topicIndex]}</em>
          </div>
        )}

        <button onClick={handleGenerate} disabled={isGenerating}
          style={{ width: '100%', backgroundColor: isGenerating ? '#64748b' : '#0f2744', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: isGenerating ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(15,39,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
          {isGenerating ? '⏳ Generating Panchaadi Lesson Plan...' : '✨ Generate 5-Part NIPUN Lesson Plan ➔'}
        </button>
      </div>

      {/* Lesson Output */}
      {lesson && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Official Printable Sheet Header */}
          <div style={{ display: isPrinting ? 'block' : 'none', borderBottom: '2px solid #0f2744', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Government of Jharkhand • Department of School Education & Literacy
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2744' }}>
              PALASH MTB-MLE: 5-Part Panchaadi Bilingual Lesson Plan
            </div>
          </div>

          {/* Lesson Title Card */}
          <div className="print-card" style={{ background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)', borderRadius: '16px', padding: '1.5rem', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                  {lesson.grade} • {lesson.subject} • NIPUN Bharat MTB-MLE
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  📄 {lesson.title_hin}
                </h2>
                <div style={{ fontSize: '1rem', color: '#fed7aa', fontWeight: 700, marginTop: '4px', fontFamily: 'serif' }}>
                  {lesson.title_sat}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={handlePrint} className="no-print" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', color: '#ffffff', cursor: 'pointer' }}>
                  🖨️ Print / PDF
                </button>
              </div>
            </div>

            {/* NIPUN Target */}
            <div style={{ marginTop: '1rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#bae6fd', border: '1px solid rgba(255,255,255,0.1)' }}>
              🎯 <strong>NIPUN Lakshya:</strong> {lesson.nipun_target}
            </div>

            {/* Materials */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>📦 Materials Needed:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {lesson.materials.map((m, i) => (
                  <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#e2e8f0' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Panchaadi Steps (Accordion) */}
          {lesson.sections.map((section) => {
            const colors = STEP_COLORS[section.step];
            const isOpen = isPrinting || openSection === section.step;
            return (
              <div key={section.step} style={{ borderRadius: '14px', border: `1px solid ${colors.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(section.step)}
                  style={{ width: '100%', backgroundColor: colors.bg, border: 'none', padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: colors.label, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Step {section.step} • ⏱️ {section.duration}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: colors.header }}>
                        {section.step_name} ({section.step_sat})
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.2rem', color: colors.label, fontWeight: 700 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {/* Content */}
                {isOpen && (
                  <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Hindi Content */}
                    <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: `4px solid ${colors.header}` }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                        🇮🇳 Teacher Talk / Instructions (Hindi):
                      </div>
                      <div style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {section.hin}
                      </div>
                    </div>

                    {/* Santali Content */}
                    <div style={{ padding: '12px 14px', backgroundColor: '#fffaf0', borderRadius: '10px', borderLeft: '4px solid #ed8936' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c05621', textTransform: 'uppercase' }}>
                          🏹 Santali Translation / Ol Chiki (ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ):
                        </div>
                        <button
                          onClick={() => playVoice(section.sat)}
                          className="no-print"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fed7aa', border: 'none', borderRadius: '6px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9a3412', cursor: 'pointer' }}>
                          🔊 Speak
                        </button>
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#9a3412', lineHeight: '1.6', fontFamily: 'serif', whiteSpace: 'pre-line', fontWeight: 600 }}>
                        {section.sat}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Assessment Prompts */}
          {lesson.assessment_prompts && lesson.assessment_prompts.length > 0 && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.3rem' }}>📝</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f2744' }}>
                    Formative Assessment / Quiz Prompts (ᱢᱩᱪᱟᱹᱫ ᱠᱩᱠᱞᱤ)
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Ask these quick bilingual check-for-understanding questions to assess student mastery:
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lesson.assessment_prompts.map((q: AssessmentPrompt, i: number) => (
                  <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                          Q{i + 1}: {q.question_hin}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#ea580c', fontFamily: 'serif', marginTop: '2px', fontWeight: 600 }}>
                          {q.question_sat}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => playVoice(q.question_sat)}
                          className="no-print"
                          style={{ backgroundColor: '#ffedd5', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', cursor: 'pointer' }}>
                          🔊
                        </button>
                        <button
                          onClick={() => toggleAnswer(i)}
                          className="no-print"
                          style={{ backgroundColor: showAnswers[i] ? '#dcfce7' : '#e2e8f0', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: showAnswers[i] ? '#15803d' : '#475569', cursor: 'pointer' }}>
                          {showAnswers[i] ? 'Hide' : 'Answer'}
                        </button>
                      </div>
                    </div>

                    {(showAnswers[i] || isPrinting) && (
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', fontSize: '0.82rem', color: '#15803d' }}>
                        <div><strong>उत्तर (Hindi):</strong> {q.answer_hin}</div>
                        <div style={{ fontFamily: 'serif', marginTop: '2px' }}><strong>Santali:</strong> {q.answer_sat}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Lessons;
