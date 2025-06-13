
"use client"; 
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; 
import { Plus, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { createJobPosting, JobPostingCreateData } from "@/services/jobService";


const JobForm: React.FC = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "full-time", 
    experience_level: "", 
    salary: "",        
    description: "",
  });
  const router = useRouter();


  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleNewSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.description || skills.length === 0 || !formData.type || !formData.experience_level) {
      toast({
        title: "Missing Information",
        description: "Please fill out title, location, type, experience, description, and add at least one skill.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const jobDataToSubmit: JobPostingCreateData = {
      title: formData.title,
      location: formData.location,
      type: formData.type, 
      experience_level: formData.experience_level, 
      description: formData.description,
      skills: skills,         
      ...(formData.salary && { salary_range: formData.salary }),
    };

    try {
      console.log("Submitting Job Data to Backend:", jobDataToSubmit);

      const result = await createJobPosting(jobDataToSubmit);

      toast({
        title: "Job Created Successfully!",
        description: `Job "${result.title}" has been posted. ID: ${result.id}`, 
      });

      router.push(`/jobs/${result.id}`);

      setFormData({
        title: "",
        location: "",
        type: "full-time", 
        experience_level: "",    
        salary: "",
        description: "",
      });
      setSkills([]);
      setNewSkill("");
    } catch (error: any) {
        toast({
          title: "Error Creating Job",
          description: error.message, 
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior React Developer" required />
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. San Francisco, CA or Remote" required />
        </div>

        {/* Job Type Select */}
        <div className="space-y-2">
          <Label htmlFor="type">Job Type</Label>
          <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CORRECTION: The `name` and `value` now point to `experience_level` */}
        <div className="space-y-2">
          <Label htmlFor="experience_level">Experience Level</Label>
          <Select name="experience_level" value={formData.experience_level} onValueChange={(value) => handleSelectChange("experience_level", value)}>
            <SelectTrigger><SelectValue placeholder="Select experience level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead / Manager</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Input */}
        <div className="space-y-2">
          <Label htmlFor="salary">Salary Range (Optional)</Label>
          <Input id="salary" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. $80,000 - $120,000" />
        </div>

        {/* Skills Input */}
        <div className="space-y-2">
          <Label htmlFor="newSkillInput">Required Skills</Label> 
          <div className="flex items-center gap-2">
            <Input id="newSkillInput" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleNewSkillKeyDown} placeholder="Type a skill and press Enter" />
            <Button type="button" onClick={addSkill} variant="secondary" className="flex-shrink-0"><Plus className="h-4 w-4" /> Add</Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 pl-3 pr-2 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1.5 rounded-full p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div> 

      {/* Description Textarea */}
      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={8} placeholder="Describe the job role, responsibilities, and requirements..." required />
      </div>

      {/* AI Match Checkbox */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="ai-match" checked readOnly className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <Label htmlFor="ai-match">Enable AI matching to find suitable candidates</Label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="px-6"> 
          {isSubmitting ? "Creating Job..." : "Create Job Listing"}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;