import { lazy, useEffect } from 'react';
import { Admin, CustomRoutes, Resource, useTranslate } from 'react-admin';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import _get from 'lodash/get';

import '@/assets/global.css';
import '@/assets/rtl.css';

import ResourceList from '@/resource';
import {
  authProvider,
  dataProvider,
  changeThemeData,
  changeThemeDataFunc,
} from '@/functions';
import PluginMarket from '@/resource/plugin/PluginMarket';
import PluginLocal from '@/resource/plugin/PluginLocal';

import englishMessages from '@/i18n/en';
import farsiMessages from '@/i18n/fa';

import Login from './layout/Login';
import { MainLayout } from './layout';

import MyTheme from './MuiTheme';

const PageBuilder = lazy(() => import('@/resource/pageBuilder'));

const messages = {
  fa: farsiMessages,
  en: englishMessages,
};

const localeMain = localStorage.getItem('locale');
const i18nProvider = polyglotI18nProvider((locale) => {
  if (localeMain) {
    locale = localeMain;
  }
  return messages[locale] ? messages[locale] : messages.en;
}, 'en');

const exclude = [
  'automation',
  'task',
  'note',
  'category',
  'document',
  'action',
  'attributes',
  'customergroup',
  'entry',
  'form',
  'gateway',
  'discount',
  'template',
  'settings',
  'order',
  'admin',
  'menu',
  'page',
  'notification',
  'media',
  'post',
  'customer',
  'product',
  'productcategory',
  'transaction',
  'plugin',
];

export default function App() {
  const translate = useTranslate();
  const dispatch = useDispatch();
  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  useEffect(() => {
    changeThemeDataFunc().then((e) => {
      dispatch(changeThemeData(e));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    Action,
    Plugin,
    Attributes,
    Dynamic,
    Automation,
    CustomerGroup,
    Form,
    Entry,
    ProductCategory,
    Gateway,
    Template,
    Discount,
    Logout,
    Page,
    Messages,
    Configuration,
    PrivateConfiguration,
    Customer,
    Note,
    Task,
    Document,
    MainDashboard,
    Media,
    Menu,
    Order,
    OrderCart,
    Post,
    Product,
    Settings,
    Notification,
    Transaction,
    User,
  } = ResourceList;

  const ModelList = _get(themeData, 'models', []) || [];

  return (
    <Admin
      title={translate('websiteName')}
      disableTelemetry
      theme={MyTheme}
      loginPage={Login}
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={MainDashboard}
      layout={MainLayout}
      i18nProvider={i18nProvider}>
      <Resource
        name="attributes"
        {...Attributes}
        options={{ label: translate('pos.menu.attributes') }}
      />
      <Resource
        name="productCategory"
        {...ProductCategory}
        options={{ label: translate('pos.menu.categories') }}
      />
      <Resource
        name="customerGroup"
        {...CustomerGroup}
        options={{ label: translate('pos.menu.customerGroups') }}
      />
      {/*<Resource name="customer-group" {...CustomerGroup} options={{label: translate('pos.menu.customerGroups')}}/>*/}
      <Resource
        name="discount"
        {...Discount}
        options={{ label: translate('pos.menu.discounts') }}
      />
      <Resource
        name="product"
        {...Product}
        options={{ label: translate('pos.menu.products') }}
      />
      <Resource
        name="post"
        options={{ label: translate('pos.menu.posts') }}
        {...Post}
      />
      <Resource
        name="page"
        options={{ label: translate('pos.menu.pages') }}
        {...Page}
      />
      <Resource
        name="gateway"
        options={{ label: translate('pos.menu.gateways') }}
        {...Gateway}
      />
      <Resource
        name="customer"
        options={{ label: translate('pos.menu.customers') }}
        {...Customer}
      />
      <Resource
        name="admin"
        options={{ label: translate('pos.menu.users') }}
        {...User}
      />
      {/* <Resource
        name="plugin"
        options={{ label: translate('pos.menu.plugin') }}
        {...Plugin}
      /> */}
      <Resource
        name="file"
        options={{ label: translate('pos.menu.medias') }}
        {...Media}
      />
      <Resource
        name="document"
        options={{ label: translate('pos.menu.documents') }}
        {...Document}
      />
      <Resource
        name="note"
        options={{ label: translate('pos.menu.notes') }}
        {...Note}
      />
      <Resource
        name="task"
        options={{ label: translate('pos.menu.tasks') }}
        {...Task}
      />
      <Resource
        name="menu"
        options={{ label: translate('pos.menu.menu') }}
        {...Menu}
      />
      <Resource
        name="form"
        options={{ label: translate('pos.menu.form') }}
        {...Form}
      />
      <Resource
        name="entry"
        options={{ label: translate('pos.menu.entry') }}
        {...Entry}
      />
      <Resource
        name="order"
        options={{ label: translate('pos.menu.orders') }}
        {...Order}
      />
      <Resource
        name="ordercart"
        options={{ label: translate('pos.menu.cart') }}
        {...OrderCart}
      />
      <Resource
        name="transaction"
        options={{ label: translate('pos.menu.transactions') }}
        {...Transaction}
      />
      <Resource
        name="template"
        options={{ label: translate('pos.menu.template') }}
        {...Template}
      />
      <Resource
        name="notification"
        options={{ label: translate('pos.menu.notification') }}
        {...Notification}
      />
      <Resource
        name="settings"
        options={{ label: translate('pos.menu.settings') }}
        {...Settings}
      />
      <Resource
        name="action"
        options={{ label: translate('pos.menu.actions') }}
        {...Action}
      />
      <Resource
        name="automation"
        options={{ label: translate('pos.menu.automation') }}
        {...Automation}
      />
      {ModelList.map((i, idx) => {
        const modelName = i.toLowerCase();
        if (!exclude.includes(modelName))
          return (
            <Resource
              key={`${modelName}-${idx}`}
              name={modelName}
              options={{ label: translate('pos.menu.' + modelName) }}
              {...Dynamic}
            />
          );

        return null;
      })}
      <CustomRoutes>
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/p-c" element={<PrivateConfiguration />} />
        <Route path="/plugin/market" element={<PluginMarket />} />
        <Route path="/plugin/local" element={<PluginLocal />} />
      </CustomRoutes>
      <CustomRoutes noLayout>
        <Route path="/logout" element={<Logout />} />
        <Route path="/builder/:model/:_id" element={<PageBuilder />} />
      </CustomRoutes>
    </Admin>
  );
}
