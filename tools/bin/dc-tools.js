#!/usr/bin/env node
console.log("Delicate Clouds Tools CLI");
import { buildCli } from "../src/index.js";
const argvs = process.argv.slice(2);
if (argvs[0] === "build:cli") {
  buildCli();
}
