import React from 'react';
import { FileText, MessageSquare, AlertTriangle, Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { Patient, Medication } from '@/types/doctor';
import { ScanReportViewer } from './ScanReportViewer';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface PatientInspectorProps {
  selectedPatient: Patient;
  setActiveView: (view: 'grid' | 'inspector') => void;
  bpChartType: 'SYS' | 'DIA';
  setBpChartType: (t: 'SYS' | 'DIA') => void;
  hoveredDayIdx: number | null;
  setHoveredDayIdx: (idx: number | null) => void;
  glucoseChartType: 'Glucose' | 'Calories';
  setGlucoseChartType: (t: 'Glucose' | 'Calories') => void;
  medications: Medication[];
  handleAddMedicine: () => void;
  handleEditMed: (idx: number) => void;
}

export const PatientInspector: React.FC<PatientInspectorProps> = ({
  selectedPatient,
  setActiveView,
  bpChartType,
  setBpChartType,
  hoveredDayIdx,
  setHoveredDayIdx,
  glucoseChartType,
  setGlucoseChartType,
  medications,
  handleAddMedicine,
  handleEditMed
}) => {
  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Row: Back link, Patient profile info, action buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.06] pb-5">
        
        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('grid')}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#635bff] hover:border-transparent text-zinc-400 hover:text-white transition-all outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" x2="5" y1="12" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={selectedPatient.avatarUrl} 
            alt={selectedPatient.name} 
            className="w-12 h-12 rounded-full object-cover border border-white/10"
          />
          
          <div>
            <h1 className="text-[20px] font-black text-white leading-tight">
              {selectedPatient.name}, {selectedPatient.age} y.o
            </h1>
            <p className="text-[11.5px] font-bold text-[#8c9ba5] mt-1">
              Patient ID: <span className="font-extrabold font-mono text-zinc-300 mr-2">{selectedPatient.id}</span> ·{' '}
              <span className="text-[#ff5050] font-black">{selectedPatient.symptoms}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Diagnostic Specialty Tag */}
          <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl bg-[#00ffb2]/5 border border-[#00ffb2]/20 text-[#00ffb2]">
            {selectedPatient.specialty} Case
          </span>

          <button 
            onClick={() => toast.info(`Accessing case timeline log for ${selectedPatient.name}...`)}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#161720] border border-white/[0.06] text-[12.5px] font-extrabold text-[#8c9ba5] hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            Story Deseas
          </button>

          <button 
            onClick={() => toast.success(`Telehealth consultation started with ${selectedPatient.name}!`)}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#635bff] text-[12.5px] font-extrabold text-white hover:bg-[#635bff]/90 transition-colors shadow-lg shadow-[#635bff]/20"
          >
            <MessageSquare className="w-4 h-4" />
            Open Dialog
          </button>
        </div>
      </div>

      {/* Dashboard Widgets Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR CONTAINER (8 cols) */}
        <div className="xl:col-span-7 space-y-6">

          {/* Vitals row: Pulse widget & mini widgets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Pulse / Apple watch ECG card (7 cols) */}
            <div className="glass-card p-6 md:col-span-7 flex flex-col justify-between min-h-[220px]" style={{
              background: 'linear-gradient(135deg, #1c1d26 0%, #161720 100%)'
            }}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8c9ba5]">Pulse</span>
                  <p className="text-[10.5px] text-[#8c9ba5]/60 font-bold mt-0.5">(Apple Watch Information)</p>
                </div>
                <div className="flex items-center gap-2 text-[#ff5050]">
                  <span className="text-[20px] font-black tracking-tight">{selectedPatient.vitals.heartRate.value}</span>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase leading-none">BPM</span>
                    <span className="text-[9px] font-black uppercase leading-none pulse-red-indicator mt-0.5">(+)</span>
                  </div>
                </div>
              </div>

              {/* ECG Canvas Path Grid */}
              <div className="h-[90px] relative w-full mt-4 flex items-center overflow-hidden" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)`,
                backgroundSize: '15px 15px'
              }}>
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  <defs>
                    <linearGradient id="pulseGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ff5050" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#ff5050" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ff5050" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  
                  <path 
                    d="M 0 30 L 20 30 L 30 30 Q 33 24 35 30 L 40 30 L 45 30 L 50 10 L 53 58 L 56 30 L 62 30 L 68 33 L 73 30 L 100 30 L 120 30 L 130 30 Q 133 24 135 30 L 140 30 L 145 30 L 150 10 L 153 58 L 156 30 L 162 30 L 168 33 L 173 30 L 200 30" 
                    fill="none" 
                    stroke="url(#pulseGlow)" 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="153" cy="58" r="3" fill="#ff5050" className="pulse-red-indicator" />
                </svg>
              </div>
            </div>

            {/* Right side vitals: Blood sugar & Daily walking (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {/* Blood Sugar */}
              <div className="glass-card p-4 flex flex-col justify-between min-h-[98px]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8c9ba5]">Blood Sugar</span>
                  <span className="text-[#ff5050] text-[10px] font-black uppercase tracking-widest leading-none pulse-red-indicator">(+)</span>
                </div>
                <div className="mt-2">
                  <p className="text-[17px] font-black text-white">99 <span className="text-[11.5px] font-semibold text-[#8c9ba5]">mg/dL</span></p>
                  <p className="text-[10px] text-[#00ffb2] font-extrabold uppercase tracking-wider mt-0.5">Normal Range</p>
                </div>
              </div>

              {/* Daily Walking */}
              <div className="glass-card p-4 flex flex-col justify-between min-h-[98px]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8c9ba5]">Daily Walking</span>
                  <span className="text-[#ff5050] text-[10px] font-black uppercase tracking-widest leading-none pulse-red-indicator">(+)</span>
                </div>
                <div className="mt-2">
                  <p className="text-[17px] font-black text-white">45/30 <span className="text-[11.5px] font-semibold text-[#8c9ba5]">M</span></p>
                  <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mt-0.5">-1333 KKL Burned</p>
                </div>
              </div>
            </div>

          </div>

          {/* Blood Pressure Line Chart (SYS / DIA) */}
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-3">
                {/* SYS / DIA pills */}
                <div className="flex bg-[#12131a] p-1 rounded-xl border border-white/[0.04]">
                  <button 
                    onClick={() => setBpChartType('SYS')}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 outline-none ${bpChartType === 'SYS' ? 'bg-[#635bff] text-white shadow' : 'text-[#8c9ba5] hover:text-white'}`}
                  >
                    SYS
                  </button>
                  <button 
                    onClick={() => setBpChartType('DIA')}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 outline-none ${bpChartType === 'DIA' ? 'bg-[#635bff] text-white shadow' : 'text-[#8c9ba5] hover:text-white'}`}
                  >
                    DIA
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[14px] font-black text-white">
                  Current:{' '}
                  <span className="text-[#ff5050]">
                    {bpChartType === 'SYS' 
                      ? selectedPatient.bpSysData[hoveredDayIdx ?? 2] 
                      : selectedPatient.bpDiaData[hoveredDayIdx ?? 2]
                    } mmHg
                  </span>
                </span>
              </div>
            </div>

            {/* SVG Line Graph */}
            <div className="h-[150px] w-full relative mt-2 flex items-end">
              <svg viewBox="0 0 350 100" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="0" y1="10" x2="350" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="35" x2="350" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="350" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="85" x2="350" y2="85" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                
                <path 
                  d={bpChartType === 'SYS' 
                    ? "M 25 10 L 75 10 L 125 35 L 175 35 L 225 85 L 275 85 L 325 20"
                    : "M 25 30 L 75 32 L 125 45 L 175 42 L 225 70 L 275 68 L 325 40"
                  }
                  fill="none" 
                  stroke="#ff5050" 
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Bullet data points */}
                {[
                  bpChartType === 'SYS' ? selectedPatient.bpSysData : selectedPatient.bpDiaData
                ].map((dataset) => (
                  DAYS.map((day, idx) => {
                    const x = 25 + idx * 50;
                    // Map value to SVG y coord (100 is max, so value range maps to y = 10 to 85)
                    const yMapSys = [10, 10, 35, 35, 85, 85, 20];
                    const yMapDia = [30, 32, 45, 42, 70, 68, 40];
                    const y = bpChartType === 'SYS' ? yMapSys[idx] : yMapDia[idx];
                    
                    const isHovered = hoveredDayIdx === idx;

                    return (
                      <g key={day} className="cursor-pointer" onMouseEnter={() => setHoveredDayIdx(idx)}>
                        {/* Glowing outer circle on hover */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r={isHovered ? 7 : 4} 
                          fill="#ff5050" 
                          opacity={isHovered ? 1 : 0.8}
                          className="transition-all duration-200"
                        />
                        {isHovered && (
                          <circle cx={x} cy={y} r={12} stroke="#ff5050" strokeWidth="1" fill="none" opacity="0.4" />
                        )}
                      </g>
                    );
                  })
                ))}

                {/* Tooltip display floating box (Tue matches x=125) */}
                {hoveredDayIdx !== null && (
                  <g transform={`translate(${25 + hoveredDayIdx * 50 - 45}, ${
                    (bpChartType === 'SYS' ? [10, 10, 35, 35, 85, 85, 20] : [30, 32, 45, 42, 70, 68, 40])[hoveredDayIdx] - 30
                  })`}>
                    <rect width="90" height="20" rx="6" fill="#ffffff" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))" />
                    <text x="45" y="13" fill="#0c0e12" fontSize="9.5" fontWeight="900" textAnchor="middle">
                      {(bpChartType === 'SYS' ? selectedPatient.bpSysData : selectedPatient.bpDiaData)[hoveredDayIdx]} mmHg
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Day labels row */}
            <div className="flex justify-between px-3.5 text-[#8c9ba5] text-[10.5px] font-bold">
              {DAYS.map((day, idx) => (
                <span 
                  key={day} 
                  className={`cursor-pointer transition-colors ${hoveredDayIdx === idx ? 'text-white font-extrabold' : ''}`}
                  onMouseEnter={() => setHoveredDayIdx(idx)}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR CONTAINER (4 cols) */}
        <div className="xl:col-span-5 space-y-6">

          {/* Calories & Glucose Monitor Bar Chart */}
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex bg-[#12131a] p-1 rounded-xl border border-white/[0.04]">
                <button 
                  onClick={() => setGlucoseChartType('Calories')}
                  className={`px-3 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 outline-none ${glucoseChartType === 'Calories' ? 'bg-[#635bff] text-white shadow' : 'text-[#8c9ba5] hover:text-white'}`}
                >
                  Calories
                </button>
                <button 
                  onClick={() => setGlucoseChartType('Glucose')}
                  className={`px-3 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 outline-none ${glucoseChartType === 'Glucose' ? 'bg-[#635bff] text-white shadow' : 'text-[#8c9ba5] hover:text-white'}`}
                >
                  Glucose Monitor
                </button>
              </div>
            </div>

            {/* Bar Chart Bars Sun to Sat */}
            <div className="h-[140px] w-full flex items-end justify-between px-1.5 relative border-b border-white/[0.05]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px)`,
              backgroundSize: '100% 25px'
            }}>
              {/* Y-axis metrics markers left aligned */}
              <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between text-[9px] font-black text-zinc-600 pointer-events-none pr-1">
                <span>&lt;3000</span>
                <span>2500</span>
                <span>2000</span>
                <span>1500</span>
                <span>&gt;1000</span>
              </div>

              {/* Chart Bars */}
              {(glucoseChartType === 'Glucose' ? selectedPatient.glucoseData : selectedPatient.caloriesData).map((val, idx) => {
                const pct = Math.min((val / 3000) * 100, 100);
                const isThursday = idx === 4;

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 z-10" style={{ height: '100%' }}>
                    <div className="flex-1 flex items-end w-full justify-center">
                      <div 
                        style={{ 
                          height: `${pct}%`, 
                          width: '13px', 
                          borderTopLeftRadius: '10px',
                          borderTopRightRadius: '10px',
                          background: isThursday 
                            ? 'linear-gradient(to top, #ff5050 0%, #ff7e7e 100%)' 
                            : 'linear-gradient(to top, #00ffc4 0%, #00b0ff 100%)',
                          boxShadow: isThursday
                            ? '0 0 10px rgba(255,80,80,0.2)'
                            : '0 0 10px rgba(0,255,196,0.1)'
                        }}
                        className="transition-all duration-700 ease-out hover:scale-x-125 cursor-pointer"
                        title={`${val} units`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day labels row */}
            <div className="flex justify-between px-3 text-[#8c9ba5] text-[10.5px] font-bold select-none">
              {DAYS.map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          {/* Patient's Receipt medications table */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
              <div>
                <span className="text-[12.5px] font-black text-white">Patient's Receipt</span>
                <p className="text-[9.5px] text-[#8c9ba5] mt-0.5">(Last updates from 21.12.23)</p>
              </div>
            </div>

            {/* Prescription Table */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 text-[10px] font-black uppercase tracking-wider text-[#8c9ba5] pb-1 border-b border-white/[0.03] px-2 select-none">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Dose</div>
                <div className="col-span-2">Period</div>
                <div className="col-span-2 text-right">Left</div>
                <div className="col-span-1" />
              </div>

              <div className="space-y-2">
                {medications.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-12 items-center bg-white/[0.01] hover:bg-white/[0.02] rounded-xl py-2.5 px-2 border border-white/[0.02] text-[11.5px]">
                    <div className="col-span-4 font-bold text-zinc-300">{med.name}</div>
                    <div className="col-span-3 text-zinc-400 font-semibold">{med.dose}</div>
                    <div className="col-span-2 text-zinc-400 font-semibold">{med.period}</div>
                    <div className="col-span-2 text-right font-black flex items-center justify-end gap-1.5">
                      {med.warning && (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ff5050]" />
                      )}
                      <span className={med.warning ? 'text-[#ff5050]' : 'text-zinc-400'}>{med.left}</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button 
                        onClick={() => handleEditMed(idx)}
                        className="text-zinc-500 hover:text-white transition-colors duration-200 outline-none"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add new medicine outlined button */}
            <button 
              onClick={handleAddMedicine}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/[0.12] hover:border-white/30 text-[11.5px] font-black text-zinc-400 hover:text-white transition-all duration-200 w-full outline-none mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              + Add new Medicine
            </button>
          </div>

        </div>

      </div>

      {/* Embedded interactive custom AI Scan Annotation Viewer */}
      {selectedPatient.scan && (
        <div className="mt-8">
          <ScanReportViewer scan={selectedPatient.scan} />
        </div>
      )}

    </div>
  );
};
