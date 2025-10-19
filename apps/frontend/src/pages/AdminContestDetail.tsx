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
  Calendar,
  Clock,
  Users,
  Trophy,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ContestProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  submissions: number;
  solved: number;
}

interface Participant {
  id: string;
  username: string;
  rank: number;
  score: number;
  problemsSolved: number;
  lastSubmission: string;
}

interface ContestDetail {
  id: string;
  title: string;
  type: 'weekly' | 'monthly';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  rules: string;
  startDate: string;
  endDate: string;
  duration: string;
  prize: string;
  maxParticipants: number;
  currentParticipants: number;
  totalProblems: number;
  createdAt: string;
  updatedAt: string;
  problems: ContestProblem[];
  topParticipants: Participant[];
}

export default function AdminContestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<ContestDetail | null>(null);

  useEffect(() => {
    fetchContestDetail();
  }, [id]);

  const fetchContestDetail = async () => {
    setLoading(true);
    
    // Simulate API call - replace with actual endpoint
    setTimeout(() => {
      setContest({
        id: id || '1',
        title: 'October Monthly Contest',
        type: 'monthly',
        difficulty: 'advanced',
        status: 'ongoing',
        description: 'Compete in our monthly coding challenge featuring 15 challenging problems across various difficulty levels. Test your skills and win amazing prizes!',
        rules: '1. Contest duration: 1 month\n2. Each problem has a fixed point value\n3. Partial points for partial solutions\n4. No plagiarism allowed\n5. Multiple submissions allowed',
        startDate: '2025-10-01T00:00:00Z',
        endDate: '2025-10-31T23:59:59Z',
        duration: '1 month',
        prize: '$2000',
        maxParticipants: 10000,
        currentParticipants: 5678,
        totalProblems: 15,
        createdAt: '2025-09-15T10:00:00Z',
        updatedAt: '2025-10-16T14:30:00Z',
        problems: [
          {
            id: '1',
            title: 'Array Manipulation',
            difficulty: 'easy',
            points: 100,
            submissions: 2345,
            solved: 1876
          },
          {
            id: '2',
            title: 'Binary Tree Traversal',
            difficulty: 'medium',
            points: 200,
            submissions: 1567,
            solved: 945
          },
          {
            id: '3',
            title: 'Graph Algorithms',
            difficulty: 'hard',
            points: 300,
            submissions: 876,
            solved: 234
          },
          {
            id: '4',
            title: 'Dynamic Programming Challenge',
            difficulty: 'hard',
            points: 300,
            submissions: 654,
            solved: 156
          }
        ],
        topParticipants: [
          {
            id: '1',
            username: 'coder123',
            rank: 1,
            score: 850,
            problemsSolved: 12,
            lastSubmission: '2025-10-16T18:30:00Z'
          },
          {
            id: '2',
            username: 'algorithmMaster',
            rank: 2,
            score: 820,
            problemsSolved: 11,
            lastSubmission: '2025-10-16T17:45:00Z'
          },
          {
            id: '3',
            username: 'devPro',
            rank: 3,
            score: 780,
            problemsSolved: 10,
            lastSubmission: '2025-10-16T16:20:00Z'
          },
          {
            id: '4',
            username: 'pythonNinja',
            rank: 4,
            score: 750,
            problemsSolved: 10,
            lastSubmission: '2025-10-16T15:10:00Z'
          },
          {
            id: '5',
            username: 'jsExpert',
            rank: 5,
            score: 720,
            problemsSolved: 9,
            lastSubmission: '2025-10-16T14:55:00Z'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contest?')) return;
    
    try {
      // Replace with actual API call
      // await fetch(`/api/admin/contests/${id}`, { method: 'DELETE' });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to delete contest');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Upcoming
          </Badge>
        );
      case 'ongoing':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Live Now
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium':
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard':
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return '';
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

  if (!contest) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Contest not found</p>
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
              <Code2 className="h-6 w-6" />
              <span className="text-xl font-bold">Contest Details</span>
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
              onClick={() => navigate(`/admin/edit-contest/${contest.id}`)}
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
            <h1 className="text-3xl font-bold">{contest.title}</h1>
            {getStatusBadge(contest.status)}
            <Badge variant="secondary">{contest.type}</Badge>
            <Badge variant="outline" className={getDifficultyColor(contest.difficulty)}>
              {contest.difficulty}
            </Badge>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold">{contest.currentParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Problems</p>
                  <p className="text-2xl font-bold">{contest.totalProblems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prize Pool</p>
                  <p className="text-2xl font-bold">{contest.prize}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-500/10 p-3">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold">{contest.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Contest Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{formatDate(contest.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{formatDate(contest.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Max Participants</p>
                      <p className="font-medium">{contest.maxParticipants.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Rate</p>
                      <p className="font-medium">
                        {((contest.currentParticipants / contest.maxParticipants) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{contest.description}</p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Contest Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {contest.rules}
                </pre>
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
                    <p className="text-sm font-medium">{formatDate(contest.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(contest.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contest ID</p>
                    <p className="text-sm font-medium font-mono">{contest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-sm font-medium capitalize">{contest.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            {contest.problems.map((problem, index) => (
              <Card key={problem.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold">{problem.title}</h3>
                          <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                          <Badge variant="secondary">{problem.points} pts</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {problem.submissions} submissions • {problem.solved} solved •{' '}
                          {((problem.solved / problem.submissions) * 100).toFixed(1)}% success rate
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/problem/${problem.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Top Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contest.topParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between rounded-lg border border-border/40 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                            participant.rank === 1
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : participant.rank === 2
                              ? 'bg-gray-400/20 text-gray-400'
                              : participant.rank === 3
                              ? 'bg-orange-500/20 text-orange-500'
                              : 'bg-muted'
                          }`}
                        >
                          #{participant.rank}
                        </div>
                        <div>
                          <p className="font-semibold">{participant.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.problemsSolved} problems solved • Last submission:{' '}
                            {formatDate(participant.lastSubmission)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{participant.score}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}