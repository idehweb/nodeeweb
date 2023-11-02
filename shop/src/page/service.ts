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
import { Query } from 'mongoose';
import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';

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
      page
    );

    return res.status(201).json({ data: page });
  };
  static updateAfter: MiddleWare = async (req, res) => {
    const pageQuery: Query<PageDocument, PageDocument> =
      req[CRUD_DEFAULT_REQ_KEY];
    pageQuery.setOptions({ ...pageQuery.getOptions(), new: false });
    const oldPage = await pageQuery;
    const newPage = { ...oldPage.toObject(), ...req.body };

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
      newPage
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
  static getOneAfter: MiddleWare = (req, res) => {
    const menu = req[CRUD_DEFAULT_REQ_KEY];
    if (menu.access && menu.access == 'private') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          _id: menu && menu._id ? menu._id : null,
          slug: menu && menu.slug ? menu.slug : null,
          access: 'private',
          message: 'login please',
        });
      }
    }
    return res.json({ data: menu });
  };

  static deleteAfter: MiddleWare = (req, res) => {
    const page = req.crud;
    unregisterRoute({ name: page.slug }, { from: 'PageService' });
    return res.status(204).send();
  };
}
