"use client"; 
import React from "react";
import JobForm from "@/components/recruiter/JobForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatAssistant from "@/components/ai/ChatAssistant";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, ArrowLeft } from "lucide-react";
import Link from "next/link"; 

const PostJob = () => {
  const [showChat, setShowChat] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">

            <Link href="/recruiter-profile" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Post New Job</CardTitle>
              <CardDescription>
                Create a new job listing and find the perfect candidates with AI matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobForm />
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="fixed bottom-6 right-6">
        {showChat ? (
          <div className="flex flex-col items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChat(false)}
              className="mb-4 bg-white dark:bg-gray-800"
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
          >
            <MessageSquare className="h-5 w-5" />
            AI Assistant
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostJob;