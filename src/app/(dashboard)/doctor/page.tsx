"use client";

import React, { useState } from 'react';
import { 
  AlertCircle, 
  Clock, 
  Activity, 
  ChevronRight, 
  ShieldAlert, 
  Thermometer, 
  HeartPulse, 
  Droplets,
  Zap,
  User,
  Search
} from 'lucide-react';

// --- Types ---
type TriageLevel = 'Critical' | 'High' | 'Medium' | 'Low';

interface Vital {
  label: string;
  value: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  time: string;
  symptoms: string;
  triage: TriageLevel;
  summary: string[];
  vitals: Vital[];
}

// --- Mock Data ---
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'BB219',
    name: 'Sarah Jenkins',
    age: 54,
    gender: 'Female',
    time: '08:42 AM • 14m ago',
    symptoms: 'Shortness of breath, acute chest pain',
    triage: 'Critical',
    summary: [
      'High probability of Acute Coronary Syndrome based on reported pain duration and peripheral signs.',
      'ECG telemetry indicates intermittent ST-segment elevation in V2–V4.',
      'Respiratory rate is elevated (26 bpm) with oxygen saturation at 91% on room air.',
      'Immediate intervention required: Rule out STEMI and initiate O2 protocol.'
    ],
    vitals: [
      { label: 'Troponin-I Levels', value: 'PENDING (Urgent)', status: 'pending' },
      { label: 'WBC Count', value: '14.2 (Abnormal High)', status: 'abnormal' },
      { label: 'Blood Pressure', value: '135/105 mmHg', status: 'critical' },
      { label: 'Pulse Rate', value: '112 bpm (Tachy)', status: 'critical' },
    ]
  },
  {
    id: 'MT442',
    name: 'Mark Thompson',
    age: 42,
    gender: 'Male',
    time: '08:55 AM • 1m ago',
    symptoms: 'Severe abdominal pain, nausea',
    triage: 'High',
    summary: [
      'Localized tenderness in lower right quadrant.',
      'Positive Rebound tenderness observed during initial screening.',
      'Elevated temperature (38.9°C) suggesting active inflammatory response.',
    ],
    vitals: [
      { label: 'WBC Count', value: '18.5 (High)', status: 'critical' },
      { label: 'Temp', value: '38.9°C', status: 'abnormal' },
      { label: 'BP', value: '120/80 mmHg', status: 'normal' },
    ]
  },
  {
    id: 'ER901',
    name: 'Elena Rodriguez',
    age: 29,
    gender: 'Female',
    time: '08:10 AM • 46m ago',
    symptoms: 'Laceration (Left hand), moderate bleeding',
    triage: 'Medium',
    summary: [
      '3cm deep laceration on the dorsal aspect of the left hand.',
      'Controlled bleeding with pressure, peripheral sensation remains intact.',
      'Requires suturing and Tetanus status verification.',
    ],
    vitals: [
      { label: 'Heart Rate', value: '88 bpm', status: 'normal' },
      { label: 'O2 Sat', value: '99%', status: 'normal' },
    ]
  },
  {
    id: 'JW332',
    name: 'James Wilson',
    age: 67,
    gender: 'Male',
    time: '07:30 AM • 1.5h ago',
    symptoms: 'Persistent cough, mild fever (38.1°C)',
    triage: 'Low',
    summary: [
      'Symptoms consistent with upper respiratory infection.',
      'Stable vitals, clear lung sounds on preliminary triage.',
      'No signs of respiratory distress.',
    ],
    vitals: [
      { label: 'Temp', value: '38.1°C', status: 'normal' },
      { label: 'O2 Sat', value: '97%', status: 'normal' },
    ]
  }
];

// --- Sub-Components ---

const TriageBadge = ({ level }: { level: TriageLevel }) => {
  const styles = {
    Critical: "bg-red-500/10 text-red-500 border-red-500/20",
    High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[level]}`}>
      {level}
    </span>
  );
};

export default function DoctorDashboard() {
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0].id);
  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedId) || MOCK_PATIENTS[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">MediScan AI <span className="text-zinc-500 font-normal">Triage System</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-red-500 tracking-wide uppercase">1 Critical Waiting</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-500" />
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100-4rem)]">
        {/* Left Pane: Queue */}
        <section className="w-[70%] p-6 overflow-y-auto border-r border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4" />
              <h2 className="text-sm font-medium uppercase tracking-widest">Live Queue</h2>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search patient..." 
                className="bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              <div className="col-span-3">Patient / Time</div>
              <div className="col-span-5">Primary Symptoms</div>
              <div className="col-span-2 text-center">Triage</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="space-y-1">
              {MOCK_PATIENTS.map((patient) => (
                <div 
                  key={patient.id}
                  onClick={() => setSelectedId(patient.id)}
                  className={`grid grid-cols-12 items-center px-4 py-4 rounded-lg border transition-all cursor-pointer group ${
                    selectedId === patient.id 
                    ? 'bg-zinc-900 border-zinc-700 ring-1 ring-violet-500/20' 
                    : 'bg-zinc-950 border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'
                  }`}
                >
                  <div className="col-span-3">
                    <div className="font-semibold text-sm group-hover:text-violet-400 transition-colors">{patient.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{patient.time}</div>
                  </div>
                  <div className="col-span-5 text-sm text-zinc-300">
                    {patient.symptoms}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <TriageBadge level={patient.triage} />
                  </div>
                  <div className="col-span-2 text-right">
                    <button className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-100 flex items-center gap-1 ml-auto transition-all">
                      Review Insights <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Pane: AI Inspector */}
        <aside className="w-[30%] bg-zinc-950 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-violet-500/10 rounded">
                <Zap className="w-4 h-4 text-violet-500" />
              </div>
              <h2 className="text-sm font-semibold">AI Clinical Report</h2>
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded tracking-tighter">
              Auto-Gen
            </span>
          </div>

          {/* Patient Profile Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User className="w-6 h-6 text-zinc-500" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{selectedPatient.name}</h3>
              <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">
                Case#{selectedPatient.id} • Age {selectedPatient.age} • {selectedPatient.gender}
              </p>
            </div>
          </div>

          {/* AI Analysis Summary */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <div className="pl-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Analysis Summary</h4>
              </div>
              <ul className="space-y-4">
                {selectedPatient.summary.map((point, idx) => (
                  <li key={idx} className="text-xs leading-relaxed text-zinc-300 relative pl-4">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-zinc-700 rounded-full" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extracted Vitals/Flags */}
          <div className="mb-8">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">Extracted Flags</h4>
             <div className="space-y-2">
                {selectedPatient.vitals.map((vital, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3">
                    <span className="text-[11px] text-zinc-400">{vital.label}</span>
                    <span className={`text-[11px] font-bold ${
                      vital.status === 'critical' ? 'text-red-400' : 
                      vital.status === 'abnormal' ? 'text-orange-400' : 
                      vital.status === 'pending' ? 'text-zinc-500 italic' :
                      'text-emerald-400'
                    }`}>
                      {vital.value}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold py-2.5 rounded-lg transition-all border border-zinc-700">
              Request Labs
            </button>
            <button className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-violet-500/20">
              Assign Physician
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
