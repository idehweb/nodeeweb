import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  registerEntityCRUD(
    'modification',
    {
      getAll: {
        controller: {
          access,
          service: (req, res) => res.json(req[CRUD_DEFAULT_REQ_KEY]),
        },
        crud: {
          parseFilter(req) {
            return { user: req.query.user, product: req.query.product };
          },
          autoSetCount: true,
          saveToReq: true,
          executeQuery: true,
          project:
            '_id user product order page title action createdAt updatedAt',
          populate: [
            {
              path: 'customer',
              select: 'phoneNumber firstName lastName _id',
            },
            {
              path: 'product',
              select: 'title _id',
            },
            {
              path: 'user',
              select: 'username _id nickname',
            },
            {
              path: '',
              select: '',
            },
          ],
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
    },
    { base_url: '/admin/action', from: 'ShopEntity' }
  );
}
