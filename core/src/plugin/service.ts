import download from 'download';
import {
  getAllPluginMarket,
  getPluginContentsUri,
} from '../../mock/plugin/market';
import { MiddleWare } from '../../types/global';
import { getPluginPath, getPluginTemp } from '../../utils/path';
import { validatePlain } from '../../utils/validation';

class PluginService {
  getAllMarket: MiddleWare = async (req, res) => {
    return { data: getAllPluginMarket() };
  };
  beforeAdd: MiddleWare = async (req, res, next) => {
    // download
    const pluginUris = getPluginContentsUri(req.params.id);

    await Promise.all(
      pluginUris.map(({ local, remote }) => {
        return download(remote, getPluginTemp());
      })
    );

    // validate
    const config = require(getPluginTemp('config.json'));
    if (config.add.dto) {
      req.body = await validatePlain(req.body, config.add.dto);
    }

    return next();
  };
  afterAdd: MiddleWare = async (req, res, next) => {
    const plugin: = req.crud;
    // copy plugin content
  };
  beforeEdit: MiddleWare = async () => {};
  afterEdit: MiddleWare = async () => {};
  afterGetAll: MiddleWare = async () => {};
  afterGetOne: MiddleWare = async () => {};
  afterDelete: MiddleWare = async () => {};
}

const pluginService = new PluginService();

export default pluginService;
