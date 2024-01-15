import { Field } from 'react-final-form';
import { Col } from 'shards-react';

import { useTranslate } from 'react-admin';

import { useState } from 'react';

import { EveryFields } from '@/components/form/fields';

/**
 * Component Name: FieldObject
 *
 * Description: This component renders a field in a form, handling both single-language and multilingual input.
 *
 * Props:
 *
 *   - `field`: An object containing the field's configuration, including:
 *       - `kind`: The type of field, either `single` or `multiLang`
 *       - `size`: The size of the field, either `sm` or `lg` (default)
 *       - `className`: A class name to apply to the field
 *       - `name`: The name of the field
 *       - `label`: The label for the field (optional)
 *       - `placeholder`: The placeholder text for the input (optional)
 *       - `value`: The current value of the field (optional)
 *       - `setValue`: A callback function to set the value of the field
 *   - `removeField`: A callback function to remove the field from the form
 *
 * Returns:
 *
 *   A React component that renders the field based on the `kind` prop. For single-language fields, it renders a text input with the field's label and value. For multilingual fields, it renders a set of key-value pairs, where each pair has a text input for the key and a text input for the value.
 *
 */

function FieldObject(props) {
  const t = useTranslate();

  const { field, removeField } = props;
  const { kind, size, className, name, label, placeholder, value, setValue } =
    field;

  console.log('field value given from higher component is : ', value);

  const [fieldValue, setFieldValue] = useState<string>('');

  return kind === 'multiLang' ? (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>
      <EveryFields onClick={(e) => removeField(e)} />

      <Field name={name} className="mb-2 form-control">
        {(props) => {
          let { input } = props;
          let obj = {};

          if (input.value) {
            obj = input.value;
          }
          if (Object.keys(obj).length === 0) {
            obj = { '': '' };

            const InputField = Object.keys(obj).map((theKey, inx) => {
              return (
                <div className={'max-width100'}>
                  <div className={'width-less'}>
                    <label htmlFor={theKey}>the key</label>
                    <input
                      name={props.input.name}
                      className={'ltr form-control'}
                      type={'text'}
                      value={theKey || 'fa'}
                      placeholder={'key'}
                    />
                  </div>
                  <div className={'width-more'}>
                    <label htmlFor={name}>value</label>
                    <input
                      className={'form-control'}
                      name={props.input.name}
                      onChange={(e) => {
                        let obj = {};
                        console.log('value is ', value);
                        obj['fa'] = e.target.value;
                        let tt = value;
                        tt['fa'] = obj['fa'];
                        setValue(tt);
                        field.setValue(name, obj);
                      }}
                      type={'text'}
                      placeholder={'value'}
                      value={value['fa']}
                    />
                  </div>
                </div>
              );
            });
            return InputField;
          }
        }}
      </Field>
    </Col>
  ) : (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{t(label)}</label>
      <EveryFields onClick={(e) => removeField(e)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {value && (value as Object).toString() !== '[object Object]'
          ? (value as Object).toString()
          : 'Example : {"example.attributes":"Something"}'}

        <input
          name={name}
          type="text"
          value={fieldValue.toString()}
          placeholder={placeholder ? placeholder : name}
          onChange={(e) => {
            setFieldValue(e.target.value);
            setValue(name, e.target.value);
          }}
          className="mb-2 form-control ltr"
        />
      </div>
    </Col>
  );
}

export default FieldObject;
