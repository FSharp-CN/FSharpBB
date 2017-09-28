import * as Long from "./Long";
import { create as timeSpanCreate } from "./TimeSpan";
import { compare as utilCompare } from "./Util";
export function minValue() {
  return parse(-8640000000000000, 1);
}
export function maxValue() {
  return parse(8640000000000000, 1);
}
/* tslint:disable */
export function parse(v, kind) {
  if (kind == null) {
    kind = typeof v === "string" && v.slice(-1) === "Z" ? 1 /* UTC */ : 2 /* Local */;
  }
  let date = v == null ? new Date() : new Date(v);
  if (isNaN(date.getTime())) {
    // Check if this is a time-only string, which JS Date parsing cannot handle (see #1045)
    if (typeof v === "string" && /^(?:[01]?\d|2[0-3]):(?:[0-5]?\d)(?::[0-5]?\d(?:\.\d+)?)?(?:\s*[AaPp][Mm])?$/.test(v)) {
      const d = new Date();
      date = new Date(d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + v);
    } else {
      throw new Error("The string is not a valid Date.");
    }
  }
  if (kind === 2 /* Local */) {
      date.kind = kind;
    }
  return date;
}
/* tslint:enable */
export function tryParse(v) {
  try {
    return [true, parse(v)];
  } catch (_err) {
    return [false, minValue()];
  }
}
export function create(year, month, day, h = 0, m = 0, s = 0, ms = 0, kind = 2 /* Local */) {
  let date;
  if (kind === 2 /* Local */) {
      date = new Date(year, month - 1, day, h, m, s, ms);
      date.kind = kind;
    } else {
    date = new Date(Date.UTC(year, month - 1, day, h, m, s, ms));
  }
  if (year <= 99) {
    date.setFullYear(year, month - 1, day);
  }
  if (isNaN(date.getTime())) {
    throw new Error("The parameters describe an unrepresentable Date.");
  }
  return date;
}
export function now() {
  return parse();
}
export function utcNow() {
  return parse(null, 1);
}
export function today() {
  return date(now());
}
export function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
export function daysInMonth(year, month) {
  return month === 2 ? isLeapYear(year) ? 29 : 28 : month >= 8 ? month % 2 === 0 ? 31 : 30 : month % 2 === 0 ? 30 : 31;
}
export function toUniversalTime(d) {
  return d.kind === 2 /* Local */ ? new Date(d.getTime()) : d;
}
export function toLocalTime(d) {
  if (d.kind === 2 /* Local */) {
      return d;
    } else {
    const d2 = new Date(d.getTime());
    d2.kind = 2 /* Local */;
    return d2;
  }
}
export function timeOfDay(d) {
  return timeSpanCreate(0, hour(d), minute(d), second(d), millisecond(d));
}
export function date(d) {
  return create(year(d), month(d), day(d), 0, 0, 0, 0, d.kind || 1 /* UTC */);
}
export function kind(d) {
  return d.kind || 1 /* UTC */;
}
export function day(d) {
  return d.kind === 2 /* Local */ ? d.getDate() : d.getUTCDate();
}
export function hour(d) {
  return d.kind === 2 /* Local */ ? d.getHours() : d.getUTCHours();
}
export function millisecond(d) {
  return d.kind === 2 /* Local */ ? d.getMilliseconds() : d.getUTCMilliseconds();
}
export function minute(d) {
  return d.kind === 2 /* Local */ ? d.getMinutes() : d.getUTCMinutes();
}
export function month(d) {
  return (d.kind === 2 /* Local */ ? d.getMonth() : d.getUTCMonth()) + 1;
}
export function second(d) {
  return d.kind === 2 /* Local */ ? d.getSeconds() : d.getUTCSeconds();
}
export function year(d) {
  return d.kind === 2 /* Local */ ? d.getFullYear() : d.getUTCFullYear();
}
export function dayOfWeek(d) {
  return d.kind === 2 /* Local */ ? d.getDay() : d.getUTCDay();
}
export function ticks(d) {
  return Long.fromNumber(d.getTime()).add(62135596800000) // UnixEpochMilliseconds
  .sub(d.kind === 2 /* Local */ ? d.getTimezoneOffset() * 60 * 1000 : 0).mul(10000);
}
export function ofTicks(ticks) {
  return parse(ticks.div(10000).sub(62135596800000).toNumber(), 1 /* UTC */);
}
export function toBinary(d) {
  return ticks(d);
}
export function dayOfYear(d) {
  const _year = year(d);
  const _month = month(d);
  let _day = day(d);
  for (let i = 1; i < _month; i++) {
    _day += daysInMonth(_year, i);
  }
  return _day;
}
export function add(d, ts) {
  return parse(d.getTime() + ts, d.kind || 1 /* UTC */);
}
export function addDays(d, v) {
  return parse(d.getTime() + v * 86400000, d.kind || 1 /* UTC */);
}
export function addHours(d, v) {
  return parse(d.getTime() + v * 3600000, d.kind || 1 /* UTC */);
}
export function addMinutes(d, v) {
  return parse(d.getTime() + v * 60000, d.kind || 1 /* UTC */);
}
export function addSeconds(d, v) {
  return parse(d.getTime() + v * 1000, d.kind || 1 /* UTC */);
}
export function addMilliseconds(d, v) {
  return parse(d.getTime() + v, d.kind || 1 /* UTC */);
}
export function addTicks(d, t) {
  return parse(Long.fromNumber(d.getTime()).add(t.div(10000)).toNumber(), d.kind || 1 /* UTC */);
}
export function addYears(d, v) {
  const newMonth = month(d);
  const newYear = year(d) + v;
  const _daysInMonth = daysInMonth(newYear, newMonth);
  const newDay = Math.min(_daysInMonth, day(d));
  return create(newYear, newMonth, newDay, hour(d), minute(d), second(d), millisecond(d), d.kind || 1 /* UTC */);
}
export function addMonths(d, v) {
  let newMonth = month(d) + v;
  let newMonth_ = 0;
  let yearOffset = 0;
  if (newMonth > 12) {
    newMonth_ = newMonth % 12;
    yearOffset = Math.floor(newMonth / 12);
    newMonth = newMonth_;
  } else if (newMonth < 1) {
    newMonth_ = 12 + newMonth % 12;
    yearOffset = Math.floor(newMonth / 12) + (newMonth_ === 12 ? -1 : 0);
    newMonth = newMonth_;
  }
  const newYear = year(d) + yearOffset;
  const _daysInMonth = daysInMonth(newYear, newMonth);
  const newDay = Math.min(_daysInMonth, day(d));
  return create(newYear, newMonth, newDay, hour(d), minute(d), second(d), millisecond(d), d.kind || 1 /* UTC */);
}
export function subtract(d, that) {
  return typeof that === "number" ? parse(d.getTime() - that, d.kind || 1 /* UTC */) : d.getTime() - that.getTime();
}
export function toLongDateString(d) {
  return d.toDateString();
}
export function toShortDateString(d) {
  return d.toLocaleDateString();
}
export function toLongTimeString(d) {
  return d.toLocaleTimeString();
}
export function toShortTimeString(d) {
  return d.toLocaleTimeString().replace(/:\d\d(?!:)/, "");
}
export function equals(d1, d2) {
  return d1.getTime() === d2.getTime();
}
export function compare(x, y) {
  return utilCompare(x, y);
}
export function compareTo(x, y) {
  return utilCompare(x, y);
}
export function op_Addition(x, y) {
  return add(x, y);
}
export function op_Subtraction(x, y) {
  return subtract(x, y);
}
export function isDaylightSavingTime(x) {
  const jan = new Date(x.getFullYear(), 0, 1);
  const jul = new Date(x.getFullYear(), 6, 1);
  return isDST(jan.getTimezoneOffset(), jul.getTimezoneOffset(), x.getTimezoneOffset());
}
function isDST(janOffset, julOffset, tOffset) {
  return Math.min(janOffset, julOffset) === tOffset;
}