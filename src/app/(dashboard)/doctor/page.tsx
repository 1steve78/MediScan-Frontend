'use client';

import React from 'react';
import Link from 'next/link';

export default function DoctorDashboard() {
  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="bg-glow-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* Premium Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#060913" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/>
              <path d="M3 5h4"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              MediScan<span className="cyan-gradient-text">-Ai</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>CLINICAL INTELLIGENCE SUITE</p>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="status-badge success" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
            SYSTEM OPERATIONAL
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>v4.2-Pro</span>
        </div>
      </header>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        gap: '1.5rem'
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '24px',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--secondary)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A10 10 0 1 0 19.2 19.2"></path>
            <path d="M8.7 8.7A6 6 0 1 0 17.3 17.3"></path>
            <path d="M12.6 12.6A2 2 0 1 0 15.4 15.4"></path>
          </svg>
        </div>
        <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Clinical Portal</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Welcome, Practitioner. The secure clinical interface is initializing. You can run patient diagnostics through the patient workspace in this prototype environment.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/patient" className="btn-primary">
            Go to Patient Workspace
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
