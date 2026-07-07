import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, FileCheck, Users, 
  BarChart3, Landmark, History, Settings 
} from 'lucide-react';

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Verifications', icon: <FileCheck size={18} /> },
    { name: 'Candidates', icon: <Users size={18} /> },
    { name: 'Reports', icon: <BarChart3 size={18} /> },
    { name: 'Universities', icon: <Landmark size={18} /> },
    { name: 'Activity Log', icon: <History size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ShieldCheck size={28} className="sidebar-logo-icon" />
        <span>Authenticity Validator</span>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${activeMenu === item.name ? 'active' : ''}`}
            onClick={() => setActiveMenu(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="sidebar-help-card">
        <h4>Need Help?</h4>
        <p>Our support team is here to help you.</p>
        <button className="btn-contact" onClick={() => alert('Support request submitted!')}>Contact Support</button>
      </div>
    </aside>
  );
}
