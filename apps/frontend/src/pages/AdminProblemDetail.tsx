import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import {
  Code2,
  Moon,
  Sun,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  SquareChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface TestCase {
  id: string;
  input: string;
  output: string;
  isHidden: boolean;
}

interface Submission {
  id: string;
  user: string;
  language: string;
  status: 'accepted' | 'wrong-answer' | 'time-limit' | 'runtime-error';
  runtime: string;
  memory: string;
  submittedAt: string;
}

interface ProblemDetail {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'published' | 'draft';
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  points: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  createdAt: string;
  updatedAt: string;
  testCases: TestCase[];
  recentSubmissions: Submission[];
}

export default function AdminProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<ProblemDetail | null>(null);

  useEffect(() => {
    fetchProblemDetail();
  }, [id]);

  const fetchProblemDetail = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setProblem({
        id: id || '1',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'easy',
        status: 'published',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        inputFormat: 'First line: integer n (array length)\nSecond line: n space-separated integers\nThird line: integer target',
        outputFormat: 'Two space-separated integers representing indices',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
        tags: ['arrays', 'hash-table', 'two-pointers'],
        timeLimit: 2,
        memoryLimit: 256,
        points: 100,
        totalSubmissions: 1234,
        acceptedSubmissions: 987,
        acceptanceRate: 79.9,
        createdAt: '2025-10-01T10:00:00Z',
        updatedAt: '2025-10-15T14:30:00Z',
        testCases: [
          { id: '1', input: '4\n2 7 11 15\n9', output: '0 1', isHidden: false },
          { id: '2', input: '3\n3 2 4\n6', output: '1 2', isHidden: false },
          { id: '3', input: '2\n3 3\n6', output: '0 1', isHidden: true },
          { id: '4', input: '5\n1 5 3 7 8\n12', output: '2 4', isHidden: true }
        ],
        recentSubmissions: [
          {
            id: '1',
            user: 'user123',
            language: 'python',
            status: 'accepted',
            runtime: '45ms',
            memory: '16.2MB',
            submittedAt: '2025-10-16T15:30:00Z'
          },
          {
            id: '2',
            user: 'user456',
            language: 'javascript',
            status: 'wrong-answer',
            runtime: '52ms',
            memory: '18.5MB',
            submittedAt: '2025-10-16T14:20:00Z'
          },
          {
            id: '3',
            user: 'user789',
            language: 'cpp',
            status: 'accepted',
            runtime: '12ms',
            memory: '14.8MB',
            submittedAt: '2025-10-16T13:10:00Z'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      // Replace with actual API call
      // await fetch(`/api/admin/problems/${id}`, { method: 'DELETE' });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to delete problem');
    }
  };

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

  const getStatusBadge = (status: string) => {
    return status === 'published' ? (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
        Published
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
        Draft
      </Badge>
    );
  };

  const getSubmissionStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'wrong-answer':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'time-limit':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'runtime-error':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Problem not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <SquareChevronRight className="h-6 w-6" />
              <span className="text-xl font-bold">Problem Details</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/edit-problem/${problem.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
            {getStatusBadge(problem.status)}
          </div>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold">{problem.totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">{problem.acceptedSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                  <p className="text-2xl font-bold">{problem.acceptanceRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-500/10 p-3">
                  <Code2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="text-2xl font-bold">{problem.points}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {problem.description}
                </pre>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Input Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                    {problem.inputFormat || 'Not specified'}
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Output Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                    {problem.outputFormat || 'Not specified'}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                  {problem.constraints || 'Not specified'}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Resource Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Limit</p>
                    <p className="text-lg font-semibold">{problem.timeLimit}s</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Memory Limit</p>
                    <p className="text-lg font-semibold">{problem.memoryLimit}MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Test Cases</p>
                    <p className="text-lg font-semibold">{problem.testCases.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="text-sm font-medium">{formatDate(problem.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(problem.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Problem ID</p>
                    <p className="text-sm font-medium font-mono">{problem.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Slug</p>
                    <p className="text-sm font-medium font-mono">{problem.slug}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testcases" className="space-y-4">
            {problem.testCases.map((testCase, index) => (
              <Card key={testCase.id} className="border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Test Case #{index + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      {testCase.isHidden ? (
                        <>
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                            Hidden
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            Public
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Input</p>
                      <div className="rounded-md border border-border/40 bg-muted/30 p-3">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {testCase.input}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Expected Output</p>
                      <div className="rounded-md border border-border/40 bg-muted/30 p-3">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {testCase.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            {problem.recentSubmissions.map((submission) => (
              <Card key={submission.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getSubmissionStatusIcon(submission.status)}
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-medium">{submission.user}</p>
                          <Badge variant="secondary" className="text-xs">
                            {submission.language}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              submission.status === 'accepted'
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }
                          >
                            {submission.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.runtime} • {submission.memory} • {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}