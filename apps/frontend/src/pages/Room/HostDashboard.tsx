import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Separator } from "@repo/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/alert-dialog";
import {
  Users,
  Copy,
  Check,
  Clock,
  LogOut,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  Maximize,
  Minimize,
  Eye,
  EyeOff,
  BarChart3,
  Shield,
  UserPlus,
  Ban,
} from "lucide-react";
import { useRoomWebSocket } from "../../hooks/useRoomWebSocket";
import { toast } from "sonner";

interface Participant {
  userId: string;
  username: string;
  isConnected: boolean;
  isFullscreen: boolean;
  isTabFocused: boolean;
  violationCount: number;
  hasSubmitted: boolean;
  submissionTime?: number;
  joinedAt: number;
  lastActivityAt: number;
  state: "ACTIVE" | "KICKED" | "PENDING" | "SUBMITTED";
  lastViolationReason?: "FULLSCREEN_EXIT" | "TAB_SWITCH" | "DISCONNECT";
}

interface RoomData {
  roomId: string;
  roomname: string;
  roomStatus: "WAITING" | "LIVE" | "ENDED";
  connectedCount: number;
  maxGuests: number;
  duration: number;
  question: string;
}

export default function HostDashboard() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  // State
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pendingRequests, setPendingRequests] = useState<
    Array<{ userId: string; username: string }>
  >([]);
  const [violations, setViolations] = useState<
    Array<{
      id: string;
      userId: string;
      username: string;
      type: string;
      timestamp: number;
      count: number;
    }>
  >([]);
  const [selectedTab, setSelectedTab] = useState("participants");
  const [copiedCode, setCopiedCode] = useState(false);
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [userToKick, setUserToKick] = useState<{
    userId: string;
    username: string;
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Get user ID from localStorage (for future use)
  // const currentUserId = localStorage.getItem("userId") || "host-user";

  // WebSocket Connection - uses the persistent singleton connection from useRoomWebSocket
  const {
    isConnected,
    startRoom,
    endRoom,
    approveJoin,
    kickUser,
    getRoomStatus,
  } = useRoomWebSocket({
    // No autoConnect needed - we reuse the existing connection from RoomPage
    onConnected: (socketId) => {
      console.log("Host connected:", socketId);
      // Request room status immediately
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onJoinRequest: (data) => {
      console.log("Join request:", data);
      toast.info(`${data.username} wants to join the room`, {
        action: {
          label: "View",
          onClick: () => setSelectedTab("participants"),
        },
      });
      // Add to pending requests
      setPendingRequests((prev) => [
        ...prev,
        {
          userId: data.userId,
          username: data.username,
        },
      ]);
    },
    onUserJoined: (data) => {
      console.log("User joined:", data);
      toast.success(`${data.username} joined the room`);
      // Refresh room status
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onUserLeft: (data) => {
      console.log("User left:", data);
      toast.info(`${data.username} left the room`);
      // Refresh room status
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onUserDisconnected: (data) => {
      console.log("User disconnected:", data);
      toast.warning(`${data.username} disconnected`);
      // Refresh room status
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onViolationDetected: (data) => {
      console.log("Violation detected:", data);
      toast.error(`${data.username}: ${data.violationType}`, {
        description: `Violation count: ${data.violationCount}`,
      });
      // Add to violations list
      setViolations((prev) => [
        {
          id: Date.now().toString(),
          userId: data.userId,
          username: data.username,
          type: data.violationType,
          timestamp: data.timestamp,
          count: data.violationCount,
        },
        ...prev,
      ]);
      // Refresh room status
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onUserStatusUpdate: (data) => {
      console.log("User status update:", data);
      // Refresh room status
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onUserSubmitted: (data) => {
      console.log("User submitted:", data);
      toast.success(`${data.username} submitted their solution!`);
      // Refresh room status
      if (roomId) {
        getRoomStatus(roomId);
      }
    },
    onRoomStatus: (data) => {
      console.log("Room status received:", data);
      if (!data || !data.roomId) {
        console.error("Invalid room status data:", data);
        return;
      }
      setRoomData({
        roomId: data.roomId,
        roomname: data.roomname,
        roomStatus: data.roomStatus,
        connectedCount: data.connectedCount,
        maxGuests: data.maxGuests,
        duration: data.duration,
        question: data.question || "",
      });
      setParticipants(data.users || []);
    },
    onError: (message) => {
      console.error("WebSocket error:", message);
      toast.error(message);
    },
  });

  // Request room status periodically
  useEffect(() => {
    if (isConnected && roomId) {
      console.log("Requesting room status for:", roomId);
      // Initial request
      getRoomStatus(roomId);

      // Poll every 5 seconds
      const interval = setInterval(() => {
        console.log("Polling room status for:", roomId);
        getRoomStatus(roomId);
      }, 5000);

      return () => clearInterval(interval);
    } else {
      console.log(
        "Not requesting room status. isConnected:",
        isConnected,
        "roomId:",
        roomId,
      );
    }
  }, [isConnected, roomId, getRoomStatus]);

  // Timeout fallback - if no room data after 10 seconds, show error
  useEffect(() => {
    if (isConnected && roomId && !roomData) {
      const timeout = setTimeout(() => {
        if (!roomData) {
          toast.error("Failed to load room data. Room may not exist.");
          console.error("Timeout: No room data received after 10 seconds");
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, roomId, roomData]);

  // Timer for elapsed time
  useEffect(() => {
    if (roomData?.roomStatus === "LIVE") {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [roomData?.roomStatus]);

  const handleCopyRoomCode = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopiedCode(true);
      toast.success("Room code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleStartRoom = () => {
    if (roomId) {
      const success = startRoom(roomId);
      if (success) {
        toast.success("Room started!");
      }
    }
  };

  const handleEndRoom = () => {
    if (roomId) {
      const success = endRoom(roomId);
      if (success) {
        toast.success("Room ended");
        setTimeout(() => navigate("/room"), 2000);
      }
    }
  };

  const handleApproveJoin = (
    userId: string,
    username: string,
    approve: boolean,
  ) => {
    if (roomId) {
      const success = approveJoin(roomId, userId, approve);
      if (success) {
        setPendingRequests((prev) => prev.filter((r) => r.userId !== userId));
        if (approve) {
          toast.success(`${username} approved!`);
        } else {
          toast.info(`${username} rejected`);
        }
      }
    }
  };

  const handleKickUser = (userId: string, username: string) => {
    setUserToKick({ userId, username });
    setKickDialogOpen(true);
  };

  const confirmKickUser = () => {
    if (roomId && userToKick) {
      const success = kickUser(
        roomId,
        userToKick.userId,
        "Too many violations",
      );
      if (success) {
        toast.success(`${userToKick.username} has been removed`);
        setKickDialogOpen(false);
        setUserToKick(null);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getConnectionStatusColor = (isConnected: boolean) => {
    return isConnected ? "text-green-500" : "text-red-500";
  };

  const getFullscreenStatusIcon = (isFullscreen: boolean) => {
    return isFullscreen ? (
      <Maximize className="h-4 w-4 text-green-500" />
    ) : (
      <Minimize className="h-4 w-4 text-red-500" />
    );
  };

  const getTabFocusIcon = (isTabFocused: boolean) => {
    return isTabFocused ? (
      <Eye className="h-4 w-4 text-green-500" />
    ) : (
      <EyeOff className="h-4 w-4 text-red-500" />
    );
  };

  if (!roomData && isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading room data...</p>
          <p className="text-xs text-muted-foreground">Room ID: {roomId}</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/room")}>
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  if (!roomData && !isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-destructive mb-4">
            <WifiOff className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-muted-foreground">Not connected to server</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/room")}>
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/room")}>
              <LogOut className="mr-2 h-4 w-4" />
              Leave
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold">{roomData?.roomname || "Room"}</h1>
              <p className="text-xs text-muted-foreground">Host Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Room Code */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRoomCode}
              className="gap-2"
            >
              {copiedCode ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {roomId}
                </>
              )}
            </Button>

            {/* Timer */}
            {roomData?.roomStatus === "LIVE" && (
              <Badge variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(elapsedTime)}
              </Badge>
            )}

            {/* Connection Status */}
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
            </Badge>

            {/* Room Controls */}
            {roomData?.roomStatus === "WAITING" && (
              <Button
                size="sm"
                onClick={handleStartRoom}
                disabled={participants.length === 0}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Room
              </Button>
            )}
            {roomData?.roomStatus === "LIVE" && (
              <Button size="sm" variant="destructive" onClick={handleEndRoom}>
                <Pause className="mr-2 h-4 w-4" />
                End Room
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Stats */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      roomData?.roomStatus === "LIVE" ? "default" : "outline"
                    }
                  >
                    {roomData?.roomStatus || "WAITING"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Participants
                  </span>
                  <span className="font-semibold">
                    {roomData?.connectedCount || 0}/{roomData?.maxGuests || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Duration
                  </span>
                  <span className="font-semibold">
                    {roomData?.duration || 0} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Submitted
                  </span>
                  <span className="font-semibold">
                    {participants.filter((p) => p.hasSubmitted).length}/
                    {participants.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Violations
                  </span>
                  <span className="font-semibold text-red-500">
                    {violations.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <Card className="border-orange-500/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Join Requests ({pendingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.userId}
                          className="flex items-center justify-between p-2 rounded border"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {request.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {request.username}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleApproveJoin(
                                  request.userId,
                                  request.username,
                                  true,
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleApproveJoin(
                                  request.userId,
                                  request.username,
                                  false,
                                )
                              }
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="participants">
                  <Users className="mr-2 h-4 w-4" />
                  Participants ({participants.length})
                </TabsTrigger>
                <TabsTrigger value="violations">
                  <Shield className="mr-2 h-4 w-4" />
                  Violations ({violations.length})
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Participants Tab */}
              <TabsContent value="participants" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3">
                        {participants.map((participant) => (
                          <div
                            key={participant.userId}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>
                                  {participant.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {participant.username}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Joined{" "}
                                  {new Date(
                                    participant.joinedAt,
                                  ).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Status Indicators */}
                              <div className="flex items-center gap-2">
                                {participant.isConnected ? (
                                  <Wifi
                                    className={getConnectionStatusColor(true)}
                                  />
                                ) : (
                                  <WifiOff
                                    className={getConnectionStatusColor(false)}
                                  />
                                )}
                                {getFullscreenStatusIcon(
                                  participant.isFullscreen,
                                )}
                                {getTabFocusIcon(participant.isTabFocused)}
                              </div>

                              {/* Violations */}
                              {participant.violationCount > 0 && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  {participant.violationCount}
                                </Badge>
                              )}

                              {/* Submission Status */}
                              {participant.hasSubmitted ? (
                                <Badge variant="default">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Submitted
                                </Badge>
                              ) : (
                                <Badge variant="outline">Coding...</Badge>
                              )}

                              {/* Actions */}
                              {participant.state === "ACTIVE" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleKickUser(
                                      participant.userId,
                                      participant.username,
                                    )
                                  }
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Violations Tab */}
              <TabsContent value="violations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Violation History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3">
                        {violations.map((violation) => (
                          <div
                            key={violation.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div className="flex items-center gap-4">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <div>
                                <div className="font-medium">
                                  {violation.username}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {violation.type.replace("_", " ")}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                Count: {violation.count}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  violation.timestamp,
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        {violations.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No violations detected yet
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                              {participants.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Participants
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-500">
                              {
                                participants.filter((p) => p.hasSubmitted)
                                  .length
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Submitted
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-red-500">
                              {violations.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Violations
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Kick User Dialog */}
      <AlertDialog open={kickDialogOpen} onOpenChange={setKickDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToKick?.username} from the
              room? They will be disconnected immediately and won't be able to
              rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmKickUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
