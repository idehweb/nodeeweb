import { CoreConfigBody } from '../../dto/config';
import store from '../../store';
import { GeneralError } from '../../types/error';
import { MiddleWare } from '../../types/global';

class ConfigService {
  get: MiddleWare = async (req, res) => {
    return res.json({ data: store.config });
  };

  async updateConf(body: CoreConfigBody) {
    if (!store.config) throw new GeneralError('config not resister yet!', 500);

    await store.config.change(body.config, {
      merge: true,
      restart: body.restart ?? true,
      external_wait: true,
      internal_wait: false,
    });
  }

  update: MiddleWare = async (req, res) => {
    const body: CoreConfigBody = req.body;

    await this.updateConf(body);

    store.event.emit('config-update', body);

    return res.status(200).json({ data: store.config });
  };

  getWebConf: MiddleWare = (req, res) => {
    const config = store.config.getPublic();
    const templates = store.templates;
    const routes = store.routes;

    return res.status(200).json({ data: { config, templates, routes } });
  };
  getAdminDashConf: MiddleWare = (req, res) => {
    return res.status(200).json({ data: store.adminViews });
  };
}

export const configService = new ConfigService();
