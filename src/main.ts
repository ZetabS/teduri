#!/usr/bin/env node

import { homedir } from "node:os";

import { Command } from "@commander-js/extra-typings";

import { apply } from "./commands/apply.js";
import { diff } from "./commands/diff.js";
import { status } from "./commands/status.js";

const program = new Command();

program.name("weave");

program
  .command("status")
  .argument("<ref>", "manifest flake reference")
  .option("--base <path>", "base directory for relative targets", homedir())
  .action(status);

program
  .command("diff")
  .argument("<ref>", "manifest flake reference")
  .option("--base <path>", "base directory for relative targets", homedir())
  .action(diff);

program
  .command("apply")
  .argument("<ref>", "manifest flake reference")
  .option("--base <path>", "base directory for relative targets", homedir())
  .action(apply);

await program.parseAsync();
