import _ from "lodash";
import store from "../../store";
import { ControllerAccess, ControllerSchema } from "../../types/controller";
import { MiddleWare } from "../../types/global";
import { authenticate, authorizeWithToken } from "./auth.handler";

export type ControllerRegisterOptions = {
  base_url?: string;
};
export function controllerRegister(
  schema: ControllerSchema,
  { base_url }: ControllerRegisterOptions = {}
) {
  const mw: MiddleWare[] = [];

  if (!Array.isArray(schema.service)) schema.service = [schema.service];
  if (schema.access && !Array.isArray(schema.access))
    schema.access = [schema.access];

  if (schema.access) {
    mw.push(...translateAccess(schema.access as []));
  }
  store.app[schema.method](`${base_url ? base_url : ""}${schema.url}`, ...mw);
}

function translateAccess(accesses: ControllerAccess[]): MiddleWare[] {
  return [
    ...authorizeWithToken(_.uniq(accesses.map((a) => a.modelName))),
    authenticate(...accesses),
  ];
}
