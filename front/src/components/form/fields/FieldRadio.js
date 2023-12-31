import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';
import { getEntitiesForAdmin, MainUrl, uploadMedia } from '#c/functions/index';

function FieldRadio(props) {
  let { field, t } = props;
  console.log(field);
  let {
    type,
    style,
    kind,
    size,
    className,
    entity,
    searchbox = true,
    limit = 1000,
    name,
    options = [],
    label,
    placeholder,
    value,
  } = field;
  let [radios, setRadios] = useState(options);
  let [search, setSearch] = useState('');
  useEffect(() => {
    if (limit) {
      limit = parseInt(limit);
    }
    if (entity && radios.length === 0)
      getEntitiesForAdmin(entity, 0, limit)
        .then((d) => {
          setRadios(d);
        })
        .catch((e) => {});
  }, []);
  useEffect(() => {
    //   if (options != checkboxes)
    //     setCheckBoxes([...options])
  }, []);

  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <Field
        name={name}
        // initialValue={()=> []}
      >
        {({ input, meta }) => {
          return (
            <div>
              <label htmlFor={name}>{label}</label>
              <div className={'d-flex '}>
                {radios &&
                  radios.map((ch, i) => {
                    return (
                      <label key={i} className={'checkbox-items p-1'}>
                        <Field
                          name={name}
                          component="input"
                          style={style}
                          type="radio"
                          value={ch.value}
                        />
                        <span>{ch.title}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          );
        }}
      </Field>
    </Col>
  );
}

export default withTranslation()(FieldRadio);
