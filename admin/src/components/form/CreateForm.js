import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Col, Container, Row } from 'shards-react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { changeThemeData, uploadMedia } from '@/functions/index';
import { SERVER_URL } from '@/functions/API';
import {
  EveryFields,
  FieldArray,
  FieldBoolean,
  FieldCheckbox,
  FieldCheckboxes,
  FieldJson,
  FieldNumber,
  FieldObject,
  FieldPrice,
  FieldSelect,
  FieldServer,
  FieldText,
  FieldTextarea,
  ConditionFiled,
  FieldUploadMedia,
  FieldUploadDocument,
  ChatBase,
  ConditionRow,
} from '@/components/form/fields';

function CreateForm({
  fields,
  rules = { fields: [] },
  componentType = '',
  children = undefined,
  onSubmit,
}) {
  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  const [optionInputs, setOptionInputs] = useState(null);

  const [theRules, setTheRules] = useState(rules);
  const [theF, setTheF] = useState('');
  useEffect(() => {
    // changeThemeData();
    if (
      !theRules ||
      (theRules && !theRules.fields) ||
      (theRules.fields && !theRules.fields[0])
    ) {
      Object.keys(fields).forEach((fi) => {
        let typ = typeof fields[fi];

        if (fields[fi] instanceof Array) {
          typ = 'select';
        }
        rules.fields?.push({
          name: fi,
          type: typ,
        });
      });
      setTheRules(rules);
    }
  }, []);

  if (!themeData) return;

  const addField = (e) => {
    e.preventDefault();
    if (theF) {
      let f = rules.fields;
      let fi = {
        name: theF,
        type: 'string',
        value: '',
      };
      f.push(fi);
      setTheF('');
      setTheRules({ fields: [...f] });
    }
  };
  const TheField = (field) => {
    if (!field) {
      return <>no field</>;
    }

    const {
      type,
      removeField,
      kind,
      size,
      className,
      options,
      disabled = false,
      name,
      label,
      placeholder,
    } = field;

    if (type === 'date') {
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <EveryFields onClick={(e) => removeField(e)} />

          <Field
            name={name}
            component="input"
            type="date"
            placeholder={placeholder || label}
            className="mb-2 form-control"
          />
        </Col>
      );
    }
    if (type === 'string' || !type) {
      if (componentType === 'form' && name === '_id') {
        return <FieldSelect typeInitila={'form'} field={field} />;
      }
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <EveryFields onClick={(e) => removeField(e)} />
          <Field
            name={name}
            component="input"
            type="text"
            placeholder={placeholder || label}
            className="mb-2 form-control"
            disabled={disabled}
          />
        </Col>
      );
    }
    if (type === 'price') {
      return <FieldPrice field={field} removeField={(e) => removeField(e)} />;
    }
    if (type === 'json') {
      return <FieldJson field={field} />;
    }
    if (type === 'object') {
      // return  .stringify(field)
      return <FieldObject field={field} removeField={(e) => removeField(e)} />;
    }
    if (type === 'array') {
      return <FieldArray field={field} />;
    }
    if (type === 'document') {
      return <FieldUploadDocument field={field} />;
    }
    if (type === 'media') {
      return <FieldUploadMedia field={field} />;
    }
    if (type === 'checkbox') {
      return <FieldCheckbox field={field} />;
    }
    if (type === 'checkboxes') {
      return <FieldCheckboxes field={field} />;
    }
    if (type === 'radio') {
      return <FieldCheckbox field={field} />;
    }
    if (type === 'select') {
      return <FieldSelect field={field} />;
    }
    if (type === 'server') {
      return <FieldServer field={field} />;
    }
    if (type === 'number') {
      return <FieldNumber field={field} removeField={(e) => removeField(e)} />;

      // return <Col
      //   sm={size ? size.sm : ''}
      //   lg={size ? size.lg : ''}
      //   className={clsx('MGD', className)}>
      //   <label htmlFor={name}>{t(label)}</label>
      //   <Field
      //     name={name}
      //     component="input"
      //     type="number"
      //     placeholder={placeholder || label}
      //     className="mb-2 form-control"
      //   />
      // </Col>
    }
    if (type === 'textarea') {
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <EveryFields onClick={(e) => removeField(e)} />

          {/* <Field
          name={name}
          component="input"
          type="text"
          placeholder={placeholder || label}
          className="mb-2 form-control"
          style={{height:'200px'}}
        /> */}
          <Field
            name={name}
            className="mb-2 form-control"
            render={({ input, meta }) => (
              <div>
                <textarea {...input} name={name} style={{ width: '100%' }} />
              </div>
            )}
          />
          {/* <textarea
        name={name}
        className="mb-2 form-control"
        >
          
        </textarea> */}
        </Col>
      );
    }
    if (type === 'boolean') {
      return <FieldBoolean field={field} removeField={(e) => removeField(e)} />;
    }
    if (type === 'image') {
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <EveryFields onClick={(e) => removeField(e)} />

          <Field name={name} className="mb-2 form-control">
            {(props) => {
              return (
                <div className={'max-width100'}>
                  {/* {props.input.value && <img style={{ width: "100px" }} src={SERVER_URL + "/" + props.input.value}/>} */}
                  {!props.input.value && (
                    <input
                      name={props.input.name}
                      onChange={(props) => {
                        let { target } = props;
                        uploadMedia(target.files[0], (e) => {})
                          .then(({ data }) => {
                            field.setValue(name, data.url);
                          })
                          .catch((err) => {});
                      }}
                      type={'file'}
                    />
                  )}
                  {props.input.value && (
                    <div className={'posrel'} style={{ margin: '0 auto' }}>
                      <img
                        loading="lazy"
                        alt="img"
                        src={SERVER_URL + props.input.value}
                        style={{ width: '400px' }}
                      />
                      <Button
                        onClick={(e) => {
                          field.setValue(name, '');
                        }}
                        className={'removeImage'}>
                        <RemoveCircleOutlineIcon />
                      </Button>
                    </div>
                  )}
                </div>
              );
            }}
          </Field>
          {/*<Field*/}
          {/*name={field.name}*/}
          {/*onClick={() => {*/}
          {/*}}*/}
          {/*component="input"*/}
          {/*type="file"*/}
          {/*placeholder={placeholder || field.label}*/}
          {/*className="mb-2 form-control"*/}
          {/*/>*/}
          {/*{field.value}*/}
          {/*<Button inline-block  >Choose Media</Button>*/}
        </Col>
      );
    }
    if (type === 'images') {
      return (
        <Col
          sm={size ? size.sm : ''}
          lg={size ? size.lg : ''}
          className={clsx('MGD', className)}>
          <label htmlFor={name}>{label}</label>
          <EveryFields onClick={(e) => removeField(e)} />

          <Field name={name} className="mb-2 form-control">
            {(props) => {
              return (
                <div className={'max-width100'}>
                  {!props.input.value && (
                    <input
                      name={props.input.name}
                      onChange={(props) => {
                        let { target } = props;
                        uploadMedia(target.files[0], (e) => {}).then((x) => {
                          if (x.success && x.media && x.media.url) {
                            field.setValue(name, x.media.url);
                          }
                        });
                      }}
                      type={'file'}
                    />
                  )}
                  {props.input.value && (
                    <img src={SERVER_URL + props.input.value} />
                  )}
                </div>
              );
            }}
          </Field>
          {/*<Field*/}
          {/*name={field.name}*/}
          {/*onClick={() => {*/}
          {/*}}*/}
          {/*component="input"*/}
          {/*type="file"*/}
          {/*placeholder={placeholder || field.label}*/}
          {/*className="mb-2 form-control"*/}
          {/*/>*/}
          {/*{field.value}*/}
          {/*<Button inline-block  >Choose Media</Button>*/}
        </Col>
      );
    }
    if (type === 'chatgpt') {
      return <ChatBase field={field} />;
    }
    if (type === 'conditionRow') {
      return <ConditionRow field={field} childrens={children} />;
    }
  };
  const handleSubmit = async (v) => {
    let values = [];
    if (onSubmit) {
      values = v;
      if (theRules && theRules.fields)
        theRules.fields.forEach((item, i) => {
          if (
            item.type === 'object' &&
            values[item.name] instanceof Array &&
            item.value
          ) {
            let obj = {};
            item.value.forEach((its) => {
              if (its) obj[its.property] = its.value;
            });
            values[item.name] = obj;
          } else {
            // values[item.name] = item.value;
          }
        });
      if (optionInputs) {
        Object.assign(values, { options: optionInputs });
      }
      onSubmit(values);
    }
  };
  const saveInputOptions = (options) => {
    setOptionInputs(options);
  };
  const saveInputCondition = (options) => {
    setOptionInputs(options);
  };
  const removeField = (e, mindex) => {
    let tempR = { ...theRules };
    let p = tempR.fields.filter((element, index) => index !== mindex);

    let px = { fields: p };

    setTheRules(px);
  };

  return (
    <div className="fields pt-2">
      <Form
        onSubmit={handleSubmit}
        // validate={v => {

        //   let values = v;
        //   if (theRules && theRules.fields)
        //     theRules.fields.forEach((item, i) => {
        //       if (item.type == 'object' && values[item.name] instanceof Object && item.value) {
        //         let arr = [];
        //         Object.keys(item.value).forEach((it) => {
        //           let obj = {
        //             property: it,
        //             value: item.value[it]
        //           }
        //           arr.push(obj)
        //         })
        //         values[item.name] = arr;
        //       }
        //     })

        //   // return values
        // }}
        initialValues={fields}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
          // setMin: (args, state, utils) => {
          //   utils.changeValue(state, 'apples', () => 1)
          // },
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} draggable={false}>
            <Container>
              <Row style={{ direction: 'ltr !important' }}>
                {theRules?.fields?.map((field, index) => {
                  if (fields[field.name]) {
                    field.value = fields[field.name];
                  }
                  let lastObj = {
                    id: index,
                    type: field.type,
                    label: field.name,
                    name: field.name,
                    size: {
                      sm: 12,
                    },
                    onChange: (text) => {
                      // setFields([...fields,])
                      // this.state.checkOutBillingAddress.add.data[d] = text;
                    },
                    className: 'mb-2',
                    placeholder: '',
                    child: [],
                    ...field,
                  };
                  if (field.value) {
                    lastObj['value'] = field.value;
                  }

                  return (
                    <TheField
                      key={index}
                      removeField={(e) => removeField(e, index)}
                      {...lastObj}
                      setValue={form.mutators.setValue}
                    />
                  );
                })}

                <ConditionFiled
                  data={fields.options}
                  type={componentType}
                  saveOptions={saveInputOptions}
                />

                <div
                  className="buttons absolute-bottom bottom-bar-settings"
                  style={{ direction: 'ltr' }}>
                  <div
                    className={'d-flex ltr'}
                    style={{ marginBottom: '20px' }}>
                    <input
                      className={'form-control d-flex-inputs'}
                      style={{ height: '45px', padding: '0px 10px' }}
                      value={theF}
                      onChange={(e) => {
                        setTheF(e.target.value);
                      }}
                    />
                    <Button
                      type="button"
                      className={'whitespace-nowrap'}
                      onClick={(e) => {
                        addField(e);
                      }}>
                      <AddCircleOutlineIcon />
                      {'Add Field'}
                    </Button>
                  </div>
                  <hr />
                  <Button type="submit">
                    <SaveIcon />
                    {'Save'}
                  </Button>
                </div>
              </Row>
            </Container>
          </form>
        )}
      />
    </div>
  );
}

export default CreateForm;
