import { API_CONFIG } from '@/config/agenticRag';

export interface AISearchRequestPayload {
  job_id: number;
  candidate_ids: number[];
}

export interface AISearchResponse {
  summary: string;
  ranked_candidates: CandidateResult[];
}

export interface CandidateResult {
  candidate_id: string;
  final_score: number;
  details: {
    relevance_score: number;
    experience_score: number;
    skill_score: number;
    education_score: number;
  };
  extracted_info: {
    required_skills: string[];
    candidate_skills: string[];
    required_experience: number;
    candidate_experience: number;
  };
  contact_info?: {
    candidate_name: string | null;
    linkedin_url: string | null;
  }
}


class ApiService {
  /**
   * Performs the AI-powered candidate search by calling our main backend endpoint.
   * @param payload The request payload containing job_id and candidate_ids.
   * @returns A promise that resolves to the structured AI analysis.
   */
  async performAiSearch(payload: AISearchRequestPayload): Promise<AISearchResponse> {
    const searchUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.aiSearch}`;
    console.log(`Sending request to AI Search Endpoint: ${searchUrl}`, payload);

    try {
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(API_CONFIG.timeout), 
      });

      if (!response.ok) {

        const errorData = await response.json().catch(() => null);
        const detail = errorData?.detail || `API request failed with status ${response.status}`;
        console.error('API Error:', detail);
        throw new Error(detail);
      }

      const data: AISearchResponse = await response.json();
      console.log('Received AI analysis response:', data);
      return data;

    } catch (error) {
      console.error('Failed to connect to the backend API:', error);
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error('The request to the AI service timed out. Please try again.');
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to connect to the backend. Please ensure the service is running.');
    }
  }

  /**
   * Checks the health of the backend service.
   * @returns A promise that resolves if the service is healthy.
   */
  async checkHealth(): Promise<void> {
     const healthUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`;
     await fetch(healthUrl);
  }
}

export const apiService = new ApiService();
