'use client';

import React, { useState, useCallback } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Users, ChevronDown, User, LogOut, LayoutDashboard, Search, Plus } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  const { isAuthenticated, user, role, logout: contextLogout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const handleLogoutAndRedirect = useCallback(() => {
    contextLogout(); 
    setIsMenuOpen(false); 
    router.push("/auth?type=login"); 
  }, [contextLogout, router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-gray-900/90 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-600 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    AI<span className="text-brand-600">Match</span>
                  </span>
                </div>
              </Link>
            </div>
            
          </div>
        </div>
      </header>
    );
  }


  const userNameDisplay = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email || "User"; 

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-600 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  AI<span className="text-brand-600">Match</span>
                </span>
              </div>
            </Link>
          </div>

          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-white">Home</Link>
            <Link href="/jobs" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-white">Jobs</Link>
            <Link href="/about" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-white">About</Link>

            {isAuthenticated ? ( 
              <>
                {/* Candidate Navigation */}
                {role === "candidate" && ( 
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> {userNameDisplay} <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/candidate-profile" className="flex items-center gap-2"><User className="h-4 w-4" />View Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/candidate-profile?edit=true" className="flex items-center gap-2"><User className="h-4 w-4" />Edit Profile</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogoutAndRedirect} className="flex items-center gap-2 text-red-600"><LogOut className="h-4 w-4" />Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                
                {role === "recruiter" && ( 
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> {userNameDisplay} <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/recruiter-profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/post-job" className="flex items-center gap-2"><Plus className="h-4 w-4" />Post Job</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/recruiter-ai-search" className="flex items-center gap-2"><Search className="h-4 w-4" />AI Search</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogoutAndRedirect} className="flex items-center gap-2 text-red-600"><LogOut className="h-4 w-4" />Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost"><Link href="/auth?type=login">Log In</Link></Button>
                <Button asChild><Link href="/auth?type=signup">Sign Up</Link></Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Close menu on link click for mobile */}
            <Link href="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">Home</Link>
            <Link href="/jobs" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">Jobs</Link>
            <Link href="/about" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">About</Link>

            {isAuthenticated ? ( // Use isAuthenticated from context
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <p className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {userNameDisplay} ({role}) {/* Use role from context */}
                  </p>
                </div>
                {role === "candidate" && (
                  <>
                    <Link href="/dashboard" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                    <Link href="/candidate-profile" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium">View Profile</Link>
                    <Link href="/candidate-profile?edit=true" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium">Edit Profile</Link>
                  </>
                )}
                {role === "recruiter" && (
                  <>
                    <Link href="/recruiter-profile" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                    <Link href="/post-job" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium">Post Job</Link>
                    <Link href="/recruiter-ai-search" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium">AI Search</Link>
                  </>
                )}
                <Button
                  className="w-full justify-center mt-3" 
                  variant="outline"
                  onClick={() => { handleLogoutAndRedirect(); toggleMenu(); }} 
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Button asChild className="w-full justify-center" variant="outline" onClick={toggleMenu}><Link href="/auth?type=login">Log In</Link></Button>
                <Button asChild className="w-full justify-center" onClick={toggleMenu}><Link href="/auth?type=signup">Sign Up</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
