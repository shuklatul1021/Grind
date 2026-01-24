import type { JwtPayload } from "jsonwebtoken";

export interface RoomUser {
  userId: string;
  username: string;
  socketId: string; // The unique socket ID (NOT the WebSocket object)
  isConnected: boolean;
  isReady: boolean;
  hasJoined: boolean;
  isFullscreen: boolean;
  isTabFocused: boolean;
  state:
    | "ACTIVE"
    | "KICKED"
    | "PENDING_REJOIN"
    | "REJOIN_APPROVED"
    | "SUBMITTED";
  violationCount: number;
  lastViolationReason?: "FULLSCREEN_EXIT" | "TAB_SWITCH" | "DISCONNECT";
  hasSubmitted: boolean;
  submissionTime?: number;
  joinedAt: number;
  lastActivityAt: number;
}

export interface RoomData {
  roomId: string;
  username: string; // Host username
  hostId: string;
  hostSocketId: string; // The unique socket ID of the host (NOT the WebSocket object)
  roomname: string;
  maxGuests: number;
  connectedCount: number;
  roomStatus: "WAITING" | "LIVE" | "ENDED";
  question: string;
  isPublic: boolean;
  duration: number; // Duration in minutes
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  users: RoomUser[];
}

export interface ClientConnection {
  ws: WebSocket;
  user: JwtPayload | null;
  roomId: string | null;
}
