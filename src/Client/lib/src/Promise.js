import { map } from "../fable-core/Result";
import Result from "../fable-core/Result";
import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";

const _Promise = function (__exports) {
  const result = __exports.result = function (a) {
    return a.then($var1 => new Result(0, $var1), $var2 => new Result(1, $var2));
  };

  const mapResult = __exports.mapResult = function (fn, a) {
    return a.then(function (result_1) {
      return map(fn, result_1);
    });
  };

  const bindResult = __exports.bindResult = function (fn, a) {
    return a.then(function (a_1) {
      return a_1.tag === 1 ? Promise.resolve(new Result(1, a_1.data)) : result(fn(a_1.data));
    });
  };

  const PromiseBuilder = __exports.PromiseBuilder = class PromiseBuilder {
    [_Symbol.reflection]() {
      return {
        type: "Fable.PowerPack.Promise.PromiseBuilder",
        properties: {}
      };
    }

    constructor() {}

    For(seq, body) {
      let p = Promise.resolve(null);

      for (let a of seq) {
        p = p.then(() => body(a));
      }

      return p;
    }

    While(guard, p) {
      if (guard()) {
        return p.then(() => this.While(guard, p));
      } else {
        return Promise.resolve(null);
      }
    }

    TryFinally(p, compensation) {
      return p.then(x => {
        compensation();
        return x;
      }, er => {
        compensation();
        throw er;
      });
    }

    Delay(generator) {
      return {
        then: (f1, f2) => {
          try {
            return generator().then(f1, f2);
          } catch (er) {
            if (f2 == null) {
              return Promise.reject(er);
            } else {
              try {
                return Promise.resolve(f2(er));
              } catch (er_1) {
                return Promise.reject(er_1);
              }
            }
          }
        },
        catch: f => {
          try {
            return generator().catch(f);
          } catch (er_2) {
            try {
              return Promise.resolve(f(er_2));
            } catch (er_3) {
              return Promise.reject(er_3);
            }
          }
        }
      };
    }

    Using(resource, binder) {
      return this.TryFinally(binder(resource), () => {
        resource.Dispose();
      });
    }

  };
  setType("Fable.PowerPack.Promise.PromiseBuilder", PromiseBuilder);
  return __exports;
}({});

export { _Promise as Promise };
export const PromiseImpl = function (__exports) {
  const promise = __exports.promise = new _Promise.PromiseBuilder();
  return __exports;
}({});