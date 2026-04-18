import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import { BACKENDURL } from "../utils/urls";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";
import MainSideNav from "../components/MainSideNav";

interface Contest {
  id: string;
  title: string;
  type: "weekly" | "monthly";
  startTime: string;
  endTime: string;
  participants: number;
  problems: number;
  prize: string;
  status: "upcoming" | "ongoing" | "completed";
  difficulty: "easy" | "medium" | "hard";
}

export default function ContestsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "weekly" | "monthly">(
    "all",
  );
  const UserProfile = useSelector((state: RootState) => state.userDetails);

  // const setReduxContests = useDispatch();

  // const getUserinfo = useSelector((state: RootState) => state.userDetails);
  // const getContestinfo = useSelector((state: RootState) => state.contests);

  // console.log("User Info in Contests Page: ", getUserinfo);
  // console.log("Contest Info in Contests Page: ", getContestinfo);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);

    const response = await fetch(`${BACKENDURL}/contest/getcontests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    });

    if (response.ok) {
      const json = await response.json();
      setContests(json.contests);
      // setReduxContests(setReduxContests(json.contests));
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch contests",
        variant: "destructive",
        action: <button onClick={fetchContests}>Retry</button>,
      });
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredContests = contests.filter((contest) => {
    if (activeTab === "all") return true;
    return contest.type.toLowerCase() === activeTab;
  });

  const getStatusBadge = (status: Contest["status"]) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            Live Now
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-500 border-gray-500/20"
          >
            Completed
          </Badge>
        );
    }
  };

  const getDifficultyColor = (difficulty: Contest["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  function formatDate(iso?: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  }

  return (
    <div className="min-h-screen bg-background sidebar-offset">
      <MainSideNav
        active="contest"
        theme={theme}
        toggleTheme={toggleTheme}
        avatarUrl={UserProfile?.user?.avatar || ""}
        avatarFallback={UserProfile?.user?.fullname?.[0] || "G"}
        onProfile={() => navigate("/you")}
        onSignOut={handleSignOut}
      />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border/60 bg-background p-2">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Dashboard
                </p>
                <h1 className="text-base font-semibold sm:text-lg">Contests</h1>
              </div>
            </div>
            <Badge variant="outline">{contests.length} contests</Badge>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold">
              Compete & Track Progress
            </h2>
            <p className="text-muted-foreground">
              Compete in weekly and monthly coding challenges to win prizes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Contests
                    </p>
                    <p className="text-2xl font-bold">{contests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Participants
                    </p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-yellow-500/10 p-3">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Rank</p>
                    <p className="text-2xl font-bold">#0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Card className="mb-6 border-border/40">
            <CardHeader>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                  className="flex-1 sm:flex-none"
                >
                  All Contests
                </Button>
                <Button
                  variant={activeTab === "weekly" ? "default" : "outline"}
                  onClick={() => setActiveTab("weekly")}
                  className="flex-1 sm:flex-none"
                >
                  Weekly
                </Button>
                <Button
                  variant={activeTab === "monthly" ? "default" : "outline"}
                  onClick={() => setActiveTab("monthly")}
                  className="flex-1 sm:flex-none"
                >
                  Monthly
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContests.map((contest) => (
                <Card
                  key={contest.id}
                  className="cursor-pointer border-border/40 transition-colors hover:bg-muted/50"
                  onClick={() => navigate(`/contest/${contest.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold">
                            {contest.title}
                          </h3>
                          {getStatusBadge(
                            contest.status.toLocaleLowerCase() as
                              | "upcoming"
                              | "ongoing"
                              | "completed",
                          )}
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(
                              contest.difficulty.toLocaleLowerCase() as
                                | "easy"
                                | "medium"
                                | "hard",
                            )}
                          >
                            {contest.difficulty.toLocaleLowerCase()}
                          </Badge>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              <b>Start:</b> {formatDate(contest.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              <b>Duration: </b>
                              {formatDate(contest.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {contest.participants.toLocaleString()}{" "}
                              participants
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {contest.problems} Problems
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant={
                          contest.status === "ongoing" ? "default" : "outline"
                        }
                        className="lg:ml-4"
                      >
                        {contest.status.toLowerCase() === "upcoming" &&
                          "Register"}
                        {contest.status.toLowerCase() === "ongoing" &&
                          "Join Now"}
                        {contest.status.toLowerCase() === "completed" &&
                          "View Results"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredContests.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No contests found
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
