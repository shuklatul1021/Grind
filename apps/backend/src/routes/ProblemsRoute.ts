import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { prisma } from "@repo/db/DatabaseClient";
import { AdminAuthMiddleware } from "../middleware/admin.js";
const problemsRouter = Router();

problemsRouter.get(
  "/getproblems",
  UserAuthMiddleware || AdminAuthMiddleware,
  async (req, res) => {
    try {
      const userId = req.userId;
      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: { SolvedProblem: true },
      });

      const GetProblems = await prisma.challenges.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          tags: true,
          slug: true,
          isSolved: true,
        },
      });
      if (!GetProblems) {
        return res.status(404).json({
          message: "No Problems Found",
          success: false,
        });
      }
      res.status(200).json({
        message: "Problems Fetched Successfully",
        success: true,
        problems: GetProblems,
        solvedProblems: user?.SolvedProblem || [],
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }
);

//NOTE : Add UserAuthMiddleware to verify token and get user info
problemsRouter.get(
  "/getproblem/:slug",
  UserAuthMiddleware || AdminAuthMiddleware,
  async (req, res) => {
    const { slug } = req.params;
    try {
      const problem = await prisma.challenges.findFirst({
        where: { slug: slug as string },
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          tags: true,
          examples: true,
          testcase: true,
          starterCode: true,
        },
      });
      if (!problem) {
        return res.status(404).json({
          message: "Problem Not Found",
          success: false,
        });
      }
      // Only send first 3 testcases
      let limitedProblem = { ...problem };
      if (Array.isArray(limitedProblem.testcase)) {
        limitedProblem.testcase = limitedProblem.testcase.slice(0, 3);
      }
      res.status(200).json({
        message: "Problem Fetched Successfully",
        success: true,
        problem: limitedProblem,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }
);

export default problemsRouter;
