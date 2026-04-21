import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  Calendar,
  ChevronRight,
  Clock,
  Trophy,
  Users,
} from "lucide-react";

import MainSideNav from "../components/MainSideNav";
import { useTheme } from "../contexts/ThemeContext";
import type { ContestSummary } from "../types/contest";
import { useDashboardData } from "../hooks/useDashboardData";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function getStatusBadge(status: ContestSummary["status"]) {
  switch (status) {
    case "upcoming":
      return (
        <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-500">
          Upcoming
        </Badge>
      );
    case "ongoing":
      return (
        <Badge className="border-green-500/30 bg-green-500/10 text-green-500">
          Live
        </Badge>
      );
    case "completed":
      return (
        <Badge className="border-border/60 bg-muted/50 text-muted-foreground">
          Completed
        </Badge>
      );
  }
}

function getDifficultyClass(difficulty: ContestSummary["difficulty"]) {
  switch (difficulty) {
    case "easy":
      return "border-green-500/20 bg-green-500/10 text-green-500";
    case "medium":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-500";
    case "hard":
      return "border-red-500/20 bg-red-500/10 text-red-500";
  }
}

export default function ContestsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const {
    contests,
    contestsLoaded,
    userDetails: userProfileUser,
  } = useDashboardData(["contests", "userDetails"]);

  const loading = !contestsLoaded;
  const [activeTab, setActiveTab] = useState<"all" | "weekly" | "monthly">(
    "all",
  );

  const filteredContests = useMemo(() => {
    if (activeTab === "all") {
      return contests;
    }

    return contests.filter((contest) => contest.type === activeTab);
  }, [activeTab, contests]);

  const joinedContests = contests.filter((contest) => contest.isJoined).length;
  const activeContests = contests.filter((contest) => contest.status === "ongoing").length;
  const bestRank = contests
    .map((contest) => contest.userRank)
    .filter((rank): rank is number => typeof rank === "number")
    .sort((left, right) => left - right)[0];

  return (
    <div className="min-h-screen bg-background sidebar-offset">
      <MainSideNav
        active="contest"
        theme={theme}
        toggleTheme={toggleTheme}
        avatarUrl={userProfileUser?.avatar || ""}
        avatarFallback={userProfileUser?.fullname?.[0] || "G"}
        onProfile={() => navigate("/you")}
        onSignOut={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border/60 bg-background p-2">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Competitive Coding
                </p>
                <h1 className="text-base font-semibold sm:text-lg">Contests</h1>
              </div>
            </div>
            <Badge variant="outline">{contests.length} total</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/40">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Registered</p>
                <p className="mt-2 text-2xl font-semibold">{joinedContests}</p>
              </CardContent>
            </Card>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Live Contests</p>
                <p className="mt-2 text-2xl font-semibold">{activeContests}</p>
              </CardContent>
            </Card>
            <Card className="border-border/40">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Best Rank</p>
                <p className="mt-2 text-2xl font-semibold">
                  {bestRank ? `#${bestRank}` : "-"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40">
            <CardHeader>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </Button>
                <Button
                  variant={activeTab === "weekly" ? "default" : "outline"}
                  onClick={() => setActiveTab("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={activeTab === "monthly" ? "default" : "outline"}
                  onClick={() => setActiveTab("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="rounded-2xl border border-border/40 bg-card p-10 text-center text-muted-foreground">
              No contests found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContests.map((contest) => (
                <Card
                  key={contest.id}
                  className="cursor-pointer border-border/40 transition-colors hover:bg-muted/40"
                  onClick={() => navigate(`/contest/${contest.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold">{contest.title}</h3>
                          {getStatusBadge(contest.status)}
                          <Badge
                            variant="outline"
                            className={getDifficultyClass(contest.difficulty)}
                          >
                            {contest.difficulty}
                          </Badge>
                          {contest.isJoined ? (
                            <Badge variant="secondary">Registered</Badge>
                          ) : null}
                        </div>

                        <p className="max-w-3xl text-sm text-muted-foreground">
                          {contest.description || "Contest details will be available soon."}
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(contest.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{contest.durationMinutes} min</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{contest.participants} participants</span>
                          </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Trophy className="h-4 w-4" />
                              <span>{contest.problemsCount} problems</span>
                            </div>
                        </div>

                        {contest.userRank ? (
                          <p className="text-sm text-primary">
                            Your current rank: #{contest.userRank}
                          </p>
                        ) : null}
                      </div>

                      <Button
                        variant={contest.status === "ongoing" ? "default" : "outline"}
                      >
                        {contest.status === "upcoming" && (
                          contest.isJoined ? "Manage Registration" : "View Details"
                        )}
                        {contest.status === "ongoing" &&
                          (contest.isJoined ? "Enter Contest" : "View Contest")}
                        {contest.status === "completed" && "View Leaderboard"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
