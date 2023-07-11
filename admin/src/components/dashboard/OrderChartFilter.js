import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function OrderChartFilter(props) {
  const {handleChangeStatusFilter} = props;
  const [status, setStatus] = React.useState('');



  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Status"
          onChange={(e)=>{
            setStatus(e.target.value);
            handleChangeStatusFilter(e.target.value);
          }}
        >
          <MenuItem disabled value="">
            <em>Please Select</em>
          </MenuItem>
          <MenuItem value={"paidStatus"}>paid</MenuItem>
          <MenuItem value={"completeStatus"}>complete</MenuItem>
          <MenuItem value={"totalStatus"}>total</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
