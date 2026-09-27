/**
 * Teacher & Student Authentication & Profile Service
 * 100% Offline with local SHA-256 PIN Hashing
 */

export type UserRole = 'teacher' | 'student';

export interface TeacherProfile {
  id: string;
  name: string;
  teacherId: string; // e-Vidyavahini ID
  district: string;
  block: string;
  assignedGrade: string; // "Balvatika" | "Class 1" | "Class 2" | "Class 3"
  pinHash: string;
  avatarColor: string;
  createdAt: string;
}

export interface StudentProfile {
  studentId?: string;
  studentName: string;
  grade: string;
  roomCode: string;
  avatarEmoji: string;
  joinedAt: string;
}

const STORAGE_KEY_PROFILES = 'palashvani_teacher_profiles';
const STORAGE_KEY_ACTIVE_SESSION = 'palashvani_active_teacher_id';
const STORAGE_KEY_USER_ROLE = 'palashvani_user_role';
const STORAGE_KEY_STUDENT_PROFILE = 'palashvani_student_profile';

const AVATAR_COLORS = ['#1a365d', '#2b6cb0', '#2c7a7b', '#285e61', '#744210', '#6b46c1'];

export async function hashPin(pin: string): Promise<string> {
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(pin);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

export const authService = {
  getUserRole(): UserRole {
    // Teachers use sessionStorage (re-login required for security on app restart)
    const sessionRole = sessionStorage.getItem(STORAGE_KEY_USER_ROLE);
    if (sessionRole === 'teacher') return 'teacher';
    // Students use localStorage (persist across restarts until manual logout)
    const persistedStudentProfile = localStorage.getItem(STORAGE_KEY_STUDENT_PROFILE);
    if (persistedStudentProfile) return 'student';
    return sessionRole === 'student' ? 'student' : 'teacher';
  },

  getStudentProfile(): StudentProfile | null {
    try {
      // Try sessionStorage first (active session), fall back to localStorage (persisted)
      const sessionData = sessionStorage.getItem(STORAGE_KEY_STUDENT_PROFILE);
      if (sessionData) return JSON.parse(sessionData);
      const localData = localStorage.getItem(STORAGE_KEY_STUDENT_PROFILE);
      return localData ? JSON.parse(localData) : null;
    } catch {
      return null;
    }
  },

  loginAsStudent(studentName: string, grade: string, roomCode: string, avatarEmoji?: string): StudentProfile {
    const profile: StudentProfile = {
      studentName: studentName.trim() || 'Class 1 Student',
      grade: grade || 'Class 1',
      roomCode: (roomCode || '').trim().toUpperCase(),
      avatarEmoji: avatarEmoji || '🎒',
      joinedAt: new Date().toISOString()
    };
    // Save in BOTH: sessionStorage for current session, localStorage for persistence across restarts
    sessionStorage.setItem(STORAGE_KEY_USER_ROLE, 'student');
    sessionStorage.setItem(STORAGE_KEY_STUDENT_PROFILE, JSON.stringify(profile));
    // localStorage persists across app restarts - cleared only on explicit logout
    localStorage.setItem(STORAGE_KEY_STUDENT_PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEY_USER_ROLE, 'student');
    return profile;
  },

  getProfiles(): TeacherProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILES) || localStorage.getItem('palashsetu_teacher_profiles');
      if (!data) {
        const defaultProfiles: TeacherProfile[] = [
          {
            id: 'teacher-1',
            name: 'Sunita Kumari',
            teacherId: 'EVV-JH-849201',
            district: 'Dumka',
            block: 'Kathikund',
            assignedGrade: 'Class 1',
            pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // "1234"
            avatarColor: '#1a365d',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'teacher-2',
            name: 'Ramesh Murmu',
            teacherId: 'EVV-JH-912044',
            district: 'East Singhbhum',
            block: 'Ghatshila',
            assignedGrade: 'Balvatika',
            pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // "1234"
            avatarColor: '#2b6cb0',
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(defaultProfiles));
        return defaultProfiles;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  async registerProfile(
    name: string,
    teacherId: string,
    district: string,
    block: string,
    assignedGrade: string,
    pin: string
  ): Promise<TeacherProfile> {
    const profiles = this.getProfiles();
    const pinHash = await hashPin(pin);
    const colorIndex = profiles.length % AVATAR_COLORS.length;

    const newProfile: TeacherProfile = {
      id: `teacher-${Date.now()}`,
      name: name.trim(),
      teacherId: teacherId.trim() || `EVV-JH-${Math.floor(100000 + Math.random() * 900000)}`,
      district: district || 'Dumka',
      block: block || 'Sadar',
      assignedGrade: assignedGrade || 'Class 1',
      pinHash,
      avatarColor: AVATAR_COLORS[colorIndex],
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    this.setActiveSession(newProfile.id);
    return newProfile;
  },

  async verifyPin(teacherId: string, enteredPin: string): Promise<boolean> {
    const profiles = this.getProfiles();
    const profile = profiles.find((p) => p.id === teacherId);
    if (!profile) return false;

    const enteredHash = await hashPin(enteredPin);
    return enteredHash === profile.pinHash;
  },

  getActiveProfile(): TeacherProfile | null {
    if (this.getUserRole() === 'student') return null;
    const activeId = sessionStorage.getItem(STORAGE_KEY_ACTIVE_SESSION) || sessionStorage.getItem('palashsetu_active_teacher_id');
    if (!activeId) {
      return null;
    }
    const profiles = this.getProfiles();
    return profiles.find((p) => p.id === activeId) || null;
  },

  setActiveSession(teacherId: string) {
    sessionStorage.setItem(STORAGE_KEY_USER_ROLE, 'teacher');
    sessionStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, teacherId);
    sessionStorage.removeItem(STORAGE_KEY_STUDENT_PROFILE);
    try { localStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION); localStorage.removeItem('palashsetu_active_teacher_id'); } catch {}
  },

  updateProfile(id: string, updates: Partial<TeacherProfile>): TeacherProfile | null {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) return null;
    profiles[index] = { ...profiles[index], ...updates };
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    return profiles[index];
  },

  logout() {
    sessionStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_USER_ROLE);
    sessionStorage.removeItem(STORAGE_KEY_STUDENT_PROFILE);
    sessionStorage.removeItem('palash_active_room');
    sessionStorage.removeItem('palashsetu_active_teacher_id');
    // Also clear student localStorage persistence so student must re-login after logout
    localStorage.removeItem(STORAGE_KEY_STUDENT_PROFILE);
    localStorage.removeItem(STORAGE_KEY_USER_ROLE);
    try { localStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION); localStorage.removeItem('palashsetu_active_teacher_id'); } catch {}
  },

  leaveSession() {
    // Only disconnect from the current classroom session.
    // Does NOT log out the student — profile and name are preserved.
    sessionStorage.removeItem('palash_active_room');
    try { localStorage.removeItem('palash_student_room'); } catch {}
    // Update roomCode in the persisted student profile to empty
    // so StudentClassroom knows they're not in a session
    try {
      const sessionRaw = sessionStorage.getItem('palashvani_student_profile');
      const localRaw = localStorage.getItem('palashvani_student_profile');
      const raw = sessionRaw || localRaw;
      if (raw) {
        const profile = JSON.parse(raw);
        profile.roomCode = '';
        sessionStorage.setItem('palashvani_student_profile', JSON.stringify(profile));
        localStorage.setItem('palashvani_student_profile', JSON.stringify(profile));
      }
    } catch {}
  },
};
