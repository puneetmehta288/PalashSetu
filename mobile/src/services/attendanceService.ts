/**
 * attendanceService.ts
 * ==============================================================
 * Comprehensive On-Device Offline Attendance Register for Teachers
 * 
 * Features:
 * - Manage Classes (Balvatika, Class 1-3, custom classes)
 * - Manage Students (Add, Remove, Edit, Mother Tongue tracking)
 * - Daily Attendance Taking (Present, Absent, Leave)
 * - Quick "Mark All Present" action
 * - Statistics (Present %, Absent count, Tribal language distribution)
 * - Historical records persisted 100% offline in localStorage
 */

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Student {
  id: string;
  name: string;
  rollNo: number;
  gender: 'M' | 'F' | 'Other';
  motherTongue: 'Santali' | 'Ho' | 'Mundari' | 'Hindi';
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  section?: string;
}

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  classId: string;
  teacherId?: string; // Scoped per teacher profile
  teacherName?: string;
  statuses: Record<string, AttendanceStatus>; // studentId -> status
  updatedAt: string;
  notes?: string;
  isSaved?: boolean;
}

const STORAGE_KEY_CLASSES = 'palash_attendance_classes_v1';
const STORAGE_KEY_STUDENTS = 'palash_attendance_students_v1';
const STORAGE_KEY_RECORDS = 'palash_attendance_records_v1';

// Default Classes
const DEFAULT_CLASSES: ClassRoom[] = [
  { id: 'c_bal', name: 'Balvatika (FLN L1)', grade: 'Balvatika', section: 'A' },
  { id: 'c_1', name: 'Class 1 (Grade 1)', grade: 'Class 1', section: 'A' },
  { id: 'c_2', name: 'Class 2 (Grade 2)', grade: 'Class 2', section: 'A' },
  { id: 'c_3', name: 'Class 3 (Grade 3)', grade: 'Class 3', section: 'A' },
];

// Default Students per class for Jharkhand rural schools
const DEFAULT_STUDENTS: Record<string, Student[]> = {
  c_bal: [
    { id: 'st_b1', name: 'Sombari Hembrom', rollNo: 1, gender: 'F', motherTongue: 'Santali' },
    { id: 'st_b2', name: 'Dashrath Pingua', rollNo: 2, gender: 'M', motherTongue: 'Ho' },
    { id: 'st_b3', name: 'Anita Munda', rollNo: 3, gender: 'F', motherTongue: 'Mundari' },
    { id: 'st_b4', name: 'Laxman Tudu', rollNo: 4, gender: 'M', motherTongue: 'Santali' },
    { id: 'st_b5', name: 'Pooja Kumari', rollNo: 5, gender: 'F', motherTongue: 'Hindi' },
  ],
  c_1: [
    { id: 'st_1', name: 'Shanti Murmu', rollNo: 1, gender: 'F', motherTongue: 'Santali' },
    { id: 'st_2', name: 'Birsa Soren', rollNo: 2, gender: 'M', motherTongue: 'Santali' },
    { id: 'st_3', name: 'Mangal Ho', rollNo: 3, gender: 'M', motherTongue: 'Ho' },
    { id: 'st_4', name: 'Sita Hembrom', rollNo: 4, gender: 'F', motherTongue: 'Santali' },
    { id: 'st_5', name: 'Sukram Munda', rollNo: 5, gender: 'M', motherTongue: 'Mundari' },
    { id: 'st_6', name: 'Rahul Marandi', rollNo: 6, gender: 'M', motherTongue: 'Santali' },
    { id: 'st_7', name: 'Sunita Hansda', rollNo: 7, gender: 'F', motherTongue: 'Santali' },
    { id: 'st_8', name: 'Rupesh Besra', rollNo: 8, gender: 'M', motherTongue: 'Santali' },
  ],
  c_2: [
    { id: 'st_21', name: 'Budhan Baskey', rollNo: 1, gender: 'M', motherTongue: 'Santali' },
    { id: 'st_22', name: 'Kajal Tudu', rollNo: 2, gender: 'F', motherTongue: 'Santali' },
    { id: 'st_23', name: 'Somra Munda', rollNo: 3, gender: 'M', motherTongue: 'Mundari' },
    { id: 'st_24', name: 'Champa Ho', rollNo: 4, gender: 'F', motherTongue: 'Ho' },
    { id: 'st_25', name: 'Arjun Murmu', rollNo: 5, gender: 'M', motherTongue: 'Santali' },
    { id: 'st_26', name: 'Priyanka Hansda', rollNo: 6, gender: 'F', motherTongue: 'Santali' },
  ],
  c_3: [
    { id: 'st_31', name: 'Devendra Soren', rollNo: 1, gender: 'M', motherTongue: 'Santali' },
    { id: 'st_32', name: 'Mani Munda', rollNo: 2, gender: 'F', motherTongue: 'Mundari' },
    { id: 'st_33', name: 'Gopal Pingua', rollNo: 3, gender: 'M', motherTongue: 'Ho' },
    { id: 'st_34', name: 'Rani Besra', rollNo: 4, gender: 'F', motherTongue: 'Santali' },
    { id: 'st_35', name: 'Sanjay Marandi', rollNo: 5, gender: 'M', motherTongue: 'Santali' },
  ],
};

class AttendanceService {
  /**
   * Get all registered classes
   */
  getClasses(): ClassRoom[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CLASSES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse classes:', e);
    }
    this.saveClasses(DEFAULT_CLASSES);
    return DEFAULT_CLASSES;
  }

  saveClasses(classes: ClassRoom[]): void {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  }

  addClass(name: string, grade: string, section = 'A'): ClassRoom {
    const classes = this.getClasses();
    const newClass: ClassRoom = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      grade: grade.trim(),
      section: section.trim(),
    };
    classes.push(newClass);
    this.saveClasses(classes);
    return newClass;
  }

  deleteClass(classId: string): void {
    const classes = this.getClasses().filter(c => c.id !== classId);
    this.saveClasses(classes);
    // Also remove students in that class
    const allStudents = this.getAllStudentsMap();
    delete allStudents[classId];
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(allStudents));
  }

  /**
   * Get students for a specific class
   */
  getStudents(classId: string): Student[] {
    const map = this.getAllStudentsMap();
    if (!map[classId]) {
      // Seed default if available or empty array
      map[classId] = DEFAULT_STUDENTS[classId] || [];
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(map));
    }
    return map[classId];
  }

  private getAllStudentsMap(): Record<string, Student[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse students map:', e);
    }
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }

  addStudent(classId: string, student: Omit<Student, 'id'>): Student {
    const map = this.getAllStudentsMap();
    if (!map[classId]) map[classId] = [];

    const isDuplicate = map[classId].some(s => Number(s.rollNo) === Number(student.rollNo));
    if (isDuplicate) {
      throw new Error(`Roll No ${student.rollNo} is already assigned in this class.`);
    }

    const newStudent: Student = {
      ...student,
      rollNo: Number(student.rollNo),
      id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    map[classId].push(newStudent);
    // Sort by roll number
    map[classId].sort((a, b) => a.rollNo - b.rollNo);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(map));
    return newStudent;
  }

  editStudent(classId: string, studentId: string, updated: Partial<Omit<Student, 'id'>>): Student {
    const map = this.getAllStudentsMap();
    if (!map[classId]) throw new Error('Class not found');
    const idx = map[classId].findIndex(s => s.id === studentId);
    if (idx === -1) throw new Error('Student not found');

    if (updated.rollNo !== undefined) {
      const isDuplicate = map[classId].some(s => s.id !== studentId && Number(s.rollNo) === Number(updated.rollNo));
      if (isDuplicate) {
        throw new Error(`Roll No ${updated.rollNo} is already assigned to another student in this class.`);
      }
    }

    map[classId][idx] = {
      ...map[classId][idx],
      ...updated,
      rollNo: updated.rollNo !== undefined ? Number(updated.rollNo) : map[classId][idx].rollNo,
    };
    map[classId].sort((a, b) => a.rollNo - b.rollNo);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(map));
    return map[classId][idx];
  }

  removeStudent(classId: string, studentId: string): void {
    const map = this.getAllStudentsMap();
    if (map[classId]) {
      map[classId] = map[classId].filter(s => s.id !== studentId);
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(map));
    }
  }

  /**
   * Get or initialize attendance record for a class on a specific date, scoped by teacher ID.
   * Each teacher profile maintains their own distinct attendance register.
   */
  getAttendanceRecord(classId: string, date: string, teacherId?: string): DailyAttendanceRecord {
    const allRecords = this.getAllRecords();
    const tId = teacherId || 'shared_default';
    const key = `${tId}_${classId}_${date}`;
    if (allRecords[key]) {
      return { ...allRecords[key], isSaved: true };
    }

    // Unrecorded day: initialize with empty statuses so students are not falsely assumed present
    const newRecord: DailyAttendanceRecord = {
      date,
      classId,
      teacherId: tId,
      statuses: {},
      updatedAt: new Date().toISOString(),
      isSaved: false,
    };
    return newRecord;
  }

  saveAttendanceRecord(record: DailyAttendanceRecord, teacherId?: string): void {
    const allRecords = this.getAllRecords();
    const tId = teacherId || record.teacherId || 'shared_default';
    const key = `${tId}_${record.classId}_${record.date}`;
    allRecords[key] = {
      ...record,
      teacherId: tId,
      isSaved: true,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(allRecords));
  }

  private getAllRecords(): Record<string, DailyAttendanceRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse attendance records:', e);
    }
    return {};
  }

  /**
   * Get attendance history list for a class, filtered by teacher ID
   */
  getClassHistory(classId: string, teacherId?: string): DailyAttendanceRecord[] {
    const allRecords = this.getAllRecords();
    const tId = teacherId || 'shared_default';
    return Object.values(allRecords)
      .filter(r => r.classId === classId && (r.teacherId === tId || (!r.teacherId && tId === 'shared_default')))
      .sort((a, b) => b.date.localeCompare(a.date));
  }
}

export const attendanceService = new AttendanceService();
