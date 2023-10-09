import React from 'react';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';

import API, { SERVER_URL } from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
  let {
    photo,
    v,
    onImageClick,
    deletFromObject,
    unicKey,
    className = '',
    deleteFunction = true,
  } = props;
  // const funSetAlt = (e) =>{
  //   onImageAlt = {
  //     photo:photo,
  //     alt:e.target.value,
  //   }
  // }
  return (
    <div className={className + ' hytrdf ' + (v === photo ? 'active' : '')}>
      <img onClick={() => onImageClick(photo)} src={SERVER_URL + photo} />
      <div className="d-flex">
        <div className={'bottom-actions'}>
          {deleteFunction && (
            <Button onClick={() => deletFromObject(photo, unicKey)}>
              <DeleteIcon />
            </Button>
          )}
        </div>
        <div>
          {/* <input type="text" name={'alt-'+unicKey} onChange={onImageAlt} placeholder="alt"/> */}
        </div>
      </div>
    </div>
  );
};
