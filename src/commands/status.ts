import { diff as diffStructured } from "json-diff-ts";

import { readFileIfExists } from "../adapters/file-system.js";
import { evalWeaveConfiguration } from "../adapters/nix.js";
import { parseManifest } from "../core/manifest.js";

export async function status(ref: string) {
  const manifest = parseManifest(await evalWeaveConfiguration(ref));

  for (const file of manifest.files) {
    const target = file.target;

    const { exists, content: actual } = await readFileIfExists(target);

    if (!exists) {
      console.log(`${target}: missing`);
      continue;
    }

    if (file.type === "structured") {
      const changes = diffStructured(file.content, JSON.parse(actual));
      if (changes.length === 0) {
        console.log(`${target}: clean`);
      } else {
        console.log(`${target}: modified`);
      }
    } else if (file.type === "text") {
      if (actual === file.text) {
        console.log(`${target}: clean`);
      } else {
        console.log(`${target}: modified`);
      }
    }
  }
}
