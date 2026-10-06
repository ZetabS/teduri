#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { promisify } from "node:util";

type FileMetadata = {
  content: {
    [key: string]: unknown;
  };
};

type Configuration = {
  weave: {
    files: {
      [target: string]: FileMetadata;
    };
  };
};

const execFileAsync = promisify(execFile);

async function evalWeaveConfiguration(ref: string): Promise<Configuration> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return JSON.parse(stdout);
}

async function main(): Promise<void> {
  const [command, ref] = process.argv.slice(2);

  if (command === "init") {
    if (!ref) {
      throw new Error("flake ref is required");
    }

    const { weave } = await evalWeaveConfiguration(ref);

    for (const target in weave.files) {
      const file = weave.files[target]!;
      const json = JSON.stringify(file.content, null, 2) + "\n";

      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, json, { flag: "wx" });
    }

    return;
  }

  throw new Error(`unknown command: ${command ?? "<none>"}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
