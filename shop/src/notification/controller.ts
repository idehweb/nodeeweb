import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from "@nodeeweb/core/src/constants/String";
import {
  ControllerAccess,
  ControllerSchema,
} from "@nodeeweb/core/types/controller";
import { registerEntityCRUD } from "@nodeeweb/core/src/handlers/entity.handler";
import { controllerRegister } from "@nodeeweb/core/src/handlers/controller.handler";
import { uploadSingle } from "@nodeeweb/core/src/handlers/upload.handler";
import Service from "./service";

export default function registerController() {
  const access: ControllerAccess = { modelName: "admin", role: PUBLIC_ACCESS };

  // create
  const controllerSchemas: ControllerSchema[] = [
    {
      url: "/",
      method: "post",
      service: Service.create,
      access,
    },
    {
      url: "/:_id",
      method: "put",
      service: Service.create,
      access,
    },
  ];

  controllerSchemas.forEach((schema) =>
    controllerRegister(schema, {
      base_url: "/admin/notification",
      from: "ShopEntity",
    })
  );
}
