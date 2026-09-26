import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
import { authService, TeacherProfile } from './services/authService';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StatusBar, Style } from '@capacitor/status-bar';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  // Shared school tablet requirement: Always start on Teacher Profile Selection
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Ensure the app opens directly to Teacher Profile Selection screen
    if (!activeTeacher) {
      navigate('/login', { replace: true });
    }

    // Enable clean immersive fullscreen mode for tablets
    const configureStatusBar = async () => {
      try {
        await StatusBar.hide();
      } catch (err) {
        // Ignored on web/browser preview
      }
    };
    configureStatusBar();
  }, []);

  const handleLoginSuccess = (profile: TeacherProfile) => {
    setActiveTeacher(profile);
  };

  const handleSwitchTeacher = () => {
    authService.logout();
    setActiveTeacher(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<AuthLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/register" element={<AuthRegister onRegisterSuccess={handleLoginSuccess} />} />

      <Route
        path="/"
        element={
          activeTeacher ? (
            <Layout
              activeTeacher={activeTeacher}
              onSwitchTeacher={handleSwitchTeacher}
            />
          ) : (
            <AuthLogin onLoginSuccess={handleLoginSuccess} />
          )
        }
      >
        <Route index element={<Dashboard activeTeacher={activeTeacher} />} />
        <Route path="translate" element={<LiveTranslation />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="worksheets" element={<Worksheets />} />
        <Route path="books" element={<JCERTTextbooks />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="settings" element={<Settings />} />
        <Route path="report" element={<ReportIssue activeTeacher={activeTeacher} />} />
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
