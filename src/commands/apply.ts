import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { loadManifestFromNix } from "../adapters/load-manifest.js";

type ApplyOptions = {
  base: string;
};

export async function apply(ref: string, { base }: ApplyOptions) {
  const manifest = await loadManifestFromNix(ref, base);

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
