import { diff as diffStructured } from "json-diff-ts";

import { readFileIfExists } from "../adapters/file-system.js";
import { evalWeaveConfiguration } from "../adapters/nix.js";
import { createIntent } from "../core/intent.js";
import { parseManifest } from "../core/manifest.js";

type DiffOptions = {
  base: string;
};

export async function diff(ref: string, { base }: DiffOptions) {
  const raw = await evalWeaveConfiguration(ref);
  const manifest = parseManifest(raw);
  const intent = createIntent(manifest, base);

  for (const file of intent.files) {
    const target = file.target;

    const { exists, content: actual } = await readFileIfExists(target);

    if (!exists) {
      console.log(`${target}: missing`);
      continue;
    }

    if (file.type === "structured") {
      const changes = diffStructured(file.content, JSON.parse(actual));
      if (changes.length !== 0) {
        console.dir(changes, { depth: null });
      }
    } else if (file.type === "text") {
      if (actual !== file.text) {
        console.log(`${target}: text diff not implemented yet`);
      }
    } else {
      throw new Error("file content or text is required");
    }
  }
}
