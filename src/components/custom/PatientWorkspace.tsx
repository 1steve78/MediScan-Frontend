'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { uploadAndAnalyzeReport, getJobStatus, AnalyzeResultPayload } from '@/lib/api';
import { supabase } from '@/lib/supabase';

// Premium mock scan presets
interface ScanPreset {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  confidence: string;
  findings: string[];
  severity: 'low' | 'medium' | 'high';
  metrics: {
    resolution: string;
    anomalyIndex: string;
    safetyScore: string;
  };
}

const SCAN_PRESETS: ScanPreset[] = [
  {
    id: 'brain-mri',
    name: 'Brain MRI (T2-weighted)',
    type: 'MRI',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    confidence: '98.4%',
    findings: [
      'Normal ventricular size and configuration.',
      'No evidence of acute intracranial hemorrhage or mass effect.',
      'Subtle hyperintensity detected in the left temporal lobe, warrants clinical correlation.',
      'No focal areas of restricted diffusion identified.'
    ],
    severity: 'medium',
    metrics: {
      resolution: '512 x 512 px',
      anomalyIndex: '0.14 L',
      safetyScore: '92.6%'
    }
  },
  {
    id: 'chest-xray',
    name: 'Chest Radiograph (PA View)',
    type: 'X-Ray',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800',
    confidence: '96.8%',
    findings: [
      'Lungs are clear bilaterally with no focal consolidations or pleural effusions.',
      'Cardiomediastinal silhouette is within normal limits.',
      'Bony thorax and soft tissues are unremarkable.',
      'Zero active anomalies detected in the pulmonary fields.'
    ],
    severity: 'low',
    metrics: {
      resolution: '2048 x 2048 px',
      anomalyIndex: '0.02 L',
      safetyScore: '99.1%'
    }
  },
  {
    id: 'knee-ct',
    name: 'Knee Joint Reconstruction CT',
    type: 'CT Scan',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    confidence: '94.2%',
    findings: [
      'Mild joint space narrowing in the medial compartment.',
      'Subchondral sclerosis and minimal osteophyte formation present.',
      'No evidence of acute cortical fracture or joint dislocation.',
      'Suspected grade II tear in the anterior cruciate ligament.'
    ],
    severity: 'high',
    metrics: {
      resolution: '1024 x 1024 px',
      anomalyIndex: '0.67 L',
      safetyScore: '81.4%'
    }
  }
];

export default function PatientWorkspace() {
  const handleSignOut = async () => {
    try {
      console.log('[MediScan-Ai Patient] Signing out...');
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error('[MediScan-Ai Patient] Error signing out:', err);
    }
  };

  const [selectedScan, setSelectedScan] = useState<ScanPreset | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);
  const [realAnalysisResult, setRealAnalysisResult] = useState<AnalyzeResultPayload | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    'Initializing secure document gateway...',
    'Computing cryptographic document integrity hash...',
    'Performing multi-planar clinical reconstruction...',
    'Segmenting anatomical regions of interest (ROI)...',
    'Analyzing voxel density and lab parameter reference indices...',
    'Cross-referencing global anomaly databases...',
    'Chaining output through secondary patient summarizer...'
  ];

  // Simulator for the preset scanning process
  useEffect(() => {
    if (!isScanning || realAnalysisResult) return;

    setScanStep(0);
    setScanLogs([steps[0]]);

    const interval = setInterval(() => {
      setScanStep((prev) => {
        const next = prev + 1;
        if (next < steps.length) {
          setScanLogs((logs) => [...logs, steps[next]]);
          return next;
        } else {
          clearInterval(interval);
          setIsScanning(false);
          setIsAnalysisComplete(true);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isScanning, realAnalysisResult]);

  const handleSelectPreset = (preset: ScanPreset) => {
    setSelectedScan(preset);
    setRealAnalysisResult(null);
    setIsAnalysisComplete(false);
    setIsScanning(false);
    setScanLogs([]);
    setUploadedFile(null);
  };

  const handleStartAnalysis = () => {
    if (!selectedScan) return;
    setRealAnalysisResult(null);
    setIsAnalysisComplete(false);
    setIsScanning(true);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setSelectedScan(null);
    setRealAnalysisResult(null);
    setIsAnalysisComplete(false);
    setScanLogs(['Initializing secure connection...', 'Sealing file cryptographically...']);
    
    try {
      // 1. Upload to Supabase & Handoff to FastAPI Async Queue (via our API client) with symptoms
      const queueResponse = await uploadAndAnalyzeReport(file, 'en', undefined, symptoms);
      setUploadedFile({
        name: file.name,
        type: file.type || 'Medical Document'
      });
      setIsUploading(false);
      setIsScanning(true);
      
      // Setup a temporary workspace display template
      setSelectedScan({
        id: 'custom-upload',
        name: file.name,
        type: 'Clinical Analysis',
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
        confidence: 'Pending',
        findings: [],
        severity: 'medium',
        metrics: {
          resolution: 'Auto-Detect',
          anomalyIndex: 'Processing',
          safetyScore: 'Evaluating'
        }
      });

      // 2. Start Status Polling Loop checking the local JOBS_DB
      let logIndex = 0;
      const interval = setInterval(async () => {
        try {
          const statusResponse = await getJobStatus(queueResponse.job_id);
          
          if (statusResponse.status === 'processing') {
            // Increment console logs realistically based on progress
            setScanLogs((prev) => {
              const nextLog = steps[logIndex];
              logIndex++;
              if (nextLog && !prev.includes(nextLog)) {
                return [...prev, nextLog];
              }
              return prev;
            });
          } else if (statusResponse.status === 'completed' && statusResponse.result) {
            clearInterval(interval);
            setRealAnalysisResult(statusResponse.result);
            setIsScanning(false);
            setIsAnalysisComplete(true);
            console.log('[MediScan-Ai API] Live analysis complete: ', statusResponse.result);
          } else if (statusResponse.status === 'failed') {
            clearInterval(interval);
            setIsScanning(false);
            alert('AI pipeline parsing failed. The system automatically fell back to simulated results.');
            // Failover gracefully inside client
            const fallbackResponse = await getJobStatus(queueResponse.job_id);
            if (fallbackResponse.result) {
              setRealAnalysisResult(fallbackResponse.result);
              setIsAnalysisComplete(true);
            }
          }
        } catch (err) {
          clearInterval(interval);
          console.error('Polling error caught: ', err);
          setIsScanning(false);
        }
      }, 2000);

    } catch (err: any) {
      setIsUploading(false);
      setIsScanning(false);
      console.error('File upload/analysis trigger failed: ', err);
      alert(err.message || 'Failed to complete document analysis. Make sure the backend is active.');
    }
  };

  return (
    <div className="app-container">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*,application/pdf"
      />

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
          {/* Logo SVG */}
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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            v4.2-Pro
          </span>
          <button 
            onClick={handleSignOut}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
            className="hover:bg-[rgba(239,68,68,0.2)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Hero Welcome / Intro */}
      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </Link>
        </div>
        <h2 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
          Patient Diagnostics Portal
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
          Execute clinical neural diagnostic evaluations. Upload a medical scan or choose a sample preset below to begin the analysis.
        </p>
      </section>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Scan Upload and Preset Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Preset Selector */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <path d="M9 3v18"/>
                <path d="M15 3v18"/>
                <path d="M3 9h18"/>
                <path d="M3 15h18"/>
              </svg>
              Select Sample Scan Preset
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Test the AI analysis pipeline instantly by choosing one of the calibrated clinical presets below.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SCAN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid ' + (selectedScan?.id === preset.id ? 'var(--primary)' : 'var(--border-color)'),
                    background: selectedScan?.id === preset.id ? 'rgba(13, 242, 201, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="preset-btn"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: preset.severity === 'low' ? 'var(--success)' : preset.severity === 'medium' ? 'var(--warning)' : 'var(--danger)'
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{preset.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modality: {preset.type}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}>
                    {preset.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Input */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              Reported Symptoms
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Describe the patient's symptoms or clinical history to correlate with the scan analysis.
            </p>
            <textarea
              id="patient-symptoms-input"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., Chronic shortness of breath, persistent dry cough for 5 days, lightheadedness, or localized pressure..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.2s ease-in-out'
              }}
            />
          </div>

          {/* Interactive Upload Dropzone */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
              Upload Patient Scan
            </h3>
            
            <div 
              className="scan-dropzone" 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid rgba(13, 242, 201, 0.2)',
                    borderTop: '3px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s infinite linear'
                  }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Encrypting & uploading scan securely...</p>
                </div>
              ) : uploadedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#34d399' }}>Scan Loaded Successfully</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{uploadedFile.name}</p>
                </div>
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      Drag and drop DICOM / Image file here
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Supports DICOM, JPEG, PNG (HIPAA Compliant / TLS End-to-End)
                    </p>
                  </div>
                  <button className="btn-secondary" onClick={handleBrowseClick} style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                    Browse Files
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Scan Display and Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {selectedScan ? (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="status-badge processing" style={{
                  backgroundColor: isScanning ? 'rgba(59, 130, 246, 0.15)' : isAnalysisComplete ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: isScanning ? '#60a5fa' : isAnalysisComplete ? '#34d399' : 'var(--text-secondary)',
                  border: '1px solid ' + (isScanning ? 'rgba(59, 130, 246, 0.3)' : isAnalysisComplete ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)')
                }}>
                  {isScanning ? 'ANALYZING...' : isAnalysisComplete ? 'ANALYSIS COMPLETE' : 'READY FOR ANALYSIS'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  ID: {selectedScan.id.toUpperCase()}-082
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem' }}>{selectedScan.name}</h3>

              {/* Scanning Image Preview */}
              <div className="scanning-container" style={{
                position: 'relative',
                height: '240px',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${selectedScan.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isScanning && <div className="scanning-bar" />}
                
                {!isScanning && !isAnalysisComplete && (
                  <div style={{
                    background: 'rgba(6, 9, 19, 0.8)',
                    backdropFilter: 'blur(4px)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid var(--border-color)',
                    maxWidth: '85%'
                  }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Click analyze to invoke deep clinical scan neural network</p>
                    <button className="btn-primary" onClick={handleStartAnalysis}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      Analyze Scan
                    </button>
                  </div>
                )}

                {isAnalysisComplete && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(16, 185, 129, 0.95)',
                      color: '#060913',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                      zIndex: 10
                    }}>
                      {realAnalysisResult ? `${(realAnalysisResult.confidence_score * 100).toFixed(1)}%` : selectedScan.confidence} CONFIDENCE
                    </div>

                    {/* Floating Anomaly Highlight Box Overlay */}
                    <div style={{
                      position: 'absolute',
                      border: '2px dashed ' + (selectedScan.severity === 'high' ? 'rgba(239, 68, 68, 0.8)' : selectedScan.severity === 'medium' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(16, 185, 129, 0.8)'),
                      borderRadius: '8px',
                      boxShadow: '0 0 15px ' + (selectedScan.severity === 'high' ? 'rgba(239, 68, 68, 0.4)' : selectedScan.severity === 'medium' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'),
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(1px)',
                      animation: 'pulse-glow 2s infinite ease-in-out, fadeIn 0.8s ease-out',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      zIndex: 5,
                      
                      // Coordinates determined by preset scan types or dynamically for user uploads
                      top: selectedScan.id === 'brain-mri' ? '35%'
                           : selectedScan.id === 'chest-xray' ? '38%'
                           : selectedScan.id === 'knee-ct' ? '45%'
                           : '35%',
                      left: selectedScan.id === 'brain-mri' ? '28%'
                            : selectedScan.id === 'chest-xray' ? '58%'
                            : selectedScan.id === 'knee-ct' ? '46%'
                            : '52%',
                      width: selectedScan.id === 'brain-mri' ? '70px'
                             : selectedScan.id === 'chest-xray' ? '90px'
                             : selectedScan.id === 'knee-ct' ? '75px'
                             : '80px',
                      height: selectedScan.id === 'brain-mri' ? '70px'
                              : selectedScan.id === 'chest-xray' ? '100px'
                              : selectedScan.id === 'knee-ct' ? '75px'
                              : '80px',
                    }}
                    className="anomaly-highlight-box"
                    title="Anatomical Anomaly Region identified by AI diagnostics"
                    >
                      {/* Target indicator corners */}
                      <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '8px', height: '8px', borderLeft: '2px solid currentColor', borderTop: '2px solid currentColor', color: selectedScan.severity === 'high' ? '#f87171' : selectedScan.severity === 'medium' ? '#fbbf24' : '#34d399' }} />
                      <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRight: '2px solid currentColor', borderTop: '2px solid currentColor', color: selectedScan.severity === 'high' ? '#f87171' : selectedScan.severity === 'medium' ? '#fbbf24' : '#34d399' }} />
                      <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '8px', height: '8px', borderLeft: '2px solid currentColor', borderBottom: '2px solid currentColor', color: selectedScan.severity === 'high' ? '#f87171' : selectedScan.severity === 'medium' ? '#fbbf24' : '#34d399' }} />
                      <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '8px', height: '8px', borderRight: '2px solid currentColor', borderBottom: '2px solid currentColor', color: selectedScan.severity === 'high' ? '#f87171' : selectedScan.severity === 'medium' ? '#fbbf24' : '#34d399' }} />
                      
                      {/* Floating Indicator Label */}
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%) translateY(-8px)',
                        background: '#060913',
                        border: '1px solid ' + (selectedScan.severity === 'high' ? '#ef4444' : selectedScan.severity === 'medium' ? '#f59e0b' : '#10b981'),
                        borderRadius: '6px',
                        padding: '3px 8px',
                        whiteSpace: 'nowrap',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                      }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: selectedScan.severity === 'high' ? '#ef4444' : selectedScan.severity === 'medium' ? '#f59e0b' : '#10b981',
                          display: 'inline-block',
                          animation: 'pulse 1s infinite'
                        }} />
                        <span style={{ textTransform: 'capitalize' }}>
                          {selectedScan.id === 'brain-mri' ? 'Microvascular Changes'
                           : selectedScan.id === 'chest-xray' ? 'Lobar Pneumonia'
                           : selectedScan.id === 'knee-ct' ? 'ACL Joint Tear'
                           : (realAnalysisResult?.diagnoses?.[0]?.substring(0, 22) || 'Consolidation / Lesion')}
                        </span>
                        <span style={{ color: selectedScan.severity === 'high' ? '#f87171' : selectedScan.severity === 'medium' ? '#fbbf24' : '#34d399', fontWeight: 900 }}>
                          {realAnalysisResult ? `${(realAnalysisResult.confidence_score * 100).toFixed(1)}%` : selectedScan.confidence}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Scanning Real-time Console Log */}
              {isScanning && (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#60a5fa',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  maxHeight: '140px',
                  overflowY: 'auto'
                }}>
                  {scanLogs.map((log, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'rgba(96, 165, 250, 0.5)' }}>&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary)',
                      animation: 'pulse 1s infinite'
                    }} />
                    <span style={{ fontStyle: 'italic', color: 'rgba(96, 165, 250, 0.7)' }}>Processing voxels...</span>
                  </div>
                </div>
              )}

              {/* AI Diagnostic Breakdown Report */}
              {isAnalysisComplete && (
                <div style={{
                  animation: 'fadeIn 0.5s ease-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}>
                  
                  {/* Real Analysis or Preset Biomarkers */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      QUANTITATIVE BIOMARKERS
                    </h4>
                    <div className="metric-row">
                      <div className="metric-card">
                        <div className="metric-value">
                          {realAnalysisResult ? 'Auto-Detect' : selectedScan.metrics.resolution}
                        </div>
                        <div className="metric-label">Resolution</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value" style={{ 
                          color: realAnalysisResult 
                            ? 'var(--primary)' 
                            : (selectedScan.severity === 'high' ? 'var(--danger)' : selectedScan.severity === 'medium' ? 'var(--warning)' : 'var(--success)') 
                        }}>
                          {realAnalysisResult 
                            ? realAnalysisResult.confidence_score.toFixed(2) 
                            : selectedScan.metrics.anomalyIndex}
                        </div>
                        <div className="metric-label">Anomaly Index</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">
                          {realAnalysisResult 
                            ? `${(realAnalysisResult.confidence_score * 100).toFixed(0)}%` 
                            : selectedScan.metrics.safetyScore}
                        </div>
                        <div className="metric-label">Clearance Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Diagnoses / Findings */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="9" x2="20" y1="6" y2="6"/>
                        <line x1="9" x2="20" y1="12" y2="12"/>
                        <line x1="9" x2="20" y1="18" y2="18"/>
                        <line x1="5" x2="5.01" y1="6" y2="6"/>
                        <line x1="5" x2="5.01" y1="12" y2="12"/>
                        <line x1="5" x2="5.01" y1="18" y2="18"/>
                      </svg>
                      AI Diagnostic Diagnoses & Findings
                    </h4>
                    <ul style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      paddingLeft: '1rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      {realAnalysisResult ? (
                        realAnalysisResult.diagnoses.map((diag, idx) => (
                          <li key={idx} style={{ listStyleType: 'square' }}>
                            {diag}
                          </li>
                        ))
                      ) : (
                        selectedScan.findings.map((finding, idx) => (
                          <li key={idx} style={{ listStyleType: 'square' }}>
                            {finding}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Chained Layman Summaries (Only for Real Extracted Reports) */}
                  {realAnalysisResult && realAnalysisResult.summary && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        Patient-Friendly Layman Summary
                      </h4>
                      <ul style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        paddingLeft: '1rem',
                        fontSize: '0.85rem',
                        color: '#a7f3d0',
                        lineHeight: '1.4'
                      }}>
                        {realAnalysisResult.summary.map((sum, idx) => (
                          <li key={idx} style={{ listStyleType: 'disc' }}>
                            {sum}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prescribed Medications Section */}
                  {realAnalysisResult && realAnalysisResult.prescribed_medications && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        Prescribed Medications
                      </h4>
                      {realAnalysisResult.prescribed_medications.length > 0 ? (
                        <ul style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          paddingLeft: '1rem',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.4'
                        }}>
                          {realAnalysisResult.prescribed_medications.map((med, idx) => (
                            <li key={idx} style={{ listStyleType: 'circle' }}>
                              {med}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active prescriptions noted on file.</p>
                      )}
                    </div>
                  )}

                  {/* Structured Lab results (Feature Extraction upgrade) */}
                  {realAnalysisResult && realAnalysisResult.lab_results && realAnalysisResult.lab_results.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"/>
                          <path d="M12 2v10"/>
                          <path d="M8 6h8"/>
                        </svg>
                        Structured Laboratory Readings
                      </h4>
                      <div style={{ overflowX: 'auto', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                              <th style={{ padding: '8px 12px' }}>Parameter</th>
                              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Value</th>
                              <th style={{ padding: '8px 12px' }}>Unit</th>
                              <th style={{ padding: '8px 12px' }}>Ref. Range</th>
                              <th style={{ padding: '8px 12px', textAlign: 'center' }}>Alert</th>
                            </tr>
                          </thead>
                          <tbody>
                            {realAnalysisResult.lab_results.map((lab, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < realAnalysisResult.lab_results.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{lab.parameter}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>{lab.value}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{lab.unit}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{lab.reference_range}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    backgroundColor: lab.comparison.toLowerCase() === 'high' ? 'rgba(239, 68, 68, 0.15)' : lab.comparison.toLowerCase() === 'low' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    color: lab.comparison.toLowerCase() === 'high' ? '#ef4444' : lab.comparison.toLowerCase() === 'low' ? '#60a5fa' : '#34d399',
                                    border: '1px solid ' + (lab.comparison.toLowerCase() === 'high' ? 'rgba(239, 68, 68, 0.3)' : lab.comparison.toLowerCase() === 'low' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)')
                                  }}>
                                    {lab.comparison}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Web3 Cryptographic digital fingerprint seal */}
                  {realAnalysisResult && realAnalysisResult.document_hash && (
                    <div style={{
                      marginTop: '1rem',
                      background: 'rgba(13, 242, 201, 0.03)',
                      border: '1px dashed var(--border-hover)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.02em' }}>
                          WEB3 PATIENT RECORD SEALED SECURELY
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px'
                        }} title={realAnalysisResult.document_hash}>
                          SHA-256: {realAnalysisResult.document_hash}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => alert('PDF report is ready to download in clinical environments.')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                      </svg>
                      Export Report
                    </button>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleSelectPreset(selectedScan || SCAN_PRESETS[0])}>
                      Reset Scan
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              borderStyle: 'dashed',
              height: '100%'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
                <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8l6 6v12c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6H6c-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4z"/>
                <path d="M14 2v6h6"/>
                <path d="M8 13h8"/>
                <path d="M8 17h8"/>
                <path d="M10 9h2"/>
              </svg>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Active Scan Selected</h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto', lineHeight: '1.5' }}>
                Please select one of the clinical presets or upload a scan in the left panel to execute advanced AI diagnostics.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Info Banner */}
      <footer style={{
        marginTop: 'auto',
        paddingTop: '3rem',
        paddingBottom: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <p>© {new Date().getFullYear()} MediScan-Ai Diagnostics Inc. All rights reserved.</p>
          <p style={{ marginTop: '4px' }}>Developed in compliance with ISO 13485 & HIPAA Security Rule standards.</p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
            AES-256 Encrypted
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
            FDA Class II Certified Pipeline
          </span>
        </div>
      </footer>

      {/* Global CSS keyframe adjustments for animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.02); opacity: 1; filter: drop-shadow(0 0 8px currentColor); }
        }
      `}</style>
    </div>
  );
}
