import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import {
  Moon,
  Sun,
  Play,
  ArrowLeft,
  Loader2,
  SquareChevronRight,
  Code2,
  Terminal,
  Maximize2,
  RotateCcw,
  Lightbulb,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/resizable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { useTheme } from "../../../contexts/ThemeContext";
import type { Example, Problem, StarterCode } from "../../../types/problem";
import { useToast } from "../../../../../../packages/ui/src/hooks/use-toast";
import CodeEditor from "../../../pages/CodeEditor";

// Mock data
const MOCK_PROBLEM = {
  id: "1",
  title: "Two Sum",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  difficulty: "easy" as const,
  tags: ["Array", "Hash Table"],
  isSolved: false,
  testcase: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: "",
    },
  ],
  starterCode: [
    {
      language: "python",
      code: `def twoSum(nums, target):
    # Write your code here
    pass`,
    },
    {
      language: "javascript",
      code: `function twoSum(nums, target) {
    // Write your code here
    
}`,
    },
    {
      language: "java",
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    {
      language: "cpp",
      code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
    },
  ] as any,
  solution: `# Python Solution
def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
  hint: "Use a hash map to store the complement of each number as you iterate through the array.",
  explanation: `The solution uses a hash map (dictionary) to store each number and its index as we iterate through the array. For each number, we calculate its complement (target - current number). If the complement exists in our hash map, we've found our two numbers. This approach has O(n) time complexity and O(n) space complexity.`,
};



export default function CodingPracticesEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [starterCodes, setStarterCodes] = useState<StarterCode[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [testResult, setTestResult] = useState<{
    status: "accepted" | "wrong_answer" | "runtime_error" | "syntax_error";
    message: string;
    error?: string;
    expectedOutput?: string;
    yourOutput?: string;
  } | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const selectedCode = starterCodes.find((sc) => sc.language === language);
    setCode(selectedCode ? selectedCode.code : "");
  };

  useEffect(() => {
    if (slug && code) {
      const savedCodes = JSON.parse(
        localStorage.getItem("grind_saved_codes") || "{}"
      );
      savedCodes[slug] = {
        code,
        language: selectedLanguage,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("grind_saved_codes", JSON.stringify(savedCodes));
    }
  }, [code, slug, selectedLanguage]);

  // Initialize with mock data
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setProblem(MOCK_PROBLEM);
      const parsedStarterCodes: StarterCode[] = Array.isArray(MOCK_PROBLEM.starterCode) 
        ? MOCK_PROBLEM.starterCode 
        : JSON.parse(MOCK_PROBLEM.starterCode as string);
      setStarterCodes(parsedStarterCodes);
      
      // Load saved code from localStorage if exists
      const savedCodes = JSON.parse(
        localStorage.getItem("grind_saved_codes") || "{}"
      );
      if (slug && savedCodes[slug]) {
        setCode(savedCodes[slug].code);
        setSelectedLanguage(savedCodes[slug].language);
      } else {
        const selectedCode = parsedStarterCodes.find(
          (sc: StarterCode) => sc.language === selectedLanguage
        );
        setCode(selectedCode ? selectedCode.code : "");
      }
      setLoading(false);
    }, 500);
  }, [slug, selectedLanguage]);

  const handleRunCode = async () => {
    if (!problem) return;
    setSubmitting(true);
    setOutput("");
    setTestResult(null);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock validation logic
    const codeLower = code.toLowerCase();
    const hasFunction = codeLower.includes("def") || codeLower.includes("function") || codeLower.includes("class");
    const hasReturn = codeLower.includes("return");
    const hasPass = codeLower.includes("pass");
    
    // Simple mock validation
    if (!code || code.trim().length === 0) {
      setTestResult({
        status: "syntax_error",
        message: "Please write some code first",
        error: "Empty code",
      });
      setOutput("Error: Please write some code before running.");
      setSubmitting(false);
      return;
    }
    
    if (hasPass && code.trim().split("\n").length < 5) {
      setTestResult({
        status: "wrong_answer",
        message: "Test cases failed",
        error: "Incomplete solution",
        expectedOutput: "[0,1]",
        yourOutput: "[]",
      });
      setOutput(`Test Case 1: Failed
Expected: [0,1]
Got: []
        
Test Case 2: Failed
Expected: [1,2]
Got: []
        
Please implement the solution.`);
      setSubmitting(false);
      return;
    }
    
    // Mock success case
    if (hasFunction && hasReturn && !hasPass) {
      setTestResult({
        status: "accepted",
        message: "All test cases passed! ✅",
      });
      setOutput(`Test Case 1: Passed ✓
Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Test Case 2: Passed ✓
Input: nums = [3,2,4], target = 6
Output: [1,2]

Test Case 3: Passed ✓
Input: nums = [3,3], target = 6
Output: [0,1]

All test cases passed! 🎉`);
      toast({
        title: "Success",
        description: "Solution accepted!",
        variant: "soon",
      });
    } else {
      setTestResult({
        status: "runtime_error",
        message: "Runtime Error",
      });
      setOutput(`Runtime Error: 
Please check your code implementation.
Make sure your function returns the correct output format.`);
    }
    
    setSubmitting(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading Problem...
          </p>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/problems")}
            className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => navigate("/")}
            >
              <SquareChevronRight className="h-5 w-5 text-primary" />
              <span className="font-semibold tracking-tight text-foreground">
                Grind
              </span>
            </div>
            <div className="h-4 w-[1px] bg-border/50" />
            <span className="text-sm font-medium truncate max-w-[300px]">
              {problem.title}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <div className="h-4 w-[1px] bg-border/50" />
          <Button
            variant="default"
            size="sm"
            onClick={handleRunCode}
            disabled={submitting}
            className="h-8 px-4 text-xs font-semibold gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            Run Code
          </Button>
        </div>
      </header>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {!isFullscreen && (
          <>
            <ResizablePanel
              defaultSize={35}
              minSize={30}
              maxSize={60}
              className="bg-card/30"
            >
              <div className="flex h-full flex-col">
                <Tabs
                  defaultValue="question"
                  className="flex-1 flex flex-col"
                >
                  <div className="border-b border-border/50 px-4 bg-muted/10">
                    <TabsList className="h-10 w-full justify-start gap-4 rounded-none bg-transparent p-0">
                      <TabsTrigger
                        value="question"
                        className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-3 pb-2 pt-2 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground flex items-center gap-2"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Question
                      </TabsTrigger>
                      <TabsTrigger
                        value="example"
                        className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-3 pb-2 pt-2 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground flex items-center gap-2"
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        Example
                      </TabsTrigger>
                      <TabsTrigger
                        value="hint"
                        className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-3 pb-2 pt-2 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground flex items-center gap-2"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        Hint
                      </TabsTrigger>
                      <TabsTrigger
                        value="solution"
                        className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-3 pb-2 pt-2 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground flex items-center gap-2"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        Solution
                      </TabsTrigger>
                      <TabsTrigger
                        value="explanation"
                        className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-3 pb-2 pt-2 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground flex items-center gap-2"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Explanation
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value="question"
                    className="flex-1 overflow-y-auto p-6 outline-none mt-0"
                  >
                    <div className="space-y-6 max-w-3xl mx-auto">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h1 className="text-2xl font-bold tracking-tight">
                            {problem.title}
                          </h1>
                          <Badge
                            variant="outline"
                            className={`${getDifficultyColor(problem.difficulty)} capitalize px-3 py-1 text-xs font-semibold border`}
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-muted/50 text-muted-foreground hover:bg-muted text-xs px-2.5 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-base">
                          {problem.description}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="example"
                    className="flex-1 overflow-y-auto p-6 outline-none mt-0"
                  >
                    <div className="space-y-4 max-w-3xl mx-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Terminal className="h-4 w-4 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Examples
                        </h3>
                      </div>
                      <div className="grid gap-4">
                        {(problem.examples as Example[]).map(
                          (example, index) => (
                            <Card
                              key={index}
                              className="border-2 border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent"
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                    Example {index + 1}
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex gap-3 text-sm">
                                    <span className="font-semibold text-foreground min-w-[4rem] flex items-center gap-1">
                                      <span className="text-blue-500">Input:</span>
                                    </span>
                                    <code className="font-mono text-sm text-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/40 flex-1">
                                      {example.input}
                                    </code>
                                  </div>
                                  <div className="flex gap-3 text-sm">
                                    <span className="font-semibold text-foreground min-w-[4rem] flex items-center gap-1">
                                      <span className="text-green-500">Output:</span>
                                    </span>
                                    <code className="font-mono text-sm text-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/40 flex-1">
                                      {example.output}
                                    </code>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-2 border-t border-border/40">
                                      <div className="flex gap-3 text-sm">
                                        <span className="font-semibold text-foreground min-w-[4rem]">
                                          <span className="text-yellow-500">Note:</span>
                                        </span>
                                        <span className="text-muted-foreground leading-relaxed">
                                          {example.explanation}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="hint"
                    className="flex-1 overflow-y-auto p-6 outline-none mt-0"
                  >
                    <div className="space-y-4 max-w-3xl mx-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Hints
                        </h3>
                      </div>
                      <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            {(problem as any).hint ? (
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {(problem as any).hint}
                              </p>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                  💡 Think about the problem step by step
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  💡 Consider edge cases
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  💡 Try to optimize your solution
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="solution"
                    className="flex-1 overflow-y-auto p-6 outline-none mt-0"
                  >
                    <div className="space-y-4 max-w-3xl mx-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Code2 className="h-4 w-4 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Solution
                        </h3>
                      </div>
                      <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                        <CardContent className="p-6">
                          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                            {(problem as any).solution || "No solution provided."}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="explanation"
                    className="flex-1 overflow-y-auto p-6 outline-none mt-0"
                  >
                    <div className="space-y-4 max-w-3xl mx-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <FileText className="h-4 w-4 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Explanation
                        </h3>
                      </div>
                      <Card className="border-2 border-border/40">
                        <CardContent className="p-6">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                              {(problem as any).explanation || problem.description || "No explanation provided."}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="w-[1px] bg-border/50 hover:bg-primary/50 transition-colors"
            />
          </>
        )}
        <ResizablePanel
          defaultSize={isFullscreen ? 100 : 60}
          minSize={40}
          className="bg-background/50 backdrop-blur-sm"
        >
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={65}
              minSize={30}
              className="flex flex-col border-l border-border/50"
            >
              <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-background px-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/50">
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Solution</span>
                  </div>
                  <div className="h-4 w-[1px] bg-border/50" />
                  <Select
                    value={selectedLanguage}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="h-7 w-[140px] border-none bg-transparent shadow-none hover:bg-muted/50 focus:ring-0 text-xs font-medium p-0 gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <span className="truncate">Language:</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {starterCodes.map((lang) => (
                        <SelectItem
                          key={lang.language}
                          value={lang.language}
                          className="text-xs"
                        >
                          <span className="capitalize">{lang.language}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setCode(
                        starterCodes.find(
                          (sc) => sc.language === selectedLanguage
                        )?.code || ""
                      )
                    }
                    title="Reset Code"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 text-muted-foreground hover:text-foreground ${isFullscreen ? "bg-primary/20 text-primary" : ""}`}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative bg-background overflow-auto">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={selectedLanguage}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="h-[1px] bg-border/50 hover:bg-primary/50 transition-colors"
            />
            {/* Terminal / Output */}
            <ResizablePanel
              defaultSize={35}
              minSize={20}
              className="bg-card/30 border-l border-border/50"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-muted/20 px-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Terminal</span>
                  </div>
                  {testResult && (
                    <div className="flex items-center gap-2">
                      {testResult.status === "accepted" ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      ) : testResult.status === "syntax_error" ? (
                        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Syntax Error
                        </Badge>
                      ) : testResult.status === "runtime_error" ? (
                        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Runtime Error
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Wrong Answer
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-auto bg-[#1e1e1e] text-left">
                  <div className="h-full w-full p-4 overflow-auto font-mono text-sm text-gray-300">
                    {submitting ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Running code...</span>
                      </div>
                    ) : output ? (
                      <div className="space-y-2">
                        {testResult && (
                          <div
                            className={`mb-3 p-3 rounded-lg ${
                              testResult.status === "accepted"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            <p className="font-semibold">{testResult.message}</p>
                            {testResult.expectedOutput && (
                              <div className="mt-2 space-y-1 text-xs">
                                <p>
                                  <span className="text-green-400">Expected:</span>{" "}
                                  {testResult.expectedOutput}
                                </p>
                                <p>
                                  <span className="text-red-400">Got:</span>{" "}
                                  {testResult.yourOutput}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <pre className="whitespace-pre-wrap text-gray-300">
                          {output}
                        </pre>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 italic">
                        Run your code to see output here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
