"use client";
import React from "react";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow pt-16">
        <Hero /> 
        <Features /> 
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Success Stories
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Discover how our AI matching platform has helped candidates and recruiters find the perfect fit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Testimonial 1 (Keep the rest of the testimonial structure) */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                {/* ... content of testimonial 1 ... */}
                 <div className="mt-4 flex">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                     </svg>
                   ))}
                 </div>
              </div>
              {/* Testimonial 2 (Keep the rest of the testimonial structure) */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                {/* ... content of testimonial 2 ... */}
                 <div className="mt-4 flex">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                     </svg>
                   ))}
                 </div>
              </div>
              {/* Testimonial 3 (Keep the rest of the testimonial structure) */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                {/* ... content of testimonial 3 ... */}
                 <div className="mt-4 flex">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                     </svg>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section (Keep the rest of the CTA structure) */}
        <section className="bg-brand-600 dark:bg-brand-800">
          {/* ... content of CTA section ... */}
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
             <div className="max-w-3xl mx-auto text-center">
               <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                 Ready to transform your job search?
               </h2>
               <p className="mt-4 text-lg text-brand-100">
                 Join thousands of candidates and recruiters who are leveraging AI to make better connections.
               </p>
               <div className="mt-8 flex justify-center">
                 <div className="inline-flex rounded-md shadow">
                   <Link
                     href="/auth?type=signup"
                     className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-600 bg-white hover:bg-brand-50"
                   >
                     Get Started for Free
                   </Link>
                 </div>
                 <div className="ml-3 inline-flex">
                   <Link
                     href="/about"
                     className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-700 hover:bg-brand-800"
                   >
                     Learn More
                   </Link>
                 </div>
               </div>
             </div>
           </div>
        </section>
      </main>
       
    </div>
  );
};

export default HomePage; 