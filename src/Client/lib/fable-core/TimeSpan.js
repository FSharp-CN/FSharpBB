import * as Long from "./Long";
import { compare as utilCompare } from "./Util";
export function create(d = 0, h = 0, m = 0, s = 0, ms = 0) {
  switch (arguments.length) {
    case 1:
      // ticks
      return fromTicks(arguments[0]);
    case 3:
      // h,m,s
      d = 0, h = arguments[0], m = arguments[1], s = arguments[2], ms = 0;
      break;
    default:
      // d,h,m,s,ms
      break;
  }
  return d * 86400000 + h * 3600000 + m * 60000 + s * 1000 + ms;
}
export function fromTicks(ticks) {
  return ticks.div(10000).toNumber();
}
export function fromDays(d) {
  return create(d, 0, 0, 0);
}
export function fromHours(h) {
  return create(h, 0, 0);
}
export function fromMinutes(m) {
  return create(0, m, 0);
}
export function fromSeconds(s) {
  return create(0, 0, s);
}
export function days(ts) {
  return Math.floor(ts / 86400000);
}
export function hours(ts) {
  return Math.floor(ts % 86400000 / 3600000);
}
export function minutes(ts) {
  return Math.floor(ts % 3600000 / 60000);
}
export function seconds(ts) {
  return Math.floor(ts % 60000 / 1000);
}
export function milliseconds(ts) {
  return Math.floor(ts % 1000);
}
export function ticks(ts) {
  return Long.fromNumber(ts).mul(10000);
}
export function totalDays(ts) {
  return ts / 86400000;
}
export function totalHours(ts) {
  return ts / 3600000;
}
export function totalMinutes(ts) {
  return ts / 60000;
}
export function totalSeconds(ts) {
  return ts / 1000;
}
export function negate(ts) {
  return ts * -1;
}
export function add(ts1, ts2) {
  return ts1 + ts2;
}
export function subtract(ts1, ts2) {
  return ts1 - ts2;
}
export function compare(x, y) {
  return utilCompare(x, y);
}
export function compareTo(x, y) {
  return utilCompare(x, y);
}
export function duration(x) {
  return Math.abs(x);
}