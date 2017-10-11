import { some } from "../fable-core/Util";
export function tuple(a, b) {
  const matchValue = [a, b];
  const $var1 = matchValue[0] != null ? matchValue[1] != null ? [0, matchValue[0], matchValue[1]] : [1] : [1];

  switch ($var1[0]) {
    case 0:
      return [$var1[1], $var1[2]];

    case 1:
      return null;
  }
}
export function ofFunc(f, arg) {
  try {
    return some(f(arg));
  } catch (matchValue) {
    return null;
  }
}