import Router from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "@repo/db/DatabaseClient";
import { UserAuthMiddleware } from "../middleware/user.js";
import {
  contestDurationMinutes,
  getContestLifecycleStatus,
  serializeLeaderboardEntry,
  syncContestLeaderboard,
  toClientContestStatus,
  toClientDifficulty,
} from "../utils/contest.js";
import {
  isSupportedContestLanguage,
  judgeContestSubmission,
} from "../utils/contestJudge.js";

const contestRouter = Router();

function readOptionalUserId(tokenHeader: string | undefined) {
  if (!tokenHeader) {
    return null;
  }

  try {
    const payload = jwt.verify(
      tokenHeader,
      process.env.USER_AUTH_JSON_WEB_TOKEN!,
    ) as JwtPayload;

    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
}

function serializeContestSummary(
  contest: {
    id: string;
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    participants: number;
    type: "WEEKLY" | "MONTHLY";
    difficulty: "EASY" | "MEDIUM" | "HARD" | null;
    contestTochallegemapping: Array<{ id: string }>;
    contestParticipants?: Array<{
      id: string;
      status: "REGISTERED" | "ACTIVE" | "DISCONNECTED" | "COMPLETED";
    }>;
    leaderBoard?: Array<{
      rank: number;
      score: number;
    }>;
  },
) {
  const lifecycleStatus = getContestLifecycleStatus(
    contest.startTime,
    contest.endTime,
  );
  const participant = contest.contestParticipants?.[0] ?? null;
  const leaderboardEntry = contest.leaderBoard?.[0] ?? null;

  return {
    id: contest.id,
    title: contest.title,
    description: contest.description,
    startTime: contest.startTime,
    endTime: contest.endTime,
    durationMinutes: contestDurationMinutes(contest),
    participants: contest.participants,
    problemsCount: contest.contestTochallegemapping.length,
    type: contest.type.toLowerCase(),
    status: toClientContestStatus(lifecycleStatus),
    difficulty: toClientDifficulty(contest.difficulty),
    isJoined: Boolean(participant),
    participantStatus: participant?.status.toLowerCase() ?? null,
    userRank: leaderboardEntry?.rank ?? null,
    userScore: leaderboardEntry?.score ?? null,
  };
}

contestRouter.get("/getcontests", async (req, res) => {
  try {
    const userId = readOptionalUserId(req.headers.token as string | undefined);
    const contests = await prisma.contest.findMany({
      orderBy: {
        startTime: "asc",
      },
      include: {
        contestTochallegemapping: {
          select: {
            id: true,
          },
        },
        ...(userId
          ? {
              contestParticipants: {
                where: {
                  userId,
                },
                take: 1,
                select: {
                  id: true,
                  status: true,
                },
              },
              leaderBoard: {
                where: {
                  userId,
                },
                take: 1,
                select: {
                  rank: true,
                  score: true,
                },
              },
            }
          : {}),
      },
    });

    return res.status(200).json({
      message: "Contests fetched successfully",
      success: true,
      contests: contests.map((contest) => serializeContestSummary(contest)),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

contestRouter.get("/getcontest/:id", async (req, res) => {
  const { id } = req.params;
  const userId = readOptionalUserId(req.headers.token as string | undefined);

  try {
    const contest = await prisma.contest.findUnique({
      where: {
        id: String(id),
      },
      include: {
        contestTochallegemapping: {
          orderBy: {
            index: "asc",
          },
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                tags: true,
                maxpoint: true,
              },
            },
          },
        },
        leaderBoard: {
          take: 10,
          orderBy: {
            rank: "asc",
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
        },
        ...(userId
          ? {
              contestParticipants: {
                where: {
                  userId,
                },
                take: 1,
                select: {
                  id: true,
                  status: true,
                  joinedAt: true,
                  currentRank: true,
                  currentScore: true,
                },
              },
            }
          : {}),
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
        success: false,
      });
    }

    const lifecycleStatus = getContestLifecycleStatus(
      contest.startTime,
      contest.endTime,
    );
    const participant = contest.contestParticipants?.[0] ?? null;

    return res.status(200).json({
      message: "Contest fetched successfully",
      success: true,
      contest: {
        ...serializeContestSummary(contest),
        description: contest.description,
        leaderboard: contest.leaderBoard.map((entry) =>
          serializeLeaderboardEntry(entry),
        ),
        problems: contest.contestTochallegemapping.map((mapping) => ({
          id: mapping.id,
          challengeId: mapping.challengeId,
          order: mapping.index,
          challenge: {
            id: mapping.challenge.id,
            title: mapping.challenge.title,
            slug: mapping.challenge.slug,
            difficulty: mapping.challenge.difficulty.toLowerCase(),
            tags: mapping.challenge.tags,
            maxpoint: mapping.challenge.maxpoint,
          },
        })),
        isRegistered: Boolean(participant),
        canJoin: lifecycleStatus === "UPCOMING" && !participant,
        canEnter: lifecycleStatus !== "UPCOMING" && Boolean(participant),
        participant: participant
          ? {
              status: participant.status.toLowerCase(),
              joinedAt: participant.joinedAt,
              currentRank: participant.currentRank,
              currentScore: participant.currentScore,
            }
          : null,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

contestRouter.post("/:id/join", UserAuthMiddleware, async (req, res) => {
  const contestId = req.params.id;

  if (!contestId) {
    return res.status(400).json({
      message: "Contest id is required",
      success: false,
    });
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
        success: false,
      });
    }

    const lifecycleStatus = getContestLifecycleStatus(
      contest.startTime,
      contest.endTime,
    );

    if (lifecycleStatus !== "UPCOMING") {
      return res.status(409).json({
        message: "Contest registration is closed",
        success: false,
      });
    }

    const existingParticipant = await prisma.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId: req.userId,
        },
      },
    });

    if (!existingParticipant) {
      await prisma.$transaction([
        prisma.contestParticipant.create({
          data: {
            contestId,
            userId: req.userId,
            status: "REGISTERED",
          },
        }),
        prisma.contest.update({
          where: {
            id: contestId,
          },
          data: {
            participants: {
              increment: 1,
            },
          },
        }),
        prisma.user.update({
          where: {
            id: req.userId,
          },
          data: {
            contestsParticipated: {
              increment: 1,
            },
          },
        }),
      ]);

      await syncContestLeaderboard(contestId);
    }

    return res.status(200).json({
      message: "Contest joined successfully",
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

contestRouter.get("/:id/workspace", UserAuthMiddleware, async (req, res) => {
  const contestId = req.params.id;

  if (!contestId) {
    return res.status(400).json({
      message: "Contest id is required",
      success: false,
    });
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
      include: {
        contestTochallegemapping: {
          orderBy: {
            index: "asc",
          },
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                difficulty: true,
                tags: true,
                maxpoint: true,
                starterCode: true,
                examples: true,
                testcase: {
                  take: 3,
                  select: {
                    id: true,
                    input: true,
                    expectedOutput: true,
                  },
                },
              },
            },
          },
        },
        contestParticipants: {
          where: {
            userId: req.userId,
          },
          take: 1,
          include: {
            problemStates: true,
          },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
        success: false,
      });
    }

    const lifecycleStatus = getContestLifecycleStatus(
      contest.startTime,
      contest.endTime,
    );
    const participant = contest.contestParticipants[0];

    if (!participant) {
      return res.status(403).json({
        message: "Join the contest before opening the workspace",
        success: false,
      });
    }

    if (lifecycleStatus === "UPCOMING") {
      return res.status(409).json({
        message: "Contest has not started yet",
        success: false,
        startsAt: contest.startTime,
      });
    }

    if (lifecycleStatus === "ONGOING") {
      await prisma.contestParticipant.update({
        where: {
          contestId_userId: {
            contestId,
            userId: req.userId,
          },
        },
        data: {
          status: "ACTIVE",
          startedAt: participant.startedAt ?? new Date(),
          lastSeenAt: new Date(),
        },
      });
    }

      await syncContestLeaderboard(contestId);

    const leaderboard = await prisma.leaderBoard.findMany({
      where: {
        contestId,
      },
      orderBy: {
        rank: "asc",
      },
      take: 20,
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
    });

    return res.status(200).json({
      message: "Contest workspace fetched successfully",
      success: true,
      contest: {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        startTime: contest.startTime,
        endTime: contest.endTime,
        durationMinutes: contestDurationMinutes(contest),
        status: toClientContestStatus(lifecycleStatus),
        difficulty: toClientDifficulty(contest.difficulty),
        participant: {
          id: participant.id,
          status: participant.status.toLowerCase(),
          joinedAt: participant.joinedAt,
          startedAt: participant.startedAt,
          currentRank: participant.currentRank,
          currentScore: participant.currentScore,
          lastSeenAt: participant.lastSeenAt,
        },
        problems: contest.contestTochallegemapping.map((mapping) => {
          const problemState = participant.problemStates.find(
            (state) => state.contestTochallegemappingId === mapping.id,
          );

          return {
            mappingId: mapping.id,
            order: mapping.index,
            challengeId: mapping.challengeId,
            title: mapping.challenge.title,
            slug: mapping.challenge.slug,
            description: mapping.challenge.description,
            difficulty: mapping.challenge.difficulty.toLowerCase(),
            tags: mapping.challenge.tags,
            maxpoint: mapping.challenge.maxpoint,
            starterCode: mapping.challenge.starterCode,
            examples: mapping.challenge.examples,
            testcase: mapping.challenge.testcase,
            savedCode: problemState?.code ?? "",
            savedLanguage: problemState?.language ?? null,
            bestPoints: problemState?.bestPoints ?? 0,
            isSolved: problemState?.isSolved ?? false,
            lastSubmittedAt: problemState?.lastSubmittedAt ?? null,
          };
        }),
        leaderboard: leaderboard.map((entry) => serializeLeaderboardEntry(entry)),
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

contestRouter.post(
  "/:id/problems/:mappingId/save",
  UserAuthMiddleware,
  async (req, res) => {
    const contestId = req.params.id;
    const mappingId = req.params.mappingId;
    const { code, language } = req.body as {
      code?: string;
      language?: string;
    };

    if (!contestId || !mappingId) {
      return res.status(400).json({
        message: "Contest id and problem id are required",
        success: false,
      });
    }

    try {
      const participant = await prisma.contestParticipant.findUnique({
        where: {
          contestId_userId: {
            contestId,
            userId: req.userId,
          },
        },
      });

      if (!participant) {
        return res.status(403).json({
          message: "Contest participant not found",
          success: false,
        });
      }

      const mapping = await prisma.contentToChallegesMapping.findFirst({
        where: {
          id: mappingId,
          contestId,
        },
      });

      if (!mapping) {
        return res.status(404).json({
          message: "Contest problem not found",
          success: false,
        });
      }

      await prisma.$transaction([
        prisma.contestParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            lastSeenAt: new Date(),
            status: "ACTIVE",
          },
        }),
        prisma.contestProblemState.upsert({
          where: {
            contestParticipantId_contestTochallegemappingId: {
              contestParticipantId: participant.id,
              contestTochallegemappingId: mappingId,
            },
          },
          update: {
            code: code ?? "",
            language: language ?? null,
            lastRunAt: new Date(),
          },
          create: {
            contestParticipantId: participant.id,
            contestTochallegemappingId: mappingId,
            code: code ?? "",
            language: language ?? null,
            startedAt: new Date(),
            lastRunAt: new Date(),
          },
        }),
      ]);

      return res.status(200).json({
        message: "Contest draft saved",
        success: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  },
);

contestRouter.post(
  "/:id/problems/:mappingId/submit",
  UserAuthMiddleware,
  async (req, res) => {
    const contestId = req.params.id;
    const mappingId = req.params.mappingId;
    const { code, language } = req.body as {
      code?: string;
      language?: string;
    };

    if (!contestId || !mappingId) {
      return res.status(400).json({
        message: "Contest id and problem id are required",
        success: false,
      });
    }

    try {
      if (!code || !language) {
        return res.status(400).json({
          message: "Code and language are required",
          success: false,
        });
      }

      if (!isSupportedContestLanguage(language)) {
        return res.status(400).json({
          message: "Unsupported language",
          success: false,
        });
      }

      const contest = await prisma.contest.findUnique({
        where: {
          id: contestId,
        },
        include: {
          contestTochallegemapping: {
            where: {
              id: mappingId,
            },
            include: {
              challenge: {
                include: {
                  testcase: true,
                },
              },
            },
          },
        },
      });

      if (!contest) {
        return res.status(404).json({
          message: "Contest not found",
          success: false,
        });
      }

      const lifecycleStatus = getContestLifecycleStatus(
        contest.startTime,
        contest.endTime,
      );

      if (lifecycleStatus !== "ONGOING") {
        return res.status(409).json({
          message: "Contest submissions are closed",
          success: false,
        });
      }

      const participant = await prisma.contestParticipant.findUnique({
        where: {
          contestId_userId: {
            contestId,
            userId: req.userId,
          },
        },
      });

      if (!participant) {
        return res.status(403).json({
          message: "Contest participant not found",
          success: false,
        });
      }

      const mapping = contest.contestTochallegemapping[0];
      if (!mapping) {
        return res.status(404).json({
          message: "Contest problem not found",
          success: false,
        });
      }

      const judgeResult = await judgeContestSubmission({
        code,
        language,
        testCases: mapping.challenge.testcase,
      });

      const currentProblemState = await prisma.contestProblemState.findUnique({
        where: {
          contestParticipantId_contestTochallegemappingId: {
            contestParticipantId: participant.id,
            contestTochallegemappingId: mappingId,
          },
        },
      });

      const acceptedPoints =
        judgeResult.verdict === "ACCEPTED" ? mapping.challenge.maxpoint : 0;
      const nextBestPoints = Math.max(
        currentProblemState?.bestPoints ?? 0,
        acceptedPoints,
      );
      const solvedNow = nextBestPoints > 0;
      const isBestSubmission = acceptedPoints > (currentProblemState?.bestPoints ?? 0);

      await prisma.$transaction(async (tx) => {
        if (isBestSubmission) {
          await tx.contestSubmittion.updateMany({
            where: {
              contestParticipantId: participant.id,
              contestTochallegemappingid: mappingId,
              isBest: true,
            },
            data: {
              isBest: false,
            },
          });
        }

        await tx.contestSubmittion.create({
          data: {
            submission: code,
            contestTochallegemappingid: mappingId,
            contestParticipantId: participant.id,
            points: acceptedPoints,
            userId: req.userId,
            language,
            verdict: judgeResult.verdict,
            passedTestCases: judgeResult.passedTestCases,
            totalTestCases: judgeResult.totalTestCases,
            executionTime: judgeResult.executionTime,
            isBest: isBestSubmission,
          },
        });

        await tx.contestProblemState.upsert({
          where: {
            contestParticipantId_contestTochallegemappingId: {
              contestParticipantId: participant.id,
              contestTochallegemappingId: mappingId,
            },
          },
          update: {
            code,
            language,
            bestPoints: nextBestPoints,
            isSolved: solvedNow,
            lastSubmittedAt: new Date(),
          },
          create: {
            contestParticipantId: participant.id,
            contestTochallegemappingId: mappingId,
            code,
            language,
            bestPoints: nextBestPoints,
            isSolved: solvedNow,
            startedAt: new Date(),
            lastSubmittedAt: new Date(),
          },
        });

        await tx.contestParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            status: "ACTIVE",
            lastSeenAt: new Date(),
            startedAt: participant.startedAt ?? new Date(),
          },
        });
      });

      await syncContestLeaderboard(contestId);

      const leaderboardEntry = await prisma.leaderBoard.findUnique({
        where: {
          contestId_userId: {
            contestId,
            userId: req.userId,
          },
        },
      });

      return res.status(200).json({
        message:
          judgeResult.verdict === "ACCEPTED"
            ? "Contest submission accepted"
            : "Contest submission evaluated",
        success: true,
        result: {
          ...judgeResult,
          points: acceptedPoints,
          bestPoints: nextBestPoints,
          currentRank: leaderboardEntry?.rank ?? null,
          currentScore: leaderboardEntry?.score ?? null,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  },
);

contestRouter.get("/:id/leaderboard", async (req, res) => {
  const contestId = req.params.id;
  const userId = readOptionalUserId(req.headers.token as string | undefined);

  if (!contestId) {
    return res.status(400).json({
      message: "Contest id is required",
      success: false,
    });
  }

  try {
    await syncContestLeaderboard(contestId);

    const leaderboard = await prisma.leaderBoard.findMany({
      where: {
        contestId,
      },
      orderBy: {
        rank: "asc",
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
    });
    const currentUser = userId
      ? await prisma.leaderBoard.findUnique({
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
      : null;

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      success: true,
      leaderboard: leaderboard.map((entry) => serializeLeaderboardEntry(entry)),
      currentUser: currentUser ? serializeLeaderboardEntry(currentUser) : null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

export default contestRouter;
