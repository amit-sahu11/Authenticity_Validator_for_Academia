import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import Dashboard from './pages/Dashboard';
import Verifications from './pages/Verifications';
import Candidates from './pages/Candidates';
import Reports from './pages/Reports';
import Universities from './pages/Universities';
import ActivityLog from './pages/ActivityLog';
import SettingsPage from './pages/Settings';
import Auth from './pages/Auth';
import { initMockLedger } from './utils/helpers';
import './App.css';

function MainAppLayout() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const { mode, token, login } = useAuth();

  useEffect(() => {
    initMockLedger();
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Area */}
      <main className="main-content">
        {/* Top Header */}
        <TopHeader activeMenu={activeMenu} />

        {/* Views */}
        {activeMenu === 'Dashboard' && (
          mode === 'backend' && !token ? (
            <Auth onAuthSuccess={login} />
          ) : (
            <Dashboard mode={mode} token={token} />
          )
        )}

        {activeMenu === 'Verifications' && (
          <Verifications />
        )}

        {activeMenu === 'Candidates' && (
          <Candidates />
        )}

        {activeMenu === 'Reports' && (
          <Reports />
        )}

        {activeMenu === 'Universities' && (
          <Universities />
        )}

        {activeMenu === 'Activity Log' && (
          <ActivityLog />
        )}

        {activeMenu === 'Settings' && (
          <SettingsPage />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppLayout />
    </AuthProvider>
  );
}

