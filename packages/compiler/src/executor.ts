import { compilerQueueConfig } from "./config.js";
import type { CompilerJobData, CompilerJobResult } from "./types.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeCompilerJob(
  job: CompilerJobData
): Promise<CompilerJobResult> {
  const startTime = Date.now();

  // Placeholder only: queue plumbing is live, but the real sandbox/docker
  // execution path should be wired into this function next.
  await sleep(compilerQueueConfig.placeholderExecutionDelayMs);

  return {
    output:
      "Compiler queue accepted this job and a worker processed it.\n\n" +
      "Actual sandbox/docker execution is intentionally not implemented yet.\n" +
      "Plug the runtime into packages/compiler/src/executor.ts.",
    error: "",
    executionTime: Date.now() - startTime,
    language: job.language,
    message: "Worker finished the placeholder execution flow.",
  };
}
