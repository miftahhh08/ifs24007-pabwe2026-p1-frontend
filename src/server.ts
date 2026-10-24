import { spawn } from "node:child_process";

// Launcher Next.js: membaca APP_PORT dan APP_HOST dari .env (Bun memuat .env otomatis).
const mode = process.argv[2] === "start" ? "start" : "dev";
const port = process.env.APP_PORT || "3000";
const host = process.env.APP_HOST || "0.0.0.0";

const proc = spawn(process.execPath, ["run", "next", mode, "-p", port, "-H", host], {
  stdio: "inherit",
  env: process.env,
});

const shutdown = (signal: NodeJS.Signals) => {
  if (proc.pid) {
    proc.kill(signal);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

proc.on("exit", (code) => process.exit(code ?? 0));
