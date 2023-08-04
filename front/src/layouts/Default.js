import React from 'react';
import PropTypes from 'prop-types';
import PageBuilder from "#c/components/page-builder/PageBuilder";
import CardSidebar from '#c/components/layout/MainSidebar/CardSidebar';
import {setStyles} from "#c/functions/index";
import MainMobileNavbar from '#c/components/layout/MainNavbar/MainMobileNavbar';
import MainSidebar from '#c/components/layout/MainSidebar/MainSidebar';
import MainSidebarNavItems from "#c/components/layout/MainSidebar/MainSidebarNavItems";


const DefaultLayout = (props) => {
  console.log('DefaultLayout...', props);
// return
  let {children, width, noNavbar, onChange = () => null, themeData} = props;
  // const themeData = useSelector((st) => st.store.themeData);
  // const themeData = useSelector((st) => st.store.themeData);
  // const homeData = useSelector((st) => st.store.homeData);
  // useEffect(() => {
  //   console.log('homeData', themeData)
  // }, []);
  if (!themeData) {
    return
  }
  console.log('children', children)
  let headerStyle = setStyles(themeData.header)
  delete headerStyle.maxWidth

  let footer = setStyles(themeData.footer);
  delete footer.maxWidth;
  return (

    <>
      {themeData.header && themeData.header.elements &&
      <header style={headerStyle} className={"main-header d-flex pt-3 pb-1 px-3  " + themeData.header.classes + (themeData.header.showInDesktop ? ' showInDesktop ' : '') + (themeData.header.showInMobile ? ' showInMobile ' : '')} key={0}>
        <PageBuilder elements={themeData.header.elements} maxWidth={themeData.header.maxWidth}/>
      </header>}
      {children}
      <CardSidebar/>

      {/*<MainMobileNavbar search={false} />*/}
      {themeData.footer && themeData.footer.elements &&
      <footer style={footer} className={"main-footer p-2 px-3 border-top " + themeData.footer.classes} key={2}>
        <PageBuilder elements={themeData.footer.elements} maxWidth={themeData.footer.maxWidth}/></footer>}

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

