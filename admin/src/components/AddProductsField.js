import React from 'react';
// import { useRecordContext } from "react-admin";
import {
  ArrayInput,
  AutocompleteInput,
  FormDataConsumer,
  NumberInput,
  SimpleFormIterator,
  TextInput,
  useInput,
  useTranslate,
} from 'react-admin';

import API from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
let ckjhg = {};
let hasTriggered = false;

export default (props) => {
  // console.log('props',props);
  // console.log('CatRefField...',props);
  const [v, setV] = React.useState([]);
  const [c, setC] = React.useState(0);

  let { scopedFormData, getSource, source } = props;
  const translate = useTranslate();
  // const record = useRecordContext();
  // const { setFilters, displayedFilters,selectedChoices,allChoices,availableChoices,total } = useChoicesContext();
  const { field } = useInput(props);
  const getData = () => {
    API.get('' + props.url, {}).then(({ data: { data = [] } }) => {
      var cds = [];
      data.forEach((uf, s) => {
        cds.push({
          type: uf.type,
          salePrice: uf.salePrice,
          price: uf.price,
          _id: uf._id,
          title: uf.title && uf.title.fa ? uf.title.fa : uf.title,
          key: s,
        });
      });
      setV(cds);
      // setSelectS([false, true, true]);
      // changeSecondInput(defaultV);
    });
  };
  // const [progress, setProgress] = React.useState(0);
  const returnDefaultValue = (product_id, x = 'price') => {
    console.log('product_id', product_id);
    console.log('x', x);

    let ddd = [];
    v.forEach((f) => {
      if (f._id == product_id) {
        console.log('f', f);

        ddd = f[x];
      }
    });
    console.log('ddd', ddd);
    // setC(c+1)
    return ddd;
  };
  React.useEffect(() => {
    getData();
    // if (field.value) setV(field.value);
  }, []);
  // console.log('allChoices',allChoices)
  // console.log('selectedChoices',selectedChoices)
  return (
    <>
      <ArrayInput
        fullWidth
        source={source}
        label={translate('resources.order.card')}>
        <SimpleFormIterator {...props}>
          <FormDataConsumer>
            {({ scopedFormData = {}, getSource, ...rest }) => {
              return (
                <div className={'row mb-20'}>
                  {/*{JSON.stringify(scopedFormData)}*/}
                  {/*{JSON.stringify(displayedFilters)}*/}
                  {/*{JSON.stringify(allChoices)}*/}
                  {/*{JSON.stringify(availableChoices)}*/}
                  {/*{JSON.stringify(scopedFormData)}*/}
                  {/*{JSON.stringify(selectedChoices)}*/}
                  <div className={'col-md-3'}>
                    {scopedFormData.product_id && (
                      <TextInput
                        source={getSource('_id')}
                        defaultValue={
                          scopedFormData
                            ? returnDefaultValue(
                                scopedFormData.product_id,
                                '_id'
                              )
                            : 0
                        }
                        label={translate('resources.order._id')}
                        className={'width100 mb-20 ltr'}
                        fullWidth
                      />
                    )}
                    {scopedFormData.product_id && (
                      <TextInput
                        source={getSource('title')}
                        defaultValue={
                          scopedFormData
                            ? returnDefaultValue(
                                scopedFormData.product_id,
                                'title'
                              )
                            : 0
                        }
                        label={translate('resources.order.title')}
                        className={'width100 mb-20 ltr'}
                        fullWidth
                      />
                    )}

                    {!scopedFormData.product_id && (
                      <AutocompleteInput
                        source={getSource('product_id')}
                        choices={v}
                        label={translate('resources.order.product')}
                        optionValue="_id"
                        optionText="title"
                      />
                    )}
                  </div>
                  <div className={'col-md-3'}>
                    {scopedFormData.product_id && (
                      <NumberInput
                        defaultValue={1}
                        source={getSource('count')}
                        label={translate('resources.order.count')}
                        className={'width100 mb-20 ltr'}
                        fullWidth
                      />
                    )}
                  </div>
                  <div className={'col-md-3'}>
                    {scopedFormData.product_id && (
                      <TextInput
                        fullWidth
                        // record={scopedFormData}

                        source={getSource('price')}
                        className={'ltr'}
                        defaultValue={
                          scopedFormData
                            ? returnDefaultValue(
                                scopedFormData.product_id,
                                'price'
                              )
                            : 0
                        }
                        label={translate('resources.order.price')}
                        placeholder={translate('resources.order.price')}
                        format={(v) => {
                          if (!v) return '';

                          return v
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }}
                        parse={(v) => {
                          if (!v) return '';

                          return v.toString().replace(/,/g, '');
                        }}
                        {...rest}
                      />
                    )}
                  </div>
                  <div className={'col-md-3'}>
                    {scopedFormData.product_id && (
                      <TextInput
                        fullWidth
                        // record={scopedFormData}
                        defaultValue={
                          scopedFormData
                            ? returnDefaultValue(
                                scopedFormData.product_id,
                                'salePrice'
                              )
                            : 0
                        }
                        source={getSource('salePrice')}
                        className={'ltr'}
                        label={translate('resources.order.saleprice')}
                        placeholder={translate('resources.order.saleprice')}
                        format={(v) => {
                          if (!v) return '';

                          return v
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }}
                        parse={(v) => {
                          if (!v) return '';

                          return v.toString().replace(/,/g, '');
                        }}
                        {...rest}
                      />
                    )}
                  </div>
                </div>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </>
  );
};
