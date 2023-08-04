import React, {useState} from "react";
import {withTranslation} from "react-i18next";
import {dFormat, PriceFormat} from "#c/functions/utils";
import "#c/assets/styles/nodeeweb-page-builder.css";
import {Button} from "shards-react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import CreateForm from "#c/components/form/CreateForm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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

const Component = (props) => {
  let {
    index,
    component,
    moveContent,
    deleteItem,
    changeComponentSetting,
    toggleComponentOptionsBox,
    setSourceAddress,
    toggleOptionBox,
    length,
    address = 0,
    setExcludeArray
  } = props;
  let {settings={}}=component;
  let {general={}}=settings;
  let {fields={}}=general;
  let {text=""}=fields;
  const [componentForSetting, setComponentForSetting] = useState(false);
  const returnArrayOfComponent = (component) => {
    console.log('returnArrayOfComponent');
    let tempArr = [];
    let xx = 1
    if (component.settings && component.settings.general && component.settings.general.fields && component.settings.general.fields.colCount) {
      xx = parseInt(component.settings.general.fields.colCount);
    }
    for (let i = 0; i < xx; i++) {
      tempArr.push({});
      // let index=findItem(component.id);
      // component.children=tempArr;
      // components[index]=component;
      // setComponents(components);
    }
    // } else {
    // tempArr.push({});
    // }
    // console.log('===> response', tempArr)
    return tempArr
  }
  // const handleDelete = (id) => {
  //   console.log('handleDelete...', id)
  //   deleteItem(id);
  //
  //
  // };
  return (
    <div className={'element-wrapper'} id={component.id}>
      {!componentForSetting && <>
        <div className={' component name-'+component.name }>
          <div className={'npb-d-flex ' + (component.addable ? "border-bottom" : '')}>
            <div style={{direction: 'ltr'}}>
              <span className={'component-address'}>{component.name + ' ' + (index+1)}</span>
              {/*<span className={'component-address'}>{component.name + ' ' + (index+1) + ' from ' + length}</span>*/}
              <label className={'component-id'} style={{direction: 'ltr'}}>{'#' + component.id}</label>
              {text && <label className={'component-id'} style={{direction: 'ltr'}}>{JSON.stringify(text)}</label>}

            </div>
            <span className={'npb-settings'}>
                  {Boolean(index) &&
                  <Button onClick={() => moveContent(index, index - 1, address)}><ArrowUpwardIcon/></Button>}
              {!Boolean(index === (length - 1)) &&
              <Button onClick={() => moveContent(index, index + 1, address)}><ArrowDownwardIcon/></Button>}
              <Button onClick={() => {
                console.log('click on options...')
                setComponentForSetting(!componentForSetting);
                // toggleComponentOptionsBox()
              }}><DisplaySettingsIcon/></Button>
                </span>
          </div>
        </div>

        {component.addable && <div className={'add-part name-'+component.name}>

          <div className={'element-wrapper-child'}>
            {Boolean(component.children && (component.children instanceof Array)) && component.children.map((comp, jj) => {

              return (<Component
                key={jj}
                index={jj}
                component={comp}
                moveContent={moveContent}
                setComponentForSetting={setComponentForSetting}
                toggleComponentOptionsBox={toggleComponentOptionsBox}
                setExcludeArray={() => setExcludeArray([])}
                changeComponentSetting={(e, j, d) => changeComponentSetting(e, j, d)}
                deleteItem={(e)=>{
                  // e.preventDefault();
                  console.log('delete Item e',e)
                  setComponentForSetting(false)
                  deleteItem(e)}}

                // setSourceAddress={()=>{
                //   let address = component.id + "_" + index2;
                //   console.log('component.id', address)
                //
                //   setSourceAddress(address)
                // }}
                toggleOptionBox={toggleOptionBox}
                length={component.children.length}
                address={component.id + "_" + jj}
              />)
            })
            }
            <div className={'add-component element'} onClick={(e) => {
              // console.clear();
              // let address = component.id + "_" + index2;
              let address = component.id + "_";
              // console.log('component.id', address)
              let mainAddress = address.split('_');
              // let update = {sourceAddress: address};
              // console.log('component.id', component.id, index2)

              let update = {sourceAddress: component.id};
              if (mainAddress[4]) {
                console.log('setExclude')
                update['excludeArray'] = ['row']
              } else {
                update['excludeArray'] = []

              }
              // setSourceAddress(address);
              console.log('open toggle with:', update);
              // setExcludeArray([]);

              toggleOptionBox(update)
            }}>
              <AddIcon/>
            </div>
          </div>
        </div>}
      </>}
      {componentForSetting && <>
        <div className={'top-bar-settings'}>
          <Button onClick={() => {
            console.log('click on options...');
            setComponentForSetting(!componentForSetting);
            // toggleComponentOptionsBox()
          }}><DisplaySettingsIcon/></Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              console.log('delete Item',component.id)
              setComponentForSetting(false)
              deleteItem(component.id)
            }}>
            <DeleteForeverIcon/>
          </Button>
        </div>
      <div className={'bottom-bar-settings'}>
        {component.settings && component.settings.general && <CreateForm
          onSubmit={(e) => {
            console.log('on submit', e)
            changeComponentSetting(component, 'general', e);
          }}
          rules={{fields: component.settings.general.rules}}
          buttons={[]}
          fields={component.settings.general.fields}/>}
      </div>
      </>}

    </div>

  );
};
export const PageServer = [
  {}
];
export default withTranslation()(Component);
