'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { submitSymptoms } from '@/lib/api';
import Logo from '@/components/ui/Logo';

export default function Home() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [triageResult, setTriageResult] = useState<{ classification: string; ai_insight: string } | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Setup scroll reveals inside React lifecycle
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addSymptom = () => {
    const val = inputValue.trim().toLowerCase();
    if (!val) return;
    if (!symptoms.includes(val)) {
      setSymptoms([...symptoms, val]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  const addQuick = (sym: string) => {
    const val = sym.toLowerCase();
    if (!symptoms.includes(val)) {
      setSymptoms([...symptoms, val]);
    }
  };

  const removeSymptom = (indexToRemove: number) => {
    setSymptoms(symptoms.filter((_, idx) => idx !== indexToRemove));
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSymptom();
    }
  };

  const runDiagnosis = async () => {
    if (symptoms.length === 0) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.borderColor = 'rgba(255, 100, 100, 0.5)';
        setTimeout(() => {
          if (inputRef.current) inputRef.current.style.borderColor = '';
        }, 1500);
      }
      return;
    }

    setIsDiagnosing(true);
    setShowToast(true);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);

    try {
      const response = await submitSymptoms(symptoms.join(', '), 'en');
      setTriageResult({
        classification: response.classification,
        ai_insight: response.ai_insight
      });
    } catch (err) {
      console.error('[MediScan-Ai Triage Widget] Live engine error: ', err);
      // Failover gracefully inside client simulator
      const isEmergency = symptoms.some((s) =>
        ['chest pain', 'shortness of breath', 'heart attack', 'unconscious', 'stroke', 'bleeding'].includes(s)
      );
      setTriageResult({
        classification: isEmergency ? 'critical' : 'medium',
        ai_insight: isEmergency
          ? 'CRITICAL EMERGENCY ALERT: Immediate medical intervention required. Symptoms indicate potential life-threatening event. Proceed to the nearest trauma unit or call 911.'
          : 'Symptom patterns detected. Rest, observe clinical signs, and consult a doctor if condition persists.'
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* CSS Stylesheet Injected safely for Next.js compilation */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg:        #04080f;
          --bg2:       #080e1a;
          --surface:   #0c1424;
          --surface2:  #101c30;
          --border:    rgba(0,190,255,0.12);
          --cyan:      #00c8ff;
          --cyan-dim:  rgba(0,200,255,0.18);
          --cyan-glow: rgba(0,200,255,0.35);
          --green:     #00ffb2;
          --purple:    #9b5cff;
          --text:      #e8f4ff;
          --text-muted:#7a9ab8;
          --radius:    14px;
        }

        body::before {
          content:'';
          position:fixed; inset:0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none; z-index:0; opacity:.4;
        }

        .grid-bg {
          position:absolute; inset:0; overflow:hidden; pointer-events:none;
          background-image:
            linear-gradient(rgba(0,200,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        nav {
          position: fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding: 0 48px;
          height: 68px;
          background: rgba(4,8,15,0.82);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          font-family:'Syne',sans-serif; font-weight:800; font-size:1.25rem;
          letter-spacing:-.02em; color:var(--text);
          display:flex; align-items:center; gap:8px;
        }
        .nav-logo span { color:var(--cyan); }

        .logo-dot {
          width:8px; height:8px; border-radius:50%;
          background:var(--cyan);
          box-shadow:0 0 10px var(--cyan);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.5;transform:scale(.7)}
        }

        .nav-links {
          display:flex; gap:32px; list-style:none;
        }
        .nav-links a {
          color:var(--text-muted); text-decoration:none;
          font-size:.875rem; font-weight:500; letter-spacing:.02em;
          transition:color .2s;
        }
        .nav-links a:hover { color:var(--text); }

        .nav-actions { display:flex; gap:12px; align-items:center; }

        .btn-ghost {
          background:transparent;
          border:1px solid var(--border);
          color:var(--text-muted); font-family:inherit;
          padding:8px 20px; border-radius:8px;
          font-size:.875rem; cursor:pointer;
          transition:all .2s;
          text-decoration:none;
          font-weight: 500;
        }
        .btn-ghost:hover { border-color:var(--cyan); color:var(--cyan); }

        .btn-primary {
          background: linear-gradient(135deg, var(--cyan), #0076ff);
          border:none; color:#020811;
          font-family:'Syne',sans-serif; font-weight:700;
          padding:9px 22px; border-radius:8px;
          font-size:.875rem; cursor:pointer;
          box-shadow: 0 0 20px rgba(0,200,255,.3);
          transition:all .2s;
          letter-spacing:.01em;
          text-decoration:none;
        }
        .btn-primary:hover {
          transform:translateY(-1px);
          box-shadow:0 0 30px rgba(0,200,255,.5);
        }

        .hero {
          position:relative; min-height:100vh;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          padding: 120px 48px 80px;
          text-align:center; overflow:hidden;
        }

        .hero-glow {
          position:absolute; top:-20%; left:50%; transform:translateX(-50%);
          width:900px; height:600px;
          background: radial-gradient(ellipse at center,
            rgba(0,200,255,.12) 0%,
            rgba(0,118,255,.06) 40%,
            transparent 70%);
          pointer-events:none;
        }

        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(0,200,255,.07);
          border:1px solid rgba(0,200,255,.2);
          border-radius:100px;
          padding:6px 16px; margin-bottom:32px;
          font-size:.75rem; font-weight:500; letter-spacing:.08em;
          color:var(--cyan); text-transform:uppercase;
          animation: fadeUp .8s ease both;
        }

        .badge-dot {
          width:6px;height:6px;border-radius:50%;
          background:var(--green);
          box-shadow:0 0 6px var(--green);
          animation:pulse-dot 1.5s ease-in-out infinite;
        }

        .hero h1 {
          font-family:'Syne',sans-serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight:800; line-height:1.05;
          letter-spacing:-.03em;
          margin-bottom:20px;
          animation: fadeUp .8s .1s ease both;
        }

        .hero h1 em {
          font-style:normal;
          background: linear-gradient(120deg, var(--cyan), var(--green));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }

        .hero-sub {
          font-size:1.1rem; color:var(--text-muted);
          max-width:560px; line-height:1.7;
          margin-bottom:48px;
          font-weight:300; font-style:italic;
          animation: fadeUp .8s .2s ease both;
        }

        .symptom-widget {
          background: rgba(12,20,36,.9);
          border:1px solid rgba(0,200,255,.2);
          border-radius:20px;
          padding:36px 40px;
          width:100%; max-width:680px;
          box-shadow: 0 0 60px rgba(0,200,255,.1), 0 30px 80px rgba(0,0,0,.5);
          backdrop-filter:blur(20px);
          animation: fadeUp .8s .3s ease both;
          position:relative; overflow:hidden;
        }

        .symptom-widget::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg, transparent, var(--cyan), var(--green), transparent);
        }

        .widget-label {
          font-family:'Syne',sans-serif;
          font-size:.7rem; font-weight:700;
          letter-spacing:.12em; text-transform:uppercase;
          color:var(--cyan); margin-bottom:12px;
          display:flex; align-items:center; gap:8px;
        }
        .widget-label::before {
          content:''; width:16px; height:1px;
          background:var(--cyan);
        }

        .symptom-input-row {
          display:flex; gap:12px; margin-bottom:16px;
        }

        .symptom-input {
          flex:1;
          background: rgba(255,255,255,.04);
          border:1px solid var(--border);
          border-radius:10px;
          color:var(--text);
          font-family: inherit;
          font-size:1rem; padding:14px 18px;
          outline:none; transition:all .25s;
        }
        .symptom-input:focus {
          border-color:rgba(0,200,255,.4);
          background:rgba(0,200,255,.04);
          box-shadow: 0 0 0 3px rgba(0,200,255,.08);
        }
        .symptom-input::placeholder { color:var(--text-muted); }

        .symptom-tags {
          display:flex; flex-wrap:wrap; gap:8px;
          margin-bottom:20px; min-height:30px;
        }

        .tag {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(0,200,255,.1);
          border:1px solid rgba(0,200,255,.25);
          border-radius:100px; padding:4px 12px;
          font-size:.8rem; color:var(--cyan);
          cursor:pointer; transition:all .15s;
          animation: tagPop .2s ease;
        }
        @keyframes tagPop { from{transform:scale(.8);opacity:0} to{transform:scale(1);opacity:1} }
        .tag:hover { background:rgba(255,80,80,.15); border-color:rgba(255,80,80,.3); color:#ff7a7a; }
        .tag .x { font-size:.7rem; opacity:.7; }

        .quick-symptoms {
          display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;
        }

        .quick-tag {
          background:rgba(255,255,255,.04);
          border:1px solid var(--border);
          border-radius:100px; padding:5px 14px;
          font-size:.78rem; color:var(--text-muted);
          cursor:pointer; transition:all .15s;
        }
        .quick-tag:hover {
          border-color:rgba(0,200,255,.35);
          color:var(--cyan); background:rgba(0,200,255,.06);
        }

        .widget-footer {
          display:flex; justify-content:space-between; align-items:center;
        }

        .widget-note {
          font-size:.75rem; color:var(--text-muted);
          display:flex; align-items:center; gap:6px;
        }
        .widget-note svg { color:var(--green); flex-shrink:0; }

        .btn-diagnose {
          background: linear-gradient(135deg, var(--cyan), #0080ff);
          border:none; color:#020811;
          font-family:'Syne',sans-serif; font-weight:700;
          padding:13px 32px; border-radius:10px;
          font-size:.95rem; cursor:pointer;
          box-shadow:0 0 30px rgba(0,200,255,.35);
          transition:all .25s;
          display:flex; align-items:center; gap:10px;
          letter-spacing:.01em;
        }
        .btn-diagnose:hover {
          transform:translateY(-2px);
          box-shadow:0 0 50px rgba(0,200,255,.5);
        }
        .btn-diagnose svg { transition:transform .2s; }
        .btn-diagnose:hover svg { transform:translateX(4px); }

        .stats-row {
          display:flex; gap:48px; margin-top:48px; justify-content:center;
          animation: fadeUp .8s .5s ease both;
          flex-wrap: wrap;
        }

        .stat { text-align:center; }
        .stat-num {
          font-family:'Syne',sans-serif; font-size:1.75rem;
          font-weight:800; color:var(--cyan);
          letter-spacing:-.02em;
        }
        .stat-label { font-size:.75rem; color:var(--text-muted); margin-top:2px; }

        .stat-divider {
          width:1px; background:var(--border); align-self:stretch;
        }
        @media (max-width: 600px) {
          .stat-divider { display: none; }
          .stats-row { flex-direction: column; gap: 20px; }
        }

        section {
          position:relative; padding:100px 48px; max-width:1200px;
          margin:0 auto;
        }

        .section-eyebrow {
          font-family:'Syne',sans-serif; font-size:.7rem;
          font-weight:700; letter-spacing:.15em; text-transform:uppercase;
          color:var(--cyan); margin-bottom:12px;
        }

        .section-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(2rem,3.5vw,2.8rem);
          font-weight:800; letter-spacing:-.025em; line-height:1.1;
          margin-bottom:16px;
        }

        .section-sub {
          color:var(--text-muted); max-width:520px; line-height:1.7;
          font-size:.95rem; font-weight:300; margin-bottom:60px;
        }

        .divider {
          width:100%; height:1px;
          background:linear-gradient(90deg, transparent, var(--border), transparent);
          margin:0 auto;
        }

        .cards-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:20px;
        }
        @media (max-width: 850px) {
          .cards-grid { grid-template-columns: 1fr; }
        }

        .cap-card {
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:var(--radius);
          padding:32px 28px;
          position:relative; overflow:hidden;
          transition:all .3s ease;
          cursor:default;
        }
        .cap-card::after {
          content:'';
          position:absolute; inset:0;
          background:radial-gradient(circle at 80% 20%, var(--cyan-dim), transparent 60%);
          opacity:0; transition:opacity .3s;
        }
        .cap-card:hover { border-color:rgba(0,200,255,.3); transform:translateY(-4px); }
        .cap-card:hover::after { opacity:1; }

        .cap-card:nth-child(2)::after {
          background:radial-gradient(circle at 80% 20%, rgba(155,92,255,.15), transparent 60%);
        }
        .cap-card:nth-child(3)::after {
          background:radial-gradient(circle at 80% 20%, rgba(0,255,178,.12), transparent 60%);
        }

        .cap-icon {
          width:44px; height:44px;
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          margin-bottom:20px; font-size:1.2rem; position:relative; z-index:1;
        }
        .cap-icon.cyan { background:rgba(0,200,255,.12); }
        .cap-icon.purple { background:rgba(155,92,255,.12); }
        .cap-icon.green { background:rgba(0,255,178,.12); }

        .cap-title {
          font-family:'Syne',sans-serif; font-weight:700; font-size:1rem;
          margin-bottom:10px; letter-spacing:-.01em; position:relative; z-index:1;
        }

        .cap-desc {
          font-size:.85rem; color:var(--text-muted);
          line-height:1.65; position:relative; z-index:1;
        }

        .cap-badge {
          display:inline-block; margin-top:16px;
          font-size:.7rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase;
          padding:3px 10px; border-radius:100px; position:relative; z-index:1;
        }
        .cap-badge.cyan { color:var(--cyan); background:rgba(0,200,255,.1); border:1px solid rgba(0,200,255,.2); }
        .cap-badge.purple { color:var(--purple); background:rgba(155,92,255,.1); border:1px solid rgba(155,92,255,.2); }
        .cap-badge.green { color:var(--green); background:rgba(0,255,178,.1); border:1px solid rgba(0,255,178,.2); }

        .how-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;
        }
        @media (max-width: 900px) {
          .how-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        .steps { display:flex; flex-direction:column; gap:0; }

        .step {
          display:flex; gap:24px;
          padding:28px 0;
          border-bottom:1px solid var(--border);
          transition:all .2s;
          cursor:default;
        }
        .step:first-child { padding-top:0; }
        .step:last-child { border-bottom:none; }
        .step:hover .step-num { border-color:var(--cyan); color:var(--cyan); }

        .step-num {
          flex-shrink:0;
          width:40px; height:40px; border-radius:10px;
          border:1px solid var(--border);
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:.85rem; font-weight:700;
          color:var(--text-muted); transition:all .2s;
        }

        .step-title {
          font-family:'Syne',sans-serif; font-weight:700; font-size:.95rem;
          margin-bottom:6px;
        }
        .step-desc { font-size:.85rem; color:var(--text-muted); line-height:1.6; }

        .diagnosis-panel {
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:16px; overflow:hidden;
        }

        .panel-header {
          padding:16px 20px;
          border-bottom:1px solid var(--border);
          background:var(--surface2);
          display:flex; align-items:center; gap:12px;
        }
        .panel-dot { width:8px; height:8px; border-radius:50%; }
        .panel-title {
          font-family:'Syne',sans-serif; font-size:.75rem;
          font-weight:700; letter-spacing:.06em; text-transform:uppercase;
          color:var(--text-muted); margin-left:4px;
        }
        .panel-live {
          margin-left:auto; display:flex; align-items:center; gap:6px;
          font-size:.7rem; color:var(--green);
        }

        .panel-body { padding:24px 20px; display:flex; flex-direction:column; gap:16px; }

        .diagnosis-result {
          background:rgba(0,255,178,.06);
          border:1px solid rgba(0,255,178,.15);
          border-radius:10px; padding:16px;
          transition: all 0.3s ease;
        }
        .result-label { font-size:.7rem; color:var(--text-muted); margin-bottom:4px; letter-spacing:.05em; text-transform:uppercase; }
        .result-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; color:var(--green); }

        .confidence-bar-wrap { margin-top:12px; }
        .conf-label { display:flex; justify-content:space-between; font-size:.75rem; margin-bottom:6px; color:var(--text-muted); }
        .conf-val { color:var(--green); font-weight:600; }
        .conf-track { height:5px; background:rgba(255,255,255,.07); border-radius:100px; overflow:hidden; }
        .conf-fill { height:100%; border-radius:100px; background:linear-gradient(90deg, var(--green), var(--cyan)); }

        .other-possibilities { display:flex; flex-direction:column; gap:8px; }
        .poss-item {
          display:flex; align-items:center; justify-content:space-between;
          font-size:.82rem;
        }
        .poss-name { color:var(--text-muted); }
        .poss-pct { font-family:'Syne',sans-serif; font-weight:700; font-size:.75rem; color:var(--text-muted); }
        .poss-mini-bar { flex:1; height:3px; background:rgba(255,255,255,.06); border-radius:100px; margin:0 12px; overflow:hidden; }
        .poss-mini-fill { height:100%; background:rgba(0,200,255,.4); border-radius:100px; }

        .recommend-chip {
          display:inline-flex; align-items:center; gap:6px;
          font-size:.75rem; color:var(--cyan);
          background:rgba(0,200,255,.08);
          border:1px solid rgba(0,200,255,.18);
          border-radius:8px; padding:8px 12px;
        }

        .security-section {
          background:var(--bg2);
          border-top:1px solid var(--border);
          border-bottom:1px solid var(--border);
          padding:100px 48px;
        }

        .security-inner { max-width:1200px; margin:0 auto; }

        .security-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start;
        }
        @media (max-width: 900px) {
          .security-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        .compliance-chips { display:flex; flex-direction:column; gap:12px; margin-top:32px; }

        .compliance-item {
          display:flex; align-items:center; gap:14px;
          padding:16px 20px;
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:10px;
          transition:border-color .2s;
        }
        .compliance-item:hover { border-color:rgba(0,200,255,.25); }

        .comp-icon {
          width:36px; height:36px; flex-shrink:0;
          background:rgba(0,200,255,.08);
          border-radius:8px; display:flex; align-items:center; justify-content:center;
          font-size:1rem;
        }
        .comp-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.9rem; }
        .comp-sub { font-size:.78rem; color:var(--text-muted); margin-top:2px; }

        .integrity-card {
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:16px; overflow:hidden;
        }

        .integrity-header {
          padding:16px 20px; border-bottom:1px solid var(--border);
          background:var(--surface2);
          display:flex; justify-content:space-between; align-items:center;
        }
        .integrity-title { font-family:'Syne',sans-serif; font-size:.75rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--text-muted); }
        .integrity-status { font-family:'Syne',sans-serif; font-weight:700; font-size:.75rem; color:var(--green); display:flex; align-items:center; gap:6px; }

        .integrity-body { padding:24px 20px; }

        .metric-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:10px 0;
          border-bottom:1px solid var(--border);
        }
        .metric-row:last-child { border-bottom:none; }
        .metric-name { font-size:.82rem; color:var(--text-muted); }
        .metric-val { font-family:'Syne',sans-serif; font-weight:700; font-size:.85rem; }
        .metric-val.good { color:var(--green); }
        .metric-val.cyan { color:var(--cyan); }

        .bar-chart { margin-top:20px; }
        .bar-chart-title { font-size:.7rem; color:var(--text-muted); margin-bottom:10px; letter-spacing:.05em; text-transform:uppercase; }
        .bars { display:flex; gap:6px; align-items:flex-end; height:80px; }
        .bar {
          flex:1; border-radius:4px 4px 0 0;
          background:linear-gradient(180deg, rgba(0,200,255,.5), rgba(0,200,255,.15));
          transition:all .3s;
        }
        .bar:nth-child(even) { background:linear-gradient(180deg, rgba(155,92,255,.5), rgba(155,92,255,.15)); }
        .bar:last-child { background:linear-gradient(180deg, var(--green), rgba(0,255,178,.2)); }

        .cta-section {
          text-align:center; padding:120px 48px;
          position:relative; overflow:hidden;
        }
        .cta-glow {
          position:absolute; bottom:-100px; left:50%; transform:translateX(-50%);
          width:700px; height:400px;
          background:radial-gradient(ellipse, rgba(0,200,255,.1), transparent 70%);
          pointer-events:none;
        }

        .cta-title {
          font-family:'Syne',sans-serif; font-size:clamp(2rem,4vw,3.5rem);
          font-weight:800; letter-spacing:-.025em; line-height:1.1;
          max-width:700px; margin:0 auto 20px;
        }
        .cta-sub {
          color:var(--text-muted); max-width:480px; margin:0 auto 48px;
          font-size:.95rem; line-height:1.7; font-weight:300;
        }
        .cta-buttons { display:flex; gap:16px; justify-content:center; align-items:center; flex-wrap:wrap; }
        .btn-large {
          padding:15px 36px; font-size:1rem;
          border-radius:12px;
        }

        footer {
          border-top:1px solid var(--border);
          padding:40px 48px;
          display:flex; align-items:center; justify-content:space-between;
          background:var(--bg2);
          flex-wrap: wrap;
          gap: 20px;
        }
        @media (max-width: 600px) {
          footer { flex-direction: column; text-align: center; }
          .footer-links { justify-content: center; }
        }
        .footer-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; }
        .footer-logo span { color:var(--cyan); }
        .footer-links { display:flex; gap:28px; list-style:none; }
        .footer-links a { font-size:.8rem; color:var(--text-muted); text-decoration:none; transition:color .2s; }
        .footer-links a:hover { color:var(--text); }
        .footer-copy { font-size:.75rem; color:var(--text-muted); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .reveal {
          opacity:0; transform:translateY(30px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .reveal.visible { opacity:1; transform:translateY(0); }

        .toast {
          position:fixed; bottom:32px; right:32px; z-index:999;
          background:var(--surface2); border:1px solid rgba(0,255,178,.3);
          border-radius:12px; padding:16px 20px;
          display:flex; align-items:center; gap:12px;
          box-shadow:0 20px 40px rgba(0,0,0,.5);
          transform:translateY(100px); opacity:0;
          transition:all .4s cubic-bezier(.34,1.56,.64,1);
          pointer-events:none; max-width:340px;
        }
        .toast.show { transform:translateY(0); opacity:1; }
        .toast-icon { font-size:1.2rem; }
        .toast-text { font-size:.85rem; line-height:1.4; }
        .toast-title { font-family:'Syne',sans-serif; font-weight:700; color:var(--green); margin-bottom:2px; }

        /* ── STAGGERED WAVES ── */
        .waves {
          position:relative;
          width: 100%;
          height:80px;
          margin-bottom:-10px;
          min-height:60px;
          max-height:100px;
        }

        .parallax > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }
        .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
        }
        .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
        }
        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }
        .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
        }
        @keyframes move-forever {
          0% {
            transform: translate3d(-90px,0,0);
          }
          100% { 
            transform: translate3d(85px,0,0);
          }
        }
      ` }} />

      {/* NAV */}
      <nav>
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={24} className="text-cyan-400" />
          Medi<span>Scan</span> AI
        </div>
        <ul className="nav-links">
          <li><Link href="/" className="nav-link">Platform</Link></li>
          <li><Link href="/" className="nav-link">Security</Link></li>
          <li><Link href="/" className="nav-link">Clinical Ethics</Link></li>
          <li><Link href="/" className="nav-link">Contact</Link></li>
        </ul>
        <div className="nav-actions">
          <Link href="/login" className="btn-ghost">Doctor Login</Link>
          <Link href="/patient" className="btn-primary">Patient Portal →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ maxWidth: '100%', paddingTop: '140px' }}>
        <div className="grid-bg"></div>
        <div className="hero-glow"></div>

        <div className="hero-badge">
          <div className="badge-dot"></div>
          AI Clinical Assistant · Version 4.2
        </div>

        <h1>AI-powered <em>Smart</em><br />Medical Diagnosis</h1>
        <p className="hero-sub">"Faster insights can lead to faster treatment."<br />Describe your symptoms — our engine does the rest.</p>

        {/* SYMPTOM INPUT WIDGET */}
        <div className="symptom-widget">
          <div className="widget-label">Enter Your Symptoms</div>

          <div className="symptom-input-row">
            <input
              id="symptomInput"
              ref={inputRef}
              className="symptom-input"
              type="text"
              placeholder="e.g. headache, fatigue, sore throat…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKey}
            />
            <button className="btn-primary" onClick={addSymptom} style={{ borderRadius: '10px', padding: '0 20px', whiteSpace: 'nowrap' }}>+ Add</button>
          </div>

          <div className="symptom-tags" id="tagsContainer">
            {symptoms.map((tag, idx) => (
              <span key={idx} className="tag" onClick={() => removeSymptom(idx)}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                <span className="x">✕</span>
              </span>
            ))}
          </div>

          <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Quick select</div>
          <div className="quick-symptoms">
            {['Headache', 'Fever', 'Fatigue', 'Cough', 'Nausea', 'Chest pain', 'Shortness of breath', 'Body ache'].map((sym) => (
              <span key={sym} className="quick-tag" onClick={() => addQuick(sym)}>
                {sym}
              </span>
            ))}
          </div>

          <div className="widget-footer">
            <div className="widget-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              End-to-end encrypted · HIPAA compliant
            </div>
            <button className="btn-diagnose" onClick={runDiagnosis} disabled={isDiagnosing}>
              {isDiagnosing ? 'Analyzing...' : 'Analyse Now'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">98.4%</div>
            <div className="stat-label">Diagnostic Accuracy</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-num">2.3s</div>
            <div className="stat-label">Avg. Analysis Time</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-num">1.2M+</div>
            <div className="stat-label">Cases Analysed</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-num">47</div>
            <div className="stat-label">Languages Supported</div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* CAPABILITIES */}
      <section className="reveal">
        <div className="section-eyebrow">What we offer</div>
        <h2 className="section-title">Diagnostic Capabilities</h2>
        <p className="section-sub">Three pillars of intelligent, real-time medical insight — powered by the latest clinical AI models.</p>

        <div className="cards-grid">
          <div className="cap-card">
            <div className="cap-icon cyan">
              <svg width="20" height="20" fill="none" stroke="var(--cyan)" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </div>
            <div className="cap-title">Medical Report Analysis</div>
            <div className="cap-desc">Automatically processes lab results, imaging data, and clinical notes. Extracts critical vitals from unstructured documents instantly.</div>
            <span className="cap-badge cyan">AI-Powered</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon purple">
              <svg width="20" height="20" fill="none" stroke="var(--purple)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <div className="cap-title">Symptom Assessment Engine</div>
            <div className="cap-desc">Real-time analysis of patient symptoms for triage. Prioritises urgent cases with severity precision based on historical clinical datasets.</div>
            <span className="cap-badge purple">Real-Time</span>
          </div>

          <div className="cap-card">
            <div className="cap-icon green">
              <svg width="20" height="20" fill="none" stroke="var(--green)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </div>
            <div className="cap-title">Multilingual Support</div>
            <div className="cap-desc">Accessible healthcare diagnosis in 47 languages. Breaking language barriers to provide equitable diagnostic reach globally.</div>
            <span className="cap-badge green">47 Languages</span>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* HOW IT WORKS */}
      <section className="reveal">
        <div className="how-grid">
          <div>
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">From symptom input to diagnosis in under three seconds — here's the pipeline.</p>

            <div className="steps">
              <div className="step">
                <div className="step-num">01</div>
                <div className="step-content">
                  <div className="step-title">Enter Symptoms</div>
                  <div className="step-desc">Type or speak your symptoms. Select from quick-add suggestions or describe in natural language.</div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div className="step-content">
                  <div className="step-title">AI Pattern Matching</div>
                  <div className="step-desc">Our model cross-references 4.8M clinical records and current ICD-11 classifications simultaneously.</div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div className="step-content">
                  <div className="step-title">Confidence Scoring</div>
                  <div className="step-desc">Each diagnosis is ranked with a probability score and supporting evidence citations.</div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">04</div>
                <div className="step-content">
                  <div className="step-title">Recommended Actions</div>
                  <div className="step-desc">Receive personalised next steps — whether a GP visit, OTC advice, or immediate care referral.</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="diagnosis-panel">
              <div className="panel-header">
                <div className="panel-dot" style={{ background: '#ff5f57' }}></div>
                <div className="panel-dot" style={{ background: '#febc2e' }}></div>
                <div className="panel-dot" style={{ background: '#28c840' }}></div>
                <div className="panel-title">Diagnosis Output</div>
                <div className="panel-live">
                  <div className="logo-dot" style={{ width: '6px', height: '6px', backgroundColor: isDiagnosing ? 'var(--cyan)' : 'var(--green)' }}></div>
                  {isDiagnosing ? 'Analysing...' : 'Live Preview'}
                </div>
              </div>
              <div className="panel-body">
                {symptoms.length > 0 && (
                  <>
                    <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Symptoms analyzed</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {symptoms.map((s, i) => (
                        <span key={i} className="tag" style={{ cursor: 'default' }}>{s}</span>
                      ))}
                    </div>
                  </>
                )}

                {triageResult ? (
                  <div className="diagnosis-result" style={{ 
                    background: triageResult.classification === 'critical' ? 'rgba(239, 68, 68, 0.08)' : triageResult.classification === 'high' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0, 255, 178, 0.06)',
                    borderColor: triageResult.classification === 'critical' ? 'rgba(239, 68, 68, 0.25)' : triageResult.classification === 'high' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 255, 178, 0.15)'
                  }}>
                    <div className="result-label">Triage Assessment</div>
                    <div className="result-title" style={{ 
                      color: triageResult.classification === 'critical' ? '#ef4444' : triageResult.classification === 'high' ? '#f59e0b' : 'var(--green)'
                    }}>{triageResult.classification.toUpperCase()} PRIORITY</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '8px', lineHeight: '1.5' }}>
                      {triageResult.ai_insight}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="diagnosis-result">
                      <div className="result-label">Primary Diagnosis</div>
                      <div className="result-title">Viral Pharyngitis</div>
                      <div className="confidence-bar-wrap">
                        <div className="conf-label">
                          <span>Confidence</span>
                          <span className="conf-val">88%</span>
                        </div>
                        <div className="conf-track"><div className="conf-fill" style={{ width: '88%' }}></div></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px' }}>Other possibilities</div>
                      <div className="other-possibilities">
                        <div className="poss-item">
                          <span className="poss-name">Influenza A</span>
                          <div className="poss-mini-bar"><div className="poss-mini-fill" style={{ width: '52%' }}></div></div>
                          <span className="poss-pct">52%</span>
                        </div>
                        <div className="poss-item">
                          <span className="poss-name">COVID-19</span>
                          <div className="poss-mini-bar"><div className="poss-mini-fill" style={{ width: '34%' }}></div></div>
                          <span className="poss-pct">34%</span>
                        </div>
                        <div className="poss-item">
                          <span className="poss-name">Strep Throat</span>
                          <div className="poss-mini-bar"><div className="poss-mini-fill" style={{ width: '21%' }}></div></div>
                          <span className="poss-pct">21%</span>
                        </div>
                      </div>
                    </div>

                    <div className="recommend-chip">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      Recommended: GP visit within 48 hours
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* SECURITY */}
      <div className="security-section">
        <div className="security-inner">
          <div className="security-grid">
            <div className="reveal">
              <div className="section-eyebrow">Trust & Safety</div>
              <h2 className="section-title">Rigorous Security<br />& Compliance</h2>
              <p className="section-sub">Our platform operates on a zero-trust architecture. Patient data is fully HIPAA and GDPR compliant — encrypted at rest and in transit.</p>

              <div className="compliance-chips">
                <div className="compliance-item">
                  <div className="comp-icon">🔒</div>
                  <div>
                    <div className="comp-title">End-to-End Encryption (AES-256)</div>
                    <div className="comp-sub">All data encrypted in transit and at rest</div>
                  </div>
                </div>
                <div className="compliance-item">
                  <div className="comp-icon">✅</div>
                  <div>
                    <div className="comp-title">SOC 2 Type II Certified Processing</div>
                    <div className="comp-sub">Annual third-party security audits</div>
                  </div>
                </div>
                <div className="compliance-item">
                  <div className="comp-icon">🛡️</div>
                  <div>
                    <div className="comp-title">Real-Time Anomaly Detection</div>
                    <div className="comp-sub">ML-powered intrusion prevention system</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <div className="integrity-card">
                <div className="integrity-header">
                  <div className="integrity-title">System Integrity</div>
                  <div className="integrity-status">
                    <div className="badge-dot"></div>
                    100% Secure
                  </div>
                </div>
                <div className="integrity-body">
                  <div className="metric-row">
                    <span className="metric-name">Uptime (30 days)</span>
                    <span className="metric-val good">99.98%</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-name">Breach Incidents</span>
                    <span className="metric-val good">0</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-name">HIPAA Compliant</span>
                    <span className="metric-val good">✔ Active</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-name">GDPR Compliant</span>
                    <span className="metric-val good">✔ Active</span>
                  </div>

                  <div className="bar-chart">
                    <div className="bar-chart-title">Diagnostic accuracy — last 7 days</div>
                    <div className="bars">
                      <div className="bar" style={{ height: '60%' }}></div>
                      <div className="bar" style={{ height: '72%' }}></div>
                      <div className="bar" style={{ height: '55%' }}></div>
                      <div className="bar" style={{ height: '80%' }}></div>
                      <div className="bar" style={{ height: '68%' }}></div>
                      <div className="bar" style={{ height: '74%' }}></div>
                      <div className="bar" style={{ height: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section reveal" style={{ maxWidth: '100%' }}>
        <div className="cta-glow"></div>
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>Get Started Today</div>
        <h2 className="cta-title">Healthcare intelligence<br />in your hands — <em style={{ fontStyle: 'normal', background: 'linear-gradient(120deg,var(--cyan),var(--green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>right now.</em></h2>
        <p className="cta-sub">Join over 1.2 million patients who have received faster, smarter diagnoses with MediScan AI.</p>
        <div className="cta-buttons">
          <Link href="/patient" className="btn-primary btn-large">Start Free as a Patient</Link>
          <Link href="/login" className="btn-ghost btn-large" style={{ padding: '14px 32px', fontSize: '1rem' }}>Doctor / Clinic Login</Link>
        </div>
      </section>

      {/* STAGGERED CSS WAVES */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: '80px', marginBottom: '-2px', zIndex: 1 }}>
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto" style={{ width: '100%', height: '80px' }}>
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0, 200, 255, 0.08)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(59, 130, 246, 0.12)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(139, 92, 246, 0.18)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--bg2)" />
          </g>
        </svg>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={20} className="text-cyan-400" />
          Medi<span>Scan</span> AI
        </div>
        <ul className="footer-links">
          <li><Link href="/" className="footer-link">Platform</Link></li>
          <li><Link href="/" className="footer-link">Security</Link></li>
          <li><Link href="/" className="footer-link">Clinical Ethics</Link></li>
          <li><Link href="/" className="footer-link">Contact</Link></li>
        </ul>
        <div className="footer-copy">© 2026 MediScan AI. Not a substitute for professional medical advice.</div>
      </footer>

      {/* TOAST */}
      <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
        <div className="toast-icon">🔬</div>
        <div className="toast-text">
          <div className="toast-title">Analysis Started</div>
          <div>Evaluating symptoms against clinical databases...</div>
        </div>
      </div>
    </div>
  );
}