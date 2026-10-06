import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

async function main(): Promise<void> {
  const [command, target] = process.argv.slice(2);

  if (command === "init") {
    if (!target) {
      throw new Error("target path is required");
    }

    await mkdir(dirname(target), { recursive: true });

    const content = JSON.stringify({ hello: "world" }, null, 2) + "\n";

    await writeFile(target, content, { flag: "wx" });
    return;
  }

  throw new Error(`unknown command: ${command ?? "<none>"}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
