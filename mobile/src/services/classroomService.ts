/**
 * classroomService.ts
 * Manages dual-role classroom broadcasting and reception.
 * - BroadcastChannel API: Zero-latency offline communication across windows/tabs/webviews
 * - Serverless Relay API (/api/classroom): Real-time fallback across physical devices
 */

export interface ClassroomTranslationEvent {
  sourceHindi: string;
  translatedSantali: string;
  phoneticHindi: string;
  dialect?: string;
  sourceConfidence?: string;
  timestamp: number;
}

export interface ClassroomWorksheetEvent {
  worksheetId: string;
  title: string;
  grade: string;
  topic: string;
  timestamp: number;
  questions?: any[];
}

export type ClassroomEvent = 
  | { type: 'translation'; data: ClassroomTranslationEvent }
  | { type: 'worksheet_assigned'; data: ClassroomWorksheetEvent };

export interface ConnectedStudent {
  id: string;
  name: string;
  grade?: string;
  avatar?: string;
  joinedAt?: number;
}

export interface ClassroomInfo {
  roomCode: string;
  teacherName: string;
  schoolName: string;
  grade: string;
  teacherActive: boolean;
  studentCount: number;
}

export interface ConnectionStatus {
  connected: boolean;
  teacherActive: boolean;
  errorReason?: string;
}

// Fallback cloud endpoint if deployed
const RELAY_ENDPOINT = 'https://palashsetu-xi.vercel.app/api/classroom';

class ClassroomService {
  private activeRoomCode: string | null = null;
  private isTeacher: boolean = false;
  private teacherName: string = 'सुनीता मुर्मू (शिक्षिका)';
  private schoolName: string = 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड';
  private teacherGrade: string = 'कक्षा 1';
  private broadcastChannel: BroadcastChannel | null = null;
  private pollInterval: any = null;
  private heartbeatInterval: any = null;
  private lastEventTimestamp: number = 0;
  private studentId: string = 'std_' + Math.random().toString(36).slice(2, 7);
  private listeners: ((event: ClassroomEvent) => void)[] = [];
  private countListeners: ((count: number) => void)[] = [];
  private studentsListeners: ((students: ConnectedStudent[]) => void)[] = [];
  private connectedStudentsMap: Map<string, ConnectedStudent> = new Map();

  // ─── TEACHER: Start Broadcasting ───
  public startBroadcast(teacherName: string, schoolName?: string, grade?: string): string {
    // Generate 4-digit easy-to-read room code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.activeRoomCode = code;
    this.isTeacher = true;
    this.teacherName = teacherName || 'सुनीता मुर्मू (शिक्षिका)';
    if (schoolName) this.schoolName = schoolName;
    if (grade) this.teacherGrade = grade;
    this.lastEventTimestamp = Date.now();
    this.connectedStudentsMap.clear();

    // 1. Setup local BroadcastChannel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`palash_classroom_${code}`);
        this.broadcastChannel.onmessage = (msg) => {
          if (msg.data?.type === 'student_ping' && msg.data.student) {
            const st: ConnectedStudent = msg.data.student;
            this.connectedStudentsMap.set(st.id, {
              ...st,
              joinedAt: st.joinedAt || Date.now()
            });
            this.notifyStudents();
            // Acknowledge student with teacher details
            this.broadcastChannel?.postMessage({
              type: 'teacher_ack',
              info: {
                roomCode: code,
                teacherName: this.teacherName,
                schoolName: this.schoolName,
                grade: this.teacherGrade,
                teacherActive: true,
                studentCount: this.connectedStudentsMap.size
              }
            });
          }
        };
      }
    } catch (_) {}

    // 2. Register room on relay (silent background)
    this.postToRelay({
      action: 'publish',
      room: code,
      teacherName: this.teacherName,
      schoolName: this.schoolName,
      grade: this.teacherGrade,
      type: 'announcement',
      data: { message: `Classroom started by ${this.teacherName}` }
    });

    // Save active broadcast in session
    sessionStorage.setItem('palash_active_room', code);

    // Start teacher student count & roster polling
    this.startTeacherPolling(code);

    return code;
  }

  // ─── TEACHER: Broadcast a Translated Sentence ───
  public broadcastTranslation(event: ClassroomTranslationEvent): void {
    if (!this.activeRoomCode) return;

    const classroomEvent: ClassroomEvent = {
      type: 'translation',
      data: event
    };

    // 1. Post to local BroadcastChannel (instant offline)
    try {
      this.broadcastChannel?.postMessage(classroomEvent);
    } catch (_) {}

    // 2. Post to Relay endpoint for physical devices
    this.postToRelay({
      action: 'publish',
      room: this.activeRoomCode,
      teacherName: this.teacherName,
      schoolName: this.schoolName,
      grade: this.teacherGrade,
      type: 'translation',
      data: event
    });
  }

  // ─── TEACHER: Assign Worksheet to Class ───
  public broadcastWorksheet(event: ClassroomWorksheetEvent): void {
    if (!this.activeRoomCode) return;

    const classroomEvent: ClassroomEvent = {
      type: 'worksheet_assigned',
      data: event
    };

    // Store assigned worksheet locally for student mode access
    try {
      const stored = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
      const updated = [event, ...stored.filter((w: any) => w.worksheetId !== event.worksheetId)];
      localStorage.setItem('palash_assigned_worksheets', JSON.stringify(updated.slice(0, 10)));
    } catch (_) {}

    try {
      this.broadcastChannel?.postMessage(classroomEvent);
    } catch (_) {}

    this.postToRelay({
      action: 'publish',
      room: this.activeRoomCode,
      teacherName: this.teacherName,
      schoolName: this.schoolName,
      grade: this.teacherGrade,
      type: 'worksheet_assigned',
      data: event
    });
  }

  // ─── TEACHER: Stop Broadcasting ───
  public stopBroadcast(): void {
    if (this.activeRoomCode) {
      this.postToRelay({ action: 'close', room: this.activeRoomCode });
      try {
        this.broadcastChannel?.close();
      } catch (_) {}
    }
    this.activeRoomCode = null;
    this.isTeacher = false;
    this.connectedStudentsMap.clear();
    sessionStorage.removeItem('palash_active_room');
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  // ─── TEACHER: Subscribe to student updates ───
  public onStudentsUpdate(callback: (students: ConnectedStudent[]) => void): () => void {
    this.studentsListeners.push(callback);
    callback(Array.from(this.connectedStudentsMap.values()));
    return () => {
      this.studentsListeners = this.studentsListeners.filter(cb => cb !== callback);
    };
  }

  public getConnectedStudents(): ConnectedStudent[] {
    return Array.from(this.connectedStudentsMap.values());
  }

  // ─── STUDENT: Join a Classroom ───
  public joinClassroom(
    roomCode: string,
    studentInfo: { id?: string; name: string; grade?: string; avatar?: string },
    onEvent: (event: ClassroomEvent) => void,
    onCountUpdate?: (count: number) => void,
    onClassroomInfo?: (info: ClassroomInfo) => void,
    onConnectionStatus?: (status: ConnectionStatus) => void
  ): () => void {
    const formattedCode = roomCode.trim().toUpperCase();
    this.activeRoomCode = formattedCode;
    this.isTeacher = false;
    this.listeners.push(onEvent);
    if (onCountUpdate) this.countListeners.push(onCountUpdate);

    const studentObj: ConnectedStudent = {
      id: studentInfo.id || this.studentId,
      name: studentInfo.name || 'विद्यार्थी',
      grade: studentInfo.grade || 'कक्षा 1',
      avatar: studentInfo.avatar || '🎒',
      joinedAt: Date.now()
    };

    // 1. Connect local BroadcastChannel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`palash_classroom_${formattedCode}`);
        this.broadcastChannel.onmessage = (msg) => {
          if (msg.data) {
            if (msg.data.type === 'translation' || msg.data.type === 'worksheet_assigned') {
              onEvent(msg.data);
            }
            if (msg.data.type === 'teacher_ack' && msg.data.info) {
              if (onClassroomInfo) onClassroomInfo(msg.data.info);
              if (onConnectionStatus) onConnectionStatus({ connected: true, teacherActive: true });
            }
          }
        };

        // Ping teacher on BroadcastChannel
        this.broadcastChannel.postMessage({
          type: 'student_ping',
          student: studentObj
        });
      }
    } catch (_) {}

    // 2. Start Student Heartbeat & Event Polling
    this.startStudentPolling(formattedCode, studentObj, onClassroomInfo, onConnectionStatus);

    // Return unsubscribe function
    return () => {
      this.leaveClassroom();
    };
  }

  public leaveClassroom(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    try {
      this.broadcastChannel?.close();
    } catch (_) {}
    this.broadcastChannel = null;
    this.activeRoomCode = null;
    this.listeners = [];
    this.countListeners = [];
    this.studentsListeners = [];
    this.connectedStudentsMap.clear();
  }

  public getActiveRoomCode(): string | null {
    return this.activeRoomCode || sessionStorage.getItem('palash_active_room');
  }

  public isBroadcasting(): boolean {
    return this.isTeacher && !!this.activeRoomCode;
  }

  // ─── Internal Polling Helpers ───
  private async postToRelay(body: any): Promise<any> {
    try {
      let res = await fetch(RELAY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(() => null);

      if (!res || !res.ok) {
        // Fallback relative path on web
        if (typeof window !== 'undefined') {
          res = await fetch('/api/classroom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }).catch(() => null);
        }
      }
      return res?.json();
    } catch (_) {
      return null;
    }
  }

  private startTeacherPolling(roomCode: string): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      try {
        let url = `${RELAY_ENDPOINT}?room=${roomCode}&since=${this.lastEventTimestamp}`;
        let res = await fetch(url).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`/api/classroom?room=${roomCode}&since=${this.lastEventTimestamp}`).catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.students)) {
            // Update connected students
            data.students.forEach((st: ConnectedStudent) => {
              this.connectedStudentsMap.set(st.id, {
                ...st,
                joinedAt: this.connectedStudentsMap.get(st.id)?.joinedAt || Date.now()
              });
            });
            this.notifyStudents();
          }
          if (data && typeof data.studentCount === 'number') {
            this.notifyCount(data.studentCount);
          }
        }
      } catch (_) {}
    }, 2500);
  }

  private startStudentPolling(
    roomCode: string,
    student: ConnectedStudent,
    onClassroomInfo?: (info: ClassroomInfo) => void,
    onConnectionStatus?: (status: ConnectionStatus) => void
  ): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    let consecutiveFailures = 0;

    const sendPing = async () => {
      try {
        const res = await this.postToRelay({
          action: 'student_ping',
          room: roomCode,
          studentId: student.id,
          studentName: student.name,
          grade: student.grade,
          avatar: student.avatar
        });

        if (res && res.success) {
          consecutiveFailures = 0;
          if (onConnectionStatus) {
            onConnectionStatus({
              connected: true,
              teacherActive: !!res.teacherActive
            });
          }
          if (onClassroomInfo && (res.teacherName || res.schoolName)) {
            onClassroomInfo({
              roomCode,
              teacherName: res.teacherName || 'शिक्षिका',
              schoolName: res.schoolName || 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड',
              grade: res.grade || student.grade || 'कक्षा 1',
              teacherActive: !!res.teacherActive,
              studentCount: res.studentCount || 1
            });
          }
        } else {
          consecutiveFailures++;
          if (consecutiveFailures >= 3 && onConnectionStatus) {
            onConnectionStatus({
              connected: false,
              teacherActive: false,
              errorReason: 'शिक्षक से संपर्क नहीं हो पा रहा है। कृपया सुनिश्चित करें कि आप शिक्षक के हॉटस्पॉट या उसी वाई-फ़ाई से जुड़े हैं।'
            });
          }
        }
      } catch (_) {
        consecutiveFailures++;
        if (consecutiveFailures >= 3 && onConnectionStatus) {
          onConnectionStatus({
            connected: false,
            teacherActive: false,
            errorReason: 'नेटवर्क संपर्क त्रुटि। कृपया शिक्षक के हॉटस्पॉट से कनेक्ट करें।'
          });
        }
      }
    };

    // Initial ping
    sendPing();

    // Heartbeat every 7s
    this.heartbeatInterval = setInterval(sendPing, 7000);

    // Poll for new events every 1.5s
    this.pollInterval = setInterval(async () => {
      try {
        let url = `${RELAY_ENDPOINT}?room=${roomCode}&since=${this.lastEventTimestamp}`;
        let res = await fetch(url).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`/api/classroom?room=${roomCode}&since=${this.lastEventTimestamp}`).catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.exists) {
            if (onConnectionStatus) {
              onConnectionStatus({
                connected: true,
                teacherActive: !!data.teacherActive
              });
            }
            if (onClassroomInfo && data.teacherName) {
              onClassroomInfo({
                roomCode,
                teacherName: data.teacherName,
                schoolName: data.schoolName || 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड',
                grade: data.grade || student.grade || 'कक्षा 1',
                teacherActive: !!data.teacherActive,
                studentCount: data.studentCount || 1
              });
            }
          } else if (data && !data.exists) {
            if (onConnectionStatus) {
              onConnectionStatus({
                connected: false,
                teacherActive: false,
                errorReason: 'यह कमरा सक्रिय नहीं है या बंद हो चुका है।'
              });
            }
          }

          if (data && Array.isArray(data.events)) {
            data.events.forEach((ev: any) => {
              if (ev.timestamp > this.lastEventTimestamp) {
                this.lastEventTimestamp = ev.timestamp;
                const mappedEvent: ClassroomEvent = {
                  type: ev.type,
                  data: ev.data
                };
                this.listeners.forEach((fn) => fn(mappedEvent));
              }
            });
          }
          if (data && typeof data.studentCount === 'number') {
            this.notifyCount(data.studentCount);
          }
        }
      } catch (_) {}
    }, 1500);
  }

  private notifyCount(count: number): void {
    this.countListeners.forEach((fn) => fn(count));
  }

  private notifyStudents(): void {
    const list = Array.from(this.connectedStudentsMap.values());
    this.studentsListeners.forEach((fn) => fn(list));
    this.notifyCount(list.length);
  }
}

export const classroomService = new ClassroomService();
