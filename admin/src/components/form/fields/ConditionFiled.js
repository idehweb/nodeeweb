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




function ConditionFiled(props) {
  const translate=useTranslate();
  const {type,data} = props;
  const [condition, setCondition] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [selectOptionValue, setSelectOptionValue] = React.useState('');
  if (type !== 'radio' && type !== 'select' && type !== 'checkbox') {
    return;
  }
  let bindData = [];
  if(data){
    // setOptionValues(data);
    bindData = data;
  }else{
    bindData =
      [
        {
          title: "",
          value : ""
        }
      ]
    ;
  }
  const [optionValues, setOptionValues] = useState(bindData)
  props.saveOptions(optionValues);
  let handleChange = (i, e) => {
    let newFormValues = [...optionValues];
    newFormValues[i][e.target.name] = e.target.value;
    setOptionValues(newFormValues);
  }

  let addFormFields = () => {
    setOptionValues([...optionValues, { title: "", value: "" }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...optionValues];
    newFormValues.splice(i, 1);
    setOptionValues(newFormValues)
  }
  let handleSubmit = (event) => {
    event.preventDefault();
    // props.saveOptions(JSON.stringify(optionValues))
    props.saveOptions(optionValues);
  }
  const handleChangeCondition = (event) => {
    if(optionValues.length <= 1){
      setShowError(true)
      setCondition(false);
    }else{
      setShowError(false)
      setCondition(event.target.checked);
    }
  };
  return (
    <React.Fragment>
      <Form>
        <Container key={'addField'}>
          <Button theme="success" size="sm" onClick={() => addFormFields()}>Add Option</Button>
          {/*<Button theme="info" size="sm" onClick={(e) => handleSubmit(e)}>Save</Button>*/}
          <Row>
            {optionValues.map((element, index) => (
              <Col className={"d-flex justify-content-start"}>
                <FormGroup key={index}>
                  <label htmlFor="title">Title</label>
                  <FormInput id="title" type="text" name="title" value={element.title || ""} onChange={e => handleChange(index, e)} />
                  <label htmlFor="value">Value</label>
                  <FormInput id="value" type="text" name="value" value={element.value || ""} onChange={e => handleChange(index, e)} />
                  {
                    index ?
                      <Button size="sm" theme="danger" onClick={() => removeFormFields(index)}><RemoveCircleOutlineIcon/></Button>
                      : null
                  }
                </FormGroup>
              </Col>
            ))}
          </Row>
        </Container>
        {/*<Container key={'conditionField'}>*/}
        {/*  <FormControlLabel*/}
        {/*    control={*/}
        {/*      <Switch checked={condition} onChange={handleChangeCondition} name="options" />*/}
        {/*    }*/}
        {/*    label="Active Condition"*/}
        {/*  />*/}
        {/*  {*/}
        {/*    condition && (*/}
        {/*      <Row>*/}
        {/*        <label htmlFor="option">*/}
        {/*          select Option : */}
        {/*          <select name="option" id="option" style={{'width':'200px'}}>*/}
        {/*            {*/}
        {/*              optionValues.map((element, index) => (*/}
        {/*                <option value={element.value}>{element.title}</option>*/}
        {/*              ))*/}
        {/*            }*/}
        {/*          </select>*/}
        {/*        </label>*/}


        {/*        <Box sx={{ minWidth: 120 }}>*/}
        {/*          <FormControl >*/}
        {/*            <InputLabel id="demo-simple-select-label">options</InputLabel>*/}
        {/*            <Select*/}
        {/*              labelId="demo-simple-select-label"*/}
        {/*              id="demo-simple-select"*/}
        {/*              value={selectOptionValue}*/}
        {/*              label="option"*/}
        {/*              onChange={(e)=>setSelectOptionValue(e.target.value)}*/}
        {/*            >*/}
        {/*              {*/}
        {/*                optionValues.map((element, index) => (*/}
        {/*                <MenuItem value={element.value}>element.title</MenuItem>*/}
        {/*                ))*/}
        {/*              }*/}
        {/*            </Select>*/}
        {/*          </FormControl>*/}
        {/*        </Box>*/}
        {/*      </Row>*/}
        {/*    )*/}
        {/*  }*/}
        {/*  {*/}
        {/*    showError && (*/}
        {/*      <div style={{'marginTop':'40px','marginBottom':'40px'}}>*/}
        {/*        <Stack sx={{ width: '40%' }} spacing={2}>*/}
        {/*          <Alert severity="error">Please Add Some Option</Alert>*/}
        {/*        </Stack>*/}
        {/*      </div>*/}
        {/*    )*/}
        {/*  }*/}
        {/*</Container>*/}
      </Form>


    </React.Fragment>
  )
}

export default (ConditionFiled);
