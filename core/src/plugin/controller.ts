import { ArrayMaxSize } from 'class-validator';
import { CrudParamDto } from '../../dto/in/crud.dto';
import { PluginBodyAdd } from '../../dto/in/plugin.dto';
import { AdminAccess } from '../handlers/auth.handler';
import {
  ControllerRegisterOptions,
  controllerRegister,
  controllersBatchRegister,
} from '../handlers/controller.handler';
import { registerEntityCRUD } from '../handlers/entity.handler';
import logger from '../handlers/log.handler';
import marketService from './market.service';
import localService from './local.service';

export function registerPluginControllers() {
  const opt: ControllerRegisterOptions = {
    base_url: '/api/v1/plugin',
    from: 'CorePlugin',
    logger,
  };
  // market
  controllersBatchRegister(
    [
      {
        method: 'get',
        service: marketService.getAll,
        url: '/market',
        access: AdminAccess,
      },
      {
        method: 'get',
        service: marketService.getOne,
        url: '/market/:slug',
        access: AdminAccess,
        validate: { dto: CrudParamDto, reqPath: 'params' },
      },
      {
        method: 'post',
        service: localService.addPlugin,
        url: '/local/:slug',
        access: AdminAccess,
        validate: { dto: CrudParamDto, reqPath: 'params' },
      },
    ],
    opt
  );

  //   plugin crud
  registerEntityCRUD(
    'plugin',
    {
      // add plugin
      // create: {
      //   controller: {
      //     url: '/:id',
      //     access: AdminAccess,
      //     validate: [
      //       { dto: CrudParamDto, reqPath: 'params' },
      //       { reqPath: 'body', dto: PluginBodyAdd },
      //     ],
      //     beforeService: pluginService.beforeAdd,
      //     service: pluginService.afterAdd,
      //   },
      //   crud: {
      //     saveToReq: true,
      //   },
      // },

      //   edit plugin
      // updateOne: {
      //   controller: {
      //     access: AdminAccess,
      //     validate: [
      //       { dto: CrudParamDto, reqPath: 'params' },
      //       { reqPath: 'body', dto: PluginBodyAdd },
      //     ],
      //     beforeService: pluginService.beforeEdit,
      //     service: pluginService.afterEdit,
      //   },
      //   crud: {
      //     saveToReq: true,
      //   },
      // },

      //   get all
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          project: localService.getAllProjection(),
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },

      // get one
      getOne: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          project: localService.getOneProjection(),
          parseFilter: localService.getOneFilter,
          sendResponse: localService.getOneTransform,
          paramFields: {
            id: 'slug',
          },
        },
      },

      //   delete
      // deleteOne: {
      //   controller: {
      //     access: AdminAccess,
      //     service: pluginService.afterDelete,
      //   },
      //   crud: {
      //     saveToReq: true,
      //   },
      // },
    },
    { ...opt, base_url: `${opt.base_url}/local` }
  );
}
