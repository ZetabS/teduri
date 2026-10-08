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

const fileSchema = z.discriminatedUnion("type", [
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

const manifestSchema = z.object({
  files: z.array(fileSchema),
});

export type Manifest = z.infer<typeof manifestSchema>;
export type ManifestFile = z.infer<typeof fileSchema>;

export function parseManifest(input: string): Manifest {
  const json = JSON.parse(input);
  return z.parse(manifestSchema, json);
}
