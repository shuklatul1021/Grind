import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Moon,
  Sun,
  LogOut,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Columns,
  Rows,
  SquareChevronRight,
  History,
  ChevronLeft,
  UserIcon,
  Clock,
  Filter,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { BACKENDURL, WEBSOCKETURL } from "../utils/urls";
import CodeEditor from "./CodeEditor";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@repo/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector } from "react-redux";
import { updateSEO, seoConfigs } from "../utils/seo";

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
  const [copied, setCopied] = useState(false);
  const [layout, setLayout] = useState<"bottom" | "right">("right");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [codeHistory, setCodeHistory] = useState<CodeHistory[]>([]);
  const [userInput, setUserInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
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

  const executeInputRequireCode = () => {
    setIsRunning(true);
    storeUserCode(code, selectedLanguage);
    setOutput("");
    setWaitingForInput(true);
    const ws = new WebSocket(`${WEBSOCKETURL}`);
    setWsConnection(ws);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "run",
          code,
          language: selectedLanguage,
        })
      );
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "output") {
        setOutput((prev) => prev + data.content);
      }
      if (data.type === "exit") {
        setIsRunning(false);
        setWaitingForInput(false);
        ws.close();
        setWsConnection(null);
        storeUserCode(code, selectedLanguage);
        getUserCodeHistory();
      }
    };
    ws.onerror = () => {
      setOutput("WebSocket error. Could not execute code.");
      setIsRunning(false);
      setWaitingForInput(false);
      setWsConnection(null);
    };

    ws.onclose = () => {
      setIsRunning(false);
      setWaitingForInput(false);
      setWsConnection(null);
    };
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!waitingForInput) return;

    if (e.key === "Enter") {
      e.preventDefault();
      if (wsConnection && userInput.trim()) {
        wsConnection.send(
          JSON.stringify({
            type: "input",
            content: userInput + "\n",
          })
        );
        setOutput((prev) => prev + userInput + "\n");
        setUserInput("");
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setUserInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      e.preventDefault();
      setUserInput((prev) => prev + e.key);
    }
  };

  const CheckUserCode = () => {
    if (
      selectedLanguage === "go" ||
      selectedLanguage === "rust" ||
      detectsInput(code, selectedLanguage)
    ) {
      executeInputRequireCode();
    } else {
      executeCode(code, selectedLanguage, undefined);
      storeUserCode(code, selectedLanguage);
      getUserCodeHistory();
    }
  };

  const storeUserCode = async (
    code: string,
    language: string,
    title?: string
  ) => {
    const response = await fetch(`${BACKENDURL}/compiler/create-code-history`, {
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
    });
    if (response.ok) {
      console.log("Success Code History");
    } else {
      console.log("Error");
    }
  };

  const executeCode = async (
    codeToRun: string,
    lang: string,
    input?: string
  ) => {
    setIsRunning(true);
    setOutput("Running code...");
    try {
      const response = await fetch(`${BACKENDURL}/compiler/run`, {
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

      if (data.output != "") {
        setOutput(data.output);
      } else {
        setOutput(data.error);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Code execution failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE] || "");
    setOutput("");
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
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

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
    (lang) => lang.value === selectedLanguage
  );

  const getUserCodeHistory = async () => {
    try {
      const response = await fetch(`${BACKENDURL}/compiler/get-code-history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1800px] mx-auto">
          <div
            className="flex cursor-pointer items-center gap-2 ml-6"
            onClick={() => navigate("/")}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/problems"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link
              to="/contest"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link
              to="/compiler"
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600 hover:text-white"
            >
              Compiler
            </Link>
            <Link
              to="/grind-ai"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Grind AI
            </Link>
            {/* <Link
              to="/learning"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Learning
            </Link>
            <Link
              to="/room"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Rooms
            </Link> */}
            <Link
              to="/premium"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Premium
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={UserProfile.user.avatar || ""}
                      alt="@user"
                    />
                    <AvatarFallback>
                      {UserProfile?.user.fullname?.[0] || "G"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/you")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 flex flex-col h-[calc(100vh-4rem)] max-w-[1800px] mx-auto w-full">
        <div className="mb-6 flex-none">
          <h1 className="mb-1 text-2xl font-bold">Online Compiler</h1>
          <p className="text-sm text-muted-foreground">
            Using{" "}
            <span className="font-medium text-foreground">
              {LANGUAGES.find((l) => l.value === selectedLanguage)?.label ||
                "JavaScript"}
            </span>{" "}
            Compiler - Write, run, and test your code online
          </p>
        </div>

        <div className="flex-1 flex gap-4 min-h-0 relative">
          {/* Backdrop overlay when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div
            className={`${
              isSidebarOpen ? "w-80" : "w-0"
            } transition-all duration-300 ease-in-out border-r border-border/30 bg-background flex flex-col overflow-hidden fixed left-0 top-16 bottom-0 z-50 shadow-2xl`}
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
            className={`flex-1 flex gap-4 min-h-0 ${layout === "right" ? "flex-row" : "flex-col"}`}
          >
            <Card
              className={`border-border/40 flex flex-col shadow-lg overflow-hidden ${layout === "right" ? "w-[60%]" : "w-full flex-1"}`}
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
                          Running
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
                <div
                  className="flex-1 overflow-hidden"
                  style={{ minHeight: layout === "bottom" ? "600px" : "500px" }}
                >
                  <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={selectedLanguage}
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-border/40 flex flex-col shadow-lg overflow-hidden ${layout === "right" ? "w-[40%]" : "w-full"}`}
              style={{ minHeight: layout === "bottom" ? "300px" : "auto" }}
            >
              <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-base">Output</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 bg-[#1e1e1e] text-left">
                <div
                  className="h-full w-full p-4 overflow-auto font-mono text-base text-gray-300 focus:outline-none"
                  tabIndex={waitingForInput ? 0 : -1}
                  onKeyDown={handleTerminalKeyDown}
                  style={{ cursor: waitingForInput ? "text" : "default" }}
                >
                  {output ? (
                    <pre className="whitespace-pre-wrap">
                      {output}
                      {waitingForInput && (
                        <span className="inline-flex">
                          {userInput}
                          <span className="inline-block w-2 h-5 bg-gray-300 animate-pulse ml-0.5"></span>
                        </span>
                      )}
                    </pre>
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

        {/* Google AdSense Ad */}
        <div className="my-8 flex justify-center">
          <div>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-2699219088015803"
              data-ad-slot="9372820844"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>

        {/* Google AdSense Ad (official snippet) */}
        <div className="my-8 flex justify-center">
          <div>
            {/* AdSense script should be loaded ONCE per page, ideally in index.html <head> or <body> */}
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-2699219088015803"
              data-ad-slot="9372820844"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({});
            `,
          }}
        />
      </main>
    </div>
  );
}
