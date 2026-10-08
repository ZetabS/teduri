import type { JsonValue } from "./json-value.js";

type FileConfigWithContent = {
  content: Record<string, JsonValue>;
  text: null;
};

type FileConfigWithText = {
  content: null;
  text: string;
};

type FileConfig = FileConfigWithContent | FileConfigWithText;

export type Configuration = {
  weave: {
    files: Record<string, FileConfig>;
  };
};
