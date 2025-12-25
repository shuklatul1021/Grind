import { WebSocketServer } from "ws";
import { spawn, execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const socket = new WebSocketServer({ port: 8080 });

socket.on("connection", (ws) => {
  let containerId: string | null = null;
  let shell: any = null;
  let commandProcess: any = null;

  function cleanup() {
    if (shell) shell.kill("SIGKILL");
    if (containerId) {
      spawn("docker", ["rm", "-f", containerId]);
      containerId = null;
    }
  }

  ws.on("close", cleanup);

  ws.on("message", async (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.type === "input" && shell) {
      shell.stdin.write(data.content);
      return;
    }
    if (data.type === "run") {
      const { code, language } = data;
      cleanup();
      const run = spawn("docker", [
        "run",
        "-d",
        "-i",
        "--rm",
        "grind-sandbox",
        "bash",
      ]);

      run.stdout.on("data", (buffer) => {
        containerId = buffer.toString().trim();
        if (!containerId) return;
        shell = spawn("docker", ["exec", "-i", containerId, "bash"]);

        shell.stdout.on("data", (chunk: Buffer) => {
          ws.send(
            JSON.stringify({
              type: "output",
              content: chunk.toString(),
            })
          );
        });

        shell.stderr.on("data", (chunk: Buffer) => {
          ws.send(
            JSON.stringify({
              type: "output",
              content: chunk.toString(),
            })
          );
        });
        shell.on("close", (code: number) => {
          ws.send(
            JSON.stringify({
              type: "output",
              content: "\n✓ Code Execution Completed\n",
            })
          );
          ws.send(
            JSON.stringify({
              type: "exit",
              code: code,
            })
          );
          cleanup();
        });

        const escaped = code.replace(/'/g, "'\\''");
        switch (language) {
          case "python":
            shell.stdin.write(`echo '${escaped}' > main.py\n`);
            shell.stdin.write("python3 main.py; exit\n");
            break;

          case "javascript":
            shell.stdin.write(`echo '${escaped}' > main.js\n`);
            shell.stdin.write("node main.js; exit\n");
            break;

          case "typescript":
            shell.stdin.write("npm install -g ts-node typescript\n");
            shell.stdin.write(`echo '${escaped}' > main.ts\n`);
            shell.stdin.write("ts-node main.ts; exit\n");
            break;

          case "java":
            shell.stdin.write(`echo '${escaped}' > Main.java\n`);
            shell.stdin.write("javac Main.java\n");
            shell.stdin.write("java Main; exit\n");
            break;

          case "c":
            shell.stdin.write(`echo '${escaped}' > main.c\n`);
            shell.stdin.write("gcc main.c -o app\n");
            shell.stdin.write("./app; exit\n");
            break;

          case "cpp":
            shell.stdin.write(`echo '${escaped}' > main.cpp\n`);
            shell.stdin.write("g++ main.cpp -o app\n");
            shell.stdin.write("./app; exit\n");
            break;

          case "go":
            shell.stdin.write(`echo '${escaped}' > main.go\n`);
            shell.stdin.write("go run main.go; exit\n");
            break;

          case "rust":
            shell.stdin.write(`echo '${escaped}' > main.rs\n`);
            shell.stdin.write("rustc main.rs -o app\n");
            shell.stdin.write("./app; exit\n");
            break;

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Unsupported language.",
              })
            );
        }
      });
    }
  });
});
