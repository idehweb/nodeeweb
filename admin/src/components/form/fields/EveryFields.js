import React, { useState } from 'react';
import { Col, Button } from 'shards-react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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
