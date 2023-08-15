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
        },
        crud: {
          parseFilter(req) {
            return { user: req.query.user, product: req.query.product };
          },
          autoSetCount: true,
          project:
            '_id user product order page title action createdAt updatedAt',
          populate: [
            {
              path: 'customer',
              select: 'phone firstName lastName _id',
            },
            {
              path: 'product',
              select: 'title _id',
            },
            {
              path: 'user',
              select: 'username _id nickname',
            },
          ],
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
