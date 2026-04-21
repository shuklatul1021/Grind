import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { Sandbox } from "@e2b/code-interpreter";
import { ComilerRateLimiter } from "../limiter/RateLimiter.js";
import { prisma } from "@repo/db/DatabaseClient";
const poblemsubmitRouter = Router();

poblemsubmitRouter.post(
  "/submitcode/:problemId",
  ComilerRateLimiter,
  UserAuthMiddleware,
  async (req, res) => {
    try {
      const { code, language } = req.body;
      const problemId = req.params.problemId;

      if (!problemId) {
        return res.status(400).json({
          message: "Problem Id Require",
          success: false,
        });
      }

      if (!code || !language) {
        return res.status(400).json({
          message: "Please Provide All The Required Fields",
          success: false,
        });
      }

      const supportedLanguages = [
        "python",
        "javascript",
        "typescript",
        "java",
        "cpp",
        "c",
        "go",
        "rust",
      ];
      if (!supportedLanguages.includes(language)) {
        return res.status(400).json({
          message: `Language '${language}' is not supported. Supported: ${supportedLanguages.join(", ")}`,
          success: false,
        });
      }

      const sandbox = await Sandbox.create({
        apiKey: process.env.E2B_API_KEY!,
        timeoutMs: 60000,
      });

      const getTestCase = await prisma.challenges.findFirst({
        where: {
          id: problemId,
        },
        select: {
          testcase: true,
        },
      });
      if (!getTestCase) {
        return res.status(404).json({
          message: "Test Case Not Found For This Problem",
          success: false,
        });
      }
      /**
       * Run hidden judge harness only once.
       * `code` contains only user function from frontend, and `testcasecode`
       * contains language-specific harness that validates all test cases.
       */
      if (getTestCase.testcase.length === 0) {
        return res.status(400).json({
          message: "No Test Cases Configured For This Problem",
          success: false,
        });
      }

      const test = getTestCase.testcase[0]?.testcasecode;
      const firstTestCaseExpectation =
        getTestCase.testcase[0]?.expectedOutput ?? "";

      let syntaxCheck: Array<{ language: string; code: string }> = [];
      try {
        syntaxCheck = JSON.parse(test || "[]");
      } catch {
        return res.status(500).json({
          message: "Invalid Test Case Configuration",
          success: false,
        });
      }

      const testFirstCodeFormat = syntaxCheck.find(
        (item) => item.language === language,
      );

      if (!testFirstCodeFormat?.code) {
        return res.status(400).json({
          message: `Code For Language '${language}' Not Found In Test Case`,
          success: false,
        });
      }

      const combinedSourceCode = buildSubmissionSource(
        code,
        testFirstCodeFormat.code,
        language,
      );

      let syntexoutput = "";
      let syntexerror = "";
      let syntexexecutionTime = 0;

      ({
        output: syntexoutput,
        error: syntexerror,
        executionTime: syntexexecutionTime,
      } = await runByLanguage(sandbox, language, combinedSourceCode));

      console.log("Execution Time:", syntexexecutionTime);
      console.log("Output:", syntexoutput);
      console.log("Error:", syntexerror);

      if (syntexerror.trim()) {
        const errorMessage = isCompilationOrSyntaxError(syntexerror)
          ? "Syntax Error In Code"
          : "Test Cases Failed";

        return res.status(400).json({
          message: errorMessage,
          error: syntexerror,
          success: false,
        });
      }

      if (
        firstTestCaseExpectation.trim() &&
        firstTestCaseExpectation.trim() !== syntexoutput.trim()
      ) {
        return res.status(400).json({
          message: "Test Cases Failed",
          expectedOutput: firstTestCaseExpectation,
          yourOutput: syntexoutput.trim(),
          success: false,
        });
      }

      const GetUserSolvedProblems = await prisma.user.findFirst({
        where: { id: req.userId },
        select: { SolvedProblem: true },
      });

      const IsProblemAlreadySolved =
        GetUserSolvedProblems?.SolvedProblem.includes(problemId);

      if (!IsProblemAlreadySolved) {
        await prisma.user.update({
          where: { id: req.userId },
          data: {
            problemsSolved: { increment: 1 },
            SolvedProblem: {
              push: problemId,
            },
          },
        });
      }

      return res.status(200).json({
        message: "Code Execution Completed Successfully",
        description: "All Test Cases Executed",
        success: true,
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

function buildSubmissionSource(
  userCode: string,
  executableCode: string,
  language: string,
) {
  const placeholderTokens = ["{{USER_CODE}}", "__USER_CODE__"];

  for (const token of placeholderTokens) {
    if (executableCode.includes(token)) {
      return executableCode.split(token).join(userCode);
    }
  }

  switch (language) {
    case "java":
    case "cpp":
    case "c":
      return `${executableCode}\n${userCode}`;
    default:
      return `${userCode}\n${executableCode}`;
  }
}

function isCompilationOrSyntaxError(error: string) {
  const normalizedError = error.toLowerCase();
  return (
    normalizedError.includes("syntax") ||
    normalizedError.includes("compile") ||
    normalizedError.includes("javac") ||
    normalizedError.includes("gcc") ||
    normalizedError.includes("g++") ||
    normalizedError.includes("rustc") ||
    normalizedError.includes("typescript")
  );
}

function shellEscape(value: string) {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

async function runByLanguage(
  sandbox: any,
  language: string,
  sourceCode: string,
  input?: string,
) {
  switch (language) {
    case "python":
      return runPython(sandbox, sourceCode, input);
    case "javascript":
      return runJavaScript(sandbox, sourceCode, input);
    case "typescript":
      return runTypeScript(sandbox, sourceCode, input);
    case "java":
      return runJava(sandbox, sourceCode, input);
    case "cpp":
      return runCpp(sandbox, sourceCode, input);
    case "c":
      return runC(sandbox, sourceCode, input);
    case "go":
      return runGo(sandbox, sourceCode, input);
    case "rust":
      return runRust(sandbox, sourceCode, input);
    default:
      return {
        output: "",
        error: `Language '${language}' is not supported.`,
        executionTime: 0,
      };
  }
}

async function runPython(sandbox: any, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.py", code);
    const execution = await sandbox.commands.run(
      input ? `echo "${input}" | python3 /tmp/main.py` : "python3 /tmp/main.py",
    );
    return {
      output: execution.stdout,
      error: execution.stderr,
      executionTime: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      output: error.result?.stdout || "",
      error: error.result?.stderr || error.message || "Execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runJavaScript(sandbox: any, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.js", code);
    const execution = await sandbox.commands.run(
      input ? `echo "${input}" | node /tmp/main.js` : "node /tmp/main.js",
    );
    console.log("JavaScript execution result:", execution);
    return {
      output: execution.stdout,
      error: execution.stderr,
      executionTime: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      output: error.result?.stdout || "",
      error: error.result?.stderr || error.message || "Execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runTypeScript(sandbox: any, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.ts", code);
    await sandbox.commands.run(
      "npm install -g typescript ts-node 2>/dev/null || true",
    );
    const execution = await sandbox.commands.run(
      input ? `echo "${input}" | ts-node /tmp/main.ts` : "ts-node /tmp/main.ts",
    );
    return {
      output: execution.stdout,
      error: execution.stderr,
      executionTime: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      output: error.result?.stdout || "",
      error: error.result?.stderr || error.message || "Execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runJava(sandbox: any, code: string, input?: string) {
  const startTime = Date.now();
  try {
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : "Main";
    await sandbox.files.write(`/tmp/${className}.java`, code);

    try {
      const compile = await sandbox.commands.run(
        `javac /tmp/${className}.java`,
      );
      if (compile.stderr && compile.exitCode !== 0) {
        return {
          output: "",
          error: compile.stderr,
          executionTime: Date.now() - startTime,
        };
      }
    } catch (compileError: any) {
      return {
        output: "",
        error:
          compileError.result?.stderr ||
          compileError.message ||
          "Compilation failed",
        executionTime: Date.now() - startTime,
      };
    }

    try {
      const execution = await sandbox.commands.run(
        input
          ? `cd /tmp && echo "${input}" | java ${className}`
          : `cd /tmp && java ${className}`,
      );
      return {
        output: execution.stdout,
        error: execution.stderr,
        executionTime: Date.now() - startTime,
      };
    } catch (execError: any) {
      return {
        output: execError.result?.stdout || "",
        error:
          execError.result?.stderr || execError.message || "Execution failed",
        executionTime: Date.now() - startTime,
      };
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message || "Java execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runCpp(sandbox: any, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.cpp", code);

    try {
      const compile = await sandbox.commands.run(
        "g++ /tmp/main.cpp -o /tmp/main",
      );
      if (compile.stderr && compile.exitCode !== 0) {
        return {
          output: "",
          error: compile.stderr,
          executionTime: Date.now() - startTime,
        };
      }
    } catch (compileError: any) {
      console.log("C++ compilation error:", compileError);
      return {
        output: "",
        error:
          compileError.result?.stderr ||
          compileError.message ||
          "Compilation failed",
        executionTime: Date.now() - startTime,
      };
    }

    try {
      const execution = await sandbox.commands.run(
        input ? `echo "${input}" | /tmp/main` : "/tmp/main",
      );
      console.log("C++ execution result:", execution);
      return {
        output: execution.stdout,
        error: execution.stderr,
        executionTime: Date.now() - startTime,
      };
    } catch (execError: any) {
      return {
        output: execError.result?.stdout || "",
        error:
          execError.result?.stderr || execError.message || "Execution failed",
        executionTime: Date.now() - startTime,
      };
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message || "C++ execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runC(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.c", code);

    await sandbox.commands.run(
      "if ! command -v gcc >/dev/null 2>&1; then sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y gcc; fi",
    );

    const compile = await sandbox.commands
      .run("gcc /tmp/main.c -o /tmp/main")
      .catch((e: any) => e.result ?? { stderr: e.message, exitCode: 1 });

    if (compile.exitCode !== 0) {
      return {
        output: "",
        error: compile.stderr || "Compilation failed",
        executionTime: Date.now() - startTime,
      };
    }

    try {
      const execution = await sandbox.commands.run(
        input ? `printf '%s' ${shellEscape(input)} | /tmp/main` : "/tmp/main",
      );
      return {
        output: execution.stdout ?? "",
        error: execution.stderr ?? "",
        executionTime: Date.now() - startTime,
      };
    } catch (execError: any) {
      return {
        output: execError.result?.stdout || "",
        error:
          execError.result?.stderr || execError.message || "Execution failed",
        executionTime: Date.now() - startTime,
      };
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message || "C execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runGo(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.go", code);

    await sandbox.commands.run(
      "if ! command -v go >/dev/null 2>&1; then sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y golang-go; fi",
    );

    const execution = await sandbox.commands.run(
      input
        ? `cd /tmp && printf '%s' ${shellEscape(input)} | go run main.go`
        : "cd /tmp && go run main.go",
    );
    return {
      output: execution.stdout ?? "",
      error: execution.stderr ?? "",
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      output: err.result?.stdout ?? "",
      error: err.result?.stderr ?? err.message ?? "Execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runRust(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.rs", code);

    await sandbox.commands.run(
      "if ! command -v rustc >/dev/null 2>&1; then sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y rustc; fi",
    );

    const compile = await sandbox.commands
      .run("rustc /tmp/main.rs -o /tmp/main_rust")
      .catch((e: any) => e.result ?? { stderr: e.message, exitCode: 1 });

    if (compile.exitCode !== 0) {
      return {
        output: "",
        error: compile.stderr || "Compilation failed",
        executionTime: Date.now() - startTime,
      };
    }

    try {
      const execution = await sandbox.commands
        .run(
          input
            ? `printf '%s' ${shellEscape(input)} | /tmp/main_rust`
            : "/tmp/main_rust",
        )
        .catch((e: any) => e.result ?? { stdout: "", stderr: e.message });

      return {
        output: execution.stdout ?? "",
        error: execution.stderr ?? "",
        executionTime: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        output: err.result?.stdout ?? "",
        error: err.result?.stderr ?? err.message ?? "Execution failed",
        executionTime: Date.now() - startTime,
      };
    }
  } catch (err: any) {
    return {
      output: "",
      error: err.message ?? "Rust execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

export default poblemsubmitRouter;
