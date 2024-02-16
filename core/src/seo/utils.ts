import { HTMLElement } from 'node-html-parser';

export function getSeoEventName(opts: {
  pre?: boolean;
  post?: boolean;
  entity?: string;
}) {
  return `${opts.pre ? 'pre' : 'post'}-${
    opts.entity ? opts.entity : 'all'
  }-seo`;
}

export function insertMeta(
  root: HTMLElement,
  obj: { [key in string]: string }
) {
  const head = root.querySelector('head');

  Object.entries(obj).forEach(([k, v]) => {
    head.insertAdjacentHTML('beforeend', `<meta name="${k}" content="${v}" />`);
  });
}
