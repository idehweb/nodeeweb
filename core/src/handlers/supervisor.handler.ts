import ss from '../supervisor/service';

export function registerFuncSupervisor(
  key: string,
  func: (...args: any) => any
) {
  ss.addFunc(key, func);
}
export function unregisterFuncSupervisor(key: string) {
  ss.rmFunc(key);
}
