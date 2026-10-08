import { resolve } from "node:path";

import { z } from "zod";

import type { JsonValue } from "../types/json-value.js";

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const manifestInputFileSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("structured"),
    target: z.string(),
    content: jsonValueSchema,
  }),
  z.object({
    type: z.literal("text"),
    target: z.string(),
    text: z.string(),
  }),
]);

const manifestInputSchema = z.object({
  files: z.array(manifestInputFileSchema),
});

export type ManifestInput = z.infer<typeof manifestInputSchema>;
export type ManifestInputFile = z.infer<typeof manifestInputFileSchema>;

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

export function parseManifestInput(text: string): ManifestInput {
  const json = JSON.parse(text);
  return z.parse(manifestInputSchema, json);
}

export function resolveManifest(manifestInput: ManifestInput, base: string): Manifest {
  return {
    files: manifestInput.files.map((file) => ({
      ...file,
      target: resolve(base, file.target),
    })),
  };
}
