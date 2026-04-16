import Router from "express";
import { AdminAuthSchema } from "../types/auth.js";
import { prisma } from "@repo/db/DatabaseClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminAuthMiddleware } from "../middleware/admin.js";
import { randomInt, randomUUID } from "crypto";
import z from "zod";
const adminAuthRouter = Router();

interface TestCase {
  input: string;
  output: string;
  executableCodes: string[];
}

interface AdminOtpChallenge {
  adminId: string;
  otp: string;
  expiresAt: number;
  attempts: number;
}

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const adminOtpChallenges = new Map<string, AdminOtpChallenge>();

const VerifyOtpSchema = z.object({
  challengeId: z.string().min(10),
  otp: z.string().regex(/^\d{6}$/),
});

function issueAdminToken(adminId: string) {
  return jwt.sign(
    {
      id: adminId,
    },
    process.env.ADMIN_SIGNED_JWT_TOKEN!,
  );
}

function createOtpCode() {
  return randomInt(100000, 1000000).toString();
}

function pruneExpiredOtpChallenges() {
  const now = Date.now();

  for (const [challengeId, challenge] of adminOtpChallenges.entries()) {
    if (challenge.expiresAt <= now) {
      adminOtpChallenges.delete(challengeId);
    }
  }
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * SEEDING ADMIN ROUTE
 * This route is used to create an initial admin user for development purposes.
 * It should only be enabled in development mode to prevent unauthorized access in production.
 */
if (process.env.DEVELOPMENT_MODE === "development") {
  adminAuthRouter.post("/create-admin", async (req, res) => {
    try {
      const { success, data } = AdminAuthSchema.safeParse(req.body);
      if (!success) {
        return res.status(411).json({
          message: "Please Provide Write Credential Format",
          success: false,
        });
      }
      const HashPassword = await bcrypt.hash(data.password, 5);
      const CreateAdmin = await prisma.admin.create({
        data: {
          email: data.email,
          password: HashPassword,
        },
      });
      if (CreateAdmin) {
        return res.status(200).json({
          message: "Admin Created Successfully",
          success: true,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  });
}

/**@ADMIN_AUTH_ROUTE
 * The route to authenticate an admin user.
 * It expects the admin credentials in the request body and returns a JWT token upon successful authentication.
 */

adminAuthRouter.post("/auth", async (req, res) => {
  try {
    const { success, data } = AdminAuthSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Plese Provide Credential in Valid Format",
        success: false,
      });
    }
    const VerifyAdmin = await prisma.admin.findFirst({
      where: {
        email: data.email,
      },
    });
    if (VerifyAdmin) {
      const CheckPassword = await bcrypt.compare(
        data.password,
        VerifyAdmin.password,
      );
      if (CheckPassword) {
        const SignedToken = issueAdminToken(VerifyAdmin.id);
        if (SignedToken) {
          return res.status(200).json({
            message: "Admin Auth Successfully",
            success: true,
            token: SignedToken,
          });
        }
      }
    }
    res.status(411).json({
      message: "Wrong Credential try Again",
      success: false,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

adminAuthRouter.post("/auth/start", async (req, res) => {
  try {
    const { success, data } = AdminAuthSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Plese Provide Credential in Valid Format",
        success: false,
      });
    }

    const verifyAdmin = await prisma.admin.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!verifyAdmin) {
      return res.status(401).json({
        message: "Wrong Credential try Again",
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(
      data.password,
      verifyAdmin.password,
    );

    if (!checkPassword) {
      return res.status(401).json({
        message: "Wrong Credential try Again",
        success: false,
      });
    }

    pruneExpiredOtpChallenges();

    const challengeId = randomUUID();
    const otp = createOtpCode();

    adminOtpChallenges.set(challengeId, {
      adminId: verifyAdmin.id,
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    return res.status(200).json({
      message: "Credentials verified. Submit OTP to complete login.",
      success: true,
      challengeId,
      expiresInSec: OTP_TTL_MS / 1000,
      ...(process.env.DEVELOPMENT_MODE === "development"
        ? { devOtp: otp }
        : {}),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

adminAuthRouter.post("/auth/verify-otp", async (req, res) => {
  try {
    const { success, data } = VerifyOtpSchema.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Please provide a valid OTP payload",
        success: false,
      });
    }

    pruneExpiredOtpChallenges();

    const challenge = adminOtpChallenges.get(data.challengeId);
    if (!challenge) {
      return res.status(410).json({
        message: "OTP session expired. Please login again.",
        success: false,
      });
    }

    if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
      adminOtpChallenges.delete(data.challengeId);
      return res.status(429).json({
        message: "Too many invalid OTP attempts. Please login again.",
        success: false,
      });
    }

    if (challenge.otp !== data.otp) {
      challenge.attempts += 1;
      adminOtpChallenges.set(data.challengeId, challenge);

      return res.status(401).json({
        message: "Invalid OTP code",
        success: false,
      });
    }

    adminOtpChallenges.delete(data.challengeId);

    const signedToken = issueAdminToken(challenge.adminId);

    return res.status(200).json({
      message: "Admin Auth Successfully",
      success: true,
      token: signedToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

adminAuthRouter.get("/verify-admin", AdminAuthMiddleware, async (req, res) => {
  try {
    const adminId = req.adminuserId;
    const VerifyAdmin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });
    if (!VerifyAdmin) {
      return res.status(403).json({
        message: "You Are Not An Admin Plese Do not Try to Access it",
        success: false,
      });
    }
    return res.status(200).json({
      message: "You are Verified",
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error While Creating",
    });
  }
});

adminAuthRouter.get(
  "/dashboard/metrics",
  AdminAuthMiddleware,
  async (_req, res) => {
    try {
      const sevenDaysStart = new Date();
      sevenDaysStart.setDate(sevenDaysStart.getDate() - 6);
      sevenDaysStart.setHours(0, 0, 0, 0);

      const [
        userCount,
        problemCount,
        contestCount,
        submissionCount,
        activeContestCount,
        recentUsers,
        recentSubmissions,
        latestProblems,
        latestContests,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.challenges.count(),
        prisma.contest.count(),
        prisma.submittion.count(),
        prisma.contest.count({
          where: {
            status: "ONGOING",
          },
        }),
        prisma.user.findMany({
          where: {
            createdAt: {
              gte: sevenDaysStart,
            },
          },
          select: {
            createdAt: true,
          },
        }),
        prisma.submittion.findMany({
          where: {
            createdAt: {
              gte: sevenDaysStart,
            },
          },
          select: {
            createdAt: true,
          },
        }),
        prisma.challenges.findMany({
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            difficulty: true,
            createdAt: true,
          },
        }),
        prisma.contest.findMany({
          take: 6,
          orderBy: {
            startTime: "desc",
          },
          select: {
            id: true,
            title: true,
            status: true,
            participants: true,
            startTime: true,
          },
        }),
      ]);

      const dayKeys = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(sevenDaysStart);
        date.setDate(sevenDaysStart.getDate() + index);
        return toDayKey(date);
      });

      const userCountByDay = new Map(dayKeys.map((key) => [key, 0]));
      const submissionCountByDay = new Map(dayKeys.map((key) => [key, 0]));

      for (const item of recentUsers) {
        const dayKey = toDayKey(item.createdAt);
        if (userCountByDay.has(dayKey)) {
          userCountByDay.set(dayKey, (userCountByDay.get(dayKey) ?? 0) + 1);
        }
      }

      for (const item of recentSubmissions) {
        const dayKey = toDayKey(item.createdAt);
        if (submissionCountByDay.has(dayKey)) {
          submissionCountByDay.set(
            dayKey,
            (submissionCountByDay.get(dayKey) ?? 0) + 1,
          );
        }
      }

      const chartData = dayKeys.map((dayKey) => ({
        date: dayKey,
        users: userCountByDay.get(dayKey) ?? 0,
        submissions: submissionCountByDay.get(dayKey) ?? 0,
      }));

      return res.status(200).json({
        success: true,
        metrics: {
          userCount,
          problemCount,
          contestCount,
          submissionCount,
          activeContestCount,
        },
        chartData,
        latestProblems: latestProblems.map((problem) => ({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty.toLowerCase(),
          createdAt: problem.createdAt,
        })),
        latestContests: latestContests.map((contest) => ({
          id: contest.id,
          title: contest.title,
          status: contest.status.toLowerCase(),
          participants: contest.participants,
          startTime: contest.startTime,
        })),
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

/**@ADMIN_CHALLENGE_ROUTE
 * The route to create a new challenge.
 * It expects the challenge details in the request body, parse and example/test case data and stores them in the database.
 * The route is protected by the UserAuthMiddleware to ensure only authenticated users can create challenges.
 */

adminAuthRouter.post(
  "/set-challenges",
  AdminAuthMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        slug,
        difficulty,
        tags,
        maxpoint,
        startercode,
        exampleinput,
        exampleoutput,
        explanation,
        testcaseinput,
      } = req.body;
      if (
        !title ||
        !description ||
        !difficulty ||
        !tags ||
        !maxpoint ||
        !startercode ||
        !exampleinput ||
        !exampleoutput
      ) {
        return res.status(411).json({
          message: "Please Provide All Fields",
          success: false,
        });
      }
      const CreateChallenge = await prisma.challenges.create({
        data: {
          title: title,
          description: description,
          slug: slug,
          difficulty: difficulty,
          tags: tags,
          maxpoint: Number(maxpoint),
          starterCode: startercode,
        },
      });

      const CreateExample = await prisma.example.create({
        data: {
          input: exampleinput,
          output: exampleoutput,
          explanation: explanation,
          challengeId: CreateChallenge.id,
        },
      });

      await Promise.all(
        testcaseinput.map(async (test: TestCase) => {
          await prisma.testCase.create({
            data: {
              input: test.input,
              expectedOutput: test.output,
              testcasecode: JSON.stringify(test.executableCodes),
              challengeId: CreateChallenge.id,
            },
          });
        }),
      );

      if (CreateChallenge && CreateExample) {
        return res.status(200).json({
          message: "Challenge Created Successfully",
          success: true,
        });
      }

      return res.status(403).json({
        message: "Error While Creating Challeges",
        success: false,
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

adminAuthRouter.put(
  "/update-challenge/:id",
  AdminAuthMiddleware,
  async (req, res) => {
    try {
      const challengeId = req.params.id;
      const { exampleId, testCaseId } = req.query;
      const {
        title,
        description,
        difficulty,
        tags,
        maxpoint,
        startercode,
        exampleinput,
        exampleoutput,
        explanation,
        testcaseinput,
        testcaseexpectedoutput,
      } = req.body;
      if (
        !title ||
        !description ||
        !difficulty ||
        !tags ||
        !maxpoint ||
        !startercode ||
        !exampleinput ||
        !exampleoutput
      ) {
        return res.status(411).json({
          message: "Please Provide All Fields",
          success: false,
        });
      }
      const UpdateChallenge = await prisma.challenges.update({
        where: {
          id: challengeId as string,
        },
        data: {
          title: title,
          description: description,
          difficulty: difficulty,
          tags: tags,
          maxpoint: maxpoint,
          starterCode: startercode,
        },
      });

      const UpdateExample = await prisma.example.update({
        where: {
          id: exampleId as string,
        },
        data: {
          input: exampleinput,
          output: exampleoutput,
          explanation: explanation,
        },
      });

      const UpdateTestCase = await prisma.testCase.update({
        where: {
          id: testCaseId as string,
        },
        data: {
          input: testcaseinput,
          expectedOutput: testcaseexpectedoutput,
        },
      });

      if (UpdateChallenge && UpdateExample && UpdateTestCase) {
        return res.status(200).json({
          message: "Challenge Updated Successfully",
          success: true,
        });
      }

      return res.status(403).json({
        message: "Error While Updating Challenge",
        success: false,
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

adminAuthRouter.delete(
  "/delete-challenge/:id",
  AdminAuthMiddleware,
  async (req, res) => {
    try {
      const challengeId = req.params.id;
      const DeleteChallenge = await prisma.challenges.delete({
        where: {
          id: challengeId as string,
        },
      });

      if (DeleteChallenge) {
        return res.status(200).json({
          message: "Challenge Deleted Successfully",
          success: true,
        });
      }

      return res.status(403).json({
        message: "Error While Deleting Challenge",
        success: false,
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

/**@ADMIN_CONTEST_ROUTE
 * The route to create a new contest with associated challenges.
 * It expects the contest details and an array of challenge IDs in the request body, params and query and stores them in the database.
 * The route is protected by the AdminAuthMiddleware to ensure only authenticated users can create contests.
 */

adminAuthRouter.post("/set-contest", AdminAuthMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      starttime,
      endtime,
      challengeids,
      type,
      status,
      difficulty,
    } = req.body;
    if (
      !title ||
      !description ||
      !starttime ||
      !endtime ||
      !challengeids ||
      !type ||
      !status
    ) {
      return res.status(411).json({
        message: "Please Provide All Fields",
        success: false,
      });
    }

    const CreateContext = await prisma.contest.create({
      data: {
        title: title,
        description: description,
        startTime: starttime,
        endTime: endtime,
        participants: 0,
        type: type,
        status: status,
        difficulty: difficulty,
      },
    });

    const ChallengeArray = challengeids.map((id: string) => id);
    for (const challengeId of ChallengeArray) {
      await prisma.contentToChallegesMapping.create({
        data: {
          contestId: CreateContext.id,
          challengeId: challengeId,
          index: Math.floor(Math.random() * 1000),
        },
      });
    }

    if (CreateContext && ChallengeArray) {
      return res.status(200).json({
        message: "Contest Created Successfully",
        success: true,
      });
    }

    return res.status(403).json({
      message: "Error While Creating Contest",
      success: false,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

adminAuthRouter.put(
  "/update-contest/:id",
  AdminAuthMiddleware,
  async (req, res) => {
    try {
      const contestId = req.params.id;
      const {
        title,
        description,
        starttime,
        endtime,
        newChallengeIds,
        contestToChallegesMappingId,
      } = req.body;

      if (
        !title ||
        !description ||
        !starttime ||
        !endtime ||
        !newChallengeIds
      ) {
        return res.status(411).json({
          message: "Please Provide All Fields",
          success: false,
        });
      }

      const UpdateContest = await prisma.contest.update({
        where: {
          id: contestId as string,
        },
        data: {
          title: title,
          description: description,
          startTime: new Date(starttime),
          endTime: new Date(endtime),
        },
      });

      const ChallengeArray = newChallengeIds.map((id: string) => id);
      for (const challengeId of ChallengeArray) {
        await prisma.contentToChallegesMapping.upsert({
          where: {
            id: contestToChallegesMappingId,
          },
          update: {
            index: Math.floor(Math.random() * 1000),
          },
          create: {
            contestId: contestId as string,
            challengeId: challengeId,
            index: Math.floor(Math.random() * 1000),
          },
        });
      }

      if (UpdateContest) {
        return res.status(200).json({
          message: "Contest Updated Successfully",
          success: true,
        });
      }

      return res.status(403).json({
        message: "Error While Updating Contest",
        success: false,
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

adminAuthRouter.delete(
  "/delete-contest/:id",
  AdminAuthMiddleware,
  async (req, res) => {
    try {
      const contestId = req.params.id;

      const DeleteContest = await prisma.contest.delete({
        where: {
          id: contestId as string,
        },
      });

      if (DeleteContest) {
        return res.status(200).json({
          message: "Contest Deleted Successfully",
          success: true,
        });
      }

      return res.status(403).json({
        message: "Error While Deleting Contest",
        success: false,
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

export default adminAuthRouter;
