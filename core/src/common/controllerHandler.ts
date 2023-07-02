import store from "../../store";
import { ControllerAccess, ControllerSchema } from "../../types/controller";
import { MiddleWare } from "../../types/global";
import { authenticate, authorize } from "../auth/auth";

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
    for (const [index, access] of (
      schema.access as ControllerAccess[]
    ).entries()) {
      mw.push(...translateAccess(access, index === 0));
    }
  }
  store.app[schema.method](`${base_url ? base_url : ""}${schema.url}`, ...mw);
}

function translateAccess(
  access: ControllerAccess,
  withAuth = true
): MiddleWare[] {
  return [
    withAuth ? authorize(access.modelName) : null,
    authenticate(access),
  ].filter((m) => m);
}
