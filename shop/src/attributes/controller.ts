import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from "@nodeeweb/core/src/constants/String";
import { ControllerAccess } from "@nodeeweb/core/types/controller";
import { registerEntityCRUD } from "@nodeeweb/core/src/handlers/entity.handler";

export default function registerController() {
  const access: ControllerAccess = { modelName: "admin", role: PUBLIC_ACCESS };
  registerEntityCRUD(
    "attribute",
    {
      create: {
        controller: { access },
        crud: { executeQuery: true, sendResponse: true },
      },
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
    { base_url: "/amin/attribute", from: "ShopEntity" }
  );
}