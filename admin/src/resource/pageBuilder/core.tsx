import { useEffect, useState, memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNotify, useTranslate } from 'react-admin';

import Component from '@/components/page-builder/Component';
import OptionBox from '@/components/page-builder/OptionBox';
import ComponentSetting from '@/components/page-builder/Component/Setting';
import {
  changeThemeData,
  changeThemeDataFunc,
  GetBuilder,
  SaveBuilder,
} from '@/functions';

import Header from './Header';
import Container from './Container';
import Preview from './Preview';
import { generateCompID } from './utils';
import { DropTargetMonitor } from 'react-dnd';

const Core = (props) => {
  const translate = useTranslate();
  const dispatch = useDispatch();
  const notify = useNotify();
  const { _id, model = 'page' } = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [editItem, setEditItem] = useState<any>({});

  const [state, setState] = useState({
    components: [],
    optionBox: false,
    excludeArray: [],
    sourceAddress: 'new',
    componentForSetting: {},
    componentOptionsBox: false,
  });

  const {
    components,
    optionBox,
    excludeArray,
    sourceAddress,
    componentForSetting,
    componentOptionsBox,
  } = state;

  const LoadData = useCallback(() => {
    if (!_id) return;

    changeThemeDataFunc().then((e) => {
      dispatch(changeThemeData(e));
    });
    GetBuilder(model, _id).then((r) => {
      if (r && r.elements) {
        setState((s) => ({ ...s, components: r.elements }));
      }
    });
  }, [_id, model, dispatch]);
  useEffect(() => {
    console.log('useEffect');
    LoadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SaveData = useCallback(
    (data = {}) => {
      console.log('SaveData');
      SaveBuilder(model, _id, { elements: data })
        .then((r) => {
          if (r._id)
            notify(translate('saved successfully.'), {
              type: 'success',
            });
        })
        .catch((f) => {
          notify(translate('shit!'), {
            type: 'warning',
          });
        });
    },
    [notify, translate, _id, model]
  );

  const toggleOptionBox = useCallback((extra) => {
    setState((s) => ({ ...s, optionBox: !s.optionBox, ...extra }));
  }, []);

  //SaveSettingsHere
  const changeComponentSetting = useCallback(
    (the_com, method, element) => {
      let address = [];
      let tempArray = [];
      the_com['settings'][method].fields = element;
      let array = Object.keys(element);
      console.log('array', array);

      if (
        the_com &&
        the_com.settings &&
        the_com.settings.general &&
        the_com.settings.general.rules
      ) {
        the_com.settings.general.rules = the_com.settings.general.rules.filter(
          (rule, index) => {
            return array.indexOf(rule.name) !== -1;
          }
        );
        the_com.settings.general.rules.forEach((item, i) => {
          the_com.settings.general.rules[i].value = element[item];
        });
        console.log(
          'the_com.settings.general.rules',
          the_com.settings.general.rules
        );
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

      console.log('save components:', tempArray);
      console.log('save components:', address);
      setState((s) => ({ ...s, components: tempArray }));
    },
    [components]
  );

  const handleDelete = useCallback(
    (id) => {
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
                    if (ch4.children && !deleteItem4) {
                      let tempChildren5 = [];
                      ch4.children.forEach((ch5, j5) => {
                        let deleteItem5 = false;
                        if (id == ch5.id) {
                          deleteItem5 = true;
                        }
                        if (ch5.children && !deleteItem5) {
                          let tempChildren6 = [];
                          ch5.children.forEach((ch6, j6) => {
                            let deleteItem6 = false;
                            if (id == ch6.id) {
                              deleteItem6 = true;
                            }

                            if (ch6.children && !deleteItem6) {
                              let tempChildren7 = [];
                              ch6.children.forEach((ch7, j7) => {
                                let deleteItem7 = false;
                                if (id == ch7.id) {
                                  deleteItem7 = true;
                                }
                                if (!deleteItem7) {
                                  tempChildren7.push(ch7);
                                }
                              });
                              ch6.children = tempChildren7;
                            }

                            if (!deleteItem6) {
                              tempChildren6.push(ch6);
                            }
                          });
                          ch5.children = tempChildren6;
                        }
                        if (!deleteItem5) {
                          tempChildren5.push(ch5);
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
            if (!deleteItem2) tempChildren.push(ch);
          });
          comp.children = tempChildren;
        }

        if (!deleteItem) tempArray.push(comp);
      });

      let r = [...tempArray];
      console.log('components out:', r);

      setState((s) => ({ ...s, components: tempArray }));
    },
    [components]
  );

  const addToComponents = useCallback(
    (element, extra) => {
      let theNewComponents = components,
        mainAddress = [];

      if (sourceAddress) {
        mainAddress = sourceAddress.split('_');
      }

      if (mainAddress[0] === 'new') {
        theNewComponents.push({ ...element, id: generateCompID() });
        setState((s) => ({ ...s, components: theNewComponents, ...extra }));
      } else {
        console.log('addToComponentaddToComponent: ', theNewComponents);
        theNewComponents.forEach((compL1, indeL1) => {
          if (compL1.id === sourceAddress) {
            if (!theNewComponents[indeL1]['children']) {
              theNewComponents[indeL1]['children'] = [];
            }
            theNewComponents[indeL1]['children'].push({
              ...element,
              id: generateCompID(),
            });
            setState((s) => ({
              ...s,
              components: theNewComponents,
              ...extra,
            }));
            return;
          }
          if (compL1.children) {
            compL1.children.forEach((compL2, indeL2) => {
              if (compL2.id === sourceAddress) {
                console.log(
                  'we found it here level 1...',
                  theNewComponents[indeL1]['children'][indeL2]
                );
                if (!theNewComponents[indeL1]['children'][indeL2]['children']) {
                  theNewComponents[indeL1]['children'][indeL2]['children'] = [];
                }
                theNewComponents[indeL1]['children'][indeL2]['children'].push({
                  ...element,
                  id: generateCompID(),
                });
                setState((s) => ({
                  ...s,
                  components: theNewComponents,
                  ...extra,
                }));
                return;
              }
              if (compL2.children) {
                compL2.children.forEach((compL3, indeL3) => {
                  if (compL3.id === sourceAddress) {
                    if (
                      !theNewComponents[indeL1]['children'][indeL2]['children'][
                        indeL3
                      ]['children']
                    ) {
                      theNewComponents[indeL1]['children'][indeL2]['children'][
                        indeL3
                      ]['children'] = [];
                    }
                    theNewComponents[indeL1]['children'][indeL2]['children'][
                      indeL3
                    ]['children'].push({
                      ...element,
                      id: generateCompID(),
                    });
                    setState((s) => ({
                      ...s,
                      components: theNewComponents,
                      ...extra,
                    }));
                    return;
                  }
                  if (compL3.children) {
                    compL3.children.forEach((compL4, indeL4) => {
                      if (compL4.id === sourceAddress) {
                        if (
                          !theNewComponents[indeL1]['children'][indeL2][
                            'children'
                          ][indeL3]['children'][indeL4]['children']
                        ) {
                          theNewComponents[indeL1]['children'][indeL2][
                            'children'
                          ][indeL3]['children'][indeL4]['children'] = [];
                        }
                        theNewComponents[indeL1]['children'][indeL2][
                          'children'
                        ][indeL3]['children'][indeL4]['children'].push({
                          ...element,
                          id: generateCompID(),
                        });
                        setState((s) => ({
                          ...s,
                          components: theNewComponents,
                          ...extra,
                        }));
                        return;
                      }
                      if (compL4.children) {
                        compL4.children.forEach((compL5, indeL5) => {
                          if (compL5.id === sourceAddress) {
                            if (
                              !theNewComponents[indeL1]['children'][indeL2][
                                'children'
                              ][indeL3]['children'][indeL4]['children'][indeL5][
                                'children'
                              ]
                            ) {
                              theNewComponents[indeL1]['children'][indeL2][
                                'children'
                              ][indeL3]['children'][indeL4]['children'][indeL5][
                                'children'
                              ] = [];
                            }
                            theNewComponents[indeL1]['children'][indeL2][
                              'children'
                            ][indeL3]['children'][indeL4]['children'][indeL5][
                              'children'
                            ].push({
                              ...element,
                              id: generateCompID(),
                            });
                            setState((s) => ({
                              ...s,
                              components: theNewComponents,
                              ...extra,
                            }));
                            return;
                          }
                          if (compL5.children) {
                            compL5.children.forEach((compL6, indeL6) => {
                              if (compL6.id === sourceAddress) {
                                if (
                                  !theNewComponents[indeL1]['children'][indeL2][
                                    'children'
                                  ][indeL3]['children'][indeL4]['children'][
                                    indeL5
                                  ]['children'][indeL6]['children']
                                ) {
                                  theNewComponents[indeL1]['children'][indeL2][
                                    'children'
                                  ][indeL3]['children'][indeL4]['children'][
                                    indeL5
                                  ]['children'][indeL6]['children'] = [];
                                }
                                theNewComponents[indeL1]['children'][indeL2][
                                  'children'
                                ][indeL3]['children'][indeL4]['children'][
                                  indeL5
                                ]['children'][indeL6]['children'].push({
                                  ...element,
                                  id: generateCompID(),
                                });
                                setState((s) => ({
                                  ...s,
                                  components: theNewComponents,
                                  ...extra,
                                }));
                                return;
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    },
    [components, sourceAddress]
  );

  const handleDrop2 = useCallback((id, dest, component) => {
    let moveCurrentItem = [];
    let pushCurrentItem = [];
    let lastComponenet = [];

    if (component) {
      if (component.id === id) {
        moveCurrentItem.push(component);
      } else if (component.children) {
        component.children.forEach((subCom) => {
          if (subCom.id === id) {
            moveCurrentItem.push(subCom);
          } else if (subCom.children) {
            subCom.children.forEach((subAny) => {
              if (subAny.id === id) {
                moveCurrentItem.push(subAny);
              }
            });
          }
        });
      }

      if (component.id === dest) {
        pushCurrentItem.push(component);
      } else if (component.children) {
        component.children.forEach((child) => {
          if (child.id === dest) {
            pushCurrentItem.push(child);
          } else if (child.children) {
            child.children.forEach((subChild) => {
              if (subChild.id === dest) {
                pushCurrentItem.push(subChild);
              }
            });
          }
        });
      }
      let added;
      if (pushCurrentItem) {
        pushCurrentItem.forEach((i) => {
          if (i.hasOwnProperty('children')) {
            i.children.forEach((p) => {
              if (p.id === id) {
                added = false;
              } else {
                added = true;
                i.children.push(moveCurrentItem[0]);
              }
            });
            // if(added){
            //   push.children.push(moveCurrentItem[0]);
            // }

            const deleteTarget =
              component.children &&
              component.children.findIndex((child) => {
                child.children &&
                  child.children.findIndex((chil) => {
                    chil.children &&
                      chil.children.findIndex((chi) => {
                        if (chi && chi.id === id) {
                          if (chil.id !== dest) {
                            chil.children.splice(chi, 1);
                          }
                        }
                      });
                    if (chil && chil.id === id) {
                      if (child.id !== dest) {
                        child.children.splice(chil, 1);
                      }
                    }
                  });
                if (child && child.id === id) {
                  if (component.children.id !== dest) {
                    component.children.splice(child, 1);
                  }
                }
              });
          } else {
            let temp = Object.assign(i, { children: lastComponenet });
            console.log('asd', temp);
            // component.splice(component.children.findIndex(a => a.id === id) , 1)
          }
        });
      }
    }

    // setState((p) => ({ ...p, components: component }));
  }, []);

  const handleDrop = useCallback(
    (item, monitor: DropTargetMonitor<any, any>) => {
      const { id } = item;
      const dest = monitor.getItem();
      console.log({ item, monitor, dest, id });

      handleDrop2(id, dest, item);
    },
    [handleDrop2]
  );

  return (
    <div className={translate('direction')}>
      <Header
        tabValue={tabValue}
        setTabValue={setTabValue}
        onAdd={() => {
          setState((p) => ({
            ...p,
            sourceAddress: 'new',
            excludeArray: [],
            optionBox: !p.optionBox,
          }));
        }}
        onSave={() => SaveData(components)}
      />

      <Container onDrop={handleDrop}>
        {tabValue === 0 && (
          <AnimatePresence presenceAffectsLayout>
            {components?.map((i, idx) => (
              <motion.div
                key={idx}
                layout="position"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'just' }}>
                <Component
                  index={idx}
                  item={i}
                  onDelete={(e) => {
                    handleDelete(e || i.id);
                  }}
                  onAdd={toggleOptionBox}
                  onEdit={() => setEditItem(i)}
                  onDrop={handleDrop}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {tabValue === 1 && <Preview />}
      </Container>
      <OptionBox
        {...props}
        onClose={(e) => toggleOptionBox({})}
        exclude={excludeArray}
        open={state.optionBox}
        addToComponents={addToComponents}
      />
      <ComponentSetting
        component={editItem}
        open={Boolean(editItem.id)}
        onClose={() => setEditItem({})}
        onSubmit={changeComponentSetting}
      />
    </div>
  );
};

export default memo(Core);
