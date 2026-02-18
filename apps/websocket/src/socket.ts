import { WebSocketServer } from "ws";
import { spawn } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOG_FILE = path.join(__dirname, "..", "code.log");

function log(message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const logEntry = data
    ? `[${timestamp}] ${message} | ${JSON.stringify(data)}\n`
    : `[${timestamp}] ${message}\n`;

  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(logEntry.trim());
}

const socket = new WebSocketServer({ port: 8080 });
log("WebSocket server started", { port: 8080 });

socket.on("connection", (ws) => {
  const sessionId = Math.random().toString(36).substring(7);
  log("New connection", { sessionId });

  let containerId: string | null = null;
  let shell: any = null;
  let commandProcess: any = null;

  const RATE_LIMIT = 5;
  const WINDOW_MS = 60 * 1000;
  let runTimestamps: number[] = [];

  function cleanup(): void {
    log("Cleanup started", { sessionId, containerId });
    if (shell) {
      shell.kill("SIGKILL");
      log("Shell killed", { sessionId });
    }
    if (containerId) {
      spawn("docker", ["rm", "-f", containerId]);
      log("Container removed", { sessionId, containerId });
      containerId = null;
    }
  }

  ws.on("close", () => {
    log("Connection closed", { sessionId });
    cleanup();
  });

  ws.on("message", async (msg) => {
    const data = JSON.parse(msg.toString());
    log("Message received", {
      sessionId,
      type: data.type,
      language: data.language,
    });

    if (data.type === "input" && shell) {
      log("Input received", { sessionId, input: data.content });
      shell.stdin.write(data.content);
      return;
    }

    if (data.type === "run") {
      // Rate limiting logic
      const now = Date.now();
      runTimestamps = runTimestamps.filter((ts) => now - ts < WINDOW_MS);

      if (runTimestamps.length >= RATE_LIMIT) {
        log("Rate limit exceeded", {
          sessionId,
          attempts: runTimestamps.length,
        });
        ws.send(
          JSON.stringify({
            type: "error",
            message: `Rate limit exceeded. Max ${RATE_LIMIT} runs per minute. Please wait.`,
          }),
        );
        return;
      }
      runTimestamps.push(now);

      const { code, language } = data;
      log("Code execution started", {
        sessionId,
        language,
        codeLength: code.length,
      });

      cleanup();

      const run = spawn("docker", [
        "run",
        "-d",
        "-i",
        "--rm",
        "grind-sandbox",
        "bash",
      ]);

      log("Docker spawn initiated", { sessionId });

      run.stdout.on("data", (buffer) => {
        containerId = buffer.toString().trim();
        log("Container created", { sessionId, containerId });

        if (!containerId) return;

        shell = spawn("docker", ["exec", "-i", containerId, "bash"]);
        log("Shell spawned", { sessionId, containerId });

        shell.stdout.on("data", (chunk: Buffer) => {
          const output = chunk.toString();
          log("STDOUT", { sessionId, containerId, output });
          ws.send(
            JSON.stringify({
              type: "output",
              content: output,
            }),
          );
        });

        shell.stderr.on("data", (chunk: Buffer) => {
          const output = chunk.toString();
          log("STDERR", { sessionId, containerId, output });
          ws.send(
            JSON.stringify({
              type: "output",
              content: output,
            }),
          );
        });

        shell.on("close", (exitCode: number) => {
          log("Shell closed", { sessionId, containerId, exitCode });
          ws.send(
            JSON.stringify({
              type: "output",
              content: "\n✓ Code Execution Completed\n",
            }),
          );
          ws.send(
            JSON.stringify({
              type: "exit",
              code: exitCode,
            }),
          );
          cleanup();
        });

        const escaped = code.replace(/'/g, "'\\''");
        log("Executing code", { sessionId, language });

        switch (language) {
          case "python":
            log("Python execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > main.py\n`);
            shell.stdin.write("python3 main.py; exit\n");
            break;

          case "javascript":
            log("JavaScript execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > main.js\n`);
            shell.stdin.write("node main.js; exit\n");
            break;

          case "typescript":
            log("TypeScript execution", { sessionId });
            shell.stdin.write("npm install -g ts-node typescript\n");
            shell.stdin.write(`echo '${escaped}' > main.ts\n`);
            shell.stdin.write("ts-node main.ts; exit\n");
            break;

          case "java":
            log("Java compilation and execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > Main.java\n`);
            shell.stdin.write("javac Main.java && java Main; exit\n");
            break;

          case "c":
            log("C compilation and execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > main.c\n`);
            shell.stdin.write("gcc main.c -o app && ./app; exit\n");
            break;

          case "cpp":
            log("C++ compilation and execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > main.cpp\n`);
            shell.stdin.write("g++ main.cpp -o app && ./app; exit\n");
            break;

          case "go":
            log("Go execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > main.go\n`);
            shell.stdin.write("go run main.go; exit\n");
            break;

          case "rust":
            log("Rust compilation and execution", { sessionId });
            shell.stdin.write(`echo '${escaped}' > main.rs\n`);
            shell.stdin.write("rustc main.rs -o app && ./app; exit\n");
            break;

          default:
            log("Unsupported language", { sessionId, language });
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Unsupported language.",
              }),
            );
        }
      });
    }
  });
});
