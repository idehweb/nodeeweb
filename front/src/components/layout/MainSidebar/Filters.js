import React, { useState } from "react";
import { Col, Nav, NavItem } from "shards-react";
import { withTranslation } from "react-i18next";
import { savePost, toggleSidebar } from "#c/functions/index";
import { store } from "#c/functions/store";
import { Link } from "react-router-dom";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const Filters = ({ t }) => {

  let [brand, setBrand] = useState(null);
  // console.log("brand", brand);
  const isEnable = (x) => {
    if (brand === x)
      return "active";
  };
  return (
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column sizeless sideattributes p-2">
        <NavItem>
          <Col sm={12} lg={12} className={"p-1"}>
            <Link className={"filter-en " + isEnable("g1")}
                  to={"?attr=brand&value=apple"} onClick={() => {
              setBrand("g1");
            }}>
              <RadioButtonUncheckedIcon className={"ml-2 radio-off"}/>
              <RadioButtonCheckedIcon className={"ml-2 radio-on"}/>
              {t("apple")}
            </Link>
          </Col>
          <Col sm={12} lg={12} className={"p-1"}>
            <Link className={"filter-en " + isEnable("g2")}
                  to={"?attr=brand&value=microsoft"} onClick={() => {
              setBrand("g2");
            }}>
              <RadioButtonUncheckedIcon className={"ml-2 radio-off"}/>
              <RadioButtonCheckedIcon className={"ml-2 radio-on"}/>
              {t("microsoft")}
            </Link>
          </Col>
        </NavItem>

      </Nav>
    </div>
  );
};

export default withTranslation()(Filters);
