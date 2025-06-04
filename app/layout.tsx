
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import "./globals.css";

// const queryClient = new QueryClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "AI Match Connect",
  description: "AI-powered platform connecting candidates and job offers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        {/* <QueryClientProvider client={queryClient}> */}

          <TooltipProvider>
           
            <AuthProvider>
              <Navbar />

              <main className="relative z-0 min-h-[calc(100vh-128px)] pt-16">
                {children} 
              </main>
              <Footer />
            </AuthProvider>
            
            <Toaster />
            <Sonner />
          </TooltipProvider>
        {/* </QueryClientProvider> */}
      </body>
    </html>
  );
}