import dotenv from "dotenv";
import { CompilerWorkerPool } from "@repo/compiler";

dotenv.config();

async function main() {
  const workerPool = new CompilerWorkerPool();
  await workerPool.start();

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down compiler worker pool.`);
    await workerPool.stop();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

main().catch((error) => {
  console.error("Compiler worker bootstrap failed", error);
  process.exit(1);
});
