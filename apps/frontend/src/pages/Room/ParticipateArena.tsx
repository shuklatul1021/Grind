// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
// import { Badge } from "@repo/ui/badge";
// import { Separator } from "@repo/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
// import { ScrollArea } from "@repo/ui/scroll-area";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@repo/ui/alert-dialog";
// import {
//   Play,
//   Clock,
//   Users,
//   LogOut,
//   Terminal as TerminalIcon,
//   List,
//   CheckCircle2,
//   Circle,
//   Save,
//   Languages,
//   Info,
//   Maximize2,
//   AlertTriangle,
//   Send,
//   Shield,
// } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/select";
// import { useTheme } from "../../contexts/ThemeContext";
// import CodeEditor from "../CodeEditor";

// // Mock data
// const mockUserData = {
//   userId: "user-001",
//   username: "Alex Johnson",
//   roomId: "ABC123",
//   roomName: "Algorithm Practice Session",
// };

// const mockQuestions = [
//   {
//     id: "q1",
//     title: "Two Sum",
//     difficulty: "Easy",
//     status: "solved",
//     description:
//       "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
//   },
//   {
//     id: "q2",
//     title: "Reverse Linked List",
//     difficulty: "Medium",
//     status: "attempted",
//     description:
//       "Given the head of a singly linked list, reverse the list, and return the reversed list.",
//   },
//   {
//     id: "q3",
//     title: "Binary Tree Level Order",
//     difficulty: "Medium",
//     status: "unsolved",
//     description:
//       "Given the root of a binary tree, return the level order traversal of its nodes' values.",
//   },
// ];

// const mockCode = `function twoSum(nums, target) {
//   const map = new Map();
  
//   for (let i = 0; i < nums.length; i++) {
//     const complement = target - nums[i];
    
//     if (map.has(complement)) {
//       return [map.get(complement), i];
//     }
    
//     map.set(nums[i], i);
//   }
  
//   return [];
// }

// // Test cases
// console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
// console.log(twoSum([3, 2, 4], 6)); // [1, 2]
// console.log(twoSum([3, 3], 6)); // [0, 1]`;

// export default function ParticipateArena() {
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const { theme } = useTheme();
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [code, setCode] = useState(mockCode);
//   const [selectedLanguage, setSelectedLanguage] = useState("javascript");
//   const [selectedQuestion, setSelectedQuestion] = useState(mockQuestions[0]);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [activeTab, setActiveTab] = useState("output");

//   // Fullscreen state
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
//   const [showExitPrompt, setShowExitPrompt] = useState(false);
//   const [exitInput, setExitInput] = useState("");
//   const [fullscreenViolations, setFullscreenViolations] = useState(0);
//   const [showKickedDialog, setShowKickedDialog] = useState(false);
//   const [showJoinWarning, setShowJoinWarning] = useState(true);
//   const [hasJoined, setHasJoined] = useState(false);
//   const [isLegitimateExit, setIsLegitimateExit] = useState(false);

//   // Timer effect
//   useEffect(() => {
//     if (hasJoined) {
//       const timer = setInterval(() => {
//         setElapsedTime((prev) => prev + 1);
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [hasJoined]);

//   // Fullscreen monitoring
//   useEffect(() => {
//     if (!hasJoined) return;

//     const handleFullscreenChange = () => {
//       const isCurrentlyFullscreen = !!(
//         document.fullscreenElement ||
//         (document as any).webkitFullscreenElement ||
//         (document as any).mozFullScreenElement ||
//         (document as any).msFullscreenElement
//       );

//       setIsFullscreen(isCurrentlyFullscreen);

//       if (!isCurrentlyFullscreen && hasJoined && !isLegitimateExit) {
//         // User exited fullscreen without permission (via ESC, X button, etc.)
//         // Immediately try to re-enter fullscreen
//         const violations = fullscreenViolations + 1;
//         setFullscreenViolations(violations);

//         // Auto-kick after 3 violations
//         if (violations >= 3) {
//           handleKickUser();
//         } else {
//           // Force re-enter fullscreen and show warning
//           setShowFullscreenWarning(true);
//           setTimeout(() => {
//             enterFullscreen();
//           }, 100);
//         }
//       }
//     };

//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("mozfullscreenchange", handleFullscreenChange);
//     document.addEventListener("MSFullscreenChange", handleFullscreenChange);

//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener(
//         "webkitfullscreenchange",
//         handleFullscreenChange
//       );
//       document.removeEventListener(
//         "mozfullscreenchange",
//         handleFullscreenChange
//       );
//       document.removeEventListener(
//         "MSFullscreenChange",
//         handleFullscreenChange
//       );
//     };
//   }, [hasJoined, fullscreenViolations, isLegitimateExit]);

//   // Ctrl+E shortcut and ESC key prevention
//   useEffect(() => {
//     if (!hasJoined) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Ctrl+E to exit properly
//       if (e.ctrlKey && e.key === "e") {
//         e.preventDefault();
//         setShowExitPrompt(true);
//       }

//       // Prevent ESC key from exiting fullscreen
//       if (e.key === "Escape") {
//         e.preventDefault();
//         e.stopPropagation();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown, { capture: true });
//     return () =>
//       document.removeEventListener("keydown", handleKeyDown, { capture: true });
//   }, [hasJoined]);

//   const enterFullscreen = async () => {
//     try {
//       const elem = document.documentElement;

//       if (elem.requestFullscreen) {
//         await elem.requestFullscreen();
//       } else if ((elem as any).webkitRequestFullscreen) {
//         await (elem as any).webkitRequestFullscreen();
//       } else if ((elem as any).mozRequestFullScreen) {
//         await (elem as any).mozRequestFullScreen();
//       } else if ((elem as any).msRequestFullscreen) {
//         await (elem as any).msRequestFullscreen();
//       }

//       setIsFullscreen(true);
//       setHasJoined(true);
//       setShowJoinWarning(false);
//     } catch (error) {
//       console.error("Error entering fullscreen:", error);
//       alert(
//         "Fullscreen is required to join this room. Please allow fullscreen access."
//       );
//     }
//   };

//   const exitFullscreen = async () => {
//     try {
//       setIsLegitimateExit(true);

//       if (document.exitFullscreen) {
//         await document.exitFullscreen();
//       } else if ((document as any).webkitExitFullscreen) {
//         await (document as any).webkitExitFullscreen();
//       } else if ((document as any).mozCancelFullScreen) {
//         await (document as any).mozCancelFullScreen();
//       } else if ((document as any).msExitFullscreen) {
//         await (document as any).msExitFullscreen();
//       }

//       setIsFullscreen(false);
//       navigate("/room");
//     } catch (error) {
//       console.error("Error exiting fullscreen:", error);
//     }
//   };

//   const handleKickUser = () => {
//     setShowKickedDialog(true);
//     setTimeout(() => {
//       exitFullscreen();
//     }, 3000);
//   };

//   const handleReenterFullscreen = () => {
//     setShowFullscreenWarning(false);
//     enterFullscreen();
//   };

//   const handleExitConfirm = () => {
//     if (exitInput.toLowerCase() === "exit") {
//       exitFullscreen();
//     } else {
//       alert('Please type "exit" to confirm');
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleRunCode = () => {
//     setIsRunning(true);
//     setOutput("Running code...\n");

//     setTimeout(() => {
//       setOutput(
//         `[0, 1]\n[1, 2]\n[0, 1]\n\n✓ Execution completed successfully in 0.234s`
//       );
//       setIsRunning(false);
//     }, 1500);
//   };

//   const handleSubmit = () => {
//     // Mock submission - mark as legitimate exit then exit fullscreen
//     setIsLegitimateExit(true);
//     alert("Solution submitted successfully!");
//     setTimeout(() => {
//       exitFullscreen();
//     }, 500);
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty.toLowerCase()) {
//       case "easy":
//         return "bg-green-500/10 text-green-500 border-green-500/20";
//       case "medium":
//         return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
//       case "hard":
//         return "bg-red-500/10 text-red-500 border-red-500/20";
//       default:
//         return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     if (status === "solved") {
//       return <CheckCircle2 className="h-4 w-4 text-green-500" />;
//     }
//     if (status === "attempted") {
//       return <Circle className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />;
//     }
//     return <Circle className="h-4 w-4 text-muted-foreground" />;
//   };

//   // Show join warning before entering
//   if (!hasJoined) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-4">
//         <Card className="max-w-2xl w-full border-2 border-border/50 shadow-2xl">
//           <CardHeader className="text-center pb-4">
//             <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-20 h-20 flex items-center justify-center">
//               <Shield className="h-10 w-10 text-blue-500" />
//             </div>
//             <CardTitle className="text-2xl mb-2">Fullscreen Required</CardTitle>
//             <p className="text-muted-foreground">
//               To maintain exam integrity, you must stay in fullscreen mode
//             </p>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
//                 <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
//                 <div className="space-y-1">
//                   <p className="font-semibold text-sm">Important Rules:</p>
//                   <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
//                     <li>You must remain in fullscreen throughout the exam</li>
//                     <li>Exiting fullscreen will result in warnings</li>
//                     <li>
//                       After 3 violations, you will be automatically kicked
//                     </li>
//                     <li>Press Ctrl+E and type "exit" to leave properly</li>
//                     <li>Submitting your solution will also exit fullscreen</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="p-4 rounded-lg bg-muted/50 border border-border">
//                 <h3 className="font-semibold mb-2 text-sm">Room Details:</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Room Name:</span>
//                     <span className="font-medium">{mockUserData.roomName}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Room ID:</span>
//                     <code className="font-mono font-medium">
//                       {mockUserData.roomId}
//                     </code>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Questions:</span>
//                     <span className="font-medium">{mockQuestions.length}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <Button
//                 onClick={enterFullscreen}
//                 className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-base font-semibold"
//               >
//                 <Maximize2 className="h-5 w-5 mr-2" />
//                 Enter Fullscreen & Join Room
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/room")}
//                 className="w-full"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Cancel
//               </Button>
//             </div>

//             <p className="text-xs text-center text-muted-foreground">
//               By joining, you agree to follow all exam rules and guidelines
//             </p>
//           </CardContent>
//         </Card>

//         {/* Fullscreen Join Warning Dialog */}
//         <AlertDialog
//           open={showJoinWarning && !hasJoined}
//           onOpenChange={setShowJoinWarning}
//         >
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2">
//                 <AlertTriangle className="h-5 w-5 text-yellow-500" />
//                 Fullscreen Access Required
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 You cannot join this room without allowing fullscreen access.
//                 This is required to maintain exam integrity and prevent
//                 cheating.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel onClick={() => navigate("/room")}>
//                 Cancel
//               </AlertDialogCancel>
//               <AlertDialogAction onClick={enterFullscreen}>
//                 Allow Fullscreen
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={containerRef}
//       className="min-h-screen bg-background flex flex-col"
//     >
//       {/* Header */}
//       <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
//         <div className="px-6 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h1 className="text-lg font-bold">{mockUserData.username}</h1>
//                   {fullscreenViolations > 0 && (
//                     <Badge
//                       variant="outline"
//                       className="bg-red-500/10 text-red-500 border-red-500/20"
//                     >
//                       {fullscreenViolations} Violations
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {mockUserData.roomName}
//                 </p>
//               </div>
//               <Separator orientation="vertical" className="h-10" />
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-mono font-semibold">
//                     {formatTime(elapsedTime)}
//                   </span>
//                 </div>
//                 <Separator orientation="vertical" className="h-4" />
//                 <div className="flex items-center gap-2">
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">
//                     3 online
//                   </span>
//                 </div>
//                 <Separator orientation="vertical" className="h-4" />
//                 <div className="flex items-center gap-2">
//                   {isFullscreen ? (
//                     <>
//                       <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-xs text-green-500 font-semibold">
//                         Fullscreen Active
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
//                       <span className="text-xs text-red-500 font-semibold">
//                         Not Fullscreen
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Select
//                 value={selectedLanguage}
//                 onValueChange={setSelectedLanguage}
//               >
//                 <SelectTrigger className="w-[140px] h-9">
//                   <Languages className="h-3.5 w-3.5 mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="javascript">JavaScript</SelectItem>
//                   <SelectItem value="python">Python</SelectItem>
//                   <SelectItem value="java">Java</SelectItem>
//                   <SelectItem value="cpp">C++</SelectItem>
//                   <SelectItem value="c">C</SelectItem>
//                   <SelectItem value="typescript">TypeScript</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button variant="outline" size="sm">
//                 <Save className="h-4 w-4 mr-2" />
//                 Save
//               </Button>
//               <Button
//                 variant="default"
//                 size="sm"
//                 onClick={handleRunCode}
//                 disabled={isRunning}
//                 className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
//               >
//                 <Play className="h-4 w-4 mr-2" />
//                 {isRunning ? "Running..." : "Run"}
//               </Button>
//               <Button
//                 variant="default"
//                 size="sm"
//                 onClick={handleSubmit}
//                 className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
//               >
//                 <Send className="h-4 w-4 mr-2" />
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Questions Sidebar */}
//         <div className="w-64 border-r border-border/40 bg-background/50 flex flex-col">
//           <div className="p-4 border-b border-border/40">
//             <h2 className="font-semibold flex items-center gap-2">
//               <List className="h-4 w-4" />
//               Questions
//             </h2>
//           </div>
//           <ScrollArea className="flex-1">
//             <div className="p-2 space-y-2">
//               {mockQuestions.map((question) => (
//                 <Card
//                   key={question.id}
//                   className={`cursor-pointer transition-all hover:border-primary/40 ${
//                     selectedQuestion.id === question.id
//                       ? "border-primary bg-primary/5 shadow-md"
//                       : "border-border/40"
//                   }`}
//                   onClick={() => setSelectedQuestion(question)}
//                 >
//                   <CardContent className="p-3">
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <h3 className="text-sm font-semibold line-clamp-1">
//                         {question.title}
//                       </h3>
//                       {getStatusIcon(question.status)}
//                     </div>
//                     <Badge
//                       variant="outline"
//                       className={`text-xs ${getDifficultyColor(question.difficulty)}`}
//                     >
//                       {question.difficulty}
//                     </Badge>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Main Editor Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Problem Description */}
//           <div className="border-b border-border/40 bg-gradient-to-r from-background/95 to-background/50 backdrop-blur">
//             <div className="px-6 py-4">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-3">
//                     <h2 className="text-xl font-bold">
//                       {selectedQuestion.title}
//                     </h2>
//                     <Badge
//                       variant="outline"
//                       className={getDifficultyColor(
//                         selectedQuestion.difficulty
//                       )}
//                     >
//                       {selectedQuestion.difficulty}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     {selectedQuestion.description}
//                   </p>
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <Info className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Code Editor */}
//           <div className="flex-1 flex flex-col min-h-0">
//             <div className="flex-1 bg-background/50 border-b border-border/40 overflow-hidden">
//               <CodeEditor
//                 code={code}
//                 setCode={setCode}
//                 language={selectedLanguage}
//                 placeholder={`// Write your ${selectedLanguage} code here...\n// Press Ctrl+E and type "exit" to leave the exam\n// Click Submit when you're done`}
//               />
//             </div>

//             {/* Output Terminal */}
//             <div className="h-64 bg-background/50">
//               <Tabs
//                 value={activeTab}
//                 onValueChange={setActiveTab}
//                 className="h-full flex flex-col"
//               >
//                 <div className="border-b border-border/40 bg-background/50 px-4">
//                   <TabsList className="bg-transparent">
//                     <TabsTrigger value="output" className="gap-2">
//                       <TerminalIcon className="h-3.5 w-3.5" />
//                       Output
//                     </TabsTrigger>
//                     <TabsTrigger value="testcases" className="gap-2">
//                       <CheckCircle2 className="h-3.5 w-3.5" />
//                       Test Cases
//                     </TabsTrigger>
//                   </TabsList>
//                 </div>

//                 <TabsContent
//                   value="output"
//                   className="flex-1 m-0 p-4 overflow-auto"
//                 >
//                   <ScrollArea className="h-full">
//                     <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
//                       {output || "Run your code to see output here..."}
//                     </pre>
//                   </ScrollArea>
//                 </TabsContent>

//                 <TabsContent
//                   value="testcases"
//                   className="flex-1 m-0 p-4 overflow-auto"
//                 >
//                   <ScrollArea className="h-full">
//                     <div className="space-y-3">
//                       {[
//                         {
//                           input: "[2, 7, 11, 15], 9",
//                           expected: "[0, 1]",
//                           status: "passed",
//                         },
//                         {
//                           input: "[3, 2, 4], 6",
//                           expected: "[1, 2]",
//                           status: "passed",
//                         },
//                         {
//                           input: "[3, 3], 6",
//                           expected: "[0, 1]",
//                           status: "pending",
//                         },
//                       ].map((test, idx) => (
//                         <Card
//                           key={idx}
//                           className={`border-border/40 ${
//                             test.status === "passed"
//                               ? "border-green-500/20 bg-green-500/5"
//                               : test.status === "failed"
//                                 ? "border-red-500/20 bg-red-500/5"
//                                 : "border-border/40"
//                           }`}
//                         >
//                           <CardContent className="p-3">
//                             <div className="flex items-center justify-between mb-2">
//                               <span className="text-sm font-semibold">
//                                 Test Case {idx + 1}
//                               </span>
//                               {test.status === "passed" && (
//                                 <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
//                                   Passed
//                                 </Badge>
//                               )}
//                               {test.status === "pending" && (
//                                 <Badge
//                                   variant="outline"
//                                   className="border-yellow-500/20 text-yellow-500"
//                                 >
//                                   Pending
//                                 </Badge>
//                               )}
//                             </div>
//                             <div className="space-y-1 text-xs">
//                               <div>
//                                 <span className="text-muted-foreground">
//                                   Input:{" "}
//                                 </span>
//                                 <code className="text-foreground">
//                                   {test.input}
//                                 </code>
//                               </div>
//                               <div>
//                                 <span className="text-muted-foreground">
//                                   Expected:{" "}
//                                 </span>
//                                 <code className="text-foreground">
//                                   {test.expected}
//                                 </code>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   </ScrollArea>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Fullscreen Warning Dialog */}
//       <AlertDialog
//         open={showFullscreenWarning}
//         onOpenChange={setShowFullscreenWarning}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//               <AlertTriangle className="h-6 w-6" />
//               Fullscreen Violation Detected!
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 You have exited fullscreen mode. This is violation #
//                 {fullscreenViolations}.
//               </p>
//               <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
//                 <p className="text-sm font-semibold text-red-500">
//                   Warning: After 3 violations, you will be automatically kicked
//                   from the room.
//                 </p>
//               </div>
//               <p className="text-sm">
//                 You must return to fullscreen mode immediately to continue the
//                 exam.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction
//               onClick={handleReenterFullscreen}
//               className="bg-blue-500 hover:bg-blue-600"
//             >
//               <Maximize2 className="h-4 w-4 mr-2" />
//               Return to Fullscreen
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Exit Prompt Dialog (Ctrl+E) */}
//       <AlertDialog open={showExitPrompt} onOpenChange={setShowExitPrompt}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 Are you sure you want to exit the exam? Your progress will be
//                 saved.
//               </p>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">
//                   Type "exit" to confirm:
//                 </label>
//                 <input
//                   type="text"
//                   value={exitInput}
//                   onChange={(e) => setExitInput(e.target.value)}
//                   className="w-full px-3 py-2 border border-border rounded-md bg-background"
//                   placeholder="Type exit..."
//                   autoFocus
//                 />
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setExitInput("")}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleExitConfirm}
//               className="bg-red-500 hover:bg-red-600"
//             >
//               Confirm Exit
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Kicked Dialog */}
//       <AlertDialog open={showKickedDialog} onOpenChange={setShowKickedDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//               <AlertTriangle className="h-6 w-6" />
//               You Have Been Kicked
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 You have been removed from the room due to multiple fullscreen
//                 violations.
//               </p>
//               <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
//                 <p className="text-sm font-semibold text-red-500 mb-2">
//                   Reason: {fullscreenViolations} fullscreen violations
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   You can request to rejoin from the host.
//                 </p>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction
//               onClick={() => navigate("/room")}
//               className="bg-red-500 hover:bg-red-600"
//             >
//               Return to Lobby
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
