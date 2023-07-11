import {List} from 'react-admin';
import {ShowObject} from '@/components';

export default (props) => {
    let valuesArray = Object.keys(props.object1);

    return (
        <table className={'thisIsdiffer'}>
            <tbody>
            {valuesArray.map((item,key) => {

                return <tr key={key}>
                    <td>{item}</td>
                    <td>

                        {props.object1[item] && typeof props.object1[item] == 'object' && <ShowObject object1={props.object1[item]}/>}
                        {props.object1[item] && typeof props.object1[item] != 'object' && props.object1[item].toString()}

                    </td>

                </tr>;
            })
            }
            </tbody>
        </table>
    );

}
