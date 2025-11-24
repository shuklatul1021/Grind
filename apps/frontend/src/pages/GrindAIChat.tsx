import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useTheme } from "../contexts/ThemeContext";
import {
  Send,
  Plus,
  MessageSquare,
  User,
  Bot,
  Trash2,
  SquareChevronRight,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function GrindAIChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = sessions.find((s) => s.id === id);
  const hasMessages = currentSession && currentSession.messages.length > 0;

  useEffect(() => {
    // Initialize session if it doesn't exist
    if (id && !sessions.find((s) => s.id === id)) {
      const newSession: ChatSession = {
        id,
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      };
      setSessions((prev) => [newSession, ...prev]);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages]);

  const handleSignOut = () => {
    navigate("/auth");
  };

  const createNewSession = () => {
    const newSessionId = Date.now().toString();
    navigate(`/grind-ai/${newSessionId}`);
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (id === sessionId) {
      navigate("/grind-ai");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !id) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              title:
                session.messages.length === 0
                  ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
                  : session.title,
            }
          : session
      )
    );

    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'm Grind AI, your coding assistant! I received your message: "${userMessage.content}". This is a demo response. In production, I would help you with coding questions, algorithm explanations, debugging, and problem-solving strategies.`,
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? { ...session, messages: [...session.messages, aiMessage] }
            : session
        )
      );

      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
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
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium transition-all hover:bg-blue-600"
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
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-72" : "w-0"
          } transition-all duration-300 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col overflow-hidden relative`}
        >
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2 mb-4 ">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <SquareChevronRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Grind AI</div>
                <div className="text-xs text-muted-foreground">
                  Your Coding Assistant
                </div>
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
                  <p className="text-xs text-muted-foreground">
                    No chat history yet
                  </p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/grind-ai/${session.id}`)}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      id === session.id ? "bg-muted" : "hover:bg-muted/50"
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

          {/* Sidebar Toggle Button - Only show when open */}
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

        {/* Sidebar Open Button (when closed) */}
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {!hasMessages ? (
              // Empty - show nothing
              <div className="h-full" />
            ) : (
              // Messages view
              <div className="max-w-4xl mx-auto w-full space-y-8 pb-4 pt-4">
                {currentSession?.messages.map((message) => (
                  <div key={message.id} className="flex gap-4 items-start">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-blue-500" />
                      ) : (
                        <SquareChevronRight className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="font-semibold text-sm text-foreground text-left">
                        {message.role === "user" ? "You" : "Grind AI"}
                      </div>
                      <div className="text-[15px] text-foreground leading-relaxed break-words overflow-wrap-anywhere text-left">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                      <Bot className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-sm text-foreground">
                        Grind AI
                      </div>
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-border/40 bg-background/95 backdrop-blur p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Grind AI anything about coding..."
                  className="pr-12 h-12 text-base rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="absolute right-2 h-9 w-9 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Grind AI can make mistakes. Consider checking important
                information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
