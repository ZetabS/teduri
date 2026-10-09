import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { z } from "zod";

import { type Config, configSchema } from "../domain/config.js";
import { type Manifest, resolveManifest } from "../domain/manifest.js";

const execFileAsync = promisify(execFile);

async function nixEvalJson(ref: string): Promise<string> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return stdout;
}

export async function loadManifestFromNix(ref: string, base: string): Promise<Manifest> {
  const text = await nixEvalJson(ref);
  const raw = JSON.parse(text);
  const config: Config = z.parse(configSchema, raw);

  return resolveManifest(config, base);
}
