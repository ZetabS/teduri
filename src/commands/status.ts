import { readFile } from "fs/promises";

import { diffStructured } from "../adapters/json-diff-ts.js";
import { evalWeaveConfiguration } from "../adapters/nix.js";

export async function status(ref: string) {
  const manifest = await evalWeaveConfiguration(ref);

  for (const file of manifest.files) {
    const target = file.target;
    let actual: string;
    try {
      actual = await readFile(target, "utf8");
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        console.log(`${target}: missing`);
        return;
      } else {
        throw new Error("unexpected error", { cause: error });
      }
    }

    if (file.content !== undefined) {
      const changes = diffStructured(file.content, JSON.parse(actual));
      if (changes.length === 0) {
        console.log(`${target}: clean`);
      } else {
        console.log(`${target}: modified`);
      }
    } else if (file.text !== undefined) {
      if (actual === file.text) {
        console.log(`${target}: clean`);
      } else {
        console.log(`${target}: modified`);
      }
    } else {
      throw new Error("file content or text is required");
    }
  }
}
