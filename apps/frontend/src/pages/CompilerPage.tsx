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
  Code2,
  ChevronLeft,
  UserIcon,
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
    if (detectsInput(code, selectedLanguage)) {
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
  };

  const formatTimeAgo = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date().getTime();
    const timestamp = dateObj.getTime();

    if (isNaN(timestamp)) return "Unknown";

    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
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
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
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

      <main className="container flex-1 px-4 py-6 flex flex-col h-[calc(100vh-4rem)]">
        <div className="mb-6 flex-none">
          <h1 className="mb-1 text-2xl font-bold">Online Compiler</h1>
          <p className="text-sm text-muted-foreground">
            Write, run, and test your code in multiple programming languages
          </p>
        </div>

        <div className="flex-1 flex gap-4 min-h-0 relative">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-4 top-4 z-30 rounded-full h-8 w-8 bg-background border border-border/40 hover:bg-muted"
            >
              <History className="h-4 w-4" />
            </Button>
          )}

          <div
            className={`${
              isSidebarOpen ? "w-56" : "w-0"
            } transition-all duration-300 border-r border-border/40 bg-background flex flex-col overflow-hidden absolute left-0 top-0 bottom-0 z-20 shadow-lg`}
          >
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-5 w-5 text-blue-500" />
                <h2 className="font-semibold text-sm">Code History</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Your recent compilations
              </p>
            </div>

            <ScrollArea className="flex-1 p-2">
              <div className="space-y-2">
                {codeHistory.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Code2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground">
                      No history yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Run code to see history
                    </p>
                  </div>
                ) : (
                  codeHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="group p-0.5 rounded-lg cursor-pointer transition-all border border-border/30 hover:border-blue-500/60 bg-[#18181b] hover:bg-[#23232a] shadow-sm"
                      style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
                    >
                      <div className="flex items-center gap-2 px-2 py-2">
                        <div className="flex flex-col flex-1 min-w-0">
                          <pre className="text-xs font-mono text-blue-200 bg-[#161618] rounded px-2 py-1 mb-1 whitespace-pre-wrap">
                            {item.code
                              .split("\n")
                              .find(
                                (line) =>
                                  line.trim() &&
                                  !line.trim().startsWith("//") &&
                                  !line.trim().startsWith("#")
                              )
                              ?.trim()
                              .slice(0, 60) || item.code.slice(0, 60)}
                          </pre>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="px-1 py-0.5 text-[10px] font-medium border-blue-400/40 bg-[#22223a] text-blue-300"
                            >
                              {
                                LANGUAGES.find((l) => l.value === item.language)
                                  ?.label
                              }
                            </Badge>
                            <span className="text-gray-400">
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <History className="h-4 w-4 text-blue-400 opacity-70" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-2 top-2 rounded-full h-8 w-8 bg-muted hover:bg-muted/80 z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div
            className={`flex-1 flex gap-4 min-h-0 ${layout === "right" ? "flex-row" : "flex-col"}`}
          >
            <Card
              className={`border-border/40 flex flex-col shadow-sm ${layout === "right" ? "w-[65%]" : "w-full flex-1"}`}
            >
              <CardHeader className="py-3 px-4 border-b border-border/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base ml-[40px]">
                      Code Editor
                    </CardTitle>
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
                  className={`flex-1 overflow-x-auto ${layout === "bottom" ? "h-[450px]" : "h-[300px]"}`}
                  style={{ minWidth: 0 }}
                >
                  <div className="w-full h-full" style={{ minWidth: "100%" }}>
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      language={selectedLanguage}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-border/40 flex flex-col shadow-sm ${layout === "right" ? "w-[50%]" : "w-full h-[300px]"}`}
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
      </main>
    </div>
  );
}
