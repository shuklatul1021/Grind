import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
} from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Input } from "@repo/ui/input";
import {
  ChevronLeft,
  Search,
  Code2,
  Trophy,
  Zap,
  CheckCircle2,
  ArrowRight,
  Filter,
  BookMarked,
  Target,
  Sparkles,
  Play,
  Lock,
  Brain,
  Users,
  TrendingUp,
  Award,
  Clock,
  MessageSquare,
  Star,
  Lightbulb,
  CheckCircle,
  ChevronRight,
  BookOpen,
  FileCode,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

// Mock Data
const COMPANIES = [
  { name: "Google", count: 245, logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" },
  { name: "Meta", count: 198, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Meta_Platforms_logo.svg" },
  { name: "Amazon", count: 312, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" , style : "mx-auto h-8 w-15" },
  { name: "Apple", count: 156, logo: "https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" },
  { name: "Microsoft", count: 287, logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Netflix", count: 89, logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
];

const TOPICS = [
  { id: 1, name: "Array", count: 187, color: "bg-blue-500/10 text-blue-500" },
  {
    id: 2,
    name: "String",
    count: 145,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    name: "Dynamic Programming",
    count: 132,
    color: "bg-purple-500/10 text-purple-500",
  },
  { id: 4, name: "Tree", count: 98, color: "bg-orange-500/10 text-orange-500" },
  { id: 5, name: "Graph", count: 87, color: "bg-red-500/10 text-red-500" },
  {
    id: 6,
    name: "Binary Search",
    count: 76,
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    id: 7,
    name: "Backtracking",
    count: 54,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    id: 8,
    name: "Greedy",
    count: 63,
    color: "bg-yellow-500/10 text-yellow-500",
  },
];

const PREMIUM_PROBLEMS = [
  {
    id: 1,
    title: "Design In-Memory File System",
    slug: "design-in-memory-file-system",
    difficulty: "Hard",
    topics: ["Design", "Hash Table", "Trie"],
    companies: ["Google", "Amazon"],
    acceptance: 45.2,
    submissions: 12500,
    solutions: 5,
    hints: 3,
    isPremium: true,
    hasVideo: true,
    avgTime: "45 min",
  },
  {
    id: 2,
    title: "Maximum Profit in Job Scheduling",
    slug: "maximum-profit-in-job-scheduling",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "Binary Search"],
    companies: ["Microsoft", "Meta"],
    acceptance: 49.8,
    submissions: 18900,
    solutions: 4,
    hints: 4,
    isPremium: true,
    hasVideo: true,
    avgTime: "40 min",
  },
  {
    id: 3,
    title: "Find Servers That Handled Most Number of Requests",
    slug: "find-servers-that-handled-most-number-of-requests",
    difficulty: "Hard",
    topics: ["Array", "Greedy", "Heap"],
    companies: ["Amazon", "Apple"],
    acceptance: 38.4,
    submissions: 8700,
    solutions: 3,
    hints: 2,
    isPremium: true,
    hasVideo: false,
    avgTime: "50 min",
  },
  {
    id: 4,
    title: "Parallel Courses III",
    slug: "parallel-courses-iii",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "Graph", "Topological Sort"],
    companies: ["Google", "Meta"],
    acceptance: 62.1,
    submissions: 15200,
    solutions: 6,
    hints: 3,
    isPremium: true,
    hasVideo: true,
    avgTime: "35 min",
  },
  {
    id: 5,
    title: "Meeting Rooms III",
    slug: "meeting-rooms-iii",
    difficulty: "Hard",
    topics: ["Array", "Sorting", "Heap"],
    companies: ["Amazon", "Microsoft"],
    acceptance: 35.7,
    submissions: 11800,
    solutions: 4,
    hints: 4,
    isPremium: true,
    hasVideo: true,
    avgTime: "42 min",
  },
  {
    id: 6,
    title: "Design Search Autocomplete System",
    slug: "design-search-autocomplete-system",
    difficulty: "Hard",
    topics: ["Design", "Trie", "String"],
    companies: ["Google", "Amazon"],
    acceptance: 47.3,
    submissions: 9600,
    solutions: 5,
    hints: 3,
    isPremium: true,
    hasVideo: false,
    avgTime: "48 min",
  },
  {
    id: 7,
    title: "Split Array Largest Sum",
    slug: "split-array-largest-sum",
    difficulty: "Hard",
    topics: ["Binary Search", "Dynamic Programming", "Greedy"],
    companies: ["Meta", "Apple"],
    acceptance: 52.6,
    submissions: 14300,
    solutions: 7,
    hints: 5,
    isPremium: true,
    hasVideo: true,
    avgTime: "38 min",
  },
  {
    id: 8,
    title: "Count of Range Sum",
    slug: "count-of-range-sum",
    difficulty: "Hard",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Microsoft"],
    acceptance: 36.9,
    submissions: 7200,
    solutions: 4,
    hints: 3,
    isPremium: true,
    hasVideo: false,
    avgTime: "55 min",
  },
  {
    id: 9,
    title: "Maximum Number of Tasks You Can Assign",
    slug: "maximum-number-of-tasks-you-can-assign",
    difficulty: "Hard",
    topics: ["Array", "Binary Search", "Greedy", "Sorting"],
    companies: ["Amazon", "Netflix"],
    acceptance: 41.2,
    submissions: 6800,
    solutions: 3,
    hints: 4,
    isPremium: true,
    hasVideo: true,
    avgTime: "44 min",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Multiple Approaches",
    description:
      "Learn 3-5 different ways to solve each problem with complexity analysis",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: Lightbulb,
    title: "Progressive Hints",
    description:
      "Get stuck? Use our hint system to nudge you in the right direction",
    color: "text-yellow-500 bg-yellow-500/10",
  },
  {
    icon: Play,
    title: "Video Explanations",
    description: "Watch detailed walkthroughs from FAANG engineers",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "Expert Discussions",
    description:
      "Access discussion forums with detailed explanations and edge cases",
    color: "text-green-500 bg-green-500/10",
  },
  {
    icon: Trophy,
    title: "Real Interview Questions",
    description:
      "Problems asked in actual FAANG interviews in the last 6 months",
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: Target,
    title: "Pattern Recognition",
    description:
      "Learn to identify patterns and choose the right approach quickly",
    color: "text-cyan-500 bg-cyan-500/10",
  },
];

const STATS = [
  { value: "1000+", label: "Premium Problems" },
  { value: "3500+", label: "Solutions" },
  { value: "FAANG", label: "Companies Covered" },
  { value: "95%", label: "Success Rate" },
];

export function PremiumQuestions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const filteredProblems = PREMIUM_PROBLEMS.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesDifficulty =
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    const matchesCompany =
      selectedCompany === "all" || problem.companies.includes(selectedCompany);
    const matchesTopic =
      selectedTopic === "all" ||
      problem.topics.some((topic) => topic === selectedTopic);

    return matchesSearch && matchesDifficulty && matchesCompany && matchesTopic;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500 border-green-500/50 bg-green-500/10";
      case "Medium":
        return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
      case "Hard":
        return "text-red-500 border-red-500/50 bg-red-500/10";
      default:
        return "text-gray-500 border-gray-500/50 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1800px] mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <BookMarked className="h-4 w-4" />
              My Progress
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto px-6 py-12 md:py-20 max-w-[1800px]">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm font-medium mb-6">
            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
            FAANG-Level Problems
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Premium{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Access 1000+ exclusive FAANG-level problems with detailed solutions,
            hints, and multiple approaches. Master the patterns that matter.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search problems by title or topic..."
                className="pl-10 pr-4 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          {STATS.map((stat, idx) => (
            <Card
              key={idx}
              className="text-center border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all"
            >
              <CardContent className="pt-6 pb-6">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Companies Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Problems by Company
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {COMPANIES.map((company, idx) => (
              <Card
                key={idx}
                className="group cursor-pointer border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3"><img src={company.logo} alt={`${company.name} logo`} className={`${company.style || "mx-auto h-10 w-10 "}`} /></div>
                  <h3 className="font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {company.count} problems
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Premium Questions?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Go beyond basic problems with enterprise-grade solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg transition-all group"
                >
                  <CardContent className="pt-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Topics Tags */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Browse by Topic</h2>
          <div className="flex flex-wrap gap-3">
            {TOPICS.map((topic) => (
              <Badge
                key={topic.id}
                variant="secondary"
                className={`${topic.color} cursor-pointer hover:opacity-80 transition-opacity px-4 py-2 text-sm`}
              >
                {topic.name}
                <span className="ml-2 opacity-70">({topic.count})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Problems List */}
        <div className="mb-16">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Premium Problems</h2>
                <p className="text-muted-foreground">
                  Curated collection of FAANG interview questions
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {COMPANIES.map((company) => (
                      <SelectItem key={company.name} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="w-[160px]">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[180px]">
                    <Code2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic.id} value={topic.name}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsList className="mb-6">
              <TabsTrigger value="all">All Problems</TabsTrigger>
              <TabsTrigger value="video">With Video</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {filteredProblems.map((problem, idx) => (
                  <Card
                    key={problem.id}
                    className="group border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-sm font-bold">
                              #{idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                                  {problem.title}
                                </h3>
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                                {problem.hasVideo && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Play className="h-3 w-3" />
                                    Video
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <Badge
                                  variant="outline"
                                  className={getDifficultyColor(
                                    problem.difficulty
                                  )}
                                >
                                  {problem.difficulty}
                                </Badge>

                                {problem.topics.slice(0, 3).map((topic, i) => (
                                  <Badge key={i} variant="secondary">
                                    {topic}
                                  </Badge>
                                ))}

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    {problem.acceptance}%
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {(problem.submissions / 1000).toFixed(1)}k
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {problem.avgTime}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Asked by:
                                </span>
                                {problem.companies.map((company, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            className="gap-2 flex-1 md:flex-initial"
                            onClick={() =>
                              navigate(
                                `workspace?${problem.slug}&problemId=${problem.id}&deficulty=${problem.difficulty}`
                              )
                            }
                          >
                            <Code2 className="h-4 w-4" />
                            Solve
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2 flex-1 md:flex-initial"
                          >
                            <FileCode className="h-4 w-4" />
                            {problem.solutions} Solutions
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            {problem.hints} Hints Available
                          </span>
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            Editorial Available
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-blue-500 hover:text-blue-600"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-0">
              <div className="space-y-4">
                {filteredProblems
                  .filter((p) => p.hasVideo)
                  .map((problem, idx) => (
                    <Card
                      key={problem.id}
                      className="group border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-sm font-bold">
                                #{idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                                    {problem.title}
                                  </h3>
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Premium
                                  </Badge>
                                  <Badge variant="secondary" className="gap-1">
                                    <Play className="h-3 w-3" />
                                    Video
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  <Badge
                                    variant="outline"
                                    className={getDifficultyColor(
                                      problem.difficulty
                                    )}
                                  >
                                    {problem.difficulty}
                                  </Badge>

                                  {problem.topics
                                    .slice(0, 3)
                                    .map((topic, i) => (
                                      <Badge key={i} variant="secondary">
                                        {topic}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2">
                            <Button className="gap-2 flex-1 md:flex-initial">
                              <Code2 className="h-4 w-4" />
                              Solve
                            </Button>
                            <Button
                              variant="outline"
                              className="gap-2 flex-1 md:flex-initial"
                            >
                              <Play className="h-4 w-4" />
                              Watch
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <div className="space-y-4">
                {filteredProblems.slice(0, 5).map((problem) => (
                  <Card
                    key={problem.id}
                    className="group border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                          <TrendingUp className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                              {problem.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getDifficultyColor(problem.difficulty)}
                            >
                              {problem.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Trending in {problem.companies.join(", ")}{" "}
                            interviews
                          </p>
                        </div>
                        <Button className="gap-2">
                          <Code2 className="h-4 w-4" />
                          Solve Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Learning Path CTA */}
        <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">
                  <Award className="h-3 w-3 mr-1" />
                  Structured Preparation
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Follow a Proven Interview Path
                </h2>
                <p className="text-muted-foreground mb-6">
                  Our curated problem sets are organized by company, difficulty,
                  and pattern. Follow a structured path from basics to advanced
                  topics.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Company-specific problem lists</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Pattern-based learning approach</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Progress tracking and analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Interview simulation mode</span>
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  Explore Learning Paths
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-10 w-10 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold mb-1">1000+</div>
                    <div className="text-sm text-muted-foreground">
                      Problems
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Target className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold mb-1">50+</div>
                    <div className="text-sm text-muted-foreground">
                      Patterns
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold mb-1">30K+</div>
                    <div className="text-sm text-muted-foreground">Solved</div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Star className="h-10 w-10 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold mb-1">4.9</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Ace Your Interviews?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unlock all premium problems with detailed solutions, video
              explanations, and personalized learning paths. Join 30,000+
              developers who landed offers at top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Upgrade to Premium
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Trophy className="h-5 w-5" />
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              30-day money-back guarantee • Cancel anytime • Instant access
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
