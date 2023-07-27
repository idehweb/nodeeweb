import update from 'immutability-helper';
import _cloneDeep from 'lodash/cloneDeep';

const generateID = (tokenLen = 5) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tokenLen; ++i)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
export const generateCompID = (tokenLen = 5) => `cp_${generateID(tokenLen)}`;

export const FindNodeAddress = (item, id, path = '') => {
  let temp = '';
  if (!item) return '';
  else if (Array.isArray(item))
    temp = item
      .map((i, idx) => FindNodeAddress(i, id, `[${idx}]`))
      .filter(Boolean)
      .join('');
  else if (item.id === id) return path;
  else if (Array.isArray(item.children))
    temp = item.children
      .map((i, idx) => FindNodeAddress(i, id, `.children.[${idx}]`))
      .filter(Boolean)
      .join('');

  return temp ? path + temp : '';
};

type ActionTypes = 'remove' | 'push' | 'add';

const getOptAction = (t: ActionTypes, index, value) => {
  switch (t) {
    case 'remove':
      return {
        // remove item at index
        $splice: [[index, 1]],
      };

    case 'add':
      return {
        // add item at index
        $apply: function (x) {
          console.log('before', x, index);
          x = [...x.slice(0, index), value, ...x.slice(index)];
          console.log('after', x);
        },
      };
    case 'push':
      return { $push: [value] };
    default:
      return {};
  }
};

export const mergeObject = (path, opt: ActionTypes, value = undefined) => {
  const temp: string = path.split('.').pop();
  const index = Number(temp.replace(/\[|]/gi, ''));

  const arr = path.split('.');
  let newObj = {};
  const lastIndex = arr.length - 1;
  if (lastIndex === 0) newObj = getOptAction(opt, index, value);
  else {
    arr.reduce((obj, i, idx) => {
      let key = i;
      if (/^\[\d\]$/i.test(key)) {
        key = key.replace(/\[|]/gi, '');
        key = Number(key);
      }
      if (idx === lastIndex - 1) {
        console.log('last item');
        obj[key] = getOptAction(opt, index, value);
      } else obj[key] = {};

      return obj[key];
    }, newObj);
  }

  console.log('newObj', newObj);
  return newObj;
};

const isSameLevel = (source, dest) => {};

// const PushTo

export const DeleteItem = (id, arr) => {
  if (!id) return;
  const address = FindNodeAddress(arr, id);
  const action = mergeObject(address, 'remove');

  return update(arr, action);
};
