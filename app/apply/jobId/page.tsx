"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BriefcaseIcon, MapPin, Clock } from "lucide-react";
import CVUpload from "@/components/candidate/CVUpload";

import { submitApplication, getJobDetails, JobApplicationCreateData } from "@/services/applicationService";
//import { JobPostingRead } from "@/schemas/job_posting"; // 

const JobApplicationPage = () => {
  const params = useParams(); 
  const router = useRouter();
  const { toast } = useToast();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    experience: "",
    expectedSalary: "",
  });

  const [job, setJob] = useState<JobPostingRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      const fetchJobData = async () => {
        try {
          setIsLoading(true);
          const jobData = await getJobDetails(jobId);
          setJob(jobData);
        } catch (error: any) {
          toast({
            title: "Error fetching job",
            description: error.message || "Could not load job details.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchJobData();
    }
  }, [jobId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);


    const token = localStorage.getItem("authToken"); 

    if (!token) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to apply for a job.",
            variant: "destructive"
        });
        setIsSubmitting(false);
        // Optional: redirect to login page
        // router.push("/login");
        return;
    }

    const applicationData: JobApplicationCreateData = {
      job_posting_id: parseInt(jobId, 10),
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      cover_letter: formData.coverLetter,
      years_of_experience: formData.experience || undefined,
      expected_salary: formData.expectedSalary || undefined,

    };

    try {
      await submitApplication(applicationData, token);

      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been sent to the employer.",
      });

      setTimeout(() => {
        router.push("/jobs"); 
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Error Submitting Application",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
          <p>Job not found.</p>
        </div>
      );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      Posted on {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-lg">{job.salary_range}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs rounded-full px-3 py-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Apply for this Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                      </div>
                      <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                    </div>

                    {/* Resume Upload */}
                    <CVUpload />

                    {/* Cover Letter */}
                    <div>
                        <Label htmlFor="coverLetter">Why are you interested in this position? *</Label>
                        <Textarea id="coverLetter" name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} rows={5} required />
                    </div>
                    
                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="experience">Years of Relevant Experience</Label>
                          <Input id="experience" name="experience" value={formData.experience} onChange={handleInputChange} />
                      </div>
                      <div>
                          <Label htmlFor="expectedSalary">Expected Salary</Label>
                          <Input id="expectedSalary" name="expectedSalary" value={formData.expectedSalary} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobApplicationPage;
