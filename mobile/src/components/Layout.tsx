import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';

interface LayoutProps {
  activeTeacher?: TeacherProfile | null;
  onSwitchTeacher?: () => void;
}

const BOTTOM_NAV_ITEMS = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/translate', icon: '🎙️', label: 'Voice' },
  { to: '/flashcards', icon: '🃏', label: 'Cards' },
  { to: '/lessons', icon: '📚', label: 'Lessons' },
  { to: '/worksheets', icon: '📝', label: 'Worksheets' },
];

const Layout: React.FC<LayoutProps> = ({ activeTeacher, onSwitchTeacher }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar with slide-out mobile drawer */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="main-content">
        <Header
          isOnline={true}
          activeTeacher={activeTeacher}
          onSwitchTeacher={onSwitchTeacher}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <div className="content-area">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation Bar (Visible only on <= 768px screens) */}
        <nav className="mobile-bottom-nav">
          {BOTTOM_NAV_ITEMS.map((item) => (
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
