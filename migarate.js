const fs = require("fs/promises");
const { join } = require("path");

const shop_schema_path = "./shop/schema";
const module_schema_path = "./shop/src";

const schema_template = `
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    %SCHEMA%
},{timestamps:true});

export default schema;
`;

async function main() {
  const dirNames = process.argv
    .slice(2)
    .map((p) => join(module_schema_path, p));

  const bundleFiles = (
    await Promise.all(
      dirNames.map(async (p) => {
        const files = await fs.readdir(p);
        return files.filter((n) => n.includes("bundle")).map((n) => join(p, n));
      })
    )
  ).flat();

  for (const f of bundleFiles) {
    await fs.rm(f);
  }

  const modelFiles = (
    await Promise.all(
      dirNames.map(async (p) => {
        const files = await fs.readdir(p);
        return files.filter((n) => n.includes("model")).map((n) => join(p, n));
      })
    )
  ).flat();
}

main();
