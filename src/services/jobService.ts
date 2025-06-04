import api from '@/lib/api'; 
export interface JobPostingCreateData {
  title: string;
  location: string;
  type: string; 
  experience_level: string; 
  salary_range?: string; 
  description: string;
  skills: string[];
}

export interface JobPostingUpdateData {
  title?: string;
  location?: string;
  type?: string;
  experience_level?: string;
  salary_range?: string;
  description?: string;
  skills?: string[];
}

export interface JobPostingResponse {
  id: number;
  title: string;
  location: string;
  type: string;
  experience_level: string;
  salary_range?: string;
  description: string;
  skills: string[];
  recruiter_profile_id: number;
  created_at: string; 
  updated_at: string; 
}

export const createJobPosting = async (
  jobData: JobPostingCreateData
): Promise<JobPostingResponse> => {
  try {

    const response = await api.post<JobPostingResponse>('/job-postings/', jobData);
    return response.data;
  } catch (error) {
    console.error('Failed to create job posting:', error);

    throw error;
  }
};


export const getMyRecruiterJobPostings = async (
  skip: number = 0,
  limit: number = 100
): Promise<JobPostingResponse[]> => {
  try {
    const response = await api.get<JobPostingResponse[]>(
      `/job-postings/by-recruiter/me?skip=${skip}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recruiter job postings:', error);
    throw error;
  }
};

export const getAllJobPostings = async (
  skip: number = 0,
  limit: number = 100
): Promise<JobPostingResponse[]> => {
  try {
    const response = await api.get<JobPostingResponse[]>(
      `/job-postings/?skip=${skip}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all job postings:', error);
    throw error;
  }
};


export const getJobPostingById = async (
  jobPostingId: number
): Promise<JobPostingResponse> => {
  try {
    const response = await api.get<JobPostingResponse>(`/job-postings/${jobPostingId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch job posting with ID ${jobPostingId}:`, error);
    throw error;
  }
};


export const updateJobPosting = async (
  jobPostingId: number,
  jobData: JobPostingUpdateData
): Promise<JobPostingResponse> => {
  try {
    const response = await api.put<JobPostingResponse>(
      `/job-postings/${jobPostingId}`,
      jobData
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update job posting with ID ${jobPostingId}:`, error);
    throw error;
  }
};


export const deleteJobPosting = async (jobPostingId: number): Promise<void> => {
  try {
    await api.delete(`/job-postings/${jobPostingId}`);
  } catch (error) {
    console.error(`Failed to delete job posting with ID ${jobPostingId}:`, error);
    throw error;
  }
};