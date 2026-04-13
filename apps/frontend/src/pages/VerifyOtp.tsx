import { Button } from "@repo/ui/button";
import { Loader2, ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@repo/ui/input-otp";
import { useState } from "react";
import { BACKENDURL } from "../utils/urls";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";
import { useAuthentication } from "../hooks/useAuthentication";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export function VerifyOtp() {
  const navigate = useNavigate();
  const { setAuthState } = useAuthentication();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const user2FAAuthantication = useSelector(
    (state: RootState) => state.user2FAAuthantication
  );

  async function HandelVerifyOtp() {
    setLoading(true);
    if (!otp || otp.length < 6) {
      toast({
        title: "Error",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const response = await fetch(`${BACKENDURL}/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        email: user2FAAuthantication.email,
        challengeId: user2FAAuthantication.challengeId,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      localStorage.setItem("token", json.token);
      setAuthState({ isAuthenticated: true, user: json.user, loading: false });
      setLoading(false);
      navigate("/problems");
    } else {
      toast({
        title: "Error",
        description: "Wrong OTP verification failed. Please try again.",
        variant: "destructive",
      });
      setAuthState({ isAuthenticated: false, user: null, loading: false });
      setLoading(false);
    }
    setLoading(false);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      HandelVerifyOtp();
    }
  };

  // Mask email for display
  const maskedEmail = user2FAAuthantication.email
    ? user2FAAuthantication.email.replace(
        /(.{2})(.*)(@.*)/,
        (_, a, b, c) => a + "•".repeat(Math.min(b.length, 6)) + c
      )
    : "your email";

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-foreground/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/auth")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl shadow-foreground/[0.03]">
            <CardHeader className="text-center pb-2 pt-8">
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground/5 border border-border/40 mx-auto mb-5">
                <ShieldCheck className="h-7 w-7 text-foreground/70" />
              </div>

              <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
              <CardDescription className="text-base mt-2 max-w-sm mx-auto">
                We sent a 6-digit verification code to
              </CardDescription>

              {/* Email display */}
              <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2.5 rounded-lg bg-muted/50 border border-border/30 mx-auto w-fit">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono text-foreground">{maskedEmail}</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-8 px-8 pb-8 pt-6">
              {/* OTP Input */}
              <InputOTP
                maxLength={6}
                onChange={(value) => setOtp(value)}
                onKeyPress={handleKeyPress}
              >
                <div className="flex gap-2 sm:gap-3 justify-center">
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-14 w-12 sm:h-16 sm:w-14 text-2xl sm:text-3xl font-semibold border-border/40 bg-background/50 focus:border-foreground/40 focus:ring-foreground/10 transition-all"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-14 w-12 sm:h-16 sm:w-14 text-2xl sm:text-3xl font-semibold border-border/40 bg-background/50 focus:border-foreground/40 focus:ring-foreground/10 transition-all"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-14 w-12 sm:h-16 sm:w-14 text-2xl sm:text-3xl font-semibold border-border/40 bg-background/50 focus:border-foreground/40 focus:ring-foreground/10 transition-all"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="w-3 mt-5 text-muted-foreground/40" />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="h-14 w-12 sm:h-16 sm:w-14 text-2xl sm:text-3xl font-semibold border-border/40 bg-background/50 focus:border-foreground/40 focus:ring-foreground/10 transition-all"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-14 w-12 sm:h-16 sm:w-14 text-2xl sm:text-3xl font-semibold border-border/40 bg-background/50 focus:border-foreground/40 focus:ring-foreground/10 transition-all"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-14 w-12 sm:h-16 sm:w-14 text-2xl sm:text-3xl font-semibold border-border/40 bg-background/50 focus:border-foreground/40 focus:ring-foreground/10 transition-all"
                    />
                  </InputOTPGroup>
                </div>
              </InputOTP>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full">
                <Button
                  className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90 rounded-lg"
                  disabled={loading || otp.length < 6}
                  onClick={HandelVerifyOtp}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                {/* Resend / Change email */}
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <span>Didn't receive it?</span>
                  <button
                    className="font-medium text-foreground hover:underline transition-colors"
                    onClick={() => navigate("/auth")}
                  >
                    Try again
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground px-4">
            By continuing, you agree to our{" "}
            <a href="/terms-and-conditions" className="underline hover:text-foreground transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
