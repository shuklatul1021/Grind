// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Badge } from "@repo/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
// import {
//   Moon, Sun, Play, CheckCircle2, XCircle, ArrowLeft, Loader2,
//   SquareChevronRight, Code2, Terminal, Maximize2, RotateCcw,
//   Timer as TimerIcon, Settings, CloudUpload, Pause,
//   Play as PlayIcon, MessageSquare, BrainCircuit, Lightbulb, Save
// } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@repo/ui/resizable";
// import CodeEditor from "./CodeEditor";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/select";

// // --- Types ---
// type WorkspaceMode = "DSA" | "BEHAVIORAL";

// export default function InterviewWorkspace() {
//   const { slug } = useParams<{ slug: string }>();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();

//   const [mode, setMode] = useState<WorkspaceMode>("DSA");
//   const [problem, setProblem] = useState<any>(null);
//   const [code, setCode] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("python");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
  
//   // Behavioral State
//   const [starNotes, setStarNotes] = useState({ situation: "", task: "", action: "", result: "" });

//   // 1. HEADER LOGIC (Common)
//   const renderHeader = () => (
//     <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur z-50">
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 rounded-full">
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2" onClick={() => navigate("/")}>
//             <SquareChevronRight className="h-5 w-5 text-primary" />
//             <span className="font-bold tracking-tight">InterviewPro</span>
//           </div>
//           <div className="h-4 w-[1px] bg-border/50" />
//           <nav className="flex bg-muted/30 p-1 rounded-lg border border-border/50">
//             <button 
//               onClick={() => setMode("DSA")}
//               className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === "DSA" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
//             >
//               DSA / Coding
//             </button>
//             <button 
//               onClick={() => setMode("BEHAVIORAL")}
//               className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === "BEHAVIORAL" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
//             >
//               Behavioral
//             </button>
//           </nav>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground">
//           {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//         </Button>
//         {mode === "DSA" ? (
//           <div className="flex items-center gap-2">
//             <Button variant="secondary" size="sm" onClick={() => {}} className="h-8 text-xs">Run</Button>
//             <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white">Submit</Button>
//           </div>
//         ) : (
//           <Button size="sm" className="h-8 text-xs gap-2"><Save className="h-3.5 w-3.5" /> Save Response</Button>
//         )}
//       </div>
//     </header>
//   );

//   // 2. DSA WORKSPACE (Your existing logic improved)
//   const renderDSAWorkspace = () => (
//     <ResizablePanelGroup direction="horizontal" className="flex-1">
//       <ResizablePanel defaultSize={35} minSize={25} className="bg-card/30">
//         <Tabs defaultValue="description" className="h-full flex flex-col">
//           <TabsList className="h-10 justify-start rounded-none border-b bg-muted/10 px-4">
//             <TabsTrigger value="description" className="text-xs">Description</TabsTrigger>
//             <TabsTrigger value="editorial" className="text-xs">Solution Guide</TabsTrigger>
//           </TabsList>
//           <TabsContent value="description" className="flex-1 overflow-y-auto p-6">
//             <h1 className="text-2xl font-bold mb-4">Trapping Rain Water</h1>
//             <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-none">Hard</Badge>
//             <p className="text-muted-foreground text-sm leading-relaxed">
//               Given n non-negative integers representing an elevation map where the width of each bar is 1, 
//               compute how much water it can trap after raining.
//             </p>
//             {/* Mock Examples */}
//             <div className="mt-6 bg-muted/30 p-4 rounded-lg font-mono text-xs">
//               <p className="text-primary font-bold">Example 1:</p>
//               <p>Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]</p>
//               <p>Output: 6</p>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </ResizablePanel>

//       <ResizableHandle withHandle />

//       <ResizablePanel defaultSize={65}>
//         <ResizablePanelGroup direction="vertical">
//           <ResizablePanel defaultSize={70} className="flex flex-col">
//             <div className="h-10 border-b flex items-center justify-between px-4 bg-background">
//               <span className="text-xs font-mono text-muted-foreground">solution.py</span>
//               <Select defaultValue="python">
//                 <SelectTrigger className="h-7 w-28 text-[10px]"><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="python">Python</SelectItem>
//                   <SelectItem value="cpp">C++</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex-1 relative">
//               <CodeEditor code={code} setCode={setCode} language={selectedLanguage} />
//             </div>
//           </ResizablePanel>
//           <ResizableHandle withHandle />
//           <ResizablePanel defaultSize={30} className="bg-black/10">
//             <Tabs defaultValue="testcase" className="h-full">
//               <TabsList className="h-9 bg-transparent px-4 gap-4">
//                 <TabsTrigger value="testcase" className="text-xs">Test Cases</TabsTrigger>
//                 <TabsTrigger value="result" className="text-xs">Result</TabsTrigger>
//               </TabsList>
//               <TabsContent value="testcase" className="p-4 font-mono text-xs">
//                 <div className="flex gap-2 mb-4">
//                   <Badge variant="outline">Case 1</Badge>
//                   <Badge variant="outline" className="opacity-50">Case 2</Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="opacity-50">Input:</p>
//                   <div className="bg-muted p-2 rounded">[0,1,0,2,1,0,1,3,2,1,2,1]</div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );

//   // 3. BEHAVIORAL WORKSPACE (STAR Method)
//   const renderBehavioralWorkspace = () => (
//     <div className="flex-1 flex justify-center bg-background overflow-y-auto p-8">
//       <div className="max-w-4xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <div className="space-y-4">
//           <Badge className="bg-blue-500/10 text-blue-500 border-none px-3 py-1">Behavioral Prep</Badge>
//           <h1 className="text-3xl font-bold tracking-tight">"Tell me about a time you handled a difficult stakeholder."</h1>
//           <p className="text-muted-foreground italic">Use the STAR method to structure your answer for maximum impact.</p>
//         </div>

//         <div className="grid gap-6">
//           {Object.entries({
//             Situation: "Set the scene and give the necessary details.",
//             Task: "Describe what your responsibility was in that situation.",
//             Action: "Explain exactly what steps you took to address it.",
//             Result: "Share what outcomes your actions achieved (use data!)."
//           }).map(([title, desc]) => (
//             <div key={title} className="group space-y-2 border border-border/50 p-6 rounded-2xl bg-card/30 hover:bg-card/50 transition-all">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-black uppercase tracking-widest text-primary">{title}</label>
//                 <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{desc}</span>
//               </div>
//               <textarea 
//                 className="w-full bg-transparent border-none focus:ring-0 text-sm leading-relaxed min-h-[100px] resize-none"
//                 placeholder={`Type your ${title.toLowerCase()} here...`}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
//           <Lightbulb className="h-6 w-6 text-amber-500 shrink-0" />
//           <div className="text-xs space-y-1">
//             <p className="font-bold text-amber-600 dark:text-amber-400">Interview Tip</p>
//             <p className="text-muted-foreground">Interviewers look for signals of <strong>ownership</strong> and <strong>bias for action</strong>. Ensure your "Action" section is the longest part of your response.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
//       {renderHeader()}
//       <main className="flex-1 flex overflow-hidden">
//         {mode === "DSA" ? renderDSAWorkspace() : renderBehavioralWorkspace()}
//       </main>
      
//       {/* Mini Status Bar */}
//       <footer className="h-7 border-t border-border/40 bg-muted/5 flex items-center justify-between px-4">
//         <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
//           <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> System: Ready</span>
//           <span>Cloud Sync: Active</span>
//         </div>
//         <div className="text-[10px] text-muted-foreground font-medium">
//           Interview Workspace v2.0
//         </div>
//       </footer>
//     </div>
//   );
// }