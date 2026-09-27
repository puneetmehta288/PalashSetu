import React, { useState, useEffect } from 'react';
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

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(() => authService.getUserRole());
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile | null>(() => authService.getActiveProfile());
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(() => authService.getStudentProfile());

  useEffect(() => {
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
          element={role === 'teacher' ? <Settings /> : <Navigate to="/" replace />}
        />
        <Route
          path="report"
          element={role === 'teacher' ? <ReportIssue activeTeacher={activeTeacher} /> : <Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
