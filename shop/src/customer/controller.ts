import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';

export default function registerController() {
  const adminAccess: ControllerAccess = {
    modelName: 'admin',
    role: PUBLIC_ACCESS,
  };
  const customerAccess: ControllerAccess = {
    modelName: 'customer',
    role: PUBLIC_ACCESS,
  };

  // get me
  controllerRegister(
    {
      method: 'get',
      service: Service.getMe,
      url: '/getme',
      access: customerAccess,
    },
    { base_url: '/customer/customer', from: 'ShopEntity' }
  );

  // update status
  controllerRegister(
    {
      method: 'put',
      service: Service.updateStatus,
      url: '/status/:id',
      access: adminAccess,
    },
    { base_url: '/admin/customer', from: 'ShopEntity' }
  );

  // admin api : getAll
  registerEntityCRUD(
    'customer',
    {
      getAll: {
        controller: {
          access: adminAccess,
          service: Service.getAll,
        },
        crud: {
          parseFilter: Service.parseFilterForAllCustomer,
          project:
            '_id , firstName , lastName , internationalCode , active , source , email , phoneNumber , activationCode , credit , customerGroup  , createdAt , updatedAt , status',
          autoSetCount: true,
          saveToReq: true,
          executeQuery: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
    },
    { base_url: '/admin/customer', from: 'ShopEntity' }
  );

  // customer api : updateAddress
  registerEntityCRUD(
    'customer',
    {
      updateOne: {
        controller: {
          access: customerAccess,
          url: '/updateAddress',
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
          parseFilter(req) {
            return { _id: req.user._id };
          },
          parseUpdate(req) {
            return { address: req.body.address };
          },
        },
      },
    },
    { base_url: '/customer/customer', from: 'ShopEntity' }
  );
}
