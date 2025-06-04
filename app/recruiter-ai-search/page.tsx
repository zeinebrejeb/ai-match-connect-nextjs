'use client'; 
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Briefcase, Award } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string | React.ReactNode;
  role: "user" | "assistant";
  timestamp: Date;
}

interface CandidateResult {
  id: string;
  name: string;
  matchScore: number;
  title: string;
  experience: string;
  location: string;
  skills: string[];
  avatarUrl?: string;
}

const CandidateCard: React.FC<{ candidate: CandidateResult }> = ({ candidate }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/4 bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center justify-center text-center border-r border-gray-200 dark:border-gray-800">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={candidate.avatarUrl} />
              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium">{candidate.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{candidate.title}</p>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              {candidate.matchScore}% Match
            </div>
          </div>
          
          <div className="sm:w-3/4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{candidate.experience}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{candidate.location}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Top {Math.floor(Math.random() * 10) + 1}%</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="mr-2">View Details</Button>
              <Button size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default function RecruiterAISearch() { 
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello recruiter! Ask me about candidate skills or requirements, and I'll find the best matches for you. For example: 'Find candidates with React experience and AWS skills' or 'Who has worked with machine learning for over 3 years?'",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const candidates: CandidateResult[] = [
    {
      id: "c1",
      name: "Alex Johnson",
      matchScore: 95,
      title: "Senior Frontend Developer",
      experience: "7+ years",
      location: "San Francisco, CA",
      skills: ["React", "TypeScript", "Next.js", "GraphQL", "AWS"],
      avatarUrl: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: "c2",
      name: "Sarah Miller",
      matchScore: 89,
      title: "Full Stack Engineer",
      experience: "5+ years",
      location: "New York, NY",
      skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
      avatarUrl: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: "c3",
      name: "David Chen",
      matchScore: 82,
      title: "Backend Developer",
      experience: "4+ years",
      location: "Remote",
      skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
      avatarUrl: "https://i.pravatar.cc/150?img=12"
    },
    {
      id: "c4",
      name: "Emily Wilson",
      matchScore: 78,
      title: "Machine Learning Engineer",
      experience: "3+ years",
      location: "Boston, MA",
      skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "AWS"],
      avatarUrl: "https://i.pravatar.cc/150?img=9"
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;


    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: query,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuery("");

    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      

      let filteredCandidates = [...candidates];
      const lowercaseQuery = query.toLowerCase();
      

      if (lowercaseQuery.includes("react")) {
        filteredCandidates = filteredCandidates.filter(c => 
          c.skills.some(skill => skill.toLowerCase().includes("react"))
        );
      }
      
      if (lowercaseQuery.includes("python")) {
        filteredCandidates = filteredCandidates.filter(c => 
          c.skills.some(skill => skill.toLowerCase().includes("python"))
        );
      }
      
      if (lowercaseQuery.includes("machine learning")) {
        filteredCandidates = filteredCandidates.filter(c => 
          c.title.toLowerCase().includes("machine learning") || 
          c.skills.some(skill => skill.toLowerCase().includes("tensorflow") || skill.toLowerCase().includes("pytorch"))
        );
      }
      

      const responseContent = (
        <div className="space-y-4">
          <p className="mb-2">
            Based on your query `{query}`, I found {filteredCandidates.length} matching candidates:
          </p>
          <div className="grid gap-4">
            {filteredCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            You can ask more specific questions to refine your search.
          </p>
        </div>
      );


      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">AI Resume Search</h1>
          
          <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
         
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[90%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {typeof message.content === "string" ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        message.content
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.role === "user"
                            ? "text-brand-100"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about specific skills, experience, or candidate profiles..."
                  disabled={isLoading}
                  className="flex-grow"
                />
                <Button type="submit" disabled={!query.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
} 