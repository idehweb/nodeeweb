import { controllerRegister } from "@nodeeweb/core/src/handlers/controller.handler";
import Service from "./service";
import { AuthUserAccess } from "@nodeeweb/core/src/handlers/auth.handler";

export default function registerController() {
  // add Entry
  controllerRegister(
    {
      url: "/entry/:form",
      method: "post",
      access: AuthUserAccess,
      service: Service.addEntry,
    },
    { base_url: "/customer/form", from: "ShopEntity" }
  );
}
