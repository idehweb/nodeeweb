import store from '../../store';

export async function getTheme(mode = 'admin', req, res, next) {
  const Settings = store.db.model('setting');
  const Template = store.db.model('template');
  const Page = store.db.model('page');
  const setting = await Settings.findOne({}, 'currency tax taxAmount ');
  const header = await Template.findOne({ type: 'header' });
  const footer = await Template.findOne({ type: 'footer' });
  const pages = await Page.find({});

  const routes = [];
  if (pages)
    pages.forEach((page) => {
      if (page.path)
        routes.push({
          path: page.path,
          exact: true,
          layout: 'DefaultLayout',
          element: 'DynamicPage',
          elements: page.elements || [],
        });
    });
  if (req.headers && req.headers.token) {
  }
  let currency = 'rial';
  if (setting && setting.currency) {
    currency = setting.currency;
  }

  let tax = false;
  if (setting && setting.tax) {
    tax = setting.tax;
  }
  let taxAmount = 0;
  if (setting && setting.taxAmount) {
    taxAmount = setting.taxAmount;
  }
  let lastObj = {
    sso: {
      google: {
        // client_id: myConfig.config.sso?.google?.["client-id"],
      },
    },
    taxAmount: taxAmount,
    tax: tax,
    currency: currency,
    header: {
      maxWidth: header && header.maxWidth ? header.maxWidth : '100%',
      backgroundColor:
        header && header.backgroundColor ? header.backgroundColor : '',
      classes: header && header.classes ? header.classes : '',
      padding: header && header.padding ? header.padding : '',
      showInDesktop: header && header.showInDesktop ? header.showInDesktop : '',
      showInMobile: header && header.showInMobile ? header.showInMobile : '',
      elements: header ? header.elements : [],
    },
    body: [{ name: 'MainContent' }],
    footer: {
      maxWidth: footer && footer.maxWidth ? footer.maxWidth : '100%',
      backgroundColor:
        footer && footer.backgroundColor ? footer.backgroundColor : '',
      classes: footer && footer.classes ? footer.classes : '',
      padding: footer && footer.padding ? footer.padding : '',
      elements: footer ? footer.elements : [],
    },
    routes: [
      {
        path: '/',
        exact: true,
        layout: 'DefaultLayout',
        element: 'Home',
      },

      {
        path: '/chat',
        exact: true,
        layout: 'Nohf',
        element: 'Chat',
      },
      {
        path: '/transaction/:method',
        exact: true,
        layout: 'Nohf',
        element: 'Transaction',
      },
      {
        path: '/transaction',
        exact: true,
        layout: 'Nohf',
        element: 'Transaction',
      },
      {
        path: '/admin',
        exact: true,
        layout: 'Nohf',
        element: 'Admin',
      },
      {
        path: '/admin/:model',
        exact: true,
        layout: 'Nohf',
        element: 'Admin',
      },
      {
        path: '/admin/:model/:action',
        exact: true,
        layout: 'Nohf',
        element: 'Admin',
      },
      {
        path: '/admin/:model/:action/:_id',
        exact: true,
        layout: 'Nohf',
        element: 'Admin',
      },
      {
        path: '/a/:_entity/:_id/:_slug',
        method: 'get',
        access: 'customer_all',
        controller: (req, res, next) => {
          console.log('show front, go visit ', process.env.SHOP_URL);
          // res.show();
        },
      },
      ...routes,
    ],
    // components: global.builderComponents([], { props: req.props }),
  };
  if (mode == 'admin') {
    let rules = {};
    // rules = global.rules(rules, { props: req.props });
    // console.log('global.models',global.models)
    // lastObj["models"] = global.models();
    // lastObj["rules"] = JSON.parse(JSON.stringify(rules));
  }
  return res.json(lastObj);
}

export async function getAuth(req, res, next) {
  return res.json({
    success: true,
    message: 'در حال ریدایرکت...',
    user: { tokens: [{ token: 'token' }] },
  });
}

export function mockTheme() {
  return {
    sso: {
      google: {
        client_id:
          '618852057818-v5rut1jdac5n8qtakkbntkgf0uhmnnk6.apps.googleusercontent.com',
      },
    },
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
    rules: {},
  };
}
