"use client"; 
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation'; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent ,SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BriefcaseIcon, Search, MapPin, Clock, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"; // Removed Building as it's not used
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage,AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link"; 
import { useAuth } from '@/context/AuthContext'; 


interface Job {
  id: number; 
  title: string;
  company: string;
  companyLogo?: string; 
  location: string;
  type: string; 
  salary: string; 
  postedDate: string;
  description: string;
  skills: string[];
  matchScore?: number;
  // Example of more structured data from backend:
  // salaryMin?: number;
  // salaryMax?: number;
  // salaryCurrency?: string;
  // salaryPeriod?: 'year' | 'month' | 'hour';
  // postedAt?: string; // ISO Date string
}

async function fetchJobsFromAPI(): Promise<Job[]> {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "Tech Innovators Inc.",
          companyLogo: "TI",
          location: "Remote",
          type: "Full-time",
          salary: "$120K - $150K",
          postedDate: "2 days ago", 
          description: "We are seeking an experienced Frontend Developer proficient in React, TypeScript, and modern frontend development practices to join our innovative team.",
          skills: ["React", "TypeScript", "Redux", "CSS3", "HTML5"],
          matchScore: 95
        },
        {
          id: 2,
          title: "Full Stack Engineer",
          company: "Digital Solutions Ltd.",
          companyLogo: "DS",
          location: "San Francisco, CA",
          type: "Full-time",
          salary: "$130K - $160K",
          postedDate: "7 days ago", 
          description: "Join our engineering team to build scalable web applications using React, Node.js, and cloud technologies.",
          skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
          matchScore: 88
        },
      ]);
    }, 500);
  });
}


const JobsPage = () => {
  const router = useRouter(); 

  const [allJobs, setAllJobs] = useState<Job[]>([]); 
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [jobType, setJobType] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([50, 150]); 
  const [onlyMatches, setOnlyMatches] = useState(false);
  const { role } = useAuth();

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const fetchedJobs = await fetchJobsFromAPI();
        setAllJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);


  const toggleJobType = (type: string) => {
    setJobType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };


  const applyFiltersAndSort = useCallback(() => {
    let processedJobs = [...allJobs];

  
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      processedJobs = processedJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    
    if (jobType.length > 0) {
      processedJobs = processedJobs.filter(job => jobType.includes(job.type));
    }

    processedJobs = processedJobs.filter(job => {
      const salaryText = job.salary.toLowerCase();
      let minJobSalaryK = 0;
      if (salaryText.includes('k')) {
        const numbers = salaryText.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          minJobSalaryK = parseInt(numbers[0], 10);
        }
      } else if (salaryText.includes('/hr')) {
        const hourlyRate = parseInt(salaryText.match(/\d+/g)?.[0] || '0', 10);
        minJobSalaryK = (hourlyRate * 40 * 52) / 1000; 
      }
     
      return minJobSalaryK >= salaryRange[0] && (minJobSalaryK <= salaryRange[1] || salaryRange[1] === 200); // 200 might mean max
    });

    
    if (onlyMatches) {
      processedJobs = processedJobs.filter(job => (job.matchScore || 0) >= 80);
    }

    switch (sortBy) {
      case 'relevance':
        processedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case 'recent':
      
        processedJobs.sort((a, b) => {
          const daysA = parseInt(a.postedDate.split(" ")[0]) || 0; 
          const daysB = parseInt(b.postedDate.split(" ")[0]) || 0; 
          return daysA - daysB; 
        });
        break;
      case 'salary-high':
        processedJobs.sort((a, b) => {
          const salaryA = parseInt(a.salary.match(/\d+/g)?.[0] || '0'); 
          const salaryB = parseInt(b.salary.match(/\d+/g)?.[0] || '0');
          return salaryB - salaryA;
        });
        break;
      case 'salary-low':
        processedJobs.sort((a, b) => {
          const salaryA = parseInt(a.salary.match(/\d+/g)?.[0] || '0'); 
          const salaryB = parseInt(b.salary.match(/\d+/g)?.[0] || '0'); 
          return salaryA - salaryB;
        });
        break;
    }
    setFilteredJobs(processedJobs);
  }, [allJobs, searchQuery, jobType, salaryRange, onlyMatches, sortBy]);

  
  useEffect(() => {
    if (!isLoading) { 
        applyFiltersAndSort();
    }
  }, [isLoading, applyFiltersAndSort]); 
  const getMatchScoreClass = (score?: number) => {
    if (!score) return "bg-gray-200 dark:bg-gray-700";
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-brand-500";
    return "bg-amber-500";
  };

  const getMatchTextClass = (score?: number) => {
    if (!score) return "text-gray-500 dark:text-gray-400";
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-brand-600"; 
    return "text-amber-500";
  };

  const handleApplyClick = (jobId: number | string) => {
    router.push(`/apply/${jobId}`); 
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Loading jobs...</p> 
        </div>
    );
  }

  return (

    <div className="flex flex-col min-h-screen">
     
      <main className="flex-grow pt-8 pb-12 bg-gray-50 dark:bg-gray-900"> 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Find Your Perfect Job Match</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto md:mx-0">
              Browse through AI-matched job listings tailored to your skills and experience.
            </p>
          </div>

      
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                className="pl-10"
                placeholder="Search jobs, skills, or companies (e.g., React, Google)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={toggleFilters} variant="outline" className="flex items-center gap-2 md:w-auto w-full justify-center shrink-0">
              <Filter className="h-4 w-4" />
              Filters
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Filters Section */}
          {filtersOpen && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Job Type Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Job Type</h3>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`job-type-${type}`}
                          checked={jobType.includes(type)}
                          onChange={() => toggleJobType(type)}
                          className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                        />
                        <label htmlFor={`job-type-${type}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Annual Salary Range (USD)</h3>
                  <div className="px-1"> 
                    <Slider
                      value={salaryRange} 
                      min={30}  
                      max={200} 
                      step={10}
                      onValueChange={(value) => setSalaryRange(value as [number, number])} 
                      className="mt-2"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>${salaryRange[0]}K</span>
                      <span>{salaryRange[1] >= 200 ? `$${salaryRange[1]}K+` : `$${salaryRange[1]}K`}</span>
                    </div>
                  </div>
                </div>

                {/* Matching & Sorting */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Matching</h3>
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id="only-matches"
                      checked={onlyMatches}
                      onCheckedChange={setOnlyMatches}
                    />
                    <Label htmlFor="only-matches" className="text-sm">Show high matches (80%+)</Label>
                  </div>

                  <h3 className="font-medium text-lg pt-3">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Match Score</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="salary-high">Salary (High to Low)</SelectItem>
                      <SelectItem value="salary-low">Salary (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{allJobs.length}</span> jobs
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
              Sorted by: <span className="font-medium capitalize ml-1">{sortBy.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Job Listings */}
          {filteredJobs.length === 0 && !isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No jobs found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search terms.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setJobType([]);
                setSalaryRange([50, 150]);
                setOnlyMatches(false);
                setSortBy("relevance");
              }} className="mt-6">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden">
                  {job.matchScore && (
                    <div className={`h-1.5 ${getMatchScoreClass(job.matchScore)}`}></div>
                  )}
                  <CardContent className="p-5 flex-grow">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0 mt-1">
                        { <AvatarImage src={job.companyLogo} alt={`${job.company} logo`} />}
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-brand-700 dark:text-brand-300 rounded-lg text-lg">
                          {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <Link href={`/jobs/${job.id}`} className="group">
                          <h3 className="font-semibold text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{job.title}</h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                        {job.matchScore && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`font-bold text-sm ${getMatchTextClass(job.matchScore)}`}>
                              {job.matchScore}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">match</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          Posted {job.postedDate} 
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {job.description}
                    </p>
                    {job.skills && job.skills.length > 0 && (
                        <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                            {job.skills.slice(0, 5).map((skill, idx) => ( 
                            <span
                                key={idx}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2.5 py-0.5 font-medium"
                            >
                                {skill}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between items-center border-t dark:border-gray-700">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{job.salary}</p>
                     {role === 'candidate' && (
                  <Button asChild>
                    <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
                  </Button>
                )}         
                     </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobsPage;