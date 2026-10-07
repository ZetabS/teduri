import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path/posix";

import { evalWeaveConfiguration } from "../main.js";

export async function init(ref: string) {
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
}
