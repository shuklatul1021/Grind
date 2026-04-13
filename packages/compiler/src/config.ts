function readNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const compilerQueueConfig = {
  redisUrl: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  removeOnComplete: readNumberEnv("COMPILER_REMOVE_ON_COMPLETE", 250),
  removeOnFail: readNumberEnv("COMPILER_REMOVE_ON_FAIL", 500),
  minWorkers: readNumberEnv("COMPILER_MIN_WORKERS", 1),
  maxWorkers: readNumberEnv("COMPILER_MAX_WORKERS", 6),
  targetJobsPerWorker: readNumberEnv("COMPILER_TARGET_JOBS_PER_WORKER", 4),
  autoscaleIntervalMs: readNumberEnv("COMPILER_AUTOSCALE_INTERVAL_MS", 5000),
  placeholderExecutionDelayMs: readNumberEnv(
    "COMPILER_PLACEHOLDER_EXECUTION_DELAY_MS",
    1500
  ),
};
