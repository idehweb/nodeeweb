import React from 'react';
import { FileField, FileInput, useInput } from 'react-admin';

import Button from '@mui/material/Button';
import { useFormState } from 'react-final-form';

import API, { BASE_URL } from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
  // console.log('useFormState',useFormState());
  let { values } = useFormState();

  // const {input} = useInput(props);
  const [v, setV] = React.useState(props.record.thumbnail || '');
  // const [v, setV] = React.useState(props.record.thumbnail || '');
  const [progress, setProgress] = React.useState(false);
  React.useEffect(() => {
    console.log('React.useEffect props', values);
  }, values);
  // console.log('showFils', props);
  // console.clear();
  // console.log('props'/, props);
  const deletFromObject = (e, photo, key) => {
    e.preventDefault();
    // console.log('e', e, photo, key);
    var cc = [];
    // console.log('values.photos',values.photos);

    values.photos.forEach((item) => {
      if (item !== photo) {
        cc.push(item);
      }
    });
    values.photos = cc;
    props.setPhotos(values.photos);
    setProgress(!progress);
    // console.log('values.photos',values.photos);
  };
  return (
    <div className={'galley'}>
      {values.photos &&
        values.photos.length > 0 &&
        values.photos.map((photo, key) => {
          // console.log('photo', photo);
          // console.log('v', v);
          return (
            <div
              key={key}
              className={'hytrdf ' + (v === photo ? 'active' : '')}>
              <img
                onClick={() => {
                  props.thep(photo);
                  setV(photo);
                }}
                src={BASE_URL + '/' + photo}
              />
              <div className={'bottom-actions'}>
                <Button onClick={(e) => deletFromObject(e, photo, key)}>
                  delete
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
};
