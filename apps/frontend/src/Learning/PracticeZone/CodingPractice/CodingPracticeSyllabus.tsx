import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Card, CardContent } from "@repo/ui/card";
import {
  Code2,
  ChevronDown,
  ChevronRight,
  Target,
  BookOpen,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CODING_TOPICS = [
  {
    title: "Arrays",
    description:
      "Solve problems involving arrays, traversals, and manipulations.",
    difficulty: "Easy",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    subtopics: [
      { title: "1D Arrays", link: "/learning/practice/coding/arrays?1d" },
      { title: "2D Arrays", link: "/learning/practice/coding/arrays?2d" },
      {
        title: "Sliding Window",
        link: "/learning/practice/coding/arrays?sliding-window",
      },
      {
        title: "Two Pointers",
        link: "/learning/practice/coding/arrays?two-pointers",
      },
    ],
  },
  {
    title: "Strings",
    description:
      "Work with string manipulation, searching, and pattern matching.",
    difficulty: "Easy",
    color: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
    subtopics: [
      {
        title: "String Reversal",
        link: "/learning/practice/coding/strings?reversal",
      },
      {
        title: "Pattern Matching",
        link: "/learning/practice/coding/strings?pattern-matching",
      },
      {
        title: "Palindromes",
        link: "/learning/practice/coding/strings?palindromes",
      },
    ],
  },
  {
    title: "Linked Lists",
    description:
      "Implement and solve problems using singly and doubly linked lists.",
    difficulty: "Medium",
    color: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/20",
    subtopics: [
      {
        title: "Singly Linked List",
        link: "/learning/practice/coding/linked-lists?singly",
      },
      {
        title: "Doubly Linked List",
        link: "/learning/practice/coding/linked-lists?doubly",
      },
      {
        title: "Circular Linked List",
        link: "/learning/practice/coding/linked-lists?circular",
      },
    ],
  },
  {
    title: "Stacks & Queues",
    description: "Master stack and queue operations and their applications.",
    difficulty: "Medium",
    color: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-500/20",
    subtopics: [
      {
        title: "Stack Operations",
        link: "/learning/practice/coding/stacks?operations",
      },
      {
        title: "Queue Operations",
        link: "/learning/practice/coding/queues?operations",
      },
      {
        title: "Priority Queue",
        link: "/learning/practice/coding/queues?priority",
      },
    ],
  },
  {
    title: "Trees",
    description: "Work with binary trees, BST, and tree traversal algorithms.",
    difficulty: "Medium",
    color: "from-teal-500/10 to-cyan-500/10",
    borderColor: "border-teal-500/20",
    subtopics: [
      { title: "Binary Tree", link: "/learning/practice/coding/trees?binary" },
      {
        title: "Binary Search Tree",
        link: "/learning/practice/coding/trees?bst",
      },
      {
        title: "Tree Traversals",
        link: "/learning/practice/coding/trees?traversals",
      },
    ],
  },
  {
    title: "Graphs",
    description: "Solve graph problems including BFS, DFS, and shortest paths.",
    difficulty: "Hard",
    color: "from-red-500/10 to-pink-500/10",
    borderColor: "border-red-500/20",
    subtopics: [
      {
        title: "Graph Representation",
        link: "/learning/practice/coding/graphs?representation",
      },
      { title: "BFS & DFS", link: "/learning/practice/coding/graphs?bfs-dfs" },
      {
        title: "Shortest Path",
        link: "/learning/practice/coding/graphs?shortest-path",
      },
    ],
  },
];

export default function CodingPracticeSyllabus() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);

  const handleToggle = (title: string) => {
    setOpen((prev) => (prev === title ? null : title));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600";
      case "Hard":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 shadow-lg">
                <Code2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-green-500/15 to-emerald-500/15 text-green-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Coding Practice
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Coding Practice Syllabus
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master data structures and algorithms with comprehensive practice
              problems organized by topic and difficulty.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            Click on any topic to expand and see subtopics
          </p>
        </div>

        <div className="space-y-4">
          {CODING_TOPICS.map((topic) => (
            <Card
              key={topic.title}
              className="border-border/40 overflow-hidden hover:shadow-lg transition-all"
            >
              <div
                className={`flex items-center justify-between cursor-pointer p-6 bg-gradient-to-r ${topic.color} hover:from-opacity-80 hover:to-opacity-80 transition-all group`}
                onClick={() => handleToggle(topic.title)}
                tabIndex={0}
                aria-expanded={open === topic.title}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-2 rounded-lg bg-background/50 backdrop-blur border ${topic.borderColor} group-hover:scale-110 transition-transform`}
                  >
                    {open === topic.title ? (
                      <ChevronDown className="h-5 w-5 text-green-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold">{topic.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {topic.subtopics.length} subtopics
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${getDifficultyColor(topic.difficulty)} border-0 font-semibold`}
                >
                  {topic.difficulty}
                </Badge>
              </div>

              {open === topic.title && topic.subtopics && (
                <CardContent className="p-6 pt-0 animate-in slide-in-from-top-2">
                  <div className="bg-muted/30 rounded-xl p-6 border border-border/40">
                    <div className="grid md:grid-cols-2 gap-3">
                      {topic.subtopics.map((sub) => (
                        <div
                          key={sub.title}
                          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-background border border-transparent hover:border-green-500/30 cursor-pointer transition-all hover:shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(sub.link);
                          }}
                        >
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
                          <span className="text-sm font-medium group-hover:text-green-500 transition-colors">
                            {sub.title}
                          </span>
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <Card className="border-border/40 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <Code2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold text-green-500">
                {CODING_TOPICS.length}
              </div>
              <div className="text-sm text-muted-foreground">Main Topics</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold text-blue-500">
                {CODING_TOPICS.reduce(
                  (acc, topic) => acc + topic.subtopics.length,
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Subtopics</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-3xl font-bold text-purple-500">800+</div>
              <div className="text-sm text-muted-foreground">
                Practice Problems
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-orange-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-3xl font-bold text-orange-500">15K+</div>
              <div className="text-sm text-muted-foreground">
                Students Practicing
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
