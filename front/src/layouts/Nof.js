import React from 'react';
import PropTypes from 'prop-types';
import {Col, Container, Row} from 'shards-react';

import MainNavbar from '#c/components/layout/MainNavbar/MainNavbar';
import MainMobileNavbar from '#c/components/layout/MainNavbar/MainMobileNavbar';
import MainSidebar from '#c/components/layout/MainSidebar/MainSidebar';
import CardSidebar from '#c/components/layout/MainSidebar/CardSidebar';
import StickyCard from '#c/components/layout/StickyCard';
import MainFooter from '#c/components/layout/MainFooter';
import SiteStatus from '#c/components/SiteStatus';
// import useWindowSize from '#c/components/common/useWindowSize';


const Nof = ({children, width, noNavbar, onChange = () => null}) => {
  // console.log(width);
  // let [width2, setWindowSize] = useState(width);
  // useEffect(() => {
  //   console.log('DefaultLayout...', window.innerWidth, width);
  //
  //   function handleResize() {
  //     // Set window width/height to state
  //     console.log('DefaultLayout...', window.innerWidth, width);
  //
  //     if ((width > 1200 && window.innerWidth < 1200) || (width < 1200 && window.innerWidth > 1200)) {
  //
  //       setWindowSize(window.innerWidth);
  //     }
  //
  //   }
  //
  //   // Add event listener
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   // Remove event listener on cleanup
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  console.log('DefaultLayout...', width);
  return (
    [<SiteStatus key={0}/>,
      <Container fluid key={1}>
        <Row>
          {width < 1200 && <MainSidebar {...children.props} />}
          {width > 1199 && <StickyCard {...children.props} />}

          <CardSidebar {...children.props} />

          <Col
            className="main-content p-0"
            lg={{size: 12, offset: 0}}
            md={{size: 12, offset: 0}}
            sm="12"
            tag="main">
            {(!noNavbar && width > 1199) && <MainNavbar onChange={onChange}/>}
            {(!noNavbar && width < 1200) && <MainMobileNavbar onChange={onChange}/>}
            {/*<MainHeader />*/}

            {children}
          </Col>
        </Row>
      </Container>
    ]
  );
};

Nof.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

Nof.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default Nof;
