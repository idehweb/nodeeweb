export function getSeoEventName(opts: {
  pre?: boolean;
  post?: boolean;
  entity?: string;
}) {
  return `${opts.pre ? 'pre' : 'post'}-${
    opts.entity ? opts.entity : 'all'
  }-seo`;
}
