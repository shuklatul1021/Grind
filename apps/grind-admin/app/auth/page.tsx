"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthStep = "credentials" | "otp";

type AdminAuthResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  challengeId?: string;
  devOtp?: string;
};

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

async function readJsonResponse(response: Response) {
  return (await response.json().catch(() => null)) as AdminAuthResponse | null;
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

function persistAdminToken(token: string) {
  window.localStorage.setItem("adminToken", token);
  window.localStorage.setItem("token", token);
}

function clearStoredAdminTokens() {
  window.localStorage.removeItem("adminToken");
  window.localStorage.removeItem("token");
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export default function AdminAuthPage() {
  const router = useRouter();
  const backendUrl = useMemo(() => getAdminBackendUrl(), []);

  const [step, setStep] = useState<AuthStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const resetFeedback = useCallback(() => {
    setErrorMessage("");
    setStatusMessage("");
  }, []);

  useEffect(() => {
    let isMounted = true;

    const verifyExistingSession = async () => {
      const token = readStoredAdminToken();

      if (!token) {
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

        const data = await readJsonResponse(response);

        if (response.ok && data?.success) {
          router.replace("/dashboard");
          return;
        }

        clearStoredAdminTokens();
      } catch {
        clearStoredAdminTokens();
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void verifyExistingSession();

    return () => {
      isMounted = false;
    };
  }, [backendUrl, router]);

  const switchToCredentials = useCallback(() => {
    resetFeedback();
    setStep("credentials");
    setOtp("");
    setChallengeId("");
    setDevOtpHint("");
  }, [resetFeedback]);

  const handleCredentialsSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedEmail = email.trim();
      const normalizedPassword = password.trim();

      if (!normalizedEmail || !normalizedPassword) {
        setErrorMessage("Please provide email and password.");
        return;
      }

      setIsSubmitting(true);
      resetFeedback();

      try {
        const startResponse = await fetch(`${backendUrl}/admin/auth/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password: normalizedPassword,
          }),
        });

        const startData = await readJsonResponse(startResponse);

        if (startResponse.ok && startData?.success && startData.challengeId) {
          setStep("otp");
          setChallengeId(startData.challengeId);
          setDevOtpHint(startData.devOtp ?? "");
          setOtp("");
          setStatusMessage(
            startData.message ||
              "Credentials verified. Enter your 6-digit OTP to continue.",
          );
          return;
        }

        const canFallbackToDirectAuth =
          startResponse.status === 404 || startResponse.status === 405;

        if (!canFallbackToDirectAuth) {
          throw new Error(
            startData?.message || "Unable to verify credentials.",
          );
        }

        const directAuthResponse = await fetch(`${backendUrl}/admin/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password: normalizedPassword,
          }),
        });

        const directAuthData = await readJsonResponse(directAuthResponse);

        if (
          !directAuthResponse.ok ||
          !directAuthData?.success ||
          !directAuthData.token
        ) {
          throw new Error(directAuthData?.message || "Sign in failed.");
        }

        persistAdminToken(directAuthData.token);
        setStatusMessage(directAuthData.message || "Signed in successfully.");
        router.replace("/dashboard");
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Unable to sign in."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [backendUrl, email, password, resetFeedback, router],
  );

  const handleOtpSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedOtp = otp.trim();

      if (!challengeId) {
        setErrorMessage("OTP session not found. Please sign in again.");
        return;
      }

      if (!/^\d{6}$/.test(normalizedOtp)) {
        setErrorMessage("OTP must be exactly 6 digits.");
        return;
      }

      setIsSubmitting(true);
      resetFeedback();

      try {
        const response = await fetch(`${backendUrl}/admin/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId,
            otp: normalizedOtp,
          }),
        });

        const data = await readJsonResponse(response);

        if (!response.ok || !data?.success || !data.token) {
          throw new Error(data?.message || "Invalid OTP code.");
        }

        persistAdminToken(data.token);
        setStatusMessage(data.message || "Signed in successfully.");
        router.replace("/dashboard");
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "OTP verification failed."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [backendUrl, challengeId, otp, resetFeedback, router],
  );

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center gap-3 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking session...
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

      <Card className="relative w-full max-w-md border-border/60 bg-background/95 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl tracking-tight">
            {step === "credentials" ? "Admin Sign In" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === "credentials"
              ? "Sign in to access Grind admin dashboard controls."
              : "Enter the 6-digit OTP sent for this login challenge."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {statusMessage && (
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          {step === "credentials" ? (
            <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@grind.org.in"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleOtpSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin-otp">One-Time Password (OTP)</Label>
                <Input
                  id="admin-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  required
                />
              </div>

              {devOtpHint && (
                <div className="rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
                  Development OTP:{" "}
                  <span className="font-mono">{devOtpHint}</span>
                </div>
              )}

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={switchToCredentials}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Use Different Credentials
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
