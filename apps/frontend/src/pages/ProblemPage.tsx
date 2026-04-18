import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import {
  Moon,
  Sun,
  Play,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  SquareChevronRight,
  Code2,
  Terminal,
  Maximize2,
  RotateCcw,
  Timer as TimerIcon,
  Settings,
  CloudUpload,
  Pause,
  Play as PlayIcon,
  BookText,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/resizable";
import type { Example, Problem, StarterCode } from "../types/problem";
import { BACKENDURL } from "../utils/urls";
import CodeEditor from "./CodeEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

function WorkspaceTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 bg-muted/20 px-4 py-1.5 rounded-full border border-border/40 shadow-sm">
      <TimerIcon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-mono text-sm font-medium text-foreground/90 w-[4.5ch] text-center">
        {formatTime(seconds)}
      </span>
      <button
        onClick={() => setIsActive(!isActive)}
        className="ml-1 rounded-full p-0.5 hover:bg-muted/50 transition-colors"
      >
        {isActive ? (
          <Pause className="h-3 w-3 text-muted-foreground" />
        ) : (
          <PlayIcon className="h-3 w-3 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [starterCodes, setStarterCodes] = useState<StarterCode[]>([]);
  const [activeTest, setActiveTest] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: "accepted" | "wrong_answer" | "runtime_error" | "syntax_error";
    message: string;
    error?: string;
    expectedOutput?: string;
    yourOutput?: string;
  } | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const selectedCode = starterCodes.find((sc) => sc.language === language);
    setCode(selectedCode ? selectedCode.code : "");
  };

  useEffect(() => {
    if (slug && code) {
      const savedCodes = JSON.parse(
        localStorage.getItem("grind_saved_codes") || "{}",
      );
      savedCodes[slug] = {
        code,
        language: selectedLanguage,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("grind_saved_codes", JSON.stringify(savedCodes));
    }
  }, [code, slug, selectedLanguage]);

  const lastSyncedCode = useRef<string>("");

  const syncCodeToBackend = useCallback(async () => {
    if (!slug || !code || code === lastSyncedCode.current) return;

    try {
      await fetch(`${BACKENDURL}/user/savecode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          problemSlug: slug,
          code,
          language: selectedLanguage,
        }),
      });
      lastSyncedCode.current = code;
    } catch (error) {
      console.error("Failed to sync code to backend:", error);
    }
  }, [slug, code, selectedLanguage]);

  useEffect(() => {
    const interval = setInterval(() => {
      syncCodeToBackend();
    }, 90000);

    return () => clearInterval(interval);
  }, [syncCodeToBackend]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (slug && code && code !== lastSyncedCode.current) {
        navigator.sendBeacon(
          `${BACKENDURL}/user/savecode`,
          JSON.stringify({
            problemSlug: slug,
            code,
            language: selectedLanguage,
            token: localStorage.getItem("token") || "",
          }),
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [slug, code, selectedLanguage]);

  const fetchProblem = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKENDURL}/problems/getproblem/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
        },
      );
      if (response.ok) {
        const json = await response.json();
        setProblem(json.problem);
        const parsedStarterCodes = JSON.parse(json.problem.starterCode);
        setStarterCodes(parsedStarterCodes);
        const savedCodes = JSON.parse(
          localStorage.getItem("grind_saved_codes") || "{}",
        );
        const savedEntry = slug ? savedCodes[slug] : undefined;

        if (savedEntry) {
          setCode(savedEntry.code);
          setSelectedLanguage(savedEntry.language);
        } else {
          const defaultCode =
            parsedStarterCodes.find(
              (sc: StarterCode) => sc.language === "python",
            ) ?? parsedStarterCodes[0];

          setSelectedLanguage(defaultCode?.language ?? "python");
          setCode(defaultCode?.code ?? "");
        }
      } else {
        throw new Error("Failed to fetch");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch problem details",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={fetchProblem}>
            Retry
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => {
    void fetchProblem();
  }, [fetchProblem]);

  const handleRunCode = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const response = await fetch(
        `${BACKENDURL}/submit/submitcode/${problem.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({ code, language: selectedLanguage }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setTestResult({
          status: "accepted",
          message: "All test cases passed!",
        });
        toast({
          title: "Success",
          description: "Solution accepted!",
          variant: "soon",
        });
      } else {
        if (data.message?.includes("Syntax Error")) {
          setTestResult({
            status: "syntax_error",
            message: data.message,
            error: data.error,
          });
        } else {
          setTestResult({
            status: "wrong_answer",
            message: data.message || "Some test cases failed.",
            error: data.error,
            expectedOutput: data.expectedOutput,
            yourOutput: data.yourOutput,
          });
        }
      }
    } catch {
      setTestResult({ status: "runtime_error", message: "Runtime Error" });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading Problem...
          </p>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  const acceptanceDisplay =
    typeof problem.acceptanceRate === "number"
      ? `${problem.acceptanceRate.toFixed(1)}%`
      : "N/A";
  const constraintsText =
    problem.constraints?.trim() || "Constraints will be available soon.";
  const examples = problem.examples as Example[];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl dark:bg-sky-400/5" />
      </div>

      <div className="relative flex h-full flex-col">
        {/* Modern Header - Minimal & Clean */}
        <header className="flex h-16 shrink-0 items-center border-b border-border/50 bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-4 lg:px-6">
          {/* Left: Navigation & Context */}
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/problems")}
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div
                className="flex flex-none items-center gap-2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => navigate("/")}
              >
                <SquareChevronRight className="h-5 w-5 text-primary" />
                <span className="font-semibold tracking-tight text-foreground">
                  Grind
                </span>
              </div>
              <div className="h-4 w-[1px] bg-border/50" />
              <span className="max-w-[38vw] truncate text-sm font-semibold text-foreground/90 sm:max-w-[360px] lg:max-w-[520px]">
                {problem.title}
              </span>
            </div>
          </div>

          {/* Center: Timer */}
          <div className="hidden flex-none items-center justify-center px-4 xl:flex">
            <WorkspaceTimer />
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex flex-none items-center gap-2 sm:gap-3">
            <div className="hidden md:block xl:hidden">
              <WorkspaceTimer />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="hidden h-4 w-[1px] bg-border/50 sm:block" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                disabled={submitting}
                className="h-8 gap-2 px-3 text-xs font-semibold sm:px-4"
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                Run
              </Button>
              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={submitting}
                className="h-8 gap-2 bg-emerald-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 sm:px-4"
              >
                <CloudUpload className="h-3.5 w-3.5" />
                Submit
              </Button>
            </div>
          </div>
        </header>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {!isFullscreen && (
            <>
              <ResizablePanel
                defaultSize={30}
                minSize={30}
                maxSize={60}
                className="bg-card/30 backdrop-blur-[2px]"
              >
                <div className="flex h-full flex-col">
                  <Tabs
                    defaultValue="description"
                    className="flex-1 flex flex-col"
                  >
                    <div className="border-b border-border/50 bg-muted/10 px-4">
                      <TabsList className="h-10 w-full justify-start gap-6 rounded-none bg-transparent p-0">
                        <TabsTrigger
                          value="description"
                          className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                        >
                          Description
                        </TabsTrigger>
                        <TabsTrigger
                          value="info"
                          className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                        >
                          Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="submissions"
                          className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                        >
                          Submissions
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="description"
                      className="mt-0 flex-1 overflow-y-auto p-5 outline-none sm:p-6"
                    >
                      <div className="mx-auto max-w-4xl space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <h1 className="text-2xl font-bold tracking-tight">
                              {problem.title}
                            </h1>
                            <Badge
                              variant="outline"
                              className={`${getDifficultyColor(
                                problem.difficulty,
                              )} capitalize px-2.5 py-0.5 text-xs font-semibold border`}
                            >
                              {problem.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                          <div className="whitespace-pre-wrap">
                            {problem.description}
                          </div>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <BookText className="h-4 w-4 text-muted-foreground" />
                            Constraints
                          </h3>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                            {constraintsText}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            Examples
                          </h3>
                          <div className="grid gap-4">
                            {examples.map((example, index) => (
                              <div
                                key={index}
                                className="space-y-3 rounded-lg border border-border/50 bg-background/70 p-4 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Example {index + 1}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex gap-3 text-sm">
                                    <span className="font-mono font-semibold text-foreground min-w-[3rem]">
                                      Input:
                                    </span>
                                    <code className="font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                                      {example.input}
                                    </code>
                                  </div>
                                  <div className="flex gap-3 text-sm">
                                    <span className="font-mono font-semibold text-foreground min-w-[3rem]">
                                      Output:
                                    </span>
                                    <code className="font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                                      {example.output}
                                    </code>
                                  </div>
                                  {example.explanation && (
                                    <div className="flex gap-3 text-sm pt-1">
                                      <span className="font-mono font-semibold text-foreground min-w-[3rem]">
                                        Note:
                                      </span>
                                      <span className="text-muted-foreground">
                                        {example.explanation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="info"
                      className="mt-0 flex-1 overflow-y-auto p-5 outline-none sm:p-6"
                    >
                      <div className="mx-auto max-w-4xl space-y-4">
                        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <BookText className="h-4 w-4 text-muted-foreground" />
                            Problem Info
                          </h3>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-md border border-border/60 bg-background/70 p-3">
                              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                Acceptance
                              </p>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {acceptanceDisplay}
                              </p>
                            </div>
                            <div className="rounded-md border border-border/60 bg-background/70 p-3">
                              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                Test Cases
                              </p>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {problem.testcase.length}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {problem.tags.length > 0 ? (
                                problem.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-background/70 text-muted-foreground text-[10px] px-2 py-0.5"
                                  >
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  No tags
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="submissions"
                      className="flex-1 p-6 mt-0"
                    >
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Code2 className="h-10 w-10 mx-auto mb-3 opacity-20" />
                          <p>No submissions yet.</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="w-[1px] bg-border/50 hover:bg-primary/50 transition-colors"
              />
            </>
          )}
          <ResizablePanel
            defaultSize={isFullscreen ? 100 : 60}
            minSize={40}
            className="bg-gradient-to-b from-background/40 via-background/20 to-background/40 p-3 backdrop-blur-sm sm:p-4"
          >
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={65} minSize={30} className="min-h-0">
                <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.04]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.04] to-transparent" />

                  <div className="relative flex h-11 shrink-0 items-center justify-between border-b border-border/60 bg-muted/15 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs font-medium text-foreground/85">
                        <Code2 className="h-3.5 w-3.5" />
                        <span>Solution</span>
                      </div>
                      <div className="h-4 w-[1px] bg-border/50" />
                      <Select
                        value={selectedLanguage}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="h-7 w-[140px] border-none bg-transparent shadow-none hover:bg-muted/50 focus:ring-0 text-xs font-medium p-0 gap-1 text-muted-foreground hover:text-foreground transition-colors">
                          <span className="truncate">Language:</span>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {starterCodes.map((lang) => (
                            <SelectItem
                              key={lang.language}
                              value={lang.language}
                              className="text-xs"
                            >
                              <span className="capitalize">
                                {lang.language}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md border border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/40 hover:text-foreground"
                        onClick={() =>
                          setCode(
                            starterCodes.find(
                              (sc) => sc.language === selectedLanguage,
                            )?.code || "",
                          )
                        }
                        title="Reset Code"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-md border border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/40 hover:text-foreground ${isFullscreen ? "border-primary/40 bg-primary/20 text-primary" : ""}`}
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative flex-1 overflow-auto bg-background dark:bg-[#17181c]">
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      language={selectedLanguage}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="relative h-3 bg-transparent after:absolute after:left-1/2 after:top-1/2 after:h-1 after:w-14 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-border/60 after:transition-colors hover:after:bg-primary/60"
              />
              {/* Test Cases / Console */}
              <ResizablePanel defaultSize={35} minSize={20} className="min-h-0">
                <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.04]">
                  {/* Test Case Header */}
                  <div className="relative flex h-11 shrink-0 items-center justify-between border-b border-border/60 bg-muted/15 px-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Test Cases
                      </span>
                    </div>
                    {testResult && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTestResult(null)}
                        className="h-6 text-[10px] px-2 hover:bg-background"
                      >
                        Clear Result
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {!testResult ? (
                      <div className="flex h-full flex-col">
                        {/* Case Tabs */}
                        <div className="flex items-center gap-1 border-b border-border/60 bg-muted/15 p-2.5">
                          {problem.testcase.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveTest(i)}
                              className={`
                                px-3 py-1.5 rounded-md text-xs font-medium transition-all
                                ${
                                  i === activeTest
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                                }
                              `}
                            >
                              Case {i + 1}
                            </button>
                          ))}
                        </div>

                        {/* Case Content */}
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-muted-foreground">
                                Input
                              </label>
                            </div>
                            <div className="relative group">
                              <div className="min-h-[40px] rounded-lg border border-border/60 bg-background/60 p-3.5 font-mono text-sm text-foreground/90 shadow-inner">
                                {problem.testcase[activeTest]?.input ?? "-"}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Expected Output
                            </label>
                            <div className="min-h-[40px] rounded-lg border border-border/60 bg-background/60 p-3.5 font-mono text-sm text-foreground/90 shadow-inner">
                              {problem.testcase[activeTest]?.expectedOutput ??
                                "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col p-4 overflow-y-auto">
                        <div
                          className={`rounded-lg border p-4 mb-4 ${
                            testResult.status === "accepted"
                              ? "bg-green-500/5 border-green-500/20"
                              : "bg-red-500/5 border-red-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {testResult.status === "accepted" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                            <span
                              className={`font-semibold text-base ${
                                testResult.status === "accepted"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {testResult.status === "accepted"
                                ? "Accepted"
                                : testResult.status === "syntax_error"
                                  ? "Syntax Error"
                                  : "Wrong Answer"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground/90 mb-3">
                            {testResult.message}
                          </p>
                          {testResult.status === "syntax_error" &&
                            testResult.error && (
                              <div className="mt-3 space-y-2 text-left">
                                <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
                                  Error Details:
                                </div>
                                <div className="rounded-md bg-red-950/20 border border-red-500/30 p-3 text-left">
                                  <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap font-mono overflow-x-auto">
                                    {testResult.error}
                                  </pre>
                                </div>
                              </div>
                            )}
                          {testResult.status === "wrong_answer" && (
                            <div className="mt-3 space-y-3">
                              {testResult.expectedOutput && (
                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                                    Expected Output:
                                  </div>
                                  <div className="rounded-md bg-muted/50 border border-border/50 p-2.5">
                                    <pre className="text-xs font-mono text-foreground/90 whitespace-pre-wrap">
                                      {testResult.expectedOutput}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              {testResult.yourOutput !== undefined && (
                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                                    Your Output:
                                  </div>
                                  <div className="rounded-md bg-muted/50 border border-red-500/30 p-2.5">
                                    <pre className="text-xs font-mono text-foreground/90 whitespace-pre-wrap">
                                      {testResult.yourOutput}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end mt-auto pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTestResult(null)}
                            className="text-xs"
                          >
                            Back to Test Cases
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
