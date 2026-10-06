import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { QrCode } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      if (auth) {
        await sendPasswordResetEmail(auth, email);
        setMessage('Check your inbox for further instructions');
      } else {
        setMessage('Mock mode: Check your inbox for further instructions');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--color-surface)' }}>
      <main className="main-content">
        <div className="mb-8 flex items-center justify-center gap-2">
          <QrCode size={32} />
          <span className="font-semibold text-lg">QRLnk</span>
        </div>
        
        <div className="form-container">
          <h2 className="text-center mb-6">Reset Password</h2>
          
          {error && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword}>
            <div className="form-group mb-6">
              <label className="form-label" htmlFor="email">Email address</label>
              <input 
                id="email"
                type="email" 
                className="form-input" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full mb-6" disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="text-sm" style={{ color: 'var(--color-fg)', fontWeight: 500 }}>
                Back to log in
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
