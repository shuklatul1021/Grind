import { prisma } from "@repo/db/DatabaseClient";
import type {
  Contest,
  ContestParticipant,
  ContestProblemState,
  ContestStatus,
  DifficultyLevel,
  LeaderBoard,
} from "@prisma/client";

type ContestParticipantWithStates = ContestParticipant & {
  problemStates: ContestProblemState[];
};

type LeaderboardSnapshot = {
  contestId: string;
  userId: string;
  rank: number;
  score: number;
  solvedCount: number;
  penalty: number;
  lastSubmissionAt: Date | null;
};

export function getContestLifecycleStatus(
  startTime: Date,
  endTime: Date,
  now: Date = new Date(),
): ContestStatus {
  if (now < startTime) {
    return "UPCOMING";
  }

  if (now > endTime) {
    return "COMPLETED";
  }

  return "ONGOING";
}

export function toClientContestStatus(status: ContestStatus) {
  return status.toLowerCase();
}

export function toClientDifficulty(difficulty: DifficultyLevel | null | undefined) {
  return difficulty?.toLowerCase() ?? "easy";
}

export function contestDurationMinutes(contest: Pick<Contest, "startTime" | "endTime">) {
  return Math.max(
    0,
    Math.round((contest.endTime.getTime() - contest.startTime.getTime()) / 60000),
  );
}

function computeParticipantScore(
  participant: ContestParticipantWithStates,
  contestStartTime: Date,
): Omit<LeaderboardSnapshot, "contestId" | "userId" | "rank"> {
  const solvedStates = participant.problemStates.filter((state) => state.isSolved);
  const score = participant.problemStates.reduce(
    (total, state) => total + state.bestPoints,
    0,
  );
  const solvedCount = solvedStates.length;
  const sortedSolvedTimes = solvedStates
    .map((state) => state.lastSubmittedAt)
    .filter((value): value is Date => value instanceof Date)
    .sort((left, right) => left.getTime() - right.getTime());

  const penalty = sortedSolvedTimes.reduce((total, solvedAt) => {
    return total + Math.max(0, Math.floor((solvedAt.getTime() - contestStartTime.getTime()) / 1000));
  }, 0);

  const lastSubmissionAt =
    sortedSolvedTimes.length > 0
      ? (sortedSolvedTimes[sortedSolvedTimes.length - 1] ?? null)
      : null;

  return {
    score,
    solvedCount,
    penalty,
    lastSubmissionAt,
  };
}

export async function syncContestLeaderboard(contestId: string) {
  const contest = await prisma.contest.findUnique({
    where: {
      id: contestId,
    },
    include: {
      contestParticipants: {
        include: {
          problemStates: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Error("Contest not found");
  }

  const leaderboard = contest.contestParticipants
    .map((participant) => ({
      contestId,
      userId: participant.userId,
      joinedAt: participant.joinedAt,
      ...computeParticipantScore(participant, contest.startTime),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.solvedCount !== left.solvedCount) {
        return right.solvedCount - left.solvedCount;
      }

      if (left.penalty !== right.penalty) {
        return left.penalty - right.penalty;
      }

      const leftTime = left.lastSubmissionAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const rightTime = right.lastSubmissionAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return left.joinedAt.getTime() - right.joinedAt.getTime();
    })
    .map<LeaderboardSnapshot>((entry, index) => ({
      contestId: entry.contestId,
      userId: entry.userId,
      rank: index + 1,
      score: entry.score,
      solvedCount: entry.solvedCount,
      penalty: entry.penalty,
      lastSubmissionAt: entry.lastSubmissionAt,
    }));

  await prisma.$transaction(async (tx) => {
    for (const entry of leaderboard) {
      await tx.leaderBoard.upsert({
        where: {
          contestId_userId: {
            contestId: entry.contestId,
            userId: entry.userId,
          },
        },
        update: {
          rank: entry.rank,
          score: entry.score,
          solvedCount: entry.solvedCount,
          penalty: entry.penalty,
          lastSubmissionAt: entry.lastSubmissionAt,
        },
        create: {
          contestId: entry.contestId,
          userId: entry.userId,
          rank: entry.rank,
          score: entry.score,
          solvedCount: entry.solvedCount,
          penalty: entry.penalty,
          lastSubmissionAt: entry.lastSubmissionAt,
        },
      });

      await tx.contestParticipant.update({
        where: {
          contestId_userId: {
            contestId: entry.contestId,
            userId: entry.userId,
          },
        },
        data: {
          currentRank: entry.rank,
          currentScore: entry.score,
        },
      });
    }
  });

  return leaderboard;
}

export function serializeLeaderboardEntry(
  entry: LeaderBoard & {
    user: {
      id: string;
      username: string | null;
      fullname: string | null;
      avatar: string | null;
    };
  },
) {
  return {
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
  };
}
