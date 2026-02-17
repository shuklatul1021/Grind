// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
// import { Badge } from "@repo/ui/badge";
// import { ScrollArea } from "@repo/ui/scroll-area";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@repo/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@repo/ui/dropdown-menu";
// import {
//   Moon,
//   Sun,
//   LogOut,
//   Trophy,
//   Calendar,
//   Clock,
//   Users,
//   DollarSign,
//   Briefcase,
//   Zap,
//   Target,
//   Award,
//   Crown,
//   Sparkles,
//   TrendingUp,
//   UserIcon,
//   ChevronRight,
//   SquareChevronRight,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useTheme } from "../../contexts/ThemeContext";
// import type { RootState } from "../../state/ReduxStateProvider";


// interface Contest {
//   id: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   status: "upcoming" | "live" | "completed";
//   prizePool: number;
//   participants: number;
//   maxParticipants: number;
//   difficulty: "Easy" | "Medium" | "Hard" | "Expert";
//   sponsor: {
//     name: string;
//     logo: string;
//   };
//   prizes: {
//     position: string;
//     amount: number;
//     perks: string[];
//   }[];
//   tags: string[];
//   interviewOpportunity: boolean;
// }

// const MOCK_CONTESTS: Contest[] = [
//   {
//     id: "1",
//     title: "Google Cloud Challenge 2026",
//     description: "Solve complex cloud architecture problems and win cash prizes plus direct interview opportunities at Google.",
//     startDate: "2026-01-15T10:00:00",
//     endDate: "2026-01-15T13:00:00",
//     status: "upcoming",
//     prizePool: 50000,
//     participants: 234,
//     maxParticipants: 500,
//     difficulty: "Hard",
//     sponsor: {
//       name: "Google",
//       logo: "https://logo.clearbit.com/google.com"
//     },
//     prizes: [
//       {
//         position: "1st Place",
//         amount: 25000,
//         perks: ["Direct interview", "Google swag", "Cloud credits"]
//       },
//       {
//         position: "2nd Place",
//         amount: 15000,
//         perks: ["Resume review", "Cloud credits"]
//       },
//       {
//         position: "3rd Place",
//         amount: 10000,
//         perks: ["Cloud credits"]
//       }
//     ],
//     tags: ["Cloud", "Algorithms", "System Design"],
//     interviewOpportunity: true
//   },
//   {
//     id: "2",
//     title: "Meta Coding Sprint",
//     description: "4-hour intensive coding challenge focused on data structures and algorithms used at Meta.",
//     startDate: "2026-01-08T14:00:00",
//     endDate: "2026-01-08T18:00:00",
//     status: "live",
//     prizePool: 30000,
//     participants: 456,
//     maxParticipants: 1000,
//     difficulty: "Expert",
//     sponsor: {
//       name: "Meta",
//       logo: "https://logo.clearbit.com/meta.com"
//     },
//     prizes: [
//       {
//         position: "Top 10",
//         amount: 3000,
//         perks: ["Interview opportunity", "Meta swag"]
//       }
//     ],
//     tags: ["Algorithms", "Data Structures", "Problem Solving"],
//     interviewOpportunity: true
//   },
//   {
//     id: "3",
//     title: "Amazon AWS Builder Challenge",
//     description: "Build scalable solutions using AWS services. Winners get cash prizes and interview calls from Amazon.",
//     startDate: "2026-01-20T09:00:00",
//     endDate: "2026-01-20T17:00:00",
//     status: "upcoming",
//     prizePool: 40000,
//     participants: 189,
//     maxParticipants: 800,
//     difficulty: "Medium",
//     sponsor: {
//       name: "Amazon",
//       logo: "https://logo.clearbit.com/amazon.com"
//     },
//     prizes: [
//       {
//         position: "1st Place",
//         amount: 20000,
//         perks: ["Direct interview", "AWS credits $5000", "Amazon devices"]
//       },
//       {
//         position: "2nd Place",
//         amount: 12000,
//         perks: ["AWS credits $3000"]
//       },
//       {
//         position: "3rd Place",
//         amount: 8000,
//         perks: ["AWS credits $2000"]
//       }
//     ],
//     tags: ["AWS", "Cloud", "Backend"],
//     interviewOpportunity: true
//   },
//   {
//     id: "4",
//     title: "Microsoft AI Hackathon",
//     description: "Create innovative AI solutions using Azure AI services. Top performers get internship offers.",
//     startDate: "2026-01-25T10:00:00",
//     endDate: "2026-01-26T10:00:00",
//     status: "upcoming",
//     prizePool: 35000,
//     participants: 312,
//     maxParticipants: 600,
//     difficulty: "Hard",
//     sponsor: {
//       name: "Microsoft",
//       logo: "https://logo.clearbit.com/microsoft.com"
//     },
//     prizes: [
//       {
//         position: "1st Place",
//         amount: 18000,
//         perks: ["Internship offer", "Azure credits", "Surface device"]
//       },
//       {
//         position: "2nd-5th Place",
//         amount: 5000,
//         perks: ["Interview fast-track", "Azure credits"]
//       }
//     ],
//     tags: ["AI/ML", "Azure", "Innovation"],
//     interviewOpportunity: true
//   },
//   {
//     id: "5",
//     title: "Weekly Algorithm Championship",
//     description: "Regular weekly contest sponsored by multiple tech companies. Consistent winners get exclusive opportunities.",
//     startDate: "2026-01-11T15:00:00",
//     endDate: "2026-01-11T18:00:00",
//     status: "completed",
//     prizePool: 10000,
//     participants: 892,
//     maxParticipants: 1000,
//     difficulty: "Medium",
//     sponsor: {
//       name: "Grind",
//       logo: "/NewSvg.png"
//     },
//     prizes: [
//       {
//         position: "1st Place",
//         amount: 5000,
//         perks: ["Premium subscription", "Featured profile"]
//       },
//       {
//         position: "Top 20",
//         amount: 250,
//         perks: ["Premium credits"]
//       }
//     ],
//     tags: ["Algorithms", "DSA", "Problem Solving"],
//     interviewOpportunity: false
//   }
// ];

// export default function ExclusiveContests() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [contests, setContests] = useState<Contest[]>(MOCK_CONTESTS);
//   const [selectedTab, setSelectedTab] = useState("upcoming");
//   const UserProfile = useSelector((state: RootState) => state.userDetails);

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     navigate("/auth");
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "live":
//         return "bg-green-500/10 text-green-600 border-green-500/20";
//       case "upcoming":
//         return "bg-blue-500/10 text-blue-600 border-blue-500/20";
//       case "completed":
//         return "bg-gray-500/10 text-gray-600 border-gray-500/20";
//       default:
//         return "bg-muted";
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "Easy":
//         return "bg-green-500/10 text-green-600";
//       case "Medium":
//         return "bg-yellow-500/10 text-yellow-600";
//       case "Hard":
//         return "bg-orange-500/10 text-orange-600";
//       case "Expert":
//         return "bg-red-500/10 text-red-600";
//       default:
//         return "bg-muted";
//     }
//   };

//   const filteredContests = contests.filter((contest) => {
//     if (selectedTab === "all") return true;
//     return contest.status === selectedTab;
//   });

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="max-w-[1800px] mx-auto flex h-16 items-center justify-between px-6">
//           <div
//             className="flex cursor-pointer items-center gap-2"
//             onClick={() => navigate("/")}
//           >
//             <SquareChevronRight className="h-6 w-6" />
//             <span className="text-xl font-bold">Grind</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="relative h-10 w-10 rounded-full"
//                 >
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage
//                       src={UserProfile?.profilePicture}
//                       alt={UserProfile?.username}
//                     />
//                     <AvatarFallback>
//                       <UserIcon className="h-5 w-5" />
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end">
//                 <DropdownMenuItem onClick={() => navigate("/profile")}>
//                   <UserIcon className="mr-2 h-4 w-4" />
//                   <span>Profile</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleSignOut}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>Sign out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-background">
//         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
//         <div className="max-w-[1800px] mx-auto px-6 py-20 relative">
//           <div className="max-w-4xl mx-auto text-center space-y-6">
//             <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-0 shadow-lg">
//               <Crown className="h-4 w-4 mr-2" />
//               Premium Feature
//             </Badge>
//             <h1 className="text-5xl font-bold tracking-tight">
//               Exclusive Contests
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Compete in premium contests with cash prizes, company sponsorships, and direct interview opportunities from top tech companies.
//             </p>
            
//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
//                   <div className="text-2xl font-bold">$165K+</div>
//                   <div className="text-sm text-muted-foreground">Total Prize Pool</div>
//                 </CardContent>
//               </Card>
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
//                   <div className="text-2xl font-bold">24</div>
//                   <div className="text-sm text-muted-foreground">Active Contests</div>
//                 </CardContent>
//               </Card>
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Briefcase className="h-8 w-8 mx-auto mb-2 text-blue-500" />
//                   <div className="text-2xl font-bold">8</div>
//                   <div className="text-sm text-muted-foreground">Company Sponsors</div>
//                 </CardContent>
//               </Card>
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
//                   <div className="text-2xl font-bold">2,083</div>
//                   <div className="text-sm text-muted-foreground">Active Participants</div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-[1800px] mx-auto px-6 py-12">
//         <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
//           <div className="flex items-center justify-between">
//             <TabsList className="grid w-full max-w-md grid-cols-4">
//               <TabsTrigger value="all">All</TabsTrigger>
//               <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//               <TabsTrigger value="live">Live</TabsTrigger>
//               <TabsTrigger value="completed">Completed</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value={selectedTab} className="space-y-6">
//             <div className="grid gap-6">
//               {filteredContests.map((contest) => (
//                 <Card
//                   key={contest.id}
//                   className="border-border/40 hover:border-blue-500/50 transition-all hover:shadow-lg group overflow-hidden"
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex flex-col lg:flex-row gap-6">
//                       {/* Left Section - Contest Info */}
//                       <div className="flex-1 space-y-4">
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                               <img
//                                 src={contest.sponsor.logo}
//                                 alt={contest.sponsor.name}
//                                 className="h-8 w-8 rounded-lg"
//                               />
//                               <Badge variant="outline" className={getStatusColor(contest.status)}>
//                                 {contest.status === "live" && <Zap className="h-3 w-3 mr-1" />}
//                                 {contest.status.toUpperCase()}
//                               </Badge>
//                               {contest.interviewOpportunity && (
//                                 <Badge className="bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-600 border-0">
//                                   <Target className="h-3 w-3 mr-1" />
//                                   Interview Opportunity
//                                 </Badge>
//                               )}
//                             </div>
//                             <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
//                               {contest.title}
//                             </h3>
//                             <p className="text-sm text-muted-foreground mb-3">
//                               {contest.description}
//                             </p>
//                             <div className="flex flex-wrap items-center gap-4 text-sm">
//                               <div className="flex items-center gap-2">
//                                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                                 <span>{formatDate(contest.startDate)}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Clock className="h-4 w-4 text-muted-foreground" />
//                                 <span>
//                                   {Math.floor((new Date(contest.endDate).getTime() - new Date(contest.startDate).getTime()) / (1000 * 60 * 60))}h duration
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Users className="h-4 w-4 text-muted-foreground" />
//                                 <span>
//                                   {contest.participants}/{contest.maxParticipants} participants
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Tags & Difficulty */}
//                         <div className="flex flex-wrap items-center gap-2">
//                           <Badge variant="outline" className={getDifficultyColor(contest.difficulty)}>
//                             {contest.difficulty}
//                           </Badge>
//                           {contest.tags.map((tag) => (
//                             <Badge key={tag} variant="outline" className="border-border/40">
//                               {tag}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Right Section - Prizes */}
//                       <div className="lg:w-80 space-y-4">
//                         <Card className="border-border/40 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
//                           <CardHeader className="pb-3">
//                             <CardTitle className="text-sm font-medium flex items-center gap-2">
//                               <DollarSign className="h-4 w-4 text-green-500" />
//                               Prize Pool
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="space-y-3">
//                             <div className="text-3xl font-bold text-green-600">
//                               ${contest.prizePool.toLocaleString()}
//                             </div>
//                             <div className="space-y-2">
//                               {contest.prizes.map((prize, idx) => (
//                                 <div
//                                   key={idx}
//                                   className="flex items-start justify-between text-sm p-2 rounded-lg bg-background/50"
//                                 >
//                                   <div className="flex items-center gap-2">
//                                     <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
//                                     <div>
//                                       <div className="font-semibold">{prize.position}</div>
//                                       <div className="text-xs text-muted-foreground">
//                                         ${prize.amount.toLocaleString()}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </CardContent>
//                         </Card>

//                         <Button
//                           className="w-full h-11 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
//                           disabled={contest.status === "completed"}
//                         >
//                           {contest.status === "live" ? (
//                             <>
//                               <Zap className="mr-2 h-4 w-4" />
//                               Join Now
//                             </>
//                           ) : contest.status === "upcoming" ? (
//                             <>
//                               <Calendar className="mr-2 h-4 w-4" />
//                               Register
//                             </>
//                           ) : (
//                             <>
//                               <Trophy className="mr-2 h-4 w-4" />
//                               View Results
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>

//         {/* Benefits Section */}
//         <div className="mt-16 grid md:grid-cols-3 gap-6">
//           <Card className="border-border/40">
//             <CardContent className="p-6 text-center space-y-4">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto">
//                 <DollarSign className="h-6 w-6 text-green-500" />
//               </div>
//               <h3 className="text-lg font-semibold">Cash Prizes</h3>
//               <p className="text-sm text-muted-foreground">
//                 Win substantial cash prizes ranging from $250 to $25,000. Top performers get rewarded generously.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40">
//             <CardContent className="p-6 text-center space-y-4">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
//                 <Briefcase className="h-6 w-6 text-blue-500" />
//               </div>
//               <h3 className="text-lg font-semibold">Company Sponsorships</h3>
//               <p className="text-sm text-muted-foreground">
//                 Contests sponsored by Google, Meta, Amazon, Microsoft and other top tech companies.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40">
//             <CardContent className="p-6 text-center space-y-4">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
//                 <Target className="h-6 w-6 text-purple-500" />
//               </div>
//               <h3 className="text-lg font-semibold">Interview Opportunities</h3>
//               <p className="text-sm text-muted-foreground">
//                 Top performers get direct interview calls and fast-track opportunities at sponsor companies.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }