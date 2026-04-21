import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSEO, seoConfigs } from "../utils/seo";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Card, CardContent } from "@repo/ui/card";
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
  Search,
  CheckCircle2,
  Circle,
  SquareChevronRight,
  Shuffle,
  LayoutGrid,
  ListChecks,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import type { Problem } from "../types/problem";
import MainSideNav from "../components/MainSideNav";
import { useDashboardData } from "../hooks/useDashboardData";

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

  const {
    problems,
    solvedProblems,
    problemsLoaded,
    userDetails: UserProfileUser,
  } = useDashboardData(["problems", "userDetails"]);

  const loading = !problemsLoaded;
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");

  const uniqueTags = Array.from(
    new Set((problems as Problem[]).flatMap((p) => p.tags)),
  ).sort();

  useEffect(() => {
    updateSEO(seoConfigs.problems);
  }, []);



  const handleSignOut = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleRandomPick = () => {
    const typedProblems = problems as Problem[];
    if (typedProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * typedProblems.length);
      const randomProblem = typedProblems[randomIndex];
      navigate(`/problem/${randomProblem.slug}`);
    }
  };

  const filteredProblems = (problems as Problem[]).filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesDifficulty =
      difficultyFilter === "all" ||
      problem.difficulty.toLowerCase() === difficultyFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "solved" && problem.isSolved === true) ||
      (statusFilter === "unsolved" && problem.isSolved !== true);

    const matchesTag = tagFilter === "all" || problem.tags.includes(tagFilter);

    return matchesSearch && matchesDifficulty && matchesStatus && matchesTag;
  });

  const totalProblems = (problems as Problem[]).length;
  const solvedCount = (solvedProblems as string[]).length;
  const unsolvedCount = Math.max(totalProblems - solvedCount, 0);
  const completionRate =
    totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

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
    <div className="min-h-screen bg-background sidebar-offset">
      <MainSideNav
        active="problems"
        theme={theme}
        toggleTheme={toggleTheme}
        avatarUrl={UserProfileUser?.avatar || ""}
        avatarFallback={UserProfileUser?.fullname?.[0] || "G"}
        onProfile={() => navigate("/you")}
        onSignOut={handleSignOut}
      />

      <main className="h-[calc(100vh-3.5rem)] px-4 py-4 sm:px-6 sm:py-6 lg:h-screen lg:px-8">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4">
          <section className="flex flex-none items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border/60 bg-background p-2">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Dashboard
                </p>
                <h1 className="text-base font-semibold sm:text-lg">Problems</h1>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleRandomPick}
            >
              <Shuffle className="h-4 w-4" />
              Pick One
            </Button>
          </section>

          <section className="grid flex-none gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold">{totalProblems}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Solved
                </p>
                <p className="mt-2 text-2xl font-semibold">{solvedCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Remaining
                </p>
                <p className="mt-2 text-2xl font-semibold">{unsolvedCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Completion
                </p>
                <p className="mt-2 text-2xl font-semibold">{completionRate}%</p>
              </CardContent>
            </Card>
          </section>

          <section className="flex flex-none flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              Filters
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="w-[130px]">
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
                  <SelectTrigger className="w-[130px]">
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
                  <SelectTrigger className="w-[130px]">
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
          </section>

          <section className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-center">
                      Status
                    </TableHead>
                    <TableHead className="min-w-[220px]">Title</TableHead>
                    <TableHead className="w-[110px]">Difficulty</TableHead>
                    <TableHead className="w-[110px]">Acceptance</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Topics
                    </TableHead>
                    <TableHead className="w-[100px] text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          <Skeleton className="mx-auto h-5 w-5 rounded-full" />
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
                          <Skeleton className="ml-auto h-8 w-8" />
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
                        <TableCell className="font-medium">
                          {problem.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${
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
                                className="h-5 px-1 py-0 text-[10px] font-normal"
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <SquareChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
