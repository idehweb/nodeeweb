import React, { useRef, useState } from "react";
// import {withTranslation} from "react-i18next";
import { dFormat, PriceFormat } from "@/functions/utils";
// import "@/assets/styles/nodeeweb-page-builder.css";
import { Button } from "shards-react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import CreateForm from "@/components/form/CreateForm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
// import { useDrag } from 'react-dnd'
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
  savePost
} from "@/functions/index";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../functions";
// import {SnapChatIcon} from "@/assets/index";

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
    moveItem,
    length,
    address = 0,
    setExcludeArray
  } = props;
  let { settings = {} } = component;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { text = "" } = fields;
  let [dragElement, setDragElement] = useState(null);
  let [enterElement, setEnterElement] = useState(null);
  const [componentForSetting, setComponentForSetting] = useState(false);

  const returnArrayOfComponent = (component) => {
    console.log("returnArrayOfComponent");
    let tempArr = [];
    let xx = 1;
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
    return tempArr;
  };
  // const handleDelete = (id) => {
  //   console.log('handleDelete...', id)
  //   deleteItem(id);
  //
  //
  // };
  const dragItem = useRef();
  const dragOverItem = useRef();
  // const [collected, drag, dragPreview] = useDrag(() => ({
  //   type,
  //   item: { id }
  // }))
  const dragStart = (e, component) => {
    // dragItem.current = position;
    if (dragElement == null) {
      dragElement = component.id;
      console.log("dragStart: ", component.id);
      setDragElement(component.id);
    }
  };
  const dragEnter = (e, component) => {
    console.log("dragEnter: ", component.id);
    setEnterElement(component.id);
  };
  const onDrop = (e) => {
    // if (dragElement && e.id) {
    console.log("drop on id => dragElement:", dragElement, "     enterElement:", enterElement, "       this.id:", e.id);
    setDragElement(null);
    setEnterElement(null);

    // }
  };
  const [{ isOver, canDrop }, drop] = useDrop(
    {
      accept: ItemTypes.KNIGHT,
      drop: (item, monitor) => {
        // console.log("item:", item, "monitor:", monitor.getItem());
        return ({ id: component.id });
      },
      // canDrop: () => canMoveKnight(x, y),
      collect: (monitor) => {
        // console.log('props',props)
        return ({
          isOver: !!monitor.isOver()
          // canDrop: !!monitor.canDrop()
        });
      }
    });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    item: { id: component.id },
    end: (item, monitor) => {
      let res = monitor.getDropResult();
      moveItem(item.id, res.id);
      console.log("end item:", item.id, res.id);
    },
    collect: (monitor) => {
      // console.log('monitor',monitor)
      return ({
        isDragging: !!monitor.isDragging()
      });
    }
  }));
  return (
    <div
      className={"element-wrapper"} id={component.id} ref={drag}>
      {/*{component.id==enterElement && <div className={component.id==enterElement ? "active" : ''}*/}
      {/*onDragEnter={(e) => dragEnter(e, component)}*/}
      {/*>*/}
      {/*{component.id}*/}
      {/*{enterElement}*/}
      {/*</div>}*/}
      {!componentForSetting && <div


        // onDragEnd={(e) => {
        //   console.log('on drop main',component.id)
        //   onDrop(component);
        // }}
      >
        <div className={" component name-" + component.name}>
          <div className={"npb-d-flex " + (component.addable ? "border-bottom" : "")}>
            <div style={{ direction: "ltr" }}>
              <span className={"component-address"}>{component.name + " " + (index + 1)}</span>
              {/*<span className={'component-address'}>{component.name + ' ' + (index+1) + ' from ' + length}</span>*/}
              <label
                // draggable
                // onDragStart={(e) => dragStart(e, component)}
                // onDragEnd={(e) => {
                //   console.log('on drop on label:',component.id)
                //
                //   onDrop(component);
                // }}
                // onDragEnter={(e) => dragEnter(e, component)}

                className={"component-id"} style={{ direction: "ltr" }}>{"#" + component.id}</label>
              {text && <label className={"component-id"} style={{ direction: "ltr" }}>{JSON.stringify(text)}</label>}

            </div>
            <span className={"npb-settings"}>
                  {Boolean(index) &&
                  <Button className={"only-border"}
                          onClick={() => moveContent(index, index - 1, address)}><ArrowUpwardIcon/></Button>}
              {!Boolean(index === (length - 1)) &&
              <Button className={"only-border"}
                      onClick={() => moveContent(index, index + 1, address)}><ArrowDownwardIcon/></Button>}
              <Button onClick={() => {
                console.log("click on options...");
                setComponentForSetting(!componentForSetting);
                // toggleComponentOptionsBox()
              }}><DisplaySettingsIcon/></Button>
                </span>
          </div>
        </div>

        {component.addable && <div className={"add-part name-" + component.name}>

          <div className={"element-wrapper-child"}>
            {Boolean(component.children && (component.children instanceof Array)) && component.children.map((comp, jj) => {

              return (<Component
                key={jj}
                index={jj}
                component={comp}
                moveItem={moveItem}
                moveContent={moveContent}
                setComponentForSetting={setComponentForSetting}
                toggleComponentOptionsBox={toggleComponentOptionsBox}
                setExcludeArray={() => setExcludeArray([])}
                changeComponentSetting={(e, j, d) => changeComponentSetting(e, j, d)}
                deleteItem={(e) => {
                  // e.preventDefault();
                  console.log("delete Item e", e);
                  setComponentForSetting(false);
                  deleteItem(e);
                }}

                // setSourceAddress={()=>{
                //   let address = component.id + "_" + index2;
                //   console.log('component.id', address)
                //
                //   setSourceAddress(address)
                // }}
                toggleOptionBox={toggleOptionBox}
                length={component.children.length}
                address={component.id + "_" + jj}
              />);
            })
            }
            <div
              ref={drop} className={"add-component element " + (isOver ? "hover" : "")}
              // className={"add-component element"}
              // onDragEnter={(e) => dragEnter(e, component)}
              // onDragEnd={(e) => {
              //   console.log('on drop in child of parent',component.id)
              //
              //   onDrop(component);
              // }}
              onClick={(e) => {
                // console.clear();
                // let address = component.id + "_" + index2;
                let address = component.id + "_";
                // console.log('component.id', address)
                let mainAddress = address.split("_");
                // let update = {sourceAddress: address};
                // console.log('component.id', component.id, index2)

                let update = { sourceAddress: component.id };
                if (mainAddress[4]) {
                  console.log("setExclude");
                  update["excludeArray"] = ["row"];
                } else {
                  update["excludeArray"] = [];

                }
                // setSourceAddress(address);
                console.log("open toggle with:", update);
                // setExcludeArray([]);

                toggleOptionBox(update);
              }}>
              <AddIcon/>
            </div>
          </div>
        </div>}
      </div>}
      {componentForSetting && <div draggable={false} className={"component-set-for-setting"}>
        <div className={"csfs-a"}>
          <div className={"csfs-c"}>
            <div className={"top-bar-settings"}>
              <Button className={"closeIcon"} onClick={() => {
                console.log("click on options...");
                setComponentForSetting(!componentForSetting);
                // toggleComponentOptionsBox()
              }}><CloseIcon/></Button>
              <Button
                className={"redxxx"}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("delete Item", component.id);
                  setComponentForSetting(false);
                  deleteItem(component.id);
                }}>
                <DeleteForeverIcon/>{("Delete")}
              </Button>
            </div>
            <div className={"bottom-bar-settings"}>
              {/*{JSON.stringify(component.settings.general.fields)}*/}
              {component.settings && component.settings.general && <CreateForm
                onSubmit={(e) => {
                  console.log("on submit", e);
                  changeComponentSetting(component, "general", e);
                  setComponentForSetting(!componentForSetting);

                }}
                rules={{ fields: component.settings.general.rules }}
                buttons={[]}

                fields={component.settings.general.fields}/>}
            </div>
          </div>

        </div>
        <div className={"csfs-b"}>
          {/*<Button>*/}
          {/*<div className="buttons absolute-bottom textAlignCenter">*/}
          {/*<Button type="submit" onClick={(e)=>{*/}
          {/*console.log("on submit", e);*/}
          {/*changeComponentSetting(component, "general", e);*/}
          {/*setComponentForSetting(!componentForSetting);*/}

          {/*}*/}
          {/*}>*/}
          {/*{("Submit")}*/}
          {/*</Button>*/}
          {/*</div>*/}
          {/*</Button>*/}
        </div>
      </div>}

    </div>

  );
};
export const PageServer = [
  {}
];
export default (Component);
import React, { useRef, useState } from "react";
// import {withTranslation} from "react-i18next";
import { dFormat, PriceFormat } from "@/functions/utils";
// import "@/assets/styles/nodeeweb-page-builder.css";
import { Button } from "shards-react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import CreateForm from "@/components/form/CreateForm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
// import { useDrag } from 'react-dnd'
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
  savePost
} from "@/functions/index";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../functions";
// import {SnapChatIcon} from "@/assets/index";

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
    moveItem,
    length,
    address = 0,
    setExcludeArray
  } = props;
  let { settings = {} } = component;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { text = "" } = fields;
  let [dragElement, setDragElement] = useState(null);
  let [enterElement, setEnterElement] = useState(null);
  const [componentForSetting, setComponentForSetting] = useState(false);

  const returnArrayOfComponent = (component) => {
    console.log("returnArrayOfComponent");
    let tempArr = [];
    let xx = 1;
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
    return tempArr;
  };
  // const handleDelete = (id) => {
  //   console.log('handleDelete...', id)
  //   deleteItem(id);
  //
  //
  // };
  const dragItem = useRef();
  const dragOverItem = useRef();
  // const [collected, drag, dragPreview] = useDrag(() => ({
  //   type,
  //   item: { id }
  // }))
  const dragStart = (e, component) => {
    // dragItem.current = position;
    if (dragElement == null) {
      dragElement = component.id;
      console.log("dragStart: ", component.id);
      setDragElement(component.id);
    }
  };
  const dragEnter = (e, component) => {
    console.log("dragEnter: ", component.id);
    setEnterElement(component.id);
  };
  const onDrop = (e) => {
    // if (dragElement && e.id) {
    console.log("drop on id => dragElement:", dragElement, "     enterElement:", enterElement, "       this.id:", e.id);
    setDragElement(null);
    setEnterElement(null);

    // }
  };
  const [{ isOver, canDrop }, drop] = useDrop(
    {
      accept: ItemTypes.KNIGHT,
      drop: (item, monitor) => {
        // console.log("item:", item, "monitor:", monitor.getItem());
        return ({ id: component.id });
      },
      // canDrop: () => canMoveKnight(x, y),
      collect: (monitor) => {
        // console.log('props',props)
        return ({
          isOver: !!monitor.isOver()
          // canDrop: !!monitor.canDrop()
        });
      }
    });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    item: { id: component.id },
    end: (item, monitor) => {
      let res = monitor.getDropResult();
      moveItem(item.id, res.id);
      console.log("end item:", item.id, res.id);
    },
    collect: (monitor) => {
      // console.log('monitor',monitor)
      return ({
        isDragging: !!monitor.isDragging()
      });
    }
  }));
  return (
    <div
      className={"element-wrapper"} id={component.id} ref={drag}>
      {/*{component.id==enterElement && <div className={component.id==enterElement ? "active" : ''}*/}
      {/*onDragEnter={(e) => dragEnter(e, component)}*/}
      {/*>*/}
      {/*{component.id}*/}
      {/*{enterElement}*/}
      {/*</div>}*/}
      {!componentForSetting && <div


        // onDragEnd={(e) => {
        //   console.log('on drop main',component.id)
        //   onDrop(component);
        // }}
      >
        <div className={" component name-" + component.name}>
          <div className={"npb-d-flex " + (component.addable ? "border-bottom" : "")}>
            <div style={{ direction: "ltr" }}>
              <span className={"component-address"}>{component.name + " " + (index + 1)}</span>
              {/*<span className={'component-address'}>{component.name + ' ' + (index+1) + ' from ' + length}</span>*/}
              <label
                // draggable
                // onDragStart={(e) => dragStart(e, component)}
                // onDragEnd={(e) => {
                //   console.log('on drop on label:',component.id)
                //
                //   onDrop(component);
                // }}
                // onDragEnter={(e) => dragEnter(e, component)}

                className={"component-id"} style={{ direction: "ltr" }}>{"#" + component.id}</label>
              {text && <label className={"component-id"} style={{ direction: "ltr" }}>{JSON.stringify(text)}</label>}

            </div>
            <span className={"npb-settings"}>
                  {Boolean(index) &&
                  <Button className={"only-border"}
                          onClick={() => moveContent(index, index - 1, address)}><ArrowUpwardIcon/></Button>}
              {!Boolean(index === (length - 1)) &&
              <Button className={"only-border"}
                      onClick={() => moveContent(index, index + 1, address)}><ArrowDownwardIcon/></Button>}
              <Button onClick={() => {
                console.log("click on options...");
                setComponentForSetting(!componentForSetting);
                // toggleComponentOptionsBox()
              }}><DisplaySettingsIcon/></Button>
                </span>
          </div>
        </div>

        {component.addable && <div className={"add-part name-" + component.name}>

          <div className={"element-wrapper-child"}>
            {Boolean(component.children && (component.children instanceof Array)) && component.children.map((comp, jj) => {

              return (<Component
                key={jj}
                index={jj}
                component={comp}
                moveItem={moveItem}
                moveContent={moveContent}
                setComponentForSetting={setComponentForSetting}
                toggleComponentOptionsBox={toggleComponentOptionsBox}
                setExcludeArray={() => setExcludeArray([])}
                changeComponentSetting={(e, j, d) => changeComponentSetting(e, j, d)}
                deleteItem={(e) => {
                  // e.preventDefault();
                  console.log("delete Item e", e);
                  setComponentForSetting(false);
                  deleteItem(e);
                }}

                // setSourceAddress={()=>{
                //   let address = component.id + "_" + index2;
                //   console.log('component.id', address)
                //
                //   setSourceAddress(address)
                // }}
                toggleOptionBox={toggleOptionBox}
                length={component.children.length}
                address={component.id + "_" + jj}
              />);
            })
            }
            <div
              ref={drop} className={"add-component element " + (isOver ? "hover" : "")}
              // className={"add-component element"}
              // onDragEnter={(e) => dragEnter(e, component)}
              // onDragEnd={(e) => {
              //   console.log('on drop in child of parent',component.id)
              //
              //   onDrop(component);
              // }}
              onClick={(e) => {
                // console.clear();
                // let address = component.id + "_" + index2;
                let address = component.id + "_";
                // console.log('component.id', address)
                let mainAddress = address.split("_");
                // let update = {sourceAddress: address};
                // console.log('component.id', component.id, index2)

                let update = { sourceAddress: component.id };
                if (mainAddress[4]) {
                  console.log("setExclude");
                  update["excludeArray"] = ["row"];
                } else {
                  update["excludeArray"] = [];

                }
                // setSourceAddress(address);
                console.log("open toggle with:", update);
                // setExcludeArray([]);

                toggleOptionBox(update);
              }}>
              <AddIcon/>
            </div>
          </div>
        </div>}
      </div>}
      {componentForSetting && <div draggable={false} className={"component-set-for-setting"}>
        <div className={"csfs-a"}>
          <div className={"csfs-c"}>
            <div className={"top-bar-settings"}>
              <Button className={"closeIcon"} onClick={() => {
                console.log("click on options...");
                setComponentForSetting(!componentForSetting);
                // toggleComponentOptionsBox()
              }}><CloseIcon/></Button>
              <Button
                className={"redxxx"}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("delete Item", component.id);
                  setComponentForSetting(false);
                  deleteItem(component.id);
                }}>
                <DeleteForeverIcon/>{("Delete")}
              </Button>
            </div>
            <div className={"bottom-bar-settings"}>
              {/*{JSON.stringify(component.settings.general.fields)}*/}
              {component.settings && component.settings.general && <CreateForm
                onSubmit={(e) => {
                  console.log("on submit", e);
                  changeComponentSetting(component, "general", e);
                  setComponentForSetting(!componentForSetting);

                }}
                rules={{ fields: component.settings.general.rules }}
                buttons={[]}

                fields={component.settings.general.fields}/>}
            </div>
          </div>

        </div>
        <div className={"csfs-b"}>
          {/*<Button>*/}
          {/*<div className="buttons absolute-bottom textAlignCenter">*/}
          {/*<Button type="submit" onClick={(e)=>{*/}
          {/*console.log("on submit", e);*/}
          {/*changeComponentSetting(component, "general", e);*/}
          {/*setComponentForSetting(!componentForSetting);*/}

          {/*}*/}
          {/*}>*/}
          {/*{("Submit")}*/}
          {/*</Button>*/}
          {/*</div>*/}
          {/*</Button>*/}
        </div>
      </div>}

    </div>

  );
};
export const PageServer = [
  {}
];
export default (Component);