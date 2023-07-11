import React from 'react';
import {LinearProgress} from '@mui/material';
import {FileField, FileInput, useInput} from 'react-admin';
import {API,BASE_URL} from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
    const {input} = useInput(props);
    const [v, setV] = React.useState([]);
    const [progress, setProgress] = React.useState(0);
    React.useEffect(() => {
        // console.log('React.useEffect props',props);

    }, props);
    // console.log('showFils', props);

    return (
        <>


        </>
    );
};
