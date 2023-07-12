import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from "@nodeeweb/core/src/constants/String";
import {
  ControllerAccess,
  ControllerSchema,
} from "@nodeeweb/core/types/controller";
import { registerEntityCRUD } from "@nodeeweb/core/src/handlers/entity.handler";
import Service from "./service";
import { AuthUserAccess } from "@nodeeweb/core/src/handlers/auth.handler";
import { controllerRegister } from "@nodeeweb/core/src/handlers/controller.handler";

export default function registerController() {
  const access: ControllerAccess = { modelName: "admin", role: PUBLIC_ACCESS };

  // api
  const controllerSchemas: ControllerSchema[] = [
    {
      url: "/createByCustomer",
      method: "post",
      access: AuthUserAccess,
      service: Service.createByCustomer,
    },
    {
      url: "/importFromWordpress",
      method: "post",
      access: AuthUserAccess,
      service: Service.importFromWordpress,
    },
    {
      url: "/rewriteOrders",
      method: "post",
      access: AuthUserAccess,
      service: Service.rewriteOrders,
    },
    {
      url: "/cart",
      method: "post",
      access: AuthUserAccess,
      service: Service.createCart,
    },
    {
      url: "/createPaymentLink",
      method: "post",
      access,
      service: Service.createPaymentLink,
    },
    {
      url: "/cart/:id",
      method: "post",
      access: AuthUserAccess,
      service: Service.createCart,
    },
    {
      url: "/myOrders/onlyMine/:id",
      method: "get",
      access: AuthUserAccess,
      service: Service.myOrder,
    },
    {
      url: "/myOrders/mine/:offset/:limit",
      method: "get",
      access: AuthUserAccess,
      service: Service.allWOrders,
    },
  ];

  controllerSchemas.forEach((schema) =>
    controllerRegister(schema, {
      base_url: ["/admin", "/customer"],
      from: "ShopEntity",
    })
  );

  // create
  controllerRegister(
    {
      method: "post",
      url: "/",
      service: Service.createAdmin,
      access,
    },
    { base_url: "/admin/order", from: "ShopEntity" }
  );

  // crud
  registerEntityCRUD(
    "order",
    {
      getCount: {
        controller: {
          access,
          service: (req, res) => {
            res.json({
              success: true,
              count: req[CRUD_DEFAULT_REQ_KEY],
            });
          },
        },
        crud: { executeQuery: true, sendResponse: false, saveToReq: true },
      },
      getOne: {
        controller: {
          access,
          service(req, res) {
            res.json(req[CRUD_DEFAULT_REQ_KEY]);
          },
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      getAll: {
        controller: {
          access,
          service: (req, res) => res.json(req[CRUD_DEFAULT_REQ_KEY]),
        },
        crud: {
          parseFilter(req) {
            if (req.query.filter && typeof req.query.filter === "string") {
              return JSON.parse(req.query.filter);
            }
          },
          autoSetCount: true,
          saveToReq: true,
          executeQuery: true,
          paramFields: {
            limit: "limit",
            offset: "offset",
          },
        },
      },
      updateOne: {
        controller: {
          access,
          service(req, res) {
            res.json(req[CRUD_DEFAULT_REQ_KEY]);
          },
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      deleteOne: {
        controller: {
          access,
          service(req, res) {
            return res.status(204).json({
              success: true,
              message: "Deleted!",
            });
          },
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          forceDelete: true,
        },
      },
    },
    { base_url: "/amin/order", from: "ShopEntity" }
  );
}
