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

interface RoomData {
  roomCode: string;
  teacherName?: string;
  schoolName?: string;
  grade?: string;
  lastActive: number;
  students: Record<string, StudentInfo>;
  events: RoomEvent[];
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

    const newEvents = (room.events || []).filter(e => e.timestamp > since);

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
      events: newEvents
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
          grade: room.grade
        });
      }

      // Action 3: Teacher closing the room
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
