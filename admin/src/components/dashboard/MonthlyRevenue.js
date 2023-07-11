import * as React from 'react';
import DollarIcon from '@mui/icons-material/AttachMoney';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';



const MonthlyRevenue = (props) => {
    const { value ,title,to} = props;
    const translate = useTranslate();
    return (
        <CardWithIcon
            to={to}
            icon={DollarIcon}
            title={title}
            subtitle={value}
        />
    );
};

export default MonthlyRevenue;
