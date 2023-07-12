// import * as React from 'react';
// import {useSelector} from 'react-redux';
import { Layout, LayoutProps, useTranslate } from 'react-admin';

import { ReactQueryDevtools } from 'react-query/devtools';

import AppBar from './AppBar';
import Menu from './Menu';

// import {darkTheme, lightTheme} from './themes';
// // import {AppState} from '../types';
//
// export default (props) => {
//     const translate = useTranslate();
//
//     const theme = useSelector((state) =>
//     {
//         // console.log('state',state.theme);
//         return state.theme === 'dark' ? darkTheme : lightTheme
//     }
//     );
//     // return <Layout {...props} className={translate('dir')} appBar={AppBar} menu={Menu} theme={theme}/>;
//     return <Layout {...props} className={translate('dir')} menu={Menu}/>;
// };

const MainLayout = (props) => {
  console.log('props', props);
  const translate = useTranslate();
  return (
    <>
      <Layout
        {...props}
        className={translate('dir')}
        menu={Menu}
        appBar={AppBar}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};
export default MainLayout;
