'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Authentication simulator: redirecting to Patient Portal.');
    window.location.href = '/patient';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Background Orbs */}
      <div className="bg-glow-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', marginBottom: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#060913" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>MediScanAI</span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Access the Clinical Intelligence Suite</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CLINICAL EMAIL</label>
            <input 
              type="email" 
              placeholder="practitioner@mediscan.ai" 
              required
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SECURE ACCESS KEY</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              required
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '0.8rem' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>Protected by end-to-end clinical grade encryption.</p>
        </div>
      </div>
    </div>
  );
}
