import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from "@nodeeweb/core/src/constants/String";
import { ControllerAccess } from "@nodeeweb/core/types/controller";
import { registerEntityCRUD } from "@nodeeweb/core/src/handlers/entity.handler";
import { controllerRegister } from "@nodeeweb/core/src/handlers/controller.handler";
import { uploadSingle } from "@nodeeweb/core/src/handlers/upload.handler";
import Service from "./service";

export default function registerController() {
  const access: ControllerAccess = { modelName: "admin", role: PUBLIC_ACCESS };

  //  crud
  registerEntityCRUD(
    "entry",
    {
      getAll: {
        controller: {
          access,
          service(req, res) {
            return res.json(req[CRUD_DEFAULT_REQ_KEY]);
          },
        },
        crud: {
          autoSetCount: true,
          executeQuery: true,
          populate: { path: "form", select: "_id slug title" },
          saveToReq: true,
          parseFilter: Service.getAllQuery,
          project: "updatedAt trackingCode createdAt _id form",
          paramFields: {
            limit: "limit",
            offset: "offset",
          },
        },
      },
    },
    { base_url: "/admin/entry", from: "ShopEntity" }
  );
}
