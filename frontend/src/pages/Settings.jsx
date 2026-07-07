import React, { useState, useEffect } from 'react';
import { Settings, Shield, Cpu, User, Save, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [profile, setProfile] = useState({
    name: 'University Admin',
    email: 'admin@university.edu',
    institution: 'Northern Tech University'
  });

  const [blockchain, setBlockchain] = useState({
    nodeUrl: 'http://localhost:8545',
    contractAddress: '0x2563eb8b5cf6ac82f6e984f882a129d33bfd9220',
    gasLimit: 3000000,
    network: 'simulated-ganache'
  });

  const [ocr, setOcr] = useState({
    fuzzyThreshold: 70,
    minConfidence: 80,
    storeRawText: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load ocr settings from localStorage
    const savedOcr = localStorage.getItem('ocr_settings');
    if (savedOcr) {
      setOcr(JSON.parse(savedOcr));
    }
    const savedProfile = localStorage.getItem('profile_settings');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    const savedBlockchain = localStorage.getItem('blockchain_settings');
    if (savedBlockchain) {
      setBlockchain(JSON.parse(savedBlockchain));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      localStorage.setItem('ocr_settings', JSON.stringify(ocr));
      localStorage.setItem('profile_settings', JSON.stringify(profile));
      localStorage.setItem('blockchain_settings', JSON.stringify(blockchain));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="registry-view fade-in">
      <div className="registry-header" style={{ marginBottom: '1.5rem' }}>
        <div className="registry-title">
          <h2>Network &amp; Engine Settings</h2>
          <p>Configure credentials registry parameters, blockchain smart contracts, and OCR matching thresholds</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Tabs */}
        <div className="dashboard-card" style={{ padding: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('general')}
              className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%', color: activeTab === 'general' ? '#ffffff' : 'var(--text-main)' }}
            >
              <User size={16} />
              <span>General Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              className={`sidebar-item ${activeTab === 'blockchain' ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%', color: activeTab === 'blockchain' ? '#ffffff' : 'var(--text-main)' }}
            >
              <Shield size={16} />
              <span>Blockchain Node</span>
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`sidebar-item ${activeTab === 'ocr' ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%', color: activeTab === 'ocr' ? '#ffffff' : 'var(--text-main)' }}
            >
              <Cpu size={16} />
              <span>OCR Engine</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Panel Form */}
        <form onSubmit={handleSave} className="dashboard-card" style={{ padding: '2rem' }}>
          {saveSuccess && (
            <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #b9f6ca', borderRadius: '6px', color: 'var(--green)', fontSize: '0.85rem', fontWeight: '600' }}>
              ✓ Settings saved successfully and applied to registry engine!
            </div>
          )}

          {activeTab === 'general' && (
            <div className="dashboard-form">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                General Profile Settings
              </h3>
              <div className="form-group">
                <label>Admin User Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Admin Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>University / Institution</label>
                <input 
                  type="text" 
                  value={profile.institution}
                  onChange={(e) => setProfile({...profile, institution: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'blockchain' && (
            <div className="dashboard-form">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Blockchain Network Config
              </h3>
              <div className="form-group">
                <label>Hyperledger / Ethereum JSON-RPC Node Provider URL</label>
                <input 
                  type="text" 
                  value={blockchain.nodeUrl}
                  onChange={(e) => setBlockchain({...blockchain, nodeUrl: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Smart Contract Registry Address</label>
                <input 
                  type="text" 
                  value={blockchain.contractAddress}
                  onChange={(e) => setBlockchain({...blockchain, contractAddress: e.target.value})}
                  style={{ fontFamily: 'monospace' }}
                  required
                />
              </div>
              <div className="form-grid-row">
                <div className="form-group">
                  <label>Gas Limit Threshold</label>
                  <input 
                    type="number" 
                    value={blockchain.gasLimit}
                    onChange={(e) => setBlockchain({...blockchain, gasLimit: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Smart Contract Network</label>
                  <select 
                    value={blockchain.network}
                    onChange={(e) => setBlockchain({...blockchain, network: e.target.value})}
                  >
                    <option value="simulated-ganache">Ganache (Local RPC Simulated)</option>
                    <option value="sepolia">Ethereum Sepolia Testnet</option>
                    <option value="goerli">Ethereum Goerli Testnet</option>
                    <option value="mainnet">Ethereum Mainnet Node</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ocr' && (
            <div className="dashboard-form">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                OCR Engine &amp; Matching Rules
              </h3>
              
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: '600' }}>Fuzzy String Match Threshold (%)</label>
                  <strong style={{ color: 'var(--accent)' }}>{ocr.fuzzyThreshold}%</strong>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={ocr.fuzzyThreshold}
                  onChange={(e) => setOcr({...ocr, fuzzyThreshold: parseInt(e.target.value)})}
                  style={{ height: '6px', outline: 'none' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Adjusts how lenient the candidate name comparison is. Higher values require closer string matches.
                </span>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: '600' }}>Minimum OCR Confidence Level (%)</label>
                  <strong style={{ color: 'var(--accent)' }}>{ocr.minConfidence}%</strong>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={ocr.minConfidence}
                  onChange={(e) => setOcr({...ocr, minConfidence: parseInt(e.target.value)})}
                  style={{ height: '6px', outline: 'none' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Rejects scans that fall below this minimum character detection accuracy confidence level.
                </span>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input 
                  type="checkbox" 
                  checked={ocr.storeRawText}
                  onChange={(e) => setOcr({...ocr, storeRawText: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  id="storeRawTextCheck"
                />
                <label htmlFor="storeRawTextCheck" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                  Store full raw extracted text metadata alongside hash record
                </label>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <button 
              type="submit" 
              className="btn-save-verification" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="loader" style={{ animation: 'spin 1s linear infinite' }} />
                  Saving config...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
