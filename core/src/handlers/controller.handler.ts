import _ from "lodash";
import store from "../../store";
import { ControllerAccess, ControllerSchema } from "../../types/controller";
import { MiddleWare } from "../../types/global";
import { authenticate, authorizeWithToken } from "./auth.handler";
import logger from "./log.handler";
import { join } from "path";
import { color } from "../../utils/color";

export function getUrlFromBaseUrl(url: string, base_url?: string) {
  return join(base_url ?? "", url).replace(/\\/g, "/");
}

export type ControllerRegisterOptions = {
  base_url?: string;
};
export function controllerRegister(
  schema: ControllerSchema,
  { base_url }: ControllerRegisterOptions = {}
) {
  const url = getUrlFromBaseUrl(schema.url, base_url);
  const mw: MiddleWare[] = [];

  if (schema.access && !Array.isArray(schema.access))
    schema.access = [schema.access];

  if (schema.access) {
    mw.push(...translateAccess(schema.access as []));
  }

  if (!Array.isArray(schema.service)) schema.service = [schema.service];
  mw.push(...schema.service);

  store.app[schema.method.toLowerCase()](url, ...mw);
  logger.log(color("Blue", `## ${schema.method.toUpperCase()} ${url} ##`));
}

function translateAccess(accesses: ControllerAccess[]): MiddleWare[] {
  return [
    ...authorizeWithToken(_.uniq(accesses.map((a) => a.modelName))),
    authenticate(...accesses),
  ];
}
