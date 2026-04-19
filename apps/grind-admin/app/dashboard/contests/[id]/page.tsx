"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Trophy, Users } from "lucide-react";

import { adminFetch } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContestDetailResponse = {
  success: boolean;
  contest: {
    id: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    participants: number;
    durationMinutes: number;
    status: string;
    difficulty: string;
    type: string;
    problems: Array<{
      id: string;
      order: number;
      challengeId: string;
      title: string;
      slug: string;
      difficulty: string;
      maxpoint: number;
      tags: string[];
    }>;
    participantsList: Array<{
      id: string;
      status: string;
      joinedAt: string;
      startedAt: string | null;
      completedAt: string | null;
      lastSeenAt: string;
      currentScore: number;
      currentRank: number | null;
      solvedCount: number;
      user: {
        id: string;
        username: string | null;
        fullname: string | null;
        email: string;
        avatar: string | null;
      };
    }>;
    leaderboard: Array<{
      rank: number;
      score: number;
      solvedCount: number;
      penalty: number;
      lastSubmissionAt: string | null;
      user: {
        id: string;
        username: string | null;
        fullname: string | null;
        email: string;
        avatar: string | null;
      };
    }>;
    recentSubmissions: Array<{
      id: string;
      verdict: string;
      points: number;
      language: string;
      createdAt: string;
      challengeTitle: string;
      user: {
        id: string;
        username: string | null;
        fullname: string | null;
        email: string;
      };
    }>;
  };
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

export default function ContestDetailPage() {
  const params = useParams<{ id: string }>();
  const contestId = params?.id;

  const [contest, setContest] = useState<ContestDetailResponse["contest"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contestId) {
      return;
    }

    const loadContest = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await adminFetch<ContestDetailResponse>(
          `/admin/contests/${contestId}`,
        );
        setContest(data.contest);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load contest details.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadContest();
  }, [contestId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading contest details...
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <Button variant="outline" asChild className="w-fit">
          <Link href="/dashboard/contests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to contests
          </Link>
        </Button>
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "Contest not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Button variant="outline" asChild className="w-fit">
            <Link href="/dashboard/contests">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to contests
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{contest.title}</h1>
            <Badge variant="outline">{contest.status}</Badge>
            <Badge variant="secondary">{contest.type}</Badge>
          </div>
          <p className="max-w-4xl text-sm text-muted-foreground">
            {contest.description || "No contest description provided."}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="mt-2 text-2xl font-semibold">{contest.participants}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Problems</p>
            <p className="mt-2 text-2xl font-semibold">{contest.problems.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="mt-2 text-2xl font-semibold">
              {contest.durationMinutes} min
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="mt-2 text-2xl font-semibold">{contest.difficulty}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Contest Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Starts</p>
                <p className="font-medium">{formatDate(contest.startTime)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ends</p>
                <p className="font-medium">{formatDate(contest.endTime)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-medium">Problem Set</p>
              {contest.problems.map((problem) => (
                <div
                  key={problem.id}
                  className="rounded-xl border border-border/50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {problem.order}. {problem.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{problem.maxpoint} pts</Badge>
                      <Badge variant="secondary">{problem.difficulty}</Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {problem.tags.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contest.leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No leaderboard entries yet.
              </p>
            ) : (
              contest.leaderboard.map((entry) => (
                <div
                  key={entry.user.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {entry.user.fullname || entry.user.username || entry.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.solvedCount} solved
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">#{entry.rank}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.score} pts
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Joined Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contest.participantsList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No users have joined this contest yet.
              </p>
            ) : (
              contest.participantsList.map((participant) => (
                <div
                  key={participant.id}
                  className="rounded-xl border border-border/50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {participant.user.fullname ||
                          participant.user.username ||
                          participant.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{participant.status}</Badge>
                      {participant.currentRank ? (
                        <Badge variant="secondary">
                          Rank #{participant.currentRank}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-4">
                    <span>Joined: {formatDate(participant.joinedAt)}</span>
                    <span>Last seen: {formatDate(participant.lastSeenAt)}</span>
                    <span>Score: {participant.currentScore} pts</span>
                    <span>Solved: {participant.solvedCount}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contest.recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contest submissions yet.
              </p>
            ) : (
              contest.recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-xl border border-border/50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{submission.challengeTitle}</p>
                    <Badge variant="outline">{submission.verdict}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {submission.user.fullname ||
                      submission.user.username ||
                      submission.user.email}
                  </p>
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                    <span>Language: {submission.language}</span>
                    <span>Points: {submission.points}</span>
                    <span>{formatDate(submission.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
