#!/usr/bin/env node

import { diff } from "./commands/diff.js";
import { init } from "./commands/init.js";
import { status } from "./commands/status.js";

async function main(): Promise<void> {
  const [command, ref] = process.argv.slice(2);

  if (!ref) {
    throw new Error("flake ref is required");
  }

  if (command === "init") {
    await init(ref);
  } else if (command === "status") {
    await status(ref);
  } else if (command === "diff") {
    await diff(ref);
  } else {
    throw new Error(`unknown command: ${command ?? "<none>"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
