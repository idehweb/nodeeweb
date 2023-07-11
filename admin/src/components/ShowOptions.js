import React from 'react';
import {ReferenceInput, SelectInput, useInput} from 'react-admin';
import API from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
var ckjhg = {};
var hasTriggered = false;
export default (props) => {
    const {options}=props.record;
  // console.log('Show Options... ',options);

  // const {input} = useInput(props);
    // const [v, setV] = React.useState([]);
    // const [g, setG] = React.useState([]);
    // const [d, setD] = React.useState([]);
    // const [progress, setProgress] = React.useState(0);

    // React.useEffect(() => {
    //
    //     getData();
    //     // if (input.value) setV(input.value);
    // }, []);
    // console.log('Object.keys(options)', Object.keys(options));
    return (
        <>
            {options && Object.keys(options).map((item, index) => {
                return <div key={index}>{(item) + " : " + options[item] + "\n"}</div>;
            })}
        </>
    );

};
