export const SUPPORTED_COMPILER_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
] as const;

export const COMPILER_QUEUE_NAME = "compiler-execution-jobs";

export type CompilerLanguage = (typeof SUPPORTED_COMPILER_LANGUAGES)[number];

export interface CompilerJobData {
  code: string;
  language: CompilerLanguage;
  input?: string | undefined;
  userId: string;
  submittedAt: string;
}

export interface CompilerJobProgress {
  stage: "queued" | "running";
  message: string;
  updatedAt: string;
  workerId?: string | undefined;
}

export interface CompilerJobResult {
  output: string;
  error: string;
  executionTime: number;
  language: CompilerLanguage;
  message: string;
}

export type CompilerJobStatus = "queued" | "running" | "completed" | "failed";
