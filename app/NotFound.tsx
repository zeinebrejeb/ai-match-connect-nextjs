"use client";
import { useEffect } from "react"; 
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {

    // Note: On a true 404 page rendered by Next.js, pathname won't change after mount,
    // but logging it here confirms which invalid path was attempted.
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname 
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"> {/* Added dark mode backgrounds and text colors */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1> 
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Oops! Page not found</p> 
        <Link href="/" className="text-brand-600 dark:text-brand-400 hover:underline"> 
           Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
