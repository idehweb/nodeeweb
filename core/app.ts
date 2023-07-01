import express from "express";
import { expressLogger } from "./utils/log";
import { commonMiddleware, defaultMiddleware } from "./src/common/middleware";
import handlePlugin from "./src/common/handlePlugin";
import prepare from "./src/common/prepare";
import "./src/common/_d";
import { dbInit, dbRegisterModels } from "./src/common/db";
const app = express();

export default async function buildApp() {
  // prepare , create dirs
  await prepare();

  // register models
  await dbRegisterModels();

  // initial first records in db
  await dbInit();

  app.disable("x-powered-by");

  // logger
  app.use(expressLogger);

  // middleware
  app.use(defaultMiddleware);
  const mw = commonMiddleware();
  mw.forEach((w) => {
    if (Array.isArray(w)) {
      app.use(w[0], w[1]);
    } else app.use(w);
  });

  // plugins
  await handlePlugin();

  return app;
}
