import _ from 'lodash';
import store from '../../store';
import { ControllerAccess, ControllerSchema } from '../../types/controller';
import { MiddleWare, MiddleWareError } from '../../types/global';
import {
  JwtStrategyOpt,
  authenticate,
  authorizeWithToken,
} from './auth.handler';
import { Logger } from './log.handler';
import { join } from 'path';
import { color } from '../../utils/color';
import { RegisterOptions } from '../../types/register';
import { OPTIONAL_LOGIN } from '../constants/String';
import { catchMiddleware } from '../../utils/catchAsync';
import { validateCreator } from '../core/validate';

export function getUrlFromBaseUrl(url?: string, base_url?: string) {
  return join(base_url ?? '', url ?? '').replace(/\\/g, '/');
}

function clearMatchHandler(urls: string[], method: string) {
  store.app._router.stack = ((store.app._router.stack ?? []) as any[]).reduce(
    (prev, layer) => {
      // diff path or diff method
      if (
        !urls.includes(layer.route?.path) ||
        !layer.route?.methods?.[method]
      ) {
        prev.push(layer);
        return prev;
      }

      // single method
      if (Object.values(layer.route?.methods).filter((v) => v).length == 1) {
        return prev;
      }
      // multi methods
      else {
        layer.route.methods[method] = false;
        prev.push(layer);
      }
    },
    []
  );
}

function insertFirst(url: string, method: string, ...mws: MiddleWare[]) {
  // add flag
  mws.forEach((mw) => (mw['hot-flag'] = true));

  // insert
  store.app[method](url, ...mws);
  // hot handler
  hotHandler((layer) => {
    // diff path or diff method
    if (url !== layer.route?.path || !layer.route?.methods?.[method]) {
      return false;
    }

    // hot flag
    if ((layer.route.stack ?? []).some(({ handle }) => handle['hot-flag'])) {
      layer.route.stack?.forEach(({ handle: h }) => (h['hot-flag'] = false));
      return true;
    }
    return false;
  });
}

function hotHandler(cond: (layer: any) => boolean) {
  const floatLayers: any[] = [];

  // fixed layers
  store.app._router.stack = (store.app._router.stack as any[]).filter(
    (layer) => {
      // always fixed handlers
      if (layer.handle && store.fixedHandlers.includes(layer.handle)) {
        return true;
      }

      // must float
      if (!cond(layer)) {
        floatLayers.push(layer);
        return false;
      }

      return true;
    }
  );

  // push layers
  store.app._router.stack.push(...floatLayers);
}

function heavyErrorHandlers() {
  hotHandler(
    (layer) =>
      !Object.values(store.globalMiddleware.error).includes(layer.handle)
  );
}

export type ControllerRegisterOptions = {
  base_url?: string | string[];
  strategy?: 'replace' | 'insertAfter' | 'insertFirst';
} & RegisterOptions;
export function controllerRegister(
  schema: ControllerSchema,
  {
    base_url,
    strategy = 'replace',
    from,
    logger = store.systemLogger,
  }: ControllerRegisterOptions = {}
) {
  if (!Array.isArray(base_url)) base_url = [base_url ?? ''];
  const urls = base_url.map((url) => getUrlFromBaseUrl(schema.url, url));
  let mw: MiddleWare[] = [];

  if (schema.access && !Array.isArray(schema.access))
    schema.access = [schema.access];

  if (schema.access) {
    mw.push(...translateAccess(schema.access as []));
  }

  // validate
  if (schema.validate) {
    mw.push(validateCreator(schema.validate));
  }

  if (!Array.isArray(schema.service)) schema.service = [schema.service];
  mw.push(...schema.service);

  // catch mw
  mw = mw.map((m) => catchMiddleware(m));

  const method = schema.method.toLowerCase();

  // clear match handler if want to replace
  if (strategy === 'replace') clearMatchHandler(urls, method);

  // push
  for (const url of urls) {
    if (strategy === 'insertFirst') insertFirst(url, method, ...mw);
    else store.app[method](url, ...mw);

    logger.log(
      color(
        'Blue',
        `## ${from ? `${from} ` : ''}${method.toUpperCase()} ${url} ##`
      )
    );
  }

  // heavy error handlers
  heavyErrorHandlers();
}

export function controllersBatchRegister(
  schemas: ControllerSchema[],
  opt: ControllerRegisterOptions
) {
  schemas.forEach((schema) => controllerRegister(schema, opt));
}

function translateAccess(accesses: ControllerAccess[]): MiddleWare[] {
  const opt: Partial<JwtStrategyOpt> = {};

  if (accesses.find(({ role }) => role === OPTIONAL_LOGIN)) {
    opt.notThrow = true;
  }

  return [
    ...authorizeWithToken(_.uniq(accesses.map((a) => a.modelName)), opt),
    authenticate(...accesses),
  ];
}
