import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Input } from "@repo/ui/input";
import {
  ChevronLeft,
  Search,
  BookOpen,
  FileText,
  Code2,
  Download,
  Star,
  Clock,
  TrendingUp,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Filter,
  BookMarked,
  Lightbulb,
  Target,
  Award,
  Sparkles,
  Play,
  Lock,
  Grid3x3,
  Pointer,
  Layers,
  Network,
  GitBranch,
  Binary,
  Repeat,
  DollarSign,
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
const TOPICS = [
  {
    id: 1,
    name: "Arrays & Hashing",
    icon: Grid3x3,
    count: 45,
    difficulty: "Easy to Hard",
    color: "from-blue-500/20",
  },
  {
    id: 2,
    name: "Two Pointers",
    icon: Pointer,
    count: 28,
    difficulty: "Easy to Medium",
    color: "from-green-500/20",
  },
  {
    id: 3,
    name: "Sliding Window",
    icon: Layers,
    count: 32,
    difficulty: "Medium",
    color: "from-purple-500/20",
  },
  {
    id: 4,
    name: "Stack & Queue",
    icon: BookOpen,
    count: 38,
    difficulty: "Easy to Hard",
    color: "from-orange-500/20",
  },
  {
    id: 5,
    name: "Binary Search",
    icon: Search,
    count: 35,
    difficulty: "Medium to Hard",
    color: "from-cyan-500/20",
  },
  {
    id: 6,
    name: "Linked List",
    icon: GitBranch,
    count: 30,
    difficulty: "Easy to Medium",
    color: "from-pink-500/20",
  },
  {
    id: 7,
    name: "Trees",
    icon: Network,
    count: 52,
    difficulty: "Medium to Hard",
    color: "from-green-500/20",
  },
  {
    id: 8,
    name: "Graphs",
    icon: Network,
    count: 48,
    difficulty: "Hard",
    color: "from-red-500/20",
  },
  {
    id: 9,
    name: "Dynamic Programming",
    icon: Target,
    count: 65,
    difficulty: "Hard",
    color: "from-yellow-500/20",
  },
  {
    id: 10,
    name: "Backtracking",
    icon: Repeat,
    count: 25,
    difficulty: "Medium to Hard",
    color: "from-indigo-500/20",
  },
  {
    id: 11,
    name: "Greedy",
    icon: DollarSign,
    count: 30,
    difficulty: "Medium",
    color: "from-emerald-500/20",
  },
  {
    id: 12,
    name: "Bit Manipulation",
    icon: Binary,
    count: 18,
    difficulty: "Easy to Medium",
    color: "from-violet-500/20",
  },
];

const FEATURED_NOTES = [
  {
    id: 1,
    title: "Complete Graph Algorithms Guide",
    description:
      "Master BFS, DFS, Dijkstra, and more with detailed explanations and code examples",
    topic: "Graphs",
    difficulty: "Hard",
    pages: 87,
    rating: 4.9,
    downloads: 12500,
    isPremium: true,
    thumbnail: "from-blue-500/20",
  },
  {
    id: 2,
    title: "Dynamic Programming Patterns",
    description:
      "Learn the 15 most common DP patterns with step-by-step solutions",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    pages: 120,
    rating: 4.8,
    downloads: 15200,
    isPremium: true,
    thumbnail: "from-purple-500/20",
  },
  {
    id: 3,
    title: "Tree Traversals Masterclass",
    description:
      "In-order, pre-order, post-order, and level-order traversals explained",
    topic: "Trees",
    difficulty: "Medium",
    pages: 45,
    rating: 4.7,
    downloads: 8900,
    isPremium: true,
    thumbnail: "from-green-500/20",
  },
  {
    id: 4,
    title: "System Design for DSA",
    description: "Apply DSA concepts to real-world system design interviews",
    topic: "Advanced",
    difficulty: "Hard",
    pages: 95,
    rating: 4.9,
    downloads: 11300,
    isPremium: true,
    thumbnail: "from-orange-500/20",
  },
  {
    id: 5,
    title: "Sliding Window Techniques",
    description:
      "Master variable and fixed sliding window patterns with 50+ problems",
    topic: "Sliding Window",
    difficulty: "Medium",
    pages: 62,
    rating: 4.6,
    downloads: 9800,
    isPremium: true,
    thumbnail: "from-cyan-500/20",
  },
  {
    id: 6,
    title: "Binary Search Deep Dive",
    description:
      "From basic to advanced: binary search on arrays, search space, and more",
    topic: "Binary Search",
    difficulty: "Medium",
    pages: 55,
    rating: 4.8,
    downloads: 10200,
    isPremium: true,
    thumbnail: "from-pink-500/20",
  },
];

const CHEAT_SHEETS = [
  {
    id: 1,
    title: "Time & Space Complexity",
    description: "Big O notation reference",
    icon: Clock,
  },
  {
    id: 2,
    title: "Common Patterns",
    description: "Problem-solving templates",
    icon: Target,
  },
  {
    id: 3,
    title: "Interview Tips",
    description: "FAANG interview strategies",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "Code Snippets",
    description: "Ready-to-use implementations",
    icon: Code2,
  },
];

const STATS = [
  { value: "500+", label: "Study Notes" },
  { value: "50K+", label: "Downloads" },
  { value: "12", label: "Topic Categories" },
  { value: "4.8★", label: "Average Rating" },
];

export function PremiumDSANotes() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const filteredNotes = FEATURED_NOTES.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || note.difficulty === selectedDifficulty;
    const matchesTopic =
      selectedTopic === "all" || note.topic === selectedTopic;

    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              My Downloads
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm font-medium mb-6">
            <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
            Premium Study Material
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Grind DSA{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Notes & Resources
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Comprehensive study materials, cheat sheets, and resources curated
            by FAANG engineers to ace your coding interviews
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes, topics, or concepts..."
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

        {/* Topics Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Browse by Topic</h2>
              <p className="text-muted-foreground">
                Select a topic to explore curated notes and resources
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.id}
                  className="group cursor-pointer border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div
                      className={`aspect-square bg-gradient-to-br ${topic.color} to-transparent rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-12 w-12 text-foreground/70" />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {topic.count} resources
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {topic.difficulty}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Filters and Featured Notes */}
        <div className="mb-16">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Notes</h2>
                <p className="text-muted-foreground">
                  Hand-picked study materials from top performers
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Topics" />
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

                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="w-[180px]">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsList className="mb-6">
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="premium">Premium Only</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-xl transition-all"
                  >
                    <div
                      className={`h-32 bg-gradient-to-br ${note.thumbnail} to-transparent flex items-center justify-center relative`}
                    >
                      <FileText className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                      {note.isPremium && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary">{note.topic}</Badge>
                        <Badge
                          variant={
                            note.difficulty === "Easy"
                              ? "secondary"
                              : note.difficulty === "Medium"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {note.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-500 transition-colors">
                        {note.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {note.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {note.pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {note.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {(note.downloads / 1000).toFixed(1)}k
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2" size="sm">
                          <Play className="h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={note.isPremium}
                        >
                          {note.isPremium ? (
                            <>
                              <Lock className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="premium" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes
                  .filter((note) => note.isPremium)
                  .map((note) => (
                    <Card
                      key={note.id}
                      className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-xl transition-all"
                    >
                      <div
                        className={`h-32 bg-gradient-to-br ${note.thumbnail} to-transparent flex items-center justify-center relative`}
                      >
                        <FileText className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary">{note.topic}</Badge>
                          <Badge
                            variant={
                              note.difficulty === "Easy"
                                ? "secondary"
                                : note.difficulty === "Medium"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {note.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-500 transition-colors">
                          {note.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {note.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {note.pages} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {note.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {(note.downloads / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1 gap-2" size="sm">
                            <Play className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="free" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes
                  .filter((note) => !note.isPremium)
                  .map((note) => (
                    <Card
                      key={note.id}
                      className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-xl transition-all"
                    >
                      <div
                        className={`h-32 bg-gradient-to-br ${note.thumbnail} to-transparent flex items-center justify-center relative`}
                      >
                        <FileText className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary">{note.topic}</Badge>
                          <Badge
                            variant={
                              note.difficulty === "Easy"
                                ? "secondary"
                                : note.difficulty === "Medium"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {note.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-500 transition-colors">
                          {note.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {note.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {note.pages} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {note.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {(note.downloads / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1 gap-2" size="sm">
                            <Play className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Reference Cheat Sheets */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Quick Reference Sheets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHEAT_SHEETS.map((sheet) => {
              const Icon = sheet.icon;
              return (
                <Card
                  key={sheet.id}
                  className="group cursor-pointer border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-500/10 text-blue-500 mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold mb-2">{sheet.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {sheet.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Study Path Section */}
        <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">
                  <Award className="h-3 w-3 mr-1" />
                  Structured Learning
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Follow a Guided Study Path
                </h2>
                <p className="text-muted-foreground mb-6">
                  Our curated learning paths help you master DSA systematically.
                  Start from basics and progress to advanced topics with
                  confidence.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Step-by-step progression</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Practice problems aligned with topics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Track your learning progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>FAANG interview focused</span>
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  View Study Paths
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Target className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold mb-1">12</div>
                    <div className="text-sm text-muted-foreground">
                      Learning Paths
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-10 w-10 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold mb-1">350+</div>
                    <div className="text-sm text-muted-foreground">
                      Resources
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold mb-1">25K+</div>
                    <div className="text-sm text-muted-foreground">
                      Active Learners
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Star className="h-10 w-10 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold mb-1">4.9</div>
                    <div className="text-sm text-muted-foreground">
                      Avg Rating
                    </div>
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
              Unlock Premium DSA Resources
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get unlimited access to all premium notes, cheat sheets, video
              explanations, and personalized study paths. Join 50,000+ students
              who landed their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Upgrade to Premium
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <BookMarked className="h-5 w-5" />
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              30-day money-back guarantee • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
