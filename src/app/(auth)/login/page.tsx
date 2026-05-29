'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  id: string;
}

function PasswordInput({ label, placeholder, value, onChange, id }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
      <label htmlFor={id} style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.03em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input 
          id={id}
          type={showPassword ? 'text' : 'password'} 
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={{
            background: '#111317',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            padding: '0.85rem 3rem 0.85rem 1rem',
            color: '#ffffff',
            fontSize: '0.95rem',
            outline: 'none',
            width: '100%',
            transition: 'var(--transition-smooth)'
          }}
          className="focus:border-[#8b5cf6]"
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="hover:text-white"
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
              <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
              <line x1="2" x2="22" y1="2" y2="22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 0 0 1 .696 10.75 10.75 0 0 1-19.876 0z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    
    alert(`Authentication success! Logging in as: ${loginEmail}`);
    window.location.href = '/patient';
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) return;
    
    if (signupPassword !== signupConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    alert(`Registration success! Welcome: ${signupName}. Please log in.`);
    // Autofill signup email and switch to login view
    setLoginEmail(signupEmail);
    setIsSignUp(false);
    
    // Clear signup state
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-4" style={{ backgroundColor: '#05070a' }}>
      
      {/* Background Orbs */}
      <div className="bg-glow-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* Main Login Flow Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem 0'
      }}>
        
        {/* Header Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.5 7.5 6 12.8 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-2.2-0.5-7.5-6-13z" fill="#05070a"/>
              <path d="M12 21c-2.5 0-4.5-2-4.5-4.5 0-1.5 0.3-4.5 3-7.5.3.8 1 2 1 3.5 0 .8-.7 1.5-1.5 1.5h3c-.8 0-1.5-.7-1.5-1.5 0-1.5.7-2.7 1-3.5 2.7 3 3 6 3 7.5 0 2.5-2 4.5-4.5 4.5z" fill="#8b5cf6"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            PulseLife <span style={{ color: '#8b5cf6' }}>AI</span>
          </span>
        </div>

        {/* View Switcher: Sign Up View vs Log In View */}
        {isSignUp ? (
          /* Sign Up Form */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Create your account
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Sign up to start accessing AI diagnostics and health reports
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Full Name input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="signup-name" style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.03em' }}>
                  Full Name
                </label>
                <input 
                  id="signup-name"
                  type="text" 
                  placeholder="Your Name" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  style={{
                    background: '#111317',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="focus:border-[#8b5cf6]"
                />
              </div>

              {/* Email input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="signup-email" style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.03em' }}>
                  Email Address
                </label>
                <input 
                  id="signup-email"
                  type="email" 
                  placeholder="Email Address" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  style={{
                    background: '#111317',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="focus:border-[#8b5cf6]"
                />
              </div>

              {/* Password */}
              <PasswordInput 
                id="signup-password"
                label="Password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={setSignupPassword}
              />

              {/* Confirm Password */}
              <PasswordInput 
                id="signup-confirm-password"
                label="Confirm Password"
                placeholder="••••••••"
                value={signupConfirmPassword}
                onChange={setSignupConfirmPassword}
              />

              {/* Submit button */}
              <button 
                type="submit" 
                className="btn-primary" 
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.9rem',
                  borderRadius: '10px',
                  background: '#8b5cf6',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                  marginTop: '0.5rem'
                }}
              >
                Sign up
              </button>
            </form>

            {/* Footer switcher */}
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button 
                onClick={() => setIsSignUp(false)}
                style={{ 
                  color: '#a78bfa', 
                  background: 'none', 
                  border: 'none', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  padding: 0
                }}
                className="hover:underline"
              >
                Log in
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Assess your health
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Login to Access Health Reports and Identify the Illness
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Email input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="login-email" style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.03em' }}>
                  Email Address
                </label>
                <input 
                  id="login-email"
                  type="text" 
                  placeholder="Email or Phone" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{
                    background: '#111317',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="focus:border-[#8b5cf6]"
                />
              </div>

              {/* Password input */}
              <div>
                <PasswordInput 
                  id="login-password"
                  label="Password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={setLoginPassword}
                />
                
                {/* Forgot password */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Link 
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('Reset password link has been simulated.'); }}
                    style={{
                      fontSize: '0.75rem',
                      color: '#a78bfa',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                    className="hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                className="btn-primary" 
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.9rem',
                  borderRadius: '10px',
                  background: '#8b5cf6',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}
              >
                Log in
              </button>
            </form>

            {/* OR Separator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              margin: '0.5rem 0'
            }}>
              <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}></div>
              <span>OR LOGIN WITH</span>
              <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}></div>
            </div>

            {/* Social Authentication */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                onClick={() => { alert('Google sign in simulated.'); window.location.href = '/patient'; }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  background: '#111317',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                className="hover:bg-[rgba(255,255,255,0.03)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              
              <button 
                onClick={() => { alert('Apple sign in simulated.'); window.location.href = '/patient'; }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  background: '#111317',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                className="hover:bg-[rgba(255,255,255,0.03)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98 1.12.09 2.27-.56 2.98-1.42Z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Footer switcher */}
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button 
                onClick={() => setIsSignUp(true)}
                style={{ 
                  color: '#a78bfa', 
                  background: 'none', 
                  border: 'none', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  padding: 0
                }}
                className="hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        )}

        {/* AI Diagnostics Banner Card */}
        <div style={{
          background: 'rgba(17, 19, 23, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
            AI Diagnostics
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, zIndex: 1, maxWidth: '80%' }}>
            Our AI analyzes over 1,500 clinical symptoms to provide accurate health insights and personalized care recommendations.
          </p>

          {/* SVG brain gear logo absolute positioned in the bottom right corner */}
          <div style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            color: 'rgba(139, 92, 246, 0.12)',
            zIndex: 0
          }}>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" fill="currentColor" fillOpacity="0.1"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" fill="currentColor" fillOpacity="0.1"/>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2M12 20v2M4 12h2M18 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 16.24l1.42-1.42M16.24 6.34l1.42-1.42"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
