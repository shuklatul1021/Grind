import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/sheet";
import { Tabs, TabsContent } from "@repo/ui/tabs";
import {
  Edit,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  ShieldCheck,
  Sparkles,
  SquareChevronRight,
  Sun,
  Trash2,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { BACKENDURL } from "../utils/urls";

interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  status: "published" | "draft";
  submissions: number;
}

export interface Contest {
  id: string;
  title: string;
  type: "weekly" | "monthly";
  status: "upcoming" | "ongoing" | "completed";
  participants: number;
  problems: number;
}

type DashboardTab = "overview" | "problems" | "contests";

const tabNavigation: Array<{
  value: DashboardTab;
  title: string;
  description: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    value: "overview",
    title: "Overview",
    description: "Key metrics and actions",
    icon: LayoutDashboard,
  },
  {
    value: "problems",
    title: "Problems",
    description: "Create and manage coding sets",
    icon: FileText,
  },
  {
    value: "contests",
    title: "Contests",
    description: "Launch and monitor events",
    icon: Trophy,
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    void fetchDashboardData();
  }, [navigate]);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${BACKENDURL}/problems/getproblems`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("adminToken") || "",
        },
      });

      const data = await response.json();
      setProblems(Array.isArray(data.problems) ? data.problems : []);
    } catch (error) {
      console.error(error);
      setProblems([]);
    }
  };

  const fetchContests = async () => {
    try {
      const response = await fetch(`${BACKENDURL}/contest/getcontests`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("adminToken") || "",
        },
      });

      const data = await response.json();
      setContests(Array.isArray(data.contests) ? data.contests : []);
    } catch (error) {
      console.error(error);
      setContests([]);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProblems(), fetchContests()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleTabSelect = (tab: DashboardTab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-300";
      case "hard":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300"
          >
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-border/60"
          >
            Draft
          </Badge>
        );
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-300"
          >
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300"
          >
            Live
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-border/60"
          >
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const sidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-left"
          >
            <div className="rounded-xl bg-primary p-2 text-primary-foreground shadow-md">
              <SquareChevronRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Grind
              </p>
              <p className="text-base font-semibold">Admin Console</p>
            </div>
          </button>
          <Badge variant="secondary" className="font-medium">
            Premium
          </Badge>
        </div>

        <Card className="border-border/60 bg-gradient-to-br from-cyan-500/10 via-background to-orange-500/10 shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-cyan-500" />
              Control Center
            </div>
            <p className="text-lg font-semibold leading-snug">
              Build cleaner workflows for every admin action
            </p>
            <p className="text-xs text-muted-foreground">
              Switch between tabs, launch actions, and monitor platform growth
              in one place.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-5" />

      <nav className="space-y-2">
        {tabNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.value;

          return (
            <Button
              key={item.value}
              variant="ghost"
              onClick={() => handleTabSelect(item.value)}
              className={`h-auto w-full justify-start rounded-xl px-3 py-3 text-left transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "hover:bg-muted"
              }`}
            >
              <span
                className={`mr-3 rounded-lg p-2 ${
                  isActive ? "bg-white/20" : "bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">
                  {item.title}
                </span>
                <span
                  className={`block text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {item.description}
                </span>
              </span>
              {isActive && <Sparkles className="h-4 w-4" />}
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-5">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="space-y-2 p-4">
            <p className="text-sm font-semibold">Quick Create</p>
            <Button
              className="w-full justify-start"
              onClick={() => navigate("/admin/dashboard/createproblem")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Problem
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/dashboard/createcontest")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Contest
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>GA</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Grind Admin</p>
            <p className="truncate text-xs text-muted-foreground">
              Operational access
            </p>
          </div>
        </div>

        <div className={isMobile ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="justify-start"
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="justify-start text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Manrope", "Segoe UI", sans-serif',
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative grid min-h-screen md:grid-cols-[290px_1fr]">
        <aside className="hidden border-r border-border/40 bg-card/70 p-4 backdrop-blur-xl md:block">
          <Card className="h-full border-border/60 bg-background/85 shadow-xl">
            <CardContent className="flex h-full flex-col p-5">
              {sidebarContent()}
            </CardContent>
          </Card>
        </aside>

        <section className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 px-4 py-3 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-2"
                onClick={() => navigate("/")}
              >
                <SquareChevronRight className="h-5 w-5" />
                <span className="text-base font-semibold">Grind Admin</span>
              </button>

              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[88vw] border-r border-border/50 bg-background/95 p-0 sm:max-w-sm"
                >
                  <div className="h-full p-4">{sidebarContent(true)}</div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <Card className="overflow-hidden border-border/60 bg-gradient-to-r from-cyan-500/10 via-background to-orange-500/10 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                      <Badge
                        variant="secondary"
                        className="w-fit bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                      >
                        Premium Dashboard
                      </Badge>
                      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                        Admin Dashboard
                      </h1>
                      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                        Manage problems, contests, and growth with a cleaner
                        control flow from a single left-side command panel.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() =>
                          navigate("/admin/dashboard/createproblem")
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Problem
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate("/admin/dashboard/createcontest")
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Contest
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as DashboardTab)}
              className="mt-6 space-y-6"
            >
              <TabsContent
                value="overview"
                className="mt-0 space-y-6 animate-in fade-in duration-500"
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      title: "Total Problems",
                      value: problems.length.toLocaleString(),
                      icon: FileText,
                      iconStyle:
                        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
                    },
                    {
                      title: "Total Contests",
                      value: contests.length.toLocaleString(),
                      icon: Trophy,
                      iconStyle:
                        "bg-amber-500/10 text-amber-600 dark:text-amber-300",
                    },
                    {
                      title: "Active Users",
                      value: "12,543",
                      icon: Users,
                      iconStyle:
                        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
                    },
                    {
                      title: "Submissions",
                      value: "45,678",
                      icon: TrendingUp,
                      iconStyle:
                        "bg-orange-500/10 text-orange-600 dark:text-orange-300",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <Card
                        key={item.title}
                        className="border-border/60 bg-card/75 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className={`rounded-xl p-3 ${item.iconStyle}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {item.title}
                              </p>
                              <p className="text-2xl font-semibold tracking-tight">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid gap-6 xl:grid-cols-5">
                  <Card className="xl:col-span-3 border-border/60 bg-card/80 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/70 p-4">
                        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-300">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New problem published
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 hours ago
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/70 p-4">
                        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-300">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Weekly contest started
                          </p>
                          <p className="text-xs text-muted-foreground">
                            5 hours ago
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/70 p-4">
                        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600 dark:text-orange-300">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            1,234 new users registered
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1 day ago
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="xl:col-span-2 border-border/60 bg-card/80 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        className="w-full justify-start"
                        onClick={() =>
                          navigate("/admin/dashboard/createproblem")
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Problem
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() =>
                          navigate("/admin/dashboard/createcontest")
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Contest
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => handleTabSelect("problems")}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View All Problems
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => handleTabSelect("contests")}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View All Contests
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent
                value="problems"
                className="mt-0 space-y-6 animate-in fade-in duration-500"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Problems Management
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage coding challenges and publication status
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/admin/dashboard/createproblem")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Problem
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-14">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : problems.length === 0 ? (
                  <Card className="border-dashed border-border/70 bg-card/70">
                    <CardContent className="p-10 text-center">
                      <p className="text-lg font-semibold">No problems found</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create your first problem to start building challenge
                        sets.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {problems.map((problem) => (
                      <Card
                        key={problem.id}
                        className="border-border/60 bg-card/80 shadow-sm"
                      >
                        <CardContent className="p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-lg font-semibold">
                                  {problem.title}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={getDifficultyColor(
                                    problem.difficulty.toLowerCase(),
                                  )}
                                >
                                  {problem.difficulty.charAt(0).toUpperCase() +
                                    problem.difficulty.slice(1)}
                                </Badge>
                                {getStatusBadge(problem.status || "published")}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {(problem.submissions || 0).toLocaleString()}{" "}
                                submissions
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/admin/editproblem/${problem.id}`)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/admin/dashboard/problem/${problem.id}`,
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="contests"
                className="mt-0 space-y-6 animate-in fade-in duration-500"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Contests Management
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Control schedules, participation, and contest lifecycle
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/admin/dashboard/createcontest")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Contest
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-14">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : contests.length === 0 ? (
                  <Card className="border-dashed border-border/70 bg-card/70">
                    <CardContent className="p-10 text-center">
                      <p className="text-lg font-semibold">No contests found</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create a contest to engage users with timed challenges.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {contests.map((contest) => (
                      <Card
                        key={contest.id}
                        className="border-border/60 bg-card/80 shadow-sm"
                      >
                        <CardContent className="p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-lg font-semibold">
                                  {contest.title}
                                </h3>
                                <Badge variant="secondary">
                                  {contest.type.toUpperCase()}
                                </Badge>
                                {getStatusBadge(contest.status.toLowerCase())}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {(contest.participants || 0).toLocaleString()}{" "}
                                participants -{" "}
                                {(contest.problems || 0).toLocaleString()}{" "}
                                problems
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/admin/edit-contest/${contest.id}`)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/admin/dashboard/contest/${contest.id}`,
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </section>
      </div>
    </div>
  );
}
