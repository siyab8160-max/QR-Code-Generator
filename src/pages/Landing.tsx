import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-logo">
          <QrCode size={24} />
          <span>QRLnk</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn btn-ghost">Log In</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </header>
      
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">Turn any link into a QR code.</h1>
          <p className="hero-subtitle">
            Fast, secure, and customizable. Create production-ready QR codes for your URLs in seconds, completely free.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              Create your first QR code
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
