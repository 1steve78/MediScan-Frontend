import React from 'react';
import { Home, Calendar as CalendarIcon, Users, MessageSquare, Lock } from 'lucide-react';
import { Specialty } from '@/types/doctor';

interface DoctorSidebarProps {
  activeTab: 'home' | 'calendar' | 'patients' | 'chats';
  setActiveTab: (tab: 'home' | 'calendar' | 'patients' | 'chats') => void;
  setActiveView: (view: 'grid' | 'inspector') => void;
  activeDoctorSpecialty: Specialty;
  handleSignOut: () => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeTab,
  setActiveTab,
  setActiveView,
  activeDoctorSpecialty,
  handleSignOut,
}) => {
  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col glass-sidebar min-h-screen px-5 py-6 justify-between select-none">
      {/* Top Section */}
      <div className="space-y-8">
        {/* Logo & Collapse */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#635bff] to-[#00ffb2] flex items-center justify-center shadow-lg shadow-[#635bff]/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <span className="text-[17px] font-extrabold tracking-tight">
              MediScan <span className="text-[#00ffb2]">AI</span>
            </span>
          </div>
          
          {/* Collapse Trigger icon */}
          <button className="text-zinc-500 hover:text-white transition-colors duration-200 outline-none p-1.5 rounded-lg hover:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
            </svg>
          </button>
        </div>

        {/* Active Doctor Profile */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120" 
            alt="M.D. Yoshida" 
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
          <div className="min-w-0">
            <h4 className="text-[12.5px] font-bold text-white leading-tight truncate">M.D. Yoshida</h4>
            <p className="text-[10px] font-extrabold text-[#00ffb2] uppercase tracking-wider mt-0.5">{activeDoctorSpecialty} Specialist</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => { setActiveTab('home'); setActiveView('grid'); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[13.5px] font-extrabold transition-all duration-200 outline-none w-full text-left ${activeTab === 'home' ? 'btn-active-purple' : 'text-[#8c9ba5] hover:text-white hover:bg-white/5'}`}
          >
            <Home className="w-5 h-5" />
            Home Feed
          </button>

          <button 
            onClick={() => { setActiveTab('calendar'); setActiveView('grid'); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[13.5px] font-extrabold transition-all duration-200 outline-none w-full text-left ${activeTab === 'calendar' ? 'btn-active-purple' : 'text-[#8c9ba5] hover:text-white hover:bg-white/5'}`}
          >
            <CalendarIcon className="w-5 h-5" />
            Calendar
          </button>

          <button 
            onClick={() => { setActiveTab('patients'); setActiveView('grid'); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[13.5px] font-extrabold transition-all duration-200 outline-none w-full text-left ${activeTab === 'patients' ? 'btn-active-purple' : 'text-[#8c9ba5] hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" />
            Patients Feed
          </button>

          <button 
            onClick={() => { setActiveTab('chats'); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[13.5px] font-extrabold transition-all duration-200 outline-none w-full text-left ${activeTab === 'chats' ? 'btn-active-purple' : 'text-[#8c9ba5] hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Clinical Chats
          </button>
        </nav>
      </div>

      {/* Bottom Section - Upcoming Visits */}
      <div className="space-y-4">
        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.04] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8c9ba5]">Upcoming Visits</span>
            <span className="w-2 h-2 rounded-full bg-[#00ffb2] animate-pulse" />
          </div>
          
          {/* Appointment row 1 */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-violet-400">Mon, 22 · 1:00 PM</p>
            <h5 className="text-[12px] font-bold text-white leading-tight">Gina Valentine</h5>
          </div>

          {/* Appointment row 2 */}
          <div className="space-y-1 pt-2 border-t border-white/[0.05]">
            <p className="text-[10px] font-black text-violet-400">Mon, 22 · 2:30 PM</p>
            <h5 className="text-[12px] font-bold text-white leading-tight">Martha Holberg</h5>
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl text-[12px] font-extrabold border border-white/[0.05] hover:border-red-500/30 hover:bg-red-500/5 text-[#8c9ba5] hover:text-red-400 transition-all duration-200 w-full outline-none"
        >
          <Lock className="w-4 h-4" />
          Lock Workspace
        </button>
      </div>
    </div>
  );
};
