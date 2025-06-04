'use client';
import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import AuthForm from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; 

interface AuthFormData { 
  accessToken?: string;
  refreshToken?: string; 
  role?: 'candidate' | 'recruiter' | 'admin';
}

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useAuth(); 

  const authType = searchParams?.get("type") || "login";

  const handleAuthSuccess = async (data: AuthFormData) => { 
    console.log("AuthPage received auth success data:", data);

    if (data.accessToken) {
      await login(data.accessToken, data.refreshToken); 

      toast({
        title: "Welcome back!",
        description: `You've successfully logged in. Redirecting...`,
      });

      // setTimeout(() => {
      //   const loggedInUserRole = data.role; 
      //   console.log(data)
      //   if (loggedInUserRole === "candidate") {
      //     router.replace("/candidate-profile");
      //   } else if (loggedInUserRole === "recruiter") {
      //     router.replace("/recruiter-profile");
      //   } else if (loggedInUserRole === "admin") {
      //     router.replace("/admin/dashboard");
      //   } else {
      //     router.replace("/dashboard"); 
      //   }
      // }, 500); 

    } else {
      toast({
        title: "Account created!",
        description: `Your ${data.role || 'user'} account has been created successfully. Please log in.`,
      });
    }
  };

  return (
    <main className="flex-grow pt-20 pb-12"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            {authType === "login" ? "Log In to Your Account" : "Create Your Account"}
          </h1>
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </main>
  );
};

export default AuthPage;