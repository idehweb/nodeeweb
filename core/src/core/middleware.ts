import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MiddleWare, MiddleWareError } from '../../types/global';
import bodyParser from 'body-parser';
import store from '../../store';
import logger, { expressLogger } from '../handlers/log.handler';
import rateLimit from 'express-rate-limit';
import { getPublicDir } from '../../utils/path';
import { getViewHandler } from './view';
import { color } from '../../utils/color';
import { getName } from '../../utils/helpers';
import { join } from 'path';

export function commonMiddleware(): {
  mw: (MiddleWare | MiddleWareError | [string, MiddleWare | MiddleWareError])[];
  fixedHandlers: any[];
} {
  const mw: (
    | MiddleWare
    | MiddleWareError
    | [string, MiddleWare | MiddleWareError]
  )[] = [];
  const fixedHandlers = [];

  // cors
  mw.push(
    cors({
      allowedHeaders:
        'Content-Type,response, Authorization, Content-Length, X-Requested-With, shared_key, token , _id , lan , fields',
      exposedHeaders: ['X-Total-Count'],
    })
  );

  // logger
  mw.push(expressLogger);

  // rate limit
  const { limit } = store.config;
  const limiter = rateLimit({
    windowMs: limit.request_limit_window_s * 1000,
    max: limit.request_limit,
    standardHeaders: true,
    legacyHeaders: false,
  });

  limiter['shadowName'] = 'RateLimiter';
  mw.push(limiter);

  mw.push(bodyParser.json({ limit: '1mb' }));

  mw.push(bodyParser.urlencoded({ extended: false }));

  mw.push(cookieParser());

  // set fixed handlers
  mw.forEach((mw) => fixedHandlers.push(mw));

  if (
    store.env.isLoc ||
    (store.env.STATIC_SERVER && store.env.STATIC_SERVER !== 'false')
  ) {
    const filesFolder = getPublicDir('files', true)[0];
    const adminFolder = getPublicDir('admin', true)[0];
    const frontFolder = getPublicDir('front', true)[0];

    const filesStatic = express.static(filesFolder, { maxAge: '1y' });

    filesStatic['shadowName'] = `Server-Static / => ${filesFolder}`;

    const frontSettingStatic: [string, MiddleWare] = [
      '/site_setting',
      express.static(frontFolder + '/site_setting'),
    ];
    frontSettingStatic['shadowName'] = `Server-Static /site_setting => ${join(
      frontFolder,
      '/site_setting'
    )}`;

    const frontStatic: [string, MiddleWare] = [
      '/static',
      express.static(frontFolder + '/static'),
    ];
    frontStatic['shadowName'] = `Server-Static /static => ${join(
      frontFolder,
      '/static'
    )}`;

    const adminStatic: [string, MiddleWare] = [
      '/admin',
      express.static(adminFolder),
    ];
    adminStatic['shadowName'] = `Server-Static /admin => ${adminFolder}`;

    mw.push(filesStatic, frontSettingStatic, frontStatic, adminStatic);
  }

  // insert error packages
  if (store.globalMiddleware.error) {
    mw.push(store.globalMiddleware.error.notFound);
    mw.push(store.globalMiddleware.error.general);
  }

  return { mw, fixedHandlers };
}

export function registerCommonHandlers() {
  const { mw, fixedHandlers } = commonMiddleware();
  mw.forEach((w) => {
    if (Array.isArray(w)) {
      store.app.use(w[0], w[1]);
    } else {
      store.app.use(w);
    }
    logger.log(color('Cyan', `## CoreMiddleware Register ${getName(w)} ##`));
  });

  // set fixed handlers
  setFixedHandlers(fixedHandlers);
}

function setFixedHandlers(fixedHandlers: any[]) {
  const expressFixed = (store.app._router.stack.slice(0, 2) as any[]).map(
    (l) => l.handle
  );
  [...expressFixed, ...fixedHandlers].forEach((handle) =>
    store.fixedHandlers.push(handle)
  );
}
