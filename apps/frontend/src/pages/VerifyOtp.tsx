import { Button } from "@repo/ui/button";
import { Code2, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/input-otp";

export function VerifyOtp() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  function HandelVerifyOtp(){
    navigate("/problems");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Code2 className="h-6 w-6" />
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

      <main className="container flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold ml-[20px]">Verify OTP</h1>
            <p className="mt-2 text-muted-foreground ml-[20px]">
              Enter Your OTP to continue your coding journey
            </p>
          </div>
          <div className="flex items-center justify-center">
            <InputOTP maxLength={6}>
                <InputOTPGroup>
                <InputOTPSlot index={0} className="h-20 w-20 text-2xl" />
                <InputOTPSlot index={1} className="h-20 w-20 text-2xl" />
                <InputOTPSlot index={2} className="h-20 w-20 text-2xl" />
                </InputOTPGroup>
                <InputOTPGroup>
                <InputOTPSlot index={3} className="h-20 w-20 text-2xl" />
                <InputOTPSlot index={4} className="h-20 w-20 text-2xl" />
                <InputOTPSlot index={5} className="h-20 w-20 text-2xl" />
                </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="mt-[50px]">
            <Button className="h-12 w-[200px]" onClick={HandelVerifyOtp}>Verify</Button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
}
