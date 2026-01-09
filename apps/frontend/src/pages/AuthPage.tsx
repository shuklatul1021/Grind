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
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg ${theme === "dark" ? "bg-white text-black" : "bg-black text-white"}`}
            >
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
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>

          <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                We'll send you a verification code to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    required
                    className="bg-background/50 border-border/40 focus:border-primary/50 transition-colors"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending code...
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

          <p className="mt-8 text-center text-xs text-muted-foreground px-8">
            By clicking continue, you agree to our <br />
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
