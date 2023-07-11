
export const PriceFormat = (p = 0) =>
  p
    .toString()
    // .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// .replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

export const $ = (el) => document.querySelector(el);

export const fNum = (p = "") => p.replace(/^0+(?=\d)/, "");

export const dateFormat = (d) => {
  // console.log('d',d)
  if (d)
    return moment(d, "YYYY-MM-DDTHH:mm:ss.SSSZ").locale("fa").format("YYYY/MM/DD HH:mm");
}
