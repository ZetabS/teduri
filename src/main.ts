#!/usr/bin/env node

import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { init } from "./commands/init.js";
import { status } from "./commands/status.js";
import type { Configuration } from "./types/configuration.js";

const execFileAsync = promisify(execFile);

export async function evalWeaveConfiguration(ref: string): Promise<Configuration> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return JSON.parse(stdout);
}

async function main(): Promise<void> {
  const [command, ref] = process.argv.slice(2);

  if (!ref) {
    throw new Error("flake ref is required");
  }

  if (command === "init") {
    await init(ref);
  } else if (command === "status") {
    await status(ref);
  } else {
    throw new Error(`unknown command: ${command ?? "<none>"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
