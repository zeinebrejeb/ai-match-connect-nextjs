"use client"; 
import React, { useState, useEffect } from "react"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BriefcaseIcon, Search, MapPin, Clock, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"; 

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  skills: string[];
  matchScore?: number; 
}

const JobsListing = () => { 
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [jobType, setJobType] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([50, 150]);
  const [onlyMatches, setOnlyMatches] = useState(false);

  const initialJobs: Job[] = [
    { id: 1, title: "Senior Frontend Developer", company: "Tech Innovators Inc.", companyLogo: "TI", location: "Remote", type: "Full-time", salary: "$120K - $150K", postedDate: "2 days ago", description: "We are seeking an experienced Frontend Developer proficient in React, TypeScript, and modern frontend development practices to join our innovative team.", skills: ["React", "TypeScript", "Redux", "CSS3", "HTML5"], matchScore: 95 },
    { id: 2, title: "Full Stack Engineer", company: "Digital Solutions Ltd.", companyLogo: "DS", location: "San Francisco, CA", type: "Full-time", salary: "$130K - $160K", postedDate: "1 week ago", description: "Join our engineering team to build scalable web applications using React, Node.js, and cloud technologies.", skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"], matchScore: 88 },
    { id: 3, title: "Backend Developer", company: "Data Systems", companyLogo: "DS", location: "Austin, TX", type: "Full-time", salary: "$115K - $140K", postedDate: "3 days ago", description: "Looking for a skilled backend developer to work on our distributed systems and APIs.", skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"], matchScore: 82 },
    { id: 4, title: "UI/UX Developer", company: "Creative Design Studio", companyLogo: "CD", location: "New York, NY (Hybrid)", type: "Full-time", salary: "$110K - $135K", postedDate: "5 days ago", description: "Join our creative team to build beautiful, intuitive interfaces for our clients.", skills: ["React", "CSS/SCSS", "Figma", "UI Design", "User Testing"], matchScore: 78 },
    { id: 5, title: "DevOps Engineer", company: "Cloud Technologies", companyLogo: "CT", location: "Seattle, WA", type: "Full-time", salary: "$125K - $155K", postedDate: "1 week ago", description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.", skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"], matchScore: 72 },
    { id: 6, title: "React Native Developer", company: "Mobile App Innovations", companyLogo: "MA", location: "Remote", type: "Contract", salary: "$100K - $130K", postedDate: "2 weeks ago", description: "Develop cross-platform mobile applications using React Native for our clients.", skills: ["React Native", "JavaScript", "TypeScript", "Redux", "Mobile Development"], matchScore: 68 },
    { id: 7, title: "Frontend Developer (Part-time)", company: "Startup Labs", companyLogo: "SL", location: "Remote", type: "Part-time", salary: "$40 - $60/hr", postedDate: "3 days ago", description: "Looking for a part-time frontend developer to help with our web application.", skills: ["React", "CSS", "HTML", "JavaScript"], matchScore: 65 },
    { id: 8, title: "Senior Python Developer", company: "AI Research Inc.", companyLogo: "AI", location: "Boston, MA", type: "Full-time", salary: "$140K - $170K", postedDate: "4 days ago", description: "Join our AI team to develop machine learning models and algorithms.", skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "AI"], matchScore: 60 }
  ];

  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const toggleJobType = (type: string) => {
    if (jobType.includes(type)) {
      setJobType(jobType.filter(t => t !== type));
    } else {
      setJobType([...jobType, type]);
    }
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const applyFilters = () => {
    let filtered = [...initialJobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (jobType.length > 0) {
      filtered = filtered.filter(job => jobType.includes(job.type));
    }

    filtered = filtered.filter(job => {
      const salaryMatch = job.salary.match(/\d+/); 
      if (!salaryMatch) return false; 

      const numericValue = parseInt(job.salary.replace(/[^0-9.]/g, '')); 
      if (isNaN(numericValue)) return false; 

      return numericValue >= salaryRange[0] && numericValue <= salaryRange[1];
    });


    if (onlyMatches) {
      filtered = filtered.filter(job => (job.matchScore || 0) >= 80);
    }

    switch (sortBy) {
      case 'relevance':
        filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const daysA = parseInt(a.postedDate.split(' ')[0]);
          const daysB = parseInt(b.postedDate.split(' ')[0]);
          if (isNaN(daysA) || isNaN(daysB)) {
            return 0; 
          }
          return daysA - daysB; 
        });
        break;
      case 'salary-high':
        filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9.]/g, ''));
          const salaryB = parseInt(b.salary.replace(/[^0-9.]/g, ''));
          if (isNaN(salaryA) || isNaN(salaryB)) return 0;
          return salaryB - salaryA; 
        });
        break;
      case 'salary-low':
        filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9.]/g, ''));
          const salaryB = parseInt(b.salary.replace(/[^0-9.]/g, ''));
          if (isNaN(salaryA) || isNaN(salaryB)) return 0; 
          return salaryA - salaryB; 
        });
        break;
    }

    setJobs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, jobType, salaryRange, onlyMatches, sortBy, initialJobs]); 

  const getMatchScoreClass = (score?: number) => {
    if (!score || score < 75) return "bg-amber-500 dark:bg-amber-700";
    if (score >= 90) return "bg-emerald-500 dark:bg-emerald-700";
    if (score >= 75) return "bg-brand-500 dark:bg-brand-700";
    return "bg-gray-200 dark:bg-gray-700";
  };

  const getMatchTextClass = (score?: number) => {
    if (!score || score < 75) return "text-amber-500 dark:text-amber-400";
    if (score >= 90) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 75) return "text-brand-600 dark:text-brand-400";
    return "text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="flex flex-col min-h-screen">
     
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Find Your Perfect Job Match</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
              Browse through AI-matched job listings tailored to your skills and experience.
              Our matching algorithm helps you find opportunities that align with your career goals.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search for jobs, skills, or companies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={toggleFilters} className="flex items-center gap-2 md:w-auto w-full justify-center">
              <Filter className="h-4 w-4" />
              Filters
              {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {filtersOpen && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Job Type</h3>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`job-type-${type}`}
                          checked={jobType.includes(type)}
                          onChange={() => toggleJobType(type)}
                          className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-brand-500 dark:checked:border-brand-500"
                        />
                        <label htmlFor={`job-type-${type}`} className="ml-2 text-gray-700 dark:text-gray-300">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Salary Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={salaryRange}
                      min={30}
                      max={200}
                      step={10}
                      onValueChange={(value) => setSalaryRange(value as number[])}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>${salaryRange[0]}K</span>
                      <span>${salaryRange[1]}K</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Matching</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="only-matches"
                      checked={onlyMatches}
                      onCheckedChange={setOnlyMatches}
                    />
                    <Label htmlFor="only-matches">Show only high matches (80%+)</Label>
                  </div>

                  <h3 className="font-medium text-lg mt-6">Sort By</h3>
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

          <div className="flex justify-between items-center mb-4 text-gray-600 dark:text-gray-400">
            <p>
              Found <span className="font-medium text-gray-900 dark:text-white">{jobs.length}</span> jobs
            </p>
            <div className="flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">
                Sorted by: {sortBy === 'relevance' ? 'Match Score' : sortBy === 'recent' ? 'Most Recent' : sortBy === 'salary-high' ? 'Salary (High to Low)' : 'Salary (Low to High)'}
              </span>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center text-gray-900 dark:text-white">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search terms to find more opportunities.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setJobType([]);
                setSalaryRange([50, 150]);
                setOnlyMatches(false);
                setSortBy("relevance");
              }} className="mt-4">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                  {job.matchScore !== undefined && (
                    <div className={`h-1 ${getMatchScoreClass(job.matchScore)}`}></div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
                      <Avatar className="h-14 w-14 rounded-md border border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <AvatarFallback className="bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300 rounded-md">
                          {job.companyLogo}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-grow">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                          </div>

                          {job.matchScore !== undefined && (
                            <div className="flex items-center gap-1">
                              <span className={`font-semibold ${getMatchTextClass(job.matchScore)}`}>
                                {job.matchScore}%
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">match</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-gray-500 dark:text-gray-400">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm">
                            <BriefcaseIcon className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            Posted {job.postedDate}
                          </div>
                        </div>

                        <p className="mt-4 text-gray-700 dark:text-gray-300">
                          {job.description}
                        </p>

                        <div className="mt-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs rounded-full px-3 py-1"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between items-center text-gray-900 dark:text-white">
                    <p className="font-medium">{job.salary}</p>
                    <Button>Apply Now</Button>
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

export default JobsListing;