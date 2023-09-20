import { useEffect, useState, memo, useCallback, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useNotify, useTranslate } from 'react-admin';
import _get from 'lodash/get';

import { LoadingContainer } from '@/components/global';
import { OptionBox } from '@/components/page-builder';

import ComponentSetting from '@/components/page-builder/Component/Setting';
import {
  AnimatedComponent,
  AnimatedEmptyDropSlot,
} from '@/components/page-builder/Component/AnimationComponent';
import {
  ItemType,
  OnDropType,
} from '@/components/page-builder/Component/types';

import { GetBuilder, SaveBuilder } from '@/functions';

import Header from './Header';
import Container from './Container';
import Preview from './Preview';
import {
  FindNodeAddress,
  DeleteItem,
  AddNewItem,
  PushItem,
  AddToIndex,
  AddInside,
} from './utils';

interface StateType {
  components: Array<ItemType>;
  optionBox: boolean;
  excludeArray: Array<any>;
  sourceAddress: string;
  componentForSetting: any;
  componentOptionsBox: boolean;
}

const Core = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const { _id, model = 'page' } = useParams();

  const [loading, setLoading] = useState(true);

  const [tabValue, setTabValue] = useState(0);
  const [editItem, setEditItem] = useState<ItemType | null>();

  const [state, setState] = useState<StateType>({
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

    GetBuilder(model, _id)
      .then((r) => {
        const elements = _get(r, 'data.elements', []);
        setState((s) => ({ ...s, components: elements }));
      })
      .catch((err) => {
        console.error('err =>', err);
        notify('Some thing went Wrong!!', { type: 'error' });
      })
      .finally(() => setLoading(false));
  }, [_id, model, notify]);

  useEffect(() => {
    LoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SaveData = useCallback(
    (data = {}) => {
      setLoading(true);
      SaveBuilder(model, _id, { elements: data })
        .then((r) => {
          notify(translate('saved successfully.'), {
            type: 'success',
          });
        })
        .catch((err) => {
          console.error('err =>', err);
          notify('Some thing went Wrong!!', { type: 'error' });
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
      const newComponents = AddNewItem(sourceAddress, components, item);
      setState((s) => ({
        ...s,
        components: newComponents,
        optionBox: false,
      }));
    },
    [components, sourceAddress]
  );

  // TODO: fix duplicate ids lead to error, we should regenerate ids
  const handleDuplicate = useCallback(
    (item) => {
      const newComponents = PushItem(item.id, components, item);
      setState((s) => ({ ...s, components: newComponents }));
    },
    [components]
  );

  const handleDrop = useCallback<OnDropType>(
    (source, dest, order) => {
      const sourceNodeAddress = FindNodeAddress(components, source.id);
      const baseNode = _get(components, sourceNodeAddress, {});

      let newComponents = JSON.parse(JSON.stringify(components));

      newComponents = DeleteItem(source.id, newComponents);

      if (order) {
        if (order === 'last') {
          newComponents = PushItem(dest.id, newComponents, baseNode);
        } else if (order === 'middle') {
          newComponents = AddToIndex(dest.id, newComponents, baseNode);
        }
      } else {
        newComponents = AddInside(dest.id, newComponents, baseNode);
      }

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

      <Container>
        {tabValue === 0 && (
          <AnimatePresence presenceAffectsLayout>
            {components?.map((i, idx) => (
              <Fragment key={i.id}>
                <AnimatedEmptyDropSlot
                  item={i}
                  onDropEnd={handleDrop}
                  order="middle"
                />

                <AnimatedComponent
                  animationKey={`${i.id}`}
                  index={idx}
                  item={i}
                  onDelete={handleDelete}
                  onAdd={toggleOptionBox}
                  onEdit={(v) => setEditItem(v)}
                  onDrop={handleDrop}
                  onDuplicate={handleDuplicate}
                />

                {idx === components.length - 1 ? (
                  <AnimatedEmptyDropSlot
                    item={i}
                    onDropEnd={handleDrop}
                    order="last"
                  />
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
        // @ts-ignore
        component={editItem || {}}
        open={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        onSubmit={changeComponentSetting}
      />
    </LoadingContainer>
  );
};

export default memo(Core);
