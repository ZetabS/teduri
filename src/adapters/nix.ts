import { execFile } from "child_process";
import { promisify } from "util";

import type { Configuration } from "../types/configuration.js";

const execFileAsync = promisify(execFile);

export async function evalWeaveConfiguration(ref: string): Promise<Configuration> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return JSON.parse(stdout);
}
