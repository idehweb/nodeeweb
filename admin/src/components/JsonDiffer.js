import { useTranslate } from 'react-admin';

import { ShowObject } from '@/components';

import { color } from '@mui/system';

export default (props) => {
  // console.log('props', props);
  const translate = useTranslate();

  if (!props.object1) return;

  let valuesArray = Object.keys(props.object1);

  {
    /* todo ------> change inline styles to globals or reusable sheet */
  }

  return (
    <table className={'thisIsdiffer'} style={{ border: '1px solid white' }}>
      <caption
        style={{
          captionSide: 'top',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
        }}>
        {translate('resources.action.difference')}
      </caption>
      <thead
        style={{
          border: '1px solid white',
          padding: 10,
        }}>
        <tr>
          <th style={{ padding: 5 }}>
            {translate('components.JsonDiffer.fieldName')}
          </th>

          <th>{translate('components.JsonDiffer.new')}</th>
          <th>{translate('components.JsonDiffer.old')}</th>
        </tr>
      </thead>
      <tbody>
        {valuesArray.map((item, key) => {
          // console.log('item',item);

          let trClass = {};
          if (
            typeof props.object1[item] === 'object' &&
            props.object2 &&
            typeof props.object2[item] === 'object'
          ) {
            if (
              JSON.stringify(props.object1[item]) !==
              JSON.stringify(props.object2[item])
            ) {
              trClass = { color: 'red' };
              // trClass = 'makeRed';
            }
          }

          return (
            //todo------------------------>>>>check style below for error in case of no differ
            <tr style={trClass} key={key}>
              {/* <tr className={trClass} key={key}> */}
              <td style={{ padding: 5 }}>{item}</td>
              {/*<td className={'rtl-right'}>{typeof props.object1[item]} - {typeof props.object2[item]}</td>*/}
              <td
                style={{
                  padding: 5,
                  borderLeft: '1px solid white',
                  borderRight: '1px solid white',
                }}>
                {props.object1 && (
                  <div>
                    {props.object1[item] &&
                      typeof props.object1[item] === 'object' && (
                        <ShowObject object1={props.object1[item]} />
                      )}
                    {props.object1[item] &&
                      typeof props.object1[item] !== 'object' &&
                      props.object1[item].toString()}
                  </div>
                )}
              </td>
              <td>
                {props.object2 && (
                  <div>
                    {props.object2[item] &&
                      typeof props.object2[item] === 'object' && (
                        <ShowObject object1={props.object2[item]} />
                      )}
                    {props.object2[item] &&
                      typeof props.object2[item] !== 'object' &&
                      props.object2[item].toString()}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
