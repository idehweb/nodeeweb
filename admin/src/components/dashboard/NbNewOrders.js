import * as React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTranslate } from 'react-admin';
import DollarIcon from '@mui/icons-material/AttachMoney';

import CardWithIcon from './CardWithIcon';


const NbNewOrders = (props) => {
    const { value,title } = props;
    const translate = useTranslate();
    return (
        <CardWithIcon
            to="/order"
            icon={DollarIcon}
            title={title}
            subtitle={value}
        />
    );
};

export default NbNewOrders;
