import React from 'react';
import {ReferenceInput, SelectInput, useInput,TextInput} from 'react-admin';
import API from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
var ckjhg = {};
var hasTriggered = false;
export default (props) => {
    // console.log('sections', props.record.sections);
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


    return (
        <>

            {props.record.sections && props.record.sections.map((item,index)=>{
                if(item.title=='شرح محصول'){
                    // console.log('شرح محصول')
                    return  <TextInput
                        key={index}
                        fullWidth
                        multiline
                        source="item.content"
                        label="توضیحات"
                        value={item.content}
                        // validate={Val.req}
                    />
                }
                // return (item)+" : "+props.record.options[item];
            })}


        </>
    );

};
