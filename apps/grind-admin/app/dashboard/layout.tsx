"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function getAdminBackendUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "https://api.grind.org.in/v1/api";
  }

  return "http://localhost:5000/v1/api";
}

function readStoredAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    window.localStorage.getItem("adminToken") ||
    window.localStorage.getItem("token") ||
    ""
  );
}

function clearStoredAdminTokens() {
  window.localStorage.removeItem("adminToken");
  window.localStorage.removeItem("token");
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const backendUrl = useMemo(() => getAdminBackendUrl(), []);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAdminSession = async () => {
      const token = readStoredAdminToken();

      if (!token) {
        clearStoredAdminTokens();
        router.replace("/auth");
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/admin/verify-admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        const data = (await response.json().catch(() => null)) as {
          success?: boolean;
        } | null;

        if (response.ok && data?.success) {
          if (isMounted) {
            setIsAuthorized(true);
          }
          return;
        }
      } catch {
        // Redirect to auth below.
      }

      clearStoredAdminTokens();
      router.replace("/auth");
    };

    void verifyAdminSession().finally(() => {
      if (isMounted) {
        setIsCheckingSession(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [backendUrl, router]);

  if (isCheckingSession || !isAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Verifying admin session...
      </main>
    );
  }

  return <>{children}</>;
}
