"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Loader2, Trash2, Trophy } from "lucide-react";

import { adminFetch } from "@/lib/admin-api";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ChallengeSummary = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  maxpoint: number;
  tags: string[];
  createdAt: string;
};

type ContestSummary = {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  participants: number;
  durationMinutes: number;
  problemsCount: number;
  status: string;
  difficulty: string;
  type: string;
  winner: string | null;
};

type ChallengeSummaryResponse = {
  success: boolean;
  challenges: ChallengeSummary[];
};

type ContestSummaryResponse = {
  success: boolean;
  contests: ContestSummary[];
};

export default function ContestManagementPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("WEEKLY");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [selectedChallengeIds, setSelectedChallengeIds] = useState<string[]>(
    [],
  );
  const [challengeQuery, setChallengeQuery] = useState("");

  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedChallenges = useMemo(
    () =>
      selectedChallengeIds
        .map((id) => challenges.find((challenge) => challenge.id === id))
        .filter((challenge): challenge is ChallengeSummary =>
          Boolean(challenge),
        ),
    [challenges, selectedChallengeIds],
  );

  const filteredChallenges = useMemo(() => {
    const query = challengeQuery.trim().toLowerCase();
    if (!query) {
      return challenges;
    }

    return challenges.filter((challenge) => {
      return (
        challenge.title.toLowerCase().includes(query) ||
        challenge.slug.toLowerCase().includes(query) ||
        challenge.difficulty.toLowerCase().includes(query) ||
        challenge.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [challengeQuery, challenges]);

  const scheduleInfo = useMemo(() => {
    if (!startTime || !endTime) {
      return {
        tone: "muted" as const,
        text: "Pick both start and end time to preview contest duration.",
      };
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return {
        tone: "error" as const,
        text: "Please enter valid date and time values.",
      };
    }

    const diffMinutes = Math.floor(
      (endDate.getTime() - startDate.getTime()) / 60000,
    );

    if (diffMinutes <= 0) {
      return {
        tone: "error" as const,
        text: "End time must be after start time.",
      };
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const durationParts: string[] = [];

    if (hours > 0) {
      durationParts.push(`${hours}h`);
    }

    durationParts.push(`${minutes}m`);

    return {
      tone: "muted" as const,
      text: `Estimated duration: ${durationParts.join(" ")}`,
    };
  }, [endTime, startTime]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [challengeData, contestData] = await Promise.all([
        adminFetch<ChallengeSummaryResponse>("/admin/challenges/summary"),
        adminFetch<ContestSummaryResponse>("/admin/contests"),
      ]);

      setChallenges(challengeData.challenges);
      setContests(contestData.contests);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load contest management data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPageData();
  }, []);

  const toggleChallenge = (challengeId: string) => {
    setSelectedChallengeIds((current) =>
      current.includes(challengeId)
        ? current.filter((id) => id !== challengeId)
        : [...current, challengeId],
    );
  };

  const resetContestForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setType("WEEKLY");
    setDifficulty("MEDIUM");
    setSelectedChallengeIds([]);
    setChallengeQuery("");
  };

  const handleCreateContest = async () => {
    if (!title.trim() || !description.trim() || !startTime || !endTime) {
      setError("Please fill the title, description, and schedule.");
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Please choose valid start and end date values.");
      return;
    }

    if (endDate <= startDate) {
      setError("End time must be after start time.");
      return;
    }

    if (selectedChallengeIds.length === 0) {
      setError("Select at least one coding problem for the contest.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      await adminFetch<{ success: boolean; message: string }>(
        "/admin/set-contest",
        {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            starttime: startDate.toISOString(),
            endtime: endDate.toISOString(),
            challengeids: selectedChallengeIds,
            type,
            difficulty,
          }),
        },
      );

      setNotice("Contest created successfully.");
      resetContestForm();
      await loadPageData();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not create contest.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContest = async (contestId: string) => {
    try {
      setError("");
      setNotice("");
      await adminFetch<{ success: boolean; message: string }>(
        `/admin/delete-contest/${contestId}`,
        {
          method: "DELETE",
        },
      );
      setNotice("Contest deleted successfully.");
      await loadPageData();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete contest.",
      );
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3rem",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h2 className="text-xl font-semibold">Contest Management</h2>
                <p className="text-sm text-muted-foreground">
                  Create and schedule contests, then monitor participation in
                  one place.
                </p>
              </div>

              <div className="grid gap-4 px-4 lg:px-6 xl:grid-cols-[1.15fr_0.85fr]">
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Create Contest
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {error ? (
                      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    ) : null}
                    {notice ? (
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
                        {notice}
                      </div>
                    ) : null}

                    <div className="space-y-4 rounded-xl border border-border/60 p-4">
                      <p className="text-sm font-medium">Contest Basics</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contest-title">Title</Label>
                          <Input
                            id="contest-title"
                            placeholder="Weekly Contest 48"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contest-type">Type</Label>
                          <Select value={type} onValueChange={setType}>
                            <SelectTrigger id="contest-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contest-description">Description</Label>
                        <Textarea
                          id="contest-description"
                          placeholder="Short contest brief, rules, and focus."
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                          className="min-h-28"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border/60 p-4">
                      <p className="text-sm font-medium">
                        Schedule and Difficulty
                      </p>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="contest-start">Start Time</Label>
                          <Input
                            id="contest-start"
                            type="datetime-local"
                            value={startTime}
                            onChange={(event) =>
                              setStartTime(event.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contest-end">End Time</Label>
                          <Input
                            id="contest-end"
                            type="datetime-local"
                            value={endTime}
                            onChange={(event) => setEndTime(event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contest-difficulty">Difficulty</Label>
                          <Select
                            value={difficulty}
                            onValueChange={setDifficulty}
                          >
                            <SelectTrigger id="contest-difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EASY">Easy</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HARD">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p
                        className={`text-xs ${
                          scheduleInfo.tone === "error"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {scheduleInfo.text}
                      </p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-border/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <Label htmlFor="contest-problem-search">
                            Select Problems
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Pick problems in the order they should appear in
                            contest.
                          </p>
                        </div>
                        <Badge variant="outline">
                          {selectedChallengeIds.length} selected
                        </Badge>
                      </div>

                      <Input
                        id="contest-problem-search"
                        placeholder="Search by title, slug, tag, or difficulty"
                        value={challengeQuery}
                        onChange={(event) =>
                          setChallengeQuery(event.target.value)
                        }
                      />

                      {filteredChallenges.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                          No problems matched your search.
                        </div>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {filteredChallenges.map((challenge) => {
                            const isSelected = selectedChallengeIds.includes(
                              challenge.id,
                            );

                            return (
                              <label
                                key={challenge.id}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                                  isSelected
                                    ? "border-primary/60 bg-primary/5"
                                    : "border-border/60"
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    toggleChallenge(challenge.id)
                                  }
                                />
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    {challenge.title}
                                  </p>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>{challenge.difficulty}</span>
                                    <span>{challenge.maxpoint} pts</span>
                                    <span>{challenge.slug}</span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {selectedChallenges.length > 0 ? (
                      <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                        <p className="mb-2 text-sm font-medium">
                          Contest Order
                        </p>
                        <div className="space-y-2">
                          {selectedChallenges.map((challenge, index) => (
                            <div
                              key={challenge.id}
                              className="flex items-center justify-between rounded-lg border border-border/50 bg-background px-3 py-2"
                            >
                              <span className="text-sm">
                                {index + 1}. {challenge.title}
                              </span>
                              <Badge variant="secondary">
                                {challenge.difficulty}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => void handleCreateContest()}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Contest"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetContestForm}
                        disabled={saving}
                      >
                        Reset form
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle>Scheduled Contests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {loading ? (
                      <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading contests...
                      </div>
                    ) : contests.length === 0 ? (
                      <div className="py-10 text-sm text-muted-foreground">
                        No contests found.
                      </div>
                    ) : (
                      contests.map((contest) => (
                        <div
                          key={contest.id}
                          className="rounded-xl border border-border/60 bg-background p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{contest.title}</p>
                                <Badge variant="outline">
                                  {contest.status}
                                </Badge>
                                <Badge variant="secondary">
                                  {contest.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {contest.problemsCount} problems •{" "}
                                {contest.durationMinutes} min
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(contest.startTime).toLocaleString()}
                              </p>
                              {contest.winner ? (
                                <p className="text-xs text-muted-foreground">
                                  Current winner: {contest.winner}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" asChild>
                                <Link
                                  href={`/dashboard/contests/${contest.id}`}
                                >
                                  View details
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  void handleDeleteContest(contest.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
