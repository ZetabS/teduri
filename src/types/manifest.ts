import type { JsonValue } from "./json-value.js";

type StructuredFileConfig = {
  type: "structured";
  target: string;
  text: never;
  content: JsonValue;
};

type TextFileConfig = {
  type: "text";
  target: string;
  text: string;
  content: never;
};

type FileConfig = StructuredFileConfig | TextFileConfig;

export type Manifest = {
  files: FileConfig[];
};
