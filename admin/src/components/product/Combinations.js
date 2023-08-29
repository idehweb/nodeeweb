import React from 'react';

import {
  ArrayInput,
  FormDataConsumer,
  NumberInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
} from 'react-admin';

import { useFormContext, useWatch } from 'react-hook-form';

import { numberWithCommas } from '@/functions';
import {
  CatRefField,
  FileChips,
  List,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  StockStatus,
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';

// API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
  let { record, counter, updater, theST } = props;
  const translate = useTranslate();
  let combs = useWatch({ name: 'combinations' });
  const { setValue } = useFormContext();
  let [ST, setST] = React.useState(theST || []);
  const getStockStatus = (t) => {
    let r = ST[0];
    ST.forEach((item) => {
      if (item.value === t) {
        // console.log(' ==========================getStockStatus()',item)
        r = item;
      }
    });
    return r;
  };
  React.useEffect(() => {
    console.log('record', record);

    // setCombs(record);
  }, [record]);
  if (combs && combs.length > 0) {
    return (
      <ArrayInput
        source={'combinations'}
        label={translate('resources.product.combinations')}
        key="3">
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ formData, getSource, scopedFormData }) => {
              // console.log('formData',formData);
              return (
                <div>
                  <div className={'row'} key={0}>
                    <div className={'col-md-3'}>
                      <ShowOptions
                        source={getSource('options')}
                        label=""
                        sortable={false}
                        record={scopedFormData}
                      />
                    </div>
                    <div className={'col-md-3'}>
                      <SelectInput
                        fullWidth
                        label={translate('resources.product.stock')}
                        source={getSource('in_stock')}
                        choices={ST}
                        record={scopedFormData}
                      />
                      <NumberInput
                        fullWidth
                        source={getSource('quantity')}
                        record={scopedFormData}
                        min={0}
                        label={translate('resources.product.quantity')}
                      />
                    </div>

                    <div className={'col-md-3 ltr'}>
                      <TextInput
                        fullWidth
                        record={scopedFormData}
                        className={'ltr'}
                        value={'fds'}
                        validate={Val.reqNum}
                        source={getSource('price')}
                        format={(v) => {
                          if (!v) return '';

                          return v
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }}
                        parse={(v) => {
                          if (!v) return '';

                          // return v.toString().replace(/,/g, "");
                          let x = v.toString().replace(/,/g, '');
                          return parseInt(x);
                        }}
                        label={translate('resources.product.price')}
                      />
                      <TextInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('salePrice')}
                        record={scopedFormData}
                        format={(v) => {
                          if (!v) return '';
                          return v
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }}
                        parse={(v) => {
                          if (!v) return '';

                          let x = v.toString().replace(/,/g, '');
                          return parseInt(x);
                        }}
                        label={translate('resources.product.salePrice')}
                      />
                    </div>

                    <div className={'col-md-3'}>
                      <NumberInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('weight')}
                        record={scopedFormData}
                        min={0}
                        label={translate('resources.product.weight')}
                      />
                      <TextInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('sku')}
                        record={scopedFormData}
                        label={translate('resources.product.sku')}
                      />
                    </div>
                  </div>
                  <div className={'row'}>
                    {/* <div className={'col-md-3'}>
                      <TextInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('source')}
                        record={scopedFormData}
                        label={translate('resources.product.source')}
                      />
                    </div>
                    <div className={'col-md-3'}>
                      <TextInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('maxPrice')}
                        record={scopedFormData}
                        label={translate('resources.product.maxPrice')}
                      />
                    </div>
                    <div className={'col-md-3'}>
                      <TextInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('minPrice')}
                        record={scopedFormData}
                        label={translate('resources.product.minPrice')}
                      />
                    </div>
                    <div className={'col-md-3'}>
                      <TextInput
                        fullWidth
                        className={'ltr'}
                        source={getSource('formula')}
                        record={scopedFormData}
                        label={translate('resources.product.formula')}
                      />
                    </div> */}
                  </div>
                </div>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    );
  } else return props.counter;
};
