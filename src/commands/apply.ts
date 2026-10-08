import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path/posix";

import { evalWeaveConfiguration } from "../adapters/nix.js";
import { parseManifest } from "../core/manifest.js";

export async function apply(ref: string) {
  const manifest = parseManifest(await evalWeaveConfiguration(ref));

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

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, data);
  }
}
