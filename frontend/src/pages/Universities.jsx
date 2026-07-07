import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Search, CheckCircle, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

export default function Universities() {
  const [univs, setUnivs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUniv, setNewUniv] = useState({
    name: '',
    nodeAddress: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    location: '',
    status: 'Authorized',
    certsCount: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('registered_universities');
    if (saved) {
      setUnivs(JSON.parse(saved));
    } else {
      const defaultUnivs = [
        {
          name: 'Northern Tech University',
          nodeAddress: '0x3f5c76dae984f882a129d33bfd92209d846ea928',
          location: 'San Francisco, CA',
          status: 'Authorized',
          certsCount: 84
        },
        {
          name: 'IIT Bombay',
          nodeAddress: '0x882a129d33bfd92209d846ea9283f5c76dae984f',
          location: 'Mumbai, India',
          status: 'Authorized',
          certsCount: 142
        },
        {
          name: 'IIT Delhi',
          nodeAddress: '0x9283f5c76dae984f882a129d33bfd92209d846ea',
          location: 'New Delhi, India',
          status: 'Authorized',
          certsCount: 96
        },
        {
          name: 'BITS Pilani',
          nodeAddress: '0xbfd92209d846ea9283f5c76dae984f882a129d33',
          location: 'Pilani, Rajasthan',
          status: 'Authorized',
          certsCount: 57
        },
        {
          name: 'Delhi University',
          nodeAddress: '0xd846ea9283f5c76dae984f882a129d33bfd92209',
          location: 'New Delhi, India',
          status: 'Authorized',
          certsCount: 211
        },
        {
          name: 'NIT Kurukshetra',
          nodeAddress: '0xa129d33bfd92209d846ea9283f5c76dae984f882',
          location: 'Kurukshetra, Haryana',
          status: 'Authorized',
          certsCount: 73
        },
        {
          name: 'Anna University',
          nodeAddress: '0xe984f882a129d33bfd92209d846ea9283f5c76da',
          location: 'Chennai, Tamil Nadu',
          status: 'Authorized',
          certsCount: 168
        },
        {
          name: 'VIT University',
          nodeAddress: '0xf76dae984f882a129d33bfd92209d846ea9283f5',
          location: 'Vellore, Tamil Nadu',
          status: 'Authorized',
          certsCount: 134
        },
        {
          name: 'SRM University',
          nodeAddress: '0x33bfd92209d846ea9283f5c76dae984f882a129d',
          location: 'Kattankulathur, Tamil Nadu',
          status: 'Authorized',
          certsCount: 89
        }
      ];
      localStorage.setItem('registered_universities', JSON.stringify(defaultUnivs));
      setUnivs(defaultUnivs);
    }
  }, []);

  const handleAddUniversity = (e) => {
    e.preventDefault();
    if (!newUniv.name || !newUniv.location) {
      alert('Please fill all fields');
      return;
    }

    const updated = [newUniv, ...univs];
    localStorage.setItem('registered_universities', JSON.stringify(updated));
    setUnivs(updated);
    
    // Reset form
    setNewUniv({
      name: '',
      nodeAddress: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      location: '',
      status: 'Authorized',
      certsCount: 0
    });
    setShowAddModal(false);
  };

  const filtered = univs.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="registry-view fade-in">
      <div className="registry-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="registry-title">
          <h2>Authorized University Nodes</h2>
          <p>Manage and audit decentralized institutions authorized to mint academic NFT credentials</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-save-verification" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#10b981' }}
        >
          <Plus size={16} /> Authorize University Node
        </button>
      </div>

      {/* Add Modal overlay */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="dashboard-card" style={{ width: '450px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Authorize University Node</h3>
            
            <form onSubmit={handleAddUniversity} className="dashboard-form">
              <div className="form-group">
                <label>University / Institution Name</label>
                <input 
                  type="text" 
                  value={newUniv.name} 
                  onChange={(e) => setNewUniv({...newUniv, name: e.target.value})}
                  placeholder="e.g. Stanford University"
                  required
                />
              </div>

              <div className="form-group">
                <label>Geographic Location</label>
                <input 
                  type="text" 
                  value={newUniv.location} 
                  onChange={(e) => setNewUniv({...newUniv, location: e.target.value})}
                  placeholder="e.g. Stanford, CA"
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Blockchain Node Address</label>
                <input 
                  type="text" 
                  value={newUniv.nodeAddress}
                  disabled
                  style={{ backgroundColor: '#f8fafc', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn-clear-form" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-save-verification" 
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: '#10b981' }}
                >
                  Authorize Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search universities by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Universities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((univ, idx) => (
          <div className="dashboard-card" key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '0.6rem', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '8px' }}>
                <Landmark size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{univ.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{univ.location}</span>
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Ethereum Node IPFS Address</div>
              <div style={{ wordBreak: 'break-all', fontWeight: '600', color: 'var(--text-main)' }}>{univ.nodeAddress}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                <FileSpreadsheet size={14} /> Registered Credentials:
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{univ.certsCount} certs</strong>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--green)', fontSize: '0.82rem', fontWeight: '600' }}>
                <CheckCircle size={14} /> Network {univ.status}
              </span>
              <button 
                className="btn-clear-form" 
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => alert(`Opening node details for ${univ.name}...`)}
              >
                Inspect Node
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No universities found matching your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
