import _ from "lodash";
import path, { join } from "path";
import fs from "fs";
import { log } from "../../utils/log";
import { isAsyncFunction } from "util/types";
import { isExistsSync } from "../../utils/helpers";

export default async function handlePlugin() {
  const __dirname = path.resolve();
  const pluginPath = path.join(__dirname, "./plugins/");

  const plugins = (await fs.promises.readdir(pluginPath))
    .filter((p) => !p.includes("deactive"))
    .map((p) => join(pluginPath, p, "index.js"));

  for (const plugin of plugins) {
    const pluginImport = await import(plugin);
    if (!pluginImport?.default) continue;
    // execute plugin
    log("Execute Plugin : ", plugin);
    if (isAsyncFunction(pluginImport.default)) {
      await pluginImport.default();
    } else pluginImport.default();
  }
}
