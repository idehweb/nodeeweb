// in LatLongInput.js
import React from 'react';

import TextField from '@mui/material/TextField';
import AdapterJalali from '@date-io/date-fns-jalali';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useInput } from 'react-admin';

const ReactAdminJalaliDateInput = (props) => {
  const [value, setValue] = React.useState('');
  const { onChange, onBlur, ...rest } = props;
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    // Pass the event handlers to the hook but not the component as the field property already has them.
    // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
    onChange,
    onBlur,
    ...props,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterJalali}>
      {/*<TextField*/}
      {/*{...field}*/}
      {/*label={props.label}*/}
      {/*error={(isTouched || isSubmitted) && invalid}*/}
      {/*helperText={(isTouched || isSubmitted) && invalid ? error : ""}*/}
      {/*required={isRequired}*/}
      {/*{...rest}*/}
      {/*/>*/}
      <DatePicker
        mask="____/__/__"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderInput={(params) => (
          <TextField
            onChange={(newValue) => setValue(newValue)}
            {...field}
            {...params}
            {...rest}
          />
        )}
      />
    </LocalizationProvider>
  );
};
// const LatLngInput = () => (
//   <span>
//         <BoundedTextField name="lat" label="latitude" />
//     &nbsp;
//     <BoundedTextField name="lng" label="longitude" />
//     </span>
// );
//
// import React, {Component} from 'react';
// import {Labeled} from 'react-admin'
// import {Field} from 'redux-form';
// import renderDatePicker from './RenderDatePicker'
// import moment from "moment"
//
// class ReactAdminJalaliDateInput extends Component {
//
//   render() {
//     return <Field
//       name={this.props.source}
//       placeholderText={this.props.label}
//       inputValueFormat="YYYY-MM-DD"
//       dateFormat="L"
//       dateFormatCalendar="dddd"
//       fixedHeight
//       showMonthDropdown
//       showYearDropdown
//       dropdownMode="select"
//       normalize={value => (value ? moment.unix(value).format('YYYY-MM-DD') : null)}
//       component={renderDatePicker}
//     />
//   }
// }
//
export default ReactAdminJalaliDateInput;
