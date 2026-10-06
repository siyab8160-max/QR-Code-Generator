import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { QrCode } from 'lucide-react';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, mockSignIn } = useAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    
    try {
      if (auth) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        mockSignIn(email);
      }
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
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
          <h2 className="text-center mb-6">Create an account</h2>
          
          {error && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup}>
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
              <label className="form-label" htmlFor="password">Password</label>
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
              {loading ? 'Creating account...' : 'Sign Up'}
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
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            Sign up with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account? <Link to="/login" style={{ color: 'var(--color-fg)', fontWeight: 500 }}>Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
