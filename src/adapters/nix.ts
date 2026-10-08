import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function evalTeduriConfiguration(ref: string): Promise<string> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return stdout;
}
