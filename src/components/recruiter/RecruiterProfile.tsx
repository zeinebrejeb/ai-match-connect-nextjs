"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from 'axios';
import {AlertDialog,AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog";
import { Card,CardContent,CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast"; 
import { Edit, Save, Plus, Briefcase as BriefcaseIcon, Users,Trash2} from "lucide-react";
import api from "@/lib/api"; 
import { getDecodedTokenFromStorage } from "@/lib/authUtils";
import JobForm from "@/components/recruiter/JobForm"; 

interface UserData { 
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface RecruiterProfilePayload { 
  company_name?: string;
  job_title?: string; 
  phone_number?: string;
  linkedin_profile_url?: string;
  website_url?: string;
  bio?: string;
  location?: string;
  company_size?: string;
  industry?: string;
}

interface RecruiterProfileData extends RecruiterProfilePayload {
  id: string | number;
  user_id: string | number;
}

interface JobListing {
  id: number;
  title: string;
  location: string;
  type: string; 
  description?: string; 
  skills?: string[];    
  salary_range?: string; 
  created_at: string; 
  updated_at: string; 
  applicants: number;
  matched: number;
}

const RecruiterProfilePage = () => {
  const router = useRouter();
  const { toast } = useToast(); 

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<RecruiterProfilePayload & { email?: string, firstName?: string, lastName?: string }>({
    firstName: "", 
    lastName: "",  
    email: "",   
    company_name: "",
    job_title: "", 
    phone_number: "",
    location: "",
    company_size: "",
    industry: "",
    website_url: "",
    bio: "",
    linkedin_profile_url: "",
  });
  const [activeJobs, setActiveJobs] = useState<JobListing[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobToEdit, setJobToEdit] = useState<Partial<JobListing>>({}); 

  const [isLoading, setIsLoading] = useState(true);

  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const decodedToken = getDecodedTokenFromStorage();
    if (!decodedToken) {
      toast({ title: "Authentication Error", description: "Please log in.", variant: "destructive" });
      router.push("/auth/login"); 
      return;
    }

    setCurrentUser({
        id: decodedToken.sub,
        email: decodedToken.email,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
    });


    try {
      const profileResponse = await api.get<{ user: UserData, recruiter_profile: RecruiterProfileData }>("/recruiter-profile/me");
      if (profileResponse.data) {
        const { user, recruiter_profile } = profileResponse.data;
        setProfileData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          company_name: recruiter_profile.company_name || "",
          job_title: recruiter_profile.job_title || "",
          phone_number: recruiter_profile.phone_number || "",
          location: recruiter_profile.location || "",
          company_size: recruiter_profile.company_size || "",
          industry: recruiter_profile.industry || "",
          website_url: recruiter_profile.website_url || "",
          bio: recruiter_profile.bio || "",
          linkedin_profile_url: recruiter_profile.linkedin_profile_url || "",
        });
         
        setCurrentUser(prevUser => ({...prevUser, ...user}));
      }

    
      const jobsResponse = await api.get<JobListing[]>("/job-postings/me");
      setActiveJobs(jobsResponse.data || []);

    } catch (error: unknown) { 
      console.error("Failed to fetch data:", error);
      let errorMessage = "Could not load profile information.";
      if (error instanceof AxiosError && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      toast({
        title: "Error Fetching Data",
        description: errorMessage,
        variant: "destructive",
      });
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {

    const payload: RecruiterProfilePayload = {
        company_name: profileData.company_name,
        job_title: profileData.job_title,
        phone_number: profileData.phone_number,
        location: profileData.location,
        company_size: profileData.company_size,
        industry: profileData.industry,
        website_url: profileData.website_url,
        bio: profileData.bio,
        linkedin_profile_url: profileData.linkedin_profile_url,
    };
    try {
      await api.put("/recruiter-profile/me", payload); 
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditingProfile(false);
      fetchData(); 
    } catch (error: unknown) { 
      console.error("Failed to update profile:", error);
      let errorMessage = "Could not update profile.";
      if (error instanceof AxiosError && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };


  const startEditingJob = (job: JobListing) => {
    setEditingJobId(job.id);
    setJobToEdit({ 
      title: job.title,
      location: job.location,
      type: job.type,
      description: job.description || "",
      skills: job.skills || [],
      salary_range: job.salary_range || "",
    });
  };

  const handleJobInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const saveJobChanges = async () => {
    if (!editingJobId) return;
    try {

      const { id, created_at, updated_at, applicants, matched, ...updatePayload } = jobToEdit;
     
      await api.put(`/job-postings/${editingJobId}`, updatePayload);
      toast({
        title: "Job Updated",
        description: "Job listing has been updated successfully",
      });
      setEditingJobId(null);
      setJobToEdit({});
      fetchData();
    } catch (error: unknown) { 
      console.error("Failed to update job:", error);
      let errorMessage = "Could not update job listing.";
      if (error instanceof AxiosError && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const cancelJobEdit = () => {
    setEditingJobId(null);
    setJobToEdit({});
  };

  const deleteJob = async (jobId: number) => {
    try {
      await api.delete(`/job-postings/${jobId}`);
      toast({
        title: "Job Deleted",
        description: "Job listing has been deleted successfully",
      });
      fetchData();
    } catch (error: unknown) { 
      console.error("Failed to delete job:", error);
      let errorMessage = "Could not delete job listing.";
      if (error instanceof AxiosError && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading profile...</p></div>;
  }

  if (!currentUser) {

    return <div className="flex justify-center items-center h-screen"><p>Not authenticated.</p></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Recruiter Profile</h2>
        {!isEditingProfile ? (
          <Button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => { setIsEditingProfile(false); fetchData();  }} variant="outline">
                Cancel
            </Button>
            <Button onClick={saveProfile} className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="candidates">Matched Candidates</TabsTrigger>
        </TabsList>


        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="relative pb-8">
              
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-t-lg"></div>
                <div className="relative flex flex-col sm:flex-row gap-4 items-center pt-16 sm:items-end px-6">
                    <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarImage src={profileData.linkedin_profile_url || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=random`} />
                        <AvatarFallback>{(profileData.firstName?.[0] || "")}{(profileData.lastName?.[0] || "")}</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                        <CardTitle className="text-2xl">{profileData.firstName} {profileData.lastName}</CardTitle>
                        <CardDescription className="text-lg">{profileData.job_title || "Recruiter"}</CardDescription>
                        <CardDescription>{profileData.company_name || "Company Name"}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {isEditingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1"><Label>First Name</Label><Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileInputChange}
                    /></div>
                  <div className="space-y-1"><Label>Last Name</Label><Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileInputChange}
                    /></div>
                  <div className="space-y-1"><Label>Email</Label><Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileInputChange}
                    /></div>
                  
                 
                  <div className="space-y-1">
                    <Label htmlFor="phone_number">Phone</Label>
                    <Input id="phone_number" name="phone_number" value={profileData.phone_number} onChange={handleProfileInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input id="company_name" name="company_name" value={profileData.company_name} onChange={handleProfileInputChange} />
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="job_title">Your Job Title</Label>
                    <Input id="job_title" name="job_title" value={profileData.job_title} onChange={handleProfileInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={profileData.location} onChange={handleProfileInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="company_size">Company Size</Label>
                    <Input id="company_size" name="company_size" value={profileData.company_size} onChange={handleProfileInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" name="industry" value={profileData.industry} onChange={handleProfileInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="website_url">Website</Label>
                    <Input id="website_url" name="website_url" value={profileData.website_url} onChange={handleProfileInputChange} />
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="linkedin_profile_url">LinkedIn Profile URL</Label>
                    <Input id="linkedin_profile_url" name="linkedin_profile_url" value={profileData.linkedin_profile_url} onChange={handleProfileInputChange} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea id="bio" name="bio" rows={4} value={profileData.bio} onChange={handleProfileInputChange} />
                  </div>
                </div>
              ) : (
                
                <div className="space-y-6">
                  <div>
                      <h3 className="text-lg font-semibold text-foreground">About</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{profileData.bio || "Not specified."}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                          <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                              <li><span className="font-medium text-foreground">Email:</span> {profileData.email}</li>
                              <li><span className="font-medium text-foreground">Phone:</span> {profileData.phone_number || "Not specified."}</li>
                              <li><span className="font-medium text-foreground">Location:</span> {profileData.location || "Not specified."}</li>
                          </ul>
                      </div>
                      <div>
                          <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
                          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                              <li><span className="font-medium text-foreground">Company:</span> {profileData.company_name || "Not specified."}</li>
                              <li><span className="font-medium text-foreground">Size:</span> {profileData.company_size || "Not specified."}</li>
                              <li><span className="font-medium text-foreground">Industry:</span> {profileData.industry || "Not specified."}</li>
                              <li>
                                  <span className="font-medium text-foreground">Website:</span> {profileData.website_url ? 
                                  <Link href={profileData.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                      {profileData.website_url.replace(/(^\w+:|^)\/\//, "")}
                                  </Link> : "Not specified."}
                              </li>
                              <li>
                                  <span className="font-medium text-foreground">LinkedIn:</span> {profileData.linkedin_profile_url ? 
                                  <Link href={profileData.linkedin_profile_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                      {profileData.linkedin_profile_url.replace(/(^\w+:|^)\/\//, "").replace(/^www\./, "")}
                                  </Link> : "Not specified."}
                              </li>
                          </ul>
                      </div>
                  </div>
                  
                  <Separator />

                   <div>
                    <h3 className="text-lg font-medium">Recruiting Activity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                      <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg border border-brand-100 dark:border-brand-800">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-800 mx-auto mb-3">
                          <BriefcaseIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <p className="text-center text-3xl font-bold text-brand-600 dark:text-brand-400">{activeJobs.length}</p>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
                      </div>
                      
                      <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg border border-brand-100 dark:border-brand-800">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-800 mx-auto mb-3">
                          <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <p className="text-center text-3xl font-bold text-brand-600 dark:text-brand-400">
                          {activeJobs.reduce((acc, job) => acc + job.applicants, 0)}
                        </p>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Total Applicants</p>
                      </div>
                      
                      <div className="bg-accent2-50 dark:bg-accent2-900/20 p-4 rounded-lg border border-accent2-100 dark:border-accent2-800">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent2-100 dark:bg-accent2-800 mx-auto mb-3">
                          <Users className="h-6 w-6 text-accent2-600 dark:text-accent2-400" />
                        </div>
                        <p className="text-center text-3xl font-bold text-accent2-600 dark:text-accent2-400">
                          {activeJobs.reduce((acc, job) => acc + job.matched, 0)}
                        </p>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">AI Matched</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle> Job Listings</CardTitle>
                  <CardDescription>Manage your active job postings.</CardDescription>
                </div>
                
                 <Button asChild className="flex items-center gap-2">
                    <Link href="/post-job"> 
                        <Plus className="h-4 w-4" /> Post New Job
                    </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
                {activeJobs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                        
                         <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Position</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Posted</th>
                                <th scope="col" className="px-6 py-3">Applicants</th>
                                <th scope="col" className="px-6 py-3">Matched</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {activeJobs.map((job) => (
              <tr key={job.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {editingJobId === job.id ? (
                    <Input
                      name="title"
                      value={jobToEdit.title}
                      onChange={handleJobInputChange}
                      className="min-w-[200px]"
                    />
                  ) : (
                    job.title
                  )}
                </th>
                <td className="px-6 py-4">
                  {editingJobId === job.id ? (
                    <Input
                      name="location"
                      value={jobToEdit.location}
                      onChange={handleJobInputChange}
                      className="min-w-[150px]"
                    />
                  ) : (
                    job.location
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingJobId === job.id ? (
                    <Input
                      name="type"
                      value={jobToEdit.type}
                      onChange={handleJobInputChange}
                      className="min-w-[100px]"
                    />
                  ) : (
                    job.type
                  )}
                </td>
                <td className="px-6 py-4">{new Date(job.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">{job.applicants}</td>
                <td className="px-6 py-4">
                  <span className="text-accent2-500 dark:text-accent2-400 font-medium">
                    {job.matched}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {editingJobId === job.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveJobChanges}
                          className="h-8"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelJobEdit}
                          className="h-8"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingJob(job)}
                          className="h-8"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>

                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                <AlertDialogHeader>
                                                     <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete `{job.title}`? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteJob(job.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                            </>
                                            )}
                                        </div>
                                    </td>
                                    
                                 </tr>
                            ))}
                        
                        </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">You have not posted any jobs yet.</p>
                )}
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Create New Job Listing</CardTitle>
              <CardDescription>Fill in the details to post a new job</CardDescription>
            </CardHeader>
            <CardContent>
              <JobForm />
            </CardContent>
          </Card>

        </TabsContent>

        
        <TabsContent value="candidates" className="space-y-6"> 
          <Card>
             <CardHeader>
              <CardTitle>AI-Matched Candidates</CardTitle>
              <CardDescription>Candidates that best match your job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden dark:border-gray-700">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${20 + i}`} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-md font-medium">Candidate {i + 1}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {["Full Stack Developer", "React Developer", "Backend Engineer", "DevOps Specialist", "Frontend Developer", "UI/UX Developer"][i % 6]}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Match Score</span>
                            <span className="text-sm font-medium text-accent2-500 dark:text-accent2-400">
                              {Math.floor(85 + Math.random() * 15)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div
                              className="bg-accent2-500 h-2 rounded-full"
                              style={{ width: `${Math.floor(85 + Math.random() * 15)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-500 dark:text-gray-400">
                            {["5+ years", "3+ years", "7+ years", "4+ years", "2+ years", "6+ years"][i % 6]} experience
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {["San Francisco, CA", "New York, NY", "Remote", "Austin, TX", "Seattle, WA", "Boston, MA"][i % 6]}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Top Skills:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Redux", "Express", "GraphQL", "Docker"][i % 9]
                              .split(", ")
                              .map((skill, idx) => (
                                <div key={idx} className="bg-brand-50 dark:bg-brand-900/20 text-xs text-brand-700 dark:text-brand-300 rounded-full px-2 py-0.5">
                                  {skill}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                          <Button size="sm" className="flex-1">Contact</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruiterProfilePage;