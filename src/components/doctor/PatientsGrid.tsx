import React from 'react';
import { Search, SlidersHorizontal, Activity, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Patient, Specialty } from '@/types/doctor';

interface PatientsGridProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSpecialtyFilterActive: boolean;
  setIsSpecialtyFilterActive: (active: boolean) => void;
  activeDoctorSpecialty: Specialty;
  filterSpecialty: Specialty | 'All';
  setFilterSpecialty: (spec: Specialty | 'All') => void;
  handleAddNewPatient: () => void;
  filteredPatients: Patient[];
  setSelectedId: (id: string) => void;
  setActiveView: (view: 'grid' | 'inspector') => void;
}

export const PatientsGrid: React.FC<PatientsGridProps> = ({
  searchQuery,
  setSearchQuery,
  isSpecialtyFilterActive,
  setIsSpecialtyFilterActive,
  activeDoctorSpecialty,
  filterSpecialty,
  setFilterSpecialty,
  handleAddNewPatient,
  filteredPatients,
  setSelectedId,
  setActiveView,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header: Search + Specialty Filter Segmented controls + Safety Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 select-none">
        {/* Left Search Bar capsule */}
        <div className="flex items-center gap-3 bg-[#161720] border border-white/[0.06] px-4 py-2.5 rounded-2xl min-w-[320px] focus-within:border-[#635bff]/40 transition-colors">
          <Search className="w-4.5 h-4.5 text-[#8c9ba5]" />
          <input 
            type="text" 
            placeholder="Query patient, symptoms, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[13.5px] text-white w-full placeholder-[#8c9ba5]/60"
          />
          <button className="text-zinc-500 hover:text-white transition-colors duration-200">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Center: AI-Driven Specialty Routing Panel (Safety-Valve Toggle) */}
        <div className="flex items-center gap-4 bg-[#14151e] border border-white/[0.05] p-1.5 rounded-2xl shadow-xl">
          {/* Router Label badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <Activity className="w-3.5 h-3.5 text-[#00ffb2]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8c9ba5]">AI Route Feed:</span>
          </div>

          {/* Segmented Safety-Valve Toggles */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                setIsSpecialtyFilterActive(true);
                toast.success(`Showing only ${activeDoctorSpecialty} Triage feed!`);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all duration-200 outline-none ${isSpecialtyFilterActive ? 'bg-[#635bff] text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              My Specialty ({activeDoctorSpecialty})
            </button>

            <button 
              onClick={() => {
                setIsSpecialtyFilterActive(false);
                toast.info("Switched to Global Hospital Queue!");
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all duration-200 outline-none ${!isSpecialtyFilterActive ? 'bg-[#635bff] text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              Global Hospital Feed
            </button>
          </div>
        </div>

        {/* Right Add Patient Button */}
        <button 
          onClick={handleAddNewPatient}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#0c0e12] font-black text-[13px] hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-white/5"
        >
          <Plus className="w-4 h-4" />
          Add new Patient
        </button>
      </div>

      {/* Specialty Manual Filter Row (Visible only when Global Feed is active) */}
      {!isSpecialtyFilterActive && (
        <div className="flex items-center gap-2 animate-slide-in">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8c9ba5] mr-2">Filter Specialty:</span>
          {(['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology'] as const).map(spec => (
            <button
              key={spec}
              onClick={() => setFilterSpecialty(spec)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black border transition-all duration-200 ${filterSpecialty === spec ? 'bg-[#00ffb2]/10 border-[#00ffb2]/30 text-[#00ffb2]' : 'border-white/[0.05] bg-white/[0.01] text-zinc-400 hover:text-white hover:border-white/10'}`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}

      {/* Patients Cards Grid Container */}
      <div className="space-y-4">
        <h2 className="text-[18px] font-black tracking-tight text-white flex items-center gap-2 select-none">
          Clinical Triage Inflow
          <span className="text-[11.5px] px-2.5 py-0.5 rounded-full bg-[#635bff]/10 border border-[#635bff]/25 text-[#635bff] font-bold">
            {filteredPatients.length} Triaged
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            /* Stacked Styled Card */
            <div 
              key={patient.id}
              onClick={() => {
                setSelectedId(patient.id);
                setActiveView('inspector');
              }}
              className="relative group cursor-pointer"
            >
              {/* Visual Card-Stack Background Layers */}
              <div className="absolute inset-0 bg-[#161720]/40 rounded-3xl translate-y-2.5 scale-[0.96] border border-white/[0.02] shadow-2xl -z-10 transition-transform group-hover:translate-y-3.5" />
              <div className="absolute inset-0 bg-[#161720]/80 rounded-3xl translate-y-1.5 scale-[0.98] border border-white/[0.03] shadow-xl -z-10 transition-transform group-hover:translate-y-2" />

              {/* Main Active Card */}
              <div className="glass-card p-6 flex flex-col justify-between min-h-[170px] relative z-10">
                
                {/* Top Row: Avatar + Name + Specialty Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={patient.avatarUrl} 
                      alt={patient.name} 
                      className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-lg"
                    />
                    <div>
                      <h3 className="text-[14px] font-extrabold text-white group-hover:text-[#635bff] transition-colors">{patient.name}</h3>
                      <p className="text-[11px] text-[#8c9ba5] font-semibold mt-0.5">{patient.age} y.o · {patient.gender}</p>
                    </div>
                  </div>

                  {/* Three Dots Action dropdown trigger */}
                  <button className="text-zinc-500 hover:text-white transition-colors duration-200 outline-none p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>

                {/* Middle Row: Symptoms Tagline */}
                <p className="text-[11.5px] text-[#8c9ba5]/80 font-medium leading-relaxed my-3.5 truncate">
                  {patient.symptoms}
                </p>

                {/* Bottom Row: Normal Pulse & Normal Pressure + Specialty Badge & Chat */}
                <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.04]">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[9px] font-black text-[#8c9ba5] uppercase tracking-wider">Pulse</p>
                      <p className="text-[12.5px] font-black text-[#00ffb2] mt-0.5">{patient.vitals.heartRate.value} BPM</p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-[#8c9ba5] uppercase tracking-wider">Pressure</p>
                      <p className="text-[12.5px] font-black text-white mt-0.5">{patient.vitals.bloodPressure.value}</p>
                    </div>
                  </div>

                  {/* Specialty Routing Tag and Chat bubble */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider bg-white/[0.03] border border-white/[0.06] text-zinc-400`}>
                      {patient.specialty}
                    </span>

                    <div className="relative">
                      <button className="text-[#8c9ba5] hover:text-white transition-colors duration-200 outline-none p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {patient.hasUnreadMessage && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ff5050] pulse-red-indicator" />
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
