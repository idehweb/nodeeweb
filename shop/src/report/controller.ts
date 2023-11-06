import {
  AdminAccess,
  ControllerSchema,
  controllersBatchRegister,
} from '@nodeeweb/core';
import service from './service';
import { ReportBaseQueryParam } from '../../dto/in/report';

export default function registerController() {
  const access = AdminAccess;

  controllersBatchRegister(
    (
      [
        { method: 'get', service: service.getGeneral },
        { method: 'get', service: service.getOrder, url: '/order' },
      ] as ControllerSchema[]
    ).map((s) => ({
      ...s,
      validate: { dto: ReportBaseQueryParam, reqPath: 'query' },
      access,
    })),
    { base_url: '/api/v1/report', from: 'ShopEntity' }
  );
}
