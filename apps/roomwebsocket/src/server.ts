import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { CreateRoomID } from "./utils/createroom.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Room } from "./utils/room.js";
import type { RoomData, RoomUser } from "./types/type.js";
import { prisma } from "@repo/db/DatabaseClient";


const wss = new WebSocketServer({ port: 5050 });
/**
 * Todo:
 * Put Inside DB Radis As Well As 
 */
const socketConnections = new Map<string, WebSocket>();
const roomsMap = new Map<string, Room>();

const userSessionsMap = new Map<
  string,
  {
    userId: string;
    username: string;
    roomId: string | null;
    role: "HOST" | "PARTICIPANT";
    socketId: string;
    connectionTime: number;
  }
>();

const JWT_SECRET = process.env.USER_AUTH_JSON_WEB_TOKEN || "OnlyGrindAdminAuth";

/**
 * Authenticate user from JWT token
 */
function authenticateUser(
  token: string,
): (JwtPayload & { userId?: string; id?: string; username?: string }) | null {
  try {
    console.log("Verifying JWT token:", token);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId?: string;
      id?: string;
      username?: string;
    };
    // Backend sends 'id' field, normalize to 'userId'
    if (decoded.id && !decoded.userId) {
      decoded.userId = decoded.id;
    }
    // If no username, use email or set a default
    if (!decoded.username) {
      decoded.username = decoded.email || `User${decoded.userId?.slice(0, 6)}`;
    }
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

/**
 * Send message to specific socket
 */
function sendToSocket(socketId: string, message: any) {
  const ws = socketConnections.get(socketId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Broadcast message to all users in a room
 */
function broadcastToRoom(
  roomId: string,
  message: any,
  excludeSocketId?: string,
) {
  const room = roomsMap.get(roomId);
  if (!room) return;

  const roomData = room.getRoomData();
  roomData.users.forEach((user) => {
    if (user.socketId && user.socketId !== excludeSocketId) {
      sendToSocket(user.socketId, message);
    }
  });
}

/**
 * Notify host of room events
 */
function notifyHost(roomId: string, message: any) {
  const room = roomsMap.get(roomId);
  if (!room) return;

  const roomData = room.getRoomData();
  sendToSocket(roomData.hostSocketId, message);
}

// ============================================
// ROOM MANAGEMENT HANDLERS
// ============================================

/**
 * CREATE ROOM - Host creates a new proctored room
 */
async function handleCreateRoom(data: any, ws: WebSocket, socketId: string) {
  try {
    const { token, roomname, maxGuests, question, duration, isPublic } = data;

    // Authenticate host
    const user = authenticateUser(token);
    if (!user || !user.userId) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Authentication failed. Invalid token.",
      });
    }

    // Generate unique room ID
    const roomId = CreateRoomID();

    // Create room configuration
    const roomConfig: RoomData = {
      roomId,
      hostId: user.userId,
      hostSocketId: socketId,
      username: user.username || "Host",
      roomname,
      maxGuests: parseInt(maxGuests) || 10,
      question,
      duration: parseInt(duration) || 60,
      isPublic: isPublic || false,
      connectedCount: 0,
      roomStatus: "WAITING",
      createdAt: Date.now(),
      users: [],
    };

    // Create room instance
    const room = new Room(roomConfig);
    roomsMap.set(roomId, room);

    // Store host session
    userSessionsMap.set(socketId, {
      userId: user.userId,
      username: user.username || "Host",
      roomId,
      role: "HOST",
      socketId,
      connectionTime: Date.now(),
    });

    //TODO: Edit The Erorr Handing Page

    await prisma.room.create({
      data: {
        roomId,
        hostId: user.userId,
        roomname,
        maxGuests: parseInt(maxGuests) || 10,
        question,
        duration: parseInt(duration) || 60,
        isPublic: isPublic || false,
        connectedCount: 0,
        roomStatus: "WAITING",
        // endedAt : duration * 60 + Date.now().toLocaleString(),
      },
    });


    console.log(`[DB] Store room ${roomId} in database`);

    // Send success response to host
    sendToSocket(socketId, {
      type: "ROOM_CREATED",
      data: {
        roomId,
        roomname,
        maxGuests,
        duration,
        isPublic,
        message: "Room created successfully",
      },
    });

    console.log(`Room created: ${roomId} by host ${user.userId}`);
  } catch (err) {
    console.error("Error creating room:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to create room",
    });
  }
}

/**
 * JOIN ROOM - Participant requests to join room
 */
async function handleJoinRoom(data: any, ws: WebSocket, socketId: string) {
  try {
    const { token, roomId } = data;

    // Validate room ID
    if (!roomId) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room ID is required",
      });
    }

    // Authenticate user
    const user = authenticateUser(token);
    if (!user || !user.userId) {
      console.error(
        "Join room authentication failed. Token:",
        token?.substring(0, 20),
        "User:",
        user,
      );
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Authentication failed. Invalid token.",
      });
    }

    // Check if room exists
    const room = roomsMap.get(roomId);
    if (!room) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room not found or has ended",
      });
    }

    const roomData = room.getRoomData();

    // Check if room is full
    if (roomData.users.length >= roomData.maxGuests) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room is full",
      });
    }

    // Check if user is host
    if (roomData.hostId === user.userId) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Host cannot join as participant",
      });
    }

    // Check if user already in room
    const existingUser = roomData.users.find((u) => u.userId === user.userId);
    if (existingUser) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "You are already in this room",
      });
    }

    // Add user to pending state (waiting for host approval)
    const newUser: RoomUser = {
      userId: user.userId,
      username: user.username || "Participant",
      socketId,
      isConnected: false,
      isReady: false,
      hasJoined: false,
      isFullscreen: false,
      isTabFocused: true,
      state: "ACTIVE",
      violationCount: 0,
      hasSubmitted: false,
      joinedAt: Date.now(),
      lastActivityAt: Date.now(),
    };

    room.addUser(newUser);

    // Store user session
    userSessionsMap.set(socketId, {
      userId: user.userId,
      username: user.username || "Participant",
      roomId,
      role: "PARTICIPANT",
      socketId,
      connectionTime: Date.now(),
    });

    // Notify HOST that someone wants to join
    notifyHost(roomId, {
      type: "JOIN_REQUEST",
      data: {
        userId: user.userId,
        username: user.username,
        socketId,
        timestamp: Date.now(),
      },
    });

    // Send waiting response to participant
    sendToSocket(socketId, {
      type: "WAITING_APPROVAL",
      message: "Waiting for host approval to join the room",
      roomId,
    });

    await prisma.roomParticipant.create({
      data: {
        roomId,
        userId: user.userId,
        username: user.username || "Participant",
        isConnected: false,
        isReady: false,
        hasJoined: false,
        isFullscreen: false,
        isTabFocused: true,
        state: "ACTIVE",
        violationCount: 0,
        hasSubmitted: false,
      },
    });
    console.log(
      `[DB] TODO: Store join attempt for user ${user.userId} in room ${roomId}`,
    );

    console.log(`User ${user.userId} requested to join room ${roomId}`);
  } catch (err) {
    console.error("Error joining room:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to join room",
    });
  }
}

/**
 * APPROVE JOIN - Host approves participant join request
 */
async function handleApproveJoin(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId, approve } = data;

    // Verify host
    const session = userSessionsMap.get(socketId);
    if (!session || session.role !== "HOST") {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Only host can approve join requests",
      });
    }

    const room = roomsMap.get(roomId);
    if (!room) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room not found",
      });
    }

    const user = room.getUser(userId);
    if (!user) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "User not found",
      });
    }

    if (approve) {
      // Approve user entry
      user.isConnected = true;
      user.hasJoined = true;
      room.incrementConnectedCount();

      sendToSocket(user.socketId, {
        type: "JOIN_APPROVED",
        data: {
          roomId,
          roomname: room.getRoomData().roomname,
          question: room.getRoomData().question,
          duration: room.getRoomData().duration,
          hostName: room.getRoomData().username,
        },
      });

      // Broadcast to all participants that new user joined
      broadcastToRoom(
        roomId,
        {
          type: "USER_JOINED",
          data: {
            userId: user.userId,
            username: user.username,
            connectedCount: room.getRoomData().connectedCount,
          },
        },
        user.socketId,
      );

      await prisma.roomParticipant.update({
        data: {
          isConnected: true,
          hasJoined: true,
          joinedAt: new Date().toLocaleString(),
        },
        where: {
          roomId_userId: {
            roomId,
            userId,
          },
        },
      });
      console.log(
        `Update user ${userId} approval status in room ${roomId}`,
      );
      console.log(`User ${userId} approved to join room ${roomId}`);
    } else {
      // Reject user entry
      sendToSocket(user.socketId, {
        type: "JOIN_REJECTED",
        message: "Host rejected your join request",
      });

      // Remove user from room
      room.removeUser(userId);
      userSessionsMap.delete(user.socketId);

      // TODO: Update in DB
      // await db.roomJoinAttempt.update({ where: { userId_roomId: { userId, roomId } }, data: { status: 'REJECTED' } });
      console.log(
        `[DB] TODO: Store rejection for user ${userId} in room ${roomId}`,
      );

      console.log(`❌ User ${userId} rejected from room ${roomId}`);
    }
  } catch (err) {
    console.error("Error approving join:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to process approval",
    });
  }
}

/**
 * START ROOM - Host starts the coding session
 */
function handleStartRoom(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId } = data;

    // Verify host
    const session = userSessionsMap.get(socketId);
    if (!session || session.role !== "HOST") {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Only host can start the room",
      });
    }

    const room = roomsMap.get(roomId);
    if (!room) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room not found",
      });
    }

    // Start room
    room.startRoom();

    // Broadcast to all participants
    broadcastToRoom(roomId, {
      type: "ROOM_STARTED",
      data: {
        startTime: Date.now(),
        duration: room.getRoomData().duration,
        message: "Room has started. Good luck!",
      },
    });

    // Notify host
    sendToSocket(socketId, {
      type: "ROOM_STARTED",
      message: "Room started successfully",
    });

    // TODO: Update in DB
    // await db.room.update({ where: { roomId }, data: { status: 'LIVE', startedAt: new Date() } });
    console.log(`[DB] TODO: Update room ${roomId} status to LIVE`);

    console.log(`🚀 Room ${roomId} started`);
  } catch (err) {
    console.error("Error starting room:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to start room",
    });
  }
}

/**
 * LEAVE ROOM - User leaves room
 */
function handleLeaveRoom(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId } = data;

    const session = userSessionsMap.get(socketId);
    if (!session) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Session not found",
      });
    }

    const room = roomsMap.get(roomId);
    if (!room) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room not found",
      });
    }

    const user = room.getUser(userId);
    if (!user) {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "User not in room",
      });
    }

    // Mark user as disconnected
    user.isConnected = false;
    room.decrementConnectedCount();

    // Notify host
    notifyHost(roomId, {
      type: "USER_LEFT",
      data: {
        userId,
        username: user.username,
        reason: "User left voluntarily",
        connectedCount: room.getRoomData().connectedCount,
      },
    });

    // Broadcast to other participants
    broadcastToRoom(
      roomId,
      {
        type: "USER_LEFT",
        data: {
          userId,
          username: user.username,
          connectedCount: room.getRoomData().connectedCount,
        },
      },
      socketId,
    );

    // Remove user session
    userSessionsMap.delete(socketId);

    // Send confirmation
    sendToSocket(socketId, {
      type: "LEFT_ROOM",
      message: "You have left the room",
    });

    // TODO: Update in DB
    // await db.roomUser.update({ where: { userId_roomId: { userId, roomId } }, data: { isConnected: false, leftAt: new Date() } });
    console.log(`[DB] TODO: Update user ${userId} left room ${roomId}`);

    console.log(`👋 User ${userId} left room ${roomId}`);
  } catch (err) {
    console.error("Error leaving room:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to leave room",
    });
  }
}

// ============================================
// PROCTORING EVENT HANDLERS
// ============================================

/**
 * FULLSCREEN EXIT - User exited fullscreen mode
 */
function handleFullscreenExit(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Update user state
    user.isFullscreen = false;
    user.violationCount += 1;
    user.lastViolationReason = "FULLSCREEN_EXIT";
    user.lastActivityAt = Date.now();

    // Notify HOST immediately
    notifyHost(roomId, {
      type: "VIOLATION_DETECTED",
      data: {
        userId,
        username: user.username,
        violationType: "FULLSCREEN_EXIT",
        violationCount: user.violationCount,
        timestamp: Date.now(),
        message: `${user.username} exited fullscreen mode`,
      },
    });

    // TODO: Store violation in DB
    // await db.violation.create({ data: { roomId, userId, type: 'FULLSCREEN_EXIT', timestamp: new Date() } });
    console.log(
      `[DB] TODO: Store FULLSCREEN_EXIT violation for user ${userId} in room ${roomId}`,
    );

    console.log(
      `⚠️ Fullscreen exit detected: User ${userId} in room ${roomId}`,
    );
  } catch (err) {
    console.error("Error handling fullscreen exit:", err);
  }
}

/**
 * FULLSCREEN ENTER - User entered fullscreen mode
 */
function handleFullscreenEnter(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Update user state
    user.isFullscreen = true;
    user.lastActivityAt = Date.now();

    // Notify HOST
    notifyHost(roomId, {
      type: "USER_STATUS_UPDATE",
      data: {
        userId,
        username: user.username,
        isFullscreen: true,
        message: `${user.username} entered fullscreen`,
      },
    });

    console.log(`✅ Fullscreen entered: User ${userId} in room ${roomId}`);
  } catch (err) {
    console.error("Error handling fullscreen enter:", err);
  }
}

/**
 * TAB BLUR - User switched to another tab
 */
function handleTabBlur(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Update user state
    user.isTabFocused = false;
    user.violationCount += 1;
    user.lastViolationReason = "TAB_SWITCH";
    user.lastActivityAt = Date.now();

    // Notify HOST
    notifyHost(roomId, {
      type: "VIOLATION_DETECTED",
      data: {
        userId,
        username: user.username,
        violationType: "TAB_SWITCH",
        violationCount: user.violationCount,
        timestamp: Date.now(),
        message: `${user.username} switched to another tab`,
      },
    });

    // TODO: Store violation in DB
    // await db.violation.create({ data: { roomId, userId, type: 'TAB_SWITCH', timestamp: new Date() } });
    console.log(
      `[DB] TODO: Store TAB_SWITCH violation for user ${userId} in room ${roomId}`,
    );

    console.log(`⚠️ Tab switch detected: User ${userId} in room ${roomId}`);
  } catch (err) {
    console.error("Error handling tab blur:", err);
  }
}

/**
 * TAB FOCUS - User returned to the tab
 */
function handleTabFocus(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Update user state
    user.isTabFocused = true;
    user.lastActivityAt = Date.now();

    // Notify HOST
    notifyHost(roomId, {
      type: "USER_STATUS_UPDATE",
      data: {
        userId,
        username: user.username,
        isTabFocused: true,
        message: `${user.username} returned to tab`,
      },
    });

    console.log(`Tab focused: User ${userId} in room ${roomId}`);
  } catch (err) {
    console.error("Error handling tab focus:", err);
  }
}

/**
 * CODE CHANGE - User is typing code
 */
function handleCodeChange(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId, code, language } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Update activity timestamp
    user.lastActivityAt = Date.now();

    // Notify HOST (optional: can be throttled)
    notifyHost(roomId, {
      type: "CODE_ACTIVITY",
      data: {
        userId,
        username: user.username,
        timestamp: Date.now(),
        codeLength: code?.length || 0,
      },
    });

    // TODO: Store code snapshot in DB (throttled)
    // Throttle: only store every 10 seconds or on significant changes
    // await db.codeSnapshot.create({ data: { roomId, userId, code, language, timestamp: new Date() } });
    console.log(
      `[DB] TODO: Store code snapshot for user ${userId} in room ${roomId}`,
    );
  } catch (err) {
    console.error("Error handling code change:", err);
  }
}

/**
 * SUBMIT CODE - User submits their solution
 */
function handleSubmitCode(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId, code, language } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Mark as submitted
    user.hasSubmitted = true;
    user.submissionTime = Date.now();
    user.state = "SUBMITTED";

    // Notify HOST
    notifyHost(roomId, {
      type: "USER_SUBMITTED",
      data: {
        userId,
        username: user.username,
        submissionTime: user.submissionTime,
        code,
        language,
      },
    });

    // Send confirmation to user
    sendToSocket(socketId, {
      type: "SUBMISSION_RECEIVED",
      message: "Your code has been submitted successfully",
    });

    // TODO: Store submission in DB
    // await db.submission.create({ data: { roomId, userId, code, language, submittedAt: new Date() } });
    console.log(
      `[DB] TODO: Store submission for user ${userId} in room ${roomId}`,
    );

    console.log(`User ${userId} submitted code in room ${roomId}`);
  } catch (err) {
    console.error("Error handling submit code:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to submit code",
    });
  }
}

/**
 * KICK USER - Host kicks a participant
 */
function handleKickUser(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId, reason } = data;

    // Verify host
    const session = userSessionsMap.get(socketId);
    if (!session || session.role !== "HOST") {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Only host can kick users",
      });
    }

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (!user) return;

    // Mark user as kicked
    user.state = "KICKED";
    user.isConnected = false;

    // Notify the kicked user
    sendToSocket(user.socketId, {
      type: "KICKED",
      message: `You have been removed from the room. Reason: ${reason || "Violation of rules"}`,
    });

    // Close their connection
    const kickedWs = socketConnections.get(user.socketId);
    if (kickedWs) {
      kickedWs.close();
    }

    // Remove from room
    room.removeUser(userId);
    room.decrementConnectedCount();

    // Broadcast to room
    broadcastToRoom(roomId, {
      type: "USER_KICKED",
      data: {
        userId,
        username: user.username,
        reason,
      },
    });

    // TODO: Store kick event in DB
    // await db.kickEvent.create({ data: { roomId, userId, reason, kickedAt: new Date() } });
    console.log(
      `[DB] TODO: Store kick event for user ${userId} in room ${roomId}`,
    );

    console.log(`User ${userId} kicked from room ${roomId}`);
  } catch (err) {
    console.error("Error kicking user:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to kick user",
    });
  }
}

/**
 * END ROOM - Host ends the session
 */
function handleEndRoom(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId } = data;

    // Verify host
    const session = userSessionsMap.get(socketId);
    if (!session || session.role !== "HOST") {
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Only host can end the room",
      });
    }

    const room = roomsMap.get(roomId);
    if (!room) return;

    // End room
    room.endRoom();

    // Broadcast to all participants
    broadcastToRoom(roomId, {
      type: "ROOM_ENDED",
      message: "The room has been ended by the host",
    });

    // Close all participant connections
    const roomData = room.getRoomData();
    roomData.users.forEach((user) => {
      const userWs = socketConnections.get(user.socketId);
      if (userWs) {
        userWs.close();
      }
      userSessionsMap.delete(user.socketId);
    });

    // Remove room
    roomsMap.delete(roomId);

    // TODO: Update in DB
    // await db.room.update({ where: { roomId }, data: { status: 'ENDED', endedAt: new Date() } });
    console.log(`[DB] TODO: Update room ${roomId} status to ENDED`);

    console.log(`🏁 Room ${roomId} ended`);
  } catch (err) {
    console.error("Error ending room:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to end room",
    });
  }
}

/**
 * GET ROOM STATUS - Get current room state
 */
function handleGetRoomStatus(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId } = data;

    console.log(
      `[GET_ROOM_STATUS] Request for room: ${roomId} from socket: ${socketId}`,
    );

    const room = roomsMap.get(roomId);
    if (!room) {
      console.error(`[GET_ROOM_STATUS] Room not found: ${roomId}`);
      console.log(
        `[GET_ROOM_STATUS] Available rooms:`,
        Array.from(roomsMap.keys()),
      );
      return sendToSocket(socketId, {
        type: "ERROR",
        message: "Room not found",
      });
    }

    const roomData = room.getRoomData();
    console.log(`[GET_ROOM_STATUS] Sending room data for ${roomId}:`, {
      roomId: roomData.roomId,
      roomname: roomData.roomname,
      status: roomData.roomStatus,
      users: roomData.users.length,
    });

    sendToSocket(socketId, {
      type: "ROOM_STATUS",
      data: {
        roomId: roomData.roomId,
        roomname: roomData.roomname,
        roomStatus: roomData.roomStatus,
        connectedCount: roomData.connectedCount,
        maxGuests: roomData.maxGuests,
        duration: roomData.duration,
        question: roomData.question,
        users: roomData.users.map((u) => ({
          userId: u.userId,
          username: u.username,
          isConnected: u.isConnected,
          isFullscreen: u.isFullscreen,
          isTabFocused: u.isTabFocused,
          violationCount: u.violationCount,
          hasSubmitted: u.hasSubmitted,
          state: u.state,
        })),
      },
    });
  } catch (err) {
    console.error("Error getting room status:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Failed to get room status",
    });
  }
}

/**
 * HEARTBEAT - Keep connection alive
 */
function handleHeartbeat(data: any, ws: WebSocket, socketId: string) {
  try {
    const { roomId, userId } = data;

    const room = roomsMap.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (user) {
      user.lastActivityAt = Date.now();
    }

    sendToSocket(socketId, { type: "PONG" });
  } catch (err) {
    console.error("Error handling heartbeat:", err);
  }
}

// ============================================
// MESSAGE ROUTER
// ============================================

function handleMessage(
  messageType: string,
  data: any,
  ws: WebSocket,
  socketId: string,
) {
  try {
    console.log(`Message received: ${messageType} from ${socketId}`);

    switch (messageType) {
      case "CREATE_ROOM":
        handleCreateRoom(data, ws, socketId);
        break;
      case "JOIN_ROOM":
        handleJoinRoom(data, ws, socketId);
        break;
      case "APPROVE_JOIN":
        handleApproveJoin(data, ws, socketId);
        break;
      case "START_ROOM":
        handleStartRoom(data, ws, socketId);
        break;
      case "LEAVE_ROOM":
        handleLeaveRoom(data, ws, socketId);
        break;
      case "END_ROOM":
        handleEndRoom(data, ws, socketId);
        break;
      case "GET_ROOM_STATUS":
        handleGetRoomStatus(data, ws, socketId);
        break;

      // Proctoring Events
      case "FULLSCREEN_EXIT":
        handleFullscreenExit(data, ws, socketId);
        break;
      case "FULLSCREEN_ENTER":
        handleFullscreenEnter(data, ws, socketId);
        break;
      case "TAB_BLUR":
        handleTabBlur(data, ws, socketId);
        break;
      case "TAB_FOCUS":
        handleTabFocus(data, ws, socketId);
        break;

      // Code Events
      case "CODE_CHANGE":
        handleCodeChange(data, ws, socketId);
        break;
      case "SUBMIT_CODE":
        handleSubmitCode(data, ws, socketId);
        break;

      // Host Actions
      case "KICK_USER":
        handleKickUser(data, ws, socketId);
        break;

      // Connection Management
      case "HEARTBEAT":
        handleHeartbeat(data, ws, socketId);
        break;

      default:
        sendToSocket(socketId, {
          type: "ERROR",
          message: `Unknown message type: ${messageType}`,
        });
    }
  } catch (err) {
    console.error("Error handling message:", err);
    sendToSocket(socketId, {
      type: "ERROR",
      message: "Internal server error",
    });
  }
}

// ============================================
// WEBSOCKET SERVER
// ============================================

wss.on("connection", (ws: WebSocket) => {
  // Generate unique socket ID
  const socketId = uuidv4();
  (ws as any).socketId = socketId;

  // Store connection in map
  socketConnections.set(socketId, ws);

  console.log(`New connection: ${socketId}`);

  // Send connection confirmation
  ws.send(
    JSON.stringify({
      type: "CONNECTED",
      socketId,
      message: "Connected to Room WebSocket Server",
    }),
  );

  // Handle incoming messages
  ws.on("message", (data: Buffer) => {
    try {
      const parsedData = JSON.parse(data.toString());
      const messageType = parsedData.type;

      if (!messageType) {
        return ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "Message type is required",
          }),
        );
      }
      console.log("Message type:", parsedData);

      handleMessage(messageType, parsedData, ws, socketId);
    } catch (err) {
      console.error("Error parsing message:", err);
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid message format. Expected JSON.",
        }),
      );
    }
  });

  // Handle connection close
  ws.on("close", () => {
    console.log(`Connection closed: ${socketId}`);

    // Get user session
    const session = userSessionsMap.get(socketId);

    if (session && session.roomId) {
      const room = roomsMap.get(session.roomId);

      if (room) {
        const user = room.getUser(session.userId);

        if (user) {
          // Mark as disconnected
          user.isConnected = false;
          user.lastViolationReason = "DISCONNECT";
          room.decrementConnectedCount();

          // Notify host
          notifyHost(session.roomId, {
            type: "USER_DISCONNECTED",
            data: {
              userId: session.userId,
              username: session.username,
              reason: "Connection lost",
              connectedCount: room.getRoomData().connectedCount,
            },
          });

          // TODO: Update in DB
          // await db.roomUser.update({ where: { userId_roomId: { userId: session.userId, roomId: session.roomId } }, data: { isConnected: false } });
          console.log(
            `[DB] TODO: Update user ${session.userId} disconnected in room ${session.roomId}`,
          );
        }
      }
    }

    // Cleanup
    socketConnections.delete(socketId);
    userSessionsMap.delete(socketId);
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error(`WebSocket error for ${socketId}:`, error);
  });
});

// Cleanup stale connections every 30 seconds
setInterval(() => {
  userSessionsMap.forEach((session, socketId) => {
    const ws = socketConnections.get(socketId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // Connection is dead, cleanup
      socketConnections.delete(socketId);
      userSessionsMap.delete(socketId);
    }
  });
}, 30000);

console.log("WebSocket server is running on ws://localhost:5050");
console.log("Ready to accept room connections...");
