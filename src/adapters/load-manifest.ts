import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { z } from "zod";

import { type ManifestInput, manifestInputSchema } from "../core/manifest-input.js";
import { type Manifest, resolveManifest } from "../core/manifest.js";

const execFileAsync = promisify(execFile);

async function nixEvalJson(ref: string): Promise<string> {
  const { stdout } = await execFileAsync("nix", ["eval", "--json", ref]);

  return stdout;
}

export async function loadManifestFromNix(ref: string, base: string): Promise<Manifest> {
  const text = await nixEvalJson(ref);
  const raw = JSON.parse(text);
  const input: ManifestInput = z.parse(manifestInputSchema, raw);

  return resolveManifest(input, base);
}
