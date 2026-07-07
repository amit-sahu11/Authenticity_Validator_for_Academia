import React, { useState, useEffect } from 'react';
import { Search, UserCheck, ShieldCheck, Mail, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { getCertificates } from '../utils/helpers';

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [candidatesList, setCandidatesList] = useState([]);

  useEffect(() => {
    // Standard mock candidates
    const baseCandidates = [
      {
        id: '1',
        name: 'Jane Doe',
        email: 'jane.doe@ntu.edu',
        university: 'Northern Tech University',
        degree: 'Bachelor of Technology (B.Tech)',
        enrollmentNumber: '1NTU18CS123',
        status: 'Verified',
        certsCount: 1,
        dateAdded: '2026-06-18'
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john.smith@gmail.com',
        university: 'IIT Bombay',
        degree: 'Master of Technology (M.Tech)',
        enrollmentNumber: 'IITB-CS-2021-098',
        status: 'Verified',
        certsCount: 1,
        dateAdded: '2026-06-15'
      },
      {
        id: '3',
        name: 'Alice Johnson',
        email: 'alice.j@bits-pilani.ac.in',
        university: 'BITS Pilani',
        degree: 'Master of Business Admin (MBA)',
        enrollmentNumber: 'BP-MBA-2023-441',
        status: 'Pending',
        certsCount: 1,
        dateAdded: '2026-06-19'
      },
      {
        id: '4',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@iitd.ac.in',
        university: 'IIT Delhi',
        degree: 'Bachelor of Technology (B.Tech)',
        enrollmentNumber: 'IITD-2018-CS-022',
        status: 'Verified',
        certsCount: 2,
        dateAdded: '2026-06-10'
      },
      {
        id: '5',
        name: 'Neha Verma',
        email: 'neha.verma@du.ac.in',
        university: 'Delhi University',
        degree: 'Bachelor of Commerce (B.Com)',
        enrollmentNumber: 'DU-BCOM-2021-302',
        status: 'Verified',
        certsCount: 1,
        dateAdded: '2026-06-17'
      },
      {
        id: '6',
        name: 'Amit Joshi',
        email: 'amit.joshi@nitkkr.ac.in',
        university: 'NIT Kurukshetra',
        degree: 'Bachelor of Technology (B.Tech)',
        enrollmentNumber: 'NIT-KKR-EE-2022-089',
        status: 'Verified',
        certsCount: 1,
        dateAdded: '2026-06-18'
      },
      {
        id: '7',
        name: 'Sneha Iyer',
        email: 'sneha.iyer@annauniv.edu',
        university: 'Anna University',
        degree: 'Bachelor of Architecture (B.Arch)',
        enrollmentNumber: 'ANNA-BARCH-2020-056',
        status: 'Verified',
        certsCount: 1,
        dateAdded: '2026-06-19'
      },
      {
        id: '8',
        name: 'Divya Menon',
        email: 'divya.menon@cusat.ac.in',
        university: 'CUSAT Kerala',
        degree: 'Master of Science (M.Sc)',
        enrollmentNumber: 'CUSAT-MSC-2022-774',
        status: 'Verified',
        certsCount: 1,
        dateAdded: '2026-06-20'
      },
      {
        id: '9',
        name: 'Sandeep Rawat',
        email: 'sandeep.rawat@srmuniv.ac.in',
        university: 'SRM University',
        degree: 'Bachelor of Technology (B.Tech)',
        enrollmentNumber: 'SRM-BTECH-2023-419',
        status: 'Pending',
        certsCount: 1,
        dateAdded: '2026-06-21'
      }
    ];

    // Load registered certificates from ledger
    const certs = getCertificates();
    const dynamicCandidates = (certs || [])
      .filter(cert => cert && typeof cert.studentName === 'string' && cert.studentName.trim() !== '')
      .map((cert, index) => {
        const nameLower = cert.studentName.toLowerCase();
        const emailSafe = cert.studentEmail || `${nameLower.replace(/\s+/g, '')}@example.com`;
        return {
          id: `dyn-${index}-${cert.rollNumber || index}`,
          name: cert.studentName,
          email: emailSafe,
          university: cert.universityName || 'Unknown University',
          degree: cert.degreeType || 'Unknown Degree',
          enrollmentNumber: cert.rollNumber || 'N/A',
          status: cert.verificationStatus || 'Verified',
          certsCount: 1,
          dateAdded: cert.timestamp ? cert.timestamp.split(',')[0] : '2026-06-20'
        };
      });

    // Merge lists, preventing duplicate roll numbers
    const merged = [...dynamicCandidates];
    baseCandidates.forEach(bc => {
      if (!merged.some(mc => mc.enrollmentNumber === bc.enrollmentNumber)) {
        merged.push(bc);
      }
    });

    setCandidatesList(merged);
  }, []);

  const filtered = candidatesList.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cand.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.university.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || cand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="registry-view fade-in">
      <div className="registry-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="registry-title">
          <h2>Candidate Credential Directory</h2>
          <p>View all candidates with submitted or verified academic certificates</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="mode-switches-box">
            <button 
              className={`mode-switch-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              All
            </button>
            <button 
              className={`mode-switch-btn ${statusFilter === 'Verified' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Verified')}
            >
              Verified
            </button>
            <button 
              className={`mode-switch-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search candidates by name, roll number, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Grid of Candidates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(cand => (
          <div className="dashboard-card" key={cand.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: cand.status === 'Verified' ? '3px solid var(--green)' : '3px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>{cand.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  <Mail size={12} />
                  <span>{cand.email}</span>
                </div>
              </div>
              <span className={`status-badge ${cand.status.toLowerCase()}`}>
                {cand.status === 'Verified' ? <UserCheck size={12} style={{ marginRight: '0.25rem' }} /> : <Clock size={12} style={{ marginRight: '0.25rem' }} />}
                {cand.status}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BookOpen size={12} /> University:</span>
                <strong style={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{cand.university}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ShieldCheck size={12} /> Degree:</span>
                <strong style={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{cand.degree}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Roll Number:</span>
                <strong>{cand.enrollmentNumber}</strong>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered: {cand.dateAdded}</span>
              <button 
                className="btn-clear-form" 
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                onClick={() => alert(`Opening verification record for ${cand.name}...`)}
              >
                View Ledger Details <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No candidates found matching the query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
