/**
 * api/classroom.ts — Vercel Serverless Function
 * Real-time relay for Classroom Broadcast (Teacher Tablet -> Student Tablets).
 * Works across different physical devices on Wi-Fi/4G/Hotspot.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

interface ApiRequest {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(data: any): void;
  end(): void;
}

interface RoomEvent {
  id: string;
  type: 'translation' | 'worksheet_assigned' | 'announcement';
  timestamp: number;
  data: any;
}

interface StudentInfo {
  id: string;
  name: string;
  grade?: string;
  avatar?: string;
  lastSeen: number;
}

interface WorksheetSubmission {
  studentId: string;
  studentName: string;
  studentGrade?: string;
  studentAvatar?: string;
  worksheetId: string;
  worksheetTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: number;
  responses: Array<{
    questionId: number;
    questionHin: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

interface RoomData {
  roomCode: string;
  teacherName?: string;
  schoolName?: string;
  grade?: string;
  lastActive: number;
  students: Record<string, StudentInfo>;
  events: RoomEvent[];
  submissions?: WorksheetSubmission[];
}

const TMP_FILE = path.join(os.tmpdir(), 'palash_classroom_rooms.json');

declare const global: { __palashRooms?: Record<string, RoomData> };
if (!global.__palashRooms) global.__palashRooms = {};

function loadRooms(): Record<string, RoomData> {
  if (global.__palashRooms && Object.keys(global.__palashRooms).length > 0) {
    return global.__palashRooms;
  }
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        global.__palashRooms = parsed;
        return parsed;
      }
    }
  } catch (_) {}
  return global.__palashRooms;
}

function saveRooms(rooms: Record<string, RoomData>): void {
  global.__palashRooms = rooms;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(rooms), 'utf-8');
  } catch (_) {}
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rooms = loadRooms();
  const now = Date.now();

  // ─── GET: Poll room events & student details ───
  if (req.method === 'GET') {
    const roomCode = String(req.query?.room || '').trim().toUpperCase();
    const since = parseInt(String(req.query?.since || '0'), 10) || 0;

    if (!roomCode) {
      return res.status(400).json({ error: 'Missing room parameter' });
    }

    const room = rooms[roomCode];
    if (!room) {
      return res.status(200).json({
        exists: false,
        studentCount: 0,
        teacherActive: false,
        students: [],
        events: []
      });
    }

    // Clean up inactive students (>30s)
    const activeStudents = Object.values(room.students || {})
      .filter(s => (now - s.lastSeen) < 30000);

    const newEvents = since > 0
      ? (room.events || []).filter(e => e.timestamp > since)
      : (room.events || []).slice(-10);

    return res.status(200).json({
      exists: true,
      roomCode: room.roomCode,
      teacherName: room.teacherName || 'शिक्षिका',
      schoolName: room.schoolName || 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड',
      grade: room.grade || 'कक्षा 1',
      teacherActive: (now - (room.lastActive || 0)) < 60000,
      studentCount: activeStudents.length,
      students: activeStudents.map(s => ({
        id: s.id,
        name: s.name,
        grade: s.grade,
        avatar: s.avatar
      })),
      events: newEvents,
      submissions: room.submissions || []
    });
  }

  // ─── POST: Teacher publishing or Student heartbeat ───
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !body.room) {
        return res.status(400).json({ error: 'Missing room in request body' });
      }

      const roomCode = String(body.room).trim().toUpperCase();
      if (!rooms[roomCode]) {
        rooms[roomCode] = {
          roomCode,
          teacherName: body.teacherName || 'शिक्षिका',
          schoolName: body.schoolName || 'उत्क्रमित प्राथमिक विद्यालय, काठीकुंड',
          grade: body.grade || 'कक्षा 1',
          lastActive: now,
          students: {},
          events: []
        };
      }

      const room = rooms[roomCode];

      // Action 1: Teacher publishing a translation or assignment
      if (body.action === 'publish') {
        room.lastActive = now;
        if (body.teacherName) room.teacherName = body.teacherName;
        if (body.schoolName) room.schoolName = body.schoolName;
        if (body.grade) room.grade = body.grade;

        const newEvent: RoomEvent = {
          id: `ev_${now}_${Math.random().toString(36).slice(2, 6)}`,
          type: body.type || 'translation',
          timestamp: now,
          data: body.data || {}
        };

        room.events.push(newEvent);
        // Keep last 40 events per room to bound memory
        if (room.events.length > 40) room.events.shift();

        saveRooms(rooms);
        return res.status(200).json({ success: true, eventId: newEvent.id });
      }

      // Action 2: Student heartbeat / ping
      if (body.action === 'student_ping') {
        const studentId = String(body.studentId || 'std_' + Math.random().toString(36).slice(2, 6));
        room.students[studentId] = {
          id: studentId,
          name: String(body.studentName || 'विद्यार्थी'),
          grade: String(body.grade || 'कक्षा 1'),
          avatar: String(body.avatar || '🎒'),
          lastSeen: now
        };

        saveRooms(rooms);

        const activeStudents = Object.values(room.students)
          .filter(s => (now - s.lastSeen) < 30000);

        const activeEvents = (room.events || []);
        const activeSpeechEvent = [...activeEvents].reverse().find(e => e.type === 'translation');

        return res.status(200).json({
          success: true,
          studentCount: activeStudents.length,
          students: activeStudents.map(s => ({
            id: s.id,
            name: s.name,
            grade: s.grade,
            avatar: s.avatar
          })),
          teacherActive: (now - (room.lastActive || 0)) < 60000,
          teacherName: room.teacherName,
          schoolName: room.schoolName,
          grade: room.grade,
          recentEvents: activeEvents.slice(-5),
          activeSpeech: activeSpeechEvent ? activeSpeechEvent.data : null
        });
      }

      // Action 3: Student submitting worksheet answers
      if (body.action === 'submit_worksheet') {
        if (!room.submissions) room.submissions = [];
        const submission: WorksheetSubmission = {
          studentId: String(body.studentId || 'std_' + Math.random().toString(36).slice(2, 6)),
          studentName: String(body.studentName || 'विद्यार्थी'),
          studentGrade: String(body.studentGrade || room.grade || 'कक्षा 1'),
          studentAvatar: String(body.studentAvatar || '🎒'),
          worksheetId: String(body.worksheetId || 'ws_default'),
          worksheetTitle: String(body.worksheetTitle || 'कक्षा अभ्यास पत्र'),
          score: typeof body.score === 'number' ? body.score : 0,
          totalQuestions: typeof body.totalQuestions === 'number' ? body.totalQuestions : 5,
          percentage: typeof body.percentage === 'number' ? body.percentage : 0,
          submittedAt: now,
          responses: Array.isArray(body.responses) ? body.responses : []
        };

        const existingIdx = room.submissions.findIndex(s => s.studentId === submission.studentId && s.worksheetId === submission.worksheetId);
        if (existingIdx >= 0) {
          room.submissions[existingIdx] = submission;
        } else {
          room.submissions.push(submission);
        }

        const submissionEvent: RoomEvent = {
          id: `sub_${now}_${submission.studentId}`,
          type: 'worksheet_submission' as any,
          timestamp: now,
          data: submission
        };
        room.events.push(submissionEvent);
        if (room.events.length > 40) room.events.shift();

        saveRooms(rooms);
        return res.status(200).json({ success: true, submissionId: submission.studentId });
      }

      // Action 4: Teacher resetting classroom (new session / clear previous worksheet)
      if (body.action === 'reset_classroom') {
        room.events = [];
        room.submissions = [];
        saveRooms(rooms);
        return res.status(200).json({ success: true, reset: true });
      }

      // Action 5: Teacher closing the room
      if (body.action === 'close') {
        delete rooms[roomCode];
        saveRooms(rooms);
        return res.status(200).json({ success: true, closed: true });
      }

      return res.status(400).json({ error: 'Unknown action' });
    } catch (err: any) {
      console.error('[Classroom API Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
