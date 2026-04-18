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
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Code2,
  Zap,
  Trophy,
  Bot,
} from "lucide-react";

import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import { BACKENDURL } from "../utils/urls";
import { useDispatch } from "react-redux";
import { setAuthData } from "../state/ReduxStateProvider";

export default function AuthPage() {
  const navigate = useNavigate();
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

  const features = [
    { icon: <Code2 className="h-5 w-5" />, title: "500+ Problems", desc: "Curated coding challenges" },
    { icon: <Bot className="h-5 w-5" />, title: "AI Assistance", desc: "Smart hints & guidance" },
    { icon: <Zap className="h-5 w-5" />, title: "Instant Run", desc: "Execute code in <50ms" },
    { icon: <Trophy className="h-5 w-5" />, title: "Compete", desc: "Global leaderboards" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-foreground/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Main Content — Two Column Layout */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left Column — Branding & Features */}
          <div className="hidden md:flex flex-col space-y-10">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
                <span className="text-muted-foreground">Start your</span>
                <br />
                <span className="text-foreground">coding journey</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Join thousands of developers mastering algorithms, building skills, and landing dream jobs.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-border/60 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center text-muted-foreground flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{feature.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["#555", "#444", "#666", "#777"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: c }}
                  >
                    {["P", "A", "R", "S"][i]}
                  </div>
                ))}
              </div>
              <span>
                Trusted by <strong className="text-foreground">10,000+</strong> developers
              </span>
            </div>
          </div>

          {/* Right Column — Auth Card */}
          <div className="w-full max-w-lg mx-auto md:mx-0">
            {/* Mobile-only heading */}
            <div className="text-center md:hidden mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Welcome to Grind
              </h1>
              <p className="text-muted-foreground">
                Enter your email to get started
              </p>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl shadow-foreground/[0.03]">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground text-background mx-auto mb-4">
                  <img
                    src="/new_logo.jpg"
                    alt="Grind logo"
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
                <CardTitle className="text-2xl">Welcome to Grind</CardTitle>
                <CardDescription className="text-base">
                  Enter your email and we'll send you a verification code.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({ ...signInData, email: e.target.value })
                      }
                      required
                      className="h-12 text-base bg-background/50 border-border/40 focus:border-foreground/30 transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-foreground text-background hover:bg-foreground/90 rounded-lg font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        Continue with Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Back to home */}
                <Button
                  variant="outline"
                  className="w-full h-12 text-base rounded-lg bg-background/50"
                  onClick={() => navigate("/")}
                >
                  ← Back to Home
                </Button>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs text-muted-foreground px-4">
              By clicking continue, you agree to our{" "}
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
        </div>
      </main>
    </div>
  );
}
