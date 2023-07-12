import express from "express";
import cookieParser from "cookie-parser";
import { MiddleWare, MiddleWareError } from "../../types/global";
import bodyParser from "body-parser";
import path from "path";
import store from "../../store";
import { expressLogger } from "../handlers/log.handler";

const dirname = path.resolve();

const public_mediaFolder = path.join(dirname, "./public_media");
const adminFolder = path.join(dirname, "./admin");
const themeFolder = path.join(dirname, "./theme");

export const headerMiddleware: MiddleWare = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,response, Authorization, Content-Length, X-Requested-With, shared_key, token , _id , lan , fields"
  );
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  if (!req.headers.lan) {
    req.headers.lan = process.env.defaultLanguage || "fa";
  }
  res.setHeader("Content-Language", "fa");

  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    return res.sendStatus(200);
  } else {
    next();
  }
};

export function commonMiddleware(): (
  | MiddleWare
  | MiddleWareError
  | [string, MiddleWare | MiddleWareError]
)[] {
  const mw: (
    | MiddleWare
    | MiddleWareError
    | [string, MiddleWare | MiddleWareError]
  )[] = [];

  // logger
  mw.push(expressLogger);

  mw.push(bodyParser.json({ limit: "10kb" }));

  mw.push(bodyParser.urlencoded({ extended: false }));

  mw.push(cookieParser());

  if (
    store.env.isLoc ||
    (store.env.STATIC_SERVER && store.env.STATIC_SERVER !== "false")
  ) {
    mw.push(express.static(public_mediaFolder, { maxAge: "1y" }));
    mw.push(["/site_setting", express.static(themeFolder + "/site_setting")]);
    mw.push(["/static", express.static(themeFolder + "/static")]);
    mw.push(["/admin", express.static(adminFolder)]);
  }

  // error
  mw.push(store.errorPackage.general);

  return mw;
}
