import _ from 'underscore';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import store from '#c/functions/store';
import { SaveData } from '#c/functions/index';
import { useSelector, useDispatch } from 'react-redux';
import createRoutes from '#c/DefaultRoute';
const APP = (props) => {
  let { t } = props,
    routes = [];
  const themeData = useSelector((st) => st.store.themeData, _.isEqual);
  if (themeData && themeData.routes) {
    routes = createRoutes(themeData.routes);
  }
  // if (!themeData || (themeData && !themeData.models)) {
  //   return <></>;
  // }
  return (
    <div className={t('languageDir')} dir={t('languageDir')}>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            console.log('route...',route)
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                element={
                  <route.layout {...props} themeData={themeData}>
                    <route.element elements={route.elements} />
                  </route.layout>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default withTranslation()(APP);
