'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Background Orbs */}
      <div className="bg-glow-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* Top Navbar */}
      <nav className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#060913" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/>
              <path d="M3 5h4"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            MediScan<span className="cyan-gradient-text">AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link 
            id="nav-login-btn"
            href="/login" 
            style={{ 
              color: 'var(--text-secondary)', 
              textDecoration: 'none', 
              fontSize: '0.9rem', 
              fontWeight: 600,
              transition: 'var(--transition-smooth)'
            }}
            className="hover:text-white"
          >
            Login
          </Link>
          <Link 
            id="nav-get-started-btn"
            href="/patient" 
            className="btn-primary" 
            style={{ 
              padding: '0.6rem 1.25rem', 
              fontSize: '0.85rem',
              border: '1px solid rgba(139, 92, 246, 0.4)'
            }}
          >
            GET STARTED
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="app-container" style={{ padding: '4rem 2rem', gap: '6rem' }}>
        
        {/* Hero Section */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          {/* Clinical Integration Badge */}
          <div className="badge-pill-clinical">
            <span style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--secondary)',
              borderRadius: '50%',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--secondary)'
            }}></span>
            CLINICAL INTEGRATION SUITE
          </div>

          {/* Heading */}
          <h1 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.15, maxWidth: '900px' }}>
            AI-powered <span className="purple-gradient-text" style={{ fontStyle: 'italic', fontWeight: 700 }}>Smart</span><br />
            Medical Diagnosis
          </h1>

          {/* Subtitle */}
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontStyle: 'italic', fontWeight: 400, maxWidth: '600px' }}>
            "Faster insights can lead to faster treatment."
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
            <Link 
              id="hero-patient-portal-btn"
              href="/patient" 
              className="btn-primary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '0.9rem 2rem' }}
            >
              Patient Portal
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            
            <Link 
              id="hero-doctor-login-btn"
              href="/doctor" 
              className="btn-secondary btn-glow-doctor"
              style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
            >
              Doctor Login
            </Link>
          </div>

          {/* 3D Brain Scan Showcase Mockup */}
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <div className="device-mockup">
              <div className="device-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/brain_scan_ui.png" 
                  alt="Futuristic Holographic 3D Brain Scan Interface" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostic Capabilities Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <h2 className="header-underline" style={{ fontSize: '2rem', fontWeight: 800 }}>
            Diagnostic Capabilities
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Capability Card 1 */}
            <div className="glass-card neon-hover-teal" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(13, 242, 201, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(13, 242, 201, 0.2)'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                  <path d="M10 9H8"/>
                  <path d="M16 13H8"/>
                  <path d="M16 17H8"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Medical Report Analysis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                AI-driven parsing of lab reports and clinical data. Extract critical vitals and trends from unstructured documents instantly.
              </p>
            </div>

            {/* Capability Card 2 */}
            <div className="glass-card neon-hover-teal" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(13, 242, 201, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(13, 242, 201, 0.2)'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Symptom Assessment Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Real-time analysis of patient symptoms for triage. Prioritize urgent cases with ML-based precision based on historical clinical datasets.
              </p>
            </div>

            {/* Capability Card 3 */}
            <div className="glass-card neon-hover-teal" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(13, 242, 201, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(13, 242, 201, 0.2)'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Multilingual Support</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Accessible healthcare diagnostics in multiple languages. Breaking language barriers to provide equitable diagnostic insights globally.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Compliance Section */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Rigorous Security & Compliance
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Our platform operates on a zero-trust architecture, ensuring patient data remains encrypted at rest and in transit. Fully HIPAA and GDPR compliant.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                End-to-End Encryption (AES-256)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                SOC2 Type II Certified Processing
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                Real-Time Anomaly Detection Systems
              </li>
            </ul>
          </div>

          {/* Right Column (Interactive System Integrity mockup) */}
          <div>
            <div className="system-integrity-card" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(139, 92, 246, 0.08)' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  SYSTEM INTEGRITY
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                  100% Secure
                </span>
              </div>

              {/* Card Lines */}
              <div className="system-lines">
                <div className="system-line"></div>
                <div className="system-line"></div>
                <div className="system-line"></div>
              </div>

              {/* Bar Chart */}
              <div className="system-chart">
                <div className="chart-bar"></div>
                <div className="chart-bar"></div>
                <div className="chart-bar"></div>
                <div className="chart-bar"></div>
                <div className="chart-bar"></div>
              </div>

              {/* Corner Badge */}
              <div style={{ position: 'absolute', bottom: '-12px', right: '16px' }}>
                <span className="badge-pill-clinics">
                  TRUSTED BY 100+ CLINICS
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 2rem 2rem 2rem',
        backgroundColor: 'rgba(4, 6, 12, 0.95)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              MediScan<span className="cyan-gradient-text">AI</span>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {['PLATFORM', 'SECURITY', 'CLINICAL ETHICS', 'CONTACT'].map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  transition: 'var(--transition-smooth)'
                }}
                className="hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
            MediScanAI Diagnostics 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
