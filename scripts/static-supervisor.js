import { execSync } from "child_process";
import fs from "fs";
import "./static-server.js";
import { startGitPoll } from "./git-poll.js";

const BRANCH = process.env.PREVIEW_BRANCH || "main";
const REPO_URL = process.env.REPO_URL;

process.chdir("/app"); // 🔑 FORCE cwd

console.log("[supervisor] ensuring git repo");

if (!REPO_URL) {
  console.error("[supervisor] Missing REPO_URL env var");
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: "/app" });

if (!fs.existsSync(".git")) {
  run("git init");
}

try {
  run(`git remote add origin ${REPO_URL}`);
} catch (_) {
  run(`git remote set-url origin ${REPO_URL}`);
}

run(`git fetch origin ${BRANCH} --depth=1`);
run(`git checkout -B ${BRANCH} origin/${BRANCH}`);
run("git clean -fd");

console.log("[supervisor] static preview running");

// 🔑 start polling ONLY after git is ready
startGitPoll();
