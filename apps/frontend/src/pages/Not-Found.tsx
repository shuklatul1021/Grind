import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent } from '@repo/ui/card';
import { useTheme } from '../contexts/ThemeContext';
import { Home, ArrowLeft, Moon, Sun, Search, SquareChevronRight } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SquareChevronRight className="h-6 w-6" />
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
          </div>
        </div>
      </header>

      <main className="container px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="relative inline-block mb-8">
                <div className="text-[120px] font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent leading-none">
                  404
                </div>
                <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 -z-10"></div>
              </div>

              <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
              
              <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  size="lg"
                  className="gap-2 min-w-[160px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="gap-2 min-w-[160px]"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <div className="pt-8 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for something specific?
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/problems')}
                    className="gap-2"
                  >
                    <Search className="h-3 w-3" />
                    Problems
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/contest')}
                    className="gap-2"
                  >
                    <Search className="h-3 w-3" />
                    Contest
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/grind-ai')}
                    className="gap-2"
                  >
                    <Search className="h-3 w-3" />
                    Grind AI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur mt-24">
        <div className="container px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 text-left">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 mb-3">
                <SquareChevronRight className="h-5 w-5" />
                <span className="font-semibold text-lg">Grind</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The platform to sharpen your coding skills with curated problems and competitive learning.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground" onClick={() => navigate('/problems')}>Problems</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/leaderboard')}>Leaderboard</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/contests')}>Contests</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/compiler')}>Compiler</button></li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground" onClick={() => navigate('/community')}>Community</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/blog')}>Blog</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/faq')}>FAQ</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/feedback')}>Feedback</button></li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground" onClick={() => navigate('/about')}>About Us</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/terms-and-conditions')}>Terms & Conditions</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/privacy-policy')}>Privacy Policy</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/cancellation-policy')}>Cancellation & Refunds</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/shipping-policy')}>Shipping Policy</button></li>
                <li><button className="hover:text-foreground" onClick={() => navigate('/contact-us')}>Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4 text-left">
            <p>© 2025 Grind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}