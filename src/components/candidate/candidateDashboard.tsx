"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Star, Bell, Check } from "lucide-react";
import MatchCard from "@/components/matching/MatchCard";
import ChatAssistant from "@/components/ai/ChatAssistant";
import { useRouter } from "next/navigation";

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

const CandidateDashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const router = useRouter();

  const toggleAIChat = () => setShowAIChat(!showAIChat);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Card */}
              <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome back, John!</CardTitle>
                  <CardDescription className="text-brand-100">
                    Here's your personalized job matches based on your profile and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                      <div className="text-3xl font-bold">92%</div>
                      <div className="text-sm text-brand-100">Profile Completeness</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                      <div className="text-3xl font-bold">28</div>
                      <div className="text-sm text-brand-100">Matching Jobs</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                      <div className="text-3xl font-bold">5</div>
                      <div className="text-sm text-brand-100">High Match Jobs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Matches */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Your Top Job Matches
                  </h2>
                  <Button variant="link" className="flex items-center p-0">
                    See all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {candidateMatchData.map((job, index) => (
                    <MatchCard
                      key={job.id}
                      type="job"
                      data={job}
                      matchScore={95 - index * 5}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* AI Assistant */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">AI Career Assistant</CardTitle>
                  <CardDescription>
                    Get personalized career advice and job recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showAIChat ? (
                    <ChatAssistant onClose={toggleAIChat} />
                  ) : (
                    <Button onClick={toggleAIChat} variant="default" className="w-full">
                      Chat with AI Assistant
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/jobs")}

                  >
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
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-brand-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="border-l-2 border-brand-500 pl-4 py-1">
                      <p className="font-medium">New job match found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Senior Frontend Developer at Tech Innovators
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">2 hours ago</p>
                    </li>
                    <li className="border-l-2 border-brand-300 pl-4 py-1">
                      <p className="font-medium">Profile view</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your profile was viewed by Digital Solutions Ltd.
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Yesterday</p>
                    </li>
                    <li className="border-l-2 border-accent1-500 pl-4 py-1">
                      <p className="font-medium">Application status update</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your application is being reviewed at TechCorp
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">2 days ago</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;