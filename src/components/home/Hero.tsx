import React from "react";
import Link from "next/link"; 
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, Users } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
      </div>
      <div className="relative pt-28 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                <span className="block">AI-Powered</span>
                <span className="block text-brand-600">Job Matching</span>
                <span className="block">Platform</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Connect with the perfect opportunities using our advanced AI algorithms.
                Our platform matches candidates with jobs based on skills, experience, and preferences.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Update Link from react-router-dom to next/link */}
                  <Button asChild size="lg" className="flex items-center justify-center gap-2">
                    <Link href="/auth?type=signup&role=candidate">
                      <Users className="h-5 w-5" />
                      <span>For Candidates</span>
                    </Link>
                  </Button>
                  {/* Update Link from react-router-dom to next/link */}
                  <Button asChild size="lg" variant="outline" className="flex items-center justify-center gap-2">
                    <Link href="/auth?type=signup&role=recruiter">
                      <BriefcaseIcon className="h-5 w-5" />
                      <span>For Recruiters</span>
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  {/* Update Link from react-router-dom to next/link */}
                  <Link href="/auth?type=login" className="font-medium text-brand-600 hover:text-brand-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1581089781785-603411fa81e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Person looking at job opportunities"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              className="h-12 w-12 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt="Profile"
                            />
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            John Doe
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            Full Stack Developer
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-accent2-500">
                          98% Match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;