import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopHeader({ activeMenu }) {
  const { mode, setMode, token, authUser, logout, simulatedRole, setSimulatedRole } = useAuth();

  const getProfileName = () => {
    if (mode === 'backend' && authUser) return authUser.name;
    return mode === 'backend' ? 'Official Verifier' : (simulatedRole === 'university' ? 'Admin' : 'Official Recruiter');
  };

  const getProfileRole = () => {
    if (mode === 'backend' && authUser) return authUser.role.toUpperCase();
    return simulatedRole.toUpperCase() + ' PORTAL';
  };

  return (
    <header className="top-header">
      <h2 className="page-title">{activeMenu}</h2>
      
      <div className="header-right">
        {/* Mode Toggle Switches */}
        <div className="mode-switches-box">
          <button 
            className={`mode-switch-btn ${mode === 'simulated' ? 'active' : ''}`}
            onClick={() => setMode('simulated')}
          >
            Simulated Ledger
          </button>
          <button 
            className={`mode-switch-btn ${mode === 'backend' ? 'active' : ''}`}
            onClick={() => setMode('backend')}
          >
            DB &amp; OCR Mode
          </button>
        </div>

        {/* Simulated Role Switches */}
        {mode === 'simulated' && (
          <div className="mode-switches-box">
            <button 
              className={`mode-switch-btn simulated-role-btn ${simulatedRole === 'university' ? 'active-univ' : ''}`}
              onClick={() => setSimulatedRole('university')}
              style={{
                borderColor: '#10b981',
                color: simulatedRole === 'university' ? '#ffffff' : '#10b981',
                backgroundColor: simulatedRole === 'university' ? '#10b981' : 'transparent',
              }}
            >
              University View
            </button>
            <button 
              className={`mode-switch-btn simulated-role-btn ${simulatedRole === 'recruiter' ? 'active-rec' : ''}`}
              onClick={() => setSimulatedRole('recruiter')}
              style={{
                borderColor: '#6366f1',
                color: simulatedRole === 'recruiter' ? '#ffffff' : '#6366f1',
                backgroundColor: simulatedRole === 'recruiter' ? '#6366f1' : 'transparent',
              }}
            >
              Recruiter View
            </button>
          </div>
        )}

        {/* Notifications */}
        <div className="notification-bell">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div 
            className="profile-avatar" 
            style={{ 
              backgroundColor: '#eff6ff', 
              color: '#2563eb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #cbd5e1',
              borderRadius: '50%'
            }}
          >
            <User size={18} />
          </div>
          <div className="profile-info">
            <span className="profile-name">
              {getProfileName()}
            </span>
            <span className="profile-role">
              {getProfileRole()}
            </span>
          </div>
          {mode === 'backend' && token && (
            <button 
              className="btn-clear" 
              style={{ padding: '0.4rem', border: 'none', marginLeft: '0.5rem' }} 
              onClick={logout} 
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

