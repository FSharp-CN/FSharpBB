import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { some, Unit, makeGeneric, Tuple, GenericParam, Function as _Function } from "../fable-core/Util";
import { append, ofArray } from "../fable-core/List";
import List from "../fable-core/List";
import CurriedLambda from "../fable-core/CurriedLambda";
import { Cmd } from "./cmd";
import { toJson } from "../fable-core/Serialize";
import { start } from "../fable-core/MailboxProcessor";
import { iterate } from "../fable-core/Seq";
import { singleton } from "../fable-core/AsyncBuilder";
export class Program {
  constructor(init, update, subscribe, view, setState, onError) {
    this.init = init;
    this.update = update;
    this.subscribe = subscribe;
    this.view = view;
    this.setState = setState;
    this.onError = onError;
  }

  [_Symbol.reflection]() {
    return {
      type: "Elmish.Program",
      interfaces: ["FSharpRecord"],
      properties: {
        init: _Function([GenericParam("arg"), Tuple([GenericParam("model"), makeGeneric(List, {
          T: _Function([_Function([GenericParam("msg"), Unit]), Unit])
        })])]),
        update: _Function([GenericParam("msg"), GenericParam("model"), Tuple([GenericParam("model"), makeGeneric(List, {
          T: _Function([_Function([GenericParam("msg"), Unit]), Unit])
        })])]),
        subscribe: _Function([GenericParam("model"), makeGeneric(List, {
          T: _Function([_Function([GenericParam("msg"), Unit]), Unit])
        })]),
        view: _Function([GenericParam("model"), _Function([GenericParam("msg"), Unit]), GenericParam("view")]),
        setState: _Function([GenericParam("model"), _Function([GenericParam("msg"), Unit]), Unit]),
        onError: _Function([Tuple(["string", Error]), Unit])
      }
    };
  }

}
setType("Elmish.Program", Program);
export const ProgramModule = function (__exports) {
  const onError = __exports.onError = function (text, ex) {
    console.error(some(text), ex);
  };

  const mkProgram = __exports.mkProgram = function (init, update, view) {
    const setState = CurriedLambda(function (model) {
      return $var2 => function (value) {
        value;
      }(($var1 => view(model, $var1))($var2));
    });
    return new Program(init, update, function (_arg1) {
      return Cmd.none();
    }, view, setState, function (tupledArg) {
      onError(tupledArg[0], tupledArg[1]);
    });
  };

  const mkSimple = __exports.mkSimple = function (init, update, view) {
    const init_1 = $var3 => {
      return function (state) {
        return [state, Cmd.none()];
      }(init($var3));
    };

    const update_1 = CurriedLambda(function (msg) {
      return $var5 => function (state_1) {
        return [state_1, Cmd.none()];
      }(($var4 => update(msg, $var4))($var5));
    });
    const setState = CurriedLambda(function (model) {
      return $var7 => function (value) {
        value;
      }(($var6 => view(model, $var6))($var7));
    });
    return new Program(init_1, update_1, function (_arg1) {
      return Cmd.none();
    }, view, setState, function (tupledArg) {
      onError(tupledArg[0], tupledArg[1]);
    });
  };

  const withSubscription = __exports.withSubscription = function (subscribe, program) {
    const sub = function (model) {
      return Cmd.batch(ofArray([program.subscribe(model), subscribe(model)]));
    };

    return new Program(program.init, program.update, sub, program.view, program.setState, program.onError);
  };

  const withConsoleTrace = __exports.withConsoleTrace = function (program) {
    const traceInit = function (arg) {
      const patternInput = program.init(arg);
      console.log(some("Initial state:"), function (o) {
        return function (arg00) {
          return JSON.parse(arg00);
        }(toJson(o));
      }(patternInput[0]));
      return [patternInput[0], patternInput[1]];
    };

    const traceUpdate = function (msg, model) {
      console.log(some("New message:"), function (o_1) {
        return function (arg00_1) {
          return JSON.parse(arg00_1);
        }(toJson(o_1));
      }(msg));
      const patternInput_1 = program.update(msg, model);
      console.log(some("Updated state:"), function (o_2) {
        return function (arg00_2) {
          return JSON.parse(arg00_2);
        }(toJson(o_2));
      }(patternInput_1[0]));
      return [patternInput_1[0], patternInput_1[1]];
    };

    return new Program(traceInit, traceUpdate, program.subscribe, program.view, program.setState, program.onError);
  };

  const withTrace = __exports.withTrace = function (trace, program) {
    const update = function (msg, model) {
      trace(msg, model);
      return program.update(msg, model);
    };

    return new Program(program.init, update, program.subscribe, program.view, program.setState, program.onError);
  };

  const withErrorHandler = __exports.withErrorHandler = function (onError_1, program) {
    return new Program(program.init, program.update, program.subscribe, program.view, program.setState, onError_1);
  };

  const runWith = __exports.runWith = function (arg, program) {
    const patternInput = program.init(arg);
    const inbox = start(function (mb) {
      const loop = function (state) {
        return function (builder_) {
          return builder_.Delay(function () {
            return builder_.Bind(mb.receive(), function (_arg1) {
              return builder_.TryWith(builder_.Delay(function () {
                const patternInput_1 = program.update(_arg1, state);
                program.setState(patternInput_1[0], function (arg00) {
                  mb.post(arg00);
                });
                iterate(function (sub) {
                  sub(function (arg00_1) {
                    mb.post(arg00_1);
                  });
                }, patternInput_1[1]);
                return builder_.ReturnFrom(loop(patternInput_1[0]));
              }), function (_arg2) {
                program.onError(["Unable to process a message:", _arg2]);
                return builder_.ReturnFrom(loop(state));
              });
            });
          });
        }(singleton);
      };

      return loop(patternInput[0]);
    });
    program.setState(patternInput[0], function (arg00_2) {
      inbox.post(arg00_2);
    });
    iterate(function (sub_1) {
      sub_1(function (arg00_3) {
        inbox.post(arg00_3);
      });
    }, append(program.subscribe(patternInput[0]), patternInput[1]));
  };

  const run = __exports.run = function (program) {
    runWith(null, program);
  };

  return __exports;
}({});