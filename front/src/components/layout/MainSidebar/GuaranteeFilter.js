import React, { useState } from "react";
import { Col, Nav, NavItem } from "shards-react";
import { withTranslation } from "react-i18next";
import { savePost, toggleSidebar } from "#c/functions/index";
import { store } from "#c/functions/store";
import { setAttrValue } from "#c/functions/index";
import { Link } from "react-router-dom";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const GuaranteeFilter = ({ t }) => {
  let [guarantee, setGuarantee] = useState(null);
  const setValue = (y, value) => {
    setAttrValue({ attr: "guarantee", value: value });
    setGuarantee(y);
  };
  const isEnable = (x) => {
    if (guarantee === x)
      return "active";
  };
  return (
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column sizeless sideattributes p-2">
        <NavItem>
          <Col sm={12} lg={12} className={"p-1"}>
            <Link className={"filter-en " + isEnable("g1")}
                  to={"?attr=guarantee&value=guarantee-of-authenticity-and-physical-health"} onClick={() => {
              setValue("g1", "guarantee-of-authenticity-and-physical-health");
            }}>
              <RadioButtonUncheckedIcon className={"ml-2 radio-off"}/>
              <RadioButtonCheckedIcon className={"ml-2 radio-on"}/>
              {t("Guarantee of authenticity and physical health")}
            </Link>
          </Col>
          <Col sm={12} lg={12} className={"p-1"}>
            <Link className={"filter-en " + isEnable("g2")} to={"?attr=guarantee&value=green-guarantee"}
                  onClick={() => {
                    setValue("g2", "green-guarantee");
                  }}>
              <RadioButtonUncheckedIcon className={"ml-2 radio-off"}/>
              <RadioButtonCheckedIcon className={"ml-2 radio-on"}/>
              {t("Green guarantee")}
            </Link>
          </Col>
          <Col sm={12} lg={12} className={"p-1"}>
            <Link className={"filter-en " + isEnable("g3")} to={"?attr=guarantee&value=gold-guarantee"}
                  onClick={() => {
                    setValue("g3", "gold-guarantee");
                  }}>
              <RadioButtonUncheckedIcon className={"ml-2 radio-off"}/>
              <RadioButtonCheckedIcon className={"ml-2 radio-on"}/>
              {t("Gold guarantee")}
            </Link>
          </Col>
        </NavItem>

      </Nav>
    </div>
  );
};

export default withTranslation()(GuaranteeFilter);
