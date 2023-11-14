import {
  CRUD,
  CRUDCreatorOpt,
  EntityCreator,
  MiddleWare,
  Req,
} from '@nodeeweb/core';
import store from '../../store';

class Service {
  update: MiddleWare = async (req, res, next) => {};
  pre = async (opt: CRUDCreatorOpt, req: Req) => {
    switch (opt.type) {
      case CRUD.CREATE:
        return;
      case CRUD.UPDATE_ONE:
      case CRUD.DELETE_ONE:
        const target_before = await store.db
          .model(opt.model)
          .findOne(new EntityCreator(opt.model).parseFilterQuery(opt, req));
        req.target_before = target_before;
        return;
    }
  };
  post = async (data: any, opt: CRUDCreatorOpt, req: Req) => {};
}

export default new Service();
