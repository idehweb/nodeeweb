import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { dFormat, PriceFormat } from "#c/functions/utils";
const PriceFilter = (props)=> {
  const [value, setValue] = React.useState([0, 100000000]);
  const handleChange = (event, newValue) => {
    props.handlerPriceChange(newValue)
    setValue(newValue);
  }
  return (
    <Box sx={{ width: '90%' }} style={{margin:'5px 10px'}}>
      <Slider
      min={1000000}
      max={100000000}
      step={10}
        getAriaLabel={() => 'Minimum distance'}
        value={value}
        onChange={handleChange}
        // valueLabelDisplay="auto"
        // getAriaValueText={'تومان'}
        disableSwap
      />
      <p style={{fontSize:'12px'}}>
        {/* <span>قیمت :</span> */}
        <span style={{fontWeight:'bold'}}>  {PriceFormat(value[0])} تومان </span>
        <span style={{margin:'0px 5px'}}>تا</span>
        <span style={{fontWeight:'bold'}}>{PriceFormat(value[1])}  تومان</span>
        
        
      </p>
    </Box>
  );
}
export default React.memo(PriceFilter)
