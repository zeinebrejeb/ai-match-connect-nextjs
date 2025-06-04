import React from "react";
import Link from "next/link"; 
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BriefcaseIcon, MapPin, Clock, Check, X, Star } from "lucide-react";

interface MatchCardProps {
  type: "job" | "candidate";
  data: {
    id: string | number; 
    title?: string;
    company?: string; 
    avatar?: string; 
    name?: string; 
    location: string;
    postedDate?: string; 
    experience?: string; 
    skills: string[];
    matchReasons: string[];
  };
  matchScore: number;
}

const MatchCard: React.FC<MatchCardProps> = ({ type, data, matchScore }) => {
  const isJob = type === "job";

  const getScoreClass = () => {
    if (matchScore >= 90) return "text-emerald-500";
    if (matchScore >= 75) return "text-brand-600";
    return "text-amber-500";
  };

  return (
    <Card className={`hover:shadow-md transition-shadow overflow-hidden border ${matchScore >= 90 ? "border-emerald-200 dark:border-emerald-900" :
        matchScore >= 75 ? "border-brand-200 dark:border-brand-900" :
          "border-amber-200 dark:border-amber-900"
      }`}>
      <div className={`h-2 ${matchScore >= 90 ? "bg-emerald-500" :
            matchScore >= 75 ? "bg-brand-500" :
              "bg-amber-500"
          }`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {isJob ? (
              <>
                <div className="h-12 w-12 rounded-md bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">{data.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{data.company}</p>
                </div>
              </>
            ) : (
              <>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={data.avatar} />
                  <AvatarFallback>{data.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">{data.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{data.title}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center">
            <div className={`text-lg font-bold ${getScoreClass()}`}>
              {matchScore}%
            </div>
            <div className="ml-1 text-sm text-gray-500 dark:text-gray-400">match</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {data.location}
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Clock className="h-4 w-4 mr-1" />
            {isJob ? (
              <span>Posted {data.postedDate}</span>
            ) : (
              <span>{data.experience} experience</span>
            )}
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {isJob ? "Required Skills:" : "Top Skills:"}
            </p>
            <div className="flex flex-wrap gap-1">
              {data.skills?.map((skill: string, idx: number) => (
                <div key={idx} className="bg-brand-50 dark:bg-brand-900/20 text-xs text-brand-700 dark:text-brand-300 rounded-full px-2 py-0.5">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Why this is a good match:
            </p>
            <ul className="space-y-1">
              {data.matchReasons?.map((reason: string, idx: number) => (
                <li key={idx} className="text-sm flex items-start">
                  <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between">
        
        <Button variant="ghost" size="sm" className="gap-1">
          <Star className="h-4 w-4" />
          Save
        </Button>
        <div className="flex space-x-2">
          
          <Button variant="outline" size="sm" asChild>
            <Link href={isJob ? `/jobs/${data.id}` : `/candidates/${data.id}`}>
              View {isJob ? "Job" : "Profile"}
            </Link>
          </Button>
          
          <Button size="sm">Apply Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;