import { Router } from "express";
import { prisma } from "@repo/db/DatabaseClient";
import {
  SUPPORTED_COMPILER_LANGUAGES,
  getCompilerJobStatus,
  publishCompilerJob,
  type CompilerLanguage,
} from "@repo/compiler";
import {
  compilerRateLimiter,
  compilerStatusRateLimiter,
} from "../limiter/rateLimiter.js";
import { UserAuthMiddleware } from "../middleware/user.js";

const compilerRouter = Router();

compilerRouter.post(
  "/run",
  compilerRateLimiter,
  UserAuthMiddleware,
  async (req, res) => {
    try {
      const { code, language, input } = req.body as {
        code?: string;
        language?: string;
        input?: string;
      };

      if (!code || !language) {
        return res.status(400).json({
          message: "Please Provide All The Required Fields",
          success: false,
        });
      }

      if (!SUPPORTED_COMPILER_LANGUAGES.includes(language as CompilerLanguage)) {
        return res.status(400).json({
          message: `Language '${language}' is not supported. Supported: ${SUPPORTED_COMPILER_LANGUAGES.join(", ")}`,
          success: false,
        });
      }

      const queuedJob = await publishCompilerJob({
        code,
        language: language as CompilerLanguage,
        userId: req.userId,
        submittedAt: new Date().toISOString(),
        ...(input ? { input } : {}),
      });

      return res.status(202).json({
        success: true,
        message: "Compiler job acknowledged",
        ...queuedJob,
      });
    } catch (error) {
      console.error("Compiler queue publish failed:", error);
      return res.status(500).json({
        message: "Code queue publish failed",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

compilerRouter.get(
  "/jobs/:jobId",
  compilerStatusRateLimiter,
  UserAuthMiddleware,
  async (req, res) => {
    try {
      const jobId = req.params.jobId;

      if (!jobId) {
        return res.status(400).json({
          message: "Compiler job id is required",
          success: false,
        });
      }

      const jobStatus = await getCompilerJobStatus(jobId);

      if (!jobStatus) {
        return res.status(404).json({
          message: "Compiler job not found",
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
        ...jobStatus,
      });
    } catch (error) {
      console.error("Compiler job status fetch failed:", error);
      return res.status(500).json({
        message: "Could not fetch compiler job status",
        success: false,
      });
    }
  }
);

compilerRouter.post(
  "/create-code-history",
  UserAuthMiddleware,
  async (req, res) => {
    try {
      const { title, code, language } = req.body;

      if (!code || !language) {
        return res.status(400).json({
          message: "Code and Language are required",
          success: false,
        });
      }

      await prisma.compilerCodeHistory.create({
        data: {
          title,
          code,
          language,
          userId: req.userId,
        },
      });

      return res.status(200).json({
        message: "Code History Updated",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }
);

compilerRouter.get("/get-code-history", UserAuthMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);

    const userCompilerHistory = await prisma.compilerCodeHistory.findMany({
      where: {
        userId: req.userId,
        createdAt: {
          gte: fifteenDaysAgo,
          lte: today,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Fetched Successfully",
      history: userCompilerHistory,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

export default compilerRouter;
