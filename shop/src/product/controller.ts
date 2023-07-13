import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from "@nodeeweb/core/src/constants/String";
import { ControllerAccess } from "@nodeeweb/core/types/controller";
import { registerEntityCRUD } from "@nodeeweb/core/src/handlers/entity.handler";
import { controllersBatchRegister } from "@nodeeweb/core/src/handlers/controller.handler";
import Service from "./service";
import { AuthUserAccess } from "@nodeeweb/core/src/handlers/auth.handler";

export default function registerController() {
  const access: ControllerAccess = { modelName: "admin", role: PUBLIC_ACCESS };

  // custom admin controllers
  controllersBatchRegister(
    [
      {
        url: "/rewriteProducts",
        method: "post",
        access,
        service: Service.rewriteProducts,
      },
      {
        url: "/rewriteProductsImages",
        method: "post",
        access,
        service: Service.rewriteProductsImages,
      },
    ],
    {
      base_url: "/admin/product",
      from: "ShopEntity",
    }
  );

  // custom simple controllers
  controllersBatchRegister(
    [
      {
        url: "/torob/:offset/:limit",
        method: "get",
        service: Service.torob,
      },
      {
        url: "/?:offset/?:limit",
        method: "get",
        service: Service.getAll,
      },
    ],
    { base_url: "/product", from: "ShopEntity" }
  );

  // customer crud
  registerEntityCRUD(
    "product",
    {
      getOne: {
        controller: {
          access: AuthUserAccess,
          service: Service.getOneAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          parseFilter: Service.getOneFilterParser,
        },
      },
    },
    { base_url: "/customer/product", from: "ShopEntity" }
  );

  // admin crud
  registerEntityCRUD(
    "product",
    {
      create: {
        controller: {
          access,
          service: Service.createAfter,
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
          parseBody: Service.createBodyParser,
        },
      },
      updateOne: {
        controller: {
          access,
          service: Service.updateAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          parseUpdate: Service.updateBodyParser,
        },
      },
      deleteOne: {
        controller: {
          access,
          service: Service.deleteAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          update: { status: "trash" },
        },
      },
    },
    { base_url: "/admin/product", from: "ShopEntity" }
  );
}
