import {
  CRUD,
  CRUDCreatorOpt,
  EntityCreator,
  MiddleWare,
  Req,
} from '@nodeeweb/core';
import store from '../../store';
import {
  ActivityModel,
  ActivityStatus,
  ActivityType,
  IActivity,
} from '../../schema/activity.schema';
import { crudType2ActivityType } from './utils';

class Service {
  get activityModel(): ActivityModel {
    return store.db.model('activity');
  }
  update: MiddleWare = async (req, res, next) => {};
  pre = async (opt: CRUDCreatorOpt, req: Req) => {
    switch (opt.type) {
      case CRUD.CREATE:
        return;
      case CRUD.UPDATE_ONE:
      case CRUD.DELETE_ONE:
        const target_before = await store.db
          .model(opt.model)
          .findOne(
            await new EntityCreator(opt.model).parseFilterQuery(opt, req)
          );
        req.target_before = target_before;
        return;
    }
  };
  post = async (data: any, opt: CRUDCreatorOpt, req: Req) => {
    const depend_on = req.target_before?._id ?? data?._id;
    const entity = new EntityCreator(opt.model);
    const activity: Partial<IActivity> = {
      doer: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      model: opt.model,
      status: ActivityStatus.Do,
      depend_on,
      type: crudType2ActivityType(opt.type),
      target: {
        after: data,
        before: req.target_before,
      },
      query: {},
    };

    switch (opt.type) {
      case CRUD.CREATE:
        activity.query.create = await entity.parseCreateQuery(opt, req);
        break;
      case CRUD.UPDATE_ONE:
      case CRUD.DELETE_ONE:
        activity.query.filter = await entity.parseFilterQuery(opt, req);
        activity.query.update = await entity.parseUpdateQuery(opt, req);
        break;
    }

    await this.activityModel.create(activity);
  };
}

export default new Service();
