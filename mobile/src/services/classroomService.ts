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
  private submissionsMap: Map<string, WorksheetSubmission> = new Map();
  private submissionsListeners: ((submissions: WorksheetSubmission[]) => void)[] = [];

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
        // 1. Send teacher heartbeat ping to keep classroom alive on relay
        this.postToRelay({
          action: 'teacher_ping',
          room: roomCode,
          teacherName: this.teacherName,
          schoolName: this.schoolName,
          grade: this.teacherGrade
        });

        // 2. Poll submissions and students
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
          if (data && Array.isArray(data.submissions)) {
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
          consecutiveFailures++;
          if (consecutiveFailures >= 5 && onConnectionStatus) {
            onConnectionStatus({
              connected: false,
              teacherActive: false,
              errorReason: 'शिक्षक से संपर्क नहीं हो पा रहा है। कृपया सुनिश्चित करें कि आप शिक्षक के हॉटस्पॉट या उसी वाई-फ़ाई से जुड़े हैं।'
            });
          }
        }
      } catch (_) {
        consecutiveFailures++;
        if (consecutiveFailures >= 5 && onConnectionStatus) {
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

    const pollEvents = async () => {
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
          if (data && typeof data.studentCount === 'number') {
            this.notifyCount(data.studentCount);
          }
        }
      } catch (_) {}
    };

    // Immediate initial poll (0ms) so student gets events right away without waiting
    pollEvents();

    // Fast poll every 800ms
    this.pollInterval = setInterval(pollEvents, 800);
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
