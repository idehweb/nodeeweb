import React, { useState } from "react";
// import MuiGridList from '@mui/material/GridList';
import { Button } from "@mui/material";
import { SketchPicker } from "react-color";
import { useInput } from "react-admin";

const ColorPicker = (props) => {
  // console.log("props",props);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [theColor, setTheColor] = useState(props.color || "#000");
  // let {onChange} = props;
  const { onChange, onBlur, onChangeComplete=()=>{}, ...rest } = props;

  const onTheChange = ({ hex }) => setTheColor(hex);
  const handleChangeComplete = ({ hex }) => {
    onChangeComplete(hex);
    setTheColor(hex); 
  };


  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired
  } = useInput({
    onChange,
    onBlur,
    ...props
  });


  return <div className={'posrel'}>
    <Button className={"the-color-swatch"} onClick={() => setDisplayColorPicker(true)}>
      <div style={{ backgroundColor: theColor }} className={"the-color"}/>
    </Button>
    {displayColorPicker && <div className={"the-color-popover"}>
      <div className={"the-color-cover"} onClick={() => setDisplayColorPicker(false)}/>
      <SketchPicker {...field} {...rest} onChange={(e) => onTheChange(e)} color={theColor}
                    onChangeComplete={(e) => handleChangeComplete(e)}/>x</div>}
  </div>;
};

export default ColorPicker;
