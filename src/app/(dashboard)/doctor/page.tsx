"use client";

import React, { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Activity, 
  Clock, 
  Search, 
  SlidersHorizontal, 
  Settings, 
  FileText, 
  BarChart2, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight, 
  X,
  CheckCircle,
  Undo
} from 'lucide-react';

// --- Types ---
type TriageLevel = 'Critical' | 'Urgent' | 'Amber' | 'Stable';

interface Vital {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  time: string;
  symptoms: string;
  triage: TriageLevel;
  analysis: string[];
  vitals: {
    bloodPressure: Vital;
    heartRate: Vital;
    spO2: Vital;
    temperature: Vital;
  };
  logs: string[];
}

// --- Mock Data matching the Screenshot ---
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'IPX-882',
    name: 'Sarah Jenkins',
    age: 42,
    gender: 'Female',
    time: '14:22',
    symptoms: 'Severe respiratory distress; sudden onset chest pain.',
    triage: 'Critical',
    analysis: [
      'SPO2 levels trending downwards (4% drop in last 15 mins).',
      'ECG pattern shows ST-segment abnormalities consistent with ischemia.',
      'Patient verbalizes acute radiating pain to left shoulder and jaw.',
      'Recommendation: Immediate Cardiology consult and Troponin testing.'
    ],
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '142/90', unit: 'mmHg', status: 'abnormal' },
      heartRate: { label: 'Heart Rate', value: '98', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '94', unit: '%', status: 'critical' },
      temperature: { label: 'Temperature', value: '101.2', unit: '°F', status: 'abnormal' }
    },
    logs: [
      '[14:23] AI ANALYSIS COMPLETE: IPX-882',
      '[14:22] SYNCING ECG STREAM - CHANNEL A',
      '[14:21] PHYSICIAN ACCESSED FILE: DR_ALEXANDER'
    ]
  },
  {
    id: 'IPX-910',
    name: 'Marcus Thorne',
    age: 29,
    gender: 'Male',
    time: '14:15',
    symptoms: 'Laceration to left forearm; suspected tendon damage.',
    triage: 'Urgent',
    analysis: [
      'Active bleeding controlled. Potential tendon puncture at volar side.',
      'Diminished sensory response in distal phalanges of digits 1-3.',
      'High urgency for orthopedic assessment to determine surgical repair necessity.',
      'Recommendation: Administer prophylaxis antibiotics and schedule debridement.'
    ],
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '122/78', unit: 'mmHg', status: 'normal' },
      heartRate: { label: 'Heart Rate', value: '84', unit: 'bpm', status: 'normal' },
      spO2: { label: 'SpO2', value: '98', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal' }
    },
    logs: [
      '[14:16] LACERATION WORKFLOW INGESTED: IPX-910',
      '[14:15] PERIPHERAL NERVE ASSESSMENT INITIATED',
      '[14:12] TRIAGE INTAKE COMPLETE BY NURSE_HARRIS'
    ]
  },
  {
    id: 'IPX-771',
    name: 'Elena Rodriguez',
    age: 68,
    gender: 'Female',
    time: '14:02',
    symptoms: 'Elevated glucose levels; history of Type 2 Diabetes.',
    triage: 'Amber',
    analysis: [
      'Blood glucose reading at 365 mg/dL. Trace ketones detected in urine.',
      'Mild dehydration present. Cognitive functions intact but patient feels fatigued.',
      'Rule out Hyperosmolar Hyperglycemic State (HHS).',
      'Recommendation: Administer IV normal saline hydration and monitor insulin protocol.'
    ],
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '130/82', unit: 'mmHg', status: 'normal' },
      heartRate: { label: 'Heart Rate', value: '92', unit: 'bpm', status: 'normal' },
      spO2: { label: 'SpO2', value: '96', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '99.1', unit: '°F', status: 'normal' }
    },
    logs: [
      '[14:04] GLUCOSE LAB PROFILE CONFIRMED',
      '[14:02] AUTOMATED INTAKE COMPLETED: IPX-771',
      '[13:55] PATIENT ARRIVED VIA WALK-IN'
    ]
  },
  {
    id: 'IPX-604',
    name: 'David Chen',
    age: 35,
    gender: 'Male',
    time: '13:50',
    symptoms: 'Post-operative check-up; routine vitals assessment.',
    triage: 'Stable',
    analysis: [
      '3-day post-op check for laparoscopic appendectomy.',
      'Wounds are clean, dry, and showing early signs of normal healing.',
      'Symptom presentation is mild. Normal bowel sounds present.',
      'Recommendation: Discharge patient with instructions for lifting restrictions.'
    ],
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '118/74', unit: 'mmHg', status: 'normal' },
      heartRate: { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
      spO2: { label: 'SpO2', value: '99', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.2', unit: '°F', status: 'normal' }
    },
    logs: [
      '[13:52] DISCHARGE BRIEF GENERATED BY AI CORE',
      '[13:50] ROUTINE POST-OP VITALS STABILIZED',
      '[13:40] CHECK-IN COMPLETED: IPX-604'
    ]
  }
];

// Custom Badge rendering based on triage level
const TriageBadge = ({ level }: { level: TriageLevel }) => {
  const styles = {
    Critical: "bg-red-500/10 text-red-500 border-red-500/25",
    Urgent: "bg-orange-500/10 text-orange-500 border-orange-500/25",
    Amber: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    Stable: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[level]}`}>
      {level}
    </span>
  );
};

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);

  const handleSignOut = async () => {
    try {
      console.log('[MediScan-Ai Doctor] Signing out...');
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error('[MediScan-Ai Doctor] Error signing out:', err);
    }
  };
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filterLevel, setFilterLevel] = useState<TriageLevel | 'All'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; action?: () => void } | null>(null);

  // Retrieve currently selected patient
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedId) || patients[0] || null;
  }, [patients, selectedId]);

  // Handle Search & Filter logic
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterLevel === 'All' || patient.triage === filterLevel;
      return matchesSearch && matchesFilter;
    });
  }, [patients, searchQuery, filterLevel]);

  // Critical waiting count calculation
  const criticalCount = useMemo(() => {
    return patients.filter(p => p.triage === 'Critical').length;
  }, [patients]);

  const showToast = (message: string, undoAction?: () => void) => {
    setToast({ message, action: undoAction });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleArchiveCase = (patientId: string) => {
    const patientToArchive = patients.find(p => p.id === patientId);
    if (!patientToArchive) return;

    // Filter out the archived patient
    setPatients(prev => prev.filter(p => p.id !== patientId));
    
    // Select the next patient if available
    const remaining = patients.filter(p => p.id !== patientId);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }

    showToast(`Case ${patientToArchive.id} (${patientToArchive.name}) archived.`, () => {
      setPatients(prev => [...prev, patientToArchive].sort((a, b) => b.time.localeCompare(a.time)));
      setSelectedId(patientToArchive.id);
    });
  };

  const handleScheduleFollowup = (patientName: string) => {
    showToast(`Immediate follow-up scheduled for ${patientName}.`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#070709] text-zinc-100 font-sans select-none overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161619] border border-zinc-800 rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-slide-in">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-sm font-medium text-zinc-200">{toast.message}</span>
          {toast.action && (
            <button 
              onClick={() => {
                toast.action?.();
                setToast(null);
              }}
              className="ml-3 text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 bg-violet-500/10 px-2 py-1 rounded"
            >
              <Undo className="w-3 h-3" /> Undo
            </button>
          )}
          <button 
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- Top Header --- */}
      <header className="h-16 border-b border-zinc-900 bg-[#08080a] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            MediScan AI <span className="text-zinc-500 font-normal">Triage Control</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 bg-red-950/60 border border-red-500/30 px-3.5 py-1.5 rounded-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase">
                {criticalCount} Critical {criticalCount === 1 ? 'Patient' : 'Patients'} Waiting
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-zinc-300">Dr. Alexander</div>
              <div className="text-[10px] text-zinc-500">Cardiology Specialist</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden relative group cursor-pointer">
              <div className="w-full h-full bg-gradient-to-tr from-violet-500 to-emerald-400 opacity-80" />
              <div className="absolute inset-0.5 rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                DA
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/25 text-red-500 text-xs font-bold transition-all cursor-pointer"
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

      {/* --- Main Content Layout --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- 1. Left Sidebar --- */}
        <aside className="w-64 bg-[#08080a] border-r border-zinc-950 flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3">
              Control Panel
            </div>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all bg-[#0fa585] text-zinc-950 shadow-md shadow-[#0fa585]/15 hover:brightness-110">
                <Clock className="w-4 h-4" />
                <span>Triage Queue</span>
              </button>
              
              <button 
                onClick={() => showToast("Patient Records view is locked to triage panel.")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Patient Records</span>
              </button>
              
              <button 
                onClick={() => showToast("Analytics view is locked to triage panel.")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-all"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              
              <button 
                onClick={() => showToast("Settings panel locked.")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* System status widget at sidebar bottom */}
          <div className="bg-[#090b10] border border-[#10b981]/15 rounded-lg p-3.5">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">System Status</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-bold text-[#10b981] tracking-wide">AI CORE ACTIVE</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </aside>

        {/* --- 2. Active Triage Queue (Center) --- */}
        <section className="flex-1 bg-[#0a0a0d] p-6 flex flex-col overflow-y-auto">
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Active Triage Queue</h2>
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] px-2 py-0.5 rounded-full font-medium">
                {filteredPatients.length} Total
              </span>
            </div>

            {/* Filter and Search Actions */}
            <div className="flex items-center gap-2 relative">
              
              {/* Dynamic Search Box Input */}
              {isSearchVisible && (
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient, symptoms..." 
                  className="bg-[#121215] border border-zinc-800 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 w-48 transition-all animate-fade-in"
                  autoFocus
                />
              )}

              {/* Search Toggle Button */}
              <button 
                onClick={() => {
                  setIsSearchVisible(!isSearchVisible);
                  if (isSearchVisible) setSearchQuery('');
                }}
                className={`p-2 rounded-md border transition-all ${
                  isSearchVisible || searchQuery 
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-700' 
                    : 'bg-[#121215] text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                title="Search patient queue"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Filter Level Dropdown Toggle */}
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`p-2 rounded-md border transition-all ${
                  filterLevel !== 'All' 
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-700' 
                    : 'bg-[#121215] text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                title="Filter by Triage Level"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* Filter Dropdown Panel */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 top-10 z-20 w-44 bg-[#121215] border border-zinc-800 rounded-md shadow-xl py-1 animate-fade-in">
                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-1.5 border-b border-zinc-850">
                    Filter Priority
                  </div>
                  {(['All', 'Critical', 'Urgent', 'Amber', 'Stable'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setFilterLevel(lvl);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-zinc-800/50 ${
                        filterLevel === lvl ? 'text-violet-400 font-bold bg-violet-500/5' : 'text-zinc-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Queue Cards */}
          <div className="space-y-3 flex-1">
            {filteredPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-900 rounded-xl p-8 text-center bg-[#09090b]">
                <ShieldAlert className="w-8 h-8 text-zinc-600 mb-2" />
                <p className="text-sm font-medium text-zinc-400">No active patient matching search criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterLevel('All');
                  }}
                  className="mt-3 text-xs text-violet-400 font-bold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = selectedId === patient.id;
                
                // Set color indicator based on triage level for left border
                const triageBorderColor = {
                  Critical: 'border-l-red-500',
                  Urgent: 'border-l-orange-500',
                  Amber: 'border-l-amber-500',
                  Stable: 'border-l-emerald-500',
                }[patient.triage];

                return (
                  <div 
                    key={patient.id}
                    onClick={() => setSelectedId(patient.id)}
                    className={`group flex items-center justify-between p-5 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? `bg-[#131316] border-zinc-800 ${triageBorderColor} border-l-[3px]` 
                        : 'bg-[#0b0c0f]/80 border-zinc-900 hover:bg-[#111114] hover:border-zinc-800'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 pr-6">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500">
                        <span>{patient.time}</span>
                        <span>•</span>
                        <span>{patient.id}</span>
                        <TriageBadge level={patient.triage} />
                      </div>
                      
                      <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors">
                        {patient.name}, {patient.age}
                      </h3>
                      
                      <p className="text-xs text-zinc-400 leading-normal line-clamp-1">
                        {patient.symptoms}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(patient.id);
                        }}
                        className="px-4 py-2 rounded-md bg-[#131316] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 text-xs font-semibold tracking-wide transition-all shadow-sm"
                      >
                        VIEW REPORT
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* --- 3. Patient Inspector Pane (Right) --- */}
        {selectedPatient && (
          <aside className="w-[450px] bg-[#08080a] border-l border-zinc-950 flex flex-col justify-between overflow-y-auto shrink-0">
            
            {/* Main inspector content */}
            <div className="p-6 space-y-6">
              
              {/* Patient header info */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">
                    {selectedPatient.name}, {selectedPatient.age}
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    Selected Case Detail
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-950/20 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <span className="text-base font-bold select-none">*</span>
                </div>
              </div>

              {/* AI Clinical Analysis */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>AI Clinical Analysis</span>
                </div>

                <div className="space-y-2">
                  {selectedPatient.analysis.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-[#121215] border border-zinc-850 rounded-lg p-3.5 flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Vitals Grid */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Real-time Vitals
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* Blood Pressure */}
                  <div className="bg-[#121215] border border-zinc-850 rounded-lg p-4">
                    <div className="text-[10px] text-zinc-500 font-medium">{selectedPatient.vitals.bloodPressure.label}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-zinc-100">{selectedPatient.vitals.bloodPressure.value}</span>
                      <span className="text-[10px] text-zinc-500">{selectedPatient.vitals.bloodPressure.unit}</span>
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div className="bg-[#121215] border border-zinc-850 rounded-lg p-4">
                    <div className="text-[10px] text-zinc-500 font-medium">{selectedPatient.vitals.heartRate.label}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-zinc-100">{selectedPatient.vitals.heartRate.value}</span>
                      <span className="text-[10px] text-zinc-500">{selectedPatient.vitals.heartRate.unit}</span>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="bg-[#121215] border border-zinc-850 rounded-lg p-4">
                    <div className="text-[10px] text-zinc-500 font-medium">{selectedPatient.vitals.spO2.label}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-lg font-bold ${
                        selectedPatient.vitals.spO2.status === 'critical' ? 'text-red-400' : 'text-zinc-100'
                      }`}>
                        {selectedPatient.vitals.spO2.value}
                      </span>
                      <span className="text-[10px] text-zinc-500">{selectedPatient.vitals.spO2.unit}</span>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="bg-[#121215] border border-zinc-850 rounded-lg p-4">
                    <div className="text-[10px] text-zinc-500 font-medium">{selectedPatient.vitals.temperature.label}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-zinc-100">{selectedPatient.vitals.temperature.value}</span>
                      <span className="text-[10px] text-zinc-500">{selectedPatient.vitals.temperature.unit}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => handleScheduleFollowup(selectedPatient.name)}
                  className="w-full py-3 px-4 rounded-lg bg-[#ccbeff] text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-[#b5a3ff] active:scale-[0.99] transition-all"
                >
                  Schedule Immediate Follow-up
                </button>
                <button 
                  onClick={() => handleArchiveCase(selectedPatient.id)}
                  className="w-full py-3 px-4 rounded-lg bg-transparent border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/20 text-zinc-200 font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all"
                >
                  Archive Case
                </button>
              </div>

            </div>

            {/* System Logs (Sticky Bottom of sidebar) */}
            <div className="border-t border-zinc-900 bg-[#08080a] p-6 space-y-3 mt-auto shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                System Log
              </div>
              <div className="bg-[#09090b] border border-zinc-850 rounded-lg p-4 font-mono text-[10px] space-y-2 leading-relaxed">
                {selectedPatient.logs.map((log, idx) => {
                  // Style syncing log in green
                  const isSyncingLog = log.includes('SYNCING') || log.includes('ACTIVE') || log.includes('COMPLETED');
                  return (
                    <div 
                      key={idx} 
                      className={isSyncingLog ? 'text-[#10b981] font-semibold' : 'text-zinc-400'}
                    >
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

          </aside>
        )}

      </div>
    </div>
  );
}
