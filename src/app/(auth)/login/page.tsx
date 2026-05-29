'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/ui/Logo';
import { toast } from 'sonner';

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
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-zinc-350 text-xs font-semibold tracking-wide">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="input-field"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors flex items-center justify-center"
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
              <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
              <line x1="2" x2="22" y1="2" y2="22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'patient' | 'doctor'>('patient');

  // Rotating Triage Twister state
  const [activeTwisterIdx, setActiveTwisterIdx] = useState(0);
  const tongueTwisters = [
    { title: "Scan Diagnostics", text: "Six slick silent scans swiftly segment suspect cerebral anomalies, while critical triage checks clinically clean chest charts!" },
    { title: "Vitals Validation", text: "Vigilant vitals validation vitally verifies volatile venous vectors, processing pathology parameters with prompt precision!" },
    { title: "Physician Portal", text: "Dashing doctors dynamically detailing diagnoses, detailing difficult disease data, archiving active ailments on automated triage trackers!" },
    { title: "HIPAA Shielding", text: "Seven sealed SEC-compliant sockets safely secure sensitive symptoms, shielding surgical sheets from suspicious snoopers!" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTwisterIdx((prev) => (prev + 1) % tongueTwisters.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsLoading(true);
    setAuthError(null);
    const toastId = toast.loading('Verifying clinical credentials...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        toast.error(`Login Failed: ${error.message}`, { id: toastId });
        return;
      }

      if (data.user) {
        const role = data.user.user_metadata?.role || 'patient';
        console.log(`[MediScan-Ai Auth] Supabase sign-in successful! User role: ${role}`);
        toast.success('Access Granted! Redirecting to workspace...', { id: toastId });
        setTimeout(() => {
          window.location.href = `/${role}`;
        }, 800);
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during login.';
      setAuthError(msg);
      setIsLoading(false);
      toast.error(`Login Error: ${msg}`, { id: toastId });
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) return;

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match!');
      toast.error('Registration Failed: Passwords do not match!');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    const toastId = toast.loading('Provisioning your clinical account...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            name: signupName,
            role: signupRole,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        toast.error(`Registration Failed: ${error.message}`, { id: toastId });
        return;
      }

      if (data.user) {
        console.log(`[MediScan-Ai Auth] Supabase sign-up successful for: ${signupName}`);
        if (data.session) {
          toast.success('Account provisioned! Access granted, redirecting...', { id: toastId });
          setTimeout(() => {
            window.location.href = `/${signupRole}`;
          }, 800);
        } else {
          toast.info('Account created! Please check your email for the confirmation link.', {
            id: toastId,
            duration: 8000,
          });
          setAuthError('Registration successful! Please confirm your email (if required by your Supabase provider), or try logging in now.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during registration.';
      setAuthError(msg);
      setIsLoading(false);
      toast.error(`Registration Error: ${msg}`, { id: toastId });
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/patient',
        },
      });
      if (error) setAuthError(error.message);
    } catch (err: any) {
      setAuthError(err.message || 'OAuth initiation failed.');
    }
  };

  return (
    <div className="login-page-container">

      <style dangerouslySetInnerHTML={{ __html: `
        .login-page-container {
          background-color: #04080f;
          height: 100vh;
          min-height: 100vh;
          max-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          font-family: var(--font-sans);
          box-sizing: border-box;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(0, 200, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 200, 255, 0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 1;
        }

        .bg-glow-container {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }

        .glow-orb-1 {
          position: absolute;
          top: -10%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 200, 255, 0.06) 0%, transparent 70%);
          filter: blur(80px);
        }

        .glow-orb-2 {
          position: absolute;
          bottom: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(155, 92, 255, 0.06) 0%, transparent 70%);
          filter: blur(80px);
        }

        .left-panel {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
        }

        .right-panel {
          display: none;
          width: 100%;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          position: relative;
          z-index: 10;
          border-left: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.01);
          box-sizing: border-box;
        }

        @media (min-width: 1024px) {
          .left-panel {
            width: 50%;
            padding-left: 7%;
            justify-content: flex-start;
          }
          .right-panel {
            display: flex;
            width: 50%;
          }
        }

        .glass-card {
          background: rgba(12, 20, 36, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          width: 100%;
          max-width: 410px;
          padding: 2.25rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          box-sizing: border-box;
        }

        .input-field {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          padding: 0 1.25rem;
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.9rem;
          border: 1px solid transparent;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #00e5ff;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.15);
        }

        .input-field::placeholder {
          color: #94a3b8;
          font-weight: 600;
        }

        .social-btn {
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-sizing: border-box;
          cursor: pointer;
        }

        .submit-btn {
          width: 100%;
          height: 46px;
          background: #00e5ff;
          color: #020617;
          font-weight: 800;
          font-size: 0.9rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
          transition: all 0.2s ease;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .submit-btn:hover {
          background: #00d4ec;
          box-shadow: 0 0 25px rgba(0, 229, 255, 0.45);
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .twister-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        @keyframes slideFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-fade {
          animation: slideFade 0.4s ease-out forwards;
        }
      `}} />

      {/* Grid background & Glowing orbs */}
      <div className="grid-bg"></div>
      <div className="bg-glow-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* ── Column 1: Left Form Panel ── */}
      <div className="left-panel">
        <div className="glass-card">

          {/* Welcome Row */}
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-1.5">
              <Logo size={16} className="text-[#00e5ff]" />
              <span className="text-xs text-zinc-300 font-semibold tracking-wide">
                Welcome to <span className="text-[#00e5ff] font-bold">MediScan AI</span>
              </span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-zinc-400 leading-none">
                {isSignUp ? 'Have account?' : 'No Account?'}
              </span>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }}
                className="text-[10px] text-[#00e5ff] font-extrabold hover:underline mt-0.5"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-white tracking-tight -mt-1">
            {isSignUp ? 'Sign up' : 'Sign in'}
          </h2>

          {/* Google OAuth */}
          <div className="flex items-center w-full">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="social-btn flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-xs px-4 w-full cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-extrabold tracking-widest my-0.5 w-full">
            <div className="h-px bg-white/[0.08] flex-1"></div>
            <span>OR</span>
            <div className="h-px bg-white/[0.08] flex-1"></div>
          </div>

          {/* Auth Error Alert */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3 text-xs text-red-400 leading-normal">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-red-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Error
              </div>
              <div>{authError}</div>
              {authError.toLowerCase().includes('credential') && (
                <div className="mt-1.5 pt-1.5 border-t border-red-500/15 text-[10px] text-zinc-400">
                  <strong className="text-[#00e5ff]">Developer Tip:</strong> Ensure this user is
                  registered in Supabase. Disable{' '}
                  <em>"Confirm email"</em> under{' '}
                  <strong>Authentication › Providers › Email</strong> if needed.
                </div>
              )}
            </div>
          )}

          {/* Form: Sign Up */}
          {isSignUp ? (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3.5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="signup-name" className="text-zinc-350 text-xs font-semibold tracking-wide">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-field"
                />
              </div>

              {/* Role Selector */}
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-zinc-350 text-xs font-semibold tracking-wide">Registering as</span>
                <div className="grid grid-cols-2 bg-white/[0.05] border border-white/[0.08] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSignupRole('patient')}
                    disabled={isLoading}
                    className={`py-2 text-xs font-bold rounded transition-all cursor-pointer ${
                      signupRole === 'patient'
                        ? 'bg-[#00e5ff] text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('doctor')}
                    disabled={isLoading}
                    className={`py-2 text-xs font-bold rounded transition-all cursor-pointer ${
                      signupRole === 'doctor'
                        ? 'bg-[#00e5ff] text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="signup-email" className="text-zinc-350 text-xs font-semibold tracking-wide">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="email@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-field"
                />
              </div>

              <PasswordInput
                id="signup-password"
                label="Enter Password"
                placeholder="Password"
                value={signupPassword}
                onChange={setSignupPassword}
              />
              <PasswordInput
                id="signup-confirm-password"
                label="Confirm Password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={setSignupConfirmPassword}
              />

              <button type="submit" disabled={isLoading} className="submit-btn mt-1">
                {isLoading ? 'Creating...' : 'Sign up'}
              </button>
            </form>
          ) : (
            /* Form: Sign In */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
              {/* Email */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="login-email" className="text-zinc-350 text-xs font-semibold tracking-wide">
                  Enter your username or email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Username or email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-field"
                />
              </div>

              {/* Password + Forgot */}
              <div className="flex flex-col w-full">
                <PasswordInput
                  id="login-password"
                  label="Enter your Password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                />
                <button
                  type="button"
                  onClick={() => alert('Password reset flow simulated.')}
                  className="text-[11px] text-[#00e5ff] hover:text-[#00ccf0] mt-2 font-bold self-end transition-colors cursor-pointer hover:underline"
                >
                  Forget Password
                </button>
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn mt-1">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Rotating Triage Twister Ticker */}
          <div className="bg-white/[0.015] border border-white/[0.05] rounded-xl p-3 flex flex-col gap-1 transition-all duration-300 mt-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                Triage Twister: {tongueTwisters[activeTwisterIdx].title}
              </span>
              <span className="text-[9px] font-bold text-zinc-500">
                {activeTwisterIdx + 1} / {tongueTwisters.length}
              </span>
            </div>
            <p className="text-xs text-zinc-300 italic leading-relaxed transition-all duration-300">
              "{tongueTwisters[activeTwisterIdx].text}"
            </p>
          </div>

        </div>
      </div>

      {/* ── Column 2: Right Features Panel (Desktop only) ── */}
      <div className="right-panel">
        <div className="max-w-[480px] flex flex-col gap-10">

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#00e5ff]">
              <Logo size={22} />
              <span className="text-xs font-bold uppercase tracking-widest">Platform Capabilities</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Clinical Diagnostic <br />
              <span className="text-[#00e5ff]">Intelligence Features</span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Read through our automated platform diagnostic features, formulated in tongue-twisting flows to test your focus.
            </p>
          </div>

          {/* Active Rotating Twister Card */}
          <div
            key={activeTwisterIdx}
            className="twister-card flex gap-5 items-start animate-slide-fade"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff] font-extrabold text-lg shrink-0 mt-1">
              0{activeTwisterIdx + 1}
            </div>
            <div className="space-y-2.5">
              <h4 className="text-lg font-bold text-white tracking-tight">
                {tongueTwisters[activeTwisterIdx].title}
              </h4>
              <p className="text-sm text-zinc-300 italic leading-relaxed font-medium">
                "{tongueTwisters[activeTwisterIdx].text}"
              </p>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center gap-2">
            {tongueTwisters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTwisterIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeTwisterIdx === idx
                    ? 'w-6 bg-[#00e5ff]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}