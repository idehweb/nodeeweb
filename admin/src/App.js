import React, { useEffect } from "react";

import { Admin, CustomRoutes, Resource, useTranslate } from "react-admin";
import resources from "@/resource";
import { authProvider, dataProvider, theme } from "@/functions";
import englishMessages from "@/i18n/en";
import farsiMessages from "@/i18n/fa";
import themeDataReducer from "./themeDataReducer";
import themeReducer from "./themeReducer";
import languageReducer from "./languageReducer";
import Types from "@/functions/types";

import { Route } from "react-router-dom";
import Login from "./layout/Login";
import { useDispatch, useSelector } from "react-redux";
import { changeThemeData, changeThemeDataFunc } from "./functions/index";
import polyglotI18nProvider from "ra-i18n-polyglot";
import "@/assets/global.css";
import { MainLayout } from "./layout";
import "@/assets/rtl.css";


const messages = {
  fa: farsiMessages,
  en: englishMessages
};

let dl = Types()["default_locale"];

const localeMain = localStorage.getItem("locale");
const i18nProvider = polyglotI18nProvider(
  locale => {
    if (localeMain) {
      locale = localeMain;
    }
    return messages[locale] ? messages[locale] : messages.en;
  },
  dl
);

export default function App() {
  const translate = useTranslate();
  const dispatch = useDispatch();
  const themeData = useSelector((st) => st.themeData);
  let exclude = ["automation","task","note","category","document","action","attributes", "customergroup", "entry", "form", "gateway", "discount", "template", "settings", "order", "admin", "menu", "page", "notification", "media", "post", "customer", "product", "productcategory", "transaction"];

  const load = (options = {}) => {

    changeThemeDataFunc().then(e => {
      dispatch(changeThemeData(e));

    });
  };
  useEffect(() => {
    // console.clear();

    load();
  }, []);
  const { Action, Plugin, Attributes,Dynamic, Automation, CustomerGroup, Form, Entry, ProductCategory, Gateway, Template, Discount, Logout, Page, Messages, Configuration, Plugins, PrivateConfiguration, Customer, Note, Task, Document, MainDashboard, Media, Menu, Order, OrderCart, Post, Product, Settings, Notification, Transaction, User, PageBuilder } = resources;
  return (
    <Admin
      title={translate("websiteName")}
      disableTelemetry
      theme={theme}
      loginPage={Login}
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={MainDashboard}
      layout={MainLayout}
      customReducers={{ theme: themeReducer, locale: languageReducer, themeData: themeDataReducer }}
      i18nProvider={i18nProvider}
    >
      <Resource name="attributes" {...Attributes} options={{ label: translate("pos.menu.attributes") }}/>
      <Resource name="productCategory" {...ProductCategory} options={{ label: translate("pos.menu.categories") }}/>
      <Resource name="customerGroup" {...CustomerGroup} options={{ label: translate("pos.menu.customerGroups") }}/>
      {/*<Resource name="customer-group" {...CustomerGroup} options={{label: translate('pos.menu.customerGroups')}}/>*/}
      <Resource name="discount" {...Discount} options={{ label: translate("pos.menu.discounts") }}/>
      <Resource name="product" {...Product} options={{ label: translate("pos.menu.products") }}/>
      <Resource name="post" options={{ label: translate("pos.menu.posts") }} {...Post} />
      <Resource name="page" options={{ label: translate("pos.menu.pages") }} {...Page} />
      <Resource name="gateway" options={{ label: translate("pos.menu.gateways") }} {...Gateway} />
      <Resource name="customer" options={{ label: translate("pos.menu.customers") }} {...Customer} />
      <Resource name="admin" options={{ label: translate("pos.menu.users") }} {...User} />
      <Resource name="media" options={{ label: translate("pos.menu.medias") }} {...Media} />
      <Resource name="document" options={{ label: translate("pos.menu.documents") }} {...Document} />
      <Resource name="note" options={{ label: translate("pos.menu.notes") }} {...Note} />
      <Resource name="task" options={{ label: translate("pos.menu.tasks") }} {...Task} />
      <Resource name="menu" options={{ label: translate("pos.menu.menu") }} {...Menu} />
      <Resource name="form" options={{ label: translate("pos.menu.form") }} {...Form} />
      <Resource name="entry" options={{ label: translate("pos.menu.entry") }} {...Entry} />
      <Resource name="order" options={{ label: translate("pos.menu.orders") }} {...Order} />
      <Resource name="ordercart" options={{ label: translate("pos.menu.cart") }} {...OrderCart} />
      <Resource name="transaction" options={{ label: translate("pos.menu.transactions") }} {...Transaction} />
      <Resource name="template" options={{ label: translate("pos.menu.template") }} {...Template} />
      <Resource name="notification" options={{ label: translate("pos.menu.notification") }} {...Notification} />
      <Resource name="settings" options={{ label: translate("pos.menu.settings") }} {...Settings} />
      <Resource name="action" options={{ label: translate("pos.menu.actions") }} {...Action} />
      <Resource name="automation" options={{ label: translate("pos.menu.automation") }} {...Automation} />
      {themeData && themeData.models && themeData.models.map((model, m) => {
        if (exclude.indexOf(model.toLowerCase()) == -1) {
          let modelName=model.toLowerCase()
          return <Resource name={modelName} options={{ label: translate("pos.menu."+modelName) }} {...Dynamic} />;

          // return <MenuItemLink
          //   to={{
          //     pathname: "/" + model,
          //     state: { _scrollToTop: true }
          //   }}
          //   primaryText={translate(`${model}`)}
          //   leftIcon={<Dashboard/>}
          //   exact={"true"}
          //   dense={dense}
          //   className={"vas"}
          // />;
        }
      })}
      <CustomRoutes>
        <Route path="/plugins" element={<Plugins/>}/>
        <Route path="/plugins/:name" element={<Plugin/>}/>
        <Route path="/configuration" element={<Configuration/>}/>
        <Route path="/messages" element={<Messages/>}/>
        <Route path="/p-c" element={<PrivateConfiguration/>}/>
      </CustomRoutes>
      <CustomRoutes noLayout>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/builder/:model/:_id" element={<PageBuilder/>}/>
      </CustomRoutes>
    </Admin>
  );
}
