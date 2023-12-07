import { CRUD, MiddleWare, Req } from '@nodeeweb/core/types/global';
import { submitAction, updateThemeConfig } from '../common/mustImplement';
import { CRUD_DEFAULT_REQ_KEY } from '@nodeeweb/core/src/constants/String';
import store from '@nodeeweb/core/store';
import {
  registerRoute,
  unregisterRoute,
} from '@nodeeweb/core/src/handlers/view.handler';
import { PageDocument } from '../../schema/page.schema';
import { page2Route } from '@nodeeweb/core/utils/helpers';
import { FilterQuery, Query } from 'mongoose';
import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';
import { PublishStatus } from '../../schema/_base.schema';
import { NotFound } from '@nodeeweb/core';
import _ from 'lodash';

export default class Service {
  static createAfter: MiddleWare = async (req, res) => {
    const page: PageDocument = req[CRUD_DEFAULT_REQ_KEY];

    registerRoute(
      {
        name: page.slug,
        route: page2Route(page),
      },
      { from: 'PageService' }
    );

    // emit event
    store.event.emit(
      getEntityEventName('page', { post: true, type: CRUD.CREATE }),
      page,
      { type: CRUD.CREATE, model: 'page' },
      req
    );

    return res.status(201).json({ data: page });
  };
  static updateAfter: MiddleWare = async (req, res) => {
    const body = _.omitBy(req.body, _.isUndefined);
    const pageQuery: Query<PageDocument, PageDocument> =
      req[CRUD_DEFAULT_REQ_KEY];

    pageQuery.setOptions({ ...pageQuery.getOptions(), new: false });
    const oldPage = await pageQuery.exec();

    if (!oldPage) throw new NotFound('page not found');

    const newPage = { ...oldPage.toObject(), ...body };
    if (oldPage.slug !== newPage.slug || oldPage.path !== newPage.path) {
      unregisterRoute({ name: oldPage.slug }, { from: 'PageService' });
      registerRoute(
        {
          name: newPage.slug,
          route: page2Route(newPage),
        },
        { from: 'PageService' }
      );
    }

    // emit event
    store.event.emit(
      getEntityEventName('page', { post: true, type: CRUD.UPDATE_ONE }),
      newPage,
      { type: CRUD.UPDATE_ONE, model: 'page' },
      req
    );

    return res.status(200).json({ data: newPage });
  };

  static getOneFilterParser(req: Req) {
    const obj = {};
    if (store.db.isValidObjectId(req.params.page)) {
      obj['_id'] = req.params.page;
    } else {
      obj['slug'] = req.params.page;
    }

    return obj;
  }
  static getOneFilter(req: Req) {
    const isAdmin = req.modelName === 'admin';
    const { slug, id } = req.params;
    const filter: FilterQuery<PageDocument> = {};

    if (slug) filter.slug = slug;
    if (id) filter._id = id;
    if (!isAdmin) filter.status = PublishStatus.Published;

    return filter;
  }

  static deleteAfter: MiddleWare = (req, res) => {
    const page = req.crud;
    unregisterRoute({ name: page.slug }, { from: 'PageService' });

    // emit event
    store.event.emit(
      getEntityEventName('page', { post: true, type: CRUD.DELETE_ONE }),
      page,
      { type: CRUD.DELETE_ONE, model: 'page' },
      req
    );

    return res.status(204).send();
  };
}
