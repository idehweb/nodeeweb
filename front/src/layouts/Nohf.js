import React from 'react';
import PropTypes from 'prop-types';
import {Col, Container, Row} from 'shards-react';


const Nohf = ({children, width, noNavbar, onChange = () => null}) => {
  // console.log(width);
  // let [width2, setWindowSize] = useState(width);
  // useEffect(() => {
  //   console.log('Nohf...', window.innerWidth, width);
  //
  //   function handleResize() {
  //     // Set window width/height to state
  //     console.log('Nohf...', window.innerWidth, width);
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

  console.log('Nohf...', width);
  return (

    <main>

      <Col
        className="main-content p-0"
        lg={{size: 12, offset: 0}}
        md={{size: 12, offset: 0}}
        sm="12"
        // tag="main"
      >

      {children}
      </Col>
    </main>

  );
};

Nohf.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

Nohf.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default Nohf;
