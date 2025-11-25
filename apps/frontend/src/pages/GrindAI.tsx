import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent } from '@repo/ui/card';
import { Input } from '@repo/ui/input';
import { ScrollArea } from '@repo/ui/scroll-area';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Send,
  Plus, 
  MessageSquare, 
  Trash2,
  SquareChevronRight,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Brain,
  Code
} from 'lucide-react';
import { toast } from '../../../../packages/ui/src/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function GrindAI() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading,] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const hasMessages = currentSession && currentSession.messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSignOut = () => {
    navigate('/auth');
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    toast({
      title: "Comming Soon",
      description: "This feature is under development and will be available soon.",
      variant: "soon",
    })
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate('/')}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              to="/problems" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link 
              to="/contest" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link 
              to="/compiler" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Compiler
            </Link>
            <Link 
              to="/grind-ai" 
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium transition-all hover:bg-blue-600 hover:text-white"
            >
              Grind AI
            </Link>
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

      <div className="flex flex-1 overflow-hidden relative">
        <div 
          className={`${
            isSidebarOpen ? 'w-72' : 'w-0'
          } transition-all duration-300 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col overflow-hidden relative`}
        >
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <SquareChevronRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Grind AI</div>
                <div className="text-xs text-muted-foreground">Your Coding Assistant</div>
              </div>
            </div>
            <Button 
              onClick={createNewSession}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground">No chat history yet</p>
                </div>
              ) : (
                sessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => setCurrentSessionId(session.id)}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="text-sm truncate">{session.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => deleteSession(session.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          {isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute -right-10 top-4 rounded-full h-8 w-8 bg-background border border-border/40 hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 z-10 rounded-full h-8 w-8 bg-background border border-border/40 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            {!hasMessages ? (
              <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-6">
                    <SquareChevronRight className="h-12 w-12 text-blue-500" />
                  </div>
                  <h1 className="text-5xl font-bold mb-4">
                    Welcome to
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      {' '}Grind AI
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Your personal AI coding assistant. Get help with algorithms, debugging, 
                    code reviews, and interview preparation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 mb-4">
                        <Code className="h-6 w-6 text-blue-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Code Assistance</h3>
                      <p className="text-sm text-muted-foreground">
                        Get help writing and optimizing code
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 mb-4">
                        <Brain className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Algorithms</h3>
                      <p className="text-sm text-muted-foreground">
                        Understand complex algorithms
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 mb-4">
                        <Zap className="h-6 w-6 text-purple-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Interview Prep</h3>
                      <p className="text-sm text-muted-foreground">
                        Practice for technical interviews
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full max-w-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-center">Try asking about...</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() => setInput('Explain how binary search works')}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">Algorithm Explanation</p>
                        <p className="text-xs text-muted-foreground">Explain how binary search works</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() => setInput('Help me solve Two Sum problem')}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">Problem Solving</p>
                        <p className="text-xs text-muted-foreground">Help me solve Two Sum problem</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() => setInput('What are the best practices for writing clean code?')}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">Best Practices</p>
                        <p className="text-xs text-muted-foreground">Best practices for clean code</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() => setInput('Explain time complexity with examples')}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">Concepts</p>
                        <p className="text-xs text-muted-foreground">Explain Big O notation</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <>
              </>

            )}
          </ScrollArea>

          <div className="border-t border-border/40 bg-background/95 backdrop-blur p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center gap-1 h-[100px]">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Grind AI anything about coding..."
                  className="pr-12 h-[90px] text-base rounded-xl pb-[45px]"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="absolute right-2 h-9 w-9 rounded-lg mt-[30px]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Grind AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}