import React from "react";
import { withTranslation } from "react-i18next";
import { Route, Routes,Router } from 'react-router-dom';
import { SaveData } from "#c/functions/index";
import "#c/i18n";
import routes from '#c/ssrRoutes';
const AppSSR = ((props) => {
  const { t, url } = props;
  return (
      <div className={t("languageDir")} dir={t("languageDir")}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              element={<route.layout {...props}><route.element {...props}/></route.layout>}
            />
          ))}
        </Routes>
      </div>
  );
});
export default withTranslation()(AppSSR);
