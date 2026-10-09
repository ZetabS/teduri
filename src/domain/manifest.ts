import { resolve } from "node:path";

import type { JsonValue } from "../types/json-value.js";
import type { ManifestInput } from "./manifest-input.js";

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

export function resolveManifest(manifestInput: ManifestInput, base: string): Manifest {
  return {
    files: manifestInput.files.map((file) => ({
      ...file,
      target: resolve(base, file.target),
    })),
  };
}
