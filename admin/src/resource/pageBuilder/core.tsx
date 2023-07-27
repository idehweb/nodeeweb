import { useEffect, useState, memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNotify, useTranslate } from 'react-admin';

import _ from 'lodash';

import update from 'immutability-helper';

import { LoadingContainer } from '@/components/global';
import { Component, OptionBox } from '@/components/page-builder';
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
import {
  generateCompID,
  mergeObject,
  FindNodeAddress,
  DeleteItem,
} from './utils';

const Core = (props) => {
  const translate = useTranslate();
  const dispatch = useDispatch();
  const notify = useNotify();
  const { _id, model = 'page' } = useParams();

  const [loading, setLoading] = useState(true);

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

  const { components, excludeArray, sourceAddress } = state;

  const LoadData = useCallback(() => {
    if (!_id) return;

    setLoading(true);
    changeThemeDataFunc().then((e) => {
      dispatch(changeThemeData(e));
    });
    GetBuilder(model, _id)
      .then((r) => {
        if (r && r.elements) {
          setState((s) => ({ ...s, components: r.elements }));
        }
      })
      .finally(() => setLoading(false));
  }, [_id, model, dispatch]);

  useEffect(() => {
    LoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SaveData = useCallback(
    (data = {}) => {
      setLoading(true);
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
        })
        .finally(() => setLoading(false));
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
      let newComponents = DeleteItem(id, components);
      setState((s) => ({ ...s, components: newComponents }));
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
    (source, dest) => {
      console.log({ components, source, dest });

      const baseNodeAddress = FindNodeAddress(components, source.id);
      const destNodeAddress = FindNodeAddress(components, dest.id);

      function removeAt(obj, path) {
        let arr = path.split('.');
        arr.splice(-1);
        let parentPath = arr.join('.');
        let index: string | number = path.split('.').pop();
        index = Number((index as string).replace(/\[|]/gi, ''));

        console.log('index', index, path, parentPath);

        const res = _.cloneDeep(obj);
        let parent: [] = _.get(res, parentPath, []) || [];
        console.log('parent', parent);

        if (Array.isArray(parent)) {
          parent.splice(index, 1);
          _.set(res, parentPath, parent);
          return res;
        }
        return obj;
      }
      function pushAt(obj, path, value) {
        let index: string | number = path.split('.').pop();
        index = Number((index as string).replace(/\[|]/gi, ''));

        const res = _.cloneDeep(obj);
        let parent: [] = _.get(res, path, []) || [];

        const insertAt = (arr, idx, newItem) => [
          ...arr.slice(0, idx),
          newItem,
          ...arr.slice(idx),
        ];

        insertAt(parent, index, value);
        _.set(res, path, parent);

        return res;
      }

      // const baseParentAddress = baseNodeAddress.split('.').pop();
      // const destParentAddress = destNodeAddress.split('.').pop();

      // const baseParentNode = _get(components, baseParentAddress, {});
      // const destParentNode = _get(components, destParentAddress, {});

      console.log('baseNodeAddress', baseNodeAddress, destNodeAddress);

      // console.log('sdf', _omit(components, [destNodeAddress]));
      let newComponents = removeAt(components, baseNodeAddress);
      // let newComponents = removeAt(components, destNodeAddress);

      console.log('sdf', newComponents);

      setState((p) => ({ ...p, components: newComponents }));
    },
    [components]
  );

  return (
    <LoadingContainer loading={loading} className={translate('direction')}>
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
                key={`${i.id}`}
                layout="position"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'just' }}>
                <Component
                  index={idx}
                  item={i}
                  onDelete={handleDelete}
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
    </LoadingContainer>
  );
};

export default memo(Core);
