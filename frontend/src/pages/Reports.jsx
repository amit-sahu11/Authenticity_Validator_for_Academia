import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, ShieldAlert, Award, Globe } from 'lucide-react';
import { getCertificates } from '../utils/helpers';

export default function Reports() {
  const [stats, setStats] = useState({
    totalCerts: 0,
    verifiedCount: 0,
    failedCount: 4, // Simulated static OCR mismatches
    successRate: 98.2,
    activeNodes: 12,
    latestActivity: []
  });

  useEffect(() => {
    const certs = getCertificates();
    const certsCount = certs.length;
    const dynamicTotal = certsCount + 284; // Add mock historical count
    const dynamicVerified = certsCount + 278; // Add mock historical verified

    setStats({
      totalCerts: dynamicTotal,
      verifiedCount: dynamicVerified,
      failedCount: 12,
      successRate: parseFloat(((dynamicVerified / (dynamicTotal + 12)) * 100).toFixed(1)),
      activeNodes: 21,
      latestActivity: certs.slice(0, 8)
    });
  }, []);

  return (
    <div className="registry-view fade-in">
      <div className="registry-header" style={{ marginBottom: '2rem' }}>
        <div className="registry-title">
          <h2>Platform Performance Reports</h2>
          <p>Real-time metrics, OCR validation statistics, and secure blockchain node activities</p>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#eff6ff', color: 'var(--accent)', padding: '0.75rem', borderRadius: '8px' }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Credentials</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.15rem' }}>{stats.totalCerts}</h3>
          </div>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#f0fdf4', color: 'var(--green)', padding: '0.75rem', borderRadius: '8px' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verification Success</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.15rem' }}>{stats.successRate}%</h3>
          </div>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#fdf2f2', color: 'var(--red)', padding: '0.75rem', borderRadius: '8px' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OCR Mismatches Prevented</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.15rem' }}>{stats.failedCount}</h3>
          </div>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#faf5ff', color: '#8b5cf6', padding: '0.75rem', borderRadius: '8px' }}>
            <Globe size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Blockchain Authorized Nodes</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.15rem' }}>{stats.activeNodes}</h3>
          </div>
        </div>
      </div>

      {/* Visual Charts (Pure CSS & Styling) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Verification Timeline Graph Mockup */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: '700', color: 'var(--text-main)' }}>Verification Activity (Past 7 Days)</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <TrendingUp size={14} /> +12.4% this week
            </span>
          </div>

          {[{d:'Mon',h:95,v:16},{d:'Tue',h:130,v:22},{d:'Wed',h:80,v:13},{d:'Thu',h:165,v:28},{d:'Fri',h:210,v:36},{d:'Sat',h:45,v:8},{d:'Sun',h:55,v:9}].map((bar,i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', height: `${bar.h}px`, background: i===4?'linear-gradient(180deg,#6366f1,#818cf8)':i===3?'#3b82f6':i===1?'#60a5fa':'#93c5fd', borderRadius: '6px 6px 0 0', position: 'relative', transition:'all 0.3s' }}>
                <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: '700', color:'var(--text-main)' }}>{bar.v}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bar.d}</span>
            </div>
          ))}
        </div>

        {/* Degree Breakdown Chart */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Registered Degrees Breakdown</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { label: 'B.Tech / M.Tech Engineering', pct: 52, color: 'var(--accent)' },
              { label: 'MBA / Business Administration', pct: 18, color: '#10b981' },
              { label: 'M.Sc / B.Sc Academic Science', pct: 12, color: '#f59e0b' },
              { label: 'MBBS / Medical Degrees', pct: 7, color: '#ef4444' },
              { label: 'LLB / Legal Degrees', pct: 5, color: '#8b5cf6' },
              { label: 'B.Com / Commerce', pct: 4, color: '#06b6d4' },
              { label: 'B.Arch / Design Degrees', pct: 2, color: '#ec4899' },
            ].map((row, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>{row.label}</span>
                  <strong style={{ color: row.color }}>{row.pct}%</strong>
                </div>
                <div style={{ width: '100%', height: '7px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct}%`, height: '100%', backgroundColor: row.color, borderRadius: '4px', transition: 'width 0.8s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Latest Registry Operations */}
      <div className="registry-card">
        <div className="registry-header" style={{ padding: '1.25rem 1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Network Operations</h3>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Operation Type</th>
                <th>Candidate Details</th>
                <th>Validation Status</th>
                <th>Secure Txn Hash</th>
                <th>Block Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestActivity.map((act, index) => (
                <tr key={index}>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                      🎓 Certificate Registered
                    </span>
                  </td>
                  <td>
                    <div>
                      <strong>{act.studentName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {act.rollNumber} • {act.universityName}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge verified">Passed OCR</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {act.hash ? `${act.hash.slice(0, 16)}...` : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {act.timestamp}
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    🔍 Recruiter Query
                  </span>
                </td>
                <td>
                  <div>
                    <strong>Jane Doe</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      1NTU18CS123 • Northern Tech
                    </div>
                  </div>
                </td>
                <td>
                  <span className="status-badge verified">Ledger Match</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    dbf4dab474d1...
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Just now
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
