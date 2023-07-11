import React from 'react';
import {ReferenceInput, SelectInput, TextInput, useInput} from 'react-admin';
import API from '@/functions/API';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
var ckjhg = {};
var hasTriggered = false;
export default (props) => {
    // console.log('props',props.record.firstCategory);
    const {input} = useInput(props);
    let [data, setData] = React.useState([{
        title: '',
        description: ''
    }]);

    // const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {

        // getData();
        // if (input.value) setV(input.value);
    }, []);

    //
    // const getData = () => {
    //
    //     API.get('' + props.url, {}, {
    //         onUploadProgress: (e) => {
    //             // let p = Math.floor((e.loaded * 100) / e.total);
    //             // setProgress(p);
    //         },
    //     })
    //         .then(({data = []}) => {
    //             console.log('data', data);
    //             var cds = [];
    //             // if(data.isArray()){
    //             //     data.map((uf,s)=>{
    //             //         cds.push({
    //             //             _id:uf._id,
    //             //             name:uf.name
    //             //         })
    //             //     });
    //             // }
    //             // if (data.success) {
    //             // let {url, type, _id} = data.media;
    //             // let a = [...v, {url, type, _id}];
    //             setV(data);
    //             // setProgress(0);
    //             // if (data.media && data.media.url)
    //             //     props.inReturn(data.media.url)
    //             // // console.log('props',props);
    //             // }
    //         })
    //         .catch((err) => {
    //             console.log('error', err);
    //             // setProgress(0);
    //         });
    // };
    const addMap = () => {
        // console.log('data');
        let v = data;
        v.push({
            title: '',
            description: ''
        });
        // setData([]);
        // setData(v);
        // console.log(v);
        data = v;
    };
    React.useEffect(() => {
        // console.log('v changged', data);
        // localStorage.files = JSON.stringify(v);
    }, data);

    // console.log('props',props.record);
    if (data)
        return (
            <>
                {data && data.map((dat, it) => {
                    return (
                        <div key={it}>
                            <TextInput source="title" label="Title"/>
                            <TextInput source="description" label="Description"/>
                        </div>
                    )
                })}
                <button onClick={(e) => {
                    e.preventDefault();
                    addMap()
                }}>+
                </button>


            </>
        );
    else
        return (<></>)
};
