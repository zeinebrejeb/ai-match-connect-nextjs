export interface JobApplicationCreateData {
  job_posting_id: number;
  full_name: string;
  email: string;
  phone?: string;
  cover_letter: string;
  years_of_experience?: string;
  expected_salary?: string;
  resume_url?: string;
}

export const submitApplication = async (
  applicationData: JobApplicationCreateData,
  token: string 
): Promise<any> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(`${API_URL}/job-applications/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to submit application");
  }

  return response.json();
};

export const getJobDetails = async (jobId: string): Promise<any> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const response = await fetch(`${API_URL}/job-postings/${jobId}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch job details");
    }

    return response.json();
}
