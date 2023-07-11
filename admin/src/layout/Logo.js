import * as React from 'react';
import { SVGProps } from 'react';
import { useTheme } from '@mui/styles';
// import logo from '../assets/img/logo.png';

const Logo = (props) => {
    const theme = useTheme();
    return (
        <div
            width={234.532}
            height={20.475}
            {...props}
        >
            {/*<img style={{width: '40px'}} src={logo}/>*/}

        </div>
    );
};

export default Logo;
