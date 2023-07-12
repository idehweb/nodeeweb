import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Col, Button } from 'shards-react';

import Switch from '@mui/material/Switch';
import { useTranslate } from 'react-admin';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { MainUrl, uploadMedia } from '@/functions/index';

function EveryFields(props) {
  // if(!props.onClick){
  //   return <></>
  // }
  return (
    <Button className={'remove-button'} onClick={props.onClick}>
      <DeleteForeverIcon />
    </Button>
  );
}

export default EveryFields;
