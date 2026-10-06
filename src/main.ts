#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { promisify } from "node:util";

type FileConfigWithContent = {
  content: Record<string, unknown>;
  text: null;
};

type FileConfigWithText = {
  content: null;
  text: string;
};

type FileConfig = FileConfigWithContent | FileConfigWithText;

type Configuration = {
  weave: {
    files: Record<string, FileConfig>;
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
      let data: string;

      if (file.content !== null) {
        data = JSON.stringify(file.content, null, 2) + "\n";
      } else if (file.text !== null) {
        data = file.text;
      } else {
        throw new Error("file content or text is required");
      }

      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, data, { flag: "wx" });
    }
  } else if (command === "status") {
    if (!ref) {
      throw new Error("flake ref is required");
    }

    const { weave } = await evalWeaveConfiguration(ref);

    for (const target in weave.files) {
      const file = weave.files[target]!;
      let actual: string;
      try {
        actual = await readFile(target, "utf8");
      } catch (err) {
        if (err instanceof Error) {
          console.log(`${target}: missing`);
          return;
        } else {
          throw new Error("unexpected error", { cause: err });
        }
      }

      if (file.content !== null) {
        console.log(`${target}: structured status not implemented yet`);
      } else if (file.text !== null) {
        if (actual === file.text) {
          console.log(`${target}: clean`);
        } else {
          console.log(`${target}: modified`);
        }
      } else {
        throw new Error("file content or text is required");
      }
    }
  } else {
    throw new Error(`unknown command: ${command ?? "<none>"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
