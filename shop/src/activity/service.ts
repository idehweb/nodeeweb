import {
  BadRequestError,
  CRUD,
  CRUDCreatorOpt,
  EntityCreator,
  MiddleWare,
  NotFound,
  Req,
} from '@nodeeweb/core';
import store from '../../store';
import {
  ActivityDocument,
  ActivityModel,
  ActivityStatus,
  ActivityType,
  IActivity,
} from '../../schema/activity.schema';
import { convertUser, crudType2ActivityType } from './utils';
import { ActivityUpdateBody } from '../../dto/in/activity';
import mongoose from 'mongoose';

class Service {
  get activityModel(): ActivityModel {
    return store.db.model('activity');
  }

  private async canUndo(activity: ActivityDocument) {
    // same status
    if (activity.status === ActivityStatus.Undo)
      return { can: false, message: 'new status must be deferent' };

    // not depend to any things
    if (!activity.depend_on) return { can: true };

    // list of forward do acts
    const listOfForwardDos = await this.activityModel
      .find({
        _id: { $ne: activity._id },
        depend_on: activity.depend_on,
        status: ActivityStatus.Do,
        createdAt: { $gte: activity.createdAt },
      })
      .sort({ createdAt: -1 });

    if (!listOfForwardDos.length) return { can: true };
    return {
      can: false,
      message: `please undo ${listOfForwardDos
        .slice(0, 10)
        .map((a) => a._id.toString())
        .join(',')} first`,
    };
  }

  private async canDo(activity: ActivityDocument) {
    // same status
    if (activity.status === ActivityStatus.Do)
      return { can: false, message: 'new status must be deferent' };

    // not depend to any things
    if (!activity.depend_on) return { can: true };

    // list of backward undo acts
    const listOfBackwardDos = await this.activityModel
      .find({
        _id: { $ne: activity._id },
        depend_on: activity.depend_on,
        status: ActivityStatus.Undo,
        createdAt: { $lte: activity.createdAt },
      })
      .sort({ createdAt: 1 });

    if (!listOfBackwardDos.length) return { can: true };
    return {
      can: false,
      message: `please do ${listOfBackwardDos
        .slice(0, 10)
        .map((a) => a._id.toString())
        .join(',')} first`,
    };
  }

  private async undoCreate(activity: ActivityDocument) {
    const model = store.db.model(activity.target.model);
    await model.deleteOne({ _id: activity.target.after._id });
    return;
  }
  private async doCreate(activity: ActivityDocument) {
    const model = store.db.model(activity.target.model);
    await model.create(activity.target.after);
    return;
  }

  private async undoUpdate(activity: ActivityDocument) {
    const model = store.db.model(activity.target.model);
    await model.updateOne(
      { _id: activity.target.after._id },
      activity.target.before ?? {}
    );
    return;
  }
  private async doUpdate(activity: ActivityDocument) {
    const model = store.db.model(activity.target.model);
    await model.updateOne(
      { _id: activity.target.after._id },
      activity.target.after
    );
    return;
  }

  private async undoDelete(activity: ActivityDocument) {
    const model = store.db.model(activity.target.model);

    // update
    if (activity.target.after) await this.undoUpdate(activity);
    // delete
    else if (activity.target.before) await model.create(activity.target.before);

    return;
  }
  private async doDelete(activity: ActivityDocument) {
    const model = store.db.model(activity.target.model);

    // update
    if (activity.target.after) await this.doUpdate(activity);
    // delete
    else if (activity.target.before)
      await model.deleteOne({ _id: activity.target.before._id });

    return;
  }

  update: MiddleWare = async (req, res, next) => {
    const body: ActivityUpdateBody = req.body;

    // find
    const activity = await this.activityModel.findById(req.params.id);
    if (!activity) throw new NotFound('not found activity');
    const isDo = body.status === ActivityStatus.Do;

    // can
    const { can, message } = isDo
      ? await this.canDo(activity)
      : await this.canUndo(activity);
    if (!can) throw new BadRequestError(message);

    // action
    switch (activity.type) {
      case ActivityType.Create:
        isDo ? await this.doCreate(activity) : await this.undoCreate(activity);
        break;
      case ActivityType.Update:
        isDo ? await this.doUpdate(activity) : await this.undoUpdate(activity);

        break;
      case ActivityType.Delete:
        isDo ? await this.doDelete(activity) : await this.undoDelete(activity);
        break;
    }

    // save
    // undoer or doer
    const update: mongoose.UpdateQuery<ActivityDocument> = {};
    const key = isDo ? 'doers' : 'undoers';
    update.$push = { [key]: convertUser(req.user) };

    // status
    update.status = body.status;
    const newActivity = await this.activityModel.findOneAndUpdate(
      { _id: activity._id },
      update,
      { new: true }
    );

    // present
    return res.status(200).json({ data: newActivity });
  };
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
      doers: [convertUser(req.user)],
      status: ActivityStatus.Do,
      depend_on,
      type: crudType2ActivityType(opt.type),
      target: {
        model: opt.model,
        after: data,
        before: req.target_before,
      },
      query: {},
    };

    if (opt.type === CRUD.DELETE_ONE && opt.forceDelete)
      delete activity.target.after;

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
