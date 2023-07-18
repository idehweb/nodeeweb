import store from '../store';

export const Colors = {
  Black: '\u001b[30m',
  Red: '\u001b[31m',
  Green: '\u001b[32m',
  Yellow: '\u001b[33m',
  Blue: '\u001b[34m',
  Magenta: '\u001b[35m',
  Cyan: '\u001b[36m',
  White: '\u001b[37m',
  Reset: '\u001b[0m',
};

export function color(colorCode: keyof typeof Colors, str: string) {
  if (!store.env.isLoc) return str;
  return `${Colors[colorCode]}${str}${Colors.Reset}`;
}

export function red(str: string) {
  return color('Red', str);
}
export function blue(str: string) {
  return color('Blue', str);
}
export function green(str: string) {
  return color('Green', str);
}
export function yellow(str: string) {
  return color('Yellow', str);
}
export function magenta(str: string) {
  return color('Magenta', str);
}
export function White(str: string) {
  return color('White', str);
}
export function cyan(str: string) {
  return color('Cyan', str);
}
export function black(str: string) {
  return color('Black', str);
}
