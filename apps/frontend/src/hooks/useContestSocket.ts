import { useEffect, useState } from "react";

import type { ContestLeaderboardEntry } from "../types/contest";
import { CONTEST_WS_URL } from "../utils/urls";

type ContestSocketMessage =
  | {
      type: "leaderboard_update";
      data?: {
        leaderboard?: ContestLeaderboardEntry[];
        currentUser?: ContestLeaderboardEntry | null;
      };
    }
  | {
      type: "participant_sync";
      data?: {
        rank?: number | null;
        score?: number | null;
      };
    }
  | {
      type: "error";
      message?: string;
    };

type UseContestSocketOptions = {
  contestId?: string;
  token?: string;
  onLeaderboardUpdate?: (
    leaderboard: ContestLeaderboardEntry[],
    currentUser: ContestLeaderboardEntry | null,
  ) => void;
  onParticipantSync?: (payload: { rank?: number | null; score?: number | null }) => void;
  onError?: (message: string) => void;
};

export function useContestSocket(options: UseContestSocketOptions) {
  const { contestId, token, onLeaderboardUpdate, onParticipantSync, onError } =
    options;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!contestId || !token) {
      return;
    }

    let isCancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let socket: WebSocket | null = null;

    const clearTimers = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
      }
      reconnectTimer = null;
      heartbeatTimer = null;
    };

    const connect = () => {
      socket = new WebSocket(CONTEST_WS_URL);

      socket.onopen = () => {
        setIsConnected(true);
        socket?.send(
          JSON.stringify({
            type: "subscribe_contest",
            token,
            contestId,
          }),
        );

        heartbeatTimer = setInterval(() => {
          socket?.send(
            JSON.stringify({
              type: "ping",
              contestId,
            }),
          );
        }, 20_000);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as ContestSocketMessage;

          switch (message.type) {
            case "leaderboard_update":
              onLeaderboardUpdate?.(
                message.data?.leaderboard ?? [],
                message.data?.currentUser ?? null,
              );
              break;
            case "participant_sync":
              onParticipantSync?.({
                rank: message.data?.rank ?? null,
                score: message.data?.score ?? null,
              });
              break;
            case "error":
              onError?.(message.message || "Contest websocket error.");
              break;
          }
        } catch {
          onError?.("Could not parse contest websocket message.");
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        clearTimers();

        if (!isCancelled) {
          reconnectTimer = setTimeout(connect, 2_000);
        }
      };

      socket.onerror = () => {
        onError?.("Contest websocket connection error.");
      };
    };

    connect();

    return () => {
      isCancelled = true;
      clearTimers();
      setIsConnected(false);
      socket?.close();
    };
  }, [contestId, token, onError, onLeaderboardUpdate, onParticipantSync]);

  return {
    isConnected,
  };
}
