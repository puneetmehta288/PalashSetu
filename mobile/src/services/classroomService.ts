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
}

export type ClassroomEvent = 
  | { type: 'translation'; data: ClassroomTranslationEvent }
  | { type: 'worksheet_assigned'; data: ClassroomWorksheetEvent };

// Fallback cloud endpoint if deployed
const RELAY_ENDPOINT = 'https://palashsetu-xi.vercel.app/api/classroom';

class ClassroomService {
  private activeRoomCode: string | null = null;
  private isTeacher: boolean = false;
  private teacherName: string = 'Primary Teacher';
  private broadcastChannel: BroadcastChannel | null = null;
  private pollInterval: any = null;
  private heartbeatInterval: any = null;
  private lastEventTimestamp: number = 0;
  private studentId: string = 'std_' + Math.random().toString(36).slice(2, 7);
  private listeners: ((event: ClassroomEvent) => void)[] = [];
  private countListeners: ((count: number) => void)[] = [];

  // ─── TEACHER: Start Broadcasting ───
  public startBroadcast(teacherName: string): string {
    // Generate 4-digit easy-to-read room code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.activeRoomCode = code;
    this.isTeacher = true;
    this.teacherName = teacherName;
    this.lastEventTimestamp = Date.now();

    // 1. Setup local BroadcastChannel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`palash_classroom_${code}`);
        this.broadcastChannel.onmessage = (msg) => {
          if (msg.data?.type === 'student_ping') {
            this.notifyCount(msg.data.studentCount || 1);
          }
        };
      }
    } catch (_) {}

    // 2. Register room on relay (silent background)
    this.postToRelay({
      action: 'publish',
      room: code,
      teacherName,
      type: 'announcement',
      data: { message: `Classroom started by ${teacherName}` }
    });

    // Save active broadcast in session
    sessionStorage.setItem('palash_active_room', code);

    // Start teacher student count polling
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

    try {
      this.broadcastChannel?.postMessage(classroomEvent);
    } catch (_) {}

    this.postToRelay({
      action: 'publish',
      room: this.activeRoomCode,
      teacherName: this.teacherName,
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
    sessionStorage.removeItem('palash_active_room');
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  // ─── STUDENT: Join a Classroom ───
  public joinClassroom(
    roomCode: string,
    studentName: string,
    onEvent: (event: ClassroomEvent) => void,
    onCountUpdate?: (count: number) => void
  ): () => void {
    const formattedCode = roomCode.trim().toUpperCase();
    this.activeRoomCode = formattedCode;
    this.isTeacher = false;
    this.listeners.push(onEvent);
    if (onCountUpdate) this.countListeners.push(onCountUpdate);

    // 1. Connect local BroadcastChannel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`palash_classroom_${formattedCode}`);
        this.broadcastChannel.onmessage = (msg) => {
          if (msg.data && (msg.data.type === 'translation' || msg.data.type === 'worksheet_assigned')) {
            onEvent(msg.data);
          }
        };
      }
    } catch (_) {}

    // 2. Start Student Heartbeat & Event Polling
    this.startStudentPolling(formattedCode, studentName);

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
          if (data && typeof data.studentCount === 'number') {
            this.notifyCount(data.studentCount);
          }
        }
      } catch (_) {}
    }, 3000);
  }

  private startStudentPolling(roomCode: string, studentName: string): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    // Initial student ping
    this.postToRelay({
      action: 'student_ping',
      room: roomCode,
      studentId: this.studentId,
      studentName
    });

    // Heartbeat every 8s
    this.heartbeatInterval = setInterval(() => {
      this.postToRelay({
        action: 'student_ping',
        room: roomCode,
        studentId: this.studentId,
        studentName
      });
    }, 8000);

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
}

export const classroomService = new ClassroomService();
