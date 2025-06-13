import api from '@/lib/api'; // Your configured Axios instance

// Define the expected response after uploading a resume (adjust as per your backend)
export interface ResumeUploadResponse {
  id: string | number; // Or int
  file_name: string;
  file_path: string; // Or a URL if stored in cloud
  candidate_id: string | number;
  uploaded_at: string; // datetime string
  // ... any other relevant metadata returned by the backend
}

export const uploadResume = async (
  file: File,
  candidateId?: string | number // Optional: if you want to associate it immediately
): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file); // 'file' is the key the backend will expect for the file part

  if (candidateId) {
    formData.append('candidate_id', String(candidateId)); // Example of sending additional data
  }

  try {
    const response = await api.post<ResumeUploadResponse>(
      '/resumes/', // Or '/cvs/', or '/candidate/resume' - adjust to your FastAPI endpoint
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload resume:', error);
    throw error; // Re-throw for the component to handle
  }
};