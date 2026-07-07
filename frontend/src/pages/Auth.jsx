import React, { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/api';

export default function Auth({ role: initialRole = 'university', onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: initialRole });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        const data = await registerUser(formData.name, formData.email, formData.password, formData.role);
        onAuthSuccess(data.token, data.user);
      } else {
        const data = await loginUser(formData.email, formData.password);
        onAuthSuccess(data.token, data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card" style={{ maxWidth: '420px', margin: '4rem auto', padding: '2rem' }}>
      {/* Role Selection Tabs */}
      <div className="mode-switches-box" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          className={`mode-switch-btn ${selectedRole === 'university' ? 'active' : ''}`}
          onClick={() => setSelectedRole('university')}
          style={{ flex: 1, backgroundColor: selectedRole === 'university' ? '#10b981' : 'transparent', borderColor: '#10b981', color: selectedRole === 'university' ? '#fff' : '#10b981' }}
        >
          University
        </button>
        <button
          type="button"
          className={`mode-switch-btn ${selectedRole === 'recruiter' ? 'active' : ''}`}
          onClick={() => setSelectedRole('recruiter')}
          style={{ flex: 1, backgroundColor: selectedRole === 'recruiter' ? '#6366f1' : 'transparent', borderColor: '#6366f1', color: selectedRole === 'recruiter' ? '#fff' : '#6366f1' }}
        >
          Recruiter
        </button>
      </div>

      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: '700' }}>
        {isRegister ? `Register as ${selectedRole.toUpperCase()}` : `Login as ${selectedRole.toUpperCase()}`}
      </h3>
      
      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1.25rem', background: '#fef2f2', color: 'var(--red)', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        {isRegister && (
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
          </div>
        )}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
        </div>
        
        <button type="submit" className="btn-save-verification" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Log In')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
        <button className="btn-clear-form" style={{ border: 'none', margin: '0 auto', display: 'inline' }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}

