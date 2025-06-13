"use client"; 
import React, { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, Trash, Plus } from "lucide-react";
import CVUpload from "./CVUpload"; 
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext'; 


interface Skill {
  id: number | string; 
  name: string;
  level: number;
}

interface Experience {
  id: number | string;
  company: string;
  title: string;
  startDate: string;
  endDate: string; 
  description: string;
}

interface Education {
  id: number | string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  bio: string;
  avatarUrl?: string; 
}

interface CandidateData extends ProfileFormData {
    skills?: Skill[];
    experiences?: Experience[];
    education?: Education[];
    // add candidate-specific data
}

interface CandidateProfileProps {
  initialData?: CandidateData; 
}
const STORAGE_KEY = "candidateProfileData";

const CandidateProfile: React.FC<CandidateProfileProps> = ({ initialData}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const candidateId = user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    location: initialData?.location || "",
    title: initialData?.title || "",
    bio: initialData?.bio || "",
    avatarUrl: initialData?.avatarUrl || "", 
  });

  const [skills, setSkills] = useState<Skill[]>(initialData?.skills || []);
  const [experiences, setExperiences] = useState<Experience[]>(initialData?.experiences || []);
  const [education, setEducation] = useState<Education[]>(initialData?.education || []);

  const [newSkill, setNewSkill] = useState({ name: "", level: 50 });

 useEffect(() => {
    if (!initialData && candidateId && user) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          // Try load from localStorage first
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            const parsed: CandidateData = JSON.parse(savedData);
            setFormData({
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              email: parsed.email,
              phone: parsed.phone,
              location: parsed.location,
              title: parsed.title,
              bio: parsed.bio,
              avatarUrl: parsed.avatarUrl || "",
            });
            setSkills(parsed.skills || []);
            setExperiences(parsed.experiences || []);
            setEducation(parsed.education || []);
            toast({ title: "Profile loaded from local storage." });
          } else {
            // No saved data — use user data (mock)
            const data: CandidateData = {
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              phone: "",
              location: "",
              title: "",
              bio: "",
              avatarUrl: "",
              skills: [],
              experiences: [],
              education: [],
            };
            setFormData({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              location: data.location,
              title: data.title,
              bio: data.bio,
              avatarUrl: data.avatarUrl,
            });
            setSkills(data.skills || []);
            setExperiences(data.experiences || []);
            setEducation(data.education || []);
          }
          console.log("Candidate ID:", candidateId);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" });
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    } else {
      setIsLoadingData(false);
    }
  }, [candidateId, initialData, toast, user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) || 0 : value, // Ensure level is number
    }));
  };

  const addSkill = async () => {
    if (newSkill.name.trim() === "") return;

    const skillToAdd = { id: `temp-${Date.now()}`, name: newSkill.name, level: newSkill.level }; // Temporary ID

    setSkills([...skills, skillToAdd]);
    setNewSkill({ name: "", level: 50 }); 

    try {
        // const response = await fetch(`/api/candidates/${candidateId}/skills`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name: skillToAdd.name, level: skillToAdd.level })
        // });
        // if (!response.ok) throw new Error("Failed to add skill");
        // const savedSkill = await response.json(); // Get skill with real ID from backend

        // Update the skill with the real ID from backend if necessary
        // setSkills(currentSkills => currentSkills.map(s => s.id === skillToAdd.id ? savedSkill : s));

        console.log("Simulated: Added skill", skillToAdd.name);
        toast({ title: "Skill Added (Simulated)"});

    } catch (error) {
        console.error("Failed to add skill:", error);
        toast({ title: "Error", description: "Could not add skill.", variant: "destructive" });
       
        setSkills(currentSkills => currentSkills.filter(s => s.id !== skillToAdd.id));
    }
  };


  const removeSkill = async (idToRemove: number | string) => {
    const originalSkills = [...skills];

    setSkills(skills.filter(skill => skill.id !== idToRemove));

    try {
        // const response = await fetch(`/api/candidates/${candidateId}/skills/${idToRemove}`, {
        //     method: 'DELETE',
        // });
        // if (!response.ok) throw new Error("Failed to remove skill");

        console.log("Simulated: Removed skill", idToRemove);
        toast({ title: "Skill Removed (Simulated)"});

    } catch (error) {
        console.error("Failed to remove skill:", error);
        toast({ title: "Error", description: "Could not remove skill.", variant: "destructive" });
        // Rollback optimistic update
        setSkills(originalSkills);
    }
  };

  // --- TODO: Implement API call for saving profile ---
 const saveProfile = async () => {
    setIsSaving(true);
    try {
      const dataToSave: CandidateData = {
        ...formData,
        skills,
        experiences,
        education,
      };

      // Save to localStorage for persistence
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

        // const response = await fetch(`/api/candidates/${candidateId}`, {
        //     method: 'PUT', // or PATCH
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(dataToSave)
        // });
        // if (!response.ok) throw new Error("Failed to save profile");

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save delay
        console.log("Simulated: Saved profile data", dataToSave);

        toast({
            title: "Profile Updated (Simulated)",
            description: "Your profile has been updated successfully",
        });
        setIsEditing(false); // Exit editing mode on successful save

    } catch (error) {
        console.error("Failed to save profile:", error);
        toast({ title: "Error", description: "Could not save profile.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

 // --- Render Logic ---

  // Optional: Show loading state while fetching
  if (isLoadingData) {
      return <div className="p-6">Loading profile...</div>; // Or use a Skeleton component
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Candidate Profile</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <Button onClick={saveProfile} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? (
                // Add a spinner icon here if desired
                <span>Saving...</span>
            ) : (
                <> <Save className="h-4 w-4" /> Save Changes </>
            )}
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="preferences">Job Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab Content */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="relative pb-8">
              {/* Header background - consider making color dynamic */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500"></div>
              <div className="relative flex flex-col sm:flex-row gap-4 items-center pt-16 sm:items-end">
                 {/* Use dynamic avatar URL */}
                <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-950">
                   <AvatarImage src={formData.avatarUrl} alt={`${formData.firstName} ${formData.lastName}`} />
                   {/* Fallback initials */}
                   <AvatarFallback>{(formData.firstName?.[0] || '')}{(formData.lastName?.[0] || '')}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                   {/* Display fetched/edited data */}
                  <CardTitle className="text-2xl">{formData.firstName} {formData.lastName}</CardTitle>
                  <CardDescription className="text-lg">{formData.title}</CardDescription>
                  <CardDescription>{formData.location}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6"> {/* Added padding top */}
              {isEditing ? (
                // --- Editing View ---
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={isSaving}/></div>
                  <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={isSaving}/></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSaving}/></div>
                  <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={isSaving}/></div>
                  <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" value={formData.location} onChange={handleInputChange} disabled={isSaving}/></div>
                  <div className="space-y-2"><Label htmlFor="title">Professional Title</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} disabled={isSaving}/></div>
                  <div className="space-y-2 md:col-span-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleInputChange} disabled={isSaving}/></div>
                  {/* TODO: Add input for Avatar URL if desired */}
                </div>
              ) : (
                // --- Display View ---
                <div className="space-y-6">
                   <div><h3 className="text-lg font-medium">About Me</h3><p className="mt-2 text-muted-foreground">{formData.bio || "No bio provided."}</p></div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><h3 className="text-lg font-medium">Contact Information</h3><ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        <li><span className="font-medium text-foreground mr-2">Email:</span> {formData.email || "-"}</li>
                        <li><span className="font-medium text-foreground mr-2">Phone:</span> {formData.phone || "-"}</li>
                        <li><span className="font-medium text-foreground mr-2">Location:</span> {formData.location || "-"}</li>
                   </ul></div></div>
                </div>
              )}

              <Separator />

              {/* Skills Section */}
              <div>
                 <h3 className="text-lg font-medium mb-4">Skills</h3>
                 <div className="space-y-4">
                    {skills.length === 0 && !isEditing && <p className="text-muted-foreground text-sm">No skills added yet.</p>}
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-4"> {/* Increased gap */}
                          <div className="flex-grow">
                             <div className="flex justify-between mb-1 items-center">
                                <span className="text-sm font-medium">{skill.name}</span>
                                {isEditing && (
                                   <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="h-6 w-6" disabled={isSaving}> <Trash className="h-4 w-4 text-destructive" /> </Button>
                                )}
                             </div>
                             {/* Progress Bar - consider using shadcn/ui Progress component */}
                             <div className="w-full bg-muted rounded-full h-2 dark:bg-slate-700">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                             </div>
                          </div>
                      </div>
                    ))}
                    {isEditing && (
                        <div className="flex items-end gap-2 pt-4 border-t mt-4">
                             <div className="flex-grow space-y-1.5"><Label htmlFor="skillName" className="text-xs">New Skill</Label><Input id="skillName" name="name" placeholder="Skill name" value={newSkill.name} onChange={handleNewSkillChange} disabled={isSaving}/></div>
                             <div className="flex-grow space-y-1.5"><Label htmlFor="skillLevel" className="text-xs">Proficiency ({newSkill.level}%)</Label><Input id="skillLevel" name="level" type="range" min="10" max="100" step="5" value={newSkill.level} onChange={handleNewSkillChange} disabled={isSaving}/></div>
                             <Button onClick={addSkill} size="icon" className="flex-shrink-0 mb-0" disabled={isSaving || newSkill.name.trim() === ''}> <Plus className="h-4 w-4" /> </Button>
                        </div>
                    )}
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resume Tab Content */}
        <TabsContent value="resume" className="space-y-6">
           <Card>
              <CardHeader><CardTitle>Resume Management</CardTitle><CardDescription>Upload and manage your resume and professional history</CardDescription></CardHeader>
              <CardContent className="space-y-8">
                 <CVUpload /> {/* Make sure CVUpload is migrated */}

                 {/* Work Experience Section */}
                 <div><h3 className="text-lg font-medium mb-4">Work Experience</h3><div className="space-y-6">
                    {experiences.length === 0 && <p className="text-muted-foreground text-sm">No work experience added yet.</p>}
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-primary"> {/* Timeline style */}
                         <div className="absolute -left-[0.30rem] top-1 h-2.5 w-2.5 rounded-full bg-primary"></div> {/* Timeline dot */}
                         <h4 className="font-medium text-base">{exp.title}</h4>
                         <p className="text-primary">{exp.company}</p>
                         <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                         <p className="mt-1 text-sm">{exp.description}</p>
                      </div>))}
                    {/* TODO: Add editing functionality for experiences if needed */}
                 </div></div>

                 {/* Education Section */}
                 <div><h3 className="text-lg font-medium mb-4">Education</h3><div className="space-y-6">
                    {education.length === 0 && <p className="text-muted-foreground text-sm">No education added yet.</p>}
                    {education.map((edu) => (
                       <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-amber-500"> {/* Timeline style */}
                           <div className="absolute -left-[0.30rem] top-1 h-2.5 w-2.5 rounded-full bg-amber-500"></div> {/* Timeline dot */}
                           <h4 className="font-medium text-base">{edu.degree}</h4>
                           <p className="text-amber-600 dark:text-amber-500">{edu.institution}</p>
                           <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                           <p className="mt-1 text-sm">{edu.description}</p>
                       </div>))}
                       {/* TODO: Add editing functionality for education if needed */}
                 </div></div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* Preferences Tab Content */}
        <TabsContent value="preferences" className="space-y-6">
           <Card>
              <CardHeader><CardTitle>Job Preferences</CardTitle><CardDescription>Configure your job search preferences</CardDescription></CardHeader>
              <CardContent>
                 <div className="space-y-6">
                    {/* --- TODO: Add state and functionality to preferences --- */}
                    <div className="space-y-2"><Label>Job Types</Label><div className="flex flex-wrap gap-2">
                        <Button variant="outline">Full Time</Button>
                        <Button variant="outline">Part Time</Button>
                        <Button variant="outline">Contract</Button>
                        <Button variant="outline">Freelance</Button>
                    </div></div>
                    <div className="space-y-2"><Label>Location Preferences</Label><div className="flex flex-wrap gap-2">
                         <Button variant="outline">Remote</Button>
                         <Button variant="outline">San Francisco, CA</Button>
                         {/* Add input to add more locations */}
                    </div></div>
                    <div className="space-y-2"><Label>Salary Range</Label><div className="flex items-center gap-2">
                         <Input type="range" className="w-full" min="30000" max="200000" step="5000" defaultValue="120000" />
                         <span className="text-sm font-medium w-24 text-right">$120,000+</span> {/* Example value */}
                    </div></div>
                    <div className="space-y-2"><Label>Job Alerts</Label><div className="flex items-center space-x-2">
                         {/* Consider using shadcn/ui Switch or Checkbox component */}
                         <input type="checkbox" id="jobAlerts" defaultChecked className="w-4 h-4 text-primary border-muted rounded focus:ring-primary"/>
                         <Label htmlFor="jobAlerts" className="font-normal">Receive job alerts based on my preferences</Label>
                    </div></div>
                    <Button>Save Preferences</Button> {/* TODO: Add save functionality */}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateProfile;