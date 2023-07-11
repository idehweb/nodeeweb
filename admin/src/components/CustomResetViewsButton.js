// in ./CustomResetViewsButton.js
// import * as React from "react";
import React from 'react';

import {Button, TextInput, useNotify, useRefresh, useUnselectAll, useUpdateMany} from 'react-admin';
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material';

const CustomResetViewsButton = (props) => {
    let selectedIds = props.selectedIds;
    let the_id = props.the_id || '';
    // console.log('selectedId');
    const refresh = useRefresh();
    const notify = useNotify();
    const [Number, setNumber] = React.useState(0);
    const [Type, setType] = React.useState('darsad');
    const [MainType, setMainType] = React.useState(null);

    const unselectAll = useUnselectAll();
    const [updateMany, {loading, error}] = useUpdateMany(
        'product/modifyPriceByCat/' + the_id,
        selectedIds,
        {
            number: Number,
            type: MainType
        },
        {
            onSuccess: () => {
                console.log('onSuccess')
                refresh();
                notify('Posts updated');
                unselectAll('posts');
            },
            onFailure: (error) => {
                console.log('onFailure')

                refresh();
                notify('Error: posts not updated', {type: 'warning'})
            }
        }
    );
    React.useEffect(() => {
        console.log('effect MainType', MainType);
        if (MainType)
            updateMany();

        // getData();
        // if (input.value) setV(input.value);
    }, [MainType]);
    const updateThem = (val) => {
        // return new Promise(function (resolve, reject) {

        let type = 'plusx';
        if (val == 'plus') {
            if (Type == 'darsad') {
                type = 'plusx';
            } else if (Type == 'toman') {
                type = 'plusxp';

            }
        }
        if (val == 'min') {
            if (Type == 'darsad') {
                type = 'minusx';
            } else if (Type == 'toman') {
                type = 'minusxp';

            }
        }
        console.log('val,type,Type', val, type, Type);
        setMainType(type);

        // resolve(type);
        // });
        // updateMany().then(function () {
        //     refresh();
        //     notify('Posts updated');
        //     unselectAll('posts');
        // }).cache(err=>{
        //     console.log('hi');
        // })
        // updateMany('posts', selectedIds, { views: 0 });
    };
    const onInputChange = (val) => {
        console.log(val);
        setNumber(val.target.value);
    };
    const onSelectChange = (val) => {
        console.log(val.target.value);
        setType(val.target.value);
    };
    return (
        [<input
            className={'helllyeah'}
            value={Number}
            onChange={onInputChange}/>,
            <select
                onChange={onSelectChange}>
                <option value={'darsad'}>درصد</option>
                <option value={'toman'}>تومان</option>
            </select>,
            <Button
                label="اضافه کن"
                // disabled={loading}
                onClick={() => {
                    updateThem('plus')
                }}>
                <AddCircleOutline/>
            </Button>,
            <Button
                label="کم کن"
                // disabled={loading}
                onClick={() => {
                    updateThem('min')
                }}>
                <RemoveCircleOutline/>
            </Button>]
    );
};

export default CustomResetViewsButton;