"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, ChevronRight, Search, Star, Bell } from "lucide-react";
import MatchCard from "@/components/matching/MatchCard";
import ChatAssistant from "@/components/ai/ChatAssistant";
import { useRouter } from "next/navigation";


const recruiterMatchData = [
  {
    id: 1,
    name: "Michael Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
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

const RecruiterDashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const router = useRouter();

  const toggleAIChat = () => setShowAIChat(!showAIChat);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Card */}
              <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome back, Jane!</CardTitle>
                  <CardDescription className="text-brand-100">
                    Here's your candidate matches for your active job listings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                      <div className="text-3xl font-bold">87%</div>
                      <div className="text-sm text-brand-100">Profile Completeness</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                      <div className="text-3xl font-bold">42</div>
                      <div className="text-sm text-brand-100">Total Applicants</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                      <div className="text-3xl font-bold">12</div>
                      <div className="text-sm text-brand-100">High Match Candidates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Matches */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Top Candidate Matches</h2>
                  <Button variant="link" className="flex items-center p-0">
                    See all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {recruiterMatchData.map((candidate, index) => (
                    <MatchCard
                      key={candidate.id}
                      type="candidate"
                      data={candidate}
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
                  <CardTitle className="text-lg flex items-center">AI Recruiting Assistant</CardTitle>
                  <CardDescription>
                    Get AI-powered candidate recommendations and insights
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
                    onClick={() => router.push("/post-job")}

                   >
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
                      <p className="font-medium">New application</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        David Chen applied for Frontend Engineer
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">1 hour ago</p>
                    </li>
                    <li className="border-l-2 border-accent2-500 pl-4 py-1">
                      <p className="font-medium">New high match candidate</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Emma Rodriguez matches your Full Stack Developer role
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Yesterday</p>
                    </li>
                    <li className="border-l-2 border-accent1-500 pl-4 py-1">
                      <p className="font-medium">Job listing view</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Senior React Developer has 24 new views
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
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;