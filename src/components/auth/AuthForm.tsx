'use client';
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseIcon, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { decodeProvidedToken, DecodedToken } from '@/lib/authUtils';

interface AuthSuccessData {
  accessToken?: string;
  refreshToken?: string;
  role?: 'candidate' | 'recruiter' | 'admin'; 
}

interface AuthFormProps {
  onSuccess?: (data: AuthSuccessData) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const searchParams = useSearchParams();
  const defaultTypeFromQuery = searchParams?.get("type") === "signup" ? "signup" : "login";
  const defaultRoleFromQuery = searchParams?.get("role") === "recruiter" ? "recruiter" : "candidate";

  const [authType, setAuthType] = useState<"login" | "signup">(defaultTypeFromQuery);
  const [role, setRole] = useState<"candidate" | "recruiter" | "admin">(defaultRoleFromQuery as 'candidate' | 'recruiter' | 'admin'); // Cast for safety
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const  router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  });

  const loginPasswordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authType === 'login' && loginPasswordInputRef.current) {

    }
  }, [authType]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (authType === "signup" && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      if (authType === "login") {
        if (!formData.email || !formData.password) {
          toast({
            title: "Login Error",
            description: "Both email and password are required.",
            variant: "destructive",
          });
          setError("Both email and password are required.");
          setIsLoading(false);
          return;
        }

        const loginPayload = new URLSearchParams();
        loginPayload.append('username', formData.email);
        loginPayload.append('password', formData.password);

        const response = await api.post('/auth/token', loginPayload, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token } = response.data;

        if (!access_token) {
          throw new Error("Login failed: Access token not received from server.");
        }

        
        localStorage.setItem('accessToken', access_token);
        if (refresh_token) {
          localStorage.setItem('refreshToken', refresh_token);
        }

        
        const decoded: DecodedToken | null = decodeProvidedToken(access_token);
        const userRole = decoded?.role;
        console.log(  "Decoded token:", decoded);
        toast({
          title: "Logged in successfully!",
          description: "Welcome back to AI Match Connect.",
        });

        if (userRole === "candidate") {
          router.replace("/candidate-dashboard");
        } else if (userRole === "recruiter") {
          router.replace("/recruiter-dashboard");
        } else if (userRole === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard"); 
        }

        if (onSuccess) {
          onSuccess({ accessToken: access_token, refreshToken: refresh_token, role: userRole });
        }

      } else {
        const signupPayload = {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: role,
          ...(role === 'recruiter' && formData.company && { company_name: formData.company }),
        };

        await api.post('/auth/register', signupPayload);

        toast({
          title: "Account created!",
          description: "Please enter your password below to log in.", 
          duration: 5000,
        });

        if (onSuccess) {
          
          onSuccess({ role: role });
        }
        setAuthType('login'); 
        
        setFormData(prevData => ({ ...prevData, password: "", confirmPassword: "" }));
        if (loginPasswordInputRef.current) {
            loginPasswordInputRef.current.focus();
        }
      }
    } catch (err: unknown) {
      console.error("Authentication error in AuthForm:", err);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ detail?: string | string[] }>;
        if (axiosError.response?.data?.detail) {
            if (Array.isArray(axiosError.response.data.detail)) {
                errorMessage = axiosError.response.data.detail.map(d => (typeof d === 'object' ? JSON.stringify(d) : d)).join('; ');
            } else {
                errorMessage = axiosError.response.data.detail;
            }
        } else {
            errorMessage = axiosError.message || "Authentication failed.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

 

  const handleTabChange = (value: string) => {
    setAuthType(value as "login" | "signup");
    setError(null);
   
    if (value === 'signup' && role === 'recruiter' && !formData.company) {
    
    } else if (value === 'signup' && role !== 'recruiter' && formData.company) {
        setFormData(prev => ({...prev, company: ""}));
    }
    setFormData(prev => ({...prev, password: "", confirmPassword: ""})); 
  };

  return (
    <Tabs
      value={authType}
      onValueChange={handleTabChange}
      className="w-full max-w-md"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link
                    href="/forgot-password" // Assuming you have this page
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  ref={loginPasswordInputRef}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && authType === "login" && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && authType === 'login' ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === "candidate" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setRole("candidate")}
                    disabled={isLoading}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Candidate
                  </Button>
                  <Button
                    type="button"
                    variant={role === "recruiter" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setRole("recruiter")}
                    disabled={isLoading}
                  >
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    Recruiter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={authType === 'signup'}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={authType === 'signup'}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {role === "recruiter" && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required={authType === 'signup' && role === "recruiter"}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {authType === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={authType === 'signup'}
                    disabled={isLoading}
                  />
                </div>
              )}
              {error && authType === "signup" && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && authType === 'signup' ? "Creating account..." : "Create account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
export default AuthForm;
