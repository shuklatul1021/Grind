import {
  SUPPORTED_COMPILER_LANGUAGES,
  executeCompilerJob,
  type CompilerLanguage,
} from "@repo/compiler";
import type { TestCase } from "@prisma/client";

type ExecutableSnippet = {
  language: CompilerLanguage;
  code: string;
};

export type ContestJudgeResult = {
  verdict:
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "RUNTIME_ERROR"
    | "COMPILATION_ERROR";
  passedTestCases: number;
  totalTestCases: number;
  executionTime: number;
  error?: string;
  expectedOutput?: string;
  actualOutput?: string;
  failedTestCase?: number;
};

export function isSupportedContestLanguage(
  language: string,
): language is CompilerLanguage {
  return SUPPORTED_COMPILER_LANGUAGES.includes(language as CompilerLanguage);
}

function parseExecutableSnippets(testCaseCode: string | null): ExecutableSnippet[] {
  if (!testCaseCode) {
    return [];
  }

  try {
    return JSON.parse(testCaseCode) as ExecutableSnippet[];
  } catch {
    return [];
  }
}

function buildSubmissionSource(
  userCode: string,
  executableSnippet: string,
  language: CompilerLanguage,
) {
  switch (language) {
    case "java":
    case "cpp":
    case "c":
      return `${executableSnippet}\n${userCode}`;
    default:
      return `${userCode}\n${executableSnippet}`;
  }
}

function inferFailureVerdict(error: string) {
  const normalizedError = error.toLowerCase();
  if (
    normalizedError.includes("compile") ||
    normalizedError.includes("syntax") ||
    normalizedError.includes("javac") ||
    normalizedError.includes("gcc") ||
    normalizedError.includes("g++") ||
    normalizedError.includes("rustc")
  ) {
    return "COMPILATION_ERROR" as const;
  }

  return "RUNTIME_ERROR" as const;
}

export async function judgeContestSubmission(options: {
  code: string;
  language: CompilerLanguage;
  testCases: TestCase[];
}) {
  const { code, language, testCases } = options;
  let passedTestCases = 0;
  let cumulativeExecutionTime = 0;

  for (let index = 0; index < testCases.length; index += 1) {
    const testCase = testCases[index];
    if (!testCase) {
      continue;
    }

    const executableSnippets = parseExecutableSnippets(testCase.testcasecode ?? null);
    const executableSnippet = executableSnippets.find(
      (item) => item.language === language,
    );

    if (!executableSnippet) {
      return {
        verdict: "COMPILATION_ERROR",
        passedTestCases,
        totalTestCases: testCases.length,
        executionTime: cumulativeExecutionTime,
        error: `Language '${language}' is not configured for contest evaluation.`,
        failedTestCase: index + 1,
      } satisfies ContestJudgeResult;
    }

    const result = await executeCompilerJob({
      code: buildSubmissionSource(code, executableSnippet.code, language),
      language,
      input: testCase.input || undefined,
      userId: "contest-judge",
      submittedAt: new Date().toISOString(),
    });

    cumulativeExecutionTime += result.executionTime;

    if (result.error.trim()) {
      return {
        verdict: inferFailureVerdict(result.error),
        passedTestCases,
        totalTestCases: testCases.length,
        executionTime: cumulativeExecutionTime,
        error: result.error,
        failedTestCase: index + 1,
      } satisfies ContestJudgeResult;
    }

    if (result.output.trim() !== testCase.expectedOutput.trim()) {
      return {
        verdict: "WRONG_ANSWER",
        passedTestCases,
        totalTestCases: testCases.length,
        executionTime: cumulativeExecutionTime,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output.trim(),
        failedTestCase: index + 1,
      } satisfies ContestJudgeResult;
    }

    passedTestCases += 1;
  }

  return {
    verdict: "ACCEPTED",
    passedTestCases,
    totalTestCases: testCases.length,
    executionTime: cumulativeExecutionTime,
  } satisfies ContestJudgeResult;
}
