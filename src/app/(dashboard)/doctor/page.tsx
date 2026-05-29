"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Patient, Specialty, Medication } from '@/types/doctor';
import { MOCK_PATIENTS } from '@/lib/mockData';
import { DoctorSidebar } from '@/components/doctor/DoctorSidebar';
import { PatientsGrid } from '@/components/doctor/PatientsGrid';
import { PatientInspector } from '@/components/doctor/PatientInspector';

export default function DoctorDashboard() {
  // Navigation active view states
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'patients' | 'chats'>('patients');
  const [activeView, setActiveView] = useState<'grid' | 'inspector'>('grid');

  // Search & Filter & Routing Safety-valve Toggles
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<Specialty | 'All'>('All');
  
  // Doctor's Simulated Specialty Profile
  const [activeDoctorSpecialty, setActiveDoctorSpecialty] = useState<Specialty>('Cardiology');
  const [isSpecialtyFilterActive, setIsSpecialtyFilterActive] = useState<boolean>(true);

  // Detail View Active States
  const [bpChartType, setBpChartType] = useState<'SYS' | 'DIA'>('SYS');
  const [glucoseChartType, setGlucoseChartType] = useState<'Glucose' | 'Calories'>('Glucose');
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(2); // Default to Tue
  const [medications, setMedications] = useState<Medication[]>(MOCK_PATIENTS[0].medications);

  // Retrieve currently selected patient
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedId) || patients[0] || null;
  }, [patients, selectedId]);

  // Synchronize medications state when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      setMedications(selectedPatient.medications);
    }
  }, [selectedPatient]);

  // Filter queue based on searching + doctor specialty active safety-valve
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // 1. Search filter
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Specialty routing filter
      if (isSpecialtyFilterActive) {
        // State A: Filter strictly by doctor's simulated specialty
        return matchesSearch && patient.specialty === activeDoctorSpecialty;
      } else {
        // State B: Global hospital queue (show everyone, support manual category dropdown if selected)
        const matchesCategory = filterSpecialty === 'All' || patient.specialty === filterSpecialty;
        return matchesSearch && matchesCategory;
      }
    });
  }, [patients, searchQuery, isSpecialtyFilterActive, activeDoctorSpecialty, filterSpecialty]);

  const handleSignOut = async () => {
    try {
      console.log('[MediScan-Ai Doctor] Signing out...');
      toast.loading("Signing out...");
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error('[MediScan-Ai Doctor] Error signing out:', err);
      toast.error("Error signing out.");
    }
  };

  const handleAddMedicine = () => {
    const newMed: Medication = {
      name: 'Amoxicillin',
      dose: '500 mg/day',
      period: '10 days',
      left: '10 days left'
    };
    setMedications(prev => [...prev, newMed]);
    toast.success("Amoxicillin prescription added successfully.");
  };

  const handleEditMed = (idx: number) => {
    toast.info(`Editing prescription: ${medications[idx].name}`);
  };

  const handleAddNewPatient = () => {
    toast.info("Patient registration dialog simulation activated.");
  };

  return (
    <div className="min-h-screen flex bg-[#0c0e12] text-white font-sans antialiased overflow-x-hidden selection:bg-[#635bff]/30 selection:text-white" style={{
      backgroundImage: `radial-gradient(circle at 75% 25%, rgba(99,91,255,0.04) 0%, transparent 40%),
                        radial-gradient(circle at 10% 80%, rgba(0,255,178,0.02) 0%, transparent 35%)`
    }}>
      {/* Global CSS Inject */}
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-sidebar {
          background: #14151e;
          border-right: 1px solid rgba(255,255,255,0.06);
          box-shadow: 10px 0 40px rgba(0,0,0,0.5);
        }
        .glass-card {
          background: #161720;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 15px 40px rgba(0,0,0,0.5);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .pulse-red-indicator {
          animation: pulse-red 2s infinite ease-in-out;
        }
        .btn-active-purple {
          background: #635bff;
          box-shadow: 0 4px 15px rgba(99,91,255,0.4);
          color: white;
        }
      ` }} />

      <DoctorSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setActiveView={setActiveView}
        activeDoctorSpecialty={activeDoctorSpecialty}
        handleSignOut={handleSignOut}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto custom-scrollbar p-8">
        {activeView === 'grid' && (
          <PatientsGrid 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSpecialtyFilterActive={isSpecialtyFilterActive}
            setIsSpecialtyFilterActive={setIsSpecialtyFilterActive}
            activeDoctorSpecialty={activeDoctorSpecialty}
            filterSpecialty={filterSpecialty}
            setFilterSpecialty={setFilterSpecialty}
            handleAddNewPatient={handleAddNewPatient}
            filteredPatients={filteredPatients}
            setSelectedId={setSelectedId}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'inspector' && selectedPatient && (
          <PatientInspector 
            selectedPatient={selectedPatient}
            setActiveView={setActiveView}
            bpChartType={bpChartType}
            setBpChartType={setBpChartType}
            hoveredDayIdx={hoveredDayIdx}
            setHoveredDayIdx={setHoveredDayIdx}
            glucoseChartType={glucoseChartType}
            setGlucoseChartType={setGlucoseChartType}
            medications={medications}
            handleAddMedicine={handleAddMedicine}
            handleEditMed={handleEditMed}
          />
        )}
      </div>
    </div>
  );
}
