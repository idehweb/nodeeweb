import React, { useRef, useState,Fragment } from "react";
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
import {MoveIconSvg,EditIconSvg,CloseIconSvg,AddIconSvg} from "./base/Icon";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../functions";
import {CloseRounded} from "@mui/icons-material";
const Component = (props) => {
  console.log('Cooooooooooooooooooooooooooo',props);
  let {
    index,
    component,
    deleteItem,
    changeComponentSetting,
    toggleComponentOptionsBox,
    setSourceAddress,
    toggleOptionBox,
    length,
    address = 0,
    setExcludeArray,
    child,
    setDropElement,
    startDestHnadler
  } = props;
  let { settings = {} } = component;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { text = "" } = fields;
  const [componentForSetting, setComponentForSetting] = useState(false);
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.KNIGHT,
    item: { id:component.id,component:component },
    end: (item, monitor) => {

    },
    collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
    })
  });
const [{ isOver }, dropRef] = useDrop({
  accept: ItemTypes.KNIGHT,
  drop: (item,monitor) =>  startDestHnadler(item.id,setDropElement,component),
  collect: (monitor) => ({
      isOver: !!monitor.isOver()
  })
})
const addToComponent = (dragID,dropID) =>{
  // console.log('FuckU',dropID);
  startDestHnadler(dragID,dropID,component);
}
const dragStart = (e, component) => {

};
  const dragEnter = (e, component) => {

  };
  const onDrop = (c) => {
   
  };
  return (
    <Fragment >
          <div className={"nodeweb-element-wrapper"} >
          
            <div className={index > 2 ? 'mtop-10 element-header' : 'element-header'} >
                <span>Element:&nbsp;&nbsp; {component.name + " " + (index + 1)} CP:{component.id}</span>
            </div>
            <div className={'controller'}>
              <span className={'move'} style={{border:'1px solid #ddd',padding:'1px 3px',cursor:'grab'}} id={component.id}   ref={dragRef} onDragStart={(e)=>dragStart(e,component)}
              draggable="true"
                // draggable
                // onDragStart={(e) => dragStart(e, component)}
                // onDragEnd={(e) => {
                //   console.log('on drop on label:',component.id)
                //   onDrop(component);
                // }}
                // onDragEnter={(e) => dragEnter(e, component)}
              >
                <MoveIconSvg width="15px" height="15px" background="#464D55"/>
              </span>
              <span
              onClick={()=>setComponentForSetting(!componentForSetting)}
              className={'edit'} style={{border:'1px solid #ddd',borderTop:'none',padding:'1px 3px',cursor:'pointer'}}>
                <EditIconSvg width="15px" height="15px" fill="none"  background="#464D55"/>
              </span>
            </div>
            <div className={'content'}>
            {!componentForSetting && <div 
            >

              {component.addable && <div className={"add-part p-2 name-" + component.name}>
                <div className={"element-wrapper-child"}  id={component.id} ref={dropRef} onDrop={(e)=>onDrop(setDropElement)} >
                  {Boolean(component.children && (component.children instanceof Array)) && component.children.map((comp, jj) => {
                    
                    return (<Component
                      key={jj}
                      index={jj}
                      component={comp}
                      childrens={component.children}
                      // moveItem={moveItem}
                      // moveContent={moveContent}
                      setComponentForSetting={setComponentForSetting}
                      toggleComponentOptionsBox={toggleComponentOptionsBox}
                      setExcludeArray={() => setExcludeArray([])}
                      changeComponentSetting={(e, j, d) => changeComponentSetting(e, j, d)}
                      deleteItem={(e) => {
                        setComponentForSetting(false);
                        deleteItem(e);
                      }}
                      toggleOptionBox={toggleOptionBox}
                      length={component.children.length}
                      address={component.id + "_" + jj}
                      child={true}
                      setDropElement={comp && comp.id}
                      startDestHnadler={addToComponent}
                    />);
                  })}
                </div>

              </div>}
              

            </div>}
            {isOver && child && <div  style={{width:'100%',height:'5px',border:'1px solid #ddd',background:'#ddd'}} 
               
               ></div>}
            {/*StartModalSetting*/}
            {componentForSetting && <div  className={"component-set-for-setting"} >
              <div className={"csfs-a"}>
                <div className={"csfs-c"}>
                  <div className={"top-bar-settings"}>
                    {/* <Button
                      className={"redxxx"}
                      onClick={(e) => {
                        e.preventDefault();
                        setComponentForSetting(false);
                        deleteItem(component.id);
                      }}>
                      <DeleteForeverIcon/>{("Delete")}
                    </Button> */}
                    <span style={{cursor:'pointer',color:'#ffffff',height:'40px',lineHeight:'40px',padding:'0px 10px'}}>
                      {component.label}
                    </span>
                    <span style={{cursor:'pointer',color:'#ffffff',height:'40px',lineHeight:'40px',padding:'0px 10px'}}>
                      <CloseRounded  onClick={() => {
                        setComponentForSetting(!componentForSetting);
                        }}/>
                    </span>
                  </div>
                  <div className={"bottom-bar-settings"} >
                    {/*{JSON.stringify(component.settings.general.fields)}*/}
                    {component.settings && component.settings.general && <CreateForm
                      onSubmit={(e) => {
                        changeComponentSetting(component, "general", e);
                        setComponentForSetting(!componentForSetting);
                      }}
                      rules={{ fields: component.settings.general.rules }}
                      buttons={[]}
                      componentType={component.name}
                      childrens={component.children}

                      fields={component.settings.general.fields}/>}
                  </div>
                </div>
              </div>
            </div>}
            </div>
            <div className={'element-footer'}>
          
            <div>
              <span style={{cursor:'pointer'}}
                onClick={(e) => {
                  e.preventDefault();
                  setComponentForSetting(false);
                  deleteItem(component.id);
                }}
              ><CloseIconSvg width="20px" height="20px"  background={'#464D55'}/></span>
              <span style={{margin:'0px 10px',cursor:'pointer'}}
                onClick={()=>setComponentForSetting(!componentForSetting)}
              
              ><EditIconSvg width="15px" height="15px" background={'#464D55'}/></span>
              {
                component.addable && (
                  <span style={{cursor:'pointer'}}
                  onClick={(e) => {
                    let address = component.id + "_";
                    let mainAddress = address.split("_");
                    let update = { sourceAddress: component.id };
                    if (mainAddress[4]) {
                      update["excludeArray"] = ["row"];
                    } else {
                      update["excludeArray"] = [];
                    }
                    toggleOptionBox(update);
                  }}
                  
                  ><AddIconSvg width="15px" height="15px" fill="#464D55"/></span>
                )
              }
            
            </div>
            </div>
          </div>
       
    </Fragment>
  );
};
export default React.memo(Component);