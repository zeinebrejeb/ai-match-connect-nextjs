// src/lib/authUtils.ts
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string; 
  email?: string;
  role?: 'candidate' | 'recruiter' | 'admin'; 
  firstName?: string; 
  lastName?: string;  
}

/**
 * Decodes a JWT token string.
 * @param token The JWT token string.
 * @returns The decoded payload if the token is valid and not expired, otherwise null.
 */
export const decodeProvidedToken = (token: string): DecodedToken | null => {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Check for expiration (optional, jwtDecode might throw for expired tokens depending on config/version)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("Provided token is expired.");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Failed to decode provided token:", error);
    return null;
  }
};

/**
 * Gets and decodes the 'accessToken' from localStorage.
 * @returns The decoded payload if the token exists in localStorage and is valid, otherwise null.
 */
export const getDecodedTokenFromStorage = (): DecodedToken | null => {
  if (typeof window === 'undefined') { // Ensure it runs only on client
    return null;
  }
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }
  // Use the new function to decode the token from storage
  return decodeProvidedToken(token);
};
