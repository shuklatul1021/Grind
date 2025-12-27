import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useTheme } from "../contexts/ThemeContext";
import {
  Send,
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
  Code,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import {
  setUserAllChats,
  setUserCreditDetails,
  setUserPrompt,
} from "../state/ReduxStateProvider";
import { BACKENDURL } from "../utils/urls";

interface ChatSessionData {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
  updatedAt: string;
}

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

export default function GrindAI() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sessions] = useState<ChatSession[]>([]);
  const [currentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading] = useState(false);
  const [createChatLoading, setcreateChatLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userCreditLoading, setUserCreditLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [, setResponseMessage] = useState<Message[]>([
    {
      id: "0",
      role: "user",
      content: input,
      timestamp: new Date(),
    },
  ]);

  const [userChatMessage, setUserChatMessage] = useState<ChatSessionData[]>([]);

  const [userChatLoading, setUserChatLoading] = useState(true);

  async function getUserDetails() {
    try {
      const response = await fetch(`${BACKENDURL}/user/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.user);
        dispatch(
          setUserCreditDetails({
            aicredit: data.user.aitoken,
            maxcredit: data.user.maxaitoken,
          })
        );
        setUserCreditLoading(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user details. Please try again.",
          variant: "destructive",
        });
        setUserCreditLoading(false);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive",
      });
    }
    setUserCreditLoading(false);
  }

  const getUserChats = async () => {
    setUserChatLoading(true);
    try {
      const response = await fetch(`${BACKENDURL}/grindai/get-chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserChatMessage(data.chats);
        dispatch(setUserAllChats(data.chats));
        setUserChatLoading(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch chat sessions. Please try again.",
          variant: "destructive",
        });
        setUserChatLoading(false);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to fetch chat sessions. Please try again.",
        variant: "destructive",
      });
      setUserChatLoading(false);
    }
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const hasMessages = currentSession && currentSession.messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    getUserChats();
    getUserDetails();
  }, [currentSession?.messages]);

  const handleSignOut = () => {
    navigate("/auth");
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resposne = await fetch(
      `${BACKENDURL}/grindai/delete-chat/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      }
    );

    if (resposne.ok) {
      toast({
        title: "Chat Successfully Deleted",
        description:
          "Your Message Is Successfully Deleted For Server Permanently",
        variant: "default",
      });
      getUserChats();
    } else {
      toast({
        title: "Error While Deleting Chat",
        description: "Error While Deleting Chat Session Try Again Later",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (userDetails?.aitoken === 0) {
      navigate("/premium/pricing");
      return;
    }
    dispatch(
      setUserPrompt({
        prompt: input,
      })
    );
    setcreateChatLoading(true);
    StoreUserMessage(input);
  };

  const StoreUserMessage = async (UserPrompt: string) => {
    const newMessage = [
      {
        id: "0",
        role: "user" as const,
        content: UserPrompt,
        timestamp: new Date(),
      },
    ];
    setResponseMessage(newMessage);
    try {
      const response = await fetch(`${BACKENDURL}/grindai/create-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          message: JSON.stringify(newMessage),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const newChat = {
          id: data.chat.id,
          message: data.chat.message,
          createdAt: data.chat.createdAt,
        };
        dispatch(setUserAllChats([newChat, ...userChatMessage]));
        getUserDetails();
        navigate(`c/${data.chat.id}`);
        setcreateChatLoading(false);
      } else {
        toast({
          title: "Error",
          description: "You Do Not Have Sufficent AI Credit",
          variant: "destructive",
        });
        setcreateChatLoading(false);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to create a new chat session. Please try again.",
        variant: "destructive",
      });
      setcreateChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setcreateChatLoading(true);
      handleSendMessage();
      setcreateChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col overflow-hidden">
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
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link
              to="/contest"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link
              to="/compiler"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Compiler
            </Link>
            <Link
              to="/grind-ai"
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600 hover:text-white"
            >
              Grind AI
            </Link>
            {/* <Link 
              to="/room" 
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Rooms
            </Link> */}
            <Link
              to="/you"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Profile
            </Link>
            <Link
              to="/premium"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Premium
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

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`${
            isSidebarOpen ? "w-72" : "w-0"
          } transition-all duration-300 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col overflow-hidden relative`}
        >
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2 mb-4">
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
          </div>

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {userChatLoading ? (
                <div className="text-center py-8 px-4">
                  <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    Loading chat history...
                  </p>
                </div>
              ) : (
                <div>
                  {userChatMessage.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">
                        No chat history yet
                      </p>
                    </div>
                  ) : (
                    userChatMessage.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => navigate(`c/${session.id}`)}
                        className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors 
                              ${
                                currentSessionId === session.id
                                  ? "bg-muted"
                                  : "hover:bg-muted/50"
                              }
                            `}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden relative pr-2">
                          <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="text-sm whitespace-nowrap overflow-hidden">
                            {JSON.parse(session.message)[0].content}
                          </span>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none group-hover:from-muted group-hover:via-muted/80"
                            style={{
                              background:
                                currentSessionId === session.id
                                  ? "linear-gradient(to left, hsl(var(--muted)), hsl(var(--muted) / 0.8), transparent)"
                                  : "linear-gradient(to left, hsl(var(--background)), hsl(var(--background) / 0.8), transparent)",
                            }}
                          />
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this conversation?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This chat and all its messages will be
                                permanently deleted. You won't be able to
                                recover it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep it</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => deleteSession(session.id, e)}
                              >
                                Delete forever
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/40 mb-8">
            {userCreditLoading ? (
              <Button
                variant="outline"
                className="w-full p-4 h-auto flex flex-col items-stretch gap-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 opacity-50"
                disabled
              >
                <div className="flex items-center justify-between w-full animate-pulse">
                  <span className="text-xs font-medium text-muted-foreground">
                    AI Credits
                  </span>
                  <div className="h-4 w-12 bg-muted rounded"></div>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden animate-pulse">
                  <div className="h-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full w-full"></div>
                </div>
                <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full p-4 h-auto flex flex-col items-stretch gap-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    AI Credits
                  </span>
                  <span className="text-sm font-bold text-blue-500">
                    {userDetails?.aitoken}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    style={{
                      width: `${(userDetails?.aitoken / userDetails?.maxaitoken) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  {userDetails?.aitoken} of {userDetails?.maxaitoken} credits
                  remaining
                </p>
                {userDetails?.aitoken === 0 ? (
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-red-500 font-medium">
                        You have exhausted your AI credits.
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                        onClick={() => navigate("/pricing")}
                      >
                        <Zap className="h-3 w-3 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Button>
            )}
          </div>

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
                      {" "}
                      Grind AI
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Your personal AI coding assistant. Get help with algorithms,
                    debugging, code reviews, and interview preparation.
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
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Try asking about...
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() =>
                        setInput("Explain how binary search works")
                      }
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">
                          Algorithm Explanation
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Explain how binary search works
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() => setInput("Help me solve Two Sum problem")}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">
                          Problem Solving
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Help me solve Two Sum problem
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() =>
                        setInput(
                          "What are the best practices for writing clean code?"
                        )
                      }
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">
                          Best Practices
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Best practices for clean code
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="border-border/40 bg-card/50 backdrop-blur cursor-pointer hover:border-blue-500/50 transition-colors text-left"
                      onClick={() =>
                        setInput("Explain time complexity with examples")
                      }
                    >
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">Concepts</p>
                        <p className="text-xs text-muted-foreground">
                          Explain Big O notation
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <></>
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
                  {createChatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
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
