import React from 'react';
import AdapterJalali from '@date-io/date-fns-jalali';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslate } from 'react-admin';

const FilterWithDate = (props) => {
  const { type, handlerChangeFilter } = props;
  const [value, setValue] = React.useState(null);
  const translate = useTranslate();

  return (
    <LocalizationProvider dateAdapter={AdapterJalali}>
      <span style={{ position: 'relative', top: '8px' }}>
        <DatePicker
          mask="____/__/__"
          className={type}
          label={translate('pos.filter.' + type)}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            handlerChangeFilter(newValue, type);
          }}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      </span>
    </LocalizationProvider>
  );
};
export default FilterWithDate;
