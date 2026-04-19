import { WebSocketServer, WebSocket } from "ws";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { prisma } from "@repo/db/DatabaseClient";

const port = Number(process.env.PORT || 5051);
const wss = new WebSocketServer({ port });

const sockets = new Map<string, WebSocket>();
const socketSessions = new Map<
  string,
  {
    contestId: string;
    userId: string;
    participantId: string;
  }
>();
const contestSubscribers = new Map<string, Set<string>>();

function send(ws: WebSocket, payload: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function sendError(ws: WebSocket, message: string) {
  send(ws, {
    type: "error",
    message,
  });
}

function readJwt(token: string) {
  try {
    const payload = jwt.verify(
      token,
      process.env.USER_AUTH_JSON_WEB_TOKEN!,
    ) as JwtPayload;

    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
}

async function buildLeaderboardPayload(contestId: string, userId?: string) {
  const [leaderboard, currentUser] = await Promise.all([
    prisma.leaderBoard.findMany({
      where: {
        contestId,
      },
      orderBy: {
        rank: "asc",
      },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    }),
    userId
      ? prisma.leaderBoard.findUnique({
          where: {
            contestId_userId: {
              contestId,
              userId,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                avatar: true,
              },
            },
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    leaderboard: leaderboard.map((entry) => ({
      userId: entry.userId,
      rank: entry.rank,
      score: entry.score,
      solvedCount: entry.solvedCount,
      penalty: entry.penalty,
      lastSubmissionAt: entry.lastSubmissionAt,
      user: {
        id: entry.user.id,
        username: entry.user.username,
        fullname: entry.user.fullname,
        avatar: entry.user.avatar,
      },
    })),
    currentUser: currentUser
      ? {
          userId: currentUser.userId,
          rank: currentUser.rank,
          score: currentUser.score,
          solvedCount: currentUser.solvedCount,
          penalty: currentUser.penalty,
          lastSubmissionAt: currentUser.lastSubmissionAt,
          user: {
            id: currentUser.user.id,
            username: currentUser.user.username,
            fullname: currentUser.user.fullname,
            avatar: currentUser.user.avatar,
          },
        }
      : null,
  };
}

async function subscribeContest(
  ws: WebSocket,
  socketId: string,
  payload: { token?: string; contestId?: string },
) {
  const token = payload.token?.trim();
  const contestId = payload.contestId?.trim();

  if (!token || !contestId) {
    sendError(ws, "Contest token and contest id are required.");
    return;
  }

  const userId = readJwt(token);
  if (!userId) {
    sendError(ws, "Invalid contest auth token.");
    return;
  }

  const participant = await prisma.contestParticipant.findUnique({
    where: {
      contestId_userId: {
        contestId,
        userId,
      },
    },
  });

  if (!participant) {
    sendError(ws, "Contest participant not found.");
    return;
  }

  await prisma.contestParticipant.update({
    where: {
      id: participant.id,
    },
    data: {
      status: "ACTIVE",
      lastSeenAt: new Date(),
      lastSocketId: socketId,
    },
  });

  socketSessions.set(socketId, {
    contestId,
    userId,
    participantId: participant.id,
  });

  const subscriberSet = contestSubscribers.get(contestId) ?? new Set<string>();
  subscriberSet.add(socketId);
  contestSubscribers.set(contestId, subscriberSet);

  const leaderboardPayload = await buildLeaderboardPayload(contestId, userId);
  send(ws, {
    type: "leaderboard_update",
    data: leaderboardPayload,
  });
  send(ws, {
    type: "participant_sync",
    data: {
      rank: leaderboardPayload.currentUser?.rank ?? null,
      score: leaderboardPayload.currentUser?.score ?? null,
    },
  });
}

async function broadcastContestLeaderboard(contestId: string) {
  const subscribers = contestSubscribers.get(contestId);
  if (!subscribers || subscribers.size === 0) {
    return;
  }

  const socketsByUser = new Map<string, string[]>();
  for (const socketId of subscribers) {
    const session = socketSessions.get(socketId);
    if (!session) {
      continue;
    }

    const current = socketsByUser.get(session.userId) ?? [];
    current.push(socketId);
    socketsByUser.set(session.userId, current);
  }

  const sharedLeaderboard = await buildLeaderboardPayload(contestId);

  for (const [userId, socketIds] of socketsByUser.entries()) {
    const personalized = await buildLeaderboardPayload(contestId, userId);

    for (const socketId of socketIds) {
      const ws = sockets.get(socketId);
      if (!ws) {
        continue;
      }

      send(ws, {
        type: "leaderboard_update",
        data: {
          leaderboard: sharedLeaderboard.leaderboard,
          currentUser: personalized.currentUser,
        },
      });
      send(ws, {
        type: "participant_sync",
        data: {
          rank: personalized.currentUser?.rank ?? null,
          score: personalized.currentUser?.score ?? null,
        },
      });
    }
  }
}

async function handlePing(ws: WebSocket, socketId: string) {
  const session = socketSessions.get(socketId);
  if (!session) {
    sendError(ws, "Contest session not found.");
    return;
  }

  await prisma.contestParticipant.update({
    where: {
      id: session.participantId,
    },
    data: {
      status: "ACTIVE",
      lastSeenAt: new Date(),
      lastSocketId: socketId,
    },
  });

  send(ws, {
    type: "pong",
  });
}

async function cleanupSocket(socketId: string) {
  const session = socketSessions.get(socketId);
  if (session) {
    const subscriberSet = contestSubscribers.get(session.contestId);
    subscriberSet?.delete(socketId);
    if (subscriberSet && subscriberSet.size === 0) {
      contestSubscribers.delete(session.contestId);
    }

    await prisma.contestParticipant.update({
      where: {
        id: session.participantId,
      },
      data: {
        status: "DISCONNECTED",
        lastSeenAt: new Date(),
      },
    });
  }

  socketSessions.delete(socketId);
  sockets.delete(socketId);
}

wss.on("connection", (ws) => {
  const socketId = randomUUID();
  sockets.set(socketId, ws);

  send(ws, {
    type: "connected",
    socketId,
  });

  ws.on("message", async (message) => {
    try {
      const payload = JSON.parse(message.toString()) as {
        type?: string;
        token?: string;
        contestId?: string;
      };

      switch (payload.type) {
        case "subscribe_contest":
          await subscribeContest(ws, socketId, payload);
          break;
        case "ping":
          await handlePing(ws, socketId);
          break;
        default:
          sendError(ws, "Unsupported contest websocket message.");
      }
    } catch (error) {
      console.error("Contest websocket message error:", error);
      sendError(ws, "Invalid contest websocket payload.");
    }
  });

  ws.on("close", () => {
    void cleanupSocket(socketId);
  });

  ws.on("error", (error) => {
    console.error("Contest websocket error:", error);
  });
});

setInterval(() => {
  const contestIds = Array.from(contestSubscribers.keys());
  for (const contestId of contestIds) {
    void broadcastContestLeaderboard(contestId);
  }
}, 5_000);

console.log(`Contest websocket server listening on ws://localhost:${port}`);
