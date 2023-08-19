import { ArrayMaxSize } from 'class-validator';
import { CrudParamDto } from '../../dto/in/crud.dto';
import { PluginBodyAdd } from '../../dto/in/plugin.dto';
import { AdminAccess } from '../handlers/auth.handler';
import {
  ControllerRegisterOptions,
  controllerRegister,
} from '../handlers/controller.handler';
import { registerEntityCRUD } from '../handlers/entity.handler';
import logger from '../handlers/log.handler';
import pluginService from './service';

export function registerPluginControllers() {
  const opt: ControllerRegisterOptions = {
    base_url: '/api/v1/plugin',
    from: 'CorePlugin',
    logger,
  };
  // market
  controllerRegister(
    {
      method: 'get',
      service: pluginService.getAllMarket,
      url: '/market',
      access: AdminAccess,
    },
    opt
  );

  //   plugin crud
  registerEntityCRUD(
    'plugin',
    {
      // add plugin
      create: {
        controller: {
          url: '/:id',
          access: AdminAccess,
          validate: [
            { dto: CrudParamDto, reqPath: 'params' },
            { reqPath: 'body', dto: PluginBodyAdd },
          ],
          beforeService: pluginService.beforeAdd,
          service: pluginService.afterAdd,
        },
        crud: {
          saveToReq: true,
        },
      },

      //   edit plugin
      updateOne: {
        controller: {
          access: AdminAccess,
          validate: [
            { dto: CrudParamDto, reqPath: 'params' },
            { reqPath: 'body', dto: PluginBodyAdd },
          ],
          beforeService: pluginService.beforeEdit,
          service: pluginService.afterEdit,
        },
        crud: {
          saveToReq: true,
        },
      },

      //   get all
      getAll: {
        controller: {
          access: AdminAccess,
          service: pluginService.afterGetAll,
        },
        crud: {
          saveToReq: true,
        },
      },

      // get one
      getOne: {
        controller: {
          access: AdminAccess,
          service: pluginService.afterGetOne,
        },
        crud: {
          saveToReq: true,
        },
      },

      //   delete
      deleteOne: {
        controller: {
          access: AdminAccess,
          service: pluginService.afterDelete,
        },
        crud: {
          saveToReq: true,
        },
      },
    },
    opt
  );
}
