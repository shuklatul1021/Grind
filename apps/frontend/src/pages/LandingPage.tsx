import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Code2, Zap, Trophy, Users, Moon, Sun, SquareTerminal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthentication } from '../hooks/useAuthentication';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { authState } = useAuthentication();
  const user = authState.user;

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/problems');
    }
  }, [authState, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SquareTerminal className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {user ? (
              <Button onClick={() => navigate('/problems')}>
                Go to Problems
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="container px-4 py-20 md:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm">
              <Zap className="mr-2 h-4 w-4" />
              Master your coding skills
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Level Up Your
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {' '}
                Coding Skills
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Practice solving algorithmic challenges, prepare for technical interviews,
              and compete with developers worldwide. Start your journey today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="text-base"
                onClick={() => navigate(user ? '/problems' : '/auth')}
              >
                Start Practicing
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                View Problems
              </Button>
            </div>
          </div>
        </section>

        <section className="container px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Choose Grind?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Code2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Curated Problems</CardTitle>
                  <CardDescription>
                    Handpicked coding challenges covering all difficulty levels and topics
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>Instant Feedback</CardTitle>
                  <CardDescription>
                    Get immediate results on your submissions with detailed test cases
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <CardTitle>Track Progress</CardTitle>
                  <CardDescription>
                    Monitor your improvement with detailed statistics and achievements
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>Community Driven</CardTitle>
                  <CardDescription>
                    Learn from solutions shared by developers around the world
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                    <Code2 className="h-6 w-6 text-orange-500" />
                  </div>
                  <CardTitle>Multiple Languages</CardTitle>
                  <CardDescription>
                    Write solutions in JavaScript, Python, Java, and more languages
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Trophy className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle>Interview Prep</CardTitle>
                  <CardDescription>
                    Practice real problems asked in top tech company interviews
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="container px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <Card className="border-border/40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Ready to Start Coding?</CardTitle>
                <CardDescription className="text-base">
                  Join thousands of developers improving their skills every day
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Button
                  size="lg"
                  onClick={() => navigate(user ? '/problems' : '/auth')}
                >
                  {user ? 'Go to Problems' : 'Create Free Account'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              <span className="font-semibold">Grind</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Grind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
