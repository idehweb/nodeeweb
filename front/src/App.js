import _isEqual from 'lodash/isEqual';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import createRoutes from '#c/DefaultRoute';

const APP = (props) => {
  let { t } = props,
    routes = [];
  const themeData = useSelector((st) => st.store.themeData, _isEqual);
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
            console.log(route.path);
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
