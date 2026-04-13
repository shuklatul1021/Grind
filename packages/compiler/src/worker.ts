import { Queue, Worker, type Job } from "bullmq";
import { compilerQueueConfig } from "./config.js";
import { executeCompilerJob } from "./executor.js";
import { createRedisConnection } from "./redis.js";
import type {
  CompilerJobData,
  CompilerJobProgress,
  CompilerJobResult,
} from "./types.js";
import { COMPILER_QUEUE_NAME } from "./types.js";

export class CompilerWorkerPool {
  private readonly queue = new Queue<CompilerJobData, CompilerJobResult>(
    COMPILER_QUEUE_NAME,
    {
      connection: createRedisConnection(),
    }
  );

  private readonly workers = new Map<
    number,
    Worker<CompilerJobData, CompilerJobResult>
  >();
  private autoscaleTimer: NodeJS.Timeout | null = null;
  private nextWorkerId = 1;

  async start() {
    await this.syncWorkerCount(compilerQueueConfig.minWorkers);
    this.autoscaleTimer = setInterval(() => {
      void this.reconcileWorkerCount();
    }, compilerQueueConfig.autoscaleIntervalMs);

    console.log(
      `Compiler worker pool started with ${this.workers.size} worker(s)`
    );
  }

  async stop() {
    if (this.autoscaleTimer) {
      clearInterval(this.autoscaleTimer);
      this.autoscaleTimer = null;
    }

    const allWorkers = Array.from(this.workers.values());
    this.workers.clear();

    await Promise.all(allWorkers.map((worker) => worker.close()));
    await this.queue.close();
  }

  private async reconcileWorkerCount() {
    const counts = await this.queue.getJobCounts("waiting", "active");
    const currentLoad = (counts.waiting ?? 0) + (counts.active ?? 0);

    const desiredWorkerCount = Math.min(
      compilerQueueConfig.maxWorkers,
      Math.max(
        compilerQueueConfig.minWorkers,
        Math.ceil(currentLoad / compilerQueueConfig.targetJobsPerWorker) || 1
      )
    );

    await this.syncWorkerCount(desiredWorkerCount);
  }

  private async syncWorkerCount(targetWorkerCount: number) {
    while (this.workers.size < targetWorkerCount) {
      this.addWorker();
    }

    while (this.workers.size > targetWorkerCount) {
      const workerEntry = Array.from(this.workers.entries()).pop();
      if (!workerEntry) {
        break;
      }

      const [workerId, worker] = workerEntry;
      this.workers.delete(workerId);
      await worker.close();
    }
  }

  private addWorker() {
    const workerId = this.nextWorkerId++;

    const worker = new Worker<CompilerJobData, CompilerJobResult>(
      COMPILER_QUEUE_NAME,
      async (job) => this.processJob(job, workerId),
      {
        connection: createRedisConnection(),
        concurrency: 1,
      }
    );

    worker.on("completed", (job) => {
      console.log(`Compiler job ${job.id} completed on worker-${workerId}`);
    });

    worker.on("failed", (job, error) => {
      console.error(
        `Compiler job ${job?.id ?? "unknown"} failed on worker-${workerId}`,
        error
      );
    });

    this.workers.set(workerId, worker);
  }

  private async processJob(
    job: Job<CompilerJobData, CompilerJobResult>,
    workerId: number
  ) {
    const progress: CompilerJobProgress = {
      stage: "running",
      message: "Worker picked the job. Code is running.",
      updatedAt: new Date().toISOString(),
      workerId: `worker-${workerId}`,
    };

    await job.updateProgress(progress);
    return executeCompilerJob(job.data);
  }
}
