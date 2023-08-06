import store from '../../store';
import { MiddleWare } from '../../types/global';

export class SettingService {
  getTheme: MiddleWare = async (req, res, next) => {
    const isAdmin = req.modelName === 'admin';
    const setting = await this.settingPromise;

    return res.status(200).json({
      taxAmount: setting.taxAmount,
      tax: setting.tax,
      currency: setting.currency,
      header: setting.header ?? {},
      body: [
        {
          name: 'MainContent',
        },
      ],
      footer: setting.footer ?? {},
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
      rules: isAdmin ? store.adminViews : undefined,
    });
  };

  get model() {
    return store.db.model('setting');
  }

  get settingPromise() {
    return this.model.findOne();
  }
}

const settingService = new SettingService();

export default settingService;
