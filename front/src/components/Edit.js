import React, {useEffect, useState} from 'react';
import {getTheSingleData,editRecord} from '#c/functions/index';
import CreateForm from "#c/components/form/CreateForm";
import {toast} from "react-toastify";
import store from "#c/functions/store";
import {withTranslation} from 'react-i18next';

function Edit(props) {
  console.log('props', props)
  let {model, _id, t,rules} = props
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  useEffect(() => {
    // setSelectedCats(items)
    // if (action == 'list')
    getData();
    console.log('modelChanges')
  }, []);
  const getData = () => {
    //   const { t } = this.props;
    let formVals = [];
    getTheSingleData('admin', model, _id).then((data = []) => {
      Object.keys(data).forEach((d) => {
        let lastObj = {
          type: 'input',
          label: t(d),
          name: d,

          size: {
            sm: 6,
            lg: 6,
          },
          onChange: (text) => {
            // setFields([...fields,])
            // this.state.checkOutBillingAddress.add.data[d] = text;
          },
          className: 'rtl',
          placeholder: t(d),
          child: [],
          value: data[d] || '',
        };
        if (typeof data[d] == 'object') {
          lastObj.type = 'object';

        }
        if (typeof data[d] == 'number') {
          lastObj.type = 'number';
        }
        if (typeof data[d] == 'string') {

        }
        // console.log('type of ',d,typeof data[d])
        formVals.push(lastObj)

      })

      setData(data);
      setFields(data);
    });
  }

  const onSubmit = (values) => {

    console.log('values',model,_id, values);
    // return;
    editRecord(model,_id,values).then(e=>{
      console.log('e',e);
      toast('edited successfully!', {
        type: "success"
      });
    })
  }
  console.clear()
  console.log('rules', rules)
  console.log('fields', data)
  return (
    <CreateForm
      rules={rules}
      onSubmit={onSubmit}
      buttons={[]}
      fields={fields}/>
  );
}

export default withTranslation()(Edit);
