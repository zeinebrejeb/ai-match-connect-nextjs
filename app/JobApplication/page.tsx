"use client"; 
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BriefcaseIcon, MapPin, Clock } from "lucide-react";
import CVUpload from "@/components/candidate/CVUpload"; 

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  requirements: string[];
  skills: string[];
}
const JobApplication = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    experience: "",
    expectedSalary: ""
  });

  const [job, setJob] = useState<Job | null>(null); ; 

  useEffect(() => {
    if (jobId) {

      // fetch(`/api/jobs/${jobId}`).then(res => res.json()).then(data => setJob(data));
      const currentJobId = Array.isArray(jobId) ? jobId[0] : jobId;

      const mockJobData: Job = { // Explicitly type mockJobData as Job
        id: currentJobId, 
        title: "Senior Frontend Developer",
        company: "Tech Innovators Inc.",
        location: "Remote",
        type: "Full-time",
        salary: "$120K - $150K",
        postedDate: "2 days ago",
        description: "We are seeking an experienced Frontend Developer proficient in React, TypeScript, and modern frontend development practices to join our innovative team.",
        requirements: [
          "5+ years of experience with React and TypeScript",
          "Strong understanding of modern frontend development practices",
          "Experience with state management libraries (Redux, Zustand)",
          "Knowledge of testing frameworks (Jest, React Testing Library)",
          "Excellent communication and teamwork skills"
        ],
        skills: ["React", "TypeScript", "Redux", "CSS3", "HTML5"]
      };
      setJob(mockJobData);
    }
  }, [jobId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Mock submission
    console.log("Application submitted:", { jobId, ...formData });

    toast({
      title: "Application Submitted Successfully!",
      description: "Your application has been sent to the employer. You'll receive a confirmation email shortly.",
    });

    // Redirect to jobs page after successful submission
    setTimeout(() => {
      router.push("/jobs");
    }, 2000);
  };

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/jobs")}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
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
                    <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
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
                      Posted {job.postedDate}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-lg">{job.salary}</p>
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

                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="text-sm space-y-1">
                      {job.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="text-gray-600 dark:text-gray-400">
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Apply for this Position</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill out the form below to submit your application
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Resume/CV</h3>
                      <CVUpload />
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Cover Letter</h3>
                      <div>
                        <Label htmlFor="coverLetter">Why are you interested in this position? *</Label>
                        <Textarea
                          id="coverLetter"
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder="Tell us why you're the perfect fit for this role..."
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Additional Information</h3>
                      <div>
                        <Label htmlFor="experience">Years of Relevant Experience</Label>
                        <Input
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="e.g., 5 years"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedSalary">Expected Salary</Label>
                        <Input
                          id="expectedSalary"
                          name="expectedSalary"
                          value={formData.expectedSalary}
                          onChange={handleInputChange}
                          placeholder="e.g., $120,000"
                        />
                      </div>
                    </div>

                    
                    <div className="pt-6">
                      <Button type="submit" size="lg" className="w-full">
                        Submit Application
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

export default JobApplication;