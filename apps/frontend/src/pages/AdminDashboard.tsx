import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import {
  Code2,
  Moon,
  Sun,
  LogOut,
  Plus,
  FileText,
  Trophy,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { BACKENDURL } from '../utils/urls';

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'published' | 'draft';
  submissions: number;
}

export interface Contest {
  id: string;
  title: string;
  type: 'weekly' | 'monthly';
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  problems: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);   

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchProblems = async () => {
    try{
      const response = await fetch(`${BACKENDURL}/problems/getproblems`, {
        method : "GET",
        headers : {
          'token' : localStorage.getItem('adminToken') || ''
        }
      });
      const data = await response.json();
      setProblems(data.problems);
    }catch(err){
      console.error(err);
    }
  }

  const fetchContests = async () => {
    try{
      const response = await fetch(`${BACKENDURL}/contest/getcontests`, {
        method : "GET",
        headers : {
          'token' : localStorage.getItem('adminToken') || ''
        }
      });
      const data = await response.json();
      setContests(data.contests);
    }catch(err){
      console.error(err);
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true);
    try{
      fetchProblems();
      fetchContests();
    }catch(err){
      console.error(err);
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
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
    switch (status) {
      case 'published':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Draft
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Upcoming
          </Badge>
        );
      case 'ongoing':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Live
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Code2 className="h-6 w-6" />
            <span className="text-xl font-bold">Grind Admin</span>
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

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage problems, contests, and platform settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Problems</p>
                      <p className="text-2xl font-bold">{problems.length}</p>
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
                      <p className="text-sm text-muted-foreground">Total Contests</p>
                      <p className="text-2xl font-bold">{contests.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-500/10 p-3">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">12,543</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Submissions</p>
                      <p className="text-2xl font-bold">45,678</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New problem published</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                      <div className="rounded-full bg-yellow-500/10 p-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contest started</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-500/10 p-2">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">1,234 new users registered</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button 
                      className="w-full justify-start" 
                      onClick={() => navigate('/admin/dashboard/createproblem')}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Problem
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate('/admin/dashboard/createcontest')}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Contest
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('problems')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View All Problems
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('contests')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View All Contests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Problems Tab */}
          <TabsContent value="problems" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Problems Management</h2>
              <Button onClick={() => navigate('/admin/dashboard/createproblem')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Problem
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-4">
                {problems.map((problem) => (
                  <Card key={problem.id} className="border-border/40">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{problem.title}</h3>
                            <Badge
                              variant="outline"
                              className={getDifficultyColor(problem.difficulty.toLowerCase())}
                            >
                              {problem.difficulty.toLocaleLowerCase()}
                            </Badge>
                            {getStatusBadge(problem.status || "published")}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {problem.submissions || "0"} submissions
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/admin/editproblem/${problem.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`problem/${problem.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contests Tab */}
          <TabsContent value="contests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Contests Management</h2>
              <Button onClick={() => navigate('/admin/dashboard/createcontest')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Contest
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-4">
                {contests.map((contest) => (
                  <Card key={contest.id} className="border-border/40">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{contest.title}</h3>
                            <Badge variant="secondary">{contest.type.toLocaleLowerCase()}</Badge>
                            {getStatusBadge(contest.status.toLocaleLowerCase())}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {contest.participants || "0"} participants • {contest.problems || "0"} problems
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/admin/edit-contest/${contest.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`contest/${contest.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}