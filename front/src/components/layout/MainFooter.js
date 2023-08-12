import React from "react";
import PropTypes from "prop-types";
import {Button, Col, Container, Nav, NavItem, NavLink, Row} from "shards-react";
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";
import {enamadImg, etehadImg, etmeImg, payImg, spriteImg} from "#c/assets/index";
import InfoIcon from '@mui/icons-material/Info';
import CopyrightIcon from '@mui/icons-material/Copyright';
import HelpIcon from '@mui/icons-material/Help';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import MapIcon from '@mui/icons-material/Map';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import RoomIcon from '@mui/icons-material/Room';
import LinkIcon from '@mui/icons-material/Link';
import {isClient,} from "#c/functions/index";

const MainFooter = ({contained, menuItems, menuItems2, menuItems3, copyright, t}) => (
    <footer className="main-footer p-2 px-3 border-top">
        <Container fluid={contained}>
            <Row>
                <Col lg={3} md={3} sm={6} xs={12}>
                    <Nav className={"footer-vab"}>
                        {menuItems.map((item, idx) => (
                            <NavItem key={idx}>
                                {item.to && (
                                    <NavLink tag={Link} to={item.to}>
                                        {item.icon}
                                        <span>{t(item.title)}</span>

                                    </NavLink>
                                )}
                                {item.link && (
                                    <a className="nav-link" href={item.link} target={"_blank"}>
                                        {item.icon}


                                        <span>{t(item.title)}</span>

                                    </a>
                                )}
                                {item.action && (
                                    <Button outline size="sm" theme="primary" onClick={item.action}>
                                        {item.icon}


                                        <span>{t(item.title)}</span>

                                    </Button>
                                )}
                            </NavItem>
                        ))}
                    </Nav>
                </Col>
                <Col lg={3} md={3} sm={6} xs={12}>
                    <Nav className={"footer-vab"}>
                        {menuItems3.map((item, idx) => (
                            <NavItem key={idx}>
                                {item.to && (
                                    <NavLink tag={Link} to={item.to}>
                                        {item.icon}

                                        <span>{t(item.title)}</span>
                                    </NavLink>
                                )}
                                {item.link && (
                                    <a className="nav-link" href={item.link} target={"_blank"}>
                                        {item.icon}

                                        <span style={item.style}>{t(item.title)}</span>

                                    </a>
                                )}
                                {item.action && (
                                    <Button outline size="sm" theme="primary" onClick={item.action}>
                                        {item.icon}

                                        <span>{t(item.title)}</span>

                                    </Button>
                                )}
                            </NavItem>
                        ))}
                    </Nav>

                </Col>
                <Col lg={3} md={3} sm={6} xs={12}>
                    <Nav className={"footer-vab"}>
                        {menuItems2.map((item, idx) => (
                            <NavItem key={idx}>
                                {item.to && (
                                    <NavLink tag={Link} to={item.to}>
                                        {item.icon}

                                        <span>{t(item.title)}</span>
                                    </NavLink>
                                )}
                                {item.link && (
                                    <a className="nav-link" href={item.link} target={"_blank"}>
                                        {item.icon}

                                        <span style={item.style}>{t(item.title)}</span>

                                    </a>
                                )}
                                {item.action && (
                                    <Button outline size="sm" theme="primary" onClick={item.action}>
                                        {item.icon}

                                        <span>{t(item.title)}</span>

                                    </Button>
                                )}
                            </NavItem>
                        ))}
                    </Nav>

                </Col>

                <Col lg={3} md={3} sm={6} xs={12}>

                </Col>

            </Row>
            <Row>
                <hr/>
            </Row>
            <Row>
                <Col lg={6} md={6} sm={6} xs={12}>

                </Col>
                <Col lg={6} md={6} sm={6} xs={12} style={{textAlign: "left"}}>
          <span>
            <span style={{fontSize: "13px"}}>پشتیبانی توسط</span>
            <a rel={"nofollow"} href={"https://idehweb.com/"} target={"_blank"} style={{marginRight: "10px"}}><img
                style={{width: "20px"}}
                src={spriteImg}/></a></span>
                </Col>
            </Row>
        </Container>
    </footer>
);

MainFooter.propTypes = {
    /**
     * Whether the content is contained, or not.
     */
    contained: PropTypes.bool,
    /**
     * The menu items araray.
     */
    menuItems: PropTypes.array,
    /**
     * The copyright info.
     */
    copyright: PropTypes.string
};

MainFooter.defaultProps = {
    contained: false,
    copyright: "",
    menuItems: [


        {
            title: "درباره ما",
            link: "/about-us/",
            icon: <InfoIcon/>
        },
        {
            title: "سوالات متداول",
            link: "/qa",
            icon: <HelpIcon/>

        },
        {
            title: "حفظ حریم شخصی",
            link: "/privacy-policy/",
            icon: <PrivacyTipIcon/>

        },
        {
            title: "آدرس، ارتباط با ما",
            link: "/contact-us/",
            icon: <MapIcon/>

        }
    ],
    menuItems2: [


        {
            title: "info@rfgrr.shop",
            link: "mailto:info@rgrgrfg.shop",
            icon: <AlternateEmailIcon/>

        },

        {
            title: "+98(912)3979",
            link: "tel:+9891299",
            icon: <PhoneIphoneIcon/>,
            style: {direction: "ltr", display: "inline-block"}

        },
        {
            title: "+98(21)2675 ",
            link: "tel:+9856296",
            icon: <PhoneEnabledIcon/>,
            style: {direction: "ltr", display: "inline-block"}


        },
        {
            title: "ته",
            link: "#",
            icon: <RoomIcon/>,
            style: {lineHieght: "20px"}


        }
    ],
    menuItems3: [


        {
            title: "نحوه خرید",
            link: "/how-to-buy",
            icon: <LinkIcon/>

        }, {
            title: "نحوه بازگشت پول",
            link: "/how-to-return-money/",
            icon: <LinkIcon/>

        }, {
            title: "پشتیبانی از",
            link: "/support-from/",
            icon: <LinkIcon/>

        }
    ]

};

export default withTranslation()(MainFooter);
