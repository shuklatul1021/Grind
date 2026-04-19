import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Play,
  Save,
  Trophy,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";

import type { RootState } from "../state/ReduxStateProvider";
import type { StarterCode } from "../types/problem";
import type {
  ContestLeaderboardEntry,
  ContestWorkspace,
} from "../types/contest";
import CodeEditor from "./CodeEditor";
import { useContestSocket } from "../hooks/useContestSocket";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import { BACKENDURL, COMPILER_URL } from "../utils/urls";

type DraftState = Record<
  string,
  {
    code: string;
    language: string;
  }
>;

type CompilerRunResult = {
  output: string;
  error: string;
  executionTime: number;
};

function parseStarterCode(rawStarterCode: string): StarterCode[] {
  try {
    const parsed = JSON.parse(rawStarterCode) as StarterCode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function createInitialDraft(problem: ContestWorkspace["problems"][number]) {
  const starterCodes = parseStarterCode(problem.starterCode);
  const preferredLanguage =
    problem.savedLanguage ||
    starterCodes.find((item) => item.language === "python")?.language ||
    starterCodes[0]?.language ||
    "python";

  return {
    language: preferredLanguage,
    code:
      problem.savedCode ||
      starterCodes.find((item) => item.language === preferredLanguage)?.code ||
      starterCodes[0]?.code ||
      "",
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function formatTimeRemaining(endTime: string) {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
}

async function pollCompilerJob(jobId: string, token: string) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const response = await fetch(`${COMPILER_URL}/compiler/jobs/${jobId}`, {
      headers: {
        "Content-Type": "application/json",
        token,
      },
    });

    const data = await response.json();
    if (!response.ok || !data?.success) {
      throw new Error(data?.message || "Could not read compiler job.");
    }

    if (data.status === "completed") {
      return (data.result ?? {
        output: "",
        error: "",
        executionTime: 0,
      }) as CompilerRunResult;
    }

    if (data.status === "failed") {
      throw new Error(data.error || "Compiler execution failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error("Compiler job timed out.");
}

export default function ContestWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const userProfile = useSelector((state: RootState) => state.userDetails);

  const [workspace, setWorkspace] = useState<ContestWorkspace | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [drafts, setDrafts] = useState<DraftState>({});
  const [customInput, setCustomInput] = useState("");
  const [runOutput, setRunOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [currentUserEntry, setCurrentUserEntry] =
    useState<ContestLeaderboardEntry | null>(null);

  const loadWorkspace = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BACKENDURL}/contest/${id}/workspace`, {
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Could not load contest workspace.");
      }

      const nextWorkspace = data.contest as ContestWorkspace;
      const nextDrafts = nextWorkspace.problems.reduce<DraftState>((acc, problem) => {
        acc[problem.mappingId] = createInitialDraft(problem);
        return acc;
      }, {});

      setWorkspace(nextWorkspace);
      setDrafts(nextDrafts);
      setSelectedProblemId((current) =>
        current && nextWorkspace.problems.some((problem) => problem.mappingId === current)
          ? current
          : nextWorkspace.problems[0]?.mappingId || "",
      );

      const currentUser = nextWorkspace.leaderboard.find(
        (entry) => entry.userId === userProfile?.user?.id,
      );
      setCurrentUserEntry(currentUser ?? null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Could not load contest workspace.",
        variant: "destructive",
      });
      navigate(`/contest/${id}`);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, token, userProfile?.user?.id]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setTimeRemaining(formatTimeRemaining(workspace.endTime));
    const timer = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(workspace.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [workspace]);

  const selectedProblem = useMemo(
    () =>
      workspace?.problems.find((problem) => problem.mappingId === selectedProblemId) ||
      null,
    [selectedProblemId, workspace],
  );

  const currentDraft = selectedProblem ? drafts[selectedProblem.mappingId] : null;
  const starterCodes = useMemo(
    () => (selectedProblem ? parseStarterCode(selectedProblem.starterCode) : []),
    [selectedProblem],
  );

  const setDraft = (mappingId: string, nextValue: { code: string; language: string }) => {
    setDrafts((current) => ({
      ...current,
      [mappingId]: nextValue,
    }));
  };

  const handleLeaderboardUpdate = useCallback(
    (leaderboard: ContestLeaderboardEntry[], currentUser: ContestLeaderboardEntry | null) => {
      setWorkspace((current) =>
        current
          ? {
              ...current,
              leaderboard,
              participant: {
                ...current.participant,
                currentRank: currentUser?.rank ?? current.participant.currentRank,
                currentScore: currentUser?.score ?? current.participant.currentScore,
              },
            }
          : current,
      );
      setCurrentUserEntry(currentUser);
    },
    [],
  );

  const handleParticipantSync = useCallback(
    (payload: { rank?: number | null; score?: number | null }) => {
      setWorkspace((current) =>
        current
          ? {
              ...current,
              participant: {
                ...current.participant,
                currentRank:
                  payload.rank === undefined ? current.participant.currentRank : payload.rank,
                currentScore:
                  payload.score === undefined
                    ? current.participant.currentScore
                    : payload.score,
              },
            }
          : current,
      );
    },
    [],
  );

  const handleSocketError = useCallback((message: string) => {
    console.error(message);
  }, []);

  const { isConnected } = useContestSocket({
    contestId: id,
    token,
    onLeaderboardUpdate: handleLeaderboardUpdate,
    onParticipantSync: handleParticipantSync,
    onError: handleSocketError,
  });

  useEffect(() => {
    if (!workspace || !selectedProblem || !currentDraft) {
      return;
    }

    const saveTimer = setTimeout(async () => {
      if (workspace.status !== "ongoing" || !currentDraft.code.trim()) {
        return;
      }

      try {
        setSaving(true);
        await fetch(
          `${BACKENDURL}/contest/${workspace.id}/problems/${selectedProblem.mappingId}/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token,
            },
            body: JSON.stringify(currentDraft),
          },
        );
      } catch (error) {
        console.error("Contest draft save failed", error);
      } finally {
        setSaving(false);
      }
    }, 1500);

    return () => clearTimeout(saveTimer);
  }, [currentDraft, selectedProblem, token, workspace]);

  const handleLanguageChange = (language: string) => {
    if (!selectedProblem || !currentDraft) {
      return;
    }

    const nextCode =
      starterCodes.find((item) => item.language === language)?.code ?? currentDraft.code;

    setDraft(selectedProblem.mappingId, {
      language,
      code: currentDraft.code.trim() ? currentDraft.code : nextCode,
    });
  };

  const handleRunCode = async () => {
    if (!currentDraft || !selectedProblem || !token) {
      return;
    }

    try {
      setRunning(true);
      setRunOutput("Queueing run...");

      const response = await fetch(`${COMPILER_URL}/compiler/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          code: currentDraft.code,
          language: currentDraft.language,
          input: customInput || selectedProblem.examples[0]?.input || "",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success || !data.jobId) {
        throw new Error(data?.message || "Could not queue compiler run.");
      }

      const result = await pollCompilerJob(data.jobId, token);
      setRunOutput(
        [result.output, result.error, `Execution time: ${result.executionTime}ms`]
          .filter(Boolean)
          .join("\n\n"),
      );
    } catch (error) {
      setRunOutput(error instanceof Error ? error.message : "Code run failed.");
      toast({
        title: "Run failed",
        description: error instanceof Error ? error.message : "Code run failed.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!workspace || !selectedProblem || !currentDraft) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${BACKENDURL}/contest/${workspace.id}/problems/${selectedProblem.mappingId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(currentDraft),
        },
      );

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Contest submission failed.");
      }

      const result = data.result;
      setRunOutput(
        [
          `Verdict: ${result.verdict}`,
          `Passed: ${result.passedTestCases}/${result.totalTestCases}`,
          `Points: ${result.points}`,
          result.error,
          result.expectedOutput
            ? `Expected: ${result.expectedOutput}\nActual: ${result.actualOutput || ""}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
      );

      toast({
        title: result.verdict === "ACCEPTED" ? "Accepted" : "Submission evaluated",
        description: `Current rank: ${
          result.currentRank ? `#${result.currentRank}` : "pending"
        }`,
      });

      await loadWorkspace();
    } catch (error) {
      toast({
        title: "Submit failed",
        description:
          error instanceof Error ? error.message : "Contest submission failed.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !workspace || !selectedProblem || !currentDraft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading contest workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-[1700px] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/contest/${workspace.id}`)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Live Contest
                </p>
                <h1 className="text-lg font-semibold">{workspace.title}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-2">
                <Clock className="h-3.5 w-3.5" />
                {workspace.status === "ongoing" ? timeRemaining : "Completed"}
              </Badge>
              <Badge variant="outline" className="gap-2">
                {isConnected ? (
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-red-500" />
                )}
                {isConnected ? "Live rank connected" : "Reconnecting"}
              </Badge>
              <Badge variant="secondary">
                Rank {workspace.participant.currentRank ? `#${workspace.participant.currentRank}` : "-"}
              </Badge>
              <Badge variant="outline">
                {userProfile?.user?.fullname || userProfile?.user?.username || "Contestant"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[280px_1fr_320px]">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Problems</h2>
                  <Badge variant="outline">{workspace.problems.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {workspace.problems.map((problem) => (
                  <button
                    key={problem.mappingId}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                      selectedProblemId === problem.mappingId
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedProblemId(problem.mappingId)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">
                        {problem.order}. {problem.title}
                      </p>
                      {problem.isSolved ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          Solved
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {problem.maxpoint} pts
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedProblem.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedProblem.tags.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedProblem.difficulty}</Badge>
                      <Badge variant="outline">{selectedProblem.maxpoint} pts</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {selectedProblem.description}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedProblem.examples.map((example, index) => (
                      <div
                        key={`${selectedProblem.mappingId}-${index}`}
                        className="rounded-xl border border-border/50 bg-background p-3"
                      >
                        <p className="mb-2 text-sm font-medium">Example {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Input: {example.input}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Output: {example.output}
                        </p>
                        {example.explanation ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {example.explanation}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Select
                        value={currentDraft.language}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {starterCodes.map((item) => (
                            <SelectItem key={item.language} value={item.language}>
                              {item.language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="gap-2">
                        <Save className="h-3.5 w-3.5" />
                        {saving ? "Saving" : "Autosave"}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => void handleRunCode()} disabled={running}>
                        {running ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        Run
                      </Button>
                      <Button
                        onClick={() => void handleSubmit()}
                        disabled={submitting || workspace.status !== "ongoing"}
                      >
                        {submitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trophy className="mr-2 h-4 w-4" />
                        )}
                        Submit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[460px] overflow-hidden rounded-xl border border-border/50">
                    <CodeEditor
                      code={currentDraft.code}
                      setCode={(nextCode) =>
                        setDraft(selectedProblem.mappingId, {
                          ...currentDraft,
                          code: nextCode,
                        })
                      }
                      language={currentDraft.language}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Custom Input</p>
                      <Textarea
                        value={customInput}
                        onChange={(event) => setCustomInput(event.target.value)}
                        placeholder="Optional stdin for manual runs"
                        className="min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Output</p>
                      <Textarea
                        value={runOutput}
                        readOnly
                        className="min-h-32 font-mono text-xs"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-border/40">
                <CardHeader>
                  <h2 className="text-sm font-medium">Your Contest State</h2>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{workspace.participant.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rank</span>
                    <span className="font-medium">
                      {workspace.participant.currentRank
                        ? `#${workspace.participant.currentRank}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-medium">
                      {workspace.participant.currentScore ?? 0} pts
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started: {formatDate(workspace.startTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ends: {formatDate(workspace.endTime)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">Leaderboard</h2>
                    <Badge variant="outline">
                      {currentUserEntry?.rank ? `You #${currentUserEntry.rank}` : "Live"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspace.leaderboard.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Leaderboard will appear after the first submissions.
                    </p>
                  ) : (
                    workspace.leaderboard.map((entry) => (
                      <div
                        key={entry.userId}
                        className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {entry.user.fullname || entry.user.username || "Anonymous"}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
