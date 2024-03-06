import React from 'react';
// import { useRecordContext } from "react-admin";
import {
  ArrayInput,
  AutocompleteInput,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useInput,
  useTranslate,
  TextField,
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

  // const [totalp, setTotalp] = React.useState(0);
  let calcTotalPrice = props.totalPrice;
  let calcTotalAmount = props.totalAmount;
  // console.log('q............', q(11));

  // const changePriceAmount = (e) => {
  //   return q(e);
  // };

  let tempItems = [];
  const doSomething = (e) => {
    console.log('dosomethingData', e);
    if (tempItems.length == 0) {
      tempItems.push(e);
    } else {
      let CheckItem = tempItems.find((elem) => elem.product_id == e.product_id);
      CheckItem
        ? tempItems.map((elem) =>
            elem.product_id == e.product_id ? (elem = e) : elem
          )
        : tempItems.push(e);
    }

    // console.log('tempItems', tempItems);
    let tPrice = tempItems
      .map((elem) => elem.price * elem.count)
      .reduce((a, b) => a + b, 0);
    let tAmount = tempItems
      .map((elem) => elem.count)
      .reduce((a, b) => a + b, 0);

    console.log('totalPriceIs', tPrice);
    console.log('totalAmountIs', tAmount);
    calcTotalPrice(tPrice);
    calcTotalAmount(tAmount);
  };
  const translate = useTranslate();
  // const record = useRecordContext();
  // const { setFilters, displayedFilters,selectedChoices,allChoices,availableChoices,total } = useChoicesContext();

  //TODO: beacuse of pushing data and updating state , the getDate(in useEffect) is calling as the same number of times as the data is in fetcehed data -check rowData console.log line 91
  const { field } = useInput(props);
  const getData = () => {
    API.get('' + props.url, {}).then(({ data: { data = [] } }) => {
      var cds = [];
      data.forEach((uf, s) => {
        // console.log('rowdata', data);
        cds.push({
          // type: uf.type,
          salePrice: uf.combinations[0]?.salePrice,
          price: uf.combinations[0]?.price,
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
    // console.log('product_id', product_id);
    // console.log('x', x);

    let ddd = [];
    v.forEach((f) => {
      if (f._id == product_id) {
        console.log('f', f);
        ddd = f[x];
      }
      //show pirce for salePrice also, if there is no salePrice
      if ((x == 'salePrice' && ddd == undefined) || null) {
        ddd = f['price'];
      }
    });
    // console.log('ddd', ddd);
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
              scopedFormData.product_id && doSomething(scopedFormData);
              // console.log('scopedformdata...', scopedFormData);
              return (
                <div className={'row mb-20'}>
                  {/*{JSON.stringify(scopedFormData)}*/}
                  {/*{JSON.stringify(displayedFilters)}*/}
                  {/*{JSON.stringify(allChoices)}*/}
                  {/*{JSON.stringify(availableChoices)}*/}
                  {/*{JSON.stringify(scopedFormData)}*/}
                  {/*{JSON.stringify(selectedChoices)}*/}
                  <div className={'col-md-3'}>
                    {/* {scopedFormData.product_id && (
                      <TextInput
                        disabled
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
                    )} */}
                    {scopedFormData.product_id && (
                      <TextInput
                        disabled
                        fullWidth
                        multiline
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
                        className={'width100 mb-20 rtl'}
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
                  {/* <div className={'col-md-3'}>
                    {scopedFormData.product_id && (
                      <ReferenceInput
                        source="combinations"
                        reference={getSource('combinations')}
                        children={
                          <SelectInput
                            // defaultValue={1}
                            label={translate('resources.order.combinations')}
                            className={'width100 mb-20 ltr'}
                            fullWidth
                            optionText={'price'}
                          />
                        }
                      />
                    )}
                  </div> */}
                  <div className={'col-md-3'}>
                    {scopedFormData.product_id && (
                      <NumberInput
                        defaultValue={1}
                        source={getSource('count')}
                        label={translate('resources.order.count')}
                        className={'width100 mb-20 rtl'}
                        fullWidth
                      />
                    )}
                  </div>
                  <div className={'col-md-3'}>
                    {/* {scopedFormData.product_id && (
                      <TextInput
                        disabled
                        fullWidth
                        multiline
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
                        className={'width100 mb-20 rtl'}
                      />
                    )} */}
                    {scopedFormData.product_id && (
                      <TextInput
                        fullWidth
                        // record={scopedFormData}
                        source={getSource('price')}
                        className={'rtl'}
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
                        className={'rtl'}
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
