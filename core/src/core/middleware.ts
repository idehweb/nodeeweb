import express from 'express';
import cookieParser from 'cookie-parser';
import { MiddleWare, MiddleWareError } from '../../types/global';
import bodyParser from 'body-parser';
import store from '../../store';
import { expressLogger } from '../handlers/log.handler';
import rateLimit from 'express-rate-limit';
import { getPublicDir } from '../../utils/path';

export const headerMiddleware: MiddleWare = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,response, Authorization, Content-Length, X-Requested-With, shared_key, token , _id , lan , fields'
  );
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
  if (!req.headers.lan) {
    req.headers.lan = process.env.defaultLanguage || 'fa';
  }
  res.setHeader('Content-Language', 'fa');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
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

  // rate limit
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  mw.push(limiter);

  mw.push(bodyParser.json({ limit: '10kb' }));

  mw.push(bodyParser.urlencoded({ extended: false }));

  mw.push(cookieParser());

  if (
    store.env.isLoc ||
    (store.env.STATIC_SERVER && store.env.STATIC_SERVER !== 'false')
  ) {
    const filesFolder = getPublicDir('files', true)[0];
    const adminFolder = getPublicDir('admin', true)[0];
    const themeFolder = getPublicDir('theme', true)[0];

    mw.push(express.static(filesFolder, { maxAge: '1y' }));
    mw.push(['/site_setting', express.static(themeFolder + '/site_setting')]);
    mw.push(['/static', express.static(themeFolder + '/static')]);
    mw.push(['/admin', express.static(adminFolder)]);
  }

  // insert error packages
  if (store.globalMiddleware.error) {
    mw.push(store.globalMiddleware.error.notFound);
    mw.push(store.globalMiddleware.error.general);
  }

  return mw;
}
