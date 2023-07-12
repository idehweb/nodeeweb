import { ControllerSchema } from "../../types/controller";
import { controllerRegister } from "../handlers/controller.handler";
import { getAuth, getTheme } from "../temp/routers";
export function registerDefaultControllers() {
  const controllerStack: ControllerSchema[] = [];

  // theme
  controllerStack.push({
    method: "get",
    url: "/theme",
    service: getTheme.bind(null, "admin"),
  });

  // auth
  controllerStack.push({
    method: "post",
    url: "/admin/admin/login",
    service: getAuth,
  });

  //   register
  controllerStack.map((schema) => controllerRegister(schema));
}
