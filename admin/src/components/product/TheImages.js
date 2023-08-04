import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import { ImageField, ImageInput, useInput } from 'react-admin';

import { useWatch } from 'react-hook-form';

import DeleteIcon from '@mui/icons-material/Delete';

import API, { BASE_URL } from '@/functions/API';
import { ShowImageField } from '@/components';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
  let { gallery, v, onImageClick, deletFromObject } = props;

  // const onImageAlt = (e) =>{
  //   console.log("Images...ssssssssssssss ",e.target.value);
  // }
  return (
    <div className={'galley'}>
      {gallery &&
        gallery.length > 0 &&
        gallery.map((photo, key) => {
          return (
            <>
              <ShowImageField
                photo={photo}
                onImageClick={onImageClick}
                deletFromObject={deletFromObject}
                v={v}
                key={key}
                unicKey={key}
              />
            </>
          );
        })}
    </div>
  );
};
