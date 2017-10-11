import FSymbol from "./Symbol";
export class NonDeclaredType {
  constructor(kind, definition, generics) {
    this.kind = kind;
    this.definition = definition;
    this.generics = generics;
  }
  Equals(other) {
    if (this.kind === other.kind && this.definition === other.definition) {
      return typeof this.generics === "object" ? equalsRecords(this.generics, other.generics) : this.generics === other.generics;
    }
    return false;
  }
}
export const Any = new NonDeclaredType("Any");
export const Unit = new NonDeclaredType("Unit");
export function Option(t) {
  return new NonDeclaredType("Option", null, [t]);
}
// HACK: For unit values use a truthy empty object (see #478, #1135, #1136)
export function some(value) {
  return value == null ? {} : value;
}
function FableArray(t, isTypedArray = false) {
  let def = null;
  let genArg = null;
  if (isTypedArray) {
    def = t;
  } else {
    genArg = t;
  }
  return new NonDeclaredType("Array", def, [genArg]);
}
export { FableArray as Array };
export function Tuple(types) {
  return new NonDeclaredType("Tuple", null, types);
}
function FableFunction(types) {
  return new NonDeclaredType("Function", null, types);
}
export { FableFunction as Function };
export function GenericParam(definition) {
  return new NonDeclaredType("GenericParam", definition);
}
export function Interface(definition) {
  return new NonDeclaredType("Interface", definition);
}
export function makeGeneric(typeDef, genArgs) {
  return new NonDeclaredType("GenericType", typeDef, genArgs);
}
export function isGeneric(typ) {
  return typ instanceof NonDeclaredType && typ.kind === "GenericType";
}
/**
 * Returns the parent if this is a declared generic type or the argument otherwise.
 * Attention: Unlike .NET this doesn't throw an exception if type is not generic.
 */
export function getDefinition(typ) {
  return isGeneric(typ) ? typ.definition : typ;
}
export function extendInfo(cons, info) {
  const parent = Object.getPrototypeOf(cons.prototype);
  if (typeof parent[FSymbol.reflection] === "function") {
    const newInfo = {};
    const parentInfo = parent[FSymbol.reflection]();
    Object.getOwnPropertyNames(info).forEach(k => {
      const i = info[k];
      if (typeof i === "object") {
        newInfo[k] = Array.isArray(i) ? (parentInfo[k] || []).concat(i) : Object.assign(parentInfo[k] || {}, i);
      } else {
        newInfo[k] = i;
      }
    });
    return newInfo;
  }
  return info;
}
export function hasInterface(obj, interfaceName) {
  if (interfaceName === "System.Collections.Generic.IEnumerable") {
    return typeof obj[Symbol.iterator] === "function";
  } else if (typeof obj[FSymbol.reflection] === "function") {
    const interfaces = obj[FSymbol.reflection]().interfaces;
    return Array.isArray(interfaces) && interfaces.indexOf(interfaceName) > -1;
  }
  return false;
}
/**
 * Returns:
 * - Records: array with names of fields
 * - Classes: array with names of getters
 * - Nulls and unions: empty array
 * - JS Objects: The result of calling Object.getOwnPropertyNames
 */
export function getPropertyNames(obj) {
  if (obj == null) {
    return [];
  }
  const propertyMap = typeof obj[FSymbol.reflection] === "function" ? obj[FSymbol.reflection]().properties || [] : obj;
  return Object.getOwnPropertyNames(propertyMap);
}
export function isArray(obj) {
  return Array.isArray(obj) || ArrayBuffer.isView(obj);
}
export function toString(obj, quoteStrings = false) {
  function isObject(x) {
    return x !== null && typeof x === "object" && !(x instanceof Number) && !(x instanceof String) && !(x instanceof Boolean);
  }
  if (obj == null || typeof obj === "number") {
    return String(obj);
  }
  if (typeof obj === "string") {
    return quoteStrings ? JSON.stringify(obj) : obj;
  }
  if (typeof obj.ToString === "function") {
    return obj.ToString();
  }
  if (hasInterface(obj, "FSharpUnion")) {
    const info = obj[FSymbol.reflection]();
    const uci = info.cases[obj.tag];
    switch (uci.length) {
      case 1:
        return uci[0];
      case 2:
        // For simplicity let's always use parens, in .NET they're ommitted in some cases
        return uci[0] + " (" + toString(obj.data, true) + ")";
      default:
        return uci[0] + " (" + obj.data.map(x => toString(x, true)).join(",") + ")";
    }
  }
  try {
    return JSON.stringify(obj, (k, v) => {
      return v && v[Symbol.iterator] && !Array.isArray(v) && isObject(v) ? Array.from(v) : v && typeof v.ToString === "function" ? toString(v) : v;
    });
  } catch (err) {
    // Fallback for objects with circular references
    return "{" + Object.getOwnPropertyNames(obj).map(k => k + ": " + String(obj[k])).join(", ") + "}";
  }
}
export function hash(x) {
  if (x != null && typeof x.GetHashCode === "function") {
    return x.GetHashCode();
  } else {
    const s = JSON.stringify(x);
    let h = 5381;
    let i = 0;
    const len = s.length;
    while (i < len) {
      h = h * 33 ^ s.charCodeAt(i++);
    }
    return h;
  }
}
export function equals(x, y) {
  // Optimization if they are referencially equal
  if (x === y) {
    return true;
  } else if (x == null) {
    return y == null;
  } else if (y == null) {
    return false;
  } else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) {
    return false;
    // Equals override or IEquatable implementation
  } else if (typeof x.Equals === "function") {
    return x.Equals(y);
  } else if (Array.isArray(x)) {
    if (x.length !== y.length) {
      return false;
    }
    for (let i = 0; i < x.length; i++) {
      if (!equals(x[i], y[i])) {
        return false;
      }
    }
    return true;
  } else if (ArrayBuffer.isView(x)) {
    if (x.byteLength !== y.byteLength) {
      return false;
    }
    const dv1 = new DataView(x.buffer);
    const dv2 = new DataView(y.buffer);
    for (let i = 0; i < x.byteLength; i++) {
      if (dv1.getUint8(i) !== dv2.getUint8(i)) {
        return false;
      }
    }
    return true;
  } else if (x instanceof Date) {
    return x.getTime() === y.getTime();
  } else {
    return false;
  }
}
export function comparePrimitives(x, y) {
  return x === y ? 0 : x < y ? -1 : 1;
}
export function compare(x, y) {
  // Optimization if they are referencially equal
  if (x === y) {
    return 0;
  } else if (x == null) {
    return y == null ? 0 : -1;
  } else if (y == null) {
    return 1; // everything is bigger than null
  } else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) {
    return -1;
    // Some types (see Long.ts) may just implement the function and not the interface
    // else if (hasInterface(x, "System.IComparable"))
  } else if (typeof x.CompareTo === "function") {
    return x.CompareTo(y);
  } else if (Array.isArray(x)) {
    if (x.length !== y.length) {
      return x.length < y.length ? -1 : 1;
    }
    for (let i = 0, j = 0; i < x.length; i++) {
      j = compare(x[i], y[i]);
      if (j !== 0) {
        return j;
      }
    }
    return 0;
  } else if (ArrayBuffer.isView(x)) {
    if (x.byteLength !== y.byteLength) {
      return x.byteLength < y.byteLength ? -1 : 1;
    }
    const dv1 = new DataView(x.buffer);
    const dv2 = new DataView(y.buffer);
    for (let i = 0, b1 = 0, b2 = 0; i < x.byteLength; i++) {
      b1 = dv1.getUint8(i), b2 = dv2.getUint8(i);
      if (b1 < b2) {
        return -1;
      }
      if (b1 > b2) {
        return 1;
      }
    }
    return 0;
  } else if (x instanceof Date) {
    const xtime = x.getTime();
    const ytime = y.getTime();
    return xtime === ytime ? 0 : xtime < ytime ? -1 : 1;
  } else if (typeof x === "object") {
    const xhash = hash(x);
    const yhash = hash(y);
    if (xhash === yhash) {
      return equals(x, y) ? 0 : -1;
    } else {
      return xhash < yhash ? -1 : 1;
    }
  } else {
    return x < y ? -1 : 1;
  }
}
export function equalsRecords(x, y) {
  // Optimization if they are referencially equal
  if (x === y) {
    return true;
  } else {
    const keys = getPropertyNames(x);
    for (const key of keys) {
      if (!equals(x[key], y[key])) {
        return false;
      }
    }
    return true;
  }
}
export function compareRecords(x, y) {
  // Optimization if they are referencially equal
  if (x === y) {
    return 0;
  } else {
    const keys = getPropertyNames(x);
    for (const key of keys) {
      const res = compare(x[key], y[key]);
      if (res !== 0) {
        return res;
      }
    }
    return 0;
  }
}
export function equalsUnions(x, y) {
  return x === y || x.tag === y.tag && equals(x.data, y.data);
}
export function compareUnions(x, y) {
  if (x === y) {
    return 0;
  } else {
    const res = x.tag < y.tag ? -1 : x.tag > y.tag ? 1 : 0;
    return res !== 0 ? res : compare(x.data, y.data);
  }
}
export function createDisposable(f) {
  return {
    Dispose: f,
    [FSymbol.reflection]() {
      return { interfaces: ["System.IDisposable"] };
    }
  };
}
// tslint forbids non-arrow functions, but it's
// necessary here to use the arguments object
/* tslint:disable */
export function createAtom(value) {
  let atom = value;
  return function () {
    return arguments.length === 0 ? atom : (atom = arguments[0], void 0);
  };
}
/* tslint:enable */
const CaseRules = {
  None: 0,
  LowerFirst: 1
};
function isList(o) {
  if (o != null) {
    if (typeof o[FSymbol.reflection] === "function") {
      return o[FSymbol.reflection]().type === "Microsoft.FSharp.Collections.FSharpList";
    }
  }
  return false;
}
export function createObj(fields, caseRule = CaseRules.None, casesCache) {
  const iter = fields[Symbol.iterator]();
  let cur = iter.next();
  const o = {};
  while (!cur.done) {
    const value = cur.value;
    if (Array.isArray(value)) {
      o[value[0]] = value[1];
    } else {
      casesCache = casesCache || new Map();
      const proto = Object.getPrototypeOf(value);
      let cases = casesCache.get(proto);
      if (cases == null) {
        if (typeof proto[FSymbol.reflection] === "function") {
          cases = proto[FSymbol.reflection]().cases;
          casesCache.set(proto, cases);
        }
      }
      const caseInfo = cases != null ? cases[value.tag] : null;
      if (Array.isArray(caseInfo)) {
        let key = caseInfo[0];
        if (caseRule === CaseRules.LowerFirst) {
          key = key[0].toLowerCase() + key.substr(1);
        }
        o[key] = caseInfo.length === 1 ? true : isList(value.data) ? createObj(value.data, caseRule, casesCache) : value.data;
      } else {
        throw new Error("Cannot infer key and value of " + value);
      }
    }
    cur = iter.next();
  }
  return o;
}
export function toPlainJsObj(source) {
  if (source != null && source.constructor !== Object) {
    const target = {};
    let props = Object.getOwnPropertyNames(source);
    for (const p of props) {
      target[p] = source[p];
    }
    // Copy also properties from prototype, see #192
    const proto = Object.getPrototypeOf(source);
    if (proto != null) {
      props = Object.getOwnPropertyNames(proto);
      for (const p of props) {
        const prop = Object.getOwnPropertyDescriptor(proto, p);
        if (prop.value) {
          target[p] = prop.value;
        } else if (prop.get) {
          target[p] = prop.get.apply(source);
        }
      }
    }
    return target;
  } else {
    return source;
  }
}
export function jsOptions(mutator) {
  const opts = {};
  mutator(opts);
  return opts;
}
export function round(value, digits = 0) {
  const m = Math.pow(10, digits);
  const n = +(digits ? value * m : value).toFixed(8);
  const i = Math.floor(n);
  const f = n - i;
  const e = 1e-8;
  const r = f > 0.5 - e && f < 0.5 + e ? i % 2 === 0 ? i : i + 1 : Math.round(n);
  return digits ? r / m : r;
}
export function randomNext(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export function defaultArg(arg, defaultValue, f) {
  return arg == null ? defaultValue : f != null ? f(arg) : arg;
}
export function defaultArgWith(arg, defThunk) {
  return arg == null ? defThunk() : arg;
}
export function applyOperator(x, y, operator) {
  function getMethod(obj) {
    if (typeof obj === "object") {
      const cons = Object.getPrototypeOf(obj).constructor;
      if (typeof cons[operator] === "function") {
        return cons[operator];
      }
    }
    return null;
  }
  let meth = getMethod(x);
  if (meth != null) {
    return meth(x, y);
  }
  meth = getMethod(y);
  if (meth != null) {
    return meth(x, y);
  }
  switch (operator) {
    case "op_Addition":
      return x + y;
    case "op_Subtraction":
      return x - y;
    case "op_Multiply":
      return x * y;
    case "op_Division":
      return x / y;
    case "op_Modulus":
      return x % y;
    case "op_LeftShift":
      return x << y;
    case "op_RightShift":
      return x >> y;
    case "op_BitwiseAnd":
      return x & y;
    case "op_BitwiseOr":
      return x | y;
    case "op_ExclusiveOr":
      return x ^ y;
    case "op_LogicalNot":
      return x + y;
    case "op_UnaryNegation":
      return !x;
    case "op_BooleanAnd":
      return x && y;
    case "op_BooleanOr":
      return x || y;
    default:
      return null;
  }
}
export function parseNumber(v) {
  return +v;
}
export function tryParse(v, initial, parser, fn) {
  if (v != null) {
    const a = parser.exec(v);
    if (a !== null) {
      return [true, fn(a[1])];
    }
  }
  return [false, initial];
}
export function parse(v, initial, parser, fn) {
  const a = tryParse(v, initial, parser, fn);
  if (a[0]) {
    return a[1];
  } else {
    // TODO FormatException ?
    throw new Error("Input string was not in a correct format.");
  }
}
export function unescapeDataString(s) {
  // https://stackoverflow.com/a/4458580/524236
  return decodeURIComponent(s.replace(/\+/g, "%20"));
}
export function escapeDataString(s) {
  return encodeURIComponent(s).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
}
export function escapeUriString(s) {
  return encodeURI(s);
}
// ICollection.Clear method can be called on IDictionary
// too so we need to make a runtime check (see #1120)
export function clear(col) {
  if (Array.isArray(col)) {
    col.splice(0);
  } else {
    col.clear();
  }
}