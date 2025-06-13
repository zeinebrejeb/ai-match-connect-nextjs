import api from '@/lib/api';
import { AxiosError } from 'axios';

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

/**
 * Creates a new job posting.
 * @param jobData The data for the new job posting.
 * @returns The newly created job posting object.
 * @throws An error with a user-friendly message if the API call fails.
 */
export const createJobPosting = async (
  jobData: JobPostingCreateData
): Promise<JobPostingResponse> => {
  try {
    const response = await api.post<JobPostingResponse>('/job-postings/', jobData);
    return response.data;
  } catch (error) {
    console.error('Failed to create job posting:', error);
    const axiosError = error as AxiosError<any>;
    const errorMessage = axiosError.response?.data?.detail || 'An unknown error occurred while creating the job posting.';
    throw new Error(errorMessage);
  }
};

/**
 * Fetches all job postings for the currently authenticated recruiter.
 * @param skip The number of job postings to skip (for pagination).
 * @param limit The maximum number of job postings to return (for pagination).
 * @returns A promise that resolves to an array of job postings.
 */
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
    throw new Error('Could not fetch your job postings.');
  }
};

/**
 * Fetches all job postings from the platform.
 * @param skip The number of job postings to skip (for pagination).
 * @param limit The maximum number of job postings to return (for pagination).
 * @returns A promise that resolves to an array of all job postings.
 */
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
    throw new Error('Could not fetch job postings.');
  }
};

/**
 * Fetches a single job posting by its ID.
 * @param jobPostingId The ID of the job posting to fetch.
 * @returns A promise that resolves to the job posting object.
 */
export const getJobPostingById = async (
  jobPostingId: number
): Promise<JobPostingResponse> => {
  try {
    const response = await api.get<JobPostingResponse>(`/job-postings/${jobPostingId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch job posting with ID ${jobPostingId}:`, error);
    throw new Error('Could not find the requested job posting.');
  }
};

/**
 * Updates an existing job posting.
 * @param jobPostingId The ID of the job posting to update.
 * @param jobData The data to update.
 * @returns A promise that resolves to the updated job posting object.
 */
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
    const axiosError = error as AxiosError<any>;
    const errorMessage = axiosError.response?.data?.detail || 'An unknown error occurred while updating the job posting.';
    throw new Error(errorMessage);
  }
};

/**
 * Deletes a job posting by its ID.
 * @param jobPostingId The ID of the job posting to delete.
 */
export const deleteJobPosting = async (jobPostingId: number): Promise<void> => {
  try {
    await api.delete(`/job-postings/${jobPostingId}`);
  } catch (error) {
    console.error(`Failed to delete job posting with ID ${jobPostingId}:`, error);
    throw new Error('Could not delete the job posting.');
  }
};