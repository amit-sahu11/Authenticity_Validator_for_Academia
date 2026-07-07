import React, { useState, useEffect } from 'react';
import { History, CheckCircle, ShieldAlert, Key, Search, Database, UserPlus } from 'lucide-react';
import { getCertificates } from '../utils/helpers';

export default function ActivityLog() {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Generate base static logs
    const baseLogs = [
      {
        id: '1',
        type: 'System',
        message: 'Decentralized Blockchain Smart Contract initialized.',
        user: 'system@authenticity.io',
        timestamp: '2026-06-12, 10:00:00 AM',
        status: 'success'
      },
      {
        id: '2',
        type: 'System',
        message: 'Authorized node added for Northern Tech University.',
        user: 'admin@authenticity.io',
        timestamp: '2026-06-12, 10:15:32 AM',
        status: 'success'
      },
      {
        id: '3',
        type: 'OCR Error',
        message: 'OCR mismatch prevented: entered candidate name "John Watson" but file detected "John Watson Sr".',
        user: 'registrar@ntu.edu',
        timestamp: '2026-06-15, 03:22:11 PM',
        status: 'error'
      },
      {
        id: '4',
        type: 'Verification',
        message: 'Recruiter verification check succeeded for student John Smith (Roll: IITB-CS-2021-098).',
        user: 'hiring@google.com',
        timestamp: '2026-06-16, 11:40:15 AM',
        status: 'success'
      },
      {
        id: '5',
        type: 'Registration',
        message: 'Certificate uploaded and matching hash stored in block #1084 (Rahul Sharma).',
        user: 'registrar@iitd.ac.in',
        timestamp: '2026-06-10, 09:12:45 AM',
        status: 'success'
      },
      {
        id: '6',
        type: 'Registration',
        message: 'New certificate registered for Neha Verma (Roll: DU-BCOM-2021-302) — B.Com, Delhi University.',
        user: 'registrar@du.ac.in',
        timestamp: '2026-06-17, 02:30:00 PM',
        status: 'success'
      },
      {
        id: '7',
        type: 'OCR Error',
        message: 'OCR mismatch: entered year "2023" but document extracted "2022" for Amit Joshi (NIT-KKR). Entry rejected.',
        user: 'registrar@nitkkr.ac.in',
        timestamp: '2026-06-18, 04:11:22 PM',
        status: 'error'
      },
      {
        id: '8',
        type: 'System',
        message: 'Authorized node added for Delhi University (0xd846ea9283f5...).',
        user: 'admin@authenticity.io',
        timestamp: '2026-06-13, 10:45:00 AM',
        status: 'success'
      },
      {
        id: '9',
        type: 'Verification',
        message: 'Recruiter credential lookup for Divya Menon (CUSAT-MSC-2022-774) returned valid blockchain match.',
        user: 'talent@infosys.com',
        timestamp: '2026-06-19, 09:22:10 AM',
        status: 'success'
      },
      {
        id: '10',
        type: 'Registration',
        message: 'MBBS degree certificate registered for Kavita Nair (KERALA-MBBS-2024-021). Medical credential sealed on chain.',
        user: 'registrar@keralamed.edu',
        timestamp: '2026-06-20, 01:15:50 PM',
        status: 'success'
      },
      {
        id: '11',
        type: 'System',
        message: 'Smart contract ABI updated. New verification event listeners deployed on block #1400.',
        user: 'devops@authenticity.io',
        timestamp: '2026-06-20, 06:00:00 AM',
        status: 'success'
      },
      {
        id: '12',
        type: 'OCR Error',
        message: 'Tamper detection: uploaded certificate image for Mohammed Farouk appears edited. Flagged for manual review.',
        user: 'registrar@amu.ac.in',
        timestamp: '2026-06-21, 08:34:17 AM',
        status: 'error'
      }
    ];

    // Load registered certificates from mock ledger
    const certs = getCertificates();
    const dynamicLogs = certs.map((cert, idx) => ({
      id: `dyn-log-${idx}`,
      type: 'Registration',
      message: `Certificate registered for ${cert.studentName} (Roll: ${cert.rollNumber}) in block #${cert.block}.`,
      user: 'admin@university.edu',
      timestamp: cert.timestamp || '2026-06-20, 11:00:00 AM',
      status: 'success'
    }));

    // Merge logs
    setLogs([...dynamicLogs, ...baseLogs]);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const getLogIcon = (type, status) => {
    if (status === 'error') return <ShieldAlert size={18} style={{ color: 'var(--red)' }} />;
    switch (type) {
      case 'Registration':
        return <UserPlus size={18} style={{ color: 'var(--green)' }} />;
      case 'Verification':
        return <CheckCircle size={18} style={{ color: 'var(--accent)' }} />;
      case 'System':
        return <Database size={18} style={{ color: '#8b5cf6' }} />;
      default:
        return <Key size={18} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div className="registry-view fade-in">
      <div className="registry-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="registry-title">
          <h2>Ledger Activity Audit Trails</h2>
          <p>Chronological records of verification queries, uploads, node updates, and validation states</p>
        </div>
        <div className="mode-switches-box">
          {['All', 'Registration', 'Verification', 'OCR Error', 'System'].map((type) => (
            <button
              key={type}
              className={`mode-switch-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search activity messages, users, or block hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredLogs.map((log) => (
            <div 
              key={log.id} 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'start', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                backgroundColor: log.status === 'error' ? '#fdf2f2' : '#f8fafc',
                borderLeft: log.status === 'error' ? '3px solid var(--red)' : '3px solid var(--border-color)'
              }}
            >
              <div style={{ 
                padding: '0.5rem', 
                backgroundColor: '#ffffff', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getLogIcon(log.type, log.status)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {log.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {log.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500', marginBottom: '0.2rem' }}>
                  {log.message}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Initiated by: <strong style={{ color: 'var(--text-main)' }}>{log.user}</strong>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No audit logs matched your current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
