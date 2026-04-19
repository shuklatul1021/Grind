import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Calendar, Clock, Trophy, Users } from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";

import type { RootState } from "../state/ReduxStateProvider";
import type { ContestDetail } from "../types/contest";
import { useTheme } from "../contexts/ThemeContext";
import MainSideNav from "../components/MainSideNav";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import { BACKENDURL } from "../utils/urls";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function getStatusBadge(status: ContestDetail["status"]) {
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

export default function ContestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const userProfile = useSelector((state: RootState) => state.userDetails);

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const loadContest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKENDURL}/contest/getcontest/${id}`, {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load contest.");
      }

      setContest(data.contest);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load contest.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    void loadContest();
  }, [id]);

  const handleJoinContest = async () => {
    if (!id) {
      return;
    }

    try {
      setJoining(true);
      const response = await fetch(`${BACKENDURL}/contest/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Could not join contest.");
      }

      toast({
        title: "Registered",
        description: "Contest registration confirmed.",
      });
      await loadContest();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Could not join contest.",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (!contest) {
      return "Loading";
    }

    if (contest.status === "upcoming") {
      return contest.isRegistered ? "Registered" : "Register";
    }

    if (contest.status === "ongoing") {
      return contest.canEnter ? "Enter Contest" : "Contest Locked";
    }

    return "View Leaderboard";
  }, [contest]);

  return (
    <div className="min-h-screen bg-background sidebar-offset">
      <MainSideNav
        active="contest"
        theme={theme}
        toggleTheme={toggleTheme}
        avatarUrl={userProfile?.user?.avatar || ""}
        avatarFallback={userProfile?.user?.fullname?.[0] || "G"}
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
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="rounded-lg border border-border/60 bg-background p-2">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Contest Detail
                </p>
                <h2 className="text-base font-semibold sm:text-lg">
                  {contest?.title || "Contest"}
                </h2>
              </div>
            </div>
            {contest ? getStatusBadge(contest.status) : null}
          </div>

          {loading || !contest ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-4">
                <Card className="border-border/40">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(contest.status)}
                      <Badge variant="outline">{contest.type}</Badge>
                      <Badge variant="secondary">{contest.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{contest.title}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                        {contest.description || "Contest description coming soon."}
                      </p>
                    </div>

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
                        <span>{contest.participants} registered</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>{contest.problems.length} problems</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Problems</h4>
                      <span className="text-xs text-muted-foreground">
                        Ordered by contest sequence
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contest.problems.map((problem) => (
                      <div
                        key={problem.id}
                        className="rounded-xl border border-border/50 bg-background px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">
                              {problem.order}. {problem.challenge.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {problem.challenge.tags.join(", ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {problem.challenge.maxpoint} pts
                            </Badge>
                            <Badge variant="secondary">
                              {problem.challenge.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <aside className="space-y-4">
                <Card className="border-border/40">
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <p className="text-sm text-muted-foreground">Your status</p>
                      <p className="mt-1 text-lg font-semibold">
                        {contest.participant?.status || "Not registered"}
                      </p>
                      {contest.participant?.currentRank ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Current rank: #{contest.participant.currentRank}
                        </p>
                      ) : null}
                    </div>

                    <Button
                      className="w-full"
                      disabled={
                        joining ||
                        (contest.status === "upcoming" && contest.isRegistered) ||
                        (contest.status === "ongoing" && !contest.canEnter)
                      }
                      onClick={() => {
                        if (contest.status === "upcoming") {
                          void handleJoinContest();
                          return;
                        }

                        navigate(`/contest/${contest.id}/live`);
                      }}
                    >
                      {joining ? "Registering..." : actionLabel}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Leaderboard</h4>
                      <span className="text-xs text-muted-foreground">
                        Top {contest.leaderboard.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contest.leaderboard.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Leaderboard will populate once submissions start.
                      </p>
                    ) : (
                      contest.leaderboard.map((entry) => (
                        <div
                          key={entry.userId}
                          className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {entry.user.fullname ||
                                entry.user.username ||
                                "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry.solvedCount} solved
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">#{entry.rank}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.score} pts
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
