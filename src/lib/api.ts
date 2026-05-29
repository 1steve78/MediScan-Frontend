


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Generate a lightweight, browser-compatible unique ID helper
function generateUniqueId(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// --- FRONTEND COMMUNICATIONS INTERFACES ---

export interface AnalyzeQueuedResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface TriageResponse {
  classification: 'low' | 'medium' | 'high' | 'critical';
  ai_insight: string;
  required_specialty?: 'Cardiology' | 'Neurology' | 'Orthopedics' | 'Dermatology' | 'General Practice';
  status: string;
}

export interface LabValue {
  parameter: string;
  value: number;
  unit: string;
  reference_range: string;
  comparison: 'Low' | 'Normal' | 'High';
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

export interface AnalyzeResultPayload {
  patient_name: string;
  extracted_vitals: Record<string, string>;
  diagnoses: string[];
  prescribed_medications: string[];
  lab_results: LabValue[];
  summary: string[];
  confidence_score: number;
  document_hash: string;
  pipeline_mode: 'live_gemini_vision' | 'simulated_fallback';
  status: string;
  scan_type?: string;
  overall_impression?: string;
  anomaly_regions?: AnomalyRegion[];
  differential_diagnoses?: DifferentialDiagnosis[];
}

export interface JobStatusResponse {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  result: AnalyzeResultPayload | null;
  error: string | null;
}

// --- API COMMUNICATIONS FUNCTIONS ---

/**
 * Uploads a raw medical report file (image/PDF) DIRECTLY to the FastAPI backend
 * via multipart/form-data, bypassing Supabase Storage entirely.
 * The backend reads the buffer in-memory, computes the SHA-256 hash,
 * base64-encodes the image, and queues Gemini analysis asynchronously.
 */
export async function uploadAndAnalyzeReport(
  file: File,
  language: string = 'en',
  jobId?: string,
  symptoms: string = ''
): Promise<AnalyzeQueuedResponse> {
  try {
    const targetJobId = jobId || generateUniqueId();

    console.log(`[MediScan-Ai API] Sending "${file.name}" directly to FastAPI multipart endpoint (no Supabase Storage required)...`);

    // Build a multipart FormData payload — the backend reads this directly
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('job_id', targetJobId);
    if (symptoms.trim()) {
      formData.append('symptoms', symptoms.trim());
    }

    const response = await fetch(`${BACKEND_URL}/api/analyze-report/upload`, {
      method: 'POST',
      // Do NOT set Content-Type manually — the browser sets it with the correct multipart boundary
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FastAPI clinical engine rejected file upload: HTTP ${response.status} — ${errorText}`);
    }

    const result = await response.json();
    console.log('[MediScan-Ai API] Background job successfully queued via direct upload:', result);
    return result as AnalyzeQueuedResponse;

  } catch (error: any) {
    console.error('[MediScan-Ai API] Exception caught in uploadAndAnalyzeReport:', error);
    throw new Error(error.message || 'An error occurred during medical file processing.');
  }
}


/**
 * Submits patient symptoms text to the AI triage assessment router
 * and retrieves classified emergency metrics and localized AI diagnostic insights.
 */
export async function submitSymptoms(
  symptoms: string,
  language: string = 'en'
): Promise<TriageResponse> {
  try {
    console.log(`[MediScan-Ai API] Submitting symptoms to triage engine: "${symptoms}" [Lang: ${language}]`);
    
    const response = await fetch(`${BACKEND_URL}/api/triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms,
        language
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FastAPI triage engine request failed: HTTP ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[MediScan-Ai API] Triage analysis resolved successfully:', result);
    return result as TriageResponse;

  } catch (error: any) {
    console.error('[MediScan-Ai API] Exception caught in submitSymptoms:', error);
    throw new Error(error.message || 'An error occurred during symptom triage analysis.');
  }
}

/**
 * Status Polling Helper:
 * Queries the backend local job cache to fetch the progression state 
 * and clinical JSON payloads when completed.
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze-report/status/${jobId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FastAPI job status query failed: HTTP ${response.status} - ${errorText}`);
    }
    return await response.json() as JobStatusResponse;
  } catch (error: any) {
    console.error(`[MediScan-Ai API] Error checking status for job ${jobId}:`, error);
    throw new Error(error.message || 'An error occurred while tracking task progression.');
  }
}
