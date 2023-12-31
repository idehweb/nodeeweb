import React from 'react';
import PropTypes from 'prop-types';
import PageBuilder from '#c/components/page-builder/PageBuilder';
import CardSidebar from '#c/components/layout/MainSidebar/CardSidebar';
import { setStyles } from '#c/functions/index';
import MainMobileNavbar from '#c/components/layout/MainNavbar/MainMobileNavbar';
import MainSidebar from '#c/components/layout/MainSidebar/MainSidebar';
import MainSidebarNavItems from '#c/components/layout/MainSidebar/MainSidebarNavItems';

const DefaultLayout = (props) => {
  // console.clear();
  console.log('DefaultLayout...', props);
  // return
  let {
    children,
    width,
    noNavbar,
    onChange = () => null,
    themeData,
    templates,
  } = props;
  // const themeData = useSelector((st) => st.store.themeData);
  // const themeData = useSelector((st) => st.store.themeData);
  // const homeData = useSelector((st) => st.store.homeData);
  // useEffect(() => {
  //   console.log('homeData', themeData)
  // }, []);
  // if (!templates) {
  //   return;
  // }
  console.log('children', children);
  let headerStyle = setStyles(templates?.header);
  delete headerStyle.maxWidth;

  let footer = setStyles(templates?.footer);
  delete footer.maxWidth;
  return (
    <>
      {templates.header && templates.header.elements && (
        <header
          style={headerStyle}
          className={
            'main-header d-flex pt-3 pb-1 px-3  ' +
            templates.header.classes +
            (templates.header.showInDesktop ? ' showInDesktop ' : '') +
            (templates.header.showInMobile ? ' showInMobile ' : '')
          }
          key={0}>
          <PageBuilder
            elements={templates.header.elements}
            maxWidth={templates.header.maxWidth}
          />
        </header>
      )}
      {children}
      <CardSidebar />

      {/*<MainMobileNavbar search={false} />*/}
      {templates.footer && templates.footer.elements && (
        <footer
          style={footer}
          className={
            'main-footer p-2 px-3 border-top ' + templates.footer.classes
          }
          key={2}>
          <PageBuilder
            elements={templates.footer.elements}
            maxWidth={templates.footer.maxWidth}
          />
        </footer>
      )}
    </>
  );
};

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default DefaultLayout;
