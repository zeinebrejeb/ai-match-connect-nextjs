"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrainCircuit, Linkedin, Settings, Zap, Sparkles, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, CandidateResult, AISearchResponse } from "@/services/agenticRagApi";



const RecruiterAISearch = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AISearchResponse | null>(null);

  const [jobId, setJobId] = useState<number>(1);
  const [candidateIds, setCandidateIds] = useState<number[]>([1, 2, 3, 4, 5]);


  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      await apiService.checkHealth();
      setApiConnected(true);
      toast({ title: "Success", description: "Connected to the AI backend service." });
    } catch (error) {
      console.log('Backend service not available, will use mock data');
      setApiConnected(false);
      toast({ title: "Connection Failed", description: "Could not connect to the AI backend. Using mock data.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setAnalysisResult(null); 

    try {
      let result: AISearchResponse;

      if (apiConnected) {
       
        result = await apiService.performAiSearch({
          job_id: jobId,
          candidate_ids: candidateIds,
        });
      } else {
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = getMockAnalysis();
      }

      setAnalysisResult(result);

    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* --- Header and Controls --- */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center"><BrainCircuit className="mr-3 h-8 w-8 text-indigo-500" /> AI-Powered Candidate Screening</h1>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center text-sm px-3 py-1 rounded-full ${apiConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${apiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                {apiConnected ? 'API Connected' : 'Mock Mode'}
              </div>
              <Button variant="outline" size="sm" onClick={checkApiConnection}><Settings className="h-4 w-4 mr-2" /> Test</Button>
            </div>
          </div>
          
          {/* --- Action Card --- */}
          <Card className="mb-8">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Analyze Candidates</h3>
                    <p className="text-sm text-gray-500">
                        Analyzing Job ID: <span className="font-mono bg-gray-100 px-1 rounded">{jobId}</span> against {candidateIds.length} selected candidates.
                    </p>
                </div>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Zap className="h-4 w-4 mr-2 animate-pulse" /> Analyzing...
                        </>
                    ) : (
                        <>
                           <Zap className="h-4 w-4 mr-2" /> Start AI Analysis
                        </>
                    )}
                </Button>
            </CardContent>
          </Card>
          
          {/* --- Results Area --- */}
          {analysisResult && (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2 flex items-center"><Sparkles className="h-5 w-5 mr-2 text-yellow-500"/>AI Summary</h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisResult.summary}</p>
                    </CardContent>
                </Card>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Ranked Candidates</h2>
                     <div className="grid gap-4">
                        {analysisResult.ranked_candidates.length > 0 ? (
                           analysisResult.ranked_candidates.map(candidate => (
                             <CandidateCard key={candidate.candidate_id} candidate={candidate} />
                           ))
                        ) : (
                           <p className="text-center text-gray-500 py-8">No relevant candidates found in the analysis.</p>
                        )}
                    </div>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Candidate Card Component (Updated) ---
const CandidateCard: React.FC<{ candidate: CandidateResult }> = ({ candidate }) => {
  const name = candidate.contact_info?.candidate_name || `Candidate #${candidate.candidate_id}`;
  const linkedinUrl = candidate.contact_info?.linkedin_url;

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0 flex flex-col items-center sm:w-1/4">
            <Avatar className="h-20 w-20 mb-3 border-2 border-indigo-200">
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-center">{name}</h3>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800">
              <Star className="h-4 w-4 mr-1.5" />
              {(candidate.final_score * 100).toFixed(1)}% Match
            </div>
             {linkedinUrl && (
                <Button asChild variant="link" size="sm" className="mt-2">
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-1"/> LinkedIn
                    </a>
                </Button>
            )}
          </div>

          <div className="flex-grow">
            <h4 className="text-md font-semibold mb-2">Analysis Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p><strong>Relevance:</strong> {(candidate.details.relevance_score * 100).toFixed(0)}%</p>
                <p><strong>Experience:</strong> {(candidate.details.experience_score * 100).toFixed(0)}%</p>
                <p><strong>Skills:</strong> {(candidate.details.skill_score * 100).toFixed(0)}%</p>
                <p><strong>Education:</strong> {(candidate.details.education_score * 100).toFixed(0)}%</p>
            </div>
             
            <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Candidate Skills</h4>
                <div className="flex flex-wrap gap-1">
                {candidate.extracted_info.candidate_skills.slice(0, 10).map((skill, idx) => (
                  <span key={idx} className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">{skill}</span>
                ))}
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


// --- Mock Data Function ---
const getMockAnalysis = (): AISearchResponse => ({
  summary: "This is a mock analysis summary. The top candidate, Alex Johnson, shows strong alignment with the job's key requirements, particularly in experience and technical skills. Sarah Miller is also a promising candidate worth considering for an initial screening call.",
  ranked_candidates: [
    {
      candidate_id: "101",
      final_score: 0.92,
      details: { relevance_score: 0.9, experience_score: 0.95, skill_score: 0.9, education_score: 0.85 },
      extracted_info: {
        required_skills: ["React", "TypeScript", "Node.js"],
        candidate_skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
        required_experience: 5,
        candidate_experience: 7,
      },
      contact_info: { candidate_name: "Alex Johnson", linkedin_url: "https://linkedin.com/in/alexjohnson" }
    },
    {
      candidate_id: "102",
      final_score: 0.85,
      details: { relevance_score: 0.88, experience_score: 0.8, skill_score: 0.88, education_score: 0.9 },
      extracted_info: {
        required_skills: ["React", "TypeScript", "Node.js"],
        candidate_skills: ["React", "Node.js", "Python", "MongoDB"],
        required_experience: 5,
        candidate_experience: 5,
      },
      contact_info: { candidate_name: "Sarah Miller", linkedin_url: "https://linkedin.com/in/sarahmiller" }
    }
  ]
});

export default RecruiterAISearch;
