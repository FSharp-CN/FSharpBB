import * as isomorphic_fetch from "isomorphic-fetch";
import { printf, toConsole } from "./fable-core/String";
import { catchAsync, startImmediate } from "./fable-core/Async";
import { createAtom, hasInterface, equals } from "./fable-core/Util";
import { choose } from "./fable-core/Seq";
import { singleton } from "./fable-core/AsyncBuilder";
isomorphic_fetch;

function _fetch() {
  toConsole(printf("run fetch"));

  (function (arg00) {
    startImmediate(arg00);
  })(function (builder_) {
    return builder_.Delay(function () {
      toConsole(printf("before fetch"));
      return builder_.Bind((() => {
        throw 1;
      })(), function (_arg1) {
        return builder_.Combine(_arg1 != null ? (() => {
          toConsole(printf("My hero is %A"))((() => {
            throw 1;
          })());
          toConsole(printf("Appears in %O: %b"))((() => {
            throw 1;
          })(), (() => {
            throw 1;
          })().some((() => {
            let x;
            throw 1;
            return function (y) {
              return equals(x, y);
            };
          })()));
          toConsole(printf("My hero's friends are:"));
          Array.from(choose(function (x_1) {
            throw 1;
          }, (() => {
            throw 1;
          })())).forEach(toConsole(printf("- %s")));
          return builder_.Zero();
        })() : builder_.Zero(), builder_.Delay(function () {
          toConsole(printf("after fetch"));
          return builder_.Zero();
        }));
      });
    });
  }(singleton));
}

export { _fetch as fetch };
export const freeQuery = "{ hero(id: \"1000\"){ id, name, appearsIn, friends { name } } }";
export function op_Dynamic(o, k) {
  if (hasInterface(o, "System.Collections.Generic.IDictionary")) {
    return o.get(k);
  } else {
    return null;
  }
}
export function hero2() {
  return function (builder_) {
    return builder_.Delay(function () {
      toConsole(printf("before hero2"));
      return builder_.Bind(catchAsync((() => {
        throw 1;
      })()), function (_arg1) {
        (function (_arg2) {
          if (_arg2.tag === 1) {
            toConsole(printf("ERROR: %s"))(_arg2.data.message);
          } else {
            toConsole(printf("Hero's name: %A"))(op_Dynamic(op_Dynamic(_arg2.data, "hero"), "name"));
          }
        })(_arg1);

        toConsole(printf("after hero2"));
        return builder_.Zero();
      });
    });
  }(singleton);
}
export const hero3 = function (builder_) {
  return builder_.Delay(function () {
    toConsole(printf("before hero2"));
    return builder_.Bind(catchAsync((() => {
      throw 1;
    })()), function (_arg1) {
      (function (_arg2) {
        if (_arg2.tag === 1) {
          toConsole(printf("ERROR: %s"))(_arg2.data.message);
        } else {
          toConsole(printf("Hero's name: %A"))(op_Dynamic(op_Dynamic(_arg2.data, "hero"), "name"));
        }
      })(_arg1);

      toConsole(printf("after hero2"));
      return builder_.Zero();
    });
  });
}(singleton);
export let result = createAtom(0);

(function (arg00) {
  startImmediate(arg00);
})(function (builder_) {
  return builder_.Delay(function () {
    return builder_.While(function () {
      return result() < 10;
    }, builder_.Delay(function () {
      result(result() + 1);
      return builder_.Zero();
    }));
  });
}(singleton));

toConsole(printf("result: %d"))(result());

_fetch();

(function (arg00_1) {
  startImmediate(arg00_1);
})(hero2());