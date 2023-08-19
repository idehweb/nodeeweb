import { MiddleWare } from '../../types/global';

class PluginService {
  getAllMarket: MiddleWare = async () => {};
  beforeAdd: MiddleWare = async () => {};
  afterAdd: MiddleWare = async () => {};
  beforeEdit: MiddleWare = async () => {};
  afterEdit: MiddleWare = async () => {};
  afterGetAll: MiddleWare = async () => {};
  afterGetOne: MiddleWare = async () => {};
  afterDelete: MiddleWare = async () => {};
}

const pluginService = new PluginService();

export default pluginService;
