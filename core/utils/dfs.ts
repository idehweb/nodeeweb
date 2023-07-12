export type DFSInfo = { parent: any; key: string | number; value: any };

export default function dfs(target: any, cb: (info: DFSInfo) => void) {
  const stack: DFSInfo[] = [{ parent: null, key: null, value: target }];
  do {
    const { parent, key, value } = stack.pop();
    if (Array.isArray(value)) {
      stack.push(...value.map((c, i) => ({ parent: value, key: i, value: c })));
    } else if (typeof value === "object") {
      stack.push(
        ...Object.entries(value).map(([k, v]) => ({
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
