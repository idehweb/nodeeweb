import { useEffect, useState, memo, useCallback, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNotify, useTranslate } from 'react-admin';

import _get from 'lodash/get';

import update from 'immutability-helper';

import { LoadingContainer } from '@/components/global';
import { Component, OptionBox } from '@/components/page-builder';
import EmptyDropCard, {
  OrderType,
} from '@/components/page-builder/Component/EmptyCard';
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
import { makeAction, FindNodeAddress, DeleteItem, AddItem } from './utils';

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
    sourceAddress: '',
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
      const newComponents = DeleteItem(id, components);
      setState((s) => ({ ...s, components: newComponents }));
    },
    [components]
  );

  const handleAdd = useCallback(
    (item) => {
      const newComponents = AddItem(sourceAddress, components, item);
      setState((s) => ({
        ...s,
        components: newComponents,
        optionBox: false,
      }));
    },
    [components, sourceAddress]
  );

  const handleDrop = useCallback(
    (source, dest, order: OrderType) => {
      console.log({ components, source, dest, order });

      const sourceNodeAddress = FindNodeAddress(components, source.id);
      const destNodeAddress = FindNodeAddress(components, dest.id);

      console.group('here');
      console.log('address', sourceNodeAddress);
      console.log('address2', destNodeAddress);

      const baseNode = _get(components, sourceNodeAddress, {});

      let newComponents = JSON.parse(JSON.stringify(components));

      newComponents = DeleteItem(source.id, newComponents);
      console.log('DeleteItem', newComponents);

      console.groupEnd();

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
            sourceAddress: '',
            excludeArray: [],
            optionBox: !p.optionBox,
          }));
        }}
        onSave={() => SaveData(components)}
      />

      <Container onDrop={handleDrop}>
      <Container>
        {tabValue === 0 && (
          <AnimatePresence presenceAffectsLayout>
            {components?.map((i, idx) => (
              <Fragment key={idx}>
                <motion.div layout="position" key={`${i.id}-middle`}>
                  <EmptyDropCard
                    item={i}
                    onDropEnd={handleDrop}
                    order="middle"
                  />
                </motion.div>
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

                {idx === components.length - 1 ? (
                  <motion.div layout="position" key={`${i.id}-last`}>
                    <EmptyDropCard
                      item={i}
                      onDropEnd={handleDrop}
                      order="last"
                    />
                  </motion.div>
                ) : null}
              </Fragment>
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
        onAdd={handleAdd}
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
