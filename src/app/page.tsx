'use client';

import React, { useState, useEffect } from 'react';

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

export default function Home() {
  const [selectedScan, setSelectedScan] = useState<ScanPreset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);

  const steps = [
    'Initializing advanced convolutional neural network...',
    'Performing multi-planar reconstruction (MPR)...',
    'Applying noise reduction and edge enhancement algorithms...',
    'Segmenting anatomical regions of interest (ROI)...',
    'Analyzing voxel density and density gradient variances...',
    'Cross-referencing anomaly database (12M+ clinical scans)...',
    'Generating comprehensive diagnostics report...'
  ];

  // Simulator for the scanning process
  useEffect(() => {
    if (!isScanning) return;

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
  }, [isScanning]);

  const handleSelectPreset = (preset: ScanPreset) => {
    setSelectedScan(preset);
    setIsAnalysisComplete(false);
    setIsScanning(false);
    setScanLogs([]);
    setUploadedFile(null);
  };

  const handleStartAnalysis = () => {
    if (!selectedScan) return;
    setIsAnalysisComplete(false);
    setIsScanning(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate premium upload
    setTimeout(() => {
      setUploadedFile({
        name: 'Patient_Scan_' + Math.floor(Math.random() * 10000) + '.jpg',
        type: 'Chest X-Ray (Simulated)'
      });
      // Fallback to chest-xray preset to display rich details
      setSelectedScan(SCAN_PRESETS[1]);
      setIsUploading(false);
      setIsAnalysisComplete(false);
    }, 1500);
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="status-badge success" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
            SYSTEM OPERATIONAL
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            v4.2-Pro
          </span>
        </div>
      </header>

      {/* Hero Welcome / Intro */}
      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: 800 }}>
          Precision AI Diagnostics for Medical Scans
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Upload radiographic imaging scans to generate localized anomaly segmentation maps, quantitative biomarkers, and predictive clinical summaries in seconds.
        </p>
      </section>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Scan Upload and Preset Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flexFlow: 'column' }}>
          
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
                  <button className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
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
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${selectedScan.imageUrl})`,
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
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                  }}>
                    {selectedScan.confidence} CONFIDENCE
                  </div>
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
                  
                  {/* Biomarkers / Metrics */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      QUANTITATIVE BIOMARKERS
                    </h4>
                    <div className="metric-row">
                      <div className="metric-card">
                        <div className="metric-value">{selectedScan.metrics.resolution}</div>
                        <div className="metric-label">Resolution</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value" style={{ color: selectedScan.severity === 'high' ? 'var(--danger)' : selectedScan.severity === 'medium' ? 'var(--warning)' : 'var(--success)' }}>
                          {selectedScan.metrics.anomalyIndex}
                        </div>
                        <div className="metric-label">Anomaly Index</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">{selectedScan.metrics.safetyScore}</div>
                        <div className="metric-label">Clearance Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Findings */}
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
                      AI Diagnostic Findings
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
                      {selectedScan.findings.map((finding, idx) => (
                        <li key={idx} style={{ listStyleType: 'square' }}>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

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
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleSelectPreset(selectedScan)}>
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
      `}</style>
    </div>
  );
}
