import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { evalTeduriConfiguration } from "../adapters/nix.js";
import { parseManifestInput, resolveManifest } from "../core/manifest.js";

type ApplyOptions = {
  base: string;
};

export async function apply(ref: string, { base }: ApplyOptions) {
  const raw = await evalTeduriConfiguration(ref);
  const input = parseManifestInput(raw);
  const manifest = resolveManifest(input, base);

  for (const file of manifest.files) {
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
