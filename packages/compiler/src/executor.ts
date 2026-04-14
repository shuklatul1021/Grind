import type { CompilerJobData, CompilerJobResult } from "./types.js";
import { Sandbox } from "@e2b/code-interpreter";


function getE2bApiKey(): string {
  const key = process.env.E2B_API_KEY_PROD || "e2b_e39becf0696e0437ac04cc8284e06641a0b23ff6";
  if (!key) {
    throw new Error(
      "Missing E2B API key. Set E2B_API_KEY_PROD in your environment."
    );
  }
  return key;
}

export async function executeCompilerJob(
  job: CompilerJobData
): Promise<CompilerJobResult> {
  const sandbox = await Sandbox.create({
    apiKey: getE2bApiKey(),
    timeoutMs: 60_000,
  });

  try {
    let output = "";
    let error = "";
    let executionTime = 0;

    switch (job.language) {
      case "python":
        ({ output, error, executionTime } = await runPython(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "javascript":
        ({ output, error, executionTime } = await runJavaScript(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "typescript":
        ({ output, error, executionTime } = await runTypeScript(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "java":
        ({ output, error, executionTime } = await runJava(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "cpp":
        ({ output, error, executionTime } = await runCpp(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "c":
        ({ output, error, executionTime } = await runC(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "go":
        ({ output, error, executionTime } = await runGo(
          sandbox,
          job.code,
          job.input
        ));
        break;
      case "rust":
        ({ output, error, executionTime } = await runRust(
          sandbox,
          job.code,
          job.input
        ));
        break;
      default:
        error = `Unsupported language: ${(job as any).language}`;
    }

    return {
      output,
      error,
      executionTime,
      language: job.language,
      message: "Execution completed.",
    };
  } finally {
    // Always kill the sandbox to free E2B resources
    await sandbox.kill().catch(() => {
      /* ignore cleanup errors */
    });
  }
}


async function runPython(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.py", code);
    const execution = await sandbox.commands.run(
      input
        ? `printf '%s' ${shellEscape(input)} | python3 /tmp/main.py`
        : "python3 /tmp/main.py"
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

async function runJavaScript(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.js", code);
    const execution = await sandbox.commands.run(
      input
        ? `printf '%s' ${shellEscape(input)} | node /tmp/main.js`
        : "node /tmp/main.js"
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

async function runTypeScript(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.ts", code);
    // Install ts-node once; suppress noise with stderr redirect
    await sandbox.commands.run(
      "npm install -g typescript ts-node 2>/dev/null || true"
    );
    const execution = await sandbox.commands.run(
      input
        ? `printf '%s' ${shellEscape(input)} | ts-node /tmp/main.ts`
        : "ts-node /tmp/main.ts"
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

async function runJava(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : "Main";
    await sandbox.files.write(`/tmp/${className}.java`, code);

    // Compile
    const compile = await sandbox.commands.run(
      `javac /tmp/${className}.java`
    ).catch((e: any) => e.result ?? { stderr: e.message, exitCode: 1 });

    if (compile.exitCode !== 0 && compile.stderr) {
      return {
        output: "",
        error: compile.stderr,
        executionTime: Date.now() - startTime,
      };
    }

    // Run
    const execution = await sandbox.commands.run(
      input
        ? `cd /tmp && printf '%s' ${shellEscape(input)} | java ${className}`
        : `cd /tmp && java ${className}`
    ).catch((e: any) => e.result ?? { stdout: "", stderr: e.message });

    return {
      output: execution.stdout ?? "",
      error: execution.stderr ?? "",
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      output: "",
      error: err.message ?? "Java execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runCpp(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.cpp", code);

    const compile = await sandbox.commands.run(
      "g++ /tmp/main.cpp -o /tmp/main_cpp"
    ).catch((e: any) => e.result ?? { stderr: e.message, exitCode: 1 });

    if (compile.exitCode !== 0 && compile.stderr) {
      return {
        output: "",
        error: compile.stderr,
        executionTime: Date.now() - startTime,
      };
    }

    const execution = await sandbox.commands.run(
      input
        ? `printf '%s' ${shellEscape(input)} | /tmp/main_cpp`
        : "/tmp/main_cpp"
    ).catch((e: any) => e.result ?? { stdout: "", stderr: e.message });

    return {
      output: execution.stdout ?? "",
      error: execution.stderr ?? "",
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      output: "",
      error: err.message ?? "C++ execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runC(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.c", code);

    const compile = await sandbox.commands.run(
      "gcc /tmp/main.c -o /tmp/main_c"
    ).catch((e: any) => e.result ?? { stderr: e.message, exitCode: 1 });

    if (compile.exitCode !== 0 && compile.stderr) {
      return {
        output: "",
        error: compile.stderr,
        executionTime: Date.now() - startTime,
      };
    }

    const execution = await sandbox.commands.run(
      input
        ? `printf '%s' ${shellEscape(input)} | /tmp/main_c`
        : "/tmp/main_c"
    ).catch((e: any) => e.result ?? { stdout: "", stderr: e.message });

    return {
      output: execution.stdout ?? "",
      error: execution.stderr ?? "",
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      output: "",
      error: err.message ?? "C execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

async function runGo(sandbox: Sandbox, code: string, input?: string) {
  const startTime = Date.now();
  try {
    await sandbox.files.write("/tmp/main.go", code);
    const execution = await sandbox.commands.run(
      input
        ? `cd /tmp && printf '%s' ${shellEscape(input)} | go run main.go`
        : "cd /tmp && go run main.go"
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

    const compile = await sandbox.commands.run(
      "rustc /tmp/main.rs -o /tmp/main_rust"
    ).catch((e: any) => e.result ?? { stderr: e.message, exitCode: 1 });

    if (compile.exitCode !== 0 && compile.stderr) {
      return {
        output: "",
        error: compile.stderr,
        executionTime: Date.now() - startTime,
      };
    }

    const execution = await sandbox.commands.run(
      input
        ? `printf '%s' ${shellEscape(input)} | /tmp/main_rust`
        : "/tmp/main_rust"
    ).catch((e: any) => e.result ?? { stdout: "", stderr: e.message });

    return {
      output: execution.stdout ?? "",
      error: execution.stderr ?? "",
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      output: "",
      error: err.message ?? "Rust execution failed",
      executionTime: Date.now() - startTime,
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wraps a string in single-quotes and escapes any embedded single-quotes
 * so it's safe to pass as a shell argument via printf '%s'.
 */
function shellEscape(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
