import global from '../../../global.mjs';

var self = {
  create: function (req, res, next) {
    let Model = req.mongoose.model('Page');

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
    let Model = req.mongoose.model('Page');

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
        // console.log('modelName',modelName,req.headers._id,req.headers.token)
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
  viewOne: function (req, res, next) {
    console.log('viewOne...', req.params.id);
    let Model = req.mongoose.model('Page');

    let obj = {};
    if (req.mongoose.isValidObjectId(req.params.id)) {
      obj['_id'] = req.params.id;
    } else {
      obj['slug'] = req.params.id;
    }
    // console.log('obj',obj)
    Model.findOne(obj, function (err, menu) {
      if (err || !menu) {
        res.json({
          success: false,
          message: 'error!',
          err: err,
          obj,
        });
        return 0;
      }
      if (menu.access && menu.access == 'private') {
        if (!req.headers.token) {
          console.log(' no token');
          return res.json({
            success: false,
            _id: menu && menu._id ? menu._id : null,
            slug: menu && menu.slug ? menu.slug : null,
            access: 'private',
            message: 'login please',
          });
        }
        console.log('req,headers', req.headers.token);
        let Customer = req.mongoose.model('Customer');
        let Admin = req.mongoose.model('Admin');

        Customer.findOne(
          {
            'tokens.token': req.headers.token,
          },
          function (err, customer) {
            if (err || !customer) {
              console.log(
                '==> authenticateCustomer() got error',
                err,
                customer
              );
              Admin.findOne(
                {
                  token: req.headers.token,
                },
                function (err, admin) {
                  if (err || !admin) {
                    console.log(
                      '==> authenticateAdmin() got error',
                      err,
                      customer
                    );
                    return res.json({
                      success: false,
                      _id: menu && menu._id ? menu._id : null,
                      slug: menu && menu.slug ? menu.slug : null,
                      access: 'private',
                      message: 'login please',
                    });
                  } else {
                    return res.json(menu);
                  }
                }
              );
            } else {
              return res.json(menu);
            }
          }
        );
      }
      if (!menu.access || (menu.access && menu.access == 'public'))
        return res.json(menu);
      // 0;
    });
  },
};
export default self;
