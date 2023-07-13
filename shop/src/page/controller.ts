import {
  OPTIONAL_LOGIN,
  PUBLIC_ACCESS,
} from "@nodeeweb/core/src/constants/String";
import { ControllerAccess } from "@nodeeweb/core/types/controller";
import { registerEntityCRUD } from "@nodeeweb/core/src/handlers/entity.handler";
import Service from "./service";

export default function registerController() {
  const access: ControllerAccess = { modelName: "admin", role: PUBLIC_ACCESS };

  // create , update
  registerEntityCRUD(
    "page",
    {
      create: {
        controller: {
          access,
          service: Service.createAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
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
        },
      },
    },
    { base_url: "/amin/page", from: "ShopEntity" }
  );

  // get one
  registerEntityCRUD(
    "page",
    {
      getOne: {
        controller: {
          access: [
            {
              role: OPTIONAL_LOGIN,
              modelName: "customer",
            },
            {
              role: OPTIONAL_LOGIN,
              modelName: "admin",
            },
          ],
          service: Service.getOneAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          parseFilter: Service.getOneFilterParser,
        },
      },
    },
    { base_url: "/customer/page", from: "ShopEntity" }
  );
}
