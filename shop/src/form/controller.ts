import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';
import {
  AdminAccess,
  AuthUserAccess,
} from '@nodeeweb/core/src/handlers/auth.handler';
import { registerEntityCRUD } from '@nodeeweb/core';

export default function registerController() {
  // crud
  registerEntityCRUD(
    'form',
    {
      getOne: {
        controller: {
          access: AdminAccess,
          service: (req, res) => {
            res.json(req.crud);
          },
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      getAll: {
        controller: {
          access: AdminAccess,
          service: (req, res) => {
            res.json(req.crud);
          },
        },
        crud: {
          autoSetCount: true,
          executeQuery: true,
          saveToReq: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getCount: {
        controller: {
          access: AdminAccess,
          service: (req, res) => {
            res.json(req.crud);
          },
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      create: {
        controller: {
          access: AdminAccess,
          service: (req, res) => {
            res.json(req.crud);
          },
        },
        crud: {
          saveToReq: true,
          executeQuery: true,
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          service: (req, res) => {
            res.json(req.crud);
          },
        },
        crud: {
          saveToReq: true,
          executeQuery: true,
        },
      },
    },
    { base_url: '/admin/form', from: 'ShopEntity' }
  );
}
