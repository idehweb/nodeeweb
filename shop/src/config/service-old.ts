import { MiddleWare, Res } from '@nodeeweb/core/types/global';
import store from '@nodeeweb/core/store';

export default class Service {
  static last: MiddleWare = async (req, res) => {
    let Settings = store.db.model('setting');

    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    const settingss = await Settings.find({})
      .skip(offset)
      .sort({ _id: -1 })
      .limit(1);

    if (settingss && settingss[0] && settingss[0].data)
      res.json(settingss[0].data);
    else res.json([]);
    return 0;
  };
  static restart: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static functions: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static events: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static pluginRules: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static updatePluginRules: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static customerStatus: MiddleWare = async (req, res) => {
    let Settings = store.db.model('setting');

    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    const settingss = await Settings.findOne({}, 'customerStatus')
      .skip(offset)
      .sort({ _id: -1 });

    if (!settingss) {
      res.status(404).json({
        success: false,
        message: 'error!',
      });
      return 0;
    }
    if (settingss && settingss.customerStatus)
      res.json(settingss.customerStatus);
    else res.json({});
    return 0;
  };
  static formStatus: MiddleWare = async (req, res) => {
    let Settings = store.db.model('setting');

    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    const settingss = await Settings.findOne({}, 'formStatus')
      .skip(offset)
      .sort({ _id: -1 });

    if (!settingss) {
      res.status(404).json({
        success: false,
        message: 'error!',
      });
      return 0;
    }
    if (settingss && settingss.formStatus) res.json(settingss.formStatus);
    else res.json({});
    return 0;
  };
  static configuration: MiddleWare = async (req, res) => {
    let Settings = store.db.model('setting');

    const setting = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'error',
      });
    }
    res.json({ success: true, setting });
  };
  static getConfiguration: MiddleWare = async (req, res) => {
    let Settings = store.db.model('setting');

    const setting = await Settings.findOne({});

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'error',
      });
    }
    res.json({ success: true, setting });
  };
  static factore: MiddleWare = async (req, res) => {
    let Settings = store.db.model('setting');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    const settingss = await Settings.findOne(
      {},
      'factore_shop_name factore_shop_site_name factore_shop_address factore_shop_phone factore_shop_faxNumber factore_shop_postalCode factore_shop_submitCode factore_shop_internationalCode'
    )
      .skip(offset)
      .sort({ _id: -1 });

    if (!settingss) {
      res.status(404).json({
        success: false,
        message: 'error!',
      });
      return 0;
    }
    if (settingss) res.json(settingss);
    else res.json({});
    return 0;
  };
  static plugins: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static deActivePlugins: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static market: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static deactivatePlugin: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static activatePlugin: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };
  static update: MiddleWare = async (req, res) => {
    return this._notImplement(res);
  };

  static fileUpload: MiddleWare = async (req, res) => {
    if (!req.file_path)
      return res.status(400).json({ message: 'upload failed' });
    const Media = store.db.model('media');
    const Settings = store.db.model('setting');
    const media = await Media.create({
      name: req.file_path.split('/').pop(),
      url: req.file_path,
      type: req.file.mimetype,
      theKey: 'logo',
    });

    Settings.findOneAndUpdate(
      {},
      {
        logo: req.file_path,
      },
      { new: true }
    );

    return res.status(201).json({ success: true, data: { media } });
  };
  static _notImplement = (res: Res) => {
    res.status(500).send('not implement yet!');
  };
}
