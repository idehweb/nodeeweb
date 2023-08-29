import { CoreConfigBody } from '../../dto/config';
import store from '../../store';
import { GeneralError } from '../../types/error';
import { MiddleWare } from '../../types/global';

class ConfigService {
  get: MiddleWare = async (req, res) => {
    return res.json({ data: store.config });
  };

  update: MiddleWare = async (req, res) => {
    const body: CoreConfigBody = req.body;
    if (!store.config) throw new GeneralError('config not resister yet!', 500);

    await store.config.change(body.config, {
      merge: true,
      restart: body.restart ?? true,
      external_wait: true,
      internal_wait: false,
    });

    return res.status(200).json({ data: store.config });
  };

  getViewConf: MiddleWare = (req, res) => {
    return res.status(200).json({ data: { config: store.config.getPublic() } });
  };
  getAdminDashConf: MiddleWare = (req, res) => {
    return res.status(200).json({ data: store.adminViews });
  };
}

export const configService = new ConfigService();
