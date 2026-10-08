#!/usr/bin/env node

import { homedir } from "node:os";

import { Command } from "commander";

import { apply } from "./commands/apply.js";
import { diff } from "./commands/diff.js";
import { status } from "./commands/status.js";

const program = new Command();

program.name("weave");

program
  .command("status")
  .argument("<ref>", "manifest flake reference")
  .action(async (ref: string) => {
    await status(ref);
  });

program
  .command("diff")
  .argument("<ref>", "manifest flake reference")
  .action(async (ref: string) => {
    await diff(ref);
  });

program
  .command("apply")
  .argument("<ref>", "manifest flake reference")
  .action(async (ref: string) => {
    await apply(ref);
  });

await program.parseAsync();
