import { useState, useEffect } from 'react';
import { BACKENDURL } from "../utils/urls";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}
interface AdminAuthState {
  isAuthenticated: boolean;
  user?: any | null;
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

  return  { authState , setAuthState };
}


export function useAdminAuthentication() {
  const [adminauthState, setadminAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    loading: true
  });


  useEffect(()=>{
    async function checkAdminAuth(){
      const token = localStorage.getItem("adminToken"); 
      if (!token) {
        setadminAuthState({ isAuthenticated: false, loading: false });
        return;
      }
      const response = await fetch(`${BACKENDURL}/admin/verify-admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      });

      if(response.ok){
        setadminAuthState({
          isAuthenticated: true,
          loading: false
        })
      }else {
        localStorage.removeItem("adminToken");
        setadminAuthState({
          isAuthenticated: false,
          loading: false
        });
      }
    }
    checkAdminAuth()
  },[])

  return { adminauthState , setadminAuthState } ;
}