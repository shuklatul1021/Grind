import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useTheme } from "../../contexts/ThemeContext";
import {
  SquareChevronRight,
  Sun,
  Moon,
  LogOut,
  Plus,
  Users,
  Lock,
  Globe,
  Clock,
  Code,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";

export default function RoomsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"create" | "join">("join");

  // Create Room State
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("60");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState("");

  // Join Room State
  const [roomCode, setRoomCode] = useState("");

  const handleSignOut = () => {
    navigate("/auth");
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to create room
    console.log({
      roomName,
      roomDescription,
      maxParticipants,
      difficulty,
      duration,
      isPrivate,
      selectedProblem,
    });
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to join room
    console.log({ roomCode });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
          <div
            className="flex cursor-pointer items-center gap-2 ml-6"
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
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Grind AI
            </Link>
            <Link
              to="/learning"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Learning
            </Link>
            <Link
              to="/room"
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600 hover:text-white"
            >
              Rooms
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={""} alt="@user" />
                    <AvatarFallback>{"G"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/you")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-1 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Coding
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                Rooms
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create private coding rooms with custom problems or join existing
              rooms to compete with other developers
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={activeTab === "join" ? "default" : "outline"}
              onClick={() => setActiveTab("join")}
              className="px-8"
            >
              <Users className="mr-2 h-4 w-4" />
              Join Room
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              className="px-8"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </div>

          {/* Content Area */}
          <div className="max-w-2xl mx-auto">
            {activeTab === "join" ? (
              // Join Room Card
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Join a Room
                  </CardTitle>
                  <CardDescription>
                    Enter the room code shared by the host to join an active
                    coding session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinRoom} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="roomCode">Room Code</Label>
                      <Input
                        id="roomCode"
                        placeholder="Enter 6-digit room code (e.g., ABC123)"
                        value={roomCode}
                        onChange={(e) =>
                          setRoomCode(e.target.value.toUpperCase())
                        }
                        maxLength={6}
                        className="text-center text-2xl font-mono tracking-widest"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Ask the room host for the code
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" onClick={()=>navigate("join")}>
                      <Users className="mr-2 h-4 w-4" />
                      Join Room
                    </Button>
                  </form>

                  {/* Info Section */}
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
                    <p className="text-sm font-medium">What to expect:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Solve coding problems in real-time</li>
                      <li>• Compete with other participants</li>
                      <li>• See live leaderboard rankings</li>
                      <li>• Submit solutions and get instant feedback</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Create Room Card
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-500" />
                    Create a Room
                  </CardTitle>
                  <CardDescription>
                    Set up a new coding room and invite participants to compete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRoom} className="space-y-6">
                    {/* Room Name */}
                    <div className="space-y-2">
                      <Label htmlFor="roomName">Room Name *</Label>
                      <Input
                        id="roomName"
                        placeholder="e.g., Algorithm Practice Session"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Room Description */}
                    <div className="space-y-2">
                      <Label htmlFor="roomDescription">Description</Label>
                      <Textarea
                        id="roomDescription"
                        placeholder="What will participants be solving?"
                        value={roomDescription}
                        onChange={(e) => setRoomDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Select Problem */}
                    <div className="space-y-2">
                      <Label htmlFor="problem">Select Problem *</Label>
                      <Select
                        value={selectedProblem}
                        onValueChange={setSelectedProblem}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a problem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="two-sum">Two Sum</SelectItem>
                          <SelectItem value="reverse-string">
                            Reverse String
                          </SelectItem>
                          <SelectItem value="valid-parentheses">
                            Valid Parentheses
                          </SelectItem>
                          <SelectItem value="merge-sorted-arrays">
                            Merge Sorted Arrays
                          </SelectItem>
                          <SelectItem value="binary-search">
                            Binary Search
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Grid Layout for Small Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Difficulty */}
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={difficulty}
                          onValueChange={setDifficulty}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Max Participants */}
                      <div className="space-y-2">
                        <Label htmlFor="maxParticipants">
                          Max Participants
                        </Label>
                        <Select
                          value={maxParticipants}
                          onValueChange={setMaxParticipants}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Users</SelectItem>
                            <SelectItem value="10">10 Users</SelectItem>
                            <SelectItem value="20">20 Users</SelectItem>
                            <SelectItem value="50">50 Users</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="duration"
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Duration (minutes)
                      </Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Minutes</SelectItem>
                          <SelectItem value="60">60 Minutes</SelectItem>
                          <SelectItem value="90">90 Minutes</SelectItem>
                          <SelectItem value="120">120 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Room Privacy */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-muted/20">
                      <div className="flex items-center gap-3">
                        {isPrivate ? (
                          <Lock className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Globe className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <Label className="text-base">
                            {isPrivate ? "Private Room" : "Public Room"}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {isPrivate
                              ? "Only users with the code can join"
                              : "Anyone can discover and join"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPrivate(!isPrivate)}
                      >
                        {isPrivate ? "Make Public" : "Make Private"}
                      </Button>
                    </div>

                    <Button type="submit" className="w-full" size="lg" onClick={()=> navigate("create")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Room
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Custom Problems</h3>
                <p className="text-sm text-muted-foreground">
                  Select from our problem library or add your own challenges
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  See participants join and compete in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Timed Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Set time limits and create competitive pressure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
