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

export const manifestInputSchema = z.object({
  files: z.array(manifestInputFileSchema),
});

// I know you can infer types from zod schema,
// but I decided to declare the explicit types here for understanding.
type ManifestInputFile =
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

export type ManifestInput = {
  files: ManifestInputFile[];
};
