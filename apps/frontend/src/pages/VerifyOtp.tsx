import { Button } from "@repo/ui/button";
import { Moon, SquareChevronRight, Sun, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();
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
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className={`absolute inset-0 ${theme === "dark" ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-background to-background" : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100/50 via-background to-background"}`} />
      <div className={`absolute inset-0 bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] ${theme === "dark" ? "bg-grid-white/[0.02]" : "bg-grid-black/[0.02]"}`} />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div
            className="flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white">
              <SquareChevronRight className="h-5 w-5" />
            </div>
            <span>Grind</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-muted"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Verify OTP
            </h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to your email to continue.
            </p>
          </div>

          <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="justify-center text-center">
              <CardTitle>Verification Code</CardTitle>
              <CardDescription>
                Please check your inbox for the code.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <InputOTP
                maxLength={6}
                onChange={(value) => setOtp(value)}
                onKeyPress={handleKeyPress}
              >
                <div className="flex gap-2 sm:gap-4 justify-center">
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-xl sm:text-2xl ${ theme === "dark" ? "border-white/30" : "border-black/30"} bg-background/50 focus:ring-primary/50 transition-all`}
                    />
                    <InputOTPSlot
                      index={1}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-xl sm:text-2xl ${ theme === "dark" ? "border-white/30" : "border-black/30"} bg-background/50 focus:ring-primary/50 transition-all`}
                    />
                    <InputOTPSlot
                      index={2}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-xl sm:text-2xl ${ theme === "dark" ? "border-white/30" : "border-black/30"} bg-background/50 focus:ring-primary/50 transition-all`}
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="w-2 mt-4 opacity-50" />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-xl sm:text-2xl ${ theme === "dark" ? "border-white/30" : "border-black/30"} bg-background/50 focus:ring-primary/50 transition-all`}
                    />
                    <InputOTPSlot
                      index={4}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-xl sm:text-2xl ${ theme === "dark" ? "border-white/30" : "border-black/30"} bg-background/50 focus:ring-primary/50 transition-all`}
                    />
                    <InputOTPSlot
                      index={5}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-xl sm:text-2xl ${ theme === "dark" ? "border-white/30" : "border-black/30"} bg-background/50 focus:ring-primary/50 transition-all`}
                    />
                  </InputOTPGroup>
                </div>
              </InputOTP>

              <div className="flex flex-col gap-3 w-full">
                <Button
                  className="w-full h-11 text-base font-medium"
                  disabled={loading}
                  onClick={HandelVerifyOtp}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-10 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/auth")}
                >
                  Change Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground px-8">
            By continuing, you agree to our{" "}
            <br/>
            <a href="/terms" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
