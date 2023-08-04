import React, { useState,useEffect } from "react";
import { MainUrl,SaveData } from "#c/functions/index";
import { Button, ButtonGroup, Col, FormSelect, InputGroup, InputGroupAddon, InputGroupText, Row } from "shards-react";
import { withTranslation } from "react-i18next";
import SortIcon from "@mui/icons-material/Sort";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import { useSelector } from "react-redux";
const Sort = (params) => {
  let { t } = params;
  const postCardMode = useSelector((st) => st.store.postCardMode);
  const defaultSort = useSelector((st) => st.store.defaultSort);
  const [gridMode, setGridMode] = useState(postCardMode || "grid");
  const [sortBy, setSortBy] = useState(defaultSort || "mostviewd");
  useEffect(()=>{
    console.log('sortBy changed to: ',sortBy);
    SaveData({
      defaultSort:sortBy
    })
  },[sortBy]);

  useEffect(()=>{
    console.log('gridMode changed to: ',gridMode);
    SaveData({
      postCardMode:gridMode
    })
  },[gridMode]);
  return (
    <Row className={"p-2 pb-0 mt-1"}>

      <Col
        className={"select-col MGD mr-0 pr-xs-0"}
        xs={6}
        sm={5}
        md={4}
        lg={4}>
        <InputGroup>
          <InputGroupAddon type="append">
            <InputGroupText>
              <label><SortIcon/><span className={"mr-2 d-xs-none"}>{t("Sort")}</span></label>
            </InputGroupText>
          </InputGroupAddon>
          <FormSelect
            inline={"true"}
            className={"select-filter"}
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              console.log(sortBy);
            }}>
            <option value="mostviewd" >{t("Most Viewed")}</option>
            <option value="mostsales" >{t("Most Sales")}</option>
            <option value="themostexpensive" >{t("The most expensive")}</option>
            <option value="thecheapest" >{t("The cheapest")}</option>
            <option value="datedesc" >{t("Date - DESC")}</option>
            <option value="dateasc" >{t("Date - ASC")}</option>
            <option value="popularlike" >{t("Popular - Like")}</option>
            <option value="rateasc" >{t("Rate - ASC")}</option>
          </FormSelect>

        </InputGroup>

      </Col>

      <Col
        className={"text-left"}
        xs={6}
        sm={7}
        md={8}
        lg={8}>
        <ButtonGroup>
          <Button outline={gridMode !== "grid"} onClick={()=>setGridMode("grid")}>
            <GridOnRoundedIcon/>
          </Button>
          <Button outline={gridMode !== "list"} onClick={()=>setGridMode("list")}>
            <ViewListRoundedIcon/>
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default withTranslation()(Sort);
