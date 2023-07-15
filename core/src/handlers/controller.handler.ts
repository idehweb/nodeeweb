import _ from 'lodash';
import store from '../../store';
import { ControllerAccess, ControllerSchema } from '../../types/controller';
import { MiddleWare } from '../../types/global';
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

export function getUrlFromBaseUrl(url: string, base_url?: string) {
  return join(base_url ?? '', url).replace(/\\/g, '/');
}

export type ControllerRegisterOptions = {
  base_url?: string | string[];
} & RegisterOptions;
export function controllerRegister(
  schema: ControllerSchema,
  {
    base_url,
    from,
    logger = store.systemLogger,
  }: ControllerRegisterOptions = {}
) {
  if (!Array.isArray(base_url)) base_url = [base_url ?? ''];
  const urls = base_url.map((url) => getUrlFromBaseUrl(schema.url, url));
  const mw: MiddleWare[] = [];

  if (schema.access && !Array.isArray(schema.access))
    schema.access = [schema.access];

  if (schema.access) {
    mw.push(...translateAccess(schema.access as []));
  }

  if (!Array.isArray(schema.service)) schema.service = [schema.service];
  mw.push(...schema.service);

  const method = schema.method.toLowerCase();
  // clear stack
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

  for (const url of urls) {
    store.app[schema.method.toLowerCase()](url, ...mw);
    logger.log(
      color(
        'Blue',
        `## ${from ? `${from} ` : ''}${schema.method.toUpperCase()} ${url} ##`
      )
    );
  }
}

export function controllersBatchRegister(
  schemas: ControllerSchema[],
  opt: ControllerRegisterOptions
) {
  schemas.forEach((schema) => controllerRegister(schema, opt));
}

function translateAccess(accesses: ControllerAccess[]): MiddleWare[] {
  const opt: Partial<JwtStrategyOpt> = {};

  if (accesses.find(({ role }) => role === OPTIONAL_LOGIN)) opt.notThrow = true;

  return [
    ...authorizeWithToken(_.uniq(accesses.map((a) => a.modelName)), opt),
    authenticate(...accesses),
  ];
}
