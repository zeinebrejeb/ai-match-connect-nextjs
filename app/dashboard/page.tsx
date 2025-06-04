"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AxiosError } from 'axios';
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, Users, ChevronRight, Search, Star, Bell, Check } from "lucide-react";
import MatchCard from "@/components/matching/MatchCard";
import ChatAssistant from "@/components/ai/ChatAssistant";


interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: 'candidate' | 'recruiter' | 'admin';
  profileCompleteness?: string | number; 
  matchingJobsCount?: number;
  highMatchJobsCount?: number;
  activeJobsCount?: number; 
  totalApplicantsCount?: number; 
  highMatchCandidatesCount?: number; 
}


const candidateMatchData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovators Inc.",
    location: "Remote",
    postedDate: "2 days ago",
    salary: "$120K - $150K",
    skills: ["React", "TypeScript", "Redux", "GraphQL"],
    matchReasons: [
      "Your React experience directly matches job requirements",
      "Your TypeScript skill level is exactly what they're looking for",
      "You have the specific experience with GraphQL they require"
    ]
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Digital Solutions Ltd.",
    location: "San Francisco, CA",
    postedDate: "1 week ago",
    salary: "$130K - $160K",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    matchReasons: [
      "Your full stack experience is a perfect fit",
      "Your MongoDB expertise matches their database needs",
      "You have the AWS experience they require"
    ]
  },
  {
    id: 3,
    title: "UI/UX Developer",
    company: "Creative Design Studio",
    location: "New York, NY (Hybrid)",
    postedDate: "3 days ago",
    salary: "$110K - $140K",
    skills: ["React", "CSS/SCSS", "Figma", "UI Design"],
    matchReasons: [
      "Your frontend skills align with their requirements",
      "Your experience with Figma is valuable for this role",
      "Your UI design experience is a plus"
    ]
  }
];

const recruiterMatchData = [
  {
    id: 1,
    name: "Michael Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Senior React Developer",
    location: "San Francisco, CA",
    experience: "6+ years",
    skills: ["React", "TypeScript", "Redux", "Node.js", "MongoDB"],
    matchReasons: [
      "7+ years of React development experience",
      "Expert in TypeScript and state management",
      "Led development teams of 5+ engineers"
    ]
  },
  {
    id: 2,
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Full Stack Developer",
    location: "Remote",
    experience: "5+ years",
    skills: ["React", "Node.js", "Express", "MongoDB", "AWS"],
    matchReasons: [
      "Strong full-stack development background",
      "Experience with your exact tech stack",
      "Built and deployed multiple production applications"
    ]
  },
  {
    id: 3,
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title: "Frontend Engineer",
    location: "New York, NY",
    experience: "4+ years",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    matchReasons: [
      "Specialized in React performance optimization",
      "Experience with design systems and component libraries",
      "Strong focus on responsive, accessible UI development"
    ]
  }
];


const DashboardPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const [viewAsRole, setViewAsRole] = useState<'candidate' | 'recruiter' | undefined>(undefined);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<User>('/users/me');
        setUserData(response.data);

        if (response.data.role === 'candidate' || response.data.role === 'recruiter') {
          setViewAsRole(response.data.role);
        } else if (response.data.role === 'admin') {
          setViewAsRole('candidate'); 
        } else {
          setViewAsRole('candidate'); 
        }
      } catch (err) {
        console.error("Failed to fetch user data for dashboard:", err);
        if (err instanceof AxiosError) {

          if (err.response?.status !== 401 && err.response?.status !== 403) {
            const errorData = err.response?.data as { detail?: string };
            setError(errorData?.detail || err.message || "Failed to load dashboard data.");
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while loading dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

    const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };


  const displayRole = viewAsRole || userData?.role || 'candidate';
  const displayName = userData?.first_name || userData?.email || "User";


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow flex items-center justify-center pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
          <p>Loading dashboard...</p>
        </main>
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow flex items-center justify-center pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
          <p className="text-red-500">Error loading dashboard: {error}</p>
          <Link href="/auth" className="mt-4 text-brand-600 hover:underline">
            Try logging in again
          </Link>
        </main>
       
      </div>
    );
  }


  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow flex items-center justify-center pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
          <p>Preparing your dashboard. You might be redirected if not authenticated.</p>
        </main>
        
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> {}
              {displayRole === "candidate" ? "Candidate Dashboard" : "Recruiter Dashboard"}
            </h1>
             
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className={displayRole === "candidate" ? "border-brand-500 text-brand-500 dark:text-brand-400 dark:border-brand-400" : ""} // Added dark mode styles
                onClick={() => setViewAsRole("candidate")}
              >
                Candidate View
              </Button>
              <Button
                variant="outline"
                className={displayRole === "recruiter" ? "border-brand-500 text-brand-500 dark:text-brand-400 dark:border-brand-400" : ""} // Added dark mode styles
                onClick={() => setViewAsRole("recruiter")}
              >
                Recruiter View
              </Button>
            </div>
          </div>  */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              <div className="space-y-8">

                <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white dark:from-brand-700 dark:to-brand-900 dark:text-gray-100"> {/* Added dark mode gradients and text color */}
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Welcome back, {displayName === "candidate" ? "John" : "Jane"}! {/* Hardcoded names */}
                    </CardTitle>
                    <CardDescription className="text-brand-100 dark:text-brand-200"> {/* Added dark mode text color */}
                      {displayRole === "candidate"
                        ? "Here's your personalized job matches based on your profile and preferences."
                        : "Here's your candidate matches for your active job listings."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center"> {/* Added dark mode background */}
                        <div className="text-3xl font-bold">
                          {displayRole === "candidate" ? "92%" : "87%"}
                        </div>
                        <div className="text-sm text-brand-100 dark:text-brand-200">Profile Completeness</div> {/* Added dark mode text color */}
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center"> {/* Added dark mode background */}
                        <div className="text-3xl font-bold">
                          {displayRole === "candidate" ? "28" : "42"}
                        </div>
                        <div className="text-sm text-brand-100 dark:text-brand-200"> {/* Added dark mode text color */}
                          {displayRole === "candidate" ? "Matching Jobs" : "Total Applicants"}
                        </div>
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center"> {/* Added dark mode background */}
                        <div className="text-3xl font-bold">
                          {displayRole === "candidate" ? "5" : "12"}
                        </div>
                        <div className="text-sm text-brand-100 dark:text-brand-200"> {/* Added dark mode text color */}
                          {displayRole === "candidate" ? "High Match Jobs" : "High Match Candidates"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Matches */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {displayRole === "candidate" ? "Your Top Job Matches" : "Top Candidate Matches"}
                    </h2>
                     {/* This button uses variant="link" but doesn't navigate in this code.
                         If it should navigate to a "See All Jobs" or "See All Candidates" page,
                         you would wrap it with next/link asChild:
                         <Button variant="link" className="flex items-center p-0" asChild>
                           <Link href={displayRole === "candidate" ? "/all-jobs" : "/all-candidates"}>
                             See all <ChevronRight className="h-4 w-4 ml-1" />
                           </Link>
                         </Button>
                        <Button variant="link" className="flex items-center p-0 text-brand-600 dark:text-brand-400">
                        See all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                     */}

                     <Button variant="link" className="flex items-center p-0" asChild>
                           <Link href={displayRole === "candidate" ? "/all-jobs" : "/all-candidates"}>
                             See all <ChevronRight className="h-4 w-4 ml-1" />
                           </Link>
                      </Button>
                  </div>

                  <div className="space-y-6">
                    {displayRole === "candidate" ? (
                      candidateMatchData.map((job, index) => (
                        <MatchCard
                          key={job.id}
                          type="job" // MatchCard needs 'type'
                          data={job} // MatchCard needs 'data'
                          matchScore={95 - index * 5} // Simulated score
                        />
                      ))
                    ) : (
                      recruiterMatchData.map((candidate, index) => (
                        <MatchCard
                          key={candidate.id}
                          type="candidate" // MatchCard needs 'type'
                          data={candidate} // MatchCard needs 'data'
                          matchScore={95 - index * 5} // Simulated score
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* AI Assistant */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white"> {/* Added text colors */}
                      <Users className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" /> {/* Added dark color */}
                      AI Career Assistant
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400"> {/* Added text colors */}
                      Get personalized career advice and job recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showAIChat ? (
                      <ChatAssistant onClose={toggleAIChat} /> 
                    ) : (
                      <Button
                        onClick={toggleAIChat}
                        variant="default"
                        className="w-full"
                      >
                        Chat with AI Assistant
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Actions</CardTitle> {/* Added text colors */}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {displayRole === "candidate" ? (
                      <>
                        {/* These buttons don't navigate in this code. If they should navigate, wrap with next/link asChild */}
                        {/* Example:
                           <Button variant="outline" className="w-full justify-start" asChild>
                              <Link href="/jobs">
                                 <Search className="h-4 w-4 mr-2" /> Search Jobs
                              </Link>
                           </Button>
                        */}
                        <Button variant="outline" className="w-full justify-start">
                          <Search className="h-4 w-4 mr-2" />
                          Search Jobs
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Check className="h-4 w-4 mr-2" />
                          Update Skills
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Star className="h-4 w-4 mr-2" />
                          Saved Jobs
                        </Button>
                      </>
                    ) : (
                      <>
                         {/* These buttons don't navigate in this code. If they should navigate, wrap with next/link asChild */}
                         {/* Example:
                           <Button variant="outline" className="w-full justify-start" asChild>
                              <Link href="/post-job"> // Or a modal trigger
                                 <BriefcaseIcon className="h-4 w-4 mr-2" /> Post New Job
                              </Link>
                           </Button>
                        */}
                        <Button variant="outline" className="w-full justify-start">
                          <BriefcaseIcon className="h-4 w-4 mr-2" />
                          Post New Job
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Search className="h-4 w-4 mr-2" />
                          Search Candidates
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Star className="h-4 w-4 mr-2" />
                          Saved Candidates
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white"> {/* Added text colors */}
                      <Bell className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" /> {/* Added dark color */}
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 text-gray-700 dark:text-gray-300"> {/* Added text colors to list items */}
                      {displayRole === "candidate" ? (
                        <>
                          <li className="border-l-2 border-brand-500 pl-4 py-1">
                            <p className="font-medium">New job match found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Senior Frontend Developer at Tech Innovators
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              2 hours ago
                            </p>
                          </li>
                          <li className="border-l-2 border-brand-300 pl-4 py-1"> {/* Border color dark mode missing? */}
                            <p className="font-medium">Profile view</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Your profile was viewed by Digital Solutions Ltd.
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Yesterday
                            </p>
                          </li>
                          <li className="border-l-2 border-accent1-500 pl-4 py-1"> {/* Border color dark mode missing? */}
                            <p className="font-medium">Application status update</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Your application is being reviewed at TechCorp
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              2 days ago
                            </p>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="border-l-2 border-brand-500 pl-4 py-1"> {/* Border color dark mode missing? */}
                            <p className="font-medium">New application</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              David Chen applied for Frontend Engineer
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              1 hour ago
                            </p>
                          </li>
                          <li className="border-l-2 border-accent2-500 pl-4 py-1"> {/* Border color dark mode missing? */}
                            <p className="font-medium">New high match candidate</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Emma Rodriguez matches your Full Stack Developer role
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Yesterday
                            </p>
                          </li>
                          <li className="border-l-2 border-accent1-500 pl-4 py-1"> {/* Border color dark mode missing? */}
                            <p className="font-medium">Job listing view</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Senior React Developer has 24 new views
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              2 days ago
                            </p>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default DashboardPage;