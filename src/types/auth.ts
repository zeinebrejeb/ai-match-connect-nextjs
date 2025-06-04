export interface UserData {
    id: string; 
    email: string;
    firstName: string;
    lastName?: string; 
    role: "candidate" | "recruiter" | 'admin'; 
    company?: string; 
  }

export interface AuthSuccessData {
  accessToken?: string;
  role?: 'candidate' | 'recruiter' | 'admin';
}
