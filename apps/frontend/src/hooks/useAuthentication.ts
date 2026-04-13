import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../state/ReduxStateProvider";
import { setUserAuthState, setUserDetails } from "../state/ReduxStateProvider";
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
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.userAuth);

  const setAuthState = (nextState: AuthState) => {
    dispatch(setUserAuthState(nextState));

    if (nextState.user) {
      dispatch(setUserDetails(nextState.user));
    }
  };

  return { authState, setAuthState };
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
