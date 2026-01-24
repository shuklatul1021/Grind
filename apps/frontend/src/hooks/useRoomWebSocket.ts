import { useEffect, useState, useCallback } from "react";

interface UseRoomWebSocketOptions {
  onConnected?: (socketId: string) => void;
  onRoomCreated?: (data: any) => void;
  onJoinRequest?: (data: any) => void;
  onJoinApproved?: (data: any) => void;
  onJoinRejected?: (message: string) => void;
  onUserJoined?: (data: any) => void;
  onUserLeft?: (data: any) => void;
  onUserDisconnected?: (data: any) => void;
  onViolationDetected?: (data: any) => void;
  onUserStatusUpdate?: (data: any) => void;
  onCodeActivity?: (data: any) => void;
  onUserSubmitted?: (data: any) => void;
  onRoomStarted?: (data: any) => void;
  onRoomEnded?: (message: string) => void;
  onKicked?: (message: string) => void;
  onUserKicked?: (data: any) => void;
  onRoomStatus?: (data: any) => void;
  onError?: (message: string) => void;
  autoConnect?: boolean;
}

let globalWs: WebSocket | null = null;
let globalSocketId: string | null = null;
let globalHeartbeatInterval: ReturnType<typeof setInterval> | null = null;
let globalReconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let globalConnectionAttempts = 0;
let globalIsConnected = false;

let activeCallbacks: Partial<UseRoomWebSocketOptions> = {};
const stateListeners: Set<() => void> = new Set();

function notifyStateListeners() {
  stateListeners.forEach((listener) => listener());
}

function globalConnect() {
  if (globalWs?.readyState === WebSocket.OPEN) {
    console.log("[GlobalWS] Already connected");
    return;
  }

  if (globalWs?.readyState === WebSocket.CONNECTING) {
    console.log("[GlobalWS] Connection in progress...");
    return;
  }

  try {
    console.log("[GlobalWS] Connecting to Room WebSocket...");
    globalWs = new WebSocket("ws://localhost:5050");

    globalWs.onopen = () => {
      console.log("[GlobalWS] Connected to room websocket");
      globalIsConnected = true;
      globalConnectionAttempts = 0;
      notifyStateListeners();

      if (globalHeartbeatInterval) {
        clearInterval(globalHeartbeatInterval);
      }
      globalHeartbeatInterval = setInterval(() => {
        if (globalWs?.readyState === WebSocket.OPEN) {
          globalWs.send(JSON.stringify({ type: "HEARTBEAT" }));
        }
      }, 30000);
    };

    globalWs.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("[GlobalWS] Received:", message);

        switch (message.type) {
          case "CONNECTED":
            globalSocketId = message.socketId;
            notifyStateListeners();
            activeCallbacks.onConnected?.(message.socketId);
            break;

          case "ROOM_CREATED":
            activeCallbacks.onRoomCreated?.(message.data);
            break;

          case "JOIN_REQUEST":
            activeCallbacks.onJoinRequest?.(message.data);
            break;

          case "WAITING_APPROVAL":
            console.log("[GlobalWS] Waiting for host approval...");
            break;

          case "JOIN_APPROVED":
            activeCallbacks.onJoinApproved?.(message.data);
            break;

          case "JOIN_REJECTED":
            activeCallbacks.onJoinRejected?.(message.message);
            break;

          case "USER_JOINED":
            activeCallbacks.onUserJoined?.(message.data);
            break;

          case "USER_LEFT":
            activeCallbacks.onUserLeft?.(message.data);
            break;

          case "USER_DISCONNECTED":
            activeCallbacks.onUserDisconnected?.(message.data);
            break;

          case "VIOLATION_DETECTED":
            activeCallbacks.onViolationDetected?.(message.data);
            break;

          case "USER_STATUS_UPDATE":
            activeCallbacks.onUserStatusUpdate?.(message.data);
            break;

          case "CODE_ACTIVITY":
            activeCallbacks.onCodeActivity?.(message.data);
            break;

          case "USER_SUBMITTED":
            activeCallbacks.onUserSubmitted?.(message.data);
            break;

          case "ROOM_STARTED":
            activeCallbacks.onRoomStarted?.(message.data);
            break;

          case "ROOM_ENDED":
            activeCallbacks.onRoomEnded?.(message.message);
            break;

          case "KICKED":
            activeCallbacks.onKicked?.(message.message);
            globalDisconnect();
            break;

          case "USER_KICKED":
            activeCallbacks.onUserKicked?.(message.data);
            break;

          case "ROOM_STATUS":
            activeCallbacks.onRoomStatus?.(message.data);
            break;

          case "PONG":
            // Heartbeat response
            break;

          case "ERROR":
            console.error("[GlobalWS] Server error:", message.message);
            activeCallbacks.onError?.(message.message);
            break;

          default:
            console.log("[GlobalWS] Unknown message type:", message.type);
        }
      } catch (err) {
        console.error("[GlobalWS] Error parsing websocket message:", err);
      }
    };

    globalWs.onclose = () => {
      console.log("[GlobalWS] Disconnected from room websocket");
      globalIsConnected = false;
      globalSocketId = null;
      notifyStateListeners();

      // Clear heartbeat
      if (globalHeartbeatInterval) {
        clearInterval(globalHeartbeatInterval);
        globalHeartbeatInterval = null;
      }

      // Auto reconnect with exponential backoff (only if was previously connected)
      if (globalConnectionAttempts < 5 && globalConnectionAttempts > 0) {
        const delay = Math.min(1000 * Math.pow(2, globalConnectionAttempts), 30000);
        console.log(`[GlobalWS] Reconnecting in ${delay}ms...`);
        globalConnectionAttempts++;

        globalReconnectTimeout = setTimeout(() => {
          globalConnect();
        }, delay);
      }
    };

    globalWs.onerror = (error) => {
      console.error("[GlobalWS] WebSocket error:", error);
      activeCallbacks.onError?.("WebSocket connection error");
    };
  } catch (err) {
    console.error("[GlobalWS] Failed to connect:", err);
    activeCallbacks.onError?.("Failed to establish connection");
  }
}

function globalDisconnect() {
  if (globalReconnectTimeout) {
    clearTimeout(globalReconnectTimeout);
    globalReconnectTimeout = null;
  }
  if (globalHeartbeatInterval) {
    clearInterval(globalHeartbeatInterval);
    globalHeartbeatInterval = null;
  }
  if (globalWs) {
    globalWs.close();
    globalWs = null;
  }
  globalIsConnected = false;
  globalSocketId = null;
  globalConnectionAttempts = 0;
  notifyStateListeners();
}

function globalSendMessage(type: string, data: any = {}): boolean {
  if (globalWs && globalWs.readyState === WebSocket.OPEN) {
    globalWs.send(JSON.stringify({ type, ...data }));
    return true;
  } else {
    console.error("[GlobalWS] WebSocket is not connected");
    activeCallbacks.onError?.("WebSocket is not connected");
    return false;
  }
}

// ============== REACT HOOK ==============
export const useRoomWebSocket = (options: UseRoomWebSocketOptions = {}) => {
  const { autoConnect = false, ...callbacks } = options;

  // Local state that syncs with global state
  const [isConnected, setIsConnected] = useState(globalIsConnected);
  const [socketId, setSocketId] = useState<string | null>(globalSocketId);
  const [connectionAttempts, setConnectionAttempts] = useState(globalConnectionAttempts);

  // Update active callbacks when this component mounts/updates
  useEffect(() => {
    activeCallbacks = callbacks;
  }, [callbacks]);

  // Subscribe to global state changes
  useEffect(() => {
    const listener = () => {
      setIsConnected(globalIsConnected);
      setSocketId(globalSocketId);
      setConnectionAttempts(globalConnectionAttempts);
    };
    stateListeners.add(listener);

    // Sync initial state
    listener();

    return () => {
      stateListeners.delete(listener);
    };
  }, []);

  // Auto connect on mount if requested
  useEffect(() => {
    if (autoConnect && !globalIsConnected && globalWs?.readyState !== WebSocket.CONNECTING) {
      console.log("[useRoomWebSocket] Auto-connecting...");
      globalConnect();
    }
    // NOTE: We do NOT disconnect on unmount - connection persists!
  }, [autoConnect]);

  // Wrapper functions that use global functions
  const connect = useCallback(() => {
    globalConnect();
  }, []);

  const disconnect = useCallback(() => {
    globalDisconnect();
  }, []);

  const sendMessage = useCallback((type: string, data: any = {}) => {
    return globalSendMessage(type, data);
  }, []);

  // Room Management Functions
  const createRoom = useCallback(
    (token: string, roomConfig: {
      roomname: string;
      maxGuests: number;
      question: string;
      duration: number;
      isPublic: boolean;
    }) => {
      return sendMessage("CREATE_ROOM", { token, ...roomConfig });
    },
    [sendMessage]
  );

  const joinRoom = useCallback(
    (token: string, roomId: string) => {
      return sendMessage("JOIN_ROOM", { token, roomId });
    },
    [sendMessage]
  );

  const approveJoin = useCallback(
    (roomId: string, userId: string, approve: boolean) => {
      return sendMessage("APPROVE_JOIN", { roomId, userId, approve });
    },
    [sendMessage]
  );

  const startRoom = useCallback(
    (roomId: string) => {
      return sendMessage("START_ROOM", { roomId });
    },
    [sendMessage]
  );

  const leaveRoom = useCallback(
    (roomId: string, userId: string) => {
      return sendMessage("LEAVE_ROOM", { roomId, userId });
    },
    [sendMessage]
  );

  const endRoom = useCallback(
    (roomId: string) => {
      return sendMessage("END_ROOM", { roomId });
    },
    [sendMessage]
  );

  const getRoomStatus = useCallback(
    (roomId: string) => {
      return sendMessage("GET_ROOM_STATUS", { roomId });
    },
    [sendMessage]
  );

  // Proctoring Events
  const reportFullscreenExit = useCallback(
    (roomId: string, userId: string) => {
      return sendMessage("FULLSCREEN_EXIT", { roomId, userId });
    },
    [sendMessage]
  );

  const reportFullscreenEnter = useCallback(
    (roomId: string, userId: string) => {
      return sendMessage("FULLSCREEN_ENTER", { roomId, userId });
    },
    [sendMessage]
  );

  const reportTabBlur = useCallback(
    (roomId: string, userId: string) => {
      return sendMessage("TAB_BLUR", { roomId, userId });
    },
    [sendMessage]
  );

  const reportTabFocus = useCallback(
    (roomId: string, userId: string) => {
      return sendMessage("TAB_FOCUS", { roomId, userId });
    },
    [sendMessage]
  );

  // Code Events
  const reportCodeChange = useCallback(
    (roomId: string, userId: string, code: string, language: string) => {
      return sendMessage("CODE_CHANGE", { roomId, userId, code, language });
    },
    [sendMessage]
  );

  const submitCode = useCallback(
    (roomId: string, userId: string, code: string, language: string) => {
      return sendMessage("SUBMIT_CODE", { roomId, userId, code, language });
    },
    [sendMessage]
  );

  // Host Actions
  const kickUser = useCallback(
    (roomId: string, userId: string, reason: string) => {
      return sendMessage("KICK_USER", { roomId, userId, reason });
    },
    [sendMessage]
  );

  return {
    // Connection state
    isConnected,
    socketId,
    connectionAttempts,

    // Connection control
    connect,
    disconnect,

    // Room Management
    createRoom,
    joinRoom,
    approveJoin,
    startRoom,
    leaveRoom,
    endRoom,
    getRoomStatus,

    // Proctoring
    reportFullscreenExit,
    reportFullscreenEnter,
    reportTabBlur,
    reportTabFocus,

    // Code Events
    reportCodeChange,
    submitCode,

    // Host Actions
    kickUser,
  };
};
