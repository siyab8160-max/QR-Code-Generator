import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { QrCode } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, mockSignIn } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        mockSignIn(email);
      }
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
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
          <h2 className="text-center mb-6">Welcome back</h2>
          
          {error && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
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
            
            <div className="form-group mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0" htmlFor="password">Password</label>
                <Link to="/reset-password" className="text-sm text-muted">Forgot password?</Link>
              </div>
              <input 
                id="password"
                type="password" 
                className="form-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 mb-6 flex items-center" style={{ gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
            <span className="text-sm text-muted">OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
          </div>

          <button 
            type="button" 
            className="btn btn-outline w-full" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-fg)', fontWeight: 500 }}>Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
