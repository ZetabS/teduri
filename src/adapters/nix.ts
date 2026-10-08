import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function evalWeaveConfiguration(ref: string): Promise<string> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return stdout;
}
