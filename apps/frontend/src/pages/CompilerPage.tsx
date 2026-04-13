import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { ScrollArea } from "@repo/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  SquareChevronRight,
  Columns,
  Rows,
  History,
  ChevronLeft,
  Clock,
  Filter,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { COMPILERPUBLISHERURL } from "../utils/urls";
import CodeEditor from "./CodeEditor";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";
import { updateSEO, seoConfigs } from "../utils/seo";
import MainSideNav from "../components/MainSideNav";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", version: "Node.js 18.x" },
  { value: "python", label: "Python", version: "3.11.x" },
  { value: "java", label: "Java", version: "JDK 17" },
  { value: "cpp", label: "C++", version: "GCC 11.x" },
  { value: "c", label: "C", version: "GCC 11.x" },
  { value: "typescript", label: "TypeScript", version: "5.x" },
  { value: "go", label: "Go", version: "1.21.x" },
  { value: "rust", label: "Rust", version: "1.75.x" },
];

const TIME_FILTERS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const DEFAULT_CODE = {
  javascript: `// JavaScript Code
console.log("Hello, World!");

function sum(a, b) {
  return a + b;
}

console.log(sum(5, 3));`,
  python: `# Python Code
print("Hello, World!")

def sum(a, b):
    return a + b

print(sum(5, 3))`,
  java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println(sum(5, 3));
    }
    
    public static int sum(int a, int b) {
        return a + b;
    }
}`,
  cpp: `// C++ Code
#include <iostream>
using namespace std;

int sum(int a, int b) {
    return a + b;
}

int main() {
    cout << "Hello, World!" << endl;
    cout << sum(5, 3) << endl;
    return 0;
}`,
  c: `// C Code
#include <stdio.h>

int sum(int a, int b) {
    return a + b;
}

int main() {
    printf("Hello, World!\\n");
    printf("%d\\n", sum(5, 3));
    return 0;
}`,
  typescript: `// TypeScript Code
console.log("Hello, World!");

function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(5, 3));`,
  go: `// Go Code
package main

import "fmt"

func sum(a int, b int) int {
    return a + b;
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Println(sum(5, 3))
}`,
  rust: `// Rust Code
fn sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    println!("Hello, World!");
    println!("{}", sum(5, 3));
}`,
};

interface CodeHistory {
  id: string;
  language: string;
  code: string;
  createdAt: Date;
  output?: string;
}

type CompilerExecutionState =
  | "idle"
  | "queued"
  | "running"
  | "completed"
  | "failed";

const EXECUTION_STATUS_LABELS: Record<CompilerExecutionState, string> = {
  idle: "Ready",
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

// function detectsInput(code: string, language: string): boolean {
//   const inputPatterns: Record<string, RegExp[]> = {
//     python: [/input\s*\(/],
//     javascript: [/readline\s*\(/, /prompt\s*\(/],
//     typescript: [/readline\s*\(/, /prompt\s*\(/],
//     java: [
//       /Scanner\s*\(/,
//       /BufferedReader/,
//       /\.nextLine\(/,
//       /\.nextInt\(/,
//       /\.next\(/,
//     ],
//     cpp: [/cin\s*>>/, /scanf\s*\(/, /getline\s*\(/],
//     c: [/scanf\s*\(/, /gets\s*\(/, /fgets\s*\(/],
//     go: [/fmt\.Scan/, /bufio\.NewReader/, /reader\.ReadString/],
//     rust: [/std::io::stdin/, /read_line/],
//   };

//   const patterns = inputPatterns[language] || [];
//   return patterns.some((pattern) => pattern.test(code));
// }

export default function CompilerPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] =
    useState<CompilerExecutionState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Queue a job to start execution.",
  );
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [queueDepth, setQueueDepth] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [layout, setLayout] = useState<"bottom" | "right">("right");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [codeHistory, setCodeHistory] = useState<CodeHistory[]>([]);
  const [userInput,] = useState("");
  const UserProfile = useSelector((state: RootState) => state.userDetails);
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterTime, setFilterTime] = useState("all");

  const filteredHistory = codeHistory.filter((item) => {
    const matchesLanguage =
      filterLanguage === "all" || item.language === filterLanguage;

    let matchesTime = true;
    if (filterTime !== "all") {
      const itemDate = new Date(item.createdAt);
      const now = new Date();

      if (filterTime === "today") {
        matchesTime = itemDate.toDateString() === now.toDateString();
      } else if (filterTime === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTime = itemDate >= oneWeekAgo;
      } else if (filterTime === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesTime = itemDate >= oneMonthAgo;
      }
    }

    return matchesLanguage && matchesTime;
  });

  // SEO Optimization
  useEffect(() => {
    updateSEO(seoConfigs.compiler);
  }, []);

  useEffect(() => {
    try {
      const adElement = document.querySelector(".adsbygoogle");
      if (adElement && !(window as any).adsbygoogle) {
        (window as any).adsbygoogle = [];
      }
      if (adElement) {
        (window as any).adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || "");
    setOutput("");
  };

  const storeUserCode = async (
    code: string,
    language: string,
    title?: string,
  ) => {
    try {
      const response = await fetch(
        `${COMPILERPUBLISHERURL}/compiler/create-code-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            code,
            language,
            title: title || "",
          }),
        },
      );

      if (!response.ok) {
        console.log("Error storing compiler history");
      }
    } catch (error) {
      console.log("Error storing compiler history", error);
    }
  };

  const queueCompilerJob = async (
    codeToRun: string,
    lang: string,
    input?: string,
  ) => {
    setIsRunning(true);
    setExecutionStatus("queued");
    setStatusMessage("Submitting code to the queue.");
    setOutput("Submitting code to the queue...");
    setQueueDepth(null);
    setActiveJobId(null);
    try {
      const response = await fetch(`${COMPILERPUBLISHERURL}/compiler/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          code: codeToRun,
          language: lang,
          input: input,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Code execution failed");
      }

      setExecutionStatus("queued");
      setStatusMessage(
        data.acknowledgement?.message || "Code pushed to queue.",
      );
      setOutput(
        [
          "Code pushed to queue.",
          `Job ID: ${data.jobId}`,
          data.queueDepth ? `Queue depth: ${data.queueDepth}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
      setQueueDepth(data.queueDepth ?? null);
      setActiveJobId(data.jobId ?? null);

      await storeUserCode(codeToRun, lang);
      await getUserCodeHistory();
      return;
    } catch (err) {
      setExecutionStatus("failed");
      setStatusMessage("Failed to queue the job.");
      setOutput(
        err instanceof Error
          ? err.message
          : "Code execution failed. Please try again.",
      );
      setQueueDepth(null);
      setActiveJobId(null);
      setIsRunning(false);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Code execution failed. Please try again.",
        variant: "destructive",
      });
      return;
    }
  };

  const CheckUserCode = () => {
    void queueCompilerJob(
      code,
      selectedLanguage,
      userInput.trim() ? userInput : undefined,
    );
  };

  useEffect(() => {
    if (!activeJobId) {
      return;
    }

    let cancelled = false;

    const pollJobStatus = async () => {
      try {
        const response = await fetch(
          `${COMPILERPUBLISHERURL}/compiler/jobs/${activeJobId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          },
        );

        const data = await response.json();

        if (cancelled || !response.ok || !data.success) {
          return;
        }

        setQueueDepth(data.queueDepth ?? null);

        if (data.status === "queued") {
          setExecutionStatus("queued");
          setStatusMessage(
            data.progress?.message || "Code is waiting in the queue.",
          );
          return;
        }

        if (data.status === "running") {
          setExecutionStatus("running");
          setStatusMessage(
            data.progress?.message || "Worker picked the job. Code is running.",
          );
          setOutput((currentOutput) => {
            if (
              currentOutput.includes("Code pushed to queue.") ||
              currentOutput.includes("Submitting code to the queue...")
            ) {
              return "Worker picked the job. Code is running...";
            }

            return currentOutput;
          });
          return;
        }

        if (data.status === "completed") {
          setExecutionStatus("completed");
          setStatusMessage(data.result?.message || "Execution completed.");
          setOutput(
            data.result?.output ||
              data.result?.message ||
              "Code execution completed.",
          );
          setIsRunning(false);
          setActiveJobId(null);
          await getUserCodeHistory();
          return;
        }

        if (data.status === "failed") {
          setExecutionStatus("failed");
          setStatusMessage(data.error || "Code execution failed.");
          setOutput(data.error || "Code execution failed.");
          setIsRunning(false);
          setActiveJobId(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Compiler job polling failed:", error);
        }
      }
    };

    void pollJobStatus();
    const intervalId = window.setInterval(() => {
      void pollJobStatus();
    }, 800);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeJobId]);

  const handleReset = () => {
    setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE] || "");
    setOutput("");
    setExecutionStatus("idle");
    setStatusMessage("Queue a job to start execution.");
    setQueueDepth(null);
    setActiveJobId(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      typescript: "ts",
      go: "go",
      rust: "rs",
    };
    const ext = extensions[selectedLanguage] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = () => {
    navigate("/");
  };

  const toggleLayout = () => {
    setLayout((prev) => (prev === "bottom" ? "right" : "bottom"));
  };

  const loadHistoryItem = (item: CodeHistory) => {
    setSelectedLanguage(item.language);
    setCode(item.code);
    if (item.output) {
      setOutput(item.output);
    }
    setIsSidebarOpen(false);
  };

  const formatTimeAgo = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return dateObj.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const currentLanguage = LANGUAGES.find(
    (lang) => lang.value === selectedLanguage,
  );
  // const expectsInput = detectsInput(code, selectedLanguage);
  const executionBadgeClass =
    executionStatus === "queued"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
      : executionStatus === "running"
        ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
        : executionStatus === "completed"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          : executionStatus === "failed"
            ? "border-red-500/30 bg-red-500/10 text-red-600"
            : "border-border/40 bg-muted/40 text-muted-foreground";
  const completedRuns = codeHistory.filter((item) =>
    Boolean(item.output),
  ).length;

  const getUserCodeHistory = async () => {
    try {
      const response = await fetch(
        `${COMPILERPUBLISHERURL}/compiler/get-code-history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCodeHistory(data.history);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch code history.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "An error occurred while fetching code history.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getUserCodeHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background sidebar-offset">
      <MainSideNav
        active="compiler"
        theme={theme}
        toggleTheme={toggleTheme}
        avatarUrl={UserProfile?.user?.avatar || ""}
        avatarFallback={UserProfile?.user?.fullname?.[0] || "G"}
        onProfile={() => navigate("/you")}
        onSignOut={handleSignOut}
      />

      <main className="h-[calc(100vh-3.5rem)] px-4 py-4 sm:px-6 sm:py-6 lg:h-screen lg:px-8">
        <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col gap-4">
          <section className="flex flex-none items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border/60 bg-background p-2">
                <SquareChevronRight className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Dashboard
                </p>
                <h1 className="text-base font-semibold sm:text-lg">
                  Compiler Workspace
                </h1>
              </div>
            </div>
            <Badge variant="outline" className={executionBadgeClass}>
              {EXECUTION_STATUS_LABELS[executionStatus]}
            </Badge>
          </section>

          <section className="grid flex-none gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Language
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {currentLanguage?.label || "JavaScript"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Queue
                </p>
                <p className="mt-2 text-xl font-semibold">{queueDepth ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  History
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {codeHistory.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Completed
                </p>
                <p className="mt-2 text-xl font-semibold">{completedRuns}</p>
              </CardContent>
            </Card>
          </section>

          <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-3 sm:p-4">
            {/* Backdrop overlay when sidebar is open */}
            {isSidebarOpen && (
              <div
                className="absolute inset-0 z-10 bg-background/70 backdrop-blur-sm transition-opacity lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <div
              className={`${
                isSidebarOpen ? "translate-x-0" : "-translate-x-[106%]"
              } absolute inset-y-0 left-0 z-20 flex w-80 flex-col overflow-hidden rounded-xl border border-border/40 bg-background shadow-xl transition-transform duration-300 ease-in-out`}
            >
              <div className="p-4 border-b border-border/30 bg-gradient-to-br from-blue-500/[0.08] via-cyan-500/[0.05] to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="flex items-center justify-between relative mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
                      <History className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base tracking-tight">
                        Code History
                      </h2>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        Recent compilations
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className="h-9 w-9 rounded-xl hover:bg-muted/80 transition-all hover:scale-105"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 relative">
                  <Select
                    value={filterLanguage}
                    onValueChange={setFilterLanguage}
                  >
                    <SelectTrigger className="h-8 text-[10px] bg-background/50 border-border/40 focus:ring-1 focus:ring-blue-500/20">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-[10px]">
                        All Languages
                      </SelectItem>
                      {LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang.value}
                          value={lang.value}
                          className="text-[10px]"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterTime} onValueChange={setFilterTime}>
                    <SelectTrigger className="h-8 text-[10px] bg-background/50 border-border/40 focus:ring-1 focus:ring-blue-500/20">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_FILTERS.map((time) => (
                        <SelectItem
                          key={time.value}
                          value={time.value}
                          className="text-[10px]"
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2.5">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center mx-auto mb-5 border border-border/30 shadow-sm">
                        <Filter className="h-10 w-10 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-semibold text-foreground/80 mb-1.5">
                        No history found
                      </p>
                      <p className="text-xs text-muted-foreground/70 font-medium">
                        Try adjusting your filters
                      </p>
                    </div>
                  ) : (
                    filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="group relative p-3 rounded-xl cursor-pointer w-[278px] transition-all duration-200 border border-border/40 hover:border-primary/30 bg-card/50 hover:bg-accent/50 shadow-sm hover:shadow-md active:scale-[0.99]"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 text-[10px] font-medium border-primary/20 bg-primary/5 text-primary"
                            >
                              {
                                LANGUAGES.find((l) => l.value === item.language)
                                  ?.label
                              }
                            </Badge>
                            <span
                              className="text-xs text-muted-foreground flex items-center gap-1 shrink-0"
                              title={new Date(item.createdAt).toLocaleString()}
                            >
                              <Clock className="h-3 w-3 opacity-70" />
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>

                          <div className="relative rounded-md bg-muted/50 border border-border/20 p-2 group-hover:bg-muted/70 transition-colors">
                            <pre className="text-[10px] font-mono leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden">
                              {item.code.trim()}
                            </pre>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/10 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <div
              className={`flex h-full flex-1 min-h-0 gap-4 transition-all duration-300 ${
                isSidebarOpen ? "lg:pl-[21rem]" : ""
              } ${layout === "right" ? "flex-row" : "flex-col"}`}
            >
              <Card
                className={`border-border/40 flex min-h-0 flex-col overflow-hidden shadow-lg ${layout === "right" ? "w-[60%]" : "w-full flex-1"}`}
              >
                <CardHeader className="py-3 px-4 border-b border-border/40">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">Code Editor</CardTitle>
                      {currentLanguage && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {currentLanguage.version}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="h-8 px-3 gap-2"
                      >
                        <History className="h-3.5 w-3.5" />
                        History
                      </Button>

                      <div className="h-4 w-px bg-border/60" />

                      <Select
                        value={selectedLanguage}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem
                              key={lang.value}
                              value={lang.value}
                              className="text-xs"
                            >
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="h-4 w-px bg-border/60 mx-1" />

                      <Button
                        onClick={CheckUserCode}
                        disabled={isRunning}
                        size="sm"
                        className="h-8 px-3"
                      >
                        {isRunning ? (
                          <>
                            <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            {executionStatus === "queued"
                              ? "Queued"
                              : "Running"}
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-3 w-3" />
                            Run
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLayout}
                        className="h-8 w-8"
                        title={
                          layout === "bottom"
                            ? "Switch to side-by-side view"
                            : "Switch to stacked view"
                        }
                      >
                        {layout === "bottom" ? (
                          <Columns className="h-4 w-4" />
                        ) : (
                          <Rows className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col relative h-full">
                  <div className="absolute top-2 right-4 z-10 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleReset}
                      className="h-7 w-7 opacity-50 hover:opacity-100 transition-opacity"
                      title="Reset Code"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleCopyCode}
                      className="h-7 w-7 opacity-50 hover:opacity-100 transition-opacity"
                      title="Copy Code"
                    >
                      {copied ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleDownload}
                      className="h-7 w-7 opacity-50 hover:opacity-100 transition-opacity"
                      title="Download Code"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      language={selectedLanguage}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`border-border/40 flex min-h-0 flex-col overflow-hidden shadow-lg ${layout === "right" ? "w-[40%]" : "w-full"}`}
                style={{ minHeight: layout === "bottom" ? "300px" : "auto" }}
              >
                <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">Output</CardTitle>
                    <Badge variant="outline" className={executionBadgeClass}>
                      {EXECUTION_STATUS_LABELS[executionStatus]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statusMessage}
                  </p>
                  {queueDepth !== null && (
                    <p className="text-xs text-muted-foreground">
                      Queue depth: {queueDepth}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 p-0 bg-[#1e1e1e] text-left">
                  <div className="h-full w-full p-4 overflow-auto font-mono text-base text-gray-300">
                    {output ? (
                      <pre className="whitespace-pre-wrap">{output}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground/40 italic">
                        Run your code to see output here
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
