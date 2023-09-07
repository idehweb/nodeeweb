export const PriceFormat = (p = 0) =>
  p
    .toString()
    // .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// .replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

export const $ = (el) => document.querySelector(el);

export const fNum = (p = '') => p.replace(/^0+(?=\d)/, '');

export const dateFormat = (d) => {
  // console.log('d',d)
  if (d)
    return moment(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      .locale('fa')
      .format('YYYY/MM/DD HH:mm');
};

export function slugify(str = '') {
  return str.trim().replace(/\s/g, '-').toLowerCase();
}

export function toNumber(str = '', def) {
  if (!str) return def;
  const myNum = +str;
  if (isNaN(myNum)) return def;
  return myNum;
}

export function convertError(err) {
  let message = err.message;
  if (err.isAxiosError && err.response?.data?.message)
    message += `\n${err.response?.data?.message}`;
  return message;
}
