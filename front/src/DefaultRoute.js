import Admin from '#c/views/Admin';
import CreatePage from '#c/views/CreatePage';
// import Db from '#c/views/Db';
import Home from '#c/views/Home';
// import HomeDb from '#c/views/Home_db';
import Product from '#c/views/Product';
import Login from '#c/views/Login';
import Contacts from '#c/views/Contacts';
import Order from '#c/views/Order';
import Chat from '#c/views/Chat';
import Entities from '#c/views/Entities';
import Page from '#c/views/Page';
import Profile from '#c/views/Profile';
import MyOrders from '#c/views/MyOrders';
import OrderDetails from '#c/views/OrderDetails';
import Transaction from '#c/views/Transaction';
import DynamicPage from '#c/views/DynamicPage';
import Checkout from '#c/views/Checkout';
import Post from '#c/views/Post';
import {DefaultLayout, Nof, Nohf} from '#c/layouts/index';

export default function createRoutes(themeRoutes) {
  let DefaultRoute = [
    // {
    //   path: '/admin/db',
    //   element: Db,
    //   layout: Nohf,
    //   exact: true,
    //
    // },
    // {
    //   path: '/admin/:model',
    //   element: Admin,
    //   layout: Nohf,
    //   exact: true,
    //
    // },
    // {
    //   path: '/admin/:model/:action',
    //   element: Admin,
    //   layout: Nohf,
    //   exact: true,
    //
    // },
    // {
    //   path: '/admin/:model/:action/:_id',
    //   element: Admin,
    //   layout: Nohf,
    //   exact: true,
    //
    // },
    // {
    //   path: '/admin/page/create-page',
    //   element: CreatePage,
    //   layout: Nohf,
    //   exact: true,
    //
    // },
    // {
    //   path: '/admin/:model/edit-page/:_id',
    //   element: CreatePage,
    //   layout: Nohf,
    //   exact: true,
    //
    // },
    {
      path: '/post/:_id',
      element: Post,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/post/:_id/:slug',
      element: Post,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/page/:_id',
      element: Page,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/product/:_id/:_slug',
      element: Product,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/product/:_id',
      element: Product,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/p/:_id',
      element: Product,
      layout: DefaultLayout,
      exact: true,

    },
    {
      path: '/login',
      element: Login,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/transaction/:method',
      element: Transaction,
      layout: Transaction,
      exact: true,

    },{
      path: '/transaction',
      element: Transaction,
      layout: Transaction,
      exact: true,

    }, {
      path: '/login/:_state',
      element: Login,
      layout: DefaultLayout,
      exact: true,

    },
    {
      path: '/checkout',
      element: Checkout,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/chat',
      element: Chat,
      layout: Nohf,
      exact: true,

    }, {
      path: '/chat/:user_id',
      element: Chat,
      layout: Nohf,
      exact: true,

    }, {
      path: '/contacts',
      element: Contacts,
      layout: Nohf,
      exact: true,

    },

    {
      path: '/profile',
      element: Profile,
      layout: DefaultLayout,
      exact: true,

    },
    {
      path: '/my-orders',
      layout: DefaultLayout,
      element: MyOrders,
    },
    {
      path: '/order-details/:_id',
      layout: DefaultLayout,
      element: OrderDetails,
    },
    {
      path: '/order/:_id',
      layout: DefaultLayout,
      element: Order,
    },
    {
      path: '/a/:_entity/:_id/:_slug',
      element: Entities,
      layout: DefaultLayout,
      exact: true,

    }, {
      path: '/:_id',
      element: Page,
      layout: DefaultLayout,
      exact: true,

    },
  ];

  let routes = DefaultRoute;
  themeRoutes.forEach((e, j) => {
    if (e.element == 'Admin') {
      e.element = Admin;

    }
    if (e.element == 'Home') {
      e.element = Home;

    }
    if (e.element == 'Checkout') {
      e.element = Checkout;

    }
    if (e.layout == 'Nohf') {
      e.layout = Nohf;

    }
    if (e.layout == 'Transaction') {
      e.layout = Transaction;

    }
    if (e.layout == 'DefaultLayout') {
      e.layout = DefaultLayout;

    }
    if (e.element == 'DynamicPage' ) {
      e.element = DynamicPage;

    }
    if (e.layout && e.element && e.path) {
      routes.push(e);
    }
  })
  return routes;
}

// export default DefaultRoute
