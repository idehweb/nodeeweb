import update from 'immutability-helper';

const generateID = (tokenLen = 5) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tokenLen; ++i)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
const generateCompID = (tokenLen = 5) => `cp_${generateID(tokenLen)}`;

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

type ActionTypes = 'remove' | 'add' | 'addToIndex';

const getOptAction = (t: ActionTypes, index, value) => {
  switch (t) {
    case 'remove':
      // remove item at index
      return {
        $splice: [[index, 1]],
      };

    case 'addToIndex':
      // add item at index
      return {
        $apply: function (x) {
          return [...x.slice(0, index), value, ...x.slice(index)];
        },
      };
    case 'add':
      return { $push: [value] };
    default:
      return {};
  }
};

export const makeAction = (path, opt: ActionTypes, value = undefined) => {
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
      obj[key] = {};

      if (opt === 'add' && idx === lastIndex)
        obj[key] = getOptAction(opt, index, value);
      else if (opt !== 'add' && idx === lastIndex - 1) {
        obj[key] = getOptAction(opt, index, value);
      }

      return obj[key];
    }, newObj);
  }

  return newObj;
};

export const AddItem = (id, arr, value) => {
  let address = FindNodeAddress(arr, id);
  if (address !== '') address += '.children';

  const action = makeAction(address, 'add', {
    ...value,
    children: [],
    id: generateCompID(),
  });

  return update(arr, action);
};

export const DeleteItem = (id, arr) => {
  if (!id) return;
  const address = FindNodeAddress(arr, id);
  const action = makeAction(address, 'remove');

  return update(arr, action);
};
