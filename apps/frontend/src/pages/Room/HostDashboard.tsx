// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
// import { Avatar, AvatarFallback } from "@repo/ui/avatar";
// import { Badge } from "@repo/ui/badge";
// import { ScrollArea } from "@repo/ui/scroll-area";
// import { Separator } from "@repo/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
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
//   Users,
//   Copy,
//   Check,
//   Clock,
//   LogOut,
//   Play,
//   Pause,
//   Lock,
//   Unlock,
//   UserX,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Wifi,
//   WifiOff,
//   Maximize,
//   Minimize,
//   Eye,
//   EyeOff,
//   Send,
//   BarChart3,
//   TrendingUp,
//   Shield,
//   Radio,
//   UserCheck,
//   UserPlus,
//   RefreshCw,
//   Ban,
// } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";

// // Mock data for the Host Dashboard
// const mockRoomData = {
//   roomId: "ABC123",
//   roomName: "Algorithm Practice Session",
//   hostId: "host-001",
//   hostName: "John Doe",
//   createdAt: new Date(Date.now() - 1800000).toISOString(),
//   maxParticipants: 10,
//   status: "live" as "waiting" | "live" | "ended",
//   questions: [
//     { id: "q1", title: "Two Sum", difficulty: "Easy" },
//     { id: "q2", title: "Reverse Linked List", difficulty: "Medium" },
//   ],
//   sessionDuration: 3600,
//   isLocked: false,
// };

// const mockParticipants = [
//   {
//     userId: "user-001",
//     username: "Alex Johnson",
//     avatar: "",
//     joinedAt: new Date(Date.now() - 1500000).toISOString(),
//     connectionStatus: "connected" as "connected" | "disconnected",
//     fullscreenStatus: "in" as "in" | "out",
//     tabFocusStatus: "active" as "active" | "switched",
//     currentState: "ACTIVE" as "ACTIVE" | "KICKED" | "PENDING" | "SUBMITTED",
//     violationCount: 0,
//     lastActivity: new Date(Date.now() - 120000).toISOString(),
//     submissionStatus: "submitted" as "not-submitted" | "submitted",
//     submissionTime: new Date(Date.now() - 60000).toISOString(),
//     lastHeartbeat: new Date(Date.now() - 5000).toISOString(),
//     networkLatency: 45,
//   },
//   {
//     userId: "user-002",
//     username: "Sarah Smith",
//     avatar: "",
//     joinedAt: new Date(Date.now() - 1200000).toISOString(),
//     connectionStatus: "connected" as "connected" | "disconnected",
//     fullscreenStatus: "out" as "in" | "out",
//     tabFocusStatus: "active" as "active" | "switched",
//     currentState: "ACTIVE" as "ACTIVE" | "KICKED" | "PENDING" | "SUBMITTED",
//     violationCount: 2,
//     lastActivity: new Date(Date.now() - 30000).toISOString(),
//     submissionStatus: "not-submitted" as "not-submitted" | "submitted",
//     submissionTime: null,
//     lastHeartbeat: new Date(Date.now() - 3000).toISOString(),
//     networkLatency: 120,
//   },
//   {
//     userId: "user-003",
//     username: "Mike Wilson",
//     avatar: "",
//     joinedAt: new Date(Date.now() - 900000).toISOString(),
//     connectionStatus: "disconnected" as "connected" | "disconnected",
//     fullscreenStatus: "out" as "in" | "out",
//     tabFocusStatus: "switched" as "active" | "switched",
//     currentState: "KICKED" as "ACTIVE" | "KICKED" | "PENDING" | "SUBMITTED",
//     violationCount: 5,
//     lastActivity: new Date(Date.now() - 300000).toISOString(),
//     submissionStatus: "not-submitted" as "not-submitted" | "submitted",
//     submissionTime: null,
//     lastHeartbeat: new Date(Date.now() - 180000).toISOString(),
//     networkLatency: 0,
//   },
//   {
//     userId: "user-004",
//     username: "Emily Davis",
//     avatar: "",
//     joinedAt: new Date(Date.now() - 600000).toISOString(),
//     connectionStatus: "connected" as "connected" | "disconnected",
//     fullscreenStatus: "in" as "in" | "out",
//     tabFocusStatus: "active" as "active" | "switched",
//     currentState: "ACTIVE" as "ACTIVE" | "KICKED" | "PENDING" | "SUBMITTED",
//     violationCount: 1,
//     lastActivity: new Date(Date.now() - 10000).toISOString(),
//     submissionStatus: "not-submitted" as "not-submitted" | "submitted",
//     submissionTime: null,
//     lastHeartbeat: new Date(Date.now() - 2000).toISOString(),
//     networkLatency: 65,
//   },
// ];

// const mockViolations = [
//   {
//     id: "v1",
//     userId: "user-002",
//     username: "Sarah Smith",
//     type: "fullscreen-exit" as "fullscreen-exit" | "tab-switch" | "disconnect",
//     timestamp: new Date(Date.now() - 300000).toISOString(),
//     action: "warning" as "warning" | "kick",
//   },
//   {
//     id: "v2",
//     userId: "user-003",
//     username: "Mike Wilson",
//     type: "tab-switch" as "fullscreen-exit" | "tab-switch" | "disconnect",
//     timestamp: new Date(Date.now() - 360000).toISOString(),
//     action: "warning" as "warning" | "kick",
//   },
//   {
//     id: "v3",
//     userId: "user-003",
//     username: "Mike Wilson",
//     type: "fullscreen-exit" as "fullscreen-exit" | "tab-switch" | "disconnect",
//     timestamp: new Date(Date.now() - 320000).toISOString(),
//     action: "kick" as "warning" | "kick",
//   },
//   {
//     id: "v4",
//     userId: "user-002",
//     username: "Sarah Smith",
//     type: "fullscreen-exit" as "fullscreen-exit" | "tab-switch" | "disconnect",
//     timestamp: new Date(Date.now() - 150000).toISOString(),
//     action: "warning" as "warning" | "kick",
//   },
// ];

// const mockRejoinRequests = [
//   {
//     id: "r1",
//     userId: "user-003",
//     username: "Mike Wilson",
//     kickReason: "Exited fullscreen multiple times (5 violations)",
//     kickTime: new Date(Date.now() - 300000).toISOString(),
//     requestTime: new Date(Date.now() - 120000).toISOString(),
//     status: "pending" as "pending" | "approved" | "rejected",
//   },
// ];

// const mockActivityTimeline = [
//   {
//     id: "t1",
//     userId: "user-001",
//     username: "Alex Johnson",
//     action: "Submitted solution",
//     type: "submission",
//     timestamp: new Date(Date.now() - 60000).toISOString(),
//   },
//   {
//     id: "t2",
//     userId: "user-002",
//     username: "Sarah Smith",
//     action: "Exited fullscreen (Warning #2)",
//     type: "violation",
//     timestamp: new Date(Date.now() - 150000).toISOString(),
//   },
//   {
//     id: "t3",
//     userId: "user-004",
//     username: "Emily Davis",
//     action: "Joined room",
//     type: "join",
//     timestamp: new Date(Date.now() - 600000).toISOString(),
//   },
//   {
//     id: "t4",
//     userId: "user-003",
//     username: "Mike Wilson",
//     action: "Kicked from room",
//     type: "kick",
//     timestamp: new Date(Date.now() - 300000).toISOString(),
//   },
//   {
//     id: "t5",
//     userId: "user-003",
//     username: "Mike Wilson",
//     action: "Requested to rejoin",
//     type: "rejoin-request",
//     timestamp: new Date(Date.now() - 120000).toISOString(),
//   },
// ];

// export default function HostDashboard() {
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const { theme } = useTheme();
//   const [copied, setCopied] = useState(false);
//   const [participants, setParticipants] = useState(mockParticipants);
//   const [violations, setViolations] = useState(mockViolations);
//   const [rejoinRequests, setRejoinRequests] = useState(mockRejoinRequests);
//   const [timeline, setTimeline] = useState(mockActivityTimeline);
//   const [elapsedTime, setElapsedTime] = useState(1800);
//   const [roomStatus, setRoomStatus] = useState<"waiting" | "live" | "ended">("live");
//   const [isLocked, setIsLocked] = useState(false);
//   const [showKickDialog, setShowKickDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState("users");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setElapsedTime((prev) => prev + 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const handleCopyRoomCode = () => {
//     navigator.clipboard.writeText(mockRoomData.roomId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const formatTime = (seconds: number) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getRelativeTime = (dateString: string) => {
//     const diff = Date.now() - new Date(dateString).getTime();
//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(minutes / 60);
//     if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
//     return `${minutes}m ago`;
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "ACTIVE": return "bg-green-500/10 text-green-500 border-green-500/20";
//       case "SUBMITTED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
//       case "KICKED": return "bg-red-500/10 text-red-500 border-red-500/20";
//       case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
//       default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty.toLowerCase()) {
//       case "easy": return "text-green-500";
//       case "medium": return "text-yellow-500";
//       case "hard": return "text-red-500";
//       default: return "text-gray-500";
//     }
//   };

//   const getRoomStatusColor = (status: string) => {
//     switch (status) {
//       case "live": return "bg-green-500/10 text-green-500 border-green-500/20";
//       case "waiting": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
//       case "ended": return "bg-red-500/10 text-red-500 border-red-500/20";
//       default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//     }
//   };

//   const getViolationTypeColor = (type: string) => {
//     switch (type) {
//       case "fullscreen-exit": return "bg-red-500/10 text-red-500 border-red-500/20";
//       case "tab-switch": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
//       case "disconnect": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//       default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//     }
//   };

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case "join": return <UserPlus className="h-4 w-4 text-blue-500" />;
//       case "violation": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
//       case "kick": return <UserX className="h-4 w-4 text-red-500" />;
//       case "rejoin-request": return <RefreshCw className="h-4 w-4 text-purple-500" />;
//       case "submission": return <CheckCircle className="h-4 w-4 text-green-500" />;
//       default: return <Radio className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const handleToggleLock = () => setIsLocked(!isLocked);
//   const handlePauseSession = () => setRoomStatus("waiting");
//   const handleResumeSession = () => setRoomStatus("live");
//   const handleEndSession = () => {
//     setRoomStatus("ended");
//     setTimeout(() => navigate("/room"), 2000);
//   };

//   const handleKickUser = (userId: string) => {
//     setSelectedUser(userId);
//     setShowKickDialog(true);
//   };

//   const confirmKickUser = () => {
//     if (selectedUser) {
//       setParticipants(participants.map(p => 
//         p.userId === selectedUser 
//           ? { ...p, currentState: "KICKED" as const, connectionStatus: "disconnected" as const }
//           : p
//       ));
//       setShowKickDialog(false);
//       setSelectedUser(null);
//     }
//   };

//   const handleApproveRejoin = (requestId: string) => {
//     const request = rejoinRequests.find(r => r.id === requestId);
//     if (request) {
//       setRejoinRequests(rejoinRequests.map(r => 
//         r.id === requestId ? { ...r, status: "approved" as const } : r
//       ));
//       setParticipants(participants.map(p => 
//         p.userId === request.userId 
//           ? { ...p, currentState: "ACTIVE" as const, connectionStatus: "connected" as const, violationCount: 0 }
//           : p
//       ));
//     }
//   };

//   const handleRejectRejoin = (requestId: string) => {
//     setRejoinRequests(rejoinRequests.map(r => 
//       r.id === requestId ? { ...r, status: "rejected" as const } : r
//     ));
//   };

//   const totalUsers = participants.length;
//   const activeUsers = participants.filter(p => p.currentState === "ACTIVE").length;
//   const submittedUsers = participants.filter(p => p.submissionStatus === "submitted").length;
//   const kickedUsers = participants.filter(p => p.currentState === "KICKED").length;
//   const pendingUsers = rejoinRequests.filter(r => r.status === "pending").length;
//   const remainingTime = Math.max(0, mockRoomData.sessionDuration - elapsedTime);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <Radio className="h-6 w-6 text-red-500" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold">Host Control Panel</h1>
//                   <p className="text-xs text-muted-foreground">Real-time monitoring & control</p>
//                 </div>
//               </div>
//               <Separator orientation="vertical" className="h-10" />
//               <Badge variant="outline" className={`${getRoomStatusColor(roomStatus)} px-3 py-1 font-semibold`}>
//                 {roomStatus.toUpperCase()}
//               </Badge>
//             </div>
//             <div className="flex items-center gap-2">
//               {roomStatus === "live" && (
//                 <Button variant="outline" size="sm" onClick={handlePauseSession}>
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause
//                 </Button>
//               )}
//               {roomStatus === "waiting" && (
//                 <Button variant="default" size="sm" onClick={handleResumeSession} className="bg-green-500 hover:bg-green-600">
//                   <Play className="h-4 w-4 mr-2" />
//                   Resume
//                 </Button>
//               )}
//               <Button variant={isLocked ? "destructive" : "outline"} size="sm" onClick={handleToggleLock}>
//                 {isLocked ? <><Lock className="h-4 w-4 mr-2" />Locked</> : <><Unlock className="h-4 w-4 mr-2" />Open</>}
//               </Button>
//               <Button variant="outline" size="sm">
//                 <Send className="h-4 w-4 mr-2" />
//                 Broadcast
//               </Button>
//               <Button variant="destructive" size="sm" onClick={handleEndSession}>
//                 <LogOut className="h-4 w-4 mr-2" />
//                 End Session
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-6 py-8 space-y-6">
//         {/* Room Information Card */}
//         <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//                   <Shield className="h-4 w-4" />
//                   Room Details
//                 </h3>
//                 <div className="space-y-2">
//                   <p className="font-bold text-xl">{mockRoomData.roomName}</p>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs text-muted-foreground">Room ID:</span>
//                     <code className="px-3 py-1 bg-background/80 border border-border/40 rounded-md text-sm font-mono font-semibold">
//                       {mockRoomData.roomId}
//                     </code>
//                     <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCopyRoomCode}>
//                       {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//                   <BarChart3 className="h-4 w-4" />
//                   Questions
//                 </h3>
//                 <div className="space-y-2">
//                   {mockRoomData.questions.map((q) => (
//                     <div key={q.id} className="flex items-center gap-2">
//                       <span className={`text-xs font-bold ${getDifficultyColor(q.difficulty)}`}>
//                         [{q.difficulty}]
//                       </span>
//                       <span className="text-sm font-medium">{q.title}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//                   <Clock className="h-4 w-4" />
//                   Session Time
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="h-4 w-4 text-blue-500" />
//                     <span className="text-sm font-medium">Elapsed:</span>
//                     <span className="text-sm font-mono font-bold">{formatTime(elapsedTime)}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-orange-500" />
//                     <span className="text-sm font-medium">Remaining:</span>
//                     <span className="text-sm font-mono font-bold">{formatTime(remainingTime)}</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Started {getRelativeTime(mockRoomData.createdAt)}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//                   <Users className="h-4 w-4" />
//                   Room Status
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     {isLocked ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
//                     <p className="text-sm font-medium">{isLocked ? "Entry Locked" : "Entry Open"}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Users className="h-4 w-4 text-blue-500" />
//                     <p className="text-sm">
//                       Capacity: <span className="font-bold text-base">{totalUsers}</span>
//                       <span className="text-muted-foreground">/{mockRoomData.maxParticipants}</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <Card className="border-border/40 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">{totalUsers}</p>
//                   <p className="text-xs font-semibold text-muted-foreground mt-1.5">Total Users</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
//                   <Users className="h-7 w-7 text-blue-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10 cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{activeUsers}</p>
//                   <p className="text-xs font-semibold text-muted-foreground mt-1.5">Active Now</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
//                   <Wifi className="h-7 w-7 text-green-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">{submittedUsers}</p>
//                   <p className="text-xs font-semibold text-muted-foreground mt-1.5">Submitted</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
//                   <CheckCircle className="h-7 w-7 text-indigo-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10 cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">{kickedUsers}</p>
//                   <p className="text-xs font-semibold text-muted-foreground mt-1.5">Kicked</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20">
//                   <UserX className="h-7 w-7 text-red-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40 hover:border-yellow-500/50 transition-all hover:shadow-lg hover:shadow-yellow-500/10 cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">{pendingUsers}</p>
//                   <p className="text-xs font-semibold text-muted-foreground mt-1.5">Requests</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
//                   <AlertTriangle className="h-7 w-7 text-yellow-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/30 p-1.5 rounded-xl">
//             <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg transition-all">
//               <Users className="h-4 w-4" />
//               <span className="font-semibold">Participants</span>
//               <Badge variant="secondary" className="ml-auto">{totalUsers}</Badge>
//             </TabsTrigger>
//             <TabsTrigger value="violations" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all">
//               <AlertTriangle className="h-4 w-4" />
//               <span className="font-semibold">Violations</span>
//               <Badge variant="secondary" className="ml-auto">{violations.length}</Badge>
//             </TabsTrigger>
//             <TabsTrigger value="rejoin" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all">
//               <RefreshCw className="h-4 w-4" />
//               <span className="font-semibold">Rejoin Requests</span>
//               <Badge variant="secondary" className="ml-auto">{pendingUsers}</Badge>
//             </TabsTrigger>
//             <TabsTrigger value="timeline" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg transition-all">
//               <Radio className="h-4 w-4" />
//               <span className="font-semibold">Activity Feed</span>
//             </TabsTrigger>
//           </TabsList>

//           {/* Participants Tab */}
//           <TabsContent value="users" className="space-y-0">
//             <Card className="border-border/40 shadow-xl">
//               <CardHeader className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-b border-border/40 pb-4">
//                 <CardTitle className="flex items-center gap-3">
//                   <div className="p-2.5 rounded-lg bg-blue-500/20">
//                     <Eye className="h-5 w-5 text-blue-500" />
//                   </div>
//                   <div className="flex-1">
//                     <span className="text-lg">Live Participant Monitoring</span>
//                     <p className="text-sm text-muted-foreground font-normal mt-0.5">Real-time fullscreen & activity tracking</p>
//                   </div>
//                   <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20">{participants.length} Monitored</Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <ScrollArea className="h-[700px] pr-4">
//                   <div className="space-y-4">
//                     {participants.map((participant) => (
//                       <Card key={participant.userId} className={`border-2 transition-all hover:shadow-md ${
//                         participant.currentState === "KICKED" ? "border-red-500/30 bg-red-500/5" :
//                         participant.fullscreenStatus === "out" ? "border-orange-500/30 bg-orange-500/5" :
//                         "border-border/40"
//                       }`}>
//                         <CardContent className="pt-5 pb-5">
//                           <div className="flex items-start justify-between gap-4">
//                             <div className="flex items-start gap-4 flex-1">
//                               <Avatar className="h-12 w-12 border-2 border-border">
//                                 <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
//                                   {participant.username.split(" ").map((n) => n[0]).join("")}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-2 mb-1.5">
//                                   <h3 className="font-bold text-base truncate">{participant.username}</h3>
//                                   <Badge variant="outline" className={`${getStatusColor(participant.currentState)} font-semibold`}>
//                                     {participant.currentState}
//                                   </Badge>
//                                 </div>
//                                 <p className="text-xs text-muted-foreground mb-3 font-mono">{participant.userId}</p>

//                                 {/* Status Grid */}
//                                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//                                   <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/40">
//                                     {participant.connectionStatus === "connected" ? 
//                                       <Wifi className="h-4 w-4 text-green-500 flex-shrink-0" /> : 
//                                       <WifiOff className="h-4 w-4 text-red-500 flex-shrink-0" />
//                                     }
//                                     <div className="min-w-0">
//                                       <p className="text-xs font-semibold truncate">
//                                         {participant.connectionStatus === "connected" ? "Connected" : "Disconnected"}
//                                       </p>
//                                       <p className="text-xs text-muted-foreground">{participant.networkLatency}ms</p>
//                                     </div>
//                                   </div>

//                                   <div className={`flex items-center gap-2 p-2 rounded-lg border ${
//                                     participant.fullscreenStatus === "in" ? 
//                                     "bg-green-500/10 border-green-500/20" : 
//                                     "bg-red-500/10 border-red-500/20"
//                                   }`}>
//                                     {participant.fullscreenStatus === "in" ? 
//                                       <Maximize className="h-4 w-4 text-green-500 flex-shrink-0" /> : 
//                                       <Minimize className="h-4 w-4 text-red-500 flex-shrink-0" />
//                                     }
//                                     <div className="min-w-0">
//                                       <p className="text-xs font-semibold truncate">
//                                         {participant.fullscreenStatus === "in" ? "Fullscreen" : "Windowed"}
//                                       </p>
//                                       <p className="text-xs text-muted-foreground">
//                                         {participant.fullscreenStatus === "in" ? "Active" : "Exited"}
//                                       </p>
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/40">
//                                     {participant.tabFocusStatus === "active" ? 
//                                       <Eye className="h-4 w-4 text-blue-500 flex-shrink-0" /> : 
//                                       <EyeOff className="h-4 w-4 text-orange-500 flex-shrink-0" />
//                                     }
//                                     <div className="min-w-0">
//                                       <p className="text-xs font-semibold truncate">
//                                         {participant.tabFocusStatus === "active" ? "Focused" : "Switched"}
//                                       </p>
//                                       <p className="text-xs text-muted-foreground">Tab Status</p>
//                                     </div>
//                                   </div>

//                                   <div className={`flex items-center gap-2 p-2 rounded-lg border ${
//                                     participant.violationCount > 3 ? "bg-red-500/10 border-red-500/20" :
//                                     participant.violationCount > 0 ? "bg-yellow-500/10 border-yellow-500/20" :
//                                     "bg-green-500/10 border-green-500/20"
//                                   }`}>
//                                     {participant.violationCount > 3 ? 
//                                       <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" /> :
//                                       participant.violationCount > 0 ? 
//                                       <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" /> :
//                                       <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                                     }
//                                     <div className="min-w-0">
//                                       <p className="text-xs font-semibold truncate">{participant.violationCount} Violations</p>
//                                       <p className="text-xs text-muted-foreground">Warnings</p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Additional Info */}
//                                 <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
//                                   <span>Joined {getRelativeTime(participant.joinedAt)}</span>
//                                   <Separator orientation="vertical" className="h-3" />
//                                   <span>Last activity: {getRelativeTime(participant.lastActivity)}</span>
//                                   {participant.submissionStatus === "submitted" && (
//                                     <>
//                                       <Separator orientation="vertical" className="h-3" />
//                                       <span className="text-green-500 font-semibold">✓ Submitted</span>
//                                     </>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Actions */}
//                             <div className="flex flex-col gap-2">
//                               {participant.currentState === "ACTIVE" && (
//                                 <Button variant="destructive" size="sm" onClick={() => handleKickUser(participant.userId)}>
//                                   <UserX className="h-4 w-4 mr-2" />
//                                   Kick
//                                 </Button>
//                               )}
//                               {participant.currentState === "KICKED" && (
//                                 <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Removed</Badge>
//                               )}
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Violations Tab */}
//           <TabsContent value="violations" className="space-y-0">
//             <Card className="border-border/40 shadow-xl">
//               <CardHeader className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border-b border-border/40">
//                 <CardTitle className="flex items-center gap-3">
//                   <div className="p-2.5 rounded-lg bg-orange-500/20">
//                     <AlertTriangle className="h-5 w-5 text-orange-500" />
//                   </div>
//                   <div className="flex-1">
//                     <span className="text-lg">Violation Log</span>
//                     <p className="text-sm text-muted-foreground font-normal mt-0.5">Fullscreen exits & suspicious activity</p>
//                   </div>
//                   <Badge variant="outline" className="bg-orange-500/10 border-orange-500/20">{violations.length} Total</Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <ScrollArea className="h-[600px] pr-4">
//                   <div className="space-y-3">
//                     {violations.map((violation) => (
//                       <Card key={violation.id} className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-500/5 to-transparent">
//                         <CardContent className="pt-4 pb-4">
//                           <div className="flex items-start justify-between">
//                             <div className="flex items-start gap-3 flex-1">
//                               <div className="p-2 rounded-lg bg-orange-500/20">
//                                 {violation.type === "fullscreen-exit" ? <Minimize className="h-5 w-5 text-orange-500" /> :
//                                  violation.type === "tab-switch" ? <EyeOff className="h-5 w-5 text-orange-500" /> :
//                                  <WifiOff className="h-5 w-5 text-gray-500" />
//                                 }
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <h3 className="font-semibold">{violation.username}</h3>
//                                   <Badge variant="outline" className={getViolationTypeColor(violation.type)}>
//                                     {violation.type.replace("-", " ").toUpperCase()}
//                                   </Badge>
//                                   {violation.action === "kick" && <Badge variant="destructive" className="ml-auto">KICKED</Badge>}
//                                 </div>
//                                 <p className="text-xs text-muted-foreground">User ID: {violation.userId}</p>
//                                 <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(violation.timestamp)}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Rejoin Requests Tab */}
//           <TabsContent value="rejoin" className="space-y-0">
//             <Card className="border-border/40 shadow-xl">
//               <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-b border-border/40">
//                 <CardTitle className="flex items-center gap-3">
//                   <div className="p-2.5 rounded-lg bg-purple-500/20">
//                     <RefreshCw className="h-5 w-5 text-purple-500" />
//                   </div>
//                   <div className="flex-1">
//                     <span className="text-lg">Rejoin Requests</span>
//                     <p className="text-sm text-muted-foreground font-normal mt-0.5">Approve or reject kicked users</p>
//                   </div>
//                   <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20">{pendingUsers} Pending</Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <ScrollArea className="h-[600px] pr-4">
//                   <div className="space-y-4">
//                     {rejoinRequests.length === 0 ? (
//                       <div className="flex flex-col items-center justify-center py-20 text-center">
//                         <UserCheck className="h-16 w-16 text-muted-foreground/30 mb-4" />
//                         <p className="text-lg font-semibold text-muted-foreground">No rejoin requests</p>
//                         <p className="text-sm text-muted-foreground mt-2">All participants are in good standing</p>
//                       </div>
//                     ) : (
//                       rejoinRequests.map((request) => (
//                         <Card key={request.id} className={`border-2 ${
//                           request.status === "pending" ? "border-purple-500/30 bg-purple-500/5" :
//                           request.status === "approved" ? "border-green-500/30 bg-green-500/5" :
//                           "border-red-500/30 bg-red-500/5"
//                         }`}>
//                           <CardContent className="pt-5 pb-5">
//                             <div className="flex items-start justify-between gap-4">
//                               <div className="flex items-start gap-4 flex-1">
//                                 <Avatar className="h-12 w-12 border-2 border-border">
//                                   <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
//                                     {request.username.split(" ").map((n) => n[0]).join("")}
//                                   </AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-2 mb-1.5">
//                                     <h3 className="font-bold text-base">{request.username}</h3>
//                                     <Badge variant="outline" className={
//                                       request.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
//                                       request.status === "approved" ? "bg-green-500/10 text-green-500 border-green-500/20" :
//                                       "bg-red-500/10 text-red-500 border-red-500/20"
//                                     }>
//                                       {request.status.toUpperCase()}
//                                     </Badge>
//                                   </div>
//                                   <p className="text-xs text-muted-foreground mb-2">User ID: {request.userId}</p>
//                                   <div className="space-y-2">
//                                     <div className="flex items-start gap-2">
//                                       <Ban className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
//                                       <div>
//                                         <p className="text-sm font-medium">Kick Reason:</p>
//                                         <p className="text-sm text-muted-foreground">{request.kickReason}</p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                                       <span>Kicked {getRelativeTime(request.kickTime)}</span>
//                                       <Separator orientation="vertical" className="h-3" />
//                                       <span>Requested {getRelativeTime(request.requestTime)}</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               {request.status === "pending" && (
//                                 <div className="flex gap-2">
//                                   <Button variant="outline" size="sm" onClick={() => handleApproveRejoin(request.id)}
//                                     className="border-green-500/30 hover:bg-green-500/10 text-green-500">
//                                     <UserCheck className="h-4 w-4 mr-2" />
//                                     Approve
//                                   </Button>
//                                   <Button variant="outline" size="sm" onClick={() => handleRejectRejoin(request.id)}
//                                     className="border-red-500/30 hover:bg-red-500/10 text-red-500">
//                                     <Ban className="h-4 w-4 mr-2" />
//                                     Reject
//                                   </Button>
//                                 </div>
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))
//                     )}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Activity Timeline Tab */}
//           <TabsContent value="timeline" className="space-y-0">
//             <Card className="border-border/40 shadow-xl">
//               <CardHeader className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-b border-border/40">
//                 <CardTitle className="flex items-center gap-3">
//                   <div className="p-2.5 rounded-lg bg-green-500/20">
//                     <Radio className="h-5 w-5 text-green-500" />
//                   </div>
//                   <div className="flex-1">
//                     <span className="text-lg">Live Activity Feed</span>
//                     <p className="text-sm text-muted-foreground font-normal mt-0.5">Real-time event tracking</p>
//                   </div>
//                   <Badge variant="outline" className="bg-green-500/10 border-green-500/20">{timeline.length} Events</Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <ScrollArea className="h-[600px] pr-4">
//                   <div className="relative space-y-4 before:absolute before:left-[15px] before:top-0 before:bottom-0 before:w-px before:bg-border">
//                     {timeline.map((event) => (
//                       <div key={event.id} className="relative pl-10">
//                         <div className="absolute left-0 top-1.5 p-1.5 rounded-full bg-background border-2 border-border">
//                           {getActivityIcon(event.type)}
//                         </div>
//                         <Card className="border-border/40">
//                           <CardContent className="pt-4 pb-4">
//                             <div className="flex items-start justify-between gap-4">
//                               <div className="flex-1">
//                                 <h3 className="font-semibold text-sm mb-1">{event.username}</h3>
//                                 <p className="text-sm text-muted-foreground mb-2">{event.action}</p>
//                                 <p className="text-xs text-muted-foreground">{getRelativeTime(event.timestamp)}</p>
//                               </div>
//                               <Badge variant="outline" className={
//                                 event.type === "join" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
//                                 event.type === "violation" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
//                                 event.type === "kick" ? "bg-red-500/10 text-red-500 border-red-500/20" :
//                                 event.type === "submission" ? "bg-green-500/10 text-green-500 border-green-500/20" :
//                                 "bg-purple-500/10 text-purple-500 border-purple-500/20"
//                               }>
//                                 {event.type.toUpperCase().replace("-", " ")}
//                               </Badge>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Kick Confirmation Dialog */}
//       <AlertDialog open={showKickDialog} onOpenChange={setShowKickDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <UserX className="h-5 w-5 text-red-500" />
//               Kick User from Room?
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to kick this user? They will be removed from the room immediately and can request to rejoin later.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmKickUser} className="bg-red-500 hover:bg-red-600">
//               Kick User
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }