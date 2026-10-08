import { mkdir, writeFile } from "fs/promises";
import { dirname } from "node:path";

import { evalTeduriConfiguration } from "../adapters/nix.js";
import { createIntent } from "../core/intent.js";
import { parseManifest } from "../core/manifest.js";

type ApplyOptions = {
  base: string;
};

export async function apply(ref: string, { base }: ApplyOptions) {
  const raw = await evalTeduriConfiguration(ref);
  const manifest = parseManifest(raw);
  const intent = createIntent(manifest, base);

  for (const file of intent.files) {
    const target = file.target;
    let data: string;

    if (file.type === "structured") {
      data = JSON.stringify(file.content, null, 2) + "\n";
    } else if (file.type === "text") {
      data = file.text;
    } else {
      throw new Error("file content or text is required");
    }

    console.log(target);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, data);
  }
}
