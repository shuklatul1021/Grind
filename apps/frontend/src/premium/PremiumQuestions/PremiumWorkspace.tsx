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
import { Textarea } from "@repo/ui/textarea";
import CodeEditor from "./PremiumCodeEditor";
import {
  ChevronLeft,
  Play,
  Save,
  RotateCcw,
  Lightbulb,
  Video,
  MessageSquare,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  Settings,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Brain,
  Trophy,
  TrendingUp,
  Copy,
  Check,
  AlertCircle,
  Terminal,
  FileCode,
  ListChecks,
  Zap,
  Target,
  Share2,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/resizable";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Separator } from "@repo/ui/separator";

// Mock Data
const PROBLEM = {
  id: 1,
  title: "Design In-Memory File System",
  difficulty: "Hard",
  topics: ["Design", "Hash Table", "Trie", "String"],
  companies: ["Google", "Amazon", "Meta"],
  acceptance: 45.2,
  likes: 2847,
  dislikes: 142,
  description: `Design a data structure that simulates an in-memory file system.

Implement the FileSystem class:

• FileSystem() Initializes the object of the system.
• List<String> ls(String path) If path is a file path, returns a list that only contains this file's name. If path is a directory path, returns the list of file and directory names in this directory.
• void mkdir(String path) Makes a new directory according to the given path. The given directory path does not exist. If the middle directories in the path do not exist, you should create them as well.
• void addContentToFile(String filePath, String content) If filePath does not exist, creates that file containing given content. If filePath already exists, appends the given content to original content.
• String readContentFromFile(String filePath) Returns the content in the file at filePath.`,
  examples: [
    {
      input: `["FileSystem", "ls", "mkdir", "addContentToFile", "ls", "readContentFromFile"]
[[], ["/"], ["/a/b/c"], ["/a/b/c/d", "hello"], ["/"], ["/a/b/c/d"]]`,
      output: `[null, [], null, null, ["a"], "hello"]`,
      explanation: `FileSystem fileSystem = new FileSystem();
fileSystem.ls("/");                         // return []
fileSystem.mkdir("/a/b/c");
fileSystem.addContentToFile("/a/b/c/d", "hello");
fileSystem.ls("/");                         // return ["a"]
fileSystem.readContentFromFile("/a/b/c/d"); // return "hello"`,
    },
  ],
  constraints: [
    "1 <= path.length, filePath.length <= 100",
    "path and filePath are absolute paths which begin with '/' and do not end with '/' except that the path is just '/'.",
    "You can assume that all directory names and file names only contain lowercase letters, and the same names won't exist in the same directory.",
    "You can assume that all operations will be passed valid parameters.",
    "At most 104 calls will be made to ls, mkdir, addContentToFile, and readContentFromFile.",
  ],
  hints: [
    "Think about how you can represent the file system structure using a tree or trie.",
    "Each node can represent either a file or a directory. How would you differentiate between them?",
    "For the ls operation, you need to sort the results. How can you maintain sorted order efficiently?",
    "Consider using a HashMap to store children nodes for quick access.",
  ],
  approaches: [
    {
      title: "HashMap + Trie Approach",
      timeComplexity: "O(n) for each operation",
      spaceComplexity: "O(n) where n is total number of files and directories",
      description:
        "Use a trie-like structure where each node contains a HashMap of children and a boolean to indicate if it's a file.",
    },
    {
      title: "Nested HashMap Approach",
      timeComplexity: "O(n) for each operation",
      spaceComplexity: "O(n)",
      description:
        "Use nested HashMaps to represent the directory structure, with special handling for file content.",
    },
    {
      title: "Custom Tree Structure",
      timeComplexity: "O(n) for each operation",
      spaceComplexity: "O(n)",
      description:
        "Create a custom tree node class with children list and content field for files.",
    },
  ],
  starterCode: {
    javascript: `class FileSystem {
    constructor() {
        // Your code here
    }
    
    ls(path) {
        // Your code here
    }
    
    mkdir(path) {
        // Your code here
    }
    
    addContentToFile(filePath, content) {
        // Your code here
    }
    
    readContentFromFile(filePath) {
        // Your code here
    }
}`,
    python: `class FileSystem:
    def __init__(self):
        # Your code here
        pass
    
    def ls(self, path: str) -> List[str]:
        # Your code here
        pass
    
    def mkdir(self, path: str) -> None:
        # Your code here
        pass
    
    def addContentToFile(self, filePath: str, content: str) -> None:
        # Your code here
        pass
    
    def readContentFromFile(self, filePath: str) -> str:
        # Your code here
        pass`,
    java: `class FileSystem {
    public FileSystem() {
        // Your code here
    }
    
    public List<String> ls(String path) {
        // Your code here
        return new ArrayList<>();
    }
    
    public void mkdir(String path) {
        // Your code here
    }
    
    public void addContentToFile(String filePath, String content) {
        // Your code here
    }
    
    public String readContentFromFile(String filePath) {
        // Your code here
        return "";
    }
}`,
    cpp: `class FileSystem {
public:
    FileSystem() {
        // Your code here
    }
    
    vector<string> ls(string path) {
        // Your code here
        return {};
    }
    
    void mkdir(string path) {
        // Your code here
    }
    
    void addContentToFile(string filePath, string content) {
        // Your code here
    }
    
    string readContentFromFile(string filePath) {
        // Your code here
        return "";
    }
};`,
  },
};

const TEST_CASES = [
  {
    id: 1,
    input: `["FileSystem", "ls", "mkdir", "ls"]
[[], ["/"], ["/a/b/c"], ["/"]]`,
    expected: `[null, [], null, ["a"]]`,
    passed: null,
  },
  {
    id: 2,
    input: `["FileSystem", "mkdir", "addContentToFile", "readContentFromFile"]
[[], ["/a/b/c"], ["/a/b/c/d", "hello world"], ["/a/b/c/d"]]`,
    expected: `[null, null, null, "hello world"]`,
    passed: null,
  },
  {
    id: 3,
    input: `["FileSystem", "ls", "mkdir", "addContentToFile", "ls", "readContentFromFile"]
[[], ["/"], ["/a/b/c"], ["/a/b/c/d", "hello"], ["/"], ["/a/b/c/d"]]`,
    expected: `[null, [], null, null, ["a"], "hello"]`,
    passed: null,
  },
];

const SOLUTIONS = [
  {
    id: 1,
    title: "HashMap + Trie Solution",
    language: "python",
    votes: 1245,
    author: "FAANG Engineer",
    code: `class Node:
    def __init__(self):
        self.children = {}
        self.content = ""
        self.isFile = False

class FileSystem:
    def __init__(self):
        self.root = Node()
    
    def ls(self, path: str) -> List[str]:
        node = self.root
        if path != "/":
            parts = path.split("/")[1:]
            for part in parts:
                node = node.children[part]
        
        if node.isFile:
            return [path.split("/")[-1]]
        
        return sorted(node.children.keys())
    
    def mkdir(self, path: str) -> None:
        node = self.root
        parts = path.split("/")[1:]
        for part in parts:
            if part not in node.children:
                node.children[part] = Node()
            node = node.children[part]
    
    def addContentToFile(self, filePath: str, content: str) -> None:
        node = self.root
        parts = filePath.split("/")[1:]
        for part in parts:
            if part not in node.children:
                node.children[part] = Node()
            node = node.children[part]
        node.isFile = True
        node.content += content
    
    def readContentFromFile(self, filePath: str) -> str:
        node = self.root
        parts = filePath.split("/")[1:]
        for part in parts:
            node = node.children[part]
        return node.content`,
  },
];

export function PremiumWorkspace() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEM.starterCode[language as keyof typeof PROBLEM.starterCode]
  );
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(TEST_CASES);
  const [activeTab, setActiveTab] = useState("description");
  const [showHints, setShowHints] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(PROBLEM.starterCode[newLang as keyof typeof PROBLEM.starterCode]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      const newResults = testResults.map((test, idx) => ({
        ...test,
        passed: Math.random() > 0.3, // Random pass/fail for demo
      }));
      setTestResults(newResults);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    alert("Code submitted successfully! This would send to backend.");
  };

  const handleReset = () => {
    setCode(PROBLEM.starterCode[language as keyof typeof PROBLEM.starterCode]);
    setTestResults(TEST_CASES);
  };

  const toggleHint = (index: number) => {
    setShowHints((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500 bg-green-500/10 border-green-500/50";
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/50";
      case "Hard":
        return "text-red-500 bg-red-500/10 border-red-500/50";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/50";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 -ml-2"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold">{PROBLEM.title}</h1>
              <Badge
                variant="outline"
                className={`${getDifficultyColor(PROBLEM.difficulty)} font-medium`}
              >
                {PROBLEM.difficulty}
              </Badge>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 font-medium">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Trophy className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-muted/20">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col"
              >
                <div className="border-b border-border/40 px-6 bg-background/50 backdrop-blur">
                  <TabsList className="w-full justify-start h-12 bg-transparent">
                    <TabsTrigger
                      value="description"
                      className="gap-2 data-[state=active]:bg-background"
                    >
                      <BookOpen className="h-4 w-4" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="solutions"
                      className="gap-2 data-[state=active]:bg-background"
                    >
                      <Code2 className="h-4 w-4" />
                      Solutions ({SOLUTIONS.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="gap-2 data-[state=active]:bg-background"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hints ({PROBLEM.hints.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="discuss"
                      className="gap-2 data-[state=active]:bg-background"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Discuss
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1">
                  <TabsContent value="description" className="px-6 py-6 mt-0">
                    <div className="space-y-8">
                      {/* Stats */}
                      <div className="flex items-center gap-8 pb-6 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">
                            Acceptance:
                          </span>
                          <span className="text-sm font-semibold">
                            {PROBLEM.acceptance}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-semibold">
                            {PROBLEM.likes}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            likes
                          </span>
                        </div>
                      </div>

                      {/* Topics */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-foreground/90">
                          Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {PROBLEM.topics.map((topic, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="px-3 py-1"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Companies */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-foreground/90">
                          Companies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {PROBLEM.companies.map((company, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="px-3 py-1"
                            >
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-foreground/90">
                          Problem Statement
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                            {PROBLEM.description}
                          </p>
                        </div>
                      </div>

                      {/* Examples */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-foreground/90">
                          Examples
                        </h3>
                        {PROBLEM.examples.map((example, idx) => (
                          <Card
                            key={idx}
                            className="mb-4 border-muted overflow-hidden"
                          >
                            <CardContent className="p-5">
                              <div className="space-y-4">
                                <div>
                                  <div className="text-xs font-semibold mb-2 text-foreground/80">
                                    Input:
                                  </div>
                                  <code className="text-xs bg-muted/40 p-3 rounded-md block overflow-x-auto font-mono">
                                    {example.input}
                                  </code>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold mb-2 text-foreground/80">
                                    Output:
                                  </div>
                                  <code className="text-xs bg-muted/40 p-3 rounded-md block overflow-x-auto font-mono">
                                    {example.output}
                                  </code>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <div className="text-xs font-semibold mb-2 text-foreground/80">
                                      Explanation:
                                    </div>
                                    <p className="text-xs text-muted-foreground whitespace-pre-line leading-6">
                                      {example.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Constraints */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-foreground/90">
                          Constraints
                        </h3>
                        <ul className="space-y-2.5">
                          {PROBLEM.constraints.map((constraint, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-muted-foreground flex items-start gap-3"
                            >
                              <span className="text-blue-500 mt-0.5 font-bold">
                                •
                              </span>
                              <span className="leading-6">{constraint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Approaches */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground/90">
                          <Target className="h-4 w-4 text-blue-500" />
                          Solution Approaches
                        </h3>
                        <div className="space-y-4">
                          {PROBLEM.approaches.map((approach, idx) => (
                            <Card
                              key={idx}
                              className="border-muted overflow-hidden"
                            >
                              <CardHeader className="p-5 pb-4">
                                <CardTitle className="text-sm font-semibold">
                                  {approach.title}
                                </CardTitle>
                                <CardDescription className="text-xs leading-6 mt-2">
                                  {approach.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-5 pt-0">
                                <div className="flex gap-6 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">
                                      Time:
                                    </span>
                                    <span className="font-mono font-medium">
                                      {approach.timeComplexity}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">
                                      Space:
                                    </span>
                                    <span className="font-mono font-medium">
                                      {approach.spaceComplexity}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="solutions" className="p-6 mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Premium Solutions
                        </h3>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Video className="h-4 w-4" />
                          Watch Video
                        </Button>
                      </div>

                      {SOLUTIONS.map((solution) => (
                        <Card
                          key={solution.id}
                          className="border-muted overflow-hidden"
                        >
                          <CardHeader className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-base mb-3">
                                  {solution.title}
                                </CardTitle>
                                <div className="flex items-center gap-5 text-sm">
                                  <span className="text-muted-foreground">
                                    by {solution.author}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span>{solution.votes} votes</span>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="px-2.5 py-0.5"
                                  >
                                    {solution.language}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCode(solution.code)}
                                className="gap-2 shrink-0"
                              >
                                <Copy className="h-4 w-4" />
                                Use
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-5 pt-0">
                            <pre className="text-xs bg-muted/40 p-4 rounded-md overflow-x-auto font-mono">
                              <code>{solution.code}</code>
                            </pre>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="hints" className="p-6 mt-0">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 text-yellow-500 bg-yellow-500/10 p-4 rounded-lg">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm leading-6">
                          Progressive hints to guide you without spoiling the
                          solution
                        </p>
                      </div>

                      {PROBLEM.hints.map((hint, idx) => (
                        <Card
                          key={idx}
                          className="border-muted overflow-hidden"
                        >
                          <CardHeader
                            className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => toggleHint(idx)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500/10 text-yellow-500 font-semibold">
                                  {idx + 1}
                                </div>
                                <span className="font-semibold">
                                  Hint {idx + 1}
                                </span>
                              </div>
                              {showHints.includes(idx) ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                            </div>
                          </CardHeader>
                          {showHints.includes(idx) && (
                            <CardContent className="p-5 pt-0">
                              <p className="text-sm text-muted-foreground leading-6">
                                {hint}
                              </p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="discuss" className="p-6 mt-0">
                    <div className="text-center py-16">
                      <MessageSquare className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        Discussion Forum
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Share your approaches and learn from others
                      </p>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        Start Discussion
                      </Button>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Code Editor & Console */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className="h-full flex flex-col bg-muted/10">
                  {/* Editor Toolbar */}
                  <div className="border-b border-border/40 px-6 py-3 flex items-center justify-between backdrop-blur-sm bg-background/95">
                    <div className="flex items-center gap-4">
                      <Select
                        value={language}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="w-[150px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIAssist(!showAIAssist)}
                        className="gap-2 h-9"
                      >
                        <Brain className="h-4 w-4" />
                        AI Assist
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyCode}
                        className="gap-2 h-9"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="gap-2 h-9"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 h-9">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  {showAIAssist && (
                    <div className="border-b border-border/40 p-5 bg-muted/20">
                      <div className="flex gap-3">
                        <Textarea
                          placeholder="Ask AI for help: 'How do I optimize this?', 'Explain this approach', 'Find bugs in my code'..."
                          className="flex-1 min-h-[70px] text-sm"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-[70px]">
                          <Zap className="h-4 w-4" />
                          Ask AI
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Code Editor Area */}
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      language={language}
                      placeholder="Write your code here..."
                    />
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-border/40 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-background/95">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="gap-2 h-10"
                      >
                        <Play className="h-4 w-4" />
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                      <Button
                        className="gap-2 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        onClick={handleSubmit}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Solution
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                        <Clock className="h-3 w-3" />
                        Auto-save enabled
                      </Badge>
                    </div>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Console/Test Results */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="h-full flex flex-col bg-muted/10">
                  <Tabs
                    defaultValue="testcases"
                    className="flex-1 flex flex-col"
                  >
                    <div className="border-b border-border/40 px-6 backdrop-blur-sm bg-background/95">
                      <TabsList className="h-12">
                        <TabsTrigger value="testcases" className="gap-2 h-10">
                          <ListChecks className="h-4 w-4" />
                          Test Cases
                        </TabsTrigger>
                        <TabsTrigger value="console" className="gap-2 h-10">
                          <Terminal className="h-4 w-4" />
                          Console
                        </TabsTrigger>
                        <TabsTrigger value="output" className="gap-2 h-10">
                          <FileCode className="h-4 w-4" />
                          Output
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <ScrollArea className="flex-1">
                      <TabsContent
                        value="testcases"
                        className="p-6 mt-0 space-y-4"
                      >
                        {testResults.map((test) => (
                          <Card
                            key={test.id}
                            className={`overflow-hidden ${
                              test.passed === true
                                ? "bg-green-500/5 border-green-500/50"
                                : test.passed === false
                                  ? "bg-red-500/5 border-red-500/50"
                                  : "border-muted"
                            }`}
                          >
                            <CardHeader className="p-5 pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    Test Case {test.id}
                                  </span>
                                  {test.passed === true && (
                                    <Badge className="bg-green-500 gap-1.5 px-2.5 py-0.5">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Passed
                                    </Badge>
                                  )}
                                  {test.passed === false && (
                                    <Badge
                                      variant="destructive"
                                      className="gap-1.5 px-2.5 py-0.5"
                                    >
                                      <XCircle className="h-3 w-3" />
                                      Failed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-3">
                              <div>
                                <div className="text-xs font-semibold mb-2 text-foreground/80">
                                  Input:
                                </div>
                                <code className="text-xs bg-muted/40 p-3 rounded-md block font-mono">
                                  {test.input}
                                </code>
                              </div>
                              <div>
                                <div className="text-xs font-semibold mb-2 text-foreground/80">
                                  Expected:
                                </div>
                                <code className="text-xs bg-muted/40 p-3 rounded-md block font-mono">
                                  {test.expected}
                                </code>
                              </div>
                              {test.passed === false && (
                                <div>
                                  <div className="text-xs font-semibold mb-2 text-red-500">
                                    Your Output:
                                  </div>
                                  <code className="text-xs bg-muted/40 p-3 rounded-md block font-mono">
                                    [null, [], null, ["a", "b"]]
                                  </code>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {!isRunning &&
                          testResults.every((t) => t.passed === null) && (
                            <div className="text-center py-12">
                              <Terminal className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground text-sm">
                                Run your code to see test results
                              </p>
                            </div>
                          )}
                      </TabsContent>

                      <TabsContent value="console" className="p-6 mt-0">
                        <div className="bg-muted/40 rounded-md p-5 font-mono text-sm">
                          <div className="text-green-400">
                            $ Running test cases...
                          </div>
                          {isRunning && (
                            <div className="text-yellow-400 animate-pulse mt-2">
                              Executing...
                            </div>
                          )}
                          {!isRunning &&
                            testResults.some((t) => t.passed !== null) && (
                              <>
                                <div className="text-muted-foreground mt-3">
                                  Completed in 1.23s
                                </div>
                                <div className="mt-2 font-semibold">
                                  Passed:{" "}
                                  {testResults.filter((t) => t.passed).length}/
                                  {testResults.length}
                                </div>
                              </>
                            )}
                        </div>
                      </TabsContent>

                      <TabsContent value="output" className="p-6 mt-0">
                        <div className="bg-muted/40 rounded-md p-5 font-mono text-sm space-y-2">
                          <div className="text-muted-foreground flex items-center gap-2">
                            <span className="font-semibold">Runtime:</span>{" "}
                            125ms (Beats 87.3% of submissions)
                          </div>
                          <div className="text-muted-foreground flex items-center gap-2">
                            <span className="font-semibold">Memory:</span>{" "}
                            45.2MB (Beats 92.1% of submissions)
                          </div>
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
