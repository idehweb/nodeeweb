import React from 'react';
import Box from '@mui/material/Box';
import { useGetList } from 'react-admin';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import FilterWithDate from '@/components/dashboard/base/FilterWithDate';

const OrderDateChartFilters = (props) => {
  const { handleChangeStatus, handlerStart, handlerEnd, model } = props;
  const [status, setStatus] = React.useState('');
  React.useEffect(() => {});

  const startHandler = (dateValue) => {
    handlerStart(dateValue);
  };
  const endHandler = (dateValue) => {
    handlerEnd(dateValue);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      {/*<FormControl sx={{ m: 1, minWidth: 120 }} size="small">*/}
      {/*  <InputLabel id="demo-simple-select-label">انتخاب وضعیت</InputLabel>*/}
      {/*  <Select*/}
      {/*    labelId="demo-simple-select-label"*/}
      {/*    id="demo-simple-select"*/}
      {/*    value={status}*/}
      {/*    label="form"*/}
      {/*    onChange={(e)=>{*/}
      {/*      setStatus(e.target.value);*/}
      {/*      handleChangeStatus(e.target.value);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <MenuItem disabled value="">*/}
      {/*      <em>Please Select</em>*/}
      {/*    </MenuItem>*/}
      {/*    /!*<MenuItem  value="all">*!/*/}
      {/*    /!*  <em>نمایش همه</em>*!/*/}
      {/*    /!*</MenuItem>*!/*/}
      {/*    {*/}
      {/*      forms &&  forms.map((form,index)=>*/}
      {/*        <MenuItem key={index} value={form._id}>{form.title.fa}</MenuItem>*/}
      {/*      )*/}
      {/*    }*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}
      <FilterWithDate type={'startDate'} handlerChangeFilter={startHandler} />
      <FilterWithDate type={'endDate'} handlerChangeFilter={endHandler} />
    </Box>
  );
};
export default OrderDateChartFilters;
