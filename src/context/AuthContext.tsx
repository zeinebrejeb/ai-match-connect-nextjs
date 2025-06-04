'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '@/lib/api';

export interface AuthUser {
  id?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: AuthUser['role'] | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string) => Promise<boolean>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    console.log("AUTH: Logging out");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Cookies.remove('accessToken'); 
    // Cookies.remove('refreshToken'); 
    setUser(null);

    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth?type=login';
    }
  }, []);

  const fetchUserDetailsAndSetUser = useCallback(async (tokenToUse: string): Promise<boolean> => {
    console.log("AUTH: Attempting to fetch user details.");
    if (!tokenToUse) {
        console.warn("AUTH: No token provided to fetchUserDetailsAndSetUser.");
        return false;
    }
    try {

      const response = await api.get<AuthUser>('/users/me', {
         headers: { Authorization: `Bearer ${tokenToUse}` }, 
      });
      const apiUser = response.data;
      console.log("AUTH: User details fetched successfully:", apiUser);
      setUser(apiUser);
      localStorage.setItem('user', JSON.stringify(apiUser)); 
      return true;
    } catch (error) {
      console.error("AUTH: Failed to fetch user details in fetchUserDetailsAndSetUser:", error);
      return false;
    }
  }, []);
  const initializeAuth = useCallback(async () => {
    console.log("AUTH: Initializing authentication...");
    setIsLoading(true);
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      console.log("AUTH: Access token found in storage. Verifying...");
      const success = await fetchUserDetailsAndSetUser(storedToken);
      if (!success) {
        console.log("AUTH: Token verification failed during init. Logging out.");
        logout();
      }

    } else {
      console.log("AUTH: No access token found in storage. User is not authenticated.");
      setUser(null); 
      localStorage.removeItem('user'); 
    }
    setIsLoading(false);
    console.log("AUTH: Initialization complete.");
  }, [fetchUserDetailsAndSetUser, logout]);

  useEffect(() => {
    initializeAuth();

    const handleStorageChange = (event: StorageEvent) => {

      if (event.key === 'accessToken' || event.key === 'refreshToken' || event.key === 'user') {
        console.log(`AUTH: Storage event detected for key: ${event.key}. Re-initializing auth.`);
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeAuth]); 

  const login = async (accessToken: string, refreshToken?: string): Promise<boolean> => {
    console.log("AUTH: Login process started.");
    localStorage.setItem('accessToken', accessToken);
    // Cookies.set('accessToken', accessToken, { expires: 1, path: '/' }); 
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      // Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' }); 
    }

    const success = await fetchUserDetailsAndSetUser(accessToken);
    if (!success) {
      console.error("AUTH: Login successful (tokens set), but failed to fetch user details. Logging out.");
      logout(); 
    }
    return success;
  };

  return (
    <AuthContext.Provider value={{
        isAuthenticated: !!user, 
        user,
        role: user?.role || null,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};