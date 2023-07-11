import React, { useEffect, useState } from "react";
import { useTranslate } from 'react-admin';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Form, FormGroup, FormInput ,Button} from "shards-react";
import { Container, Row, Col } from "shards-react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';




function ConditionRow(props) {
  const translate=useTranslate();
  let {type,childrens,saveOptions} = props;
  const [inputs,setInputs] = useState(childrens);
    const handleChange = (e) =>{
        console.log('eeeeeeeeeeeeeeeeee',e);
    }
 
  if (type === "conditionRow") 
  return (
<>

</>
  )
}

export default (ConditionRow);
