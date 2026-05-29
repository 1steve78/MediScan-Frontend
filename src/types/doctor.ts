export type TriageLevel = 'Critical' | 'Urgent' | 'Amber' | 'Stable';
export type Specialty = 'Cardiology' | 'Neurology' | 'Orthopedics' | 'Dermatology' | 'General Practice';

export interface Vital {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export interface AnomalyRegion {
  label: string;
  probability: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface DifferentialDiagnosis {
  condition: string;
  probability: number;
}

export interface ScanRecord {
  imageUrl: string;
  scanType: string;
  overallImpression: string;
  confidenceScore: number;
  anomalyRegions: AnomalyRegion[];
  differentialDiagnoses: DifferentialDiagnosis[];
}

export interface Medication {
  name: string;
  dose: string;
  period: string;
  left: string;
  warning?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  time: string;
  symptoms: string;
  triage: TriageLevel;
  specialty: Specialty;
  vitals: {
    bloodPressure: Vital;
    heartRate: Vital;
    spO2: Vital;
    temperature: Vital;
  };
  analysis: string[];
  logs: string[];
  scan?: ScanRecord;
  medications: Medication[];
  glucoseData: number[]; // Sun to Sat values
  caloriesData: number[]; // Sun to Sat values
  bpSysData: number[]; // Sun to Sat SYS
  bpDiaData: number[]; // Sun to Sat DIA
  avatarUrl: string;
  hasUnreadMessage?: boolean;
}
