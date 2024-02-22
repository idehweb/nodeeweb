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
  ActivityFrom,
  ActivityModel,
  ActivityStatus,
  ActivityType,
  IActivity,
} from '../../schema/activity.schema';
import {
  convertUser,
  crudType2ActivityType,
  getActivityEventName,
} from './utils';
import { ActivityBody } from '../../dto/in/activity';
import mongoose, { Types } from 'mongoose';
import { normalizeColName } from '@nodeeweb/core/utils/helpers';
import { UserDocument } from '@nodeeweb/core/types/user';

type DoResponse = { targetAfter?: any; query: IActivity['query'] };
type FilterAction = {
  status: ActivityStatus;
  ref: Types.ObjectId;
  _id: Types.ObjectId;
};

class Service {
  forbiddenModels = ['order', 'transaction', 'file'];
  get activityModel(): ActivityModel {
    return store.db.model('activity');
  }

  private async getHistory({
    createdAt,
    depend,
  }: {
    depend: any;
    createdAt: Date;
  }) {
    const actions = await this.activityModel
      .find(
        {
          depend_on: depend,
          createdAt: { $gte: createdAt },
        },
        { status: 1, ref: 1 }
      )
      .sort({ createdAt: -1 })
      .lean();

    // reduce
    const table: { [k: string]: FilterAction } = {};
    for (const action of actions) {
      const refId = action.ref?.toString();
      const myId = action._id.toString();

      // has ref
      if (refId) {
        // has original before
        if (table[refId]) {
          delete table[refId];
          continue;
        }
        table[refId] = myId as any;
      }
      // init before
      if (table[myId]) {
        delete table[table[myId] as any];
        continue;
      }

      table[myId] = action as any;
    }

    return Object.values(table).filter((v) => typeof v === 'object');
  }

  private generalCan(activity: ActivityDocument, newStatus: ActivityStatus) {
    // same status
    if (activity.status === newStatus)
      return { can: false, message: 'new status must be deferent' };

    if (this.forbiddenModels.includes(normalizeColName(activity.target.model)))
      return {
        can: false,
        message: `can not update status for ${activity.target.model} model`,
      };

    return { can: true };
  }

  private async canUndo(activity: ActivityDocument) {
    //  general
    const gen = this.generalCan(activity, ActivityStatus.Undo);
    if (!gen.can) return gen;

    // get real history
    const realHistory = await this.getHistory({
      createdAt: activity.createdAt,
      depend: activity.depend_on,
    });

    // split
    const [myAct, others]: [null | FilterAction, FilterAction[]] =
      realHistory.reduce(
        (prev, curr) => {
          if (curr._id.equals(activity._id)) prev[0] = curr;
          else prev[1].push(curr);
          return prev;
        },
        [null, []]
      );

    // exists
    if (!myAct) return { can: false, message: 'this activity was undo before' };

    // not depend to any things
    if (!activity.depend_on) return { can: true };

    // list of forward do acts
    const listOfForwardDos = others.filter(
      ({ status }) => status === ActivityStatus.Do
    );

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
    //  general
    const gen = this.generalCan(activity, ActivityStatus.Do);
    if (!gen.can) return gen;

    // get real history
    const realHistory = await this.getHistory({
      createdAt: activity.createdAt,
      depend: activity.depend_on,
    });

    // split
    const [myAct, others]: [null | FilterAction, FilterAction[]] =
      realHistory.reduce(
        (prev, curr) => {
          if (curr._id.equals(activity._id)) prev[0] = curr;
          else prev[1].push(curr);
          return prev;
        },
        [null, []]
      );

    // exists
    if (!myAct) return { can: false, message: 'this activity was do before' };

    // not depend to any things
    if (!activity.depend_on) return { can: true };

    // list of backward undo acts
    const listOfBackwardDos = others.filter(
      ({ status }) => status === ActivityStatus.Undo
    );

    if (!listOfBackwardDos.length) return { can: true };
    return {
      can: false,
      message: `please do ${listOfBackwardDos
        .slice(0, 10)
        .map((a) => a._id.toString())
        .join(',')} first`,
    };
  }

  private async undoCreate(activity: ActivityDocument): Promise<DoResponse> {
    const model = store.db.model(activity.target.model);
    const filter = { _id: activity.target.after._id };
    await model.deleteOne(filter);
    return { query: { filter } };
  }
  private async doCreate(activity: ActivityDocument): Promise<DoResponse> {
    const model = store.db.model(activity.target.model);
    const targetAfter = await model.create(activity.target.after);
    return { targetAfter, query: { create: activity.target.after } };
  }

  private async revertUpdate(activity: ActivityDocument): Promise<DoResponse> {
    const model = store.db.model(activity.target.model);
    const filter = { _id: activity.target.after._id };
    const update = activity.target.before ?? {};
    const targetAfter = await model.findOneAndUpdate(filter, update, {
      new: true,
    });
    return { targetAfter, query: { filter, update } };
  }

  private async undoDelete(activity: ActivityDocument): Promise<DoResponse> {
    const model = store.db.model(activity.target.model);

    // update
    if (activity.target.after) return await this.revertUpdate(activity);
    // delete
    else if (activity.target.before)
      return await model.create(activity.target.before);

    return;
  }
  private async doDelete(activity: ActivityDocument): Promise<DoResponse> {
    const model = store.db.model(activity.target.model);

    // update
    if (activity.target.after) return await this.revertUpdate(activity);
    // delete
    else if (activity.target.before) {
      const filter = { _id: activity.target.before._id };
      await model.deleteOne(filter);
      return { query: { filter } };
    }

    throw new Error('can not do delete because there is not exist any target');
  }

  private async doAction(
    req: Req,
    activity: ActivityDocument,
    user: UserDocument,
    status: ActivityStatus
  ) {
    const isDo = status === ActivityStatus.Do;

    // can
    const { can, message } = isDo
      ? await this.canDo(activity)
      : await this.canUndo(activity);
    if (!can) throw new BadRequestError(message);

    // action
    let response: DoResponse;
    switch (activity.type) {
      case ActivityType.Create:
        response = isDo
          ? await this.doCreate(activity)
          : await this.undoCreate(activity);
        break;
      case ActivityType.Update:
        response = await this.revertUpdate(activity);
        break;
      case ActivityType.Delete:
        response = isDo
          ? await this.doDelete(activity)
          : await this.undoDelete(activity);
        break;
    }

    // save
    const doer = convertUser(user);
    const newActivity: Partial<IActivity> = {
      doer,
      status,
      depend_on: activity.depend_on,
      type: activity.type,
      target: {
        model: activity.target.model,
        after: response.targetAfter,
        before: activity.target.after,
      },
      query: response.query,
      from: ActivityFrom.Activity,
      ref: activity._id,
    };
    const newActDoc = await this.activityModel.create(newActivity);

    // event
    const events = [
      getActivityEventName({
        type: newActDoc.type,
        status: newActDoc.status,
        model: activity.target.model,
      }),
      getActivityEventName({
        type: newActDoc.type,
        status: newActDoc.status,
      }),
    ];
    events.forEach((ev) => store.event.emit(ev, newActDoc, activity, req));

    // present
    return newActDoc;
  }

  act: MiddleWare = async (req, res, next) => {
    const body: ActivityBody = req.body;

    // find
    const activity = await this.activityModel.findById(body.id);
    if (!activity) throw new NotFound('not found activity');

    // action
    const newActivity = await this.doAction(
      req,
      activity,
      req.user,
      body.status
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
    if (req?.modelName !== 'admin') return;
    const depend_on = req.target_before?._id ?? data?._id;
    const entity = new EntityCreator(opt.model);
    const activity: Partial<IActivity> = {
      doer: convertUser(req.user),
      status: ActivityStatus.Do,
      depend_on,
      type: crudType2ActivityType(opt.type),
      target: {
        model: opt.model,
        after: data,
        before: req.target_before,
      },
      query: {},
      from: ActivityFrom.EntityCrud,
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
