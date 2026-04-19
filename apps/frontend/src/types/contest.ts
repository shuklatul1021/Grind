export type ContestSummary = {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  participants: number;
  problemsCount: number;
  type: "weekly" | "monthly";
  status: "upcoming" | "ongoing" | "completed";
  difficulty: "easy" | "medium" | "hard";
  isJoined?: boolean;
  participantStatus?: string | null;
  userRank?: number | null;
  userScore?: number | null;
};

export type ContestLeaderboardEntry = {
  userId: string;
  rank: number;
  score: number;
  solvedCount: number;
  penalty: number;
  lastSubmissionAt: string | null;
  user: {
    id: string;
    username?: string | null;
    fullname?: string | null;
    avatar?: string | null;
  };
};

export type ContestDetail = ContestSummary & {
  leaderboard: ContestLeaderboardEntry[];
  problems: Array<{
    id: string;
    challengeId: string;
    order: number;
    challenge: {
      id: string;
      title: string;
      slug: string;
      difficulty: "easy" | "medium" | "hard";
      tags: string[];
      maxpoint: number;
    };
  }>;
  isRegistered: boolean;
  canJoin: boolean;
  canEnter: boolean;
  participant: {
    status: string;
    joinedAt: string;
    currentRank: number | null;
    currentScore: number | null;
  } | null;
};

export type ContestWorkspace = {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: "ongoing" | "completed";
  difficulty: "easy" | "medium" | "hard";
  participant: {
    id: string;
    status: string;
    joinedAt: string;
    startedAt: string | null;
    currentRank: number | null;
    currentScore: number | null;
    lastSeenAt: string;
  };
  problems: Array<{
    mappingId: string;
    order: number;
    challengeId: string;
    title: string;
    slug: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    maxpoint: number;
    starterCode: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string | null;
    }>;
    testcase: Array<{
      id: string;
      input: string;
      expectedOutput: string;
    }>;
    savedCode: string;
    savedLanguage: string | null;
    bestPoints: number;
    isSolved: boolean;
    lastSubmittedAt: string | null;
  }>;
  leaderboard: ContestLeaderboardEntry[];
};
