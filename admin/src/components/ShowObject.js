import { List } from 'react-admin';

import { ShowObject } from '@/components';

export default (props) => {
  let valuesArray = Object.keys(props.object1);

  return (
    <table className={'thisIsdiffer'} style={{ padding: 5 }}>
      <tbody>
        {valuesArray.map((item, key) => {
          return (
            <tr style={{ padding: 5, margin: 5 }} key={key}>
              <td style={{ padding: 5, margin: 5 }}>{item}</td>
              <td style={{ padding: 5, margin: 5 }}>
                {props.object1[item] &&
                  typeof props.object1[item] == 'object' && (
                    <ShowObject object1={props.object1[item]} />
                  )}
                {props.object1[item] &&
                  typeof props.object1[item] != 'object' &&
                  props.object1[item].toString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
