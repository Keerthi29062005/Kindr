import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Upload, Users, GitMerge,
  FileText, Lightbulb, Menu, X, Activity, Zap
} from 'lucide-react';
import './Layout.css';
 
const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/upload', icon: Upload, label: 'Upload Report' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/volunteer', icon: Users, label: 'Join as Volunteer' },
  { to: '/match', icon: GitMerge, label: 'Match Volunteers' },
  { to: '/insights', icon: Lightbulb, label: 'AI Insights' },
];
 
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
 
  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* ─── Sidebar ─────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Zap size={18} />
            </div>
            {sidebarOpen && (
              <div className="logo-text">
                <span className="logo-name">CommunityIQ</span>
                <span className="logo-tagline">Smart Intelligence</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
 
        <div className="sidebar-status">
          <div className="status-dot active" />
          {sidebarOpen && <span className="status-text">AI Engine Online</span>}
        </div>
 
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              {sidebarOpen && <span className="nav-label">{label}</span>}
              {!sidebarOpen && <span className="nav-tooltip">{label}</span>}
            </NavLink>
          ))}
        </nav>
 
        <div className="sidebar-footer">
          <div className="vertex-badge">
            {sidebarOpen ? (
              <>
                <Activity size={12} />
                <span>Powered by Vertex AI</span>
              </>
            ) : (
              <Activity size={12} />
            )}
          </div>
        </div>
      </aside>
 
      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}