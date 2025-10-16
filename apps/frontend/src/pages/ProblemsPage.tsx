import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Input } from '@repo/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import { Code2, Moon, Sun, LogOut, Search, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Problem, UserProgress } from '../types/problem';


export default function ProblemsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userProgress, setUserProgress] = useState<Map<string, UserProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    // if (!user) {
    //   navigate('/auth');
    //   return;
    // }

    fetchProblems();
  }, [navigate]);

  const fetchProblems = async () => {
    setLoading(true);


    setLoading(false);
  };

  const handleSignOut = async () => {
    navigate('/');
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty =
      difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

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

  const getStatusIcon = (problemId: string) => {
    const progress = userProgress.get(problemId);
    if (progress?.status === 'solved') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (progress?.status === 'attempted') {
      return <Circle className="h-5 w-5 text-yellow-500" />;
    }
    return <Circle className="h-5 w-5 text-muted-foreground" />;
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
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className='flex space-x-4'>
            <div className='underline'>
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

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Problems</h1>
          <p className="text-muted-foreground">
            Solve coding challenges and improve your skills
          </p>
        </div>

        <Card className="mb-6 border-border/40">
          <CardHeader>
            <CardTitle>Filter Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search problems or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((problem) => (
              <Card
                key={problem.id}
                className="cursor-pointer border-border/40 transition-colors hover:bg-muted/50"
                onClick={() => navigate(`/problem/${problem.slug}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getStatusIcon(problem.id)}</div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{problem.title}</h3>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(problem.difficulty)}
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Acceptance Rate: {problem.acceptance_rate}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProblems.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No problems found matching your filters
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
