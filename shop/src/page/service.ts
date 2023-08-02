import { MiddleWare, Req } from '@nodeeweb/core/types/global';
import { submitAction, updateThemeConfig } from '../common/mustImplement';
import { CRUD_DEFAULT_REQ_KEY } from '@nodeeweb/core/src/constants/String';
import store from '@nodeeweb/core/store';

export default class Service {
  static createAfter: MiddleWare = async (req, res) => {
    const menu = req[CRUD_DEFAULT_REQ_KEY];
    const modelName = 'Page';
    const action = {
      user: req.user._id,
      title: 'create ' + modelName + ' ' + menu._id,
      action: 'create-' + modelName,
      data: menu,
      history: req.body,
    };
    action[modelName] = menu;
    submitAction(action);
    updateThemeConfig(req.props);
    return res.status(201).json(menu);
  };
  static updateAfter: MiddleWare = async (req, res) => {
    const menu = req[CRUD_DEFAULT_REQ_KEY];
    const modelName = 'Page';
    const action = {
      user: req.user._id,
      title: 'edit ' + modelName + ' ' + menu._id,
      action: 'edit-' + modelName,
      data: menu,
      history: req.body,
    };
    action[modelName] = menu;
    submitAction(action);
    updateThemeConfig(req.props);
    return res.status(200).json(menu);
  };

  static getOneFilterParser(req: Req) {
    const obj = {};
    if (store.db.isValidObjectId(req.params.id)) {
      obj['_id'] = req.params.id;
    } else {
      obj['slug'] = req.params.id;
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
    return res.json(menu);
  };
}
