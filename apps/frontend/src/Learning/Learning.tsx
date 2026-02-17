// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@repo/ui/button";
// import { Badge } from "@repo/ui/badge";
// import { Input } from "@repo/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/select";
// import {
//   Moon,
//   Sun,
//   LogOut,
//   Search,
//   CheckCircle2,
//   Circle,
//   SquareChevronRight,
//   UserIcon,
// } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@repo/ui/dropdown-menu";
// import type { RootState } from "../state/ReduxStateProvider";
// import { useSelector } from "react-redux";

// const LEARNING_MODULES = [
//   {
//     id: "practice",
//     title: "Practice Zone",
//     type: "Practice",
//     tags: ["Aptitude", "Coding", "Logic"],
//     status: "not-started",
//     description:
//       "Sharpen your skills with aptitude, coding, and logical practice questions.",
//     link: "/learning/practice",
//   },
//   {
//     id: "interview",
//     title: "Interview Preparation",
//     type: "Interview",
//     tags: ["DSA", "Coding", "Behavioral"],
//     status: "in-progress",
//     description:
//       "Prepare for technical and behavioral interviews with curated content.",
//     link: "/learning/interview",
//   },
//   {
//     id: "learning",
//     title: "Concept Learning",
//     type: "Learning",
//     tags: ["CS", "OOPS", "DBMS", "OS"],
//     status: "not-started",
//     description:
//       "Understand core computer science concepts with structured learning.",
//     link: "/learning/concepts",
//   },
//   {
//     id: "career",
//     title: "Career Growth",
//     type: "Career",
//     tags: ["HR", "Resume", "Soft Skills"],
//     status: "completed",
//     description: "Improve communication, HR skills, and career readiness.",
//     link: "/learning/career",
//   },
// ];

// export default function LearningPage() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const UserProfile = useSelector((state: RootState) => state.userDetails);

//   const filteredModules = LEARNING_MODULES.filter((mod) => {
//     const matchesSearch =
//       mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       mod.tags.some((tag) =>
//         tag.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//     const matchesType = typeFilter === "all" || mod.type === typeFilter;

//     const matchesStatus = statusFilter === "all" || mod.status === statusFilter;

//     return matchesSearch && matchesType && matchesStatus;
//   });

//   const getStatusIcon = (status: string) => {
//     if (status === "completed")
//       return <CheckCircle2 className="h-5 w-5 text-green-500" />;
//     if (status === "in-progress")
//       return <Circle className="h-5 w-5 text-yellow-500" />;
//     return <Circle className="h-5 w-5 text-muted-foreground" />;
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* HEADER */}
//       <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="max-w-[1800px] mx-auto flex h-16 items-center justify-between px-6">
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={() => navigate("/")}
//           >
//             <SquareChevronRight className="h-6 w-6" />
//             <span className="text-xl font-bold">Grind</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <Link
//               to="/problems"
//               className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
//             >
//               Problems
//             </Link>
//             <Link
//               to="/contest"
//               className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
//             >
//               Contest
//             </Link>
//             <Link
//               to="/compiler"
//               className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
//             >
//               Compiler
//             </Link>
//             <Link
//               to="/grind-ai"
//               className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
//             >
//               Grind AI
//             </Link>
//             <Link
//               to="/learning"
//               className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600 hover:text-white"
//             >
//               Learning
//             </Link>
//             <Link
//               to="/room"
//               className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
//             >
//               Rooms
//             </Link>
//             <Link
//               to="/premium"
//               className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
//             >
//               Premium
//             </Link>
//           </div>

//           <div className="flex items-center gap-3">
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
//                   Profile
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => {
//                     localStorage.removeItem("token");
//                     navigate("/auth");
//                   }}
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="max-w-[1800px] mx-auto px-6 py-8">
//         <h1 className="text-3xl font-bold">Learning Hub</h1>
//         <p className="text-muted-foreground mt-1">
//           Practice, learn concepts, prepare for interviews, and grow your
//           career.
//         </p>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mt-6">
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
//             <Input
//               className="pl-10"
//               placeholder="Search modules..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <Select value={typeFilter} onValueChange={setTypeFilter}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All</SelectItem>
//               <SelectItem value="Practice">Practice</SelectItem>
//               <SelectItem value="Interview">Interview</SelectItem>
//               <SelectItem value="Learning">Learning</SelectItem>
//               <SelectItem value="Career">Career</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All</SelectItem>
//               <SelectItem value="not-started">Not Started</SelectItem>
//               <SelectItem value="in-progress">In Progress</SelectItem>
//               <SelectItem value="completed">Completed</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//           {filteredModules.map((mod) => (
//             <div
//               key={mod.id}
//               onClick={() => navigate(mod.link)}
//               className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
//             >
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   {getStatusIcon(mod.status)}
//                   <h3 className="text-lg font-semibold">{mod.title}</h3>
//                 </div>
//                 <Badge>{mod.type}</Badge>
//               </div>

//               <p className="text-sm text-muted-foreground mt-2 text-left">
//                 {mod.description}
//               </p>

//               <div className="flex flex-wrap gap-2 mt-3">
//                 {mod.tags.map((tag) => (
//                   <Badge key={tag} variant="outline">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="flex justify-end mt-4">
//                 <SquareChevronRight />
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
