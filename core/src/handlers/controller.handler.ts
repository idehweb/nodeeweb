import _ from "lodash";
import store from "../../store";
import { ControllerAccess, ControllerSchema } from "../../types/controller";
import { MiddleWare } from "../../types/global";
import { authenticate, authorizeWithToken } from "./auth.handler";
import { Logger } from "./log.handler";
import { join } from "path";
import { color } from "../../utils/color";
import { RegisterOptions } from "../../types/register";

export function getUrlFromBaseUrl(url: string, base_url?: string) {
  return join(base_url ?? "", url).replace(/\\/g, "/");
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
  if (!Array.isArray(base_url)) base_url = [base_url ?? ""];
  const urls = base_url.map((url) => getUrlFromBaseUrl(schema.url, url));
  const mw: MiddleWare[] = [];

  if (schema.access && !Array.isArray(schema.access))
    schema.access = [schema.access];

  if (schema.access) {
    mw.push(...translateAccess(schema.access as []));
  }

  if (!Array.isArray(schema.service)) schema.service = [schema.service];
  mw.push(...schema.service);

  for (const url of urls) {
    store.app[schema.method.toLowerCase()](url, ...mw);
    logger.log(
      color(
        "Blue",
        `## ${from ? `${from} ` : ""}${schema.method.toUpperCase()} ${url} ##`
      )
    );
  }
}

function translateAccess(accesses: ControllerAccess[]): MiddleWare[] {
  return [
    ...authorizeWithToken(_.uniq(accesses.map((a) => a.modelName))),
    authenticate(...accesses),
  ];
}
