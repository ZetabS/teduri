import { readFile } from "node:fs/promises";

type FileReadResult =
  | {
      exists: true;
      content: string;
    }
  | {
      exists: false;
      content?: never;
    };

export async function readFileIfExists(path: string): Promise<FileReadResult> {
  try {
    const content = await readFile(path, "utf8");
    return {
      exists: true,
      content,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {
        exists: false,
      };
    }

    throw error;
  }
}
