import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveTranslation from './pages/LiveTranslation';
import Lessons from './pages/Lessons';
import Worksheets from './pages/Worksheets';
import JCERTTextbooks from './pages/JCERTTextbooks';
import Flashcards from './pages/Flashcards';
import Settings from './pages/Settings';
import Attendance from './pages/Attendance';
import ReportIssue from './pages/ReportIssue';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import StudentClassroom from './pages/StudentClassroom';
import { authService, TeacherProfile, StudentProfile, UserRole } from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import { StatusBar } from '@capacitor/status-bar';

// ─── White-Screen Safety Net: Error Boundary ─────────────────────────────────
// If any React subtree throws (including navigation to an unmatched route that
// causes a component crash), this boundary catches it and sends the user home
// instead of leaving them on a frozen white screen.
interface EBState { hasError: boolean; error?: string; }
class ErrorBoundary extends Component<{ children: React.ReactNode }, EBState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any): EBState {
    return { hasError: true, error: String(error?.message || error) };
  }
  componentDidCatch() {
    // Auto-recover: redirect to home after 2s
    setTimeout(() => {
      try { window.location.replace('/'); } catch (_) {}
    }, 2000);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#f0f9ff',
          fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h2 style={{ color: '#0f2744', marginBottom: '0.5rem' }}>वापस जा रहे हैं…</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Returning to home screen automatically…
          </p>
          <button
            onClick={() => window.location.replace('/')}
            style={{
              marginTop: '1.5rem', padding: '10px 24px', background: '#0f2744',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            🏠 अभी वापस जाएं (Go Home Now)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(() => authService.getUserRole());
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile | null>(() => authService.getActiveProfile());
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(() => authService.getStudentProfile());

  useEffect(() => {
    // Proactively request camera and microphone permissions on app launch
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then((stream) => {
          stream.getTracks().forEach((t) => t.stop());
        })
        .catch(() => {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => stream.getTracks().forEach((t) => t.stop()))
            .catch(() => {});
        });
    }

    // If neither session is active, navigate to login
    if (role === 'student' && !activeStudent) {
      navigate('/login', { replace: true });
    } else if (role === 'teacher' && !activeTeacher) {
      navigate('/login', { replace: true });
    }

    const configureStatusBar = async () => {
      try {
        await StatusBar.hide();
      } catch (_) {}
    };
    configureStatusBar();
  }, [role, activeTeacher, activeStudent, navigate]);

  const handleLoginSuccess = (profile: TeacherProfile | StudentProfile) => {
    if ('teacherId' in profile) {
      setRole('teacher');
      setActiveTeacher(profile as TeacherProfile);
      setActiveStudent(null);
    } else {
      setRole('student');
      setActiveStudent(profile as StudentProfile);
      setActiveTeacher(null);
    }
    navigate('/');
  };

  const handleLogout = () => {
    authService.logout();
    setActiveTeacher(null);
    setActiveStudent(null);
    setRole('teacher');
    navigate('/login');
  };

  const isLoggedIn = (role === 'teacher' && !!activeTeacher) || (role === 'student' && !!activeStudent);

  return (
    <Routes>
      <Route path="/login" element={<AuthLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/register" element={<AuthRegister onRegisterSuccess={handleLoginSuccess} />} />

      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Layout
              role={role}
              activeTeacher={activeTeacher}
              activeStudent={activeStudent}
              onLogout={handleLogout}
            />
          ) : (
            <AuthLogin onLoginSuccess={handleLoginSuccess} />
          )
        }
      >
        {/* If student, homepage is StudentClassroom; if teacher, homepage is Dashboard */}
        <Route
          index
          element={
            role === 'student' ? (
              <StudentClassroom />
            ) : (
              <Dashboard activeTeacher={activeTeacher} />
            )
          }
        />

        {/* /classroom alias → same as index so any stale navigate('/classroom') calls work */}
        <Route
          path="classroom"
          element={
            role === 'student' ? (
              <StudentClassroom />
            ) : (
              <Dashboard activeTeacher={activeTeacher} />
            )
          }
        />

        {/* Translation: Teachers get full copilot; students get live listener */}
        <Route
          path="translate"
          element={
            role === 'student' ? (
              <StudentClassroom />
            ) : (
              <LiveTranslation />
            )
          }
        />

        {/* Learning Pages Accessible to Both */}
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="worksheets" element={<Worksheets />} />
        <Route path="books" element={<JCERTTextbooks />} />
        <Route path="jcert" element={<JCERTTextbooks />} />

        {/* Teacher Only Pages */}
        <Route
          path="lessons"
          element={role === 'teacher' ? <Lessons /> : <Navigate to="/" replace />}
        />
        <Route
          path="attendance"
          element={role === 'teacher' ? <Attendance /> : <Navigate to="/" replace />}
        />
        <Route
          path="settings"
          element={<Settings />}
        />
        <Route
          path="report"
          element={role === 'teacher' ? <ReportIssue activeTeacher={activeTeacher} /> : <Navigate to="/" replace />}
        />

        {/* Catch-all: any unknown URL redirects home instead of white screen */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Top-level catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
