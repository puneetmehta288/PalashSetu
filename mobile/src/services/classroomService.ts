/**
 * classroomService.ts
 * Manages dual-role classroom broadcasting and reception.
 * - BroadcastChannel API: Zero-latency offline communication across windows/tabs/webviews
 * - Serverless Relay API (/api/classroom): Real-time fallback across physical devices
 */

import { authService } from './authService';

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

export interface StudentAnswerItem {
  question_id: number;
  question_text: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface WorksheetSubmission {
  worksheet_id: string;
  worksheet_title: string;
  student_id: string;
  student_name: string;
  total_questions: number;
  score: number;
  percentage: number;
  timestamp: number;
  answers: StudentAnswerItem[];
}

export type ClassroomEvent = 
  | { type: 'translation'; data: ClassroomTranslationEvent }
  | { type: 'worksheet_assigned'; data: ClassroomWorksheetEvent }
  | { type: 'worksheet_submission'; data: WorksheetSubmission }
  | { type: 'clear_worksheet'; data?: { worksheetId?: string } }
  | { type: 'classroom_reset'; data?: any };

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

// Cloud and local endpoint definitions
const RELAY_ENDPOINT = 'https://palashsetu-xi.vercel.app/api/classroom';

async function executeRelayRequest(url: string, method: string = 'GET', body?: any, timeoutMs: number = 1500): Promise<any> {
  // 1. Android Native HTTP Bridge (100% reliable offline local hotspot transport)
  try {
    const bridge = typeof window !== 'undefined' ? (window as any).AndroidVoiceBridge : null;
    if (bridge && typeof bridge.nativeRelayRequest === 'function') {
      const bodyStr = body ? JSON.stringify(body) : null;
      const resStr = bridge.nativeRelayRequest(url, method, bodyStr, timeoutMs);
      if (resStr) {
        try {
          const json = JSON.parse(resStr);
          if (json && !json.error) {
            return json;
          }
        } catch (_) {}
      }
    }
  } catch (_) {}

  // 2. Standard web fetch fallback (browser & desktop)
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller?.signal
    }).catch(() => null);
    if (timeoutId) clearTimeout(timeoutId);

    if (res && res.ok) {
      return await res.json().catch(() => null);
    }
  } catch (_) {}

  return null;
}

function getTeacherCandidateEndpoints(roomCode: string, sinceTimestamp: number = 0): string[] {
  const isOnline = typeof navigator === 'undefined' || navigator.onLine;
  const query = roomCode ? `?room=${roomCode}&since=${sinceTimestamp}` : '';
  const endpoints: string[] = [];

  // Teacher always talks to their own local server on port 8888 first
  endpoints.push(`http://127.0.0.1:8888/api/classroom${query}`);

  if (isOnline) {
    endpoints.push(`${RELAY_ENDPOINT}${query}`);
  }
  return endpoints;
}

function getStudentCandidateEndpoints(roomCode: string, sinceTimestamp: number = 0, activeEndpoint: string | null = null): string[] {
  const isOnline = typeof navigator === 'undefined' || navigator.onLine;
  const query = roomCode ? `?room=${roomCode}&since=${sinceTimestamp}` : '';
  const endpoints: string[] = [];

  // If a known working endpoint was previously discovered, prioritize it first!
  if (activeEndpoint) {
    const clean = activeEndpoint.split('?')[0];
    endpoints.push(`${clean}${query}`);
  }

  // If online, check cloud relay first
  if (isOnline) {
    const ep = `${RELAY_ENDPOINT}${query}`;
    if (!endpoints.includes(ep)) endpoints.push(ep);
  }

  // 1. Android Hotspot Gateway IP (Auto-detects Teacher IP on Samsung, OnePlus, Xiaomi, Oppo, etc.)
  try {
    const bridge = typeof window !== 'undefined' ? (window as any).AndroidVoiceBridge : null;
    const gateway = bridge?.getGatewayIp?.();
    if (gateway && gateway !== '0.0.0.0' && gateway !== '127.0.0.1') {
      const ep = `http://${gateway}:8888/api/classroom${query}`;
      if (!endpoints.includes(ep)) endpoints.push(ep);
    }
  } catch (_) {}

  // 2. Teacher IP saved from QR code scan
  try {
    const savedIp = typeof localStorage !== 'undefined' ? localStorage.getItem('palash_teacher_ip') : null;
    if (savedIp) {
      const ep = `http://${savedIp}:8888/api/classroom${query}`;
      if (!endpoints.includes(ep)) endpoints.push(ep);
    }
  } catch (_) {}

  // 3. Common Android Hotspot Gateways
  const commonHotspots = [
    '192.168.43.1',  // Standard AOSP / Pixel / Motorola
    '192.168.49.1',  // Samsung OneUI
    '192.168.50.1',  // OnePlus / Realme / Oppo ColorOS
    '192.168.44.1',  // Xiaomi / Redmi MIUI / HyperOS
    '192.168.225.1', // JioPhone / Reliance
    '10.42.0.1'      // Linux / Custom Android ROM
  ];
  for (const ip of commonHotspots) {
    const ep = `http://${ip}:8888/api/classroom${query}`;
    if (!endpoints.includes(ep)) endpoints.push(ep);
  }

  // 4. Cloud relay fallback
  if (!isOnline) {
    endpoints.push(`${RELAY_ENDPOINT}${query}`);
  }

  // 5. Desktop browser dev mode fallback (only when NOT on Capacitor)
  const isCapacitor = typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
  if (!isCapacitor) {
    endpoints.push(`http://127.0.0.1:8888/api/classroom${query}`);
    endpoints.push(`/api/classroom${query}`);
  }

  return endpoints;
}

class ClassroomService {
  private activeRoomCode: string | null = null;
  private isTeacher: boolean = false;
  private teacherName: string = 'सुनीता मुर्मू (शिक्षिका)';
  private schoolName: string = 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड';
  private teacherGrade: string = 'कक्षा 1';
  private broadcastChannel: BroadcastChannel | null = null;
  private pollInterval: any = null;
  private heartbeatInterval: any = null;
  private localPingInterval: any = null;
  private lastLocalActivityTimestamp: number = 0;
  private lastEventTimestamp: number = 0;
  private studentId: string = 'std_' + Math.random().toString(36).slice(2, 7);
  private listeners: ((event: ClassroomEvent) => void)[] = [];
  private countListeners: ((count: number) => void)[] = [];
  private studentsListeners: ((students: ConnectedStudent[]) => void)[] = [];
  private connectedStudentsMap: Map<string, ConnectedStudent> = new Map();
  private submissionsMap: Map<string, WorksheetSubmission> = new Map();
  private submissionsListeners: ((submissions: WorksheetSubmission[]) => void)[] = [];
  private activeStudentEndpoint: string | null = null;

  // ─── TEACHER: Start Broadcasting ───
  public startBroadcast(teacherName: string, schoolName?: string, grade?: string): string {
    // Reset previous broadcast session data cleanly
    this.resetClassroom();

    // Generate 4-digit easy-to-read room code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.activeRoomCode = code;
    this.isTeacher = true;
    this.teacherName = teacherName || 'सुनीता मुर्मू (शिक्षिका)';
    if (schoolName) this.schoolName = schoolName;
    if (grade) this.teacherGrade = grade;
    this.lastEventTimestamp = Date.now();
    this.connectedStudentsMap.clear();
    this.submissionsMap.clear();

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
          } else if (msg.data?.type === 'worksheet_submission' && msg.data.data) {
            const sub: WorksheetSubmission = msg.data.data;
            this.submissionsMap.set(`${sub.worksheet_id}_${sub.student_id}`, sub);
            this.notifySubmissions();
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
    const room = this.activeRoomCode || (typeof window !== 'undefined' ? sessionStorage.getItem('palash_active_room') : null);
    if (!room) return;
    this.activeRoomCode = room;

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
      room: room,
      teacherName: this.teacherName,
      schoolName: this.schoolName,
      grade: this.teacherGrade,
      type: 'translation',
      data: event
    });
  }

  // ─── TEACHER: Assign Worksheet to Class ───
  public broadcastWorksheet(event: ClassroomWorksheetEvent): void {
    const room = this.activeRoomCode || (typeof window !== 'undefined' ? sessionStorage.getItem('palash_active_room') : null);
    if (!room) return;
    this.activeRoomCode = room;

    const classroomEvent: ClassroomEvent = {
      type: 'worksheet_assigned',
      data: event
    };

    // Store assigned worksheet locally for student mode access
    try {
      const stored = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
      const updated = [event, ...stored.filter((w: any) => w.worksheetId !== event.worksheetId)];
      localStorage.setItem('palash_assigned_worksheets', JSON.stringify(updated.slice(0, 10)));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('palash_worksheet_assigned', { detail: event }));
      }
    } catch (_) {}

    try {
      this.broadcastChannel?.postMessage(classroomEvent);
    } catch (_) {}

    this.postToRelay({
      action: 'publish',
      room: room,
      teacherName: this.teacherName,
      schoolName: this.schoolName,
      grade: this.teacherGrade,
      type: 'worksheet_assigned',
      data: event
    });
  }

  // ─── TEACHER: Stop Broadcasting (Without wiping assignments) ───
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

  // ─── TEACHER: Clear Distributed Worksheet on Demand ───
  public clearDistributedWorksheet(worksheetId?: string): void {
    const room = this.activeRoomCode || (typeof window !== 'undefined' ? sessionStorage.getItem('palash_active_room') : null);
    try {
      localStorage.removeItem('palash_assigned_worksheets');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('palash_clear_worksheet', { detail: { worksheetId } }));
      }
    } catch (_) {}

    try {
      this.broadcastChannel?.postMessage({
        type: 'clear_worksheet',
        data: { worksheetId }
      });
    } catch (_) {}

    if (room) {
      this.postToRelay({
        action: 'clear_worksheet',
        room: room,
        worksheetId: worksheetId
      });
    }
  }

  // ─── RESET CLASSROOM ───
  public resetClassroom(): void {
    const room = this.activeRoomCode || (typeof window !== 'undefined' ? sessionStorage.getItem('palash_active_room') : null);
    try {
      localStorage.removeItem('palash_assigned_worksheets');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('palash_classroom_reset'));
      }
    } catch (_) {}

    this.submissionsMap.clear();
    this.notifySubmissions();

    try {
      this.broadcastChannel?.postMessage({ type: 'classroom_reset' });
    } catch (_) {}

    if (room) {
      this.postToRelay({
        action: 'reset_classroom',
        room: room
      });
    }
  }

  // ─── SUBMISSION TRACKING ───
  public onSubmissionsUpdate(callback: (subs: WorksheetSubmission[]) => void): () => void {
    this.submissionsListeners.push(callback);
    callback(Array.from(this.submissionsMap.values()));
    return () => {
      this.submissionsListeners = this.submissionsListeners.filter(cb => cb !== callback);
    };
  }

  public getSubmissions(): WorksheetSubmission[] {
    return Array.from(this.submissionsMap.values());
  }

  public async submitWorksheetResult(submission: WorksheetSubmission): Promise<any> {
    const student = authService.getStudentProfile();
    const room = this.activeRoomCode ||
      student?.roomCode ||
      (typeof window !== 'undefined' ? (localStorage.getItem('palash_student_room') || sessionStorage.getItem('palash_active_room')) : null);

    const studentId = submission.student_id || student?.studentId || (student as any)?.id || 'std_' + Math.random().toString(36).slice(2, 6);
    const studentName = submission.student_name || student?.studentName || 'विद्यार्थी';

    const normalizedSubmission: WorksheetSubmission = {
      ...submission,
      student_id: studentId,
      student_name: studentName,
      worksheet_id: submission.worksheet_id || 'ws_default',
      worksheet_title: submission.worksheet_title || 'कक्षा अभ्यास पत्र',
      score: typeof submission.score === 'number' ? submission.score : 0,
      total_questions: typeof submission.total_questions === 'number' ? submission.total_questions : (submission.answers?.length || 5),
      percentage: typeof submission.percentage === 'number' ? submission.percentage : 0,
      timestamp: submission.timestamp || Date.now(),
      answers: submission.answers || []
    };

    // 1. Save locally in student completed submissions
    try {
      const stored = JSON.parse(localStorage.getItem('palash_student_my_submissions') || '[]');
      const updated = [normalizedSubmission, ...stored.filter((s: any) => s.worksheet_id !== normalizedSubmission.worksheet_id)];
      localStorage.setItem('palash_student_my_submissions', JSON.stringify(updated.slice(0, 20)));

      // Remove from pending assigned list once submitted
      const assigned = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
      const remainingAssigned = assigned.filter((w: any) => w.worksheetId !== normalizedSubmission.worksheet_id && w.worksheet_id !== normalizedSubmission.worksheet_id);
      localStorage.setItem('palash_assigned_worksheets', JSON.stringify(remainingAssigned));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('palash_worksheet_submitted', { detail: normalizedSubmission }));
      }
    } catch (_) {}

    // 2. Post to local BroadcastChannel (peer-to-peer / offline)
    try {
      this.broadcastChannel?.postMessage({
        type: 'worksheet_submission',
        data: normalizedSubmission
      });
    } catch (_) {}

    // 3. Post to Relay
    if (room) {
      return this.postToRelay({
        action: 'submit_worksheet',
        room: room,
        submission: normalizedSubmission,
        // Flat properties for full server backward compatibility
        studentId: normalizedSubmission.student_id,
        studentName: normalizedSubmission.student_name,
        worksheetId: normalizedSubmission.worksheet_id,
        worksheetTitle: normalizedSubmission.worksheet_title,
        score: normalizedSubmission.score,
        totalQuestions: normalizedSubmission.total_questions,
        percentage: normalizedSubmission.percentage,
        responses: normalizedSubmission.answers.map(a => ({
          questionId: a.question_id,
          questionHin: a.question_text,
          selectedAnswer: a.selected_answer,
          correctAnswer: a.correct_answer,
          isCorrect: a.is_correct
        }))
      });
    }
    return { success: true };
  }

  private notifySubmissions(): void {
    const list = Array.from(this.submissionsMap.values());
    this.submissionsListeners.forEach(fn => fn(list));
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
            this.lastLocalActivityTimestamp = Date.now();
            if (onConnectionStatus) onConnectionStatus({ connected: true, teacherActive: true });

            if (msg.data.type === 'classroom_reset' || msg.data.type === 'clear_worksheet') {
              try {
                localStorage.removeItem('palash_assigned_worksheets');
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('palash_clear_worksheet', { detail: msg.data.data }));
                }
              } catch (_) {}
              onEvent({ type: msg.data.type, data: msg.data.data });
            } else if (msg.data.type === 'translation' || msg.data.type === 'worksheet_assigned') {
              if (msg.data.type === 'worksheet_assigned' && msg.data.data) {
                try {
                  const stored = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
                  const updated = [msg.data.data, ...stored.filter((w: any) => w.worksheetId !== msg.data.data.worksheetId)];
                  localStorage.setItem('palash_assigned_worksheets', JSON.stringify(updated.slice(0, 10)));
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('palash_worksheet_assigned', { detail: msg.data.data }));
                  }
                } catch (_) {}
              }
              onEvent(msg.data);
            }
            if ((msg.data.type === 'teacher_ack' || msg.data.type === 'teacher_heartbeat') && msg.data.info) {
              if (onClassroomInfo) onClassroomInfo(msg.data.info);
              if (onConnectionStatus) onConnectionStatus({ connected: true, teacherActive: true });
            }
          }
        };

        // Continual local ping on BroadcastChannel (offline peer bus)
        const sendLocalPing = () => {
          try {
            this.broadcastChannel?.postMessage({
              type: 'student_ping',
              student: studentObj
            });
          } catch (_) {}
        };
        sendLocalPing();
        if (this.localPingInterval) clearInterval(this.localPingInterval);
        this.localPingInterval = setInterval(sendLocalPing, 2000);
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
    if (this.localPingInterval) clearInterval(this.localPingInterval);
    this.localPingInterval = null;
    this.lastLocalActivityTimestamp = 0;
    this.activeStudentEndpoint = null;
    try {
      this.broadcastChannel?.close();
    } catch (_) {}
    this.broadcastChannel = null;
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
    const roomCode = body.room || this.activeRoomCode || '';
    const endpoints = this.isTeacher
      ? getTeacherCandidateEndpoints(roomCode)
      : getStudentCandidateEndpoints(roomCode, 0, this.activeStudentEndpoint);

    for (const ep of endpoints) {
      const cleanUrl = ep.split('?')[0];
      const timeoutMs = cleanUrl.includes('palashsetu-xi') ? 2000 : 600;
      const res = await executeRelayRequest(cleanUrl, 'POST', body, timeoutMs);
      if (res && (res.success || res.exists)) {
        this.lastLocalActivityTimestamp = Date.now();
        if (!this.isTeacher) {
          this.activeStudentEndpoint = cleanUrl;
        }
        return res;
      }
    }
    return null;
  }

  private startTeacherPolling(roomCode: string): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    let isTeacherPolling = false;

    this.pollInterval = setInterval(async () => {
      if (isTeacherPolling) return;
      isTeacherPolling = true;

      try {
        // 1. Broadcast local teacher_ack over BroadcastChannel (LOCAL OFFLINE BUS)
        try {
          this.broadcastChannel?.postMessage({
            type: 'teacher_ack',
            info: {
              roomCode: roomCode,
              teacherName: this.teacherName,
              schoolName: this.schoolName,
              grade: this.teacherGrade,
              teacherActive: true,
              studentCount: this.connectedStudentsMap.size
            }
          });
        } catch (_) {}

        // 2. Send teacher heartbeat ping to keep classroom alive on local hotspot & relay
        this.postToRelay({
          action: 'teacher_ping',
          room: roomCode,
          teacherName: this.teacherName,
          schoolName: this.schoolName,
          grade: this.teacherGrade
        });

        // 3. Poll submissions and students across local server and cloud
        const endpoints = getTeacherCandidateEndpoints(roomCode, this.lastEventTimestamp);

        for (const ep of endpoints) {
          const timeoutMs = ep.includes('palashsetu-xi') ? 2000 : 600;
          const data = await executeRelayRequest(ep, 'GET', undefined, timeoutMs);

          if (data && (data.exists || data.students || data.submissions)) {
            if (Array.isArray(data.students)) {
              data.students.forEach((st: ConnectedStudent) => {
                this.connectedStudentsMap.set(st.id, {
                  ...st,
                  joinedAt: this.connectedStudentsMap.get(st.id)?.joinedAt || Date.now()
                });
              });
              this.notifyStudents();
            }
            if (Array.isArray(data.submissions)) {
              data.submissions.forEach((sub: any) => {
                const answersList = Array.isArray(sub.answers) ? sub.answers : (Array.isArray(sub.responses) ? sub.responses.map((r: any) => ({
                  question_id: r.questionId ?? r.question_id,
                  question_text: r.questionHin ?? r.question_text ?? '',
                  selected_answer: r.selectedAnswer ?? r.selected_answer ?? '',
                  correct_answer: r.correctAnswer ?? r.correct_answer ?? '',
                  is_correct: !!(r.isCorrect ?? r.is_correct)
                })) : []);

                const normalizedSub: WorksheetSubmission = {
                  student_id: sub.student_id || sub.studentId || 'std_' + Math.random().toString(36).slice(2, 6),
                  student_name: sub.student_name || sub.studentName || 'विद्यार्थी',
                  worksheet_id: sub.worksheet_id || sub.worksheetId || 'ws_default',
                  worksheet_title: sub.worksheet_title || sub.worksheetTitle || 'कक्षा अभ्यास पत्र',
                  score: typeof sub.score === 'number' ? sub.score : 0,
                  total_questions: typeof sub.total_questions === 'number' ? sub.total_questions : (typeof sub.totalQuestions === 'number' ? sub.totalQuestions : answersList.length || 5),
                  percentage: typeof sub.percentage === 'number' ? sub.percentage : 0,
                  timestamp: sub.timestamp || sub.submittedAt || Date.now(),
                  answers: answersList
                };
                this.submissionsMap.set(`${normalizedSub.worksheet_id}_${normalizedSub.student_id}`, normalizedSub);
              });
              this.notifySubmissions();
            }
            if (typeof data.studentCount === 'number') {
              this.notifyCount(data.studentCount);
            }
            break;
          }
        }
      } catch (_) {
      } finally {
        isTeacherPolling = false;
      }
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
    let isPolling = false;

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
          this.lastLocalActivityTimestamp = Date.now();
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

          // Instant active translation delivery on first handshake
          if (res.activeSpeech && res.activeSpeech.timestamp > this.lastEventTimestamp) {
            this.lastEventTimestamp = res.activeSpeech.timestamp;
            this.listeners.forEach(fn => fn({ type: 'translation', data: res.activeSpeech }));
          }

          // Process recent events received in ping
          if (Array.isArray(res.recentEvents)) {
            res.recentEvents.forEach((ev: any) => {
              if (ev && ev.timestamp > this.lastEventTimestamp) {
                this.lastEventTimestamp = ev.timestamp;
                if (ev.type === 'classroom_reset' || ev.type === 'clear_worksheet') {
                  try {
                    localStorage.removeItem('palash_assigned_worksheets');
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('palash_clear_worksheet', { detail: ev.data }));
                    }
                  } catch (_) {}
                  this.listeners.forEach(fn => fn({ type: ev.type, data: ev.data }));
                } else if (ev.type === 'worksheet_assigned' && ev.data) {
                  try {
                    const stored = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
                    const updated = [ev.data, ...stored.filter((w: any) => w.worksheetId !== ev.data.worksheetId)];
                    localStorage.setItem('palash_assigned_worksheets', JSON.stringify(updated.slice(0, 10)));
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('palash_worksheet_assigned', { detail: ev.data }));
                    }
                  } catch (_) {}
                  this.listeners.forEach(fn => fn({ type: ev.type, data: ev.data }));
                } else {
                  this.listeners.forEach(fn => fn({ type: ev.type, data: ev.data }));
                }
              }
            });
          }
        } else {
          // If local offline bus is alive, DO NOT mark disconnected
          const isLocalActive = (Date.now() - this.lastLocalActivityTimestamp) < 30000;
          if (isLocalActive) {
            consecutiveFailures = 0;
            if (onConnectionStatus) {
              onConnectionStatus({
                connected: true,
                teacherActive: true
              });
            }
          } else {
            consecutiveFailures++;
            if (consecutiveFailures >= 8 && onConnectionStatus) {
              onConnectionStatus({
                connected: false,
                teacherActive: false,
                errorReason: 'शिक्षक से संपर्क नहीं हो पा रहा है।'
              });
            }
          }
        }
      } catch (_) {
        const isLocalActive = (Date.now() - this.lastLocalActivityTimestamp) < 30000;
        if (isLocalActive) {
          consecutiveFailures = 0;
          if (onConnectionStatus) {
            onConnectionStatus({
              connected: true,
              teacherActive: true
            });
          }
        } else {
          consecutiveFailures++;
          if (consecutiveFailures >= 8 && onConnectionStatus) {
            onConnectionStatus({
              connected: false,
              teacherActive: false,
              errorReason: 'शिक्षक से संपर्क नहीं हो पा रहा है।'
            });
          }
        }
      }
    };

    // Initial ping
    sendPing();

    // Heartbeat every 5s
    this.heartbeatInterval = setInterval(sendPing, 5000);

    const pollEvents = async () => {
      if (isPolling) return;
      isPolling = true;

      try {
        const endpoints = getStudentCandidateEndpoints(roomCode, this.lastEventTimestamp, this.activeStudentEndpoint);

        for (const ep of endpoints) {
          const timeoutMs = ep.includes('palashsetu-xi') ? 2000 : 600;
          const data = await executeRelayRequest(ep, 'GET', undefined, timeoutMs);

          if (data && data.exists) {
            this.activeStudentEndpoint = ep.split('?')[0];
            consecutiveFailures = 0;
            this.lastLocalActivityTimestamp = Date.now();
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

            if (Array.isArray(data.events)) {
              data.events.forEach((ev: any) => {
                if (ev.timestamp > this.lastEventTimestamp) {
                  this.lastEventTimestamp = ev.timestamp;
                  if (ev.type === 'classroom_reset') {
                    try {
                      localStorage.removeItem('palash_assigned_worksheets');
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('palash_classroom_reset'));
                      }
                    } catch (_) {}
                    this.listeners.forEach((fn) => fn({ type: 'classroom_reset' }));
                  } else if (ev.type === 'worksheet_assigned' && ev.data) {
                    try {
                      const stored = JSON.parse(localStorage.getItem('palash_assigned_worksheets') || '[]');
                      const updated = [ev.data, ...stored.filter((w: any) => w.worksheetId !== ev.data.worksheetId)];
                      localStorage.setItem('palash_assigned_worksheets', JSON.stringify(updated.slice(0, 10)));
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('palash_worksheet_assigned', { detail: ev.data }));
                      }
                    } catch (_) {}
                    const mappedEvent: ClassroomEvent = {
                      type: ev.type,
                      data: ev.data
                    };
                    this.listeners.forEach((fn) => fn(mappedEvent));
                  } else {
                    const mappedEvent: ClassroomEvent = {
                      type: ev.type,
                      data: ev.data
                    };
                    this.listeners.forEach((fn) => fn(mappedEvent));
                  }
                }
              });
            }
            if (typeof data.studentCount === 'number') {
              this.notifyCount(data.studentCount);
            }
            return; // Successfully polled endpoint
          }
        }

        // If all network endpoints failed, check local channel
        const isLocalActive = (Date.now() - this.lastLocalActivityTimestamp) < 30000;
        if (isLocalActive && onConnectionStatus) {
          onConnectionStatus({
            connected: true,
            teacherActive: true
          });
        }
      } finally {
        isPolling = false;
      }
    };

    // Immediate initial poll
    pollEvents();

    // Fast poll every 2000ms
    this.pollInterval = setInterval(pollEvents, 2000);
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
