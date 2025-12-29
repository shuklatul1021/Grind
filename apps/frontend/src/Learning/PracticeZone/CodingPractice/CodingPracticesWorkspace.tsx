// import { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Badge } from "@repo/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
// import {
//   Moon,
//   Sun,
//   Play,
//   ArrowLeft,
//   Loader2,
//   SquareChevronRight,
//   Code2,
//   Terminal,
//   Maximize2,
//   RotateCcw,
//   Timer as TimerIcon,
//   Settings,
//   CloudUpload,
//   Pause,
//   Play as PlayIcon,
// } from "lucide-react";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@repo/ui/resizable";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
// import { useTheme } from "../../../contexts/ThemeContext";
// import type { Example, Problem, StarterCode } from "../../../types/problem";
// import { useToast } from "../../../../../../packages/ui/src/hooks/use-toast";
// import { BACKENDURL } from "../../../utils/urls";
// import CodeEditor from "../../../pages/CodeEditor";

// const DEFAULT_CODE = {
//   javascript: `// JavaScript Code
// console.log("Hello, World!");

// function sum(a, b) {
//   return a + b;
// }

// console.log(sum(5, 3));`,
//   python: `# Python Code
// print("Hello, World!")

// def sum(a, b):
//     return a + b

// print(sum(5, 3))`,
//   java: `// Java Code
// public class Main {
//     public static void main(String[] args) {
//         System.out.println("Hello, World!");
//         System.out.println(sum(5, 3));
//     }
    
//     public static int sum(int a, int b) {
//         return a + b;
//     }
// }`,
//   cpp: `// C++ Code
// #include <iostream>
// using namespace std;

// int sum(int a, int b) {
//     return a + b;
// }

// int main() {
//     cout << "Hello, World!" << endl;
//     cout << sum(5, 3) << endl;
//     return 0;
// }`,
//   c: `// C Code
// #include <stdio.h>

// int sum(int a, int b) {
//     return a + b;
// }

// int main() {
//     printf("Hello, World!\\n");
//     printf("%d\\n", sum(5, 3));
//     return 0;
// }`,
//   typescript: `// TypeScript Code
// console.log("Hello, World!");

// function sum(a: number, b: number): number {
//   return a + b;
// }

// console.log(sum(5, 3));`,
//   go: `// Go Code
// package main

// import "fmt"

// func sum(a int, b int) int {
//     return a + b;
// }

// func main() {
//     fmt.Println("Hello, World!")
//     fmt.Println(sum(5, 3))
// }`,
//   rust: `// Rust Code
// fn sum(a: i32, b: i32) -> i32 {
//     a + b
// }

// fn main() {
//     println!("Hello, World!");
//     println!("{}", sum(5, 3));
// }`,
// };


// export default function CodingPracticesEditorPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const { toast } = useToast();
//   const [problem, setProblem] = useState<Problem | null>(null);
//   const [starterCodes, setStarterCodes] = useState<StarterCode[]>([]);
//   const [activeTest, setActiveTest] = useState(0);
//   const [selectedLanguage, setSelectedLanguage] = useState("python");
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [testResult, setTestResult] = useState<{
//     status: "accepted" | "wrong_answer" | "runtime_error" | "syntax_error";
//     message: string;
//     error?: string;
//     expectedOutput?: string;
//     yourOutput?: string;
//   } | null>(null);

//   const output = true;

//   const handleLanguageChange = (language: string) => {
//     setSelectedLanguage(language);
//     const selectedCode = starterCodes.find((sc) => sc.language === language);
//     setCode(selectedCode ? selectedCode.code : "");
//   };

//   useEffect(() => {
//     if (slug && code) {
//       const savedCodes = JSON.parse(
//         localStorage.getItem("grind_saved_codes") || "{}"
//       );
//       savedCodes[slug] = {
//         code,
//         language: selectedLanguage,
//         updatedAt: new Date().toISOString(),
//       };
//       localStorage.setItem("grind_saved_codes", JSON.stringify(savedCodes));
//     }
//   }, [code, slug, selectedLanguage]);

//   const lastSyncedCode = useRef<string>("");

//   const syncCodeToBackend = useCallback(async () => {
//     if (!slug || !code || code === lastSyncedCode.current) return;

//     try {
//       await fetch(`${BACKENDURL}/user/savecode`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           token: localStorage.getItem("token") || "",
//         },
//         body: JSON.stringify({
//           problemSlug: slug,
//           code,
//           language: selectedLanguage,
//         }),
//       });
//       lastSyncedCode.current = code;
//     } catch (error) {
//       console.error("Failed to sync code to backend:", error);
//     }
//   }, [slug, code, selectedLanguage]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       syncCodeToBackend();
//     }, 90000);

//     return () => clearInterval(interval);
//   }, [syncCodeToBackend]);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (slug && code && code !== lastSyncedCode.current) {
//         navigator.sendBeacon(
//           `${BACKENDURL}/user/savecode`,
//           JSON.stringify({
//             problemSlug: slug,
//             code,
//             language: selectedLanguage,
//             token: localStorage.getItem("token") || "",
//           })
//         );
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [slug, code, selectedLanguage]);

//   useEffect(() => {
//     fetchProblem();
//   }, [slug]);

//   const fetchProblem = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${BACKENDURL}/problems/getproblem/two-sum`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             token: localStorage.getItem("token") || "",
//           },
//         }
//       );
//       if (response.ok) {
//         const json = await response.json();
//         setProblem(json.problem);
//         const parsedStarterCodes = JSON.parse(json.problem.starterCode);
//         setStarterCodes(parsedStarterCodes);
//         const savedCodes = JSON.parse(
//           localStorage.getItem("grind_saved_codes") || "{}"
//         );
//         if (savedCodes[slug!]) {
//           setCode(savedCodes[slug!].code);
//           setSelectedLanguage(savedCodes[slug!].language);
//         } else {
//           const selectedCode = parsedStarterCodes.find(
//             (sc: StarterCode) => sc.language === selectedLanguage
//           );
//           setCode(selectedCode ? selectedCode.code : "");
//         }
//       } else {
//         throw new Error("Failed to fetch");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch problem details",
//         variant: "destructive",
//         action: (
//           <Button variant="outline" size="sm" onClick={fetchProblem}>
//             Retry
//           </Button>
//         ),
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRunCode = async () => {
//     if (!problem) return;
//     setSubmitting(true);
//     try {
//       const response = await fetch(
//         `${BACKENDURL}/submit/submitcode/${problem.id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             token: localStorage.getItem("token") || "",
//           },
//           body: JSON.stringify({ code, language: selectedLanguage }),
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setTestResult({
//           status: "accepted",
//           message: "All test cases passed!",
//         });
//         toast({
//           title: "Success",
//           description: "Solution accepted!",
//           variant: "soon",
//         });
//       } else {
//         if (data.message?.includes("Syntax Error")) {
//           setTestResult({
//             status: "syntax_error",
//             message: data.message,
//             error: data.error,
//           });
//         } else {
//           setTestResult({
//             status: "wrong_answer",
//             message: data.message || "Some test cases failed.",
//             error: data.error,
//             expectedOutput: data.expectedOutput,
//             yourOutput: data.yourOutput,
//           });
//         }
//       }
//     } catch (error) {
//       setTestResult({ status: "runtime_error", message: "Runtime Error" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty.toLowerCase()) {
//       case "easy":
//         return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
//       case "medium":
//         return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
//       case "hard":
//         return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
//       default:
//         return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-background">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative flex h-12 w-12 items-center justify-center">
//             <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//           <p className="text-sm font-medium text-muted-foreground animate-pulse">
//             Loading Problem...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!problem) return null;

//   return (
//     <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
//       <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => navigate("/problems")}
//             className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div className="flex items-center gap-3">
//             <div
//               className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
//               onClick={() => navigate("/")}
//             >
//               <SquareChevronRight className="h-5 w-5 text-primary" />
//               <span className="font-semibold tracking-tight text-foreground">
//                 Grind
//               </span>
//             </div>
//             <div className="h-4 w-[1px] bg-border/50" />
//             <span className="text-sm font-medium truncate max-w-[300px]">
//               {problem.title}
//             </span>
//           </div>
//         </div>

//         {/* Right: Actions & Profile */}
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 mr-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-muted-foreground hover:text-foreground"
//             >
//               <Settings className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground"
//             >
//               {theme === "dark" ? (
//                 <Sun className="h-4 w-4" />
//               ) : (
//                 <Moon className="h-4 w-4" />
//               )}
//             </Button>
//           </div>

//           <div className="h-4 w-[1px] bg-border/50" />

//           <div className="flex items-center gap-2">
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={handleRunCode}
//               disabled={submitting}
//               className="h-8 px-4 text-xs font-medium gap-2"
//             >
//               {submitting ? (
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//               ) : (
//                 <Play className="h-3.5 w-3.5 fill-current" />
//               )}
//               Run
//             </Button>
//           </div>
//         </div>
//       </header>
//       <ResizablePanelGroup direction="horizontal" className="flex-1">
//         {!isFullscreen && (
//           <>
//             <ResizablePanel
//               defaultSize={30}
//               minSize={30}
//               maxSize={60}
//               className="bg-card/30"
//             >
//               <div className="flex h-full flex-col">
//                 <Tabs
//                   defaultValue="explanation"
//                   className="flex-1 flex flex-col"
//                 >
//                   <div className="border-b border-border/50 px-4 bg-muted/10">
//                     <TabsList className="h-10 w-full justify-start gap-6 rounded-none bg-transparent p-0">
//                       <TabsTrigger
//                         value="explanation"
//                         className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
//                       >
//                         Explanation
//                       </TabsTrigger>
//                       <TabsTrigger
//                         value="example"
//                         className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
//                       >
//                         Example
//                       </TabsTrigger>
//                       <TabsTrigger
//                         value="solution"
//                         className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
//                       >
//                         Solution
//                       </TabsTrigger>
//                     </TabsList>
//                   </div>

//                   <TabsContent
//                     value="explanation"
//                     className="flex-1 overflow-y-auto p-6 outline-none mt-0"
//                   >
//                     <div className="space-y-6 max-w-3xl mx-auto">
//                       <div className="space-y-4">
//                         <div className="flex items-start justify-between gap-4">
//                           <h1 className="text-2xl font-bold tracking-tight">
//                             {problem.title}
//                           </h1>
//                           <Badge
//                             variant="outline"
//                             className={`${getDifficultyColor(problem.difficulty)} capitalize px-2.5 py-0.5 text-xs font-semibold border`}
//                           >
//                             {problem.difficulty}
//                           </Badge>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {problem.tags.map((tag) => (
//                             <Badge
//                               key={tag}
//                               variant="secondary"
//                               className="bg-muted/50 text-muted-foreground hover:bg-muted text-[10px] px-2 py-0.5"
//                             >
//                               {tag}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
//                         <div className="whitespace-pre-wrap">
//                           {problem.description}
//                         </div>
//                       </div>
//                     </div>
//                   </TabsContent>

//                   <TabsContent
//                     value="example"
//                     className="flex-1 overflow-y-auto p-6 outline-none mt-0"
//                   >
//                     <div className="space-y-4 max-w-3xl mx-auto">
//                       <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
//                         <Terminal className="h-4 w-4" />
//                         Examples
//                       </h3>
//                       <div className="grid gap-4">
//                         {(problem.examples as Example[]).map(
//                           (example, index) => (
//                             <div
//                               key={index}
//                               className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3"
//                             >
//                               <div className="flex items-center justify-between">
//                                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                                   Example {index + 1}
//                                 </span>
//                               </div>
//                               <div className="space-y-2">
//                                 <div className="flex gap-3 text-sm">
//                                   <span className="font-mono font-semibold text-foreground min-w-[3rem]">
//                                     Input:
//                                   </span>
//                                   <code className="font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
//                                     {example.input}
//                                   </code>
//                                 </div>
//                                 <div className="flex gap-3 text-sm">
//                                   <span className="font-mono font-semibold text-foreground min-w-[3rem]">
//                                     Output:
//                                   </span>
//                                   <code className="font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
//                                     {example.output}
//                                   </code>
//                                 </div>
//                                 {example.explanation && (
//                                   <div className="flex gap-3 text-sm pt-1">
//                                     <span className="font-mono font-semibold text-foreground min-w-[3rem]">
//                                       Note:
//                                     </span>
//                                     <span className="text-muted-foreground">
//                                       {example.explanation}
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   </TabsContent>

//                   <TabsContent
//                     value="solution"
//                     className="flex-1 overflow-y-auto p-6 outline-none mt-0"
//                   >
//                     <div className="space-y-4 max-w-3xl mx-auto">
//                       <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
//                         <Code2 className="h-4 w-4" />
//                         Solution
//                       </h3>
//                       <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
//                         <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
//                           {problem.solution || "No solution provided."}
//                         </pre>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </div>
//             </ResizablePanel>

//             <ResizableHandle
//               withHandle
//               className="w-[1px] bg-border/50 hover:bg-primary/50 transition-colors"
//             />
//           </>
//         )}
//         <ResizablePanel
//           defaultSize={isFullscreen ? 100 : 60}
//           minSize={40}
//           className="bg-background/50 backdrop-blur-sm"
//         >
//           <ResizablePanelGroup direction="vertical">
//             <ResizablePanel
//               defaultSize={65}
//               minSize={30}
//               className="flex flex-col border-l border-border/50"
//             >
//               <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-background px-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/50">
//                     <Code2 className="h-3.5 w-3.5" />
//                     <span>Solution</span>
//                   </div>
//                   <div className="h-4 w-[1px] bg-border/50" />
//                   <Select
//                     value={selectedLanguage}
//                     onValueChange={handleLanguageChange}
//                   >
//                     <SelectTrigger className="h-7 w-[140px] border-none bg-transparent shadow-none hover:bg-muted/50 focus:ring-0 text-xs font-medium p-0 gap-1 text-muted-foreground hover:text-foreground transition-colors">
//                       <span className="truncate">Language:</span>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {starterCodes.map((lang) => (
//                         <SelectItem
//                           key={lang.language}
//                           value={lang.language}
//                           className="text-xs"
//                         >
//                           <span className="capitalize">{lang.language}</span>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7 text-muted-foreground hover:text-foreground"
//                     onClick={() =>
//                       setCode(
//                         starterCodes.find(
//                           (sc) => sc.language === selectedLanguage
//                         )?.code || ""
//                       )
//                     }
//                     title="Reset Code"
//                   >
//                     <RotateCcw className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={`h-7 w-7 text-muted-foreground hover:text-foreground ${isFullscreen ? "bg-primary/20 text-primary" : ""}`}
//                     onClick={() => setIsFullscreen(!isFullscreen)}
//                     title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//                   >
//                     <Maximize2 className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex-1 relative bg-background overflow-auto">
//                 <CodeEditor
//                   code={code}
//                   setCode={setCode}
//                   language={selectedLanguage}
//                 />
//               </div>
//             </ResizablePanel>

//             <ResizableHandle
//               withHandle
//               className="h-[1px] bg-border/50 hover:bg-primary/50 transition-colors"
//             />
//             {/* Test Cases / Console */}
//             <ResizablePanel
//               defaultSize={35}
//               minSize={20}
//               className="bg-card/30 border-l border-border/50"
//             >
//               <Card className={`border-border/40 flex flex-col shadow-sm`}>
//                 <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
//                   <CardTitle className="text-base">Output</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex-1 p-0 bg-[#1e1e1e] text-left">
//                   <div
//                     className="h-full w-full p-4 overflow-auto font-mono text-base text-gray-300 focus:outline-none"
//                     //   tabIndex={waitingForInput ? 0 : -1}
//                     //   onKeyDown={handleTerminalKeyDown}
//                     //   style={{ cursor: waitingForInput ? "text" : "default" }}
//                   >
//                     {output && (
//                       // <pre className="whitespace-pre-wrap">
//                       //   {output}
//                       //   {waitingForInput && (
//                       //     <span className="inline-flex">
//                       //       {userInput}
//                       //       <span className="inline-block w-2 h-5 bg-gray-300 animate-pulse ml-0.5"></span>
//                       //     </span>
//                       //   )}
//                       // </pre>
//                       //   ) : (
//                       <div className="h-full flex items-center justify-center text-muted-foreground/40 italic">
//                         Run your code to see output here
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   );
// }
