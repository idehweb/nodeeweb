import { ArrayMaxSize } from 'class-validator';
import { CrudParamDto } from '../../dto/in/crud.dto';
import { PluginBodyAdd, PluginBodyUpdate } from '../../dto/in/plugin.dto';
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
  // custom
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
        service: localService.install,
        url: '/local/install/:slug',
        access: AdminAccess,
        validate: { dto: CrudParamDto, reqPath: 'params' },
      },
      {
        method: 'post',
        service: localService.config,
        url: '/local/config/:slug',
        access: AdminAccess,
        validate: { dto: CrudParamDto, reqPath: 'params' },
      },
      {
        method: 'put',
        service: localService.editPlugin,
        url: '/local/:slug',
        access: AdminAccess,
        validate: [
          { dto: CrudParamDto, reqPath: 'params' },
          { dto: PluginBodyUpdate, reqPath: 'body' },
        ],
      },
      {
        method: 'delete',
        service: localService.uninstall,
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
    },
    { ...opt, base_url: `${opt.base_url}/local` }
  );
}
