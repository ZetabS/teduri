import { resolve } from "node:path";

import type { JsonValue } from "../types/json-value.js";
import type { Manifest } from "./manifest.js";

export type Intent = {
  files: FileIntent[];
};

export type FileIntent =
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

export function createIntent(manifest: Manifest, home: string): Intent {
  return {
    files: manifest.files.map((file) => ({
      ...file,
      target: resolve(home, file.target),
    })),
  };
}
