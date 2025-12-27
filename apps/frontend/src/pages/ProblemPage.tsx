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
        localStorage.getItem("grind_saved_codes") || "{}"
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
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [slug, code, selectedLanguage]);

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  const fetchProblem = async () => {
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
        }
      );
      if (response.ok) {
        const json = await response.json();
        setProblem(json.problem);
        const parsedStarterCodes = JSON.parse(json.problem.starterCode);
        setStarterCodes(parsedStarterCodes);
        const savedCodes = JSON.parse(localStorage.getItem("grind_saved_codes") || "{}");
        if (savedCodes[slug!]) {
          setCode(savedCodes[slug!].code);
          setSelectedLanguage(savedCodes[slug!].language);
        } else {
          const selectedCode = parsedStarterCodes.find(
            (sc: StarterCode) => sc.language === selectedLanguage
          );
          setCode(selectedCode ? selectedCode.code : "");
        }
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
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
  };

  const handleRunCode = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const response = await fetch(
        `${BACKENDURL}/submit/submitcode/${problem.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language: selectedLanguage }),
        }
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
    } catch (error) {
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
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Modern Header - Minimal & Clean */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Left: Navigation & Context */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/problems")}
            className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => navigate("/")}
            >
              <SquareChevronRight className="h-5 w-5 text-primary" />
              <span className="font-semibold tracking-tight text-foreground">
                Grind
              </span>
            </div>
            <div className="h-4 w-[1px] bg-border/50" />
            <span className="text-sm font-medium truncate max-w-[300px]">
              {problem.title}
            </span>
          </div>
        </div>

        {/* Center: Timer */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <WorkspaceTimer />
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-border/50" />

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRunCode}
              disabled={submitting}
              className="h-8 px-4 text-xs font-medium gap-2"
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
              className="h-8 px-4 text-xs font-medium gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm"
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
              className="bg-card/30"
            >
              <div className="flex h-full flex-col">
                <Tabs
                  defaultValue="description"
                  className="flex-1 flex flex-col"
                >
                  <div className="border-b border-border/50 px-4 bg-muted/10">
                    <TabsList className="h-10 w-full justify-start gap-6 rounded-none bg-transparent p-0">
                      <TabsTrigger
                        value="description"
                        className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                      >
                        Description
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
                    className="flex-1 overflow-y-auto p-6 outline-none mt-0"
                  >
                    <div className="space-y-6 max-w-3xl mx-auto">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h1 className="text-2xl font-bold tracking-tight">
                            {problem.title}
                          </h1>
                          <Badge
                            variant="outline"
                            className={`${getDifficultyColor(
                              problem.difficulty
                            )} capitalize px-2.5 py-0.5 text-xs font-semibold border`}
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-muted/50 text-muted-foreground hover:bg-muted text-[10px] px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                        <div className="whitespace-pre-wrap">
                          {problem.description}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          Examples
                        </h3>
                        <div className="grid gap-4">
                          {(problem.examples as Example[]).map(
                            (example, index) => (
                              <div
                                key={index}
                                className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3"
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
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="submissions" className="flex-1 p-6 mt-0">
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
          className="bg-background/50 backdrop-blur-sm"
        >
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={65}
              minSize={30}
              className="flex flex-col border-l border-border/50"
            >
              <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-background px-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/50">
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
                          <span className="capitalize">{lang.language}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setCode(
                        starterCodes.find(
                          (sc) => sc.language === selectedLanguage
                        )?.code || ""
                      )
                    }
                    title="Reset Code"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 text-muted-foreground hover:text-foreground ${isFullscreen ? "bg-primary/20 text-primary" : ""}`}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative bg-background overflow-auto">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={selectedLanguage}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="h-[1px] bg-border/50 hover:bg-primary/50 transition-colors"
            />
            {/* Test Cases / Console */}
            <ResizablePanel
              defaultSize={35}
              minSize={20}
              className="bg-card/30 border-l border-border/50"
            >
              <div className="flex h-full flex-col">
                {/* Test Case Header */}
                <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-muted/10 px-4">
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
                      <div className="flex items-center gap-1 p-2 border-b border-border/50 bg-background/50">
                        {problem.testcase.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveTest(i)}
                            className={`
                                px-3 py-1.5 rounded-md text-xs font-medium transition-all
                                ${
                                  i === activeTest
                                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                            <div className="rounded-md border border-border/50 bg-muted/30 p-3 font-mono text-sm text-foreground/90 min-h-[40px]">
                              {problem.testcase[activeTest]?.input ?? "-"}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Expected Output
                          </label>
                          <div className="rounded-md border border-border/50 bg-muted/30 p-3 font-mono text-sm text-foreground/90 min-h-[40px]">
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
  );
}
