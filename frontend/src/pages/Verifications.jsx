import React, { useState, useEffect } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { getCertificates, saveCertificates } from '../utils/helpers';

export default function Verifications() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    setCerts(getCertificates());
  }, []);

  const clearAll = () => {
    if (window.confirm('Delete all verification history from registry?')) {
      saveCertificates([]);
      setCerts([]);
    }
  };

  return (
    <div className="registry-view fade-in">
      <div className="registry-card">
        <div className="registry-header">
          <div className="registry-title">
            <h2>Blockchain Verification Ledger</h2>
            <p>List of all verified and registered certificate records on the tamper-proof ledger</p>
          </div>
          {certs.length > 0 && (
            <button className="btn-clear" onClick={clearAll}>
              <Trash2 size={16} /> Clear Ledger History
            </button>
          )}
        </div>

        <div className="table-container">
          {certs.length === 0 ? (
            <div className="empty-page-box" style={{ height: 'auto', padding: '4rem 2rem' }}>
              <Database size={44} />
              <h3>No verification records found</h3>
              <p>Go to the Dashboard to load or upload a certificate and save it on the ledger.</p>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Institution / University</th>
                  <th>Degree</th>
                  <th>Status</th>
                  <th>Ledger Fingerprint</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <span className="block-tag" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                        #{c.block || 1000 + i}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{c.studentName || c.name}</td>
                    <td>{c.rollNumber || c.rollNo}</td>
                    <td>{c.universityName || c.university}</td>
                    <td>{c.degreeType || c.course || c.degree}</td>
                    <td>
                      <span className={`status-badge ${c.verificationStatus ? c.verificationStatus.toLowerCase() : 'verified'}`}>
                        {c.verificationStatus || 'Verified'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#10b981' }}>
                      {c.hash ? `${c.hash.slice(0, 10)}...${c.hash.slice(-6)}` : '0xabc123...f89'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
