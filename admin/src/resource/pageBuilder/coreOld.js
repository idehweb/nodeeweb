import React, { useEffect, useState } from "react";
import { dFormat } from "./../../functions/utils";
import { Button } from "shards-react";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
// import _ from "lodash";
import { useDispatch } from "react-redux";
import OptionBox from "./../../components/page-builder/OptionBox";
import Component from "./../../components/page-builder/Component";
// import ComponentOptionBox from "#c/components/page-builder/ComponentOptionBox";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "./../../assets/shards-dashboards.1.1.0.min.css";
import "./../../assets/globalforpagebuilder.css";
import "./../../assets/nodeeweb-page-builder.css";
import * as _ from "lodash";
import { DndProvider, useDrag ,useDrop} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { showNotification, useForm, useNotify, useTranslate } from "react-admin";
import {
  addBookmark,
  changeThemeData,
  changeThemeDataFunc,
  clearPost,
  getBlogPost,
  GetBuilder,
  isClient,
  ItemTypes,
  loadPost,
  loveIt,
  SaveBuilder,
  savePost
} from "./../../functions/index";
import DefaultOptions from "./../../components/page-builder/DefaultOptions";
import update from "immutability-helper";
// import {useDispatch, useSelector, useStore} from 'react-redux'

// import {toast} from "react-toastify";
// import store from "../functions/store";

const Core = (props) => {
  // const translate = useTranslate();

  const [c, setC] = useState(0);
  const [data, setData] = useState({});
  const [lan, setLan] = "fa";
  const notify = useNotify();
  const translate = useTranslate();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    components: [],
    optionBox: false,
    excludeArray: [],
    sourceAddress: "new",
    componentForSetting: {},
    componentOptionsBox: false
  });
  const { components, optionBox, excludeArray, sourceAddress, componentForSetting, componentOptionsBox } = state;
  const params = useParams();
  let _id = params._id || null;
  let model = params.model || "page";
  const load = (options = {}) => {

    if (_id) {
      changeThemeDataFunc().then(e => {
        dispatch(changeThemeData(e));
      });
      GetBuilder(model, _id).then(async r => {
        if (r) {
          setData(r);
        }
        if (r && r.elements) {
          setC(r.elements.length);
          setState({ ...state, components: r.elements });
          return (r.elements);
        }
      });
    }
  };
  const save = (options = {}) => {
    console.log('save Input');
    SaveBuilder(model, _id, { elements: components }).then(r => {
      if (r._id)
        notify(translate("saved successfully."), {
          type: "success"
        });
    }).catch(f => {
      notify(translate("shit!"), {
        type: "warning"
      });
    });

  };

  useEffect(() => {
    // console.clear();
    console.log("useEffect");
    load();
  }, []);
  useEffect(() => {

    console.log("useEffect...", state);
    // load();
  }, [state]);

  const toggleOptionBox = (extra) => {
    setState({ ...state, optionBox: !state.optionBox, ...extra });
  };

  //SaveSettingsHere
  const changeComponentSetting = (the_com, method, element) => {
    let address = "";
    let tempArray = [];
    the_com["settings"][method].fields = element;
    let array = Object.keys(element);
    console.log("array", array);

    if (the_com && the_com.settings && the_com.settings.general && the_com.settings.general.rules) {

      the_com.settings.general.rules = the_com.settings.general.rules.filter((rule, index) => {
        return array.indexOf(rule.name) !== -1;
      });
      the_com.settings.general.rules.forEach((item, i) => {
        the_com.settings.general.rules[i].value = element[item];
      });
      console.log("the_com.settings.general.rules", the_com.settings.general.rules);
    }


    components.forEach((comp, j) => {
      if (the_com.id === comp.id) {
        tempArray.push(the_com);
      } else {
        if (comp.children) {
          comp.children.forEach((c, x) => {
            if (the_com.id === c.id) {
              comp.children[x] = the_com;
              address = [j, x];
            } else {
              comp.children[x] = comp.children[x];
              if (comp.children[x].children) {
                comp.children[x].children.forEach((cc, xx) => {
                  if (the_com.id === cc.id) {
                    comp.children[x].children[xx] = the_com;
                    address = [j, x, xx];
                  }
                });
              }
            }
            if (the_com.id === c.id) {
              address = [j];
            }
          });

        }
        tempArray.push(comp);
      }
    });

    console.log("save components:", tempArray);
    console.log("save components:", state);
    console.log("save components:", address);
    setState({ ...state, components: tempArray });
  };


  const deleteItem = (id) => {
    let found_path = "";
    let tempArray = [];
    components.forEach((comp, j) => {
      let deleteItem = false;
      if (id === comp.id) {
        deleteItem = true;
      }
      if (comp.children && !deleteItem) {
        let tempChildren = [];
        comp.children.forEach((ch, j2) => {
          let deleteItem2 = false;
          if (id == ch.id) {
            deleteItem2 = true;
          }
          if (ch.children && !deleteItem2) {
            let tempChildren3 = [];
            ch.children.forEach((ch3, j3) => {
              let deleteItem3 = false;
              if (id == ch3.id) {
                deleteItem3 = true;
              }
              if (ch3.children && !deleteItem3) {
                let tempChildren4 = [];
                ch3.children.forEach((ch4, j4) => {
                  let deleteItem4 = false;
                  if (id == ch4.id) {
                    deleteItem4 = true;
                  }
                  if(ch4.children && !deleteItem4){
                    let tempChildren5 = [];
                    ch4.children.forEach((ch5,j5)=>{
                      let deleteItem5 = false;
                      if(id == ch5.id){
                        deleteItem5 = true;
                      }
                      if(ch5.children && !deleteItem5){
                        let tempChildren6 = [];
                        ch5.children.forEach((ch6,j6)=>{
                          let deleteItem6 = false;
                          if(id == ch6.id){
                            deleteItem6 = true;
                          }


                          if(ch6.children && !deleteItem6){
                            let tempChildren7 = [];
                            ch6.children.forEach((ch7,j7)=>{
                              let deleteItem7 = false;
                              if(id == ch7.id){
                                deleteItem7 = true;
                              }
                              if(!deleteItem7){
                                tempChildren7.push(ch7)
                              }
                            });
                            ch6.children = tempChildren7;
                          }




                          if(!deleteItem6){
                            tempChildren6.push(ch6)
                          }
                        });
                        ch5.children = tempChildren6;
                      }
                      if(!deleteItem5){
                        tempChildren5.push(ch5)
                      }
                    });
                    ch4.children = tempChildren5;
                  }



                  if (!deleteItem4) {
                    tempChildren4.push(ch4);
                  }

                });
                ch3.children = tempChildren4;
              }

              if (!deleteItem3) {
                tempChildren3.push(ch3);
              }

            });
            ch.children = tempChildren3;
          }
          if (!deleteItem2)
            tempChildren.push(ch);
        });
        comp.children = tempChildren;
      }


      if (!deleteItem)
        tempArray.push(comp);
    });

    let r = [...tempArray];
    console.log("components out:", r);

    setState({ ...state, components: tempArray });

  };


  const moveContent = (thisKey, theDestinationKey, address = 0) => {
    // console.clear();
    console.log("moveContent.....................", thisKey, theDestinationKey, address);
    // setLoading(true);
    if (address === 0) {
      let tempContent = components[theDestinationKey];
      components[theDestinationKey] = components[thisKey];
      components[thisKey] = tempContent;
      // components.push(element)
      // console.log('components', components)
      // setComponents([...components]);
      setState({ ...state, components: components });


    } else {
      address = address.split("_");
      if (address[0] === "component") {
        address.shift();
        let theNewComponents = components;
        let mainAddress = address;
        theNewComponents.forEach((comp, inde) => {
          let the_id = "component_" + mainAddress[0];

          console.log("the_id", the_id, comp.id);
          if (!theNewComponents[inde].children) {
            theNewComponents[inde].children = [];
          }
          // if (!theNewComponents[inde]['children'][mainAddress[1]]) {
          //   theNewComponents[inde]['children'][mainAddress[1]]={};
          // }
          if (comp.id === the_id) {
            console.log(inde, " ==> ", theDestinationKey, " in:", mainAddress[1]);
            console.log(theNewComponents[inde].children[mainAddress[1]]);
            let tempContent = theNewComponents[inde].children[mainAddress[1]][theDestinationKey];
            console.log("tempContent", tempContent);
            theNewComponents[inde].children[mainAddress[1]][theDestinationKey] = theNewComponents[inde].children[mainAddress[1]][thisKey];
            theNewComponents[inde].children[mainAddress[1]][thisKey] = tempContent;
          }
        });
        setState({ ...state, components: theNewComponents });

        // console.log('address',address);
      }
    }
    // setComponents(components);
    // setLoading(false);

  };
  const moveItem = (id,dest) => {
    console.log('source:',id,'destination:',dest)
    console.log('Compoinentsssssssssss',components)
    let moveCurrentItem = [];
    let pushCurrentItem = [];
    let completeComponent = components;
    // let destination = _(components)
    //   .thru(function(coll) {
    //     return _.union(coll, _.map(coll, 'children') || []);
    //   })
    //   .flatten()
    //   .find({ id: dest });
    // let current = _(components)
    //   .thru(function(coll) {
    //     return _.union(coll, _.map(coll, 'children') || []);
    //   })
    //   .flatten()
    //   .find({ id: id });
    //
    completeComponent.forEach((component)=>{
      if(component.id === id){
        moveCurrentItem.push(component);
      }else if(component.children){
        component.children.forEach((subCom)=>{
          if(subCom.id === id){
            moveCurrentItem.push(subCom);
          }else if(subCom.children){
            subCom.children.forEach((subAny)=>{
              if(subAny.id === id){
                moveCurrentItem.push(subAny);
              }
            })
          }
        })
      }
    })
    completeComponent.forEach((component)=>{
      if(component.id === dest){
        pushCurrentItem.push(component)
      }else if(component.children){
        component.children.forEach((child)=>{
          if(child.id === dest){
            pushCurrentItem.push(child)
          }else if(child.children){
              child.children.forEach((subChild)=>{
                if(subChild.id === dest){
                  pushCurrentItem.push(subChild)
                }
              })
          }
        })
      }
    })
    // _.find(components, el => {
    //   if(el.id === id){
    //     moveCurrentItem.push(el);
    //   }
    //   if(el.id === dest){
    //     pushCurrentItem.push(el);
    //   }else{
    //     _.find(el.children,ch=>{
    //       if(ch.id === dest){
    //         pushCurrentItem.push(ch)
    //       }else{
    //         _.find(ch.children,chch=>{
    //           if(chch.id === dest){
    //             pushCurrentItem.push(chch)
    //           }
    //         })
    //       }
    //     })
    //   }

    // });
if(pushCurrentItem){
  console.log('puuuush',pushCurrentItem);
  pushCurrentItem.forEach(push=>{
    if(push.hasOwnProperty('children')){
      // Object.assign(push.children,moveCurrentItem)
      // Object.push(push.children,moveCurrentItem)
      push.children.push(moveCurrentItem[0]);
      completeComponent.splice(completeComponent.findIndex(a => a.id === id) , 1)
    }else{
      Object.assign(push,{children:moveCurrentItem})
      completeComponent.splice(completeComponent.findIndex(a => a.id === id) , 1)
    }
  })

}
    console.log('moveCurrentItem:',moveCurrentItem)
    console.log('pushCurrentItem:',pushCurrentItem)
    console.log('completeComponent:',completeComponent)

    setState({ ...state, components: completeComponent });
  };

  const addToComponents = (element, extra) => {
    console.log("inside: ", sourceAddress);
    let theNewComponents = components,mainAddress = [];

    if (sourceAddress) {
      mainAddress = sourceAddress.split("_");
    }


    if (mainAddress[0] === "new") {

      theNewComponents.push({ ...element, id: "component_" + generateID() });
      setC(c + 1);
      setState({ ...state, components: theNewComponents, ...extra });

    } else {
      console.log("addToComponentaddToComponent: ", theNewComponents);
      theNewComponents.forEach((compL1, indeL1) => {
        if ((compL1.id === sourceAddress)) {
          if (!theNewComponents[indeL1]["children"]) {
            theNewComponents[indeL1]["children"] = [];
          }
          theNewComponents[indeL1]["children"].push({
            ...element,
            id: "component_" + generateID()
          });
          setState({ ...state, components: theNewComponents, ...extra });
          return;
        }
        if ((compL1.children)) {
          compL1.children.forEach((compL2, indeL2) => {
            if ((compL2.id === sourceAddress)) {

              console.log("we found it here level 1...", theNewComponents[indeL1]["children"][indeL2]);
              if (!theNewComponents[indeL1]["children"][indeL2]["children"]) {
                theNewComponents[indeL1]["children"][indeL2]["children"] = [];
              }
              theNewComponents[indeL1]["children"][indeL2]["children"].push({
                ...element,
                id: "component_" + generateID()
              });
              setState({ ...state, components: theNewComponents, ...extra });
              return;
            }
            if ((compL2.children)) {
              compL2.children.forEach((compL3, indeL3) => {
                if ((compL3.id === sourceAddress)) {
                  if (!theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"]) {
                    theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"] = [];
                  }
                  theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"].push({
                    ...element,
                    id: "component_" + generateID()
                  });
                  setState({ ...state, components: theNewComponents, ...extra });
                  return;
                }
                if (compL3.children) {
                  compL3.children.forEach((compL4, indeL4) => {
                    if ((compL4.id === sourceAddress)) {
                      if (!theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"]) {
                        theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"] = [];
                      }
                      theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"].push({
                        ...element,
                        id: "component_" + generateID()
                      });
                      setState({ ...state, components: theNewComponents, ...extra });
                      return;
                    }
                    if((compL4.children)){
                      compL4.children.forEach((compL5,indeL5)=>{
                        if ((compL5.id === sourceAddress)) {
                          if (!theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"][indeL5]["children"]) {
                            theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"][indeL5]["children"] = [];
                          }
                          theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"][indeL5]["children"].push({
                            ...element,
                            id: "component_" + generateID()
                          });
                          setState({ ...state, components: theNewComponents, ...extra });
                          return;
                        }
                        if((compL5.children)){
                          compL5.children.forEach((compL6,indeL6)=>{
                            if ((compL6.id === sourceAddress)) {
                              if (!theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"][indeL5]["children"][indeL6]["children"]) {
                                theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"][indeL5]["children"][indeL6]["children"] = [];
                              }
                              theNewComponents[indeL1]["children"][indeL2]["children"][indeL3]["children"][indeL4]["children"][indeL5]["children"][indeL6]["children"].push({
                                ...element,
                                id: "component_" + generateID()
                              });
                              setState({ ...state, components: theNewComponents, ...extra });
                              return;
                            }
                          })
                        }
                      })
                    }
                  });
                }
              });
            }
          });

        }

      });
    }
  };
  const generateID = (tokenLen = 5) => {

    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < tokenLen; ++i)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };
  const addToComponents2 = (element, extra) => {
    console.log("addToComponents:", element);
    console.log("where?", sourceAddress);
    let theNewComponents = components;
    let mainAddress = [];
    if (sourceAddress) {
      mainAddress = sourceAddress.split("_");
    }
// let id_is
    console.log("mainAddress", mainAddress);
    if (mainAddress[0] == "component") {
      mainAddress.shift();
      // console.log('tempMainAddress', mainAddress[0], mainAddress[1], theNewComponents)
      let the_id = "component_" + mainAddress[0];
      theNewComponents.forEach((comp, inde) => {
        console.log("the_id", the_id, comp.id);
        if (!theNewComponents[inde].children) {
          theNewComponents[inde].children = [];
        }
        if ((comp.id === the_id) || (inde === mainAddress[0])) {
          console.log("theNewComponents[inde]", theNewComponents[inde]);
          //make changes here
          if (mainAddress[1]) {
            if (!theNewComponents[inde]["children"][mainAddress[1]]) {
              theNewComponents[inde]["children"][mainAddress[1]] = [];
            }
            let ChildrenLength = theNewComponents[inde]["children"][mainAddress[1]].length;
            // if (!ChildrenLength)
            theNewComponents[inde]["children"][mainAddress[1]].push({
              ...element,
              id: "component_" + inde + "_" + mainAddress[1] + "_" + ChildrenLength
            });

          }

        }
      });

      console.log("the newComponents are:", theNewComponents);
      setState({ ...state, components: theNewComponents, ...extra });
    }
    if (mainAddress[0] == "new") {
      console.log("addToComponents:", { ...element, id: "component_" + c });
      console.log(mainAddress, theNewComponents);

      theNewComponents.push({ ...element, id: "component_" + c });
      setC(c + 1);
      setState({ ...state, components: theNewComponents, ...extra });

    }
    // save();

  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
      // isDragging: monitor.isDragging()
    })
  }));
  const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.KNIGHT,
      drop: () => ({name:'some name'}),
      // canDrop: () => canMoveKnight(x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        // canDrop: !!monitor.canDrop()
      })
    })
  return (
    <div className={"nodeeweb-page-builder-wrapper " + translate("direction")}>
        <div id="nodeeweb-page-builder" style={{ height: "100vh", width: "100vw !important", opacity: isDragging ? 0.5 : 1 }}>
          {components && components.map((component, index) => {
            if (!component) {
              return <></>;
            }
            return <Component
              key={index}
              index={index}
              toggleOptionBox={toggleOptionBox}
              moveContent={moveContent}
              moveItem={moveItem}
              component={component}
              deleteItem={(e) => {
                deleteItem(e || component.id);
              }}

              // setSourceAddress={(e)=>{
              //   console.log('e',e)
              //   setState({...state, sourceAddress: e});
              //
              // }}
              // changeComponentSetting={changeComponentSetting}

              changeComponentSetting={(e, j, d) => {
                console.log("changeComponentSetting", e, j, d);
                changeComponentSetting(e, j, d);
              }}
              length={components.length}
            />;
          })}

          <div ref={drop} className={"add-component element "+(isOver ? 'hover' : '')} onClick={(e) => {
            setState({ ...state, sourceAddress: "new", excludeArray: [], optionBox: !state.optionBox });
          }}>

           <AddIcon/>
          </div>
        </div>
        <OptionBox {...props} defaultOptions={DefaultOptions} onClose={(e) => {
        console.log("setExcludeArray");
        toggleOptionBox();
      }} exclude={excludeArray} open={state.optionBox} addToComponents={addToComponents}/>
        <div className={"nodeeweb-fixed-bottom-bar"}>
        <div className={"npb-d-flex "}>
          <label
            style={{ direction: "ltr" }}>{data && (typeof data.title == "object") ? data.title[lan] : data.title}</label>
          <span className={"npb-settings"}>
            <Button onClick={save}>
              Save
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};
export const PageServer = [
  {}
];
export default Core;
