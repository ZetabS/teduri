type FileConfigWithContent = {
  content: Record<string, unknown>;
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
