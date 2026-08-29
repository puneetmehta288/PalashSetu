import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveTranslation from './pages/LiveTranslation';
import Lessons from './pages/Lessons';
import LessonView from './pages/LessonView';
import Worksheets from './pages/Worksheets';
import WorksheetView from './pages/WorksheetView';
import PDFLocalizer from './pages/PDFLocalizer';
import VideoLocalizer from './pages/VideoLocalizer';
import Flashcards from './pages/Flashcards';
import FlashcardView from './pages/FlashcardView';
import OfflineLibrary from './pages/OfflineLibrary';
import Settings from './pages/Settings';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import { authService, TeacherProfile } from './services/authService';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const profile = authService.getActiveProfile();
    setActiveTeacher(profile);
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
          <Layout
            activeTeacher={activeTeacher}
            onSwitchTeacher={handleSwitchTeacher}
          />
        }
      >
        <Route index element={<Dashboard activeTeacher={activeTeacher} />} />
        <Route path="translate" element={<LiveTranslation />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/:id" element={<LessonView />} />
        <Route path="worksheets" element={<Worksheets />} />
        <Route path="worksheets/:id" element={<WorksheetView />} />
        <Route path="pdf" element={<PDFLocalizer />} />
        <Route path="video" element={<VideoLocalizer />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="flashcards/:topic" element={<FlashcardView />} />
        <Route path="library" element={<OfflineLibrary />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
