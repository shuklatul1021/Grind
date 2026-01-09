// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
// import { Badge } from "@repo/ui/badge";
// import { Progress } from "@repo/ui/progress";
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
//   Calendar,
//   CheckCircle2,
//   Clock,
//   Target,
//   BookOpen,
//   Video,
//   FileText,
//   TrendingUp,
//   Award,
//   Briefcase,
//   Users,
//   Zap,
//   ChevronRight,
//   Play,
//   Lock,
//   Crown,
//   UserIcon,
//   SquareChevronRight,
//   Star,
//   Code,
// } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";
// import type { RootState } from "../../state/ReduxStateProvider";
// import { useSelector } from "react-redux";

// interface PrepPlan {
//   id: string;
//   duration: number;
//   title: string;
//   description: string;
//   features: string[];
//   weeklyHours: number;
//   totalProblems: number;
//   mockInterviews: number;
//   difficulty: "Beginner" | "Intermediate" | "Advanced";
//   recommended: boolean;
// }

// interface Company {
//   id: string;
//   name: string;
//   logo: string;
//   questionCount: number;
//   difficulty: string;
//   topics: string[];
//   avgSalary: string;
// }

// interface MockInterview {
//   id: string;
//   title: string;
//   company: string;
//   duration: number;
//   difficulty: string;
//   topics: string[];
//   completions: number;
//   rating: number;
//   type: "Technical" | "Behavioral" | "System Design";
// }

// const PREP_PLANS: PrepPlan[] = [
//   {
//     id: "30-day",
//     duration: 30,
//     title: "30-Day Sprint",
//     description: "Intensive preparation for upcoming interviews. Focus on most common patterns and essential topics.",
//     features: [
//       "100 curated problems",
//       "4 mock interviews",
//       "Daily study plan",
//       "Pattern recognition focus",
//       "Time management tips"
//     ],
//     weeklyHours: 20,
//     totalProblems: 100,
//     mockInterviews: 4,
//     difficulty: "Intermediate",
//     recommended: false
//   },
//   {
//     id: "60-day",
//     duration: 60,
//     title: "60-Day Accelerator",
//     description: "Balanced approach covering all essential topics with adequate practice time.",
//     features: [
//       "200 curated problems",
//       "8 mock interviews",
//       "Weekly progress tracking",
//       "All major patterns",
//       "Company-specific prep",
//       "Resume review session"
//     ],
//     weeklyHours: 15,
//     totalProblems: 200,
//     mockInterviews: 8,
//     difficulty: "Intermediate",
//     recommended: true
//   },
//   {
//     id: "90-day",
//     duration: 90,
//     title: "90-Day Mastery",
//     description: "Comprehensive preparation from basics to advanced topics. Perfect for thorough preparation.",
//     features: [
//       "300+ curated problems",
//       "12 mock interviews",
//       "Foundation to advanced",
//       "System design included",
//       "Behavioral prep",
//       "Career coaching session",
//       "Premium resources access"
//     ],
//     weeklyHours: 12,
//     totalProblems: 300,
//     mockInterviews: 12,
//     difficulty: "Beginner",
//     recommended: false
//   }
// ];

// const COMPANIES: Company[] = [
//   {
//     id: "google",
//     name: "Google",
//     logo: "https://logo.clearbit.com/google.com",
//     questionCount: 450,
//     difficulty: "Hard",
//     topics: ["Algorithms", "System Design", "Data Structures"],
//     avgSalary: "$180K - $350K"
//   },
//   {
//     id: "amazon",
//     name: "Amazon",
//     logo: "https://logo.clearbit.com/amazon.com",
//     questionCount: 380,
//     difficulty: "Medium",
//     topics: ["Algorithms", "Leadership Principles", "System Design"],
//     avgSalary: "$150K - $280K"
//   },
//   {
//     id: "meta",
//     name: "Meta",
//     logo: "https://logo.clearbit.com/meta.com",
//     questionCount: 420,
//     difficulty: "Hard",
//     topics: ["Algorithms", "System Design", "Product Sense"],
//     avgSalary: "$170K - $340K"
//   },
//   {
//     id: "microsoft",
//     name: "Microsoft",
//     logo: "https://logo.clearbit.com/microsoft.com",
//     questionCount: 350,
//     difficulty: "Medium",
//     topics: ["Algorithms", "System Design", "OOP"],
//     avgSalary: "$140K - $280K"
//   },
//   {
//     id: "apple",
//     name: "Apple",
//     logo: "https://logo.clearbit.com/apple.com",
//     questionCount: 280,
//     difficulty: "Hard",
//     topics: ["Algorithms", "System Design", "Hardware Integration"],
//     avgSalary: "$160K - $320K"
//   },
//   {
//     id: "netflix",
//     name: "Netflix",
//     logo: "https://logo.clearbit.com/netflix.com",
//     questionCount: 180,
//     difficulty: "Hard",
//     topics: ["System Design", "Microservices", "Scalability"],
//     avgSalary: "$200K - $400K"
//   }
// ];

// const MOCK_INTERVIEWS: MockInterview[] = [
//   {
//     id: "1",
//     title: "Google L4 Software Engineer",
//     company: "Google",
//     duration: 45,
//     difficulty: "Hard",
//     topics: ["Arrays", "Dynamic Programming", "Graphs"],
//     completions: 2340,
//     rating: 4.8,
//     type: "Technical"
//   },
//   {
//     id: "2",
//     title: "Amazon SDE II Coding Round",
//     company: "Amazon",
//     duration: 60,
//     difficulty: "Medium",
//     topics: ["Trees", "Hash Maps", "Strings"],
//     completions: 3120,
//     rating: 4.6,
//     type: "Technical"
//   },
//   {
//     id: "3",
//     title: "Meta E4 System Design",
//     company: "Meta",
//     duration: 60,
//     difficulty: "Hard",
//     topics: ["Scalability", "Database Design", "Caching"],
//     completions: 1890,
//     rating: 4.9,
//     type: "System Design"
//   },
//   {
//     id: "4",
//     title: "Microsoft Behavioral Interview",
//     company: "Microsoft",
//     duration: 45,
//     difficulty: "Medium",
//     topics: ["Leadership", "Teamwork", "Conflict Resolution"],
//     completions: 2560,
//     rating: 4.5,
//     type: "Behavioral"
//   }
// ];

// export default function InterviewPreparation() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const UserProfile = useSelector((state: RootState) => state.userDetails);

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     navigate("/auth");
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "Easy":
//       case "Beginner":
//         return "bg-green-500/10 text-green-600";
//       case "Medium":
//       case "Intermediate":
//         return "bg-yellow-500/10 text-yellow-600";
//       case "Hard":
//       case "Advanced":
//         return "bg-red-500/10 text-red-600";
//       default:
//         return "bg-muted";
//     }
//   };

//   const getTypeIcon = (type: string) => {
//     switch (type) {
//       case "Technical":
//         return <Code className="h-4 w-4" />;
//       case "System Design":
//         return <Briefcase className="h-4 w-4" />;
//       case "Behavioral":
//         return <Users className="h-4 w-4" />;
//       default:
//         return <FileText className="h-4 w-4" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="max-w-[1800px] mx-auto flex h-16 items-center justify-between px-6">
//           <div
//             className="flex cursor-pointer items-center gap-2"
//             onClick={() => navigate(-1)}
//           >
//             <SquareChevronRight className="h-6 w-6" />
//             <span className="text-xl font-bold">Grind</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="rounded-full"
//             >
//               {theme === "dark" ? (
//                 <Sun className="h-5 w-5" />
//               ) : (
//                 <Moon className="h-5 w-5" />
//               )}
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="relative h-10 w-10 rounded-full"
//                 >
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage
//                       src={UserProfile.profilePicture}
//                       alt={UserProfile.username}
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
//       <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-background">
//         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
//         <div className="max-w-[1800px] mx-auto px-6 py-20 relative">
//           <div className="max-w-4xl mx-auto text-center space-y-6">
//             <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-600 border-0 shadow-lg">
//               <Crown className="h-4 w-4 mr-2" />
//               Premium Feature
//             </Badge>
//             <h1 className="text-5xl font-bold tracking-tight">
//               Interview Preparation
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Structured 30/60/90 day prep plans, realistic mock interviews, and company-specific question sets to ace your dream job interview.
//             </p>
            
//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
//                   <div className="text-2xl font-bold">12,450+</div>
//                   <div className="text-sm text-muted-foreground">Students Placed</div>
//                 </CardContent>
//               </Card>
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Video className="h-8 w-8 mx-auto mb-2 text-blue-500" />
//                   <div className="text-2xl font-bold">500+</div>
//                   <div className="text-sm text-muted-foreground">Mock Interviews</div>
//                 </CardContent>
//               </Card>
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Briefcase className="h-8 w-8 mx-auto mb-2 text-green-500" />
//                   <div className="text-2xl font-bold">50+</div>
//                   <div className="text-sm text-muted-foreground">Companies Covered</div>
//                 </CardContent>
//               </Card>
//               <Card className="border-border/40 bg-background/50 backdrop-blur">
//                 <CardContent className="p-6 text-center">
//                   <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
//                   <div className="text-2xl font-bold">94%</div>
//                   <div className="text-sm text-muted-foreground">Success Rate</div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-[1800px] mx-auto px-6 py-12">
//         <Tabs defaultValue="plans" className="space-y-8">
//           <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
//             <TabsTrigger value="plans">
//               <Calendar className="h-4 w-4 mr-2" />
//               Prep Plans
//             </TabsTrigger>
//             <TabsTrigger value="mock">
//               <Video className="h-4 w-4 mr-2" />
//               Mock Interviews
//             </TabsTrigger>
//             <TabsTrigger value="companies">
//               <Briefcase className="h-4 w-4 mr-2" />
//               Companies
//             </TabsTrigger>
//           </TabsList>

//           {/* Prep Plans Tab */}
//           <TabsContent value="plans" className="space-y-8">
//             <div className="text-center space-y-2 mb-8">
//               <h2 className="text-3xl font-bold">Choose Your Preparation Plan</h2>
//               <p className="text-muted-foreground">
//                 Structured roadmaps designed by top engineers from FAANG companies
//               </p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//               {PREP_PLANS.map((plan) => (
//                 <Card
//                   key={plan.id}
//                   className={`relative border-border/40 transition-all hover:shadow-xl ${
//                     plan.recommended
//                       ? "border-purple-500/50 ring-2 ring-purple-500/20"
//                       : ""
//                   } ${
//                     selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""
//                   }`}
//                 >
//                   {plan.recommended && (
//                     <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                       <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
//                         <Star className="h-3 w-3 mr-1" />
//                         Most Popular
//                       </Badge>
//                     </div>
//                   )}
//                   <CardHeader className="text-center pb-4">
//                     <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
//                       <Calendar className="h-8 w-8 text-purple-500" />
//                     </div>
//                     <CardTitle className="text-2xl">{plan.title}</CardTitle>
//                     <div className="text-3xl font-bold mt-2">
//                       {plan.duration}
//                       <span className="text-lg text-muted-foreground ml-1">
//                         days
//                       </span>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <p className="text-sm text-muted-foreground text-center">
//                       {plan.description}
//                     </p>

//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Weekly Hours</span>
//                         <span className="font-semibold">{plan.weeklyHours}h</span>
//                       </div>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Total Problems</span>
//                         <span className="font-semibold">{plan.totalProblems}</span>
//                       </div>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Mock Interviews</span>
//                         <span className="font-semibold">{plan.mockInterviews}</span>
//                       </div>
//                     </div>

//                     <div className="pt-3 border-t border-border/40">
//                       <div className="space-y-2">
//                         {plan.features.map((feature, idx) => (
//                           <div key={idx} className="flex items-start gap-2">
//                             <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                             <span className="text-sm">{feature}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <Badge
//                       variant="outline"
//                       className={`w-full justify-center ${getDifficultyColor(
//                         plan.difficulty
//                       )}`}
//                     >
//                       {plan.difficulty} Level
//                     </Badge>

//                     <Button
//                       className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
//                       onClick={() => setSelectedPlan(plan.id)}
//                     >
//                       {selectedPlan === plan.id ? "Selected" : "Start This Plan"}
//                       <ChevronRight className="ml-2 h-4 w-4" />
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           {/* Mock Interviews Tab */}
//           <TabsContent value="mock" className="space-y-8">
//             <div className="text-center space-y-2 mb-8">
//               <h2 className="text-3xl font-bold">Mock Interview Sessions</h2>
//               <p className="text-muted-foreground">
//                 Practice with real interview scenarios from top tech companies
//               </p>
//             </div>

//             <div className="grid gap-6">
//               {MOCK_INTERVIEWS.map((interview) => (
//                 <Card
//                   key={interview.id}
//                   className="border-border/40 hover:border-purple-500/50 transition-all hover:shadow-lg group"
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex flex-col lg:flex-row gap-6">
//                       <div className="flex-1 space-y-4">
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                               <Badge
//                                 variant="outline"
//                                 className="border-purple-500/30 bg-purple-500/10 text-purple-600"
//                               >
//                                 {getTypeIcon(interview.type)}
//                                 <span className="ml-1">{interview.type}</span>
//                               </Badge>
//                               <Badge
//                                 variant="outline"
//                                 className={getDifficultyColor(interview.difficulty)}
//                               >
//                                 {interview.difficulty}
//                               </Badge>
//                             </div>
//                             <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">
//                               {interview.title}
//                             </h3>
//                             <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
//                               <div className="flex items-center gap-2">
//                                 <Briefcase className="h-4 w-4" />
//                                 <span>{interview.company}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Clock className="h-4 w-4" />
//                                 <span>{interview.duration} minutes</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Users className="h-4 w-4" />
//                                 <span>{interview.completions.toLocaleString()} completions</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
//                                 <span className="font-semibold">{interview.rating}</span>
//                               </div>
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                               {interview.topics.map((topic) => (
//                                 <Badge
//                                   key={topic}
//                                   variant="outline"
//                                   className="border-border/40"
//                                 >
//                                   {topic}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="lg:w-64 flex flex-col gap-3">
//                         <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
//                           <Play className="mr-2 h-4 w-4" />
//                           Start Interview
//                         </Button>
//                         <Button variant="outline" className="w-full">
//                           <BookOpen className="mr-2 h-4 w-4" />
//                           View Details
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           {/* Companies Tab */}
//           <TabsContent value="companies" className="space-y-8">
//             <div className="text-center space-y-2 mb-8">
//               <h2 className="text-3xl font-bold">Company-Specific Questions</h2>
//               <p className="text-muted-foreground">
//                 Real interview questions asked at top tech companies
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {COMPANIES.map((company) => (
//                 <Card
//                   key={company.id}
//                   className="border-border/40 hover:border-blue-500/50 transition-all hover:shadow-lg group cursor-pointer"
//                   onClick={() => navigate(`/premium/interview-prep/${company.id}`)}
//                 >
//                   <CardHeader>
//                     <div className="flex items-center gap-4 mb-4">
//                       <img
//                         src={company.logo}
//                         alt={company.name}
//                         className="h-12 w-12 rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <CardTitle className="text-xl group-hover:text-blue-500 transition-colors">
//                           {company.name}
//                         </CardTitle>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           {company.avgSalary}
//                         </p>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-muted-foreground">Questions</span>
//                       <span className="text-2xl font-bold">{company.questionCount}</span>
//                     </div>

//                     <Badge
//                       variant="outline"
//                       className={`w-full justify-center ${getDifficultyColor(
//                         company.difficulty
//                       )}`}
//                     >
//                       {company.difficulty} Difficulty
//                     </Badge>

//                     <div className="pt-3 border-t border-border/40">
//                       <div className="text-xs text-muted-foreground mb-2">
//                         Common Topics
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {company.topics.map((topic) => (
//                           <Badge
//                             key={topic}
//                             variant="outline"
//                             className="text-xs border-border/40"
//                           >
//                             {topic}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>

//                     <Button
//                       variant="outline"
//                       className="w-full group-hover:bg-blue-500/10 group-hover:border-blue-500/50"
//                     >
//                       View Questions
//                       <ChevronRight className="ml-2 h-4 w-4" />
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>

//         {/* Features Section */}
//         <div className="mt-16 grid md:grid-cols-3 gap-6">
//           <Card className="border-border/40">
//             <CardContent className="p-6 text-center space-y-4">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
//                 <Target className="h-6 w-6 text-purple-500" />
//               </div>
//               <h3 className="text-lg font-semibold">Structured Roadmaps</h3>
//               <p className="text-sm text-muted-foreground">
//                 Follow proven 30/60/90 day plans designed by engineers from top tech companies.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40">
//             <CardContent className="p-6 text-center space-y-4">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
//                 <Video className="h-6 w-6 text-blue-500" />
//               </div>
//               <h3 className="text-lg font-semibold">Realistic Mock Interviews</h3>
//               <p className="text-sm text-muted-foreground">
//                 Practice with timed mock interviews that simulate real company interview experiences.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-border/40">
//             <CardContent className="p-6 text-center space-y-4">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto">
//                 <TrendingUp className="h-6 w-6 text-green-500" />
//               </div>
//               <h3 className="text-lg font-semibold">Progress Tracking</h3>
//               <p className="text-sm text-muted-foreground">
//                 Track your progress with detailed analytics and get personalized recommendations.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }