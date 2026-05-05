import React, { useState, useEffect } from 'react';
import Mark7Launcher from './Mark7Launcher';
import './Mark7Login.css';

/**
 * Mark7Login - The Authentication Gate
 * Adds a "boot-up" and "identity check" sequence before showing the dashboard.
 */
const Mark7Login = () => {
  const [authState, setAuthState] = useState('locked'); // locked, scanning, granted, dashboard
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    if (authState !== 'locked') return;
    setAuthState('scanning');
  };

  useEffect(() => {
    if (authState === 'scanning') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setAuthState('granted'), 500);
            return 100;
          }
          return p + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
    
    if (authState === 'granted') {
      const timer = setTimeout(() => setAuthState('dashboard'), 1500);
      return () => clearTimeout(timer);
    }
  }, [authState]);

  if (authState === 'dashboard') {
    return (
      <div className="mark7-dashboard-reveal">
         <div className="dashboard-header">SYSTEM_STATUS: ONLINE // WELCOME, MASTER MISTY</div>
         <Mark7Launcher />
         {/* Other components can be added here */}
      </div>
    );
  }

  return (
    <div className={`mark7-login-overlay ${authState}`}>
      <div className="scan-hex-grid" />
      
      <div className="auth-central-hub" onClick={startScan}>
        <div className={`auth-circle-ring ${authState}`} />
        <div className="auth-core">
          {authState === 'locked' && <span className="auth-prompt">PRESS TO START SCAN</span>}
          {authState === 'scanning' && <span className="auth-percent">{progress}%</span>}
          {authState === 'granted' && <span className="auth-success">IDENTITY VERIFIED</span>}
        </div>
      </div>

      <div className="auth-status-panel">
        <div className="status-line">ENCRYPTION: 128-BIT HUD_PROTOCOL</div>
        <div className="status-line">AUTH_TYPE: BIOMETRIC_IDENT</div>
        <div className="status-line">STATUS: <span className="highlight">{authState.toUpperCase()}</span></div>
      </div>

      <div className="auth-scan-line" />
    </div>
  );
};

export default Mark7Login;
