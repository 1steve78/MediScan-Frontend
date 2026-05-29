import { Patient } from '@/types/doctor';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'IPX-882',
    name: 'Cesar Alvarez',
    age: 41,
    gender: 'Male',
    time: '14:22',
    symptoms: 'Severe respiratory distress; sudden onset chest pain.',
    triage: 'Critical',
    specialty: 'Cardiology',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: false,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '143/90', unit: 'mmHg', status: 'abnormal' },
      heartRate: { label: 'Heart Rate', value: '122', unit: 'bpm', status: 'critical' },
      spO2: { label: 'SpO2', value: '93', unit: '%', status: 'critical' },
      temperature: { label: 'Temperature', value: '101.4', unit: '°F', status: 'abnormal' }
    },
    analysis: [
      'Heart rate severely elevated at 122 BPM with myocardial ischemia signs.',
      'SPO2 levels trending downwards (4% drop in last 15 mins).',
      'ECG pattern shows ST-segment abnormalities consistent with ischemia.',
      'Recommendation: Immediate Cardiology consult, telemetry monitoring, and Troponin assay.'
    ],
    logs: [
      '[14:23] AI ANALYSIS COMPLETE: IPX-882',
      '[14:22] SYNCING ECG STREAM - CHANNEL A',
      '[14:21] PHYSICIAN ACCESSED FILE: DR_YOSHIDA'
    ],
    medications: [
      { name: 'Dobutamine', dose: '25 mg/day', period: '2 month', left: '7 days left' },
      { name: 'Dopamine', dose: '25 mg/day', period: '1 week', left: '2 days left', warning: true },
      { name: 'Dopexamine', dose: '225 mg/day', period: '1 year', left: '7 months left' }
    ],
    glucoseData: [1500, 2100, 1700, 2000, 2700, 2400, 2100],
    caloriesData: [1800, 2400, 2000, 2200, 2900, 2700, 2300],
    bpSysData: [160, 160, 126, 126, 100, 100, 146],
    bpDiaData: [95, 95, 84, 84, 70, 70, 90],
    scan: {
      imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800',
      scanType: 'X-Ray',
      overallImpression: 'Acute left lower lobe consolidation consistent with lobar pneumonia; bilateral pleural effusion noted.',
      confidenceScore: 0.96,
      anomalyRegions: [
        { label: 'Lobar Consolidation', probability: 0.93, severity: 'critical', x: 0.54, y: 0.36, width: 0.31, height: 0.33, description: 'Dense left lower lobe opacification — acute bacterial pneumonia consolidation.' },
        { label: 'Pleural Effusion', probability: 0.81, severity: 'high', x: 0.57, y: 0.67, width: 0.28, height: 0.19, description: 'Blunting of left costophrenic angle indicating pleural fluid accumulation.' }
      ],
      differentialDiagnoses: [
        { condition: 'Community-Acquired Pneumonia', probability: 0.78 },
        { condition: 'Pulmonary Edema', probability: 0.11 },
        { condition: 'Pleural Effusion (Isolated)', probability: 0.07 },
        { condition: 'Lung Abscess', probability: 0.04 }
      ]
    }
  },
  {
    id: 'IPX-220',
    name: 'Gina Valentine',
    age: 24,
    gender: 'Female',
    time: '14:10',
    symptoms: 'Shortness of breath; mild chest tightness and palpitation.',
    triage: 'Urgent',
    specialty: 'Cardiology',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: false,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '120/60', unit: 'mmHg', status: 'normal' },
      heartRate: { label: 'Heart Rate', value: '119', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '96', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal' }
    },
    analysis: [
      'Sinus tachycardia confirmed at 119 BPM.',
      'SPO2 levels stable at 96% on room air.',
      'No critical ST segment elevation detected.',
      'Recommendation: Outpatient cardiology review, Holter monitor analysis.'
    ],
    logs: [
      '[14:11] ST-SEGMENT EVALUATION ASSIGNED',
      '[14:10] PATIENT LOGGED VIA PATIENT_PORTAL'
    ],
    medications: [
      { name: 'Metoprolol', dose: '25 mg/day', period: '6 month', left: '14 days left' }
    ],
    glucoseData: [1200, 1400, 1600, 1300, 1900, 1700, 1500],
    caloriesData: [1600, 1800, 2100, 1900, 2300, 2000, 1800],
    bpSysData: [120, 122, 118, 120, 125, 122, 120],
    bpDiaData: [60, 62, 58, 60, 65, 62, 60],
  },
  {
    id: 'IPX-310',
    name: 'Andy Larkin',
    age: 26,
    gender: 'Male',
    time: '13:58',
    symptoms: 'Post-operative orthopedic review; joint swelling and restricted range of motion.',
    triage: 'Urgent',
    specialty: 'Orthopedics',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: false,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '136/48', unit: 'mmHg', status: 'abnormal' },
      heartRate: { label: 'Heart Rate', value: '120', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '98', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '99.4', unit: '°F', status: 'normal' }
    },
    analysis: [
      'Joint effusion detected in Medial joint capsule.',
      'Slight narrow margin inside lateral tibial plateau.',
      'Suspected grade 1 collateral sprain.'
    ],
    logs: [
      '[13:59] POST-OP SCREEN GENERATED',
      '[13:58] WORKSPACE ACCESS FROM ORTHO_DEPT'
    ],
    medications: [
      { name: 'Ibuprofen', dose: '400 mg/twice a day', period: '2 weeks', left: '3 days left' }
    ],
    glucoseData: [1400, 1800, 1600, 2000, 2200, 1900, 1700],
    caloriesData: [2000, 2200, 2400, 2100, 2600, 2300, 2100],
    bpSysData: [136, 134, 138, 136, 140, 135, 136],
    bpDiaData: [48, 50, 46, 48, 52, 50, 48],
  },
  {
    id: 'IPX-440',
    name: 'Eddie Gretten',
    age: 32,
    gender: 'Male',
    time: '13:45',
    symptoms: 'Suspected shoulder tendon puncture; severe pain following accidental crush injury.',
    triage: 'Urgent',
    specialty: 'Orthopedics',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: false,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '150/61', unit: 'mmHg', status: 'abnormal' },
      heartRate: { label: 'Heart Rate', value: '125', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '97', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.9', unit: '°F', status: 'normal' }
    },
    analysis: [
      'Severe micro-fracture localized around humeral head.',
      'Soft tissue swelling and tendon displacement observed.'
    ],
    logs: [
      '[13:46] EXTREMITY ANALYSIS RESOLVED',
      '[13:45] ADMITTED VIA ORTHOPEDIC INGEST'
    ],
    medications: [
      { name: 'Tramadol', dose: '50 mg/as needed', period: '1 week', left: '1 day left', warning: true }
    ],
    glucoseData: [1100, 1300, 1500, 1400, 1700, 1600, 1300],
    caloriesData: [1900, 2000, 2200, 2100, 2400, 2200, 1900],
    bpSysData: [150, 148, 152, 150, 155, 151, 150],
    bpDiaData: [61, 63, 59, 61, 66, 63, 61],
  },
  {
    id: 'IPX-550',
    name: 'Aubree Nelson',
    age: 21,
    gender: 'Female',
    time: '13:30',
    symptoms: 'Migraine onset with visual aura; history of focal seizure.',
    triage: 'Amber',
    specialty: 'Neurology',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: true,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '130/40', unit: 'mmHg', status: 'abnormal' },
      heartRate: { label: 'Heart Rate', value: '124', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '99', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.4', unit: '°F', status: 'normal' }
    },
    analysis: [
      'Suspected focal signal hyperintensity in left temporal lobe.',
      'Recommendation: Electroencephalography (EEG) and brain MRI study.'
    ],
    logs: [
      '[13:32] NEURO DIAGNOSTIC TRIGGERED',
      '[13:30] EMERGENCY TRIAGE INTAKE DONE'
    ],
    medications: [
      { name: 'Sumatriptan', dose: '50 mg/at aura onset', period: '1 month', left: '21 days left' }
    ],
    glucoseData: [1000, 1200, 1100, 1300, 1400, 1200, 1100],
    caloriesData: [1500, 1600, 1800, 1700, 1900, 1700, 1600],
    bpSysData: [130, 128, 132, 130, 135, 131, 130],
    bpDiaData: [40, 42, 38, 40, 45, 42, 40],
    scan: {
      imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
      scanType: 'MRI',
      overallImpression: 'Mild chronic microvascular ischemic white matter changes in the left temporal region.',
      confidenceScore: 0.87,
      anomalyRegions: [
        { label: 'Microvascular Changes', probability: 0.86, severity: 'medium', x: 0.26, y: 0.30, width: 0.20, height: 0.20, description: 'T2 hyperintensity in left temporal white matter — chronic microvascular ischemia.' },
        { label: 'Periventricular Signal', probability: 0.61, severity: 'low', x: 0.43, y: 0.39, width: 0.15, height: 0.13, description: 'Periventricular signal abnormality consistent with small vessel disease.' }
      ],
      differentialDiagnoses: [
        { condition: 'Chronic Microvascular Ischemia', probability: 0.72 },
        { condition: 'Early Demyelination', probability: 0.15 },
        { condition: 'Normal Age-Related Changes', probability: 0.08 }
      ]
    }
  },
  {
    id: 'IPX-660',
    name: 'Vanessa Sky',
    age: 29,
    gender: 'Female',
    time: '13:15',
    symptoms: 'Left temporal numbness; mild cognitive delay and speech coordination gaps.',
    triage: 'Amber',
    specialty: 'Neurology',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: false,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '118/55', unit: 'mmHg', status: 'normal' },
      heartRate: { label: 'Heart Rate', value: '128', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '98', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal' }
    },
    analysis: [
      'Language processing assessment shows minor delay markers.',
      'Vascular parameters normal. Review temporal cerebral blood flow.'
    ],
    logs: [
      '[13:17] SPEECH DISPATCH ASSIGNED',
      '[13:15] LOG INGESTED VIA CLINIC_PORTAL'
    ],
    medications: [
      { name: 'Clopidogrel', dose: '75 mg/day', period: '1 year', left: '11 months left' }
    ],
    glucoseData: [1200, 1100, 1300, 1500, 1600, 1400, 1300],
    caloriesData: [1700, 1600, 1800, 2000, 2100, 1900, 1800],
    bpSysData: [118, 116, 120, 118, 122, 119, 118],
    bpDiaData: [55, 57, 53, 55, 60, 57, 55],
  },
  {
    id: 'IPX-770',
    name: 'Jotun Arrakin',
    age: 41,
    gender: 'Male',
    time: '12:45',
    symptoms: 'Routine check-up; general health assessment and metabolic screening.',
    triage: 'Stable',
    specialty: 'General Practice',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: false,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '110/60', unit: 'mmHg', status: 'normal' },
      heartRate: { label: 'Heart Rate', value: '121', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '99', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.0', unit: '°F', status: 'normal' }
    },
    analysis: [
      'General physical metrics conform fully to nominal parameters.',
      'Recommendation: Review blood chemistry results in 48 hours.'
    ],
    logs: [
      '[12:46] GENERAL SCREENING ARCHIVED',
      '[12:45] REGULAR APPOINTMENT CHECKIN'
    ],
    medications: [
      { name: 'Daily Vitamin D3', dose: '2000 IU/day', period: 'Ongoing', left: '25 days left' }
    ],
    glucoseData: [900, 950, 1000, 920, 1100, 1050, 980],
    caloriesData: [1400, 1450, 1500, 1420, 1600, 1550, 1480],
    bpSysData: [110, 112, 108, 110, 115, 112, 110],
    bpDiaData: [60, 62, 58, 60, 65, 62, 60],
  },
  {
    id: 'IPX-880',
    name: 'Martha Holberg',
    age: 24,
    gender: 'Female',
    time: '12:30',
    symptoms: 'Moderate allergic reaction; erythematous skin rash on upper trunk.',
    triage: 'Stable',
    specialty: 'Dermatology',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=120',
    hasUnreadMessage: true,
    vitals: {
      bloodPressure: { label: 'Blood Pressure', value: '110/30', unit: 'mmHg', status: 'abnormal' },
      heartRate: { label: 'Heart Rate', value: '158', unit: 'bpm', status: 'abnormal' },
      spO2: { label: 'SpO2', value: '98', unit: '%', status: 'normal' },
      temperature: { label: 'Temperature', value: '98.8', unit: '°F', status: 'normal' }
    },
    analysis: [
      'Localized hives observed across dorsal/cervical regions.',
      'Recommendation: Administer H1 antihistamine block, observe for airway compromise.'
    ],
    logs: [
      '[12:32] ALLERGY WORKFLOW DISPATCHED',
      '[12:30] LOGGED VIA CLINICAL INTAKE'
    ],
    medications: [
      { name: 'Cetirizine', dose: '10 mg/day', period: '2 weeks', left: '10 days left' }
    ],
    glucoseData: [1100, 1000, 1200, 1300, 1150, 1250, 1100],
    caloriesData: [1600, 1500, 1700, 1800, 1650, 1750, 1600],
    bpSysData: [110, 108, 112, 110, 115, 111, 110],
    bpDiaData: [30, 32, 28, 30, 35, 32, 30],
  }
];
