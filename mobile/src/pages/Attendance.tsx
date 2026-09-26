import React, { useState, useEffect, useMemo } from 'react';
import {
  attendanceService,
  ClassRoom,
  Student,
  DailyAttendanceRecord,
  AttendanceStatus,
} from '../services/attendanceService';
import { authService, TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';
import { useTheme } from '../context/ThemeContext';

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const Attendance: React.FC = () => {
  const { isDarkMode } = useTheme();

  // Active Teacher Profile
  const [activeTeacher] = useState<TeacherProfile | null>(() => authService.getActiveProfile());

  // 1. Selection State
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('c_1');
  const [selectedDate, setSelectedDate] = useState<string>(() => getLocalDateString());

  // 2. Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // 3. Modals State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 4. Form States (Add)
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState<number>(1);
  const [newStudentGender, setNewStudentGender] = useState<'M' | 'F' | 'Other'>('M');
  const [newStudentLang, setNewStudentLang] = useState<'Santali' | 'Ho' | 'Mundari' | 'Hindi'>('Santali');

  // Form States (Edit)
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentRoll, setEditStudentRoll] = useState<number>(1);
  const [editStudentGender, setEditStudentGender] = useState<'M' | 'F' | 'Other'>('M');
  const [editStudentLang, setEditStudentLang] = useState<'Santali' | 'Ho' | 'Mundari' | 'Hindi'>('Santali');

  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Class 1');

  // Load Classes on mount & match active teacher's assigned grade
  useEffect(() => {
    const loadedClasses = attendanceService.getClasses();
    setClasses(loadedClasses);
    if (loadedClasses.length > 0) {
      if (activeTeacher?.assignedGrade) {
        const matched = loadedClasses.find(c => c.grade.toLowerCase().includes(activeTeacher.assignedGrade.toLowerCase()) || activeTeacher.assignedGrade.toLowerCase().includes(c.grade.toLowerCase()));
        if (matched) {
          setSelectedClassId(matched.id);
          return;
        }
      }
      if (!loadedClasses.find(c => c.id === selectedClassId)) {
        setSelectedClassId(loadedClasses[0].id);
      }
    }
  }, [activeTeacher]);

  // Reload Students & Attendance Record whenever class, date, or active teacher changes
  useEffect(() => {
    if (!selectedClassId) return;
    const loadedStudents = attendanceService.getStudents(selectedClassId);
    setStudents(loadedStudents);

    const record = attendanceService.getAttendanceRecord(selectedClassId, selectedDate, activeTeacher?.id);
    setStatuses(record.statuses || {});
    setIsDirty(false);
  }, [selectedClassId, selectedDate, activeTeacher?.id]);

  // Handle Switching Class with Unsaved Changes Guard
  const handleSelectClass = (classId: string) => {
    if (classId === selectedClassId) return;
    if (isDirty) {
      if (!window.confirm('⚠️ You have unsaved attendance changes for this date. Do you want to discard them and switch classes?')) {
        return;
      }
    }
    sfx.playTap();
    setIsDirty(false);
    setSelectedClassId(classId);
  };

  // Handle Switching Date with Unsaved Changes Guard
  const handleSelectDate = (dateStr: string) => {
    if (dateStr === selectedDate) return;
    if (isDirty) {
      if (!window.confirm('⚠️ You have unsaved attendance changes. Do you want to discard them and switch date?')) {
        return;
      }
    }
    sfx.playTap();
    setIsDirty(false);
    setSelectedDate(dateStr);
  };

  // Handle Status Change for a Student
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    sfx.playTap();
    setIsDirty(true);
    setStatuses(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Mark All Present
  const handleMarkAllPresent = () => {
    sfx.playSuccess();
    setIsDirty(true);
    const allP: Record<string, AttendanceStatus> = {};
    students.forEach(st => {
      allP[st.id] = 'present';
    });
    setStatuses(allP);
  };

  // Mark All Absent
  const handleMarkAllAbsent = () => {
    sfx.playTap();
    setIsDirty(true);
    const allA: Record<string, AttendanceStatus> = {};
    students.forEach(st => {
      allA[st.id] = 'absent';
    });
    setStatuses(allA);
  };

  // Export Attendance Register as CSV
  const handleExportCsv = () => {
    sfx.playTap();
    const activeClassObj = classes.find(c => c.id === selectedClassId);
    if (!activeClassObj || students.length === 0) return;
    const headers = ['Roll No', 'Student Name', 'Gender', 'Mother Tongue', 'Status', 'Date', 'Class', 'Teacher Name', 'e-Vidyavahini ID'];
    const teacherName = activeTeacher ? activeTeacher.name : 'Teacher';
    const teacherIdStr = activeTeacher ? activeTeacher.teacherId : '';
    const rows = students.map(st => [
      st.rollNo,
      `"${st.name.replace(/"/g, '""')}"`,
      st.gender,
      st.motherTongue,
      statuses[st.id] || 'unmarked',
      selectedDate,
      `"${activeClassObj.name}"`,
      `"${teacherName}"`,
      `"${teacherIdStr}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTeacher = (activeTeacher ? activeTeacher.name : 'Teacher').replace(/\s+/g, '_');
    link.setAttribute('download', `Attendance_${safeTeacher}_${activeClassObj.name.replace(/\s+/g, '_')}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save Attendance to localStorage, scoped to active teacher
  const handleSaveAttendance = () => {
    sfx.playSuccess();
    const record: DailyAttendanceRecord = {
      date: selectedDate,
      classId: selectedClassId,
      teacherId: activeTeacher?.id,
      teacherName: activeTeacher?.name,
      statuses,
      updatedAt: new Date().toISOString(),
    };
    attendanceService.saveAttendanceRecord(record, activeTeacher?.id);
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Add New Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    setFormError(null);

    try {
      attendanceService.addStudent(selectedClassId, {
        name: newStudentName.trim(),
        rollNo: Number(newStudentRoll),
        gender: newStudentGender,
        motherTongue: newStudentLang,
      });
      sfx.playSuccess();
      const updated = attendanceService.getStudents(selectedClassId);
      setStudents(updated);
      setNewStudentName('');
      setNewStudentRoll(updated.length + 1);
      setShowAddStudentModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Duplicate roll number');
    }
  };

  // Start Editing Student
  const handleEditStudent = (st: Student) => {
    sfx.playTap();
    setEditingStudent(st);
    setEditStudentName(st.name);
    setEditStudentRoll(st.rollNo);
    setEditStudentGender(st.gender);
    setEditStudentLang(st.motherTongue);
    setFormError(null);
  };

  // Submit Student Edit
  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editStudentName.trim()) return;
    setFormError(null);

    try {
      attendanceService.editStudent(selectedClassId, editingStudent.id, {
        name: editStudentName.trim(),
        rollNo: Number(editStudentRoll),
        gender: editStudentGender,
        motherTongue: editStudentLang,
      });
      sfx.playSuccess();
      const updated = attendanceService.getStudents(selectedClassId);
      setStudents(updated);
      setEditingStudent(null);
    } catch (err: any) {
      setFormError(err.message || 'Duplicate roll number');
    }
  };

  // Remove Student
  const handleRemoveStudent = (studentId: string, name: string) => {
    sfx.playTap();
    setStudentToDelete({ id: studentId, name });
  };

  const confirmRemoveStudent = () => {
    if (!studentToDelete) return;
    sfx.playTap();
    attendanceService.removeStudent(selectedClassId, studentToDelete.id);
    const updated = attendanceService.getStudents(selectedClassId);
    setStudents(updated);
    setStatuses(prev => {
      const copy = { ...prev };
      delete copy[studentToDelete.id];
      return copy;
    });
    setStudentToDelete(null);
  };

  // Add New Class
  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    sfx.playSuccess();

    const created = attendanceService.addClass(newClassName.trim(), newClassGrade);
    const updated = attendanceService.getClasses();
    setClasses(updated);
    setSelectedClassId(created.id);
    setNewClassName('');
    setShowAddClassModal(false);
  };

  // Delete Class
  const confirmDeleteClass = () => {
    if (!classToDelete) return;
    sfx.playTap();
    attendanceService.deleteClass(classToDelete.id);
    const updated = attendanceService.getClasses();
    setClasses(updated);
    if (updated.length > 0) {
      setSelectedClassId(updated[0].id);
    }
    setClassToDelete(null);
  };

  // Calculate Real-time Statistics
  const stats = useMemo(() => {
    const total = students.length;
    let present = 0;
    let absent = 0;
    let leave = 0;
    let unmarked = 0;

    students.forEach(st => {
      const s = statuses[st.id];
      if (s === 'present') present++;
      else if (s === 'absent') absent++;
      else if (s === 'leave') leave++;
      else unmarked++;
    });

    const recordedCount = present + absent + leave;
    const percent = total > 0 && recordedCount > 0 ? Math.round((present / total) * 100) : 0;

    // Language counts
    const langCounts: Record<string, number> = { Santali: 0, Ho: 0, Mundari: 0, Hindi: 0 };
    students.forEach(st => {
      langCounts[st.motherTongue] = (langCounts[st.motherTongue] || 0) + 1;
    });

    return { total, present, absent, leave, unmarked, percent, langCounts };
  }, [students, statuses]);

  // Attendance History filtered by active teacher
  const history = useMemo(() => {
    return attendanceService.getClassHistory(selectedClassId, activeTeacher?.id);
  }, [selectedClassId, activeTeacher?.id, saveSuccess]);

  const activeClassObj = classes.find(c => c.id === selectedClassId);

  return (
    <div className="fade-in" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Page Title & Intro */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            📋 Daily Classroom Register (दैनिक उपस्थिति पंजी)
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', margin: 0 }}>
            छात्र उपस्थिति पंजी (Student Attendance)
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px', backgroundColor: isDarkMode ? '#1e293b' : '#f0fdf4', border: `1px solid ${isDarkMode ? '#334155' : '#86efac'}`, padding: '4px 10px', borderRadius: '10px' }}>
            <span style={{ fontSize: '1rem' }}>🧑‍🏫</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isDarkMode ? '#86efac' : '#15803d' }}>
              शिक्षक: {activeTeacher ? activeTeacher.name : 'Teacher'} ({activeTeacher?.teacherId || 'EVV-JH-000000'})
            </span>
            <span style={{ fontSize: '0.74rem', color: isDarkMode ? '#94a3b8' : '#166534', opacity: 0.85 }}>
              • व्यक्तिगत रजिस्टर
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b', margin: '4px 0 0' }}>
            100% ऑफ़लाइन सुरक्षित • मातृभाषा ट्रैकिंग (Santali, Ho, Mundari) • NIPUN FLN उपस्थिति
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { sfx.playTap(); setShowHistoryModal(true); }}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              color: isDarkMode ? '#f8fafc' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📊 उपस्थिति इतिहास (History)
          </button>

          <button
            onClick={() => {
              sfx.playTap();
              setNewStudentRoll(students.length + 1);
              setShowAddStudentModal(true);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ➕ नया छात्र जोड़ें (Add Student)
          </button>
        </div>
      </div>

      {/* Control Bar: Date & Class Selector */}
      <div
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Class Selection */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
              कक्षा चुनें (Select Class):
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {classes.length > 1 && (
                <button
                  type="button"
                  onClick={() => setClassToDelete(activeClassObj || null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  🗑️ कक्षा हटाएं
                </button>
              )}
              <button
                type="button"
                onClick={() => { sfx.playTap(); setShowAddClassModal(true); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ed8936',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                + नई कक्षा जोड़ें
              </button>
            </div>
          </div>
          <select
            value={selectedClassId}
            onChange={e => handleSelectClass(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
              backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
              color: isDarkMode ? '#f8fafc' : '#0f2744',
              fontSize: '0.9rem',
              fontWeight: 700,
              outline: 'none',
            }}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                🏫 {c.name} {c.section ? `(Sec ${c.section})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
              तारीख चुनें (Select Date):
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleSelectDate(getLocalDateString())}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#22c55e',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                आज (Today)
              </button>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <button
                type="button"
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  handleSelectDate(getLocalDateString(yesterday));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                कल (Yesterday)
              </button>
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={e => handleSelectDate(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
              backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
              color: isDarkMode ? '#f8fafc' : '#0f2744',
              fontSize: '0.9rem',
              fontWeight: 700,
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        {/* Total */}
        <div style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>कुल छात्र (Total)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isDarkMode ? '#f8fafc' : '#0f2744', marginTop: '2px' }}>{stats.total}</div>
        </div>

        {/* Present */}
        <div style={{ backgroundColor: isDarkMode ? '#14532d' : '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>उपस्थित (Present)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>{stats.present}</div>
        </div>

        {/* Absent */}
        <div style={{ backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>अनुपस्थित (Absent)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b91c1c', marginTop: '2px' }}>{stats.absent}</div>
        </div>

        {/* Leave */}
        <div style={{ backgroundColor: isDarkMode ? '#713f12' : '#fefce8', border: '1px solid #fde047', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#854d0e' }}>छुट्टी (Leave)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a16207', marginTop: '2px' }}>{stats.leave}</div>
        </div>

        {/* Unmarked (if any) */}
        {stats.unmarked > 0 && (
          <div style={{ backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>अचिह्नित (Pending)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isDarkMode ? '#cbd5e1' : '#475569', marginTop: '2px' }}>{stats.unmarked}</div>
          </div>
        )}

        {/* Percentage */}
        <div style={{ backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff', border: '1px solid #93c5fd', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>प्रतिशत (Rate)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>{stats.percent}%</div>
        </div>
      </div>

      {/* Mother Tongue Linguistic Demographics */}
      <div style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#475569' }}>
          🌐 मातृभाषा विभाजन (Mother Tongue Cohort):
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
            🟢 Santali: {stats.langCounts.Santali || 0}
          </span>
          <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
            🔵 Ho: {stats.langCounts.Ho || 0}
          </span>
          <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
            🟣 Mundari: {stats.langCounts.Mundari || 0}
          </span>
          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
            ⚪ Hindi: {stats.langCounts.Hindi || 0}
          </span>
        </div>
      </div>

      {/* Main Student Register Card */}
      <div
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          overflow: 'hidden',
        }}
      >
        {/* Register Top Bar */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
            borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
              {activeClassObj?.name} — {selectedDate}
            </span>
            {isDirty && (
              <span
                style={{
                  backgroundColor: isDarkMode ? '#78350f' : '#fef3c7',
                  color: isDarkMode ? '#fde68a' : '#b45309',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? '#b45309' : '#fde68a'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ⚠️ असुरक्षित बदलाव (Unsaved)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleMarkAllPresent}
              title="Mark all students in this class as present"
              style={{
                backgroundColor: '#22c55e',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✅ सब उपस्थित
            </button>

            <button
              onClick={handleMarkAllAbsent}
              title="Mark all students as absent"
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ❌ सब अनुपस्थित
            </button>

            <button
              onClick={handleExportCsv}
              title="Download offline CSV register for school records"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📄 CSV Export
            </button>

            <button
              onClick={handleSaveAttendance}
              style={{
                backgroundColor: '#ed8936',
                color: '#ffffff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              💾 उपस्थिति सहेजें (Save)
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ✅ {activeClassObj?.name} की उपस्थिति ({selectedDate}) सुरक्षित रूप से सहेज ली गई है! (Saved Offline)
          </div>
        )}

        {/* Student List */}
        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍🎓</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
              इस कक्षा में अभी कोई छात्र नहीं है
            </div>
            <p style={{ fontSize: '0.85rem', margin: '4px 0 1rem' }}>
              उपस्थिति लेने के लिए "नया छात्र जोड़ें" बटन पर क्लिक करें।
            </p>
            <button
              onClick={() => { sfx.playTap(); setShowAddStudentModal(true); }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ➕ छात्र जोड़ें
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}` }}>
                  <th style={{ padding: '10px 14px', fontSize: '0.78rem', fontWeight: 800, color: isDarkMode ? '#94a3b8' : '#475569', width: '60px' }}>Roll</th>
                  <th style={{ padding: '10px 14px', fontSize: '0.78rem', fontWeight: 800, color: isDarkMode ? '#94a3b8' : '#475569' }}>विद्यार्थी का नाम (Name)</th>
                  <th style={{ padding: '10px 14px', fontSize: '0.78rem', fontWeight: 800, color: isDarkMode ? '#94a3b8' : '#475569' }}>मातृभाषा (Language)</th>
                  <th style={{ padding: '10px 14px', fontSize: '0.78rem', fontWeight: 800, color: isDarkMode ? '#94a3b8' : '#475569', textAlign: 'center' }}>उपस्थिति स्थिति (Status)</th>
                  <th style={{ padding: '10px 14px', fontSize: '0.78rem', fontWeight: 800, color: isDarkMode ? '#94a3b8' : '#475569', width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, idx) => {
                  const currentStatus = statuses[st.id];
                  return (
                    <tr
                      key={st.id}
                      style={{
                        borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`,
                        backgroundColor: idx % 2 === 0 ? 'transparent' : (isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                      }}
                    >
                      {/* Roll No */}
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                        #{st.rollNo}
                      </td>

                      {/* Name & Gender */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{st.gender === 'F' ? '👧' : '👦'}</span>
                          <div>
                            <div style={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '0.9rem' }}>
                              {st.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                              {st.gender === 'F' ? 'Girl' : 'Boy'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mother Tongue Badge */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            backgroundColor:
                              st.motherTongue === 'Santali' ? '#dcfce7' :
                              st.motherTongue === 'Ho' ? '#dbeafe' :
                              st.motherTongue === 'Mundari' ? '#f3e8ff' : '#f1f5f9',
                            color:
                              st.motherTongue === 'Santali' ? '#15803d' :
                              st.motherTongue === 'Ho' ? '#1d4ed8' :
                              st.motherTongue === 'Mundari' ? '#7e22ce' : '#475569',
                          }}
                        >
                          {st.motherTongue === 'Santali' && '🟢 '}
                          {st.motherTongue === 'Ho' && '🔵 '}
                          {st.motherTongue === 'Mundari' && '🟣 '}
                          {st.motherTongue}
                        </span>
                      </td>

                      {/* Attendance Action Radio/Pills */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', borderRadius: '10px', overflow: 'hidden', border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}` }}>
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'present')}
                            style={{
                              padding: '6px 12px',
                              border: 'none',
                              backgroundColor: currentStatus === 'present' ? '#22c55e' : (isDarkMode ? '#1e293b' : '#fff'),
                              color: currentStatus === 'present' ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#475569'),
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>P</span>
                            <span>उपस्थित</span>
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'absent')}
                            style={{
                              padding: '6px 12px',
                              borderLeft: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                              borderRight: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                              borderTop: 'none',
                              borderBottom: 'none',
                              backgroundColor: currentStatus === 'absent' ? '#ef4444' : (isDarkMode ? '#1e293b' : '#fff'),
                              color: currentStatus === 'absent' ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#475569'),
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>A</span>
                            <span>अनुपस्थित</span>
                          </button>

                          {/* Leave */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'leave')}
                            style={{
                              padding: '6px 12px',
                              border: 'none',
                              backgroundColor: currentStatus === 'leave' ? '#eab308' : (isDarkMode ? '#1e293b' : '#fff'),
                              color: currentStatus === 'leave' ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#475569'),
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>L</span>
                            <span>छुट्टी</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleEditStudent(st)}
                            title="छात्र विवरण बदलें (Edit Student)"
                            style={{
                              background: 'none',
                              border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                              borderRadius: '6px',
                              color: isDarkMode ? '#93c5fd' : '#0284c7',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              padding: '3px 7px',
                              fontWeight: 700,
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(st.id, st.name)}
                            title="छात्र हटाएं"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              padding: '4px',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: Add New Student ── */}
      {showAddStudentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                ➕ नया छात्र जोड़ें ({activeClassObj?.name})
              </h3>
              <button
                onClick={() => { setShowAddStudentModal(false); setFormError(null); }}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #f87171',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleAddStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  विद्यार्थी का नाम (Student Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. शांति मुर्मू / बिरसा सोरेन"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    color: isDarkMode ? '#f8fafc' : '#0f2744',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                    रोल नंबर (Roll No) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStudentRoll}
                    onChange={e => setNewStudentRoll(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f8fafc' : '#0f2744',
                      outline: 'none',
                      fontWeight: 600,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                    लिंग (Gender)
                  </label>
                  <select
                    value={newStudentGender}
                    onChange={e => setNewStudentGender(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f8fafc' : '#0f2744',
                      outline: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <option value="M">👦 बालक (Boy)</option>
                    <option value="F">👧 बालिका (Girl)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  मातृभाषा / बोली (Tribal Mother Tongue)
                </label>
                <select
                  value={newStudentLang}
                  onChange={e => setNewStudentLang(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    color: isDarkMode ? '#f8fafc' : '#0f2744',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                >
                  <option value="Santali">🟢 Santali (संथाली • ᱚᱞ ᱪᱤᱠᱤ)</option>
                  <option value="Ho">🔵 Ho (हो भाषा • Kolhan)</option>
                  <option value="Mundari">🟣 Mundari (मुंडारी • Chotanagpur)</option>
                  <option value="Hindi">⚪ Hindi (हिंदी)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? '#cbd5e1' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  छात्र जोड़ें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add New Class ── */}
      {showAddClassModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                🏫 नई कक्षा जोड़ें (Add Class)
              </h3>
              <button
                onClick={() => setShowAddClassModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  कक्षा का नाम (Class Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. Class 4, बालवाटिका B, Multi-grade"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    color: isDarkMode ? '#f8fafc' : '#0f2744',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  ग्रेड स्तर (Grade Level)
                </label>
                <select
                  value={newClassGrade}
                  onChange={e => setNewClassGrade(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    color: isDarkMode ? '#f8fafc' : '#0f2744',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                >
                  <option value="Balvatika">🧸 Balvatika</option>
                  <option value="Class 1">🎒 Class 1</option>
                  <option value="Class 2">📖 Class 2</option>
                  <option value="Class 3">🧮 Class 3</option>
                  <option value="Class 4">📐 Class 4</option>
                  <option value="Class 5">🏆 Class 5</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? '#cbd5e1' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#ed8936',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  कक्षा बनाएं (Create)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Attendance History ── */}
      {showHistoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                📊 उपस्थिति इतिहास — {activeClassObj?.name}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  इस कक्षा का पिछला कोई रिकॉर्ड नहीं मिला।
                </div>
              ) : (
                history.map(rec => {
                  const pCount = Object.values(rec.statuses).filter(s => s === 'present').length;
                  const total = Object.values(rec.statuses).length;
                  const pct = total > 0 ? Math.round((pCount / total) * 100) : 0;
                  return (
                    <div
                      key={rec.date}
                      onClick={() => {
                        setSelectedDate(rec.date);
                        setShowHistoryModal(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                          📅 {rec.date}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          अंतिम अपडेट: {new Date(rec.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d' }}>
                          {pCount}/{total} ({pct}%)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#0284c7' }}>देखें ➔</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              style={{
                marginTop: '1rem',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                color: isDarkMode ? '#f8fafc' : '#334155',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}

      {/* In-App Delete Student Confirmation Modal (replaces browser confirm) */}
      {studentToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
          <div style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '1.5rem', maxWidth: '380px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <h3 style={{ margin: 0, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '1.1rem', fontWeight: 800 }}>
                विद्यार्थी हटाएं (Remove Student)
              </h3>
            </div>
            <p style={{ margin: '0 0 1.25rem', color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              क्या आप <strong>{studentToDelete.name}</strong> को इस कक्षा से हटाना चाहते हैं?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStudentToDelete(null)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, backgroundColor: isDarkMode ? '#334155' : '#f8fafc', color: isDarkMode ? '#f8fafc' : '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={confirmRemoveStudent}
                style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}
              >
                हटाएं (Remove)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Student ── */}
      {editingStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: isDarkMode ? '#f8fafc' : '#0f2744' }}>
                ✏️ छात्र विवरण बदलें (Edit Student)
              </h3>
              <button
                onClick={() => { setEditingStudent(null); setFormError(null); }}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #f87171',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleEditStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  विद्यार्थी का नाम (Student Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={e => setEditStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    color: isDarkMode ? '#f8fafc' : '#0f2744',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                    रोल नंबर (Roll No) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editStudentRoll}
                    onChange={e => setEditStudentRoll(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f8fafc' : '#0f2744',
                      outline: 'none',
                      fontWeight: 600,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                    लिंग (Gender)
                  </label>
                  <select
                    value={editStudentGender}
                    onChange={e => setEditStudentGender(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f8fafc' : '#0f2744',
                      outline: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <option value="M">👦 बालक (Boy)</option>
                    <option value="F">👧 बालिका (Girl)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  मातृभाषा / बोली (Tribal Mother Tongue)
                </label>
                <select
                  value={editStudentLang}
                  onChange={e => setEditStudentLang(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    color: isDarkMode ? '#f8fafc' : '#0f2744',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                >
                  <option value="Santali">🟢 Santali (संथाली • ᱚᱞ ᱪᱤᱠᱤ)</option>
                  <option value="Ho">🔵 Ho (हो भाषा • Kolhan)</option>
                  <option value="Mundari">🟣 Mundari (मुंडारी • Chotanagpur)</option>
                  <option value="Hindi">⚪ Hindi (हिंदी)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setEditingStudent(null); setFormError(null); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                    backgroundColor: 'transparent',
                    color: isDarkMode ? '#cbd5e1' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  सहेजें (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Class Confirmation ── */}
      {classToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <h3 style={{ margin: 0, color: isDarkMode ? '#f8fafc' : '#0f2744', fontSize: '1.1rem', fontWeight: 800 }}>
                कक्षा हटाएं (Delete Class)
              </h3>
            </div>
            <p style={{ margin: '0 0 1rem', color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              क्या आप वास्तव में <strong>{classToDelete.name}</strong> को हटाना चाहते हैं? इसके अंतर्गत दर्ज सभी छात्रों का विवरण भी हट जाएगा।
            </p>
            <p style={{ margin: '0 0 1.25rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
              ⚠️ यह क्रिया पूर्ववत नहीं की जा सकती (Irreversible)।
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setClassToDelete(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                  backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                  color: isDarkMode ? '#f8fafc' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={confirmDeleteClass}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                }}
              >
                हटाएं (Delete Class)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Attendance;
