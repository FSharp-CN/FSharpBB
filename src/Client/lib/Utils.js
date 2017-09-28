import { defaultArg } from "./fable-core/Util";
export function load(key) {
  return defaultArg(localStorage.getItem(key), null, $var1 => function (value) {
    return value;
  }(function (arg00) {
    return JSON.parse(arg00);
  }($var1)));
}
export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function _delete(key) {
  localStorage.removeItem(key);
}

export { _delete as delete };