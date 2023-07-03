import express from "express";
import {
  commonMiddleware,
  headerMiddleware,
} from "../handlers/middleware.handler";
import handlePlugin from "../handlers/plugin.handler";
import prepare from "../handlers/prepare.handler";
import "./src/handlers/_d";
import { dbRegisterModels } from "../handlers/db.handler";
import store from "../../store";
import { dbInit } from "./db";
import { expressLogger } from "../handlers/log.handler";
const app = express();

store.app = app;

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
  app.use(headerMiddleware);
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
