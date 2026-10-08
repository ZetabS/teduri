import { readFile } from "fs/promises";

import { diffStructured } from "../adapters/json-diff-ts.js";
import { evalWeaveConfiguration } from "../adapters/nix.js";

export async function status(ref: string) {
  const { weave } = await evalWeaveConfiguration(ref);

  for (const target in weave.files) {
    const file = weave.files[target]!;
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

    if (file.content !== null) {
      const changes = diffStructured(file.content, JSON.parse(actual));
      if (changes.length === 0) {
        console.log(`${target}: clean`);
      } else {
        console.log(`${target}: modified`);
      }
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
}
