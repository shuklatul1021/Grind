import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import { compilerQueueConfig } from "./config.js";
import { createRedisConnection } from "./redis.js";
import type {
  CompilerJobData,
  CompilerJobProgress,
  CompilerJobResult,
  CompilerJobStatus,
} from "./types.js";
import { COMPILER_QUEUE_NAME } from "./types.js";

const compilerQueueConnection = createRedisConnection();

const compilerQueue = new Queue<CompilerJobData, CompilerJobResult>(
  COMPILER_QUEUE_NAME,
  {
    connection: compilerQueueConnection,
    defaultJobOptions: {
      removeOnComplete: compilerQueueConfig.removeOnComplete,
      removeOnFail: compilerQueueConfig.removeOnFail,
    },
  }
);

function normalizeProgress(progress: unknown): CompilerJobProgress | null {
  if (!progress || typeof progress !== "object") {
    return null;
  }

  const candidate = progress as Partial<CompilerJobProgress>;
  if (
    (candidate.stage === "queued" || candidate.stage === "running") &&
    typeof candidate.message === "string" &&
    typeof candidate.updatedAt === "string"
  ) {
    return {
      stage: candidate.stage,
      message: candidate.message,
      updatedAt: candidate.updatedAt,
      workerId: candidate.workerId,
    };
  }

  return null;
}

function mapBullJobStateToCompilerStatus(state: string): CompilerJobStatus {
  if (state === "active") {
    return "running";
  }

  if (state === "completed") {
    return "completed";
  }

  if (state === "failed") {
    return "failed";
  }

  return "queued";
}

async function getQueueDepth() {
  const counts = await compilerQueue.getJobCounts(
    "waiting",
    "prioritized",
    "delayed",
    "active"
  );

  return (
    (counts.waiting ?? 0) +
    (counts.prioritized ?? 0) +
    (counts.delayed ?? 0) +
    (counts.active ?? 0)
  );
}

export async function publishCompilerJob(data: CompilerJobData) {
  const progress: CompilerJobProgress = {
    stage: "queued",
    message: "Code pushed to queue. Waiting for a worker.",
    updatedAt: new Date().toISOString(),
  };

  const queueDepthBeforePublish = await getQueueDepth();
  const jobId = randomUUID();
  const job = await compilerQueue.add("execute-compiler-job", data, { jobId });
  await job.updateProgress(progress);

  return {
    jobId: String(job.id),
    queueDepth: queueDepthBeforePublish + 1,
    status: "queued" as const,
    acknowledgement: {
      message: progress.message,
      queuedAt: progress.updatedAt,
    },
  };
}

export async function getCompilerJobStatus(jobId: string) {
  const job = await compilerQueue.getJob(jobId);

  if (!job) {
    return null;
  }

  const rawState = await job.getState();
  const progress = normalizeProgress(job.progress);

  return {
    jobId,
    status: mapBullJobStateToCompilerStatus(rawState),
    queueDepth: await getQueueDepth(),
    progress,
    result: job.returnvalue ?? null,
    error: job.failedReason || null,
    queuedAt: new Date(job.timestamp).toISOString(),
    startedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
    finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
  };
}
