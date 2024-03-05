import _isEqual from 'lodash/isEqual';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import createRoutes from '#c/DefaultRoute';
import { DefaultLayout } from './layouts';

const APP = (props) => {
  let { t } = props,
    routes = [];
  // const themeData = useSelector((st) => st.store.themeData, _isEqual);
  const configData = useSelector((st) => st.store.configData, _isEqual);
  if (configData && configData.routes) {
    // console.log('configData.routes', configData);

    const newRoutes = [];
    for (const slug in configData.routes) {
      const route = configData.routes[slug];
      const isDynamic = route.path.includes(':');
      if (isDynamic) {
        newRoutes.push({
          path: route.path == '/home' ? '/' : route.path,
          element: 'DynamicPage',
          layout: 'DefaultLayout',
          exact: true,
          slug: slug,
        });
      } else {
        newRoutes.push({
          path: route.path == '/home' ? '/' : '/:_id',
          layout: 'DefaultLayout',
          element: route.path == '/home' ? 'Home' : 'Page',
          exact: true,
        });
      }
    }
    // console.log(newRoutes);
    routes = createRoutes( newRoutes );
  }
  // if (!themeData || (themeData && !themeData.models)) {
  //   return <></>;
  // }
  return (
    <div className={t('languageDir')} dir={t('languageDir')}>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            console.log(route);
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                element={
                  <route.layout
                    {...props}
                    // themeData={themeData}
                    templates={configData?.templates}>
                    <route.element
                      elements={route.elements}
                      slug={route?.slug}
                    />
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
