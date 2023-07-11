import * as React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';


const PriceChecker = (props) => {
    const { value,title } = props;
    const translate = useTranslate();
    return (
        <CardWithIcon
            to="#"
            icon={ShoppingCartIcon}
            title={title}
            subtitle={value}
        />
    );
};

export default PriceChecker;
