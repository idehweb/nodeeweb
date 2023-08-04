import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {dFormat, PriceFormat} from "#c/functions/utils";
import CustomModal from "#c/components/Modal";
import "#c/assets/styles/nodeeweb-page-builder.css";
import {Button, Card, Nav, NavItem, NavLink} from "shards-react";
import SettingsIcon from "@mui/icons-material/Settings";
import BrushIcon from "@mui/icons-material/Brush";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CreateForm from "#c/components/form/CreateForm";

import {
  addBookmark,
  clearPost,
  getBlogPost,
  GetBuilder,
  isClient,
  loadPost,
  loveIt,
  MainUrl,
  SaveBuilder,
  savePost,
} from "#c/functions/index";
import {SnapChatIcon} from "#c/assets/index";

const ComponentOptionBox = (props) => {
  const [tab, setTab] = useState("general");
  let {onClose, open, changeComponentSetting, componentForSetting, deleteItem, t} = props;
 console.log('componentForSetting',componentForSetting)
  const [theComponentForSetting, setTheComponentForSetting] = useState(componentForSetting);
  useEffect(() => {
    console.log('useEffect');
    if (componentForSetting.id != theComponentForSetting.id) {
      setTheComponentForSetting(componentForSetting)
    }
  }, [componentForSetting]);
  const {settings = {}, name} = theComponentForSetting;
  const {content = false, general = [], design = []} = settings;
  console.log('theComponentForSetting', theComponentForSetting)

  const handleDelete = (id) => {
    console.log('handleDelete...', id)
    deleteItem(id);
    onClose()


  };
  const handleCancel = (e) => {
    e.preventDefault();
    closeOptions(e)
  };
  const handleSubmit = (e) => {
    console.log('e',e);
    // e.preventDefault();
    // let theCom=componentForSetting;
    // theCom['settings']['general'] = e;
    // console.log('hi');
    // setTheComponentForSetting(theCom);
    changeComponentSetting('general',e);
  };

  const closeOptions = (e) => {
    setTab("general");
    onClose()
  };
  console.log('general', general)
  // if(!componentForSetting.key){
  //   return <></>
  // }
  let g=general;
  return (

    <CustomModal onClose={(e) => {
      closeOptions(e)
    }} open={open} className={'width50vw  kiuytgfhjuyt modal'}
                 title={componentForSetting.id}>
      <Nav justified={true} tabs={true} className={"post-product-nav"}>
        <NavItem>
          <NavLink active={tab === "general"} href="#general"
                   onClick={() => setTab("general")}><SettingsIcon/></NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={tab === "design"} href="#design"
                   onClick={() => setTab("design")}><BrushIcon/></NavLink>
        </NavItem>
        {content && <NavItem>
          <NavLink active={tab === "content"} href="#content"
                   onClick={() => setTab("content")}><TextFieldsIcon/></NavLink>
        </NavItem>}
        <NavItem>
          <NavLink active={tab === "delete"} href="#delete"
                   onClick={() => setTab("delete")}><DeleteForeverIcon/></NavLink>
        </NavItem>
      </Nav>
      <div className={'npb-componentForSetting-settings'}>
        {tab === "general" && <div className={'p-3'}>
          <CreateForm
          onSubmit={(e) => {
            handleSubmit(e)
          }}
          rules={{fields: g}}
          buttons={[]}
          fields={g}/></div>}
        {tab === "design" && <div>design</div>}
        {tab === "content" && <div>content</div>}
        {tab === "delete" && <Card small className={'p-3 npb-d-flex'}>

          <label className="mb-3">{t("Are you sure to delete?")}</label>


          <Button
            block
            type="submit"
            className="center"
            onClick={() => handleDelete(componentForSetting.id)}>
            {t("Yes")}
          </Button>
          <Button
            block
            type="submit"
            className="center"
            onClick={() => handleCancel()}>
            {t("Cancel")}
          </Button>
        </Card>}
      </div>
    </CustomModal>

  );
};
export const PageServer = [
  {}
];
export default withTranslation()(ComponentOptionBox);
