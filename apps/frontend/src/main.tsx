import { createRoot } from "react-dom/client";
import { useEffect, type ReactNode } from "react";
import { Provider, useDispatch } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { BACKENDURL } from "./utils/urls";
import {
  setUserAuthState,
  setUserDetails,
  store,
  type AppDispatch,
} from "./state/ReduxStateProvider.ts";

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(
          setUserAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          })
        );
        return;
      }

      try {
        const response = await fetch(`${BACKENDURL}/user/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (response.ok) {
          dispatch(
            setUserAuthState({
              isAuthenticated: true,
              user: data.user,
              loading: false,
            })
          );
          dispatch(setUserDetails(data.user));
          return;
        }

        localStorage.removeItem("token");
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
      }

      if (!cancelled) {
        dispatch(
          setUserAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          })
        );
      }
    }

    void bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthBootstrap>
      <App />
    </AuthBootstrap>
  </Provider>
)
