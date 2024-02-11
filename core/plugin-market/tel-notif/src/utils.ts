export async function call<A extends Array<any>, R>(
  fn: (...args: A) => R | Promise<R>,
  ...args: A
) {
  let result = fn(...args);
  while (result instanceof Promise) {
    result = await result;
  }
  return result as R;
}
