import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import {
  Moon,
  Sun,
  LogOut,
  Play,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  SquareChevronRight,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

import { useToast } from '../../../../packages/ui/src/hooks/use-toast';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/ui/resizable';
import type { Example, Problem, StarterCode } from '../types/problem';
import { BACKENDURL } from '../utils/urls';
import CodeEditor from './CodeEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';

export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [starterCodes, setStarterCodes] = useState<StarterCode[]>([]);
  const [activeTest, setActiveTest] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'accepted' | 'wrong_answer' | 'runtime_error';
    message: string;
  } | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const selectedCode = starterCodes.find((sc) => sc.language === language);
    setCode(selectedCode ? selectedCode.code : '');
  };



  useEffect(() => {
    fetchProblem();
  }, [ slug ]);

  const fetchProblem = async () => {
    setLoading(true);
    const response = await fetch(`${BACKENDURL}/problems/getproblem/${slug}`,{
      method : "GET",
      headers : {
        "Content-Type" : "application/json",
        token : localStorage.getItem("token") || ""
      }
    });
    if(response.ok){
      const json = await response.json();
      setProblem(json.problem);
      setStarterCodes(JSON.parse(json.problem.starterCode));
      const selectedCode = JSON.parse(json.problem.starterCode).find((sc: StarterCode) => sc.language === selectedLanguage);
      setCode(selectedCode ? selectedCode.code : '');
    }else{
      toast({
        title: "Error",
        description: "Failed to fetch problem",
        variant: "destructive",
        action: <button onClick={fetchProblem}>Retry</button>
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const handleRunCode = async () => {
    if (!problem) return;
    setSubmitting(true);
    const response = await fetch(`${BACKENDURL}/submit/submitcode` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        code,
        language : "python"
      })
    });
    if(response.ok){
      setTestResult({status : "accepted" , message : "Successfully Runs"})
    }else{
      setTestResult({status : "wrong_answer" , message : "Invalid Result"})
    }

    setSubmitting(false);
  };

  console.log(slug);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!problem) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/problems')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex cursor-pointer items-center gap-2" onClick={() => navigate('/')}>
              <SquareChevronRight className="h-6 w-6" />
              <span className="text-xl font-bold">Grind</span>
            </div>
          </div>
          <div className='flex space-x-4'>
            <div>
              <Link to="/problems">Problems</Link> 
            </div>
            <div>
              <Link to="/contest">Contest</Link> 
            </div>
            <div>
              <Link to="/compiler">Compiler</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={30}>
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <Badge
                variant="outline"
                className={getDifficultyColor(problem.difficulty)}
              >
                {problem.difficulty}
              </Badge>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card className="border-border/40">
                  <CardContent className="pt-6">
                    <div className="whitespace-pre-wrap text-sm">{problem.description}</div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                {(problem.examples as Example[]).map((example, index) => (
                  <Card key={index} className="border-border/40">
                    <CardHeader>
                      <CardTitle className="text-base">Example {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Input:</span> {example.input}
                      </div>
                      <div>
                        <span className="font-semibold">Output:</span> {example.output}
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-semibold">Explanation:</span>{' '}
                          {example.explanation}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="constraints">
                <Card className="border-border/40">
                  <CardContent className="pt-6">
                    <div className="whitespace-pre-wrap text-sm">{problem.constraints}</div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/50 px-4 py-2">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {starterCodes.map((lang) => (
                    <SelectItem key={lang.language} value={lang.language}>
                      {lang.language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleRunCode}
                disabled={submitting}
                size="sm"
                className="gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Code
                  </>
                )}
              </Button>
            </div>

            <div
              className="flex-1 min-h-[50vh] max-h-[80vh] overflow-auto rounded-md border border-border/40 bg-muted/30"
              role="region"
              aria-label="Code editor"
            >
              <CodeEditor code={code} setCode={setCode} language={selectedLanguage}/>
            </div>

            {!testResult && (
              <div className="border-t border-border/40 bg-muted/50">
                <Card>
                  <CardContent className="mt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Test Cases</h3>
                      <div className="text-xs text-muted-foreground">{problem.testcase.length} total</div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {problem.testcase.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTest(i)}
                          className={
                            "inline-flex items-center justify-center min-w-[36px] h-8 px-2 rounded-md text-sm " +
                            (i === activeTest
                              ? "bg-primary text-black shadow"
                              : "bg-transparent text-muted-foreground border border-border/20 hover:bg-muted/40")
                          }
                          aria-pressed={i === activeTest}
                        >
                          Test {i + 1}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-md border border-border/40 bg-background/50 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-medium">Input</div>
                            <div className="text-2xs text-muted-foreground">Test #{activeTest + 1}</div>
                          </div>
                        </div>

                        <pre
                          className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm bg-transparent p-2 rounded"
                          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace" }}
                        >
                          {problem.testcase[activeTest]?.input ?? "-"}
                        </pre>
                      </div>

                      <div className="rounded-md border border-border/40 bg-background/50 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-medium">Expected Output</div>
                            <div className="text-2xs text-muted-foreground">Test #{activeTest + 1}</div>
                          </div>
                        </div>

                        <pre
                          className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm bg-transparent p-2 rounded"
                          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace" }}
                        >
                          {problem.testcase[activeTest]?.expectedOutput ?? "-"}
                        </pre>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Showing {activeTest + 1} of {problem.testcase.length}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTest((s) => Math.max(0, s - 1))}
                          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                          disabled={activeTest <= 0}
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setActiveTest((s) => Math.min(problem.testcase.length - 1, s + 1))}
                          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                          disabled={activeTest >= problem.testcase.length - 1}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {testResult && (
              <div className="border-t border-border/40 bg-muted/50 p-4">
                <Card
                  className={`border-2 ${
                    testResult.status === 'accepted'
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <CardContent className="flex items-start gap-3 pt-6">
                    {testResult.status === 'accepted' ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    )}
                    <div>
                      <div className="mb-1 font-semibold">
                        {testResult.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testResult.message}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
