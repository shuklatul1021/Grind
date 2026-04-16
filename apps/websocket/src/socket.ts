import { WebSocket, WebSocketServer } from "ws";
import Docker from "dockerode";
import dotenv from "dotenv";

dotenv.config();

const docker = new Docker();
const PORT = Number(process.env.WS_PORT || process.env.WEBSOCKET_PORT || 8080);
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

interface RunMessage {
  type: "run";
  code: string;
  language: string;
}

interface StdinMessage {
  type: "stdin" | "input";
  input?: string;
  content?: string;
}

type ClientMessage = RunMessage | StdinMessage;

interface ExecutionSpec {
  images: string[];
  fileName: string;
  command: string;
}

interface SessionState {
  container: Docker.Container | null;
  stream: NodeJS.ReadWriteStream | null;
  runToken: number;
  runTimestamps: number[];
  pendingInput: string[];
}

function safeSend(ws: WebSocket, payload: Record<string, unknown>): void {
  if (ws.readyState !== WebSocket.OPEN) {
    return;
  }

  ws.send(JSON.stringify(payload));
}

function parseMessage(raw: string): ClientMessage | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (
      parsed.type === "run" &&
      typeof parsed.code === "string" &&
      typeof parsed.language === "string"
    ) {
      return {
        type: "run",
        code: parsed.code,
        language: parsed.language,
      };
    }

    if (parsed.type === "stdin" || parsed.type === "input") {
      const input =
        typeof parsed.input === "string"
          ? parsed.input
          : typeof parsed.content === "string"
            ? parsed.content
            : null;

      if (input === null) {
        return null;
      }

      return {
        type: parsed.type,
        input,
      };
    }

    return null;
  } catch {
    return null;
  }
}

function getExecutionSpec(language: string): ExecutionSpec | null {
  switch (language) {
    case "python":
      return {
        images: ["runner-python:latest", "python:3.11-alpine"],
        fileName: "main.py",
        command: "python3 main.py",
      };
    case "javascript":
      return {
        images: ["runner-javascript:latest", "node:20-alpine"],
        fileName: "main.js",
        command: "node main.js",
      };
    case "typescript":
      return {
        images: ["runner-typescript:latest", "node:20-alpine"],
        fileName: "main.ts",
        command:
          "if command -v ts-node >/dev/null 2>&1; then ts-node main.ts; else echo 'ts-node not found in container image. Use runner-typescript:latest.' >&2; exit 127; fi",
      };
    case "java":
      return {
        images: ["eclipse-temurin:17-jdk-alpine", "runner-java:latest"],
        fileName: "Main.java",
        command: "javac Main.java && java Main",
      };
    case "c":
      return {
        images: ["runner-c:latest", "gcc:13"],
        fileName: "main.c",
        command: "gcc main.c -o app && ./app",
      };
    case "cpp":
      return {
        images: ["runner-cpp:latest", "gcc:13"],
        fileName: "main.cpp",
        command: "g++ main.cpp -o app && ./app",
      };
    case "go":
      return {
        images: ["golang:1.22-alpine", "runner-go:latest"],
        fileName: "main.go",
        command: "go run main.go",
      };
    case "rust":
      return {
        images: ["rust:1.77-alpine", "runner-rust:latest"],
        fileName: "main.rs",
        command: "rustc main.rs -o app && ./app",
      };
    default:
      return null;
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown Docker error";
}

function isNoSuchImageError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes("no such image") || message.includes("not found");
}

async function pullImage(image: string): Promise<void> {
  const pullStream = await docker.pull(image);

  await new Promise<void>((resolve, reject) => {
    docker.modem.followProgress(pullStream, (err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function createExecutionContainerConfig(image: string) {
  return {
    Image: image,
    Entrypoint: [],
    Tty: true,
    OpenStdin: true,
    StdinOnce: false,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    NetworkDisabled: true,
    Cmd: ["/bin/sh", "-lc", "sleep 300"],
    HostConfig: {
      Memory: 256 * 1024 * 1024,
      CpuPeriod: 100000,
      CpuQuota: 50000,
      AutoRemove: true,
    },
  };
}

async function createExecutionContainer(
  language: string,
  spec: ExecutionSpec,
): Promise<Docker.Container> {
  let lastError: unknown = null;

  for (const image of spec.images) {
    try {
      return await docker.createContainer(
        createExecutionContainerConfig(image),
      );
    } catch (createError) {
      lastError = createError;

      if (!isNoSuchImageError(createError)) {
        continue;
      }

      try {
        await pullImage(image);
        return await docker.createContainer(
          createExecutionContainerConfig(image),
        );
      } catch (pullError) {
        lastError = pullError;
      }
    }
  }

  throw new Error(
    `No Docker image available for ${language}. Tried: ${spec.images.join(", ")}. ${getErrorMessage(lastError)}`,
  );
}

async function destroyContainer(
  container: Docker.Container | null,
): Promise<void> {
  if (!container) {
    return;
  }

  try {
    await container.kill();
  } catch {
    // no-op
  }

  try {
    await container.remove({ force: true });
  } catch {
    // no-op
  }
}

async function cleanupSession(state: SessionState): Promise<void> {
  if (state.stream) {
    state.stream.removeAllListeners();
    state.stream.end();
    state.stream = null;
  }

  state.pendingInput = [];

  const currentContainer = state.container;
  state.container = null;
  await destroyContainer(currentContainer);
}

async function executeInteractiveRun(
  ws: WebSocket,
  state: SessionState,
  runToken: number,
  code: string,
  language: string,
): Promise<void> {
  const spec = getExecutionSpec(language);

  if (!spec) {
    safeSend(ws, {
      type: "error",
      message: `Unsupported language: ${language}`,
    });
    safeSend(ws, { type: "exit", code: 1 });
    return;
  }

  await cleanupSession(state);

  let container: Docker.Container | null = null;
  let finished = false;

  const finalize = async (exitCode: number, errorMessage?: string) => {
    if (finished || runToken !== state.runToken) {
      return;
    }
    finished = true;

    if (errorMessage) {
      safeSend(ws, {
        type: "error",
        message: errorMessage,
      });
    }

    safeSend(ws, {
      type: "exit",
      code: exitCode,
    });

    await cleanupSession(state);
  };

  try {
    container = await createExecutionContainer(language, spec);

    if (runToken !== state.runToken || ws.readyState !== WebSocket.OPEN) {
      await destroyContainer(container);
      return;
    }

    await container.start();

    if (runToken !== state.runToken || ws.readyState !== WebSocket.OPEN) {
      await destroyContainer(container);
      return;
    }

    const encodedCode = Buffer.from(code, "utf8").toString("base64");
    const command = [
      "set -e",
      "mkdir -p /tmp/grind",
      `printf '%s' '${encodedCode}' | base64 -d > /tmp/grind/${spec.fileName}`,
      "cd /tmp/grind",
      spec.command,
    ].join(" && ");

    const exec = await container.exec({
      Cmd: ["/bin/sh", "-lc", command],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    });

    const stream = (await exec.start({
      hijack: true,
      stdin: true,
    })) as NodeJS.ReadWriteStream;

    if (runToken !== state.runToken || ws.readyState !== WebSocket.OPEN) {
      stream.end();
      await destroyContainer(container);
      return;
    }

    state.container = container;
    state.stream = stream;

    if (state.pendingInput.length > 0) {
      try {
        for (const bufferedInput of state.pendingInput) {
          stream.write(bufferedInput);
        }
      } catch {
        // no-op
      } finally {
        state.pendingInput = [];
      }
    }

    stream.on("data", (chunk: Buffer) => {
      if (runToken !== state.runToken) {
        return;
      }

      safeSend(ws, {
        type: "output",
        content: chunk.toString(),
      });
    });

    stream.on("error", (error: Error) => {
      void finalize(1, `Execution stream error: ${error.message}`);
    });

    stream.on("end", async () => {
      let exitCode = 0;

      try {
        const inspectResult = await exec.inspect();
        exitCode = inspectResult.ExitCode ?? 0;
      } catch {
        exitCode = 1;
      }

      await finalize(exitCode);
    });
  } catch (error) {
    await destroyContainer(container);

    if (runToken !== state.runToken) {
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to start interactive execution.";

    safeSend(ws, {
      type: "error",
      message,
    });
    safeSend(ws, {
      type: "exit",
      code: 1,
    });

    await cleanupSession(state);
  }
}

const socket = new WebSocketServer({ port: PORT });

socket.on("connection", (ws: WebSocket) => {
  const state: SessionState = {
    container: null,
    stream: null,
    runToken: 0,
    runTimestamps: [],
    pendingInput: [],
  };

  ws.on("message", (rawMessage) => {
    const parsed = parseMessage(rawMessage.toString());

    if (!parsed) {
      safeSend(ws, {
        type: "error",
        message: "Invalid message payload.",
      });
      return;
    }

    if (parsed.type === "stdin" || parsed.type === "input") {
      const inputValue = parsed.input ?? parsed.content ?? "";

      if (!state.stream) {
        state.pendingInput.push(inputValue);
        return;
      }

      try {
        state.stream.write(inputValue);
      } catch {
        safeSend(ws, {
          type: "error",
          message: "Failed to forward stdin to running process.",
        });
      }
      return;
    }

    if (parsed.type !== "run") {
      return;
    }

    const now = Date.now();
    state.runTimestamps = state.runTimestamps.filter(
      (timestamp) => now - timestamp < WINDOW_MS,
    );

    if (state.runTimestamps.length >= RATE_LIMIT) {
      safeSend(ws, {
        type: "error",
        message: `Rate limit exceeded. Max ${RATE_LIMIT} runs per minute. Please wait.`,
      });
      return;
    }

    state.runTimestamps.push(now);
    state.runToken += 1;
    const currentRunToken = state.runToken;

    void executeInteractiveRun(
      ws,
      state,
      currentRunToken,
      parsed.code,
      parsed.language,
    );
  });

  ws.on("close", () => {
    state.runToken += 1;
    void cleanupSession(state);
  });

  ws.on("error", () => {
    state.runToken += 1;
    void cleanupSession(state);
  });
});
