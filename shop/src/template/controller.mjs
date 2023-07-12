import global from '../../../global.mjs';

var self = {
  create: function (req, res, next) {
    let Model = req.mongoose.model('Template');

    if (req.body && req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    }
    Model.create(req.body, function (err, menu) {
      if (err || !menu) {
        res.json({
          err: err,
          success: false,
          message: 'error!',
        });
        return 0;
      }
      let modelName = Model.modelName;
      modelName = global.capitalize(modelName);
      // console.log('modelName',modelName,req.headers._id,req.headers.token)
      if (req.headers._id && req.headers.token) {
        let action = {
          user: req.headers._id,
          title: 'create ' + modelName + ' ' + menu._id,
          action: 'create-' + modelName,
          data: menu,
          history: req.body,
        };
        action[modelName] = menu;
        req.submitAction(action);
      }
      global.updateThemeConfig(req.props);

      res.json(menu);
      return 0;
    });
  },

  edit: function (req, res, next) {
    let Model = req.mongoose.model('Template');

    if (!req.params.id) {
      return res.json({
        success: false,
        message: 'send /edit/:id please, you did not enter id',
      });
    }
    //export new object saved
    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    }
    if (!req.body) {
      req.body = {};
    }
    req.body.updatedAt = new Date();
    Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, menu) {
        if (err || !menu) {
          res.json({
            success: false,
            message: 'error!',
            err: err,
          });
          return 0;
        }
        let modelName = Model.modelName;
        modelName = global.capitalize(modelName);
        console.log('modelName', modelName, req.headers._id, req.headers.token);
        if (req.headers._id && req.headers.token) {
          let action = {
            user: req.headers._id,
            title: 'edit ' + modelName + ' ' + menu._id,
            action: 'edit-' + modelName,
            data: menu,
            history: req.body,
          };
          action[modelName] = menu;
          // console.log('submit action:')

          req.submitAction(action);
        }
        global.updateThemeConfig(req.props);

        res.json(menu);
        return 0;
      }
    );
  },
};
export default self;
