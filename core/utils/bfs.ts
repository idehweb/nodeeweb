export type BFSInfo = { parent: any; key: string | number; value: any };

function getEntries(obj: any) {
  const keys = Object.getOwnPropertyNames(obj);
  return keys.map((k) => [k, obj[k]]);
}

export default function bfs(target: any, cb: (info: BFSInfo) => void) {
  const stack: BFSInfo[] = [{ parent: null, key: null, value: target }];
  do {
    const { parent, key, value } = stack.pop();
    if (Array.isArray(value)) {
      stack.push(...value.map((c, i) => ({ parent: value, key: i, value: c })));
    } else if (typeof value === 'object') {
      stack.push(
        ...getEntries(value).map(([k, v]) => ({
          parent: value,
          key: k,
          value: v,
        }))
      );
    } else {
      cb({ parent, key, value });
    }
  } while (stack.length);
}
