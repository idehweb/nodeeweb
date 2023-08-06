import store from '../../store';
import { MiddleWare } from '../../types/global';

export class SettingService {
  getTheme: MiddleWare = (req, res, next) => {
    const isAdmin = req.modelName === 'admin';
    return res.status(200).json({
      taxAmount: 0,
      tax: true,
      currency: 'Toman',
      header: {},
      body: [
        {
          name: 'MainContent',
        },
      ],
      footer: {},
      routes: [
        {
          path: '/',
          exact: true,
          layout: 'DefaultLayout',
          element: 'Home',
        },
        {
          path: '/a/:_entity/:_id/:_slug',
          method: 'get',
          access: 'customer_all',
        },
      ],
      components: [],
      models: [],
      rules: isAdmin ? store.adminViews : undefined,
    });
  };
}

const settingService = new SettingService();

export default settingService;
