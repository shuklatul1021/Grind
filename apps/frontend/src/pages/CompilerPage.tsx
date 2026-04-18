import { useEffect, useRef, useState } from "react";
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
  History,
  ChevronLeft,
  Clock,
  Filter,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import CodeEditor from "./CodeEditor";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";
import { updateSEO, seoConfigs } from "../utils/seo";
import MainSideNav from "../components/MainSideNav";
import { COMPILER_URL, COMPILER_WS_URL } from "../utils/urls";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

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

const TERMINAL_PROMPT = "$ ";

type WsExecutionMessage =
  | {
      type: "output";
      content?: string;
    }
  | {
      type: "error";
      message?: string;
    }
  | {
      type: "exit";
      code?: number;
    };

type ExecutionTransport = "queue" | "ws" | null;

type WindowWithAds = Window & {
  adsbygoogle?: Array<Record<string, unknown>>;
};

function detectsInput(code: string, language: string): boolean {
  const inputPatterns: Record<string, RegExp[]> = {
    python: [/input\s*\(/],
    javascript: [/readline\s*\(/, /prompt\s*\(/],
    typescript: [/readline\s*\(/, /prompt\s*\(/],
    java: [
      /Scanner\s*\(/,
      /BufferedReader/,
      /\.nextLine\(/,
      /\.nextInt\(/,
      /\.next\(/,
    ],
    cpp: [/cin\s*>>/, /scanf\s*\(/, /getline\s*\(/],
    c: [/scanf\s*\(/, /gets\s*\(/, /fgets\s*\(/],
    go: [/fmt\.Scan/, /bufio\.NewReader/, /reader\.ReadString/],
    rust: [/std::io::stdin/, /read_line/],
  };

  const patterns = inputPatterns[language] || [];
  return patterns.some((pattern) => pattern.test(code));
}

export default function CompilerPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] =
    useState<CompilerExecutionState>("idle");
  const [executionTransport, setExecutionTransport] =
    useState<ExecutionTransport>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [queueDepth, setQueueDepth] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [layout, ] = useState<"bottom" | "right">("right");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [codeHistory, setCodeHistory] = useState<CodeHistory[]>([]);
  const UserProfile = useSelector((state: RootState) => state.userDetails);
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const terminalInputBufferRef = useRef("");
  const terminalActiveLineRef = useRef("");
  const terminalInputEnabledRef = useRef(true);
  const compilerWsRef = useRef<WebSocket | null>(null);
  const wsRunActiveRef = useRef(false);
  const wsRunStartTimeRef = useRef<number | null>(null);
  const wsOutputBufferRef = useRef("");
  const executionStatusRef = useRef<CompilerExecutionState>("idle");
  const executionTransportRef = useRef<ExecutionTransport>(null);

  const resetTerminalInputBuffer = () => {
    terminalInputBufferRef.current = "";
    terminalActiveLineRef.current = "";
  };

  const consumeTerminalInput = () => {
    const stdinChunks = [
      terminalInputBufferRef.current,
      terminalActiveLineRef.current,
    ].filter((chunk) => chunk.length > 0);

    const stdinPayload = stdinChunks.join("\n");
    resetTerminalInputBuffer();
    return stdinPayload;
  };

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
      const adsWindow = window as WindowWithAds;

      if (adElement && !adsWindow.adsbygoogle) {
        adsWindow.adsbygoogle = [];
      }

      if (adElement && adsWindow.adsbygoogle) {
        adsWindow.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || "");
    setOutput("");
    resetTerminalInputBuffer();
  };

  const storeUserCode = async (
    code: string,
    language: string,
    title?: string,
  ) => {
    try {
      const response = await fetch(
        `${COMPILER_URL}/compiler/create-code-history`,
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
    setExecutionTransport("queue");
    setExecutionStatus("queued");
    setOutput(""); // keep terminal blank until real output arrives
    setExecutionTime(null);
    setQueueDepth(null);
    setActiveJobId(null);
    wsOutputBufferRef.current = "";
    try {
      const response = await fetch(`${COMPILER_URL}/compiler/run`, {
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
      setQueueDepth(data.queueDepth ?? null);
      setActiveJobId(data.jobId ?? null);

      await storeUserCode(codeToRun, lang);
      await getUserCodeHistory();
      return;
    } catch (err) {
      setExecutionStatus("failed");
      setOutput(
        err instanceof Error
          ? err.message
          : "Code execution failed. Please try again.",
      );
      setExecutionTransport(null);
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

  const setupCompilerSocket = (socket: WebSocket) => {
    socket.onmessage = (event) => {
      let parsedMessage: WsExecutionMessage | null = null;

      try {
        parsedMessage = JSON.parse(event.data as string) as WsExecutionMessage;
      } catch {
        return;
      }

      if (!parsedMessage) {
        return;
      }

      if (parsedMessage.type === "output") {
        const chunk = parsedMessage.content ?? "";
        if (!chunk) {
          return;
        }

        const sanitizedChunk = chunk
          .split("\n")
          .filter((line) => !line.startsWith("[interactive:"))
          .join("\n");

        if (!sanitizedChunk) {
          return;
        }

        wsOutputBufferRef.current += sanitizedChunk;
        terminalRef.current?.write(sanitizedChunk);
        return;
      }

      if (parsedMessage.type === "error") {
        const errMsg = parsedMessage.message || "Execution failed.";
        const formattedError = `${errMsg}${errMsg.endsWith("\n") ? "" : "\n"}`;
        wsOutputBufferRef.current += formattedError;
        terminalRef.current?.writeln(errMsg);
        return;
      }

      if (parsedMessage.type === "exit") {
        const exitCode = parsedMessage.code ?? 1;
        const finalOutput = wsOutputBufferRef.current || "(No output printed)";

        setOutput(finalOutput);
        setExecutionTransport(null);
        setExecutionStatus(exitCode === 0 ? "completed" : "failed");
        setIsRunning(false);
        wsRunActiveRef.current = false;

        if (wsRunStartTimeRef.current !== null) {
          const elapsed = Math.max(
            0,
            Math.round(performance.now() - wsRunStartTimeRef.current),
          );
          setExecutionTime(elapsed);
          wsRunStartTimeRef.current = null;
        }
        void getUserCodeHistory();
      }
    };

    socket.onclose = () => {
      compilerWsRef.current = null;

      if (!wsRunActiveRef.current) {
        return;
      }

      wsRunActiveRef.current = false;
      setExecutionTransport(null);
      setExecutionStatus("failed");
      setIsRunning(false);
      setOutput((prev) =>
        prev
          ? `${prev}${prev.endsWith("\n") ? "" : "\n"}WebSocket connection closed.`
          : "WebSocket connection closed.",
      );
      toast({
        title: "Execution interrupted",
        description:
          "WebSocket connection closed during interactive execution.",
        variant: "destructive",
      });
    };

    socket.onerror = () => {
      if (!wsRunActiveRef.current) {
        return;
      }

      setExecutionTransport(null);
      setExecutionStatus("failed");
      setIsRunning(false);
      wsRunActiveRef.current = false;
      toast({
        title: "Execution error",
        description: "WebSocket connection error during interactive execution.",
        variant: "destructive",
      });
    };
  };

  const connectCompilerSocket = async (): Promise<WebSocket> => {
    const existingSocket = compilerWsRef.current;

    if (existingSocket?.readyState === WebSocket.OPEN) {
      return existingSocket;
    }

    if (existingSocket?.readyState === WebSocket.CONNECTING) {
      return new Promise((resolve, reject) => {
        const handleOpen = () => {
          existingSocket.removeEventListener("open", handleOpen);
          existingSocket.removeEventListener("error", handleError);
          resolve(existingSocket);
        };

        const handleError = () => {
          existingSocket.removeEventListener("open", handleOpen);
          existingSocket.removeEventListener("error", handleError);
          reject(new Error("Could not connect to compiler websocket server."));
        };

        existingSocket.addEventListener("open", handleOpen);
        existingSocket.addEventListener("error", handleError);
      });
    }

    const socket = new WebSocket(COMPILER_WS_URL);
    compilerWsRef.current = socket;
    setupCompilerSocket(socket);

    return new Promise((resolve, reject) => {
      const handleOpen = () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("error", handleError);
        resolve(socket);
      };

      const handleError = () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("error", handleError);
        reject(new Error("Could not connect to compiler websocket server."));
      };

      socket.addEventListener("open", handleOpen);
      socket.addEventListener("error", handleError);
    });
  };

  const executeInteractiveCompilerJob = async (
    codeToRun: string,
    lang: string,
    input?: string,
  ) => {
    setIsRunning(true);
    setExecutionTransport("ws");
    setExecutionStatus("running");
    setOutput("");
    setExecutionTime(null);
    setQueueDepth(null);
    setActiveJobId(null);
    wsRunActiveRef.current = true;
    wsRunStartTimeRef.current = performance.now();
    wsOutputBufferRef.current = "";

    try {
      const socket = await connectCompilerSocket();

      socket.send(
        JSON.stringify({
          type: "run",
          code: codeToRun,
          language: lang,
        }),
      );

      if (input && input.trim().length > 0) {
        socket.send(
          JSON.stringify({
            type: "stdin",
            input: `${input}\n`,
          }),
        );
      }

      await storeUserCode(codeToRun, lang);
      await getUserCodeHistory();
    } catch (error) {
      wsRunActiveRef.current = false;
      setExecutionTransport(null);
      setExecutionStatus("failed");
      setIsRunning(false);
      setOutput(
        error instanceof Error
          ? error.message
          : "Interactive code execution failed. Please try again.",
      );
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Interactive code execution failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CheckUserCode = () => {
    const userInput = consumeTerminalInput();
    const requiresInteractiveExecution = detectsInput(code, selectedLanguage);

    if (requiresInteractiveExecution) {
      void executeInteractiveCompilerJob(
        code,
        selectedLanguage,
        userInput.length > 0 ? userInput : undefined,
      );
      return;
    }

    void queueCompilerJob(code, selectedLanguage);
  };

  useEffect(() => {
    if (!activeJobId) {
      return;
    }

    let cancelled = false;

    const pollJobStatus = async () => {
      try {
        const response = await fetch(
          `${COMPILER_URL}/compiler/jobs/${activeJobId}`,
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
          return;
        }

        if (data.status === "running") {
          setExecutionStatus("running");
          return;
        }

        if (data.status === "completed") {
          setExecutionTransport(null);
          setExecutionStatus("completed");
          const stdout = data.result?.output ?? "";
          const stderr = data.result?.error ?? "";
          let finalOutput = [stdout, stderr].filter(Boolean).join("\n");
          if (
            !finalOutput &&
            !stderr &&
            data.result?.message?.includes("placeholder execution flow")
          ) {
            finalOutput = "(No output printed)";
          } else if (!finalOutput) {
            finalOutput = "(No output printed)";
          }

          setOutput(finalOutput);

          if (data.result?.executionTime !== undefined) {
            setExecutionTime(data.result.executionTime);
          }

          setIsRunning(false);
          setActiveJobId(null);
          await getUserCodeHistory();
          return;
        }

        if (data.status === "failed") {
          setExecutionTransport(null);
          setExecutionStatus("failed");
          const errMsg =
            data.result?.error || data.error || "Code execution failed.";
          setOutput(errMsg);
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
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeJobId]);

  const handleReset = () => {
    setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE] || "");
    setOutput("");
    setExecutionTime(null);
    setExecutionTransport(null);
    setExecutionStatus("idle");
    setQueueDepth(null);
    setActiveJobId(null);
    resetTerminalInputBuffer();
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


  const toggleFocusMode = () => {
    setIsFocusMode((prev) => {
      const next = !prev;

      if (next) {
        setIsSidebarOpen(false);
      }

      return next;
    });
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
        `${COMPILER_URL}/compiler/get-code-history`,
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
    } catch {
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

  useEffect(() => {
    executionStatusRef.current = executionStatus;
  }, [executionStatus]);

  useEffect(() => {
    executionTransportRef.current = executionTransport;
  }, [executionTransport]);

  useEffect(() => {
    return () => {
      wsRunActiveRef.current = false;
      wsRunStartTimeRef.current = null;

      if (compilerWsRef.current) {
        compilerWsRef.current.close();
        compilerWsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const container = terminalContainerRef.current;
    if (!container) {
      return;
    }

    const terminal = new XTerm({
      convertEol: true,
      cursorBlink: true,
      disableStdin: false,
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
      fontSize: 15,
      lineHeight: 1.4,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        selectionBackground: "#264f78",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(container);

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    const fitTerminal = () => {
      fitAddon.fit();
    };

    fitTerminal();
    terminal.write(TERMINAL_PROMPT);
    terminal.focus();

    const dataDisposable = terminal.onData((rawData) => {
      if (!terminalInputEnabledRef.current) {
        return;
      }

      const normalizedData = rawData
        .replace(/\r\n/g, "\r")
        .replace(/\n/g, "\r");

      for (const char of normalizedData) {
        const canForwardToRunningWs =
          wsRunActiveRef.current &&
          executionTransportRef.current === "ws" &&
          executionStatusRef.current === "running" &&
          compilerWsRef.current?.readyState === WebSocket.OPEN;

        if (canForwardToRunningWs) {
          if (char === "\r") {
            compilerWsRef.current?.send(
              JSON.stringify({
                type: "stdin",
                input: "\n",
              }),
            );
            continue;
          }

          if (char === "\u007f") {
            compilerWsRef.current?.send(
              JSON.stringify({
                type: "stdin",
                input: "\u007f",
              }),
            );
            continue;
          }

          if (char === "\u0003") {
            compilerWsRef.current?.send(
              JSON.stringify({
                type: "stdin",
                input: "\u0003",
              }),
            );
            continue;
          }

          if (char >= " " || char === "\t") {
            compilerWsRef.current?.send(
              JSON.stringify({
                type: "stdin",
                input: char,
              }),
            );
          }
          continue;
        }

        if (char === "\r") {
          const committedLine = terminalActiveLineRef.current;
          terminalInputBufferRef.current = terminalInputBufferRef.current.length
            ? `${terminalInputBufferRef.current}\n${committedLine}`
            : committedLine;
          terminalActiveLineRef.current = "";
          terminal.write("\r\n");
          terminal.write(TERMINAL_PROMPT);
          continue;
        }

        if (char === "\u007f") {
          if (terminalActiveLineRef.current.length > 0) {
            terminalActiveLineRef.current = terminalActiveLineRef.current.slice(
              0,
              -1,
            );
            terminal.write("\b \b");
          }
          continue;
        }

        if (char === "\u0003") {
          terminalInputBufferRef.current = "";
          terminalActiveLineRef.current = "";
          terminal.write("^C\r\n");
          terminal.write(TERMINAL_PROMPT);
          continue;
        }

        if (char >= " " || char === "\t") {
          terminalActiveLineRef.current += char;
          terminal.write(char);
        }
      }
    });

    const handleResize = () => {
      fitTerminal();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      dataDisposable.dispose();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      fitAddonRef.current?.fit();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [layout, isSidebarOpen, isFocusMode]);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) {
      return;
    }

    const interactiveWsRunning =
      executionStatus === "running" && executionTransport === "ws";
    const allowInput =
      executionStatus !== "queued" &&
      (executionStatus !== "running" || interactiveWsRunning);
    terminalInputEnabledRef.current = allowInput;
    terminalActiveLineRef.current = "";

    terminal.write("\u001b[2J\u001b[3J\u001b[H");

    if (interactiveWsRunning) {
      terminal.write(TERMINAL_PROMPT);
      terminal.focus();
      return;
    }

    if (output) {
      const normalizedOutput = output.replace(/\r\n/g, "\n");
      const lines = normalizedOutput.split("\n");
      lines.forEach((line, index) => {
        if (index === lines.length - 1 && line === "") {
          return;
        }
        terminal.writeln(line);
      });
    } else if (executionStatus === "queued") {
      //pass
    } else if (executionStatus === "running") {
      terminal.writeln("Running...");
    }

    if (allowInput) {
      if (
        output ||
        executionStatus === "completed" ||
        executionStatus === "failed"
      ) {
        terminal.writeln("");
      }
      terminal.write(TERMINAL_PROMPT);
      terminal.focus();
    }
  }, [output, executionStatus, executionTransport, queueDepth]);

  return (
    <div
      className={`min-h-screen bg-background ${isFocusMode ? "" : "sidebar-offset"}`}
    >
      {!isFocusMode && (
        <MainSideNav
          active="compiler"
          theme={theme}
          toggleTheme={toggleTheme}
          avatarUrl={UserProfile?.user?.avatar || ""}
          avatarFallback={UserProfile?.user?.fullname?.[0] || "G"}
          onProfile={() => navigate("/you")}
          onSignOut={handleSignOut}
        />
      )}

      <main
        className={
          isFocusMode
            ? "h-screen px-2 py-2 sm:px-3 sm:py-3 lg:px-4"
            : "h-[calc(100vh-3.5rem)] px-4 py-4 sm:px-6 sm:py-6 lg:h-screen lg:px-8"
        }
      >
        <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col gap-4">
          {!isFocusMode && (
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
          )}

          {!isFocusMode && (
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
                  <p className="mt-2 text-xl font-semibold">
                    {queueDepth ?? 0}
                  </p>
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
          )}

          <div
            className={`relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card/60 ${isFocusMode ? "p-2 sm:p-2" : "p-3 sm:p-4"}`}
          >
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
              className={`flex h-full flex-1 min-h-0 min-w-0 gap-4 transition-all duration-300 ${
                isSidebarOpen ? "lg:pl-[21rem]" : ""
              } ${layout === "right" ? "flex-row" : "flex-col"}`}
            >
              <Card
                className={`border-border/40 flex min-h-0 min-w-0 flex-col overflow-hidden shadow-lg ${
                  layout === "right" ? "flex-[3_1_0%]" : "w-full flex-1"
                }`}
              >
                <CardHeader className="border-b border-border/40 px-4 py-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <CardTitle className="text-base">Code Editor</CardTitle>
                      {currentLanguage && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-xs font-normal"
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
                        className="h-8 shrink-0 gap-2 px-3"
                      >
                        <History className="h-3.5 w-3.5" />
                        History
                      </Button>

                      <Select
                        value={selectedLanguage}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="h-8 w-[140px] shrink-0 text-xs">
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

                      <Button
                        onClick={CheckUserCode}
                        disabled={isRunning}
                        size="sm"
                        className="h-8 shrink-0 px-3"
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
                className={`border-border/40 flex min-h-0 min-w-0 flex-col overflow-hidden shadow-lg ${
                  layout === "right" ? "flex-[2_1_0%]" : "w-full"
                }`}
                style={{ minHeight: layout === "bottom" ? "300px" : "auto" }}
              >
                <CardHeader className="border-b border-border/40 bg-muted/20 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="flex min-w-0 items-center gap-3 text-base">
                      Output
                      {executionTime !== null &&
                        executionStatus === "completed" && (
                          <span className="text-xs font-normal text-muted-foreground flex items-center gap-1.5 bg-background/50 px-2 py-0.5 rounded-md border border-border/40">
                            <Clock className="w-3.5 h-3.5" />
                            {executionTime < 1000
                              ? `${executionTime}ms`
                              : `${(executionTime / 1000).toFixed(2)}s`}
                          </span>
                        )}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant={isFocusMode ? "secondary" : "outline"}
                        size="sm"
                        onClick={toggleFocusMode}
                        className="h-8 px-3"
                      >
                        {isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
                      </Button>
                      <Badge variant="outline" className={executionBadgeClass}>
                        {EXECUTION_STATUS_LABELS[executionStatus]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 bg-[#1e1e1e] text-left">
                  <div
                    ref={terminalContainerRef}
                    className="h-full w-full"
                    onClick={() => terminalRef.current?.focus()}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
