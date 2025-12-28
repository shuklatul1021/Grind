import { Button } from "@repo/ui/button";
import { Moon, SquareChevronRight, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@repo/ui/input-otp";
import { useState } from "react";
import { BACKENDURL } from "../utils/urls";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";
import { useAuthentication } from "../hooks/useAuthentication";

export function VerifyOtp() {
  const navigate = useNavigate();
  const { setAuthState } = useAuthentication();
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [otp, setOpt] = useState("");
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
    if (event.key === 'Enter') {
      HandelVerifyOtp();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-background/80 dark:from-background dark:via-background dark:to-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-background/80 rounded-2xl shadow-xl p-8 border border-border">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Verify OTP
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Enter the 6-digit code sent to your email to continue your coding
              journey.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <InputOTP maxLength={6} onChange={(value) => setOpt(value)} onKeyPress={handleKeyPress}>
              <div className="flex gap-4 justify-center">
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="h-14 w-12 text-2xl border-2 border-border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 text-center"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-14 w-12 text-2xl border-2 border-border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 text-center"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-14 w-12 text-2xl border-2 border-border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 text-center"
                  />
                </InputOTPGroup>
                <InputOTPSeparator className="w-2 mt-4" />
                <InputOTPGroup>
                  <InputOTPSlot
                    index={3}
                    className="h-14 w-12 text-2xl border-2 border-border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 text-center"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-14 w-12 text-2xl border-2 border-border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 text-center"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-14 w-12 text-2xl border-2 border-border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 text-center"
                  />
                </InputOTPGroup>
              </div>
            </InputOTP>
            <div className="flex flex-col gap-2 w-full items-center mt-4">
              <Button
                className="h-12 w-40 text-lg font-semibold shadow-md"
                disabled={loading}
                onClick={HandelVerifyOtp}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-4 border-primary border-t-transparent mr-2 inline-block align-middle"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                variant="outline"
                className="h-10 w-40 text-base border-gray-300"
                onClick={() => navigate("/auth")}
              >
                Change Email
              </Button>
            </div>
          </div>
            <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}<br/>
            <a href="/terms-and-conditions" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
