import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { TeacherProfile, StudentProfile, UserRole } from '../services/authService';
import { sfx } from '../utils/sfx';

interface LayoutProps {
  role?: UserRole;
  activeTeacher?: TeacherProfile | null;
  activeStudent?: StudentProfile | null;
  onLogout?: () => void;
}

const TEACHER_BOTTOM_NAV_ITEMS = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/translate', icon: '🎙️', label: 'Voice' },
  { to: '/flashcards', icon: '🃏', label: 'Cards' },
  { to: '/lessons', icon: '📚', label: 'Lessons' },
  { to: '/worksheets', icon: '📝', label: 'Worksheets' },
  { to: '/books', icon: '📖', label: 'Books' },
];

const STUDENT_BOTTOM_NAV_ITEMS = [
  { to: '/', icon: '📡', label: 'Classroom' },
  { to: '/worksheets', icon: '📝', label: 'Worksheets' },
  { to: '/flashcards', icon: '🃏', label: 'Cards' },
  { to: '/books', icon: '📖', label: 'Books' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

const Layout: React.FC<LayoutProps> = ({ role = 'teacher', activeTeacher, activeStudent, onLogout }) => {
  // On desktop (> 1200px), default open. On tablet and mobile (<= 1200px), default closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1200;
    }
    return false;
  });

  // Listen for Escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const bottomNavItems = role === 'student' ? STUDENT_BOTTOM_NAV_ITEMS : TEACHER_BOTTOM_NAV_ITEMS;

  return (
    <div className="app-container">
      {/* Sidebar with role-based filtered items */}
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <Header
          isOnline={true}
          role={role}
          activeTeacher={activeTeacher}
          activeStudent={activeStudent}
          onSwitchTeacher={onLogout}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <div className="content-area">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation Bar (Visible only on <= 768px screens) */}
        <nav className="mobile-bottom-nav">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => sfx.playTap()}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
