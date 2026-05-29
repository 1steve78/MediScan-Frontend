import { supabase } from './supabase';

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
 * Uploads a raw medical report file (image/PDF) to Supabase Storage,
 * retrieves its public URL, and queues an event-driven analysis task 
 * on our FastAPI clinical backend.
 */
export async function uploadAndAnalyzeReport(
  file: File,
  language: string = 'en',
  jobId?: string,
  symptoms: string = ''
): Promise<AnalyzeQueuedResponse> {
  try {
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${generateUniqueId()}.${fileExt}`;
    const filePath = `reports/${uniqueFileName}`;

    console.log(`[MediScan-Ai API] Commencing upload of ${file.name} to Supabase bucket 'medical-records'...`);

    /**
     * Self-Healing Bucket Upload:
     * Attempt the upload, and if the bucket is missing (Supabase error code 'Bucket not found'),
     * auto-create it as a public bucket and retry once — no manual dashboard setup required.
     */
    const attemptUpload = async () =>
      supabase.storage.from('medical-records').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    let { data, error } = await attemptUpload();

    if (error && (error.message?.includes('Bucket not found') || error.message?.includes('bucket') || (error as any)?.statusCode === 404 || (error as any)?.error === 'Bucket not found')) {
      console.warn('[MediScan-Ai API] Bucket "medical-records" not found. Auto-creating public bucket...');
      // Create the bucket — ignore error if it was already created by a concurrent request
      const { error: bucketErr } = await supabase.storage.createBucket('medical-records', {
        public: true,
        fileSizeLimit: 52428800, // 50 MB
        allowedMimeTypes: ['image/*', 'application/pdf'],
      });
      if (bucketErr && !bucketErr.message?.includes('already exists') && !bucketErr.message?.includes('duplicate')) {
        console.warn('[MediScan-Ai API] Bucket creation warning (may already exist):', bucketErr.message);
      } else {
        console.log('[MediScan-Ai API] Bucket "medical-records" created successfully. Retrying upload...');
      }
      // Retry the upload after bucket creation
      ({ data, error } = await attemptUpload());
    }


    if (error) {
      throw new Error(`Supabase Storage upload failed: ${error.message}`);
    }

    console.log('[MediScan-Ai API] File uploaded successfully. Fetching public retrieval URL...');

    // 2. Retrieve the public retrieval URL of that uploaded file
    const { data: urlData } = supabase.storage
      .from('medical-records')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log(`[MediScan-Ai API] Public retrieval URL resolved: ${publicUrl}`);

    // Adopt frontend-provided job_id or generate one locally
    const targetJobId = jobId || generateUniqueId();

    // 3. Make POST request to our FastAPI backend '/api/analyze-report'
    const payload = {
      file_url: publicUrl,
      language: language,
      job_id: targetJobId,
      symptoms: symptoms
    };

    console.log('[MediScan-Ai API] Dispatching queue payload to FastAPI backend...', payload);
    const response = await fetch(`${BACKEND_URL}/api/analyze-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FastAPI clinical engine rejected upload: HTTP ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[MediScan-Ai API] Background job successfully queued in backend:', result);
    return result as AnalyzeQueuedResponse;

  } catch (error: any) {
    console.error('[MediScan-Ai API] Exception caught in uploadAndAnalyzeReport:', error);
    // Prevent freezing UI by throwing a clean structured error message
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
