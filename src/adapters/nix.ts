import { execFile } from "child_process";
import { promisify } from "util";

import type { Manifest } from "../types/manifest.js";

const execFileAsync = promisify(execFile);

export async function evalWeaveConfiguration(ref: string): Promise<Manifest> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return JSON.parse(stdout);
}
