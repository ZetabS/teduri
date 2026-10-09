import { resolve } from "node:path";

import type { JsonValue } from "../types/json-value.js";
import type { Config } from "./config.js";

export type Manifest = {
  files: ManifestFile[];
};

export type ManifestFile =
  | {
      type: "structured";
      target: string;
      content: JsonValue;
    }
  | {
      type: "text";
      target: string;
      text: string;
    };

export function resolveManifest(config: Config, base: string): Manifest {
  return {
    files: config.files.map((file) => ({
      ...file,
      target: resolve(base, file.target),
    })),
  };
}
