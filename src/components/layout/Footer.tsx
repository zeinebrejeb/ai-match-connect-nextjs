import React from "react";
import Link from "next/link"; 
import { Users, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            
            <Link href="/" className="flex items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-600 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  AI<span className="text-brand-600">Match</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connecting talent with opportunities through AI-powered matching.
            </p>
            <div className="flex space-x-4">
              
              <a href="#" className="text-gray-400 hover:text-brand-600 dark:hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-600 dark:hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                
                <Link href="/about" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                
                <Link href="/careers" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                
                <Link href="/blog" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                
                <Link href="/for-candidates" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  For Candidates
                </Link>
              </li>
              <li>
               
                <Link href="/for-recruiters" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  For Recruiters
                </Link>
              </li>
              <li>
                
                <Link href="/help" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Errachid Building, Supreme Fighter Avenue, Monastir 5000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">+ (216) 95206998</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
               
                <a href="mailto:contact@aimatch.com" className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white">
                  contact@mobelite.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AIMatch. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
             
              <Link href="/privacy" className="text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white text-sm">
                Privacy Policy
              </Link>
              
              <Link href="/terms" className="text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white text-sm">
                Terms of Service
              </Link>
              
              <Link href="/cookies" className="text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white text-sm">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;