import { Link, useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  Moon,
  Sun,
  LogOut,
  SquareChevronRight,
  Lock,
  Crown,
  Code2,
  Brain,
  Trophy,
  BookOpen,
  Star,
  Users,
  Calendar,
  Shield,
  Sparkles,
  CheckCircle2,
  FileText,
  Video,
  MessageCircle,
  Award,
  UserIcon,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@repo/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";

export default function PremiumPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const UserProfile = useSelector((state: RootState) => state.userDetails);

  const premiumFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Full Access to Grind AI",
      description:
        "Unlimited AI credits for coding assistance, debugging, and problem-solving. Get instant help with your code 24/7.",
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "DSA Notes & Resources",
      description:
        "Comprehensive data structures and algorithms notes, cheat sheets, and visual explanations for every topic.",
      color: "from-purple-500 to-pink-500",
      badge: "Essential",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Premium Questions",
      description:
        "Access 1000+ exclusive FAANG-level problems with detailed solutions, hints, and multiple approaches.",
      color: "from-yellow-500 to-orange-500",
      badge: "Exclusive",
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Personal Compiler",
      description:
        "Priority compilation queue, faster execution, unlimited runs, and ability to save unlimited code snippets.",
      color: "from-green-500 to-emerald-500",
      badge: "Pro",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "New Features First Access",
      description:
        "Be the first to try new features, beta tools, and experimental AI models before anyone else.",
      color: "from-indigo-500 to-blue-500",
      badge: "Beta",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "24/7 Attendance & Support",
      description:
        "Round-the-clock priority support, live chat assistance, and dedicated help from our expert team.",
      color: "from-red-500 to-pink-500",
      badge: "Premium",
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Solutions",
      description:
        "Step-by-step video explanations for every problem with whiteboard sessions and code walkthroughs.",
      color: "from-cyan-500 to-blue-500",
      badge: "New",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "1-on-1 Mentorship",
      description:
        "Monthly personalized mentorship sessions with industry experts for career guidance and technical interviews.",
      color: "from-orange-500 to-red-500",
      badge: "Elite",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Resume Review",
      description:
        "Get your resume reviewed and optimized by FAANG engineers to increase your interview chances.",
      color: "from-violet-500 to-purple-500",
      badge: "Career",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Exclusive Contests",
      description:
        "Participate in premium contests with cash prizes, company sponsorships, and direct interview opportunities.",
      color: "from-pink-500 to-rose-500",
      badge: "Contest",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Interview Preparation",
      description:
        "Structured 30/60/90 day interview prep plans, mock interviews, and company-specific question sets.",
      color: "from-teal-500 to-green-500",
      badge: "Interview",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Ad-Free Experience",
      description:
        "Enjoy completely ad-free browsing, faster page loads, and distraction-free coding environment.",
      color: "from-slate-500 to-gray-500",
      badge: "Premium",
    },
  ];

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/problems"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link
              to="/contest"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link
              to="/compiler"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Compiler
            </Link>
            <Link
              to="/grind-ai"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Grind AI
            </Link>
            <Link
              to="/premium"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-medium transition-all hover:from-blue-600 hover:to-purple-600 hover:text-black"
            >
              Premium
            </Link>
          </div>
          <div className="flex items-center gap-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={UserProfile?.user.avatar || ""}
                      alt="@user"
                    />
                     <AvatarFallback>{UserProfile?.user.fullname?.[0] || "G"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/you")}>
                  <UserIcon className="mr-2 h-4 w-4" />Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container flex-1 px-4 py-6 flex flex-col">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 mb-4 relative">
            <Crown className="h-8 w-8 text-yellow-500" />
            <Lock className="h-4 w-4 text-yellow-600 absolute -top-1 -right-1" />
          </div>
          <Badge className="mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            Premium Zone
          </Badge>
          <h1 className="mb-3 text-4xl font-bold">Unlock Premium Features</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Upgrade to premium and get access to all exclusive features, tools,
            and resources to accelerate your coding journey
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mb-8">
            {premiumFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-border/40 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer"
              >
                {/* Lock Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                  <div className="text-center transform scale-95 group-hover:scale-100 transition-transform duration-300">
                    <Lock className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Premium Feature
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upgrade to unlock
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 h-8 text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      onClick={() => navigate("/premium/pricing")}
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Upgrade Now
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="max-w-4xl mx-auto border-border/40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-12 w-12 text-yellow-500" />
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Ready to Unlock All Features?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of developers who upgraded to premium. Get
                instant access to all features and accelerate your learning
                journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                  onClick={() => navigate("/pricing")}
                >
                  <Crown className="h-5 w-5" />
                  Upgrade to Premium
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/problems")}
                >
                  Continue with Free Plan
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>7-Day Money Back</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Instant Access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
