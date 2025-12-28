import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Moon, Sun, Loader2, Shield, SquareChevronRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import { BACKENDURL } from "../utils/urls";
import { useDispatch } from "react-redux";
import { setAuthData } from "../state/ReduxStateProvider";

export default function AuthPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const setAuthanticationData = useDispatch();

  const [signInData, setSignInData] = useState({ email: "" });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`${BACKENDURL}/user/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInData.email,
      }),
    });
    if (response.ok) {
      setLoading(false);
      const json = await response.json();
      toast({
        title: "Success",
        description: "Check your email for the verification Code",
        variant: "default",
        className: "mr-[50px]",
      });
      setAuthanticationData(
        setAuthData({
          email: signInData.email,
          challengeId: json.challengeId,
        })
      );
      navigate("/verify");
    } else if (!response.ok) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      return;
    }
    navigate("/verify");
    setLoading(false);
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
              Welcome Back
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Sign up to continue your coding journey
            </p>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              <CardDescription className="text-base">
                Enter your email to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="signin-email"
                    className="text-base font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="name@example.com"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    required
                    className="h-12 px-4 text-base rounded-lg border-2 border-border focus:ring-2 focus:ring-primary transition-all duration-150"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

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
