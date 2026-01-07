import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateSEO, seoConfigs } from "../utils/seo";
import { Button } from "@repo/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@repo/ui/dropdown-menu";
import { Badge } from "@repo/ui/badge";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import {
  Moon,
  Sun,
  LogOut,
  Search,
  CheckCircle2,
  Circle,
  SquareChevronRight,
  Shuffle,
  UserIcon,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import type { Problem } from "../types/problem";
import { BACKENDURL } from "../utils/urls";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails, type RootState } from "../state/ReduxStateProvider";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-300 dark:bg-gray-700 ${className || ""}`.trim()}
    />
  );
}

export default function ProblemsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const setReduxUserDetails = useDispatch();
  const UserProfile = useSelector((state: RootState) => state.userDetails);
  console.log("UserProfile:", UserProfile);
  const uniqueTags = Array.from(
    new Set(problems.flatMap((p) => p.tags))
  ).sort();

  useEffect(() => {
    updateSEO(seoConfigs.problems);
    getuserDetails();
    fetchProblems();
  }, [navigate]);

  const getuserDetails = async () => {
    const response = await fetch(`${BACKENDURL}/user/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    });
    if (response.ok) {
      const json = await response.json();
      setReduxUserDetails(setUserDetails(json.user));
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    const response = await fetch(`${BACKENDURL}/problems/getproblems`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    });
    if (response.ok) {
      const json = await response.json();
      setProblems(json.problems);
      setSolvedProblems(json.solvedProblems || []);
      // setReduxProblems(setReduxProblems(json.problems));
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch problems. Please try again.",
        variant: "destructive",
        action: <button onClick={fetchProblems}>Retry</button>,
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleRandomPick = () => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      const randomProblem = problems[randomIndex];
      navigate(`/problem/${randomProblem.slug}`);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesDifficulty =
      difficultyFilter === "all" ||
      problem.difficulty.toLowerCase() === difficultyFilter;

    const status = problems.find((p) => p.id === problem.id)?.isSolved;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "solved" && status === true) ||
      (statusFilter === "unsolved" && status !== true);

    const matchesTag = tagFilter === "all" || problem.tags.includes(tagFilter);

    return matchesSearch && matchesDifficulty && matchesStatus && matchesTag;
  });

  // const getDifficultyColor = (difficulty: string) => {
  //   switch (difficulty) {
  //     case "easy":
  //       return "bg-green-500/10 text-green-500 border-green-500/20";
  //     case "medium":
  //       return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  //     case "hard":
  //       return "bg-red-500/10 text-red-500 border-red-500/20";
  //     default:
  //       return "";
  //   }
  // };

  const getStatusIcon = (problemId: string) => {
    if (solvedProblems.includes(problemId)) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    return <Circle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
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
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600 hover:text-white"
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
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Compiler
            </Link>
            <Link
              to="/grind-ai"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Grind AI
            </Link>
            <Link
              to="/learning"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Learning
            </Link>
            <Link 
              to="/room" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Rooms
            </Link>
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
                      src={UserProfile?.user.avatar || ""}
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

      <main className="px-6 py-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-6">
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
            <p className="text-muted-foreground">
              Curated list of coding challenges to help you crack your next
              interview.
            </p>
          </div>

          {/* Filters Section - Clean Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant="outline"
                className="gap-2 bg-background"
                onClick={handleRandomPick}
              >
                <Shuffle className="h-4 w-4" />
                <span className="hidden sm:inline">Pick One</span>
              </Button>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-[130px] bg-background">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Difficulty</SelectItem>
                  <SelectItem value="easy" className="text-green-500">
                    Easy
                  </SelectItem>
                  <SelectItem value="medium" className="text-yellow-500">
                    Medium
                  </SelectItem>
                  <SelectItem value="hard" className="text-red-500">
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="unsolved">Unsolved</SelectItem>
                  <SelectItem value="attempted">Attempted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[130px] bg-background">
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Topics</SelectItem>
                  {uniqueTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">Status</TableHead>
                  <TableHead className="min-w-[200px] text-left pl-24">
                    Title
                  </TableHead>
                  <TableHead className="w-[100px]">Difficulty</TableHead>
                  <TableHead className="w-[100px]">Acceptance</TableHead>
                  <TableHead className="hidden md:table-cell">Topics</TableHead>
                  <TableHead className="text-right w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[40px]" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex gap-1">
                          <Skeleton className="h-5 w-12 rounded-full" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredProblems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No problems found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProblems.map((problem) => (
                    <TableRow
                      key={problem.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/problem/${problem.slug}`)}
                    >
                      <TableCell className="text-center">
                        {getStatusIcon(problem.id)}
                      </TableCell>
                      <TableCell className="font-medium text-left pl-24">
                        {problem.title}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium mr-[30px] ${
                            problem.difficulty.toLowerCase() === "easy"
                              ? "text-green-500"
                              : problem.difficulty.toLowerCase() === "medium"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {problem.difficulty.charAt(0).toUpperCase() +
                            problem.difficulty.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {problem.acceptanceRate
                          ? `${problem.acceptanceRate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1 py-0 h-5 font-normal"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{problem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <SquareChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
