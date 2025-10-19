import { useState, useEffect } from 'react';
import { BACKENDURL } from "../utils/urls";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

export function useAuthentication() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setAuthState({ isAuthenticated: false, user: null, loading: false });
        return;
      }

      try {
        const response = await fetch(`${BACKENDURL}/user/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "token": token
          }
        });

        const data = await response.json();

        if (response.ok) {
          setAuthState({
            isAuthenticated: true,
            user: data.user,
            loading: false
          });
        } else {
          localStorage.removeItem("token");
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
      }
    }

    checkAuth();
  }, []); 

  return authState;
}