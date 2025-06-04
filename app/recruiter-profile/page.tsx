"use client"; 
import React from "react";
import Link from "next/link"; 
import RecruiterProfile from "@/components/recruiter/RecruiterProfile";
import ChatAssistant from "@/components/ai/ChatAssistant"; 
//import JobForm from "@/components/recruiter/JobForm";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Search } from "lucide-react";

const RecruiterProfilePage = () => {

  const [showChat, setShowChat] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">

            <Link href="/recruiter-ai-search" passHref legacyBehavior>
              <Button className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                AI Resume Search
              </Button>
            </Link>
          </div>
          <RecruiterProfile /> 
        </div>
      </main>


      <div className="fixed bottom-6 right-6 z-50"> 
        {showChat ? (
          <div className="flex flex-col items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChat(false)}
              className="mb-4 bg-white dark:bg-gray-800 shadow-lg" 
              aria-label="Close chat assistant" 
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="w-80 md:w-96">
              <ChatAssistant onClose={() => setShowChat(false)} /> 
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 shadow-lg"
             aria-label="Open AI chat assistant" 
          >
            <MessageSquare className="h-5 w-5" />
            AI Assistant
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecruiterProfilePage;