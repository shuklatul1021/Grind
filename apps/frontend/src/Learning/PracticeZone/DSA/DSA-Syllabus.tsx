import { useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronRight,
  Code2,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@repo/ui/card";

const DSA_SECTIONS = [
  {
    section: "Basics & Complexity",
    description:
      "Time complexity, space complexity, and basic programming constructs.",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    topics: [
      {
        title: "Time Complexity & Space Complexity",
        link: "/learning/practice/dsa/time-space-complexity",
        difficulty: "Easy",
      },
      {
        title: "Bit Manipulation",
        link: "/learning/practice/dsa/bit-manipulation",
        difficulty: "Medium",
      },
      {
        title: "Mathematics",
        link: "/learning/practice/dsa/mathematics",
        difficulty: "Easy",
      },
      {
        title: "Recursion",
        link: "/learning/practice/dsa/recursion",
        difficulty: "Medium",
      },
    ],
  },
  {
    section: "Sorting & Searching",
    description: "Sorting algorithms and searching techniques.",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    topics: [
      {
        title: "Sorting Algorithms",
        link: "/learning/practice/dsa/sorting",
        difficulty: "Medium",
      },
      {
        title: "Binary Search",
        link: "/learning/practice/dsa/binary-search",
        difficulty: "Medium",
      },
      {
        title: "Ternary Search",
        link: "/learning/practice/dsa/ternary-search",
        difficulty: "Hard",
      },
    ],
  },
  {
    section: "Arrays",
    description: "1D and 2D arrays, sliding window, prefix sum, and more.",
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    topics: [
      {
        title: "1D Arrays",
        link: "/learning/practice/dsa/arrays-1d",
        difficulty: "Easy",
      },
      {
        title: "2D Arrays",
        link: "/learning/practice/dsa/arrays-2d",
        difficulty: "Medium",
      },
      {
        title: "Sliding Window",
        link: "/learning/practice/dsa/sliding-window",
        difficulty: "Medium",
      },
      {
        title: "Prefix Sum",
        link: "/learning/practice/dsa/prefix-sum",
        difficulty: "Medium",
      },
      {
        title: "Kadane's Algorithm",
        link: "/learning/practice/dsa/kadanes",
        difficulty: "Medium",
      },
    ],
  },
  {
    section: "Strings",
    description: "String manipulation, pattern matching, and related problems.",
    color: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-amber-500/10",
    topics: [
      {
        title: "String Basics",
        link: "/learning/practice/dsa/strings-basics",
        difficulty: "Easy",
      },
      {
        title: "Pattern Matching",
        link: "/learning/practice/dsa/pattern-matching",
        difficulty: "Medium",
      },
      {
        title: "KMP Algorithm",
        link: "/learning/practice/dsa/kmp",
        difficulty: "Hard",
      },
      {
        title: "Rabin-Karp Algorithm",
        link: "/learning/practice/dsa/rabin-karp",
        difficulty: "Hard",
      },
    ],
  },
  {
    section: "Linked Lists",
    description: "Singly and doubly linked lists, cycle detection, and more.",
    color: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-500/10 to-cyan-500/10",
    topics: [
      {
        title: "Singly Linked List",
        link: "/learning/practice/dsa/singly-linked-list",
        difficulty: "Easy",
      },
      {
        title: "Doubly Linked List",
        link: "/learning/practice/dsa/doubly-linked-list",
        difficulty: "Medium",
      },
      {
        title: "Cycle Detection",
        link: "/learning/practice/dsa/cycle-detection",
        difficulty: "Medium",
      },
      {
        title: "Reverse Linked List",
        link: "/learning/practice/dsa/reverse-list",
        difficulty: "Easy",
      },
    ],
  },
  {
    section: "Stacks & Queues",
    description: "Stack and queue data structures with their applications.",
    color: "from-red-500 to-rose-500",
    bgGradient: "from-red-500/10 to-rose-500/10",
    topics: [
      {
        title: "Stack Basics",
        link: "/learning/practice/dsa/stack-basics",
        difficulty: "Easy",
      },
      {
        title: "Queue Basics",
        link: "/learning/practice/dsa/queue-basics",
        difficulty: "Easy",
      },
      {
        title: "Monotonic Stack",
        link: "/learning/practice/dsa/monotonic-stack",
        difficulty: "Medium",
      },
      {
        title: "Priority Queue",
        link: "/learning/practice/dsa/priority-queue",
        difficulty: "Medium",
      },
    ],
  },
  {
    section: "Trees",
    description: "Binary trees, BST, AVL trees, and tree traversals.",
    color: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    topics: [
      {
        title: "Binary Tree Basics",
        link: "/learning/practice/dsa/binary-tree",
        difficulty: "Easy",
      },
      {
        title: "Binary Search Tree",
        link: "/learning/practice/dsa/bst",
        difficulty: "Medium",
      },
      {
        title: "Tree Traversals",
        link: "/learning/practice/dsa/tree-traversals",
        difficulty: "Easy",
      },
      {
        title: "AVL Trees",
        link: "/learning/practice/dsa/avl-trees",
        difficulty: "Hard",
      },
      {
        title: "Segment Trees",
        link: "/learning/practice/dsa/segment-trees",
        difficulty: "Hard",
      },
    ],
  },
  {
    section: "Graphs",
    description:
      "Graph representations, traversals, and shortest path algorithms.",
    color: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    topics: [
      {
        title: "Graph Representation",
        link: "/learning/practice/dsa/graph-representation",
        difficulty: "Easy",
      },
      {
        title: "BFS & DFS",
        link: "/learning/practice/dsa/bfs-dfs",
        difficulty: "Medium",
      },
      {
        title: "Dijkstra's Algorithm",
        link: "/learning/practice/dsa/dijkstra",
        difficulty: "Hard",
      },
      {
        title: "Bellman-Ford",
        link: "/learning/practice/dsa/bellman-ford",
        difficulty: "Hard",
      },
      {
        title: "Minimum Spanning Tree",
        link: "/learning/practice/dsa/mst",
        difficulty: "Hard",
      },
    ],
  },
  {
    section: "Dynamic Programming",
    description: "Memoization, tabulation, and optimization techniques.",
    color: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/10",
    topics: [
      {
        title: "Introduction to DP",
        link: "/learning/practice/dsa/dp-intro",
        difficulty: "Medium",
      },
      {
        title: "1D DP Problems",
        link: "/learning/practice/dsa/dp-1d",
        difficulty: "Medium",
      },
      {
        title: "2D DP Problems",
        link: "/learning/practice/dsa/dp-2d",
        difficulty: "Hard",
      },
      {
        title: "Knapsack Problems",
        link: "/learning/practice/dsa/knapsack",
        difficulty: "Hard",
      },
      {
        title: "LCS & LIS",
        link: "/learning/practice/dsa/lcs-lis",
        difficulty: "Medium",
      },
    ],
  },
  {
    section: "Greedy Algorithms",
    description: "Greedy approach and optimization strategies.",
    color: "from-lime-500 to-green-500",
    bgGradient: "from-lime-500/10 to-green-500/10",
    topics: [
      {
        title: "Activity Selection",
        link: "/learning/practice/dsa/activity-selection",
        difficulty: "Easy",
      },
      {
        title: "Huffman Coding",
        link: "/learning/practice/dsa/huffman",
        difficulty: "Medium",
      },
      {
        title: "Job Sequencing",
        link: "/learning/practice/dsa/job-sequencing",
        difficulty: "Medium",
      },
      {
        title: "Fractional Knapsack",
        link: "/learning/practice/dsa/fractional-knapsack",
        difficulty: "Easy",
      },
    ],
  },
];

export default function DSASyllabus() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hard":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const totalTopics = DSA_SECTIONS.reduce(
    (acc, section) => acc + section.topics.length,
    0
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20" />

        <div className="relative max-w-[1800px] mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Layers className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Data Structures & Algorithms
              </h1>
              <p className="text-white/90 text-lg mt-2">
                Master DSA concepts from basics to advanced topics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{DSA_SECTIONS.length}</p>
                    <p className="text-white/80 text-sm">Main Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalTopics}+</p>
                    <p className="text-white/80 text-sm">Topics Covered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">50K+</p>
                    <p className="text-white/80 text-sm">Students Learning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Complete DSA Curriculum</h2>
          <p className="text-muted-foreground">
            Click on any section to explore topics and begin your learning
            journey
          </p>
        </div>

        <div className="grid gap-6">
          {DSA_SECTIONS.map((section) => (
            <Card
              key={section.section}
              className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                openSection === section.section ? "shadow-xl" : ""
              }`}
            >
              <div
                className={`cursor-pointer bg-gradient-to-r ${section.bgGradient} p-6 transition-all duration-300 hover:opacity-90`}
                onClick={() => handleToggle(section.section)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {openSection === section.section ? (
                      <ChevronDown
                        className={`h-6 w-6 bg-gradient-to-r ${section.color} bg-clip-text text-transparent transition-transform duration-300`}
                      />
                    ) : (
                      <ChevronRight
                        className={`h-6 w-6 bg-gradient-to-r ${section.color} bg-clip-text text-transparent transition-transform duration-300`}
                      />
                    )}
                    <div>
                      <h3
                        className={`text-xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}
                      >
                        {section.section}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${section.color} text-white font-semibold text-sm`}
                  >
                    {section.topics.length} Topics
                  </div>
                </div>
              </div>

              {openSection === section.section && (
                <CardContent className="p-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.topics.map((topic) => (
                      <div
                        key={topic.title}
                        onClick={() => navigate(topic.link)}
                        className="group cursor-pointer rounded-xl border-2 border-border hover:border-primary/50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${section.color} mt-1.5`}
                          />
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(topic.difficulty)}`}
                          >
                            {topic.difficulty}
                          </span>
                        </div>
                        <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {topic.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-2">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Start Your DSA Journey Today
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of students mastering data structures and
                  algorithms
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                  <div className="flex justify-center mb-3">
                    <Code2 className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-600 mb-1">
                    {DSA_SECTIONS.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                  <div className="flex justify-center mb-3">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-1">
                    {totalTopics}+
                  </p>
                  <p className="text-sm text-muted-foreground">Topics</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                  <div className="flex justify-center mb-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">1500+</p>
                  <p className="text-sm text-muted-foreground">
                    Practice Problems
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                  <div className="flex justify-center mb-3">
                    <Users className="h-8 w-8 text-pink-600" />
                  </div>
                  <p className="text-3xl font-bold text-pink-600 mb-1">50K+</p>
                  <p className="text-sm text-muted-foreground">
                    Active Learners
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
