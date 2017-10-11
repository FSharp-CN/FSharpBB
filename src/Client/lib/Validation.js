import { setType } from "./fable-core/Symbol";
import _Symbol from "./fable-core/Symbol";
import { compare, Function as _Function, makeGeneric, GenericParam, Tuple, compareRecords, equalsRecords } from "./fable-core/Util";
import Result from "./fable-core/Result";
import { ofArray, append } from "./fable-core/List";
import List from "./fable-core/List";
import { startImmediate } from "./fable-core/Async";
import Async from "./fable-core/Async";
import { isNullOrWhiteSpace, toFail, printf, toConsole } from "./fable-core/String";
import { singleton } from "./fable-core/AsyncBuilder";
import { isEmpty, add, create } from "./fable-core/Map";
import { count, empty } from "./fable-core/Seq";
import Comparer from "./fable-core/Comparer";
import { partialApply } from "./fable-core/CurriedLambda";
import CurriedLambda from "./fable-core/CurriedLambda";
import { isMatch, create as create_1 } from "./fable-core/RegExp";
export class ValidatorFlags {
  constructor(race, skip) {
    this.race = race;
    this.skip = skip;
  }

  [_Symbol.reflection]() {
    return {
      type: "Fable.Validation.Core.ValidatorFlags",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        race: "boolean",
        skip: "boolean"
      }
    };
  }

  Equals(other) {
    return equalsRecords(this, other);
  }

  CompareTo(other) {
    return compareRecords(this, other) | 0;
  }

}
setType("Fable.Validation.Core.ValidatorFlags", ValidatorFlags);
export class ValidatorInfo {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Fable.Validation.Core.ValidatorInfo",
      interfaces: ["FSharpUnion"],
      cases: [["Input", Tuple([ValidatorFlags, GenericParam("T")])], ["Validator", Tuple([ValidatorFlags, GenericParam("T"), makeGeneric(Result, {
        T: GenericParam("T"),
        TError: makeGeneric(List, {
          T: GenericParam("TError")
        })
      })])], ["AsyncValidator", Tuple([ValidatorFlags, GenericParam("T"), makeGeneric(Async, {
        T: makeGeneric(Result, {
          T: GenericParam("T"),
          TError: makeGeneric(List, {
            T: GenericParam("TError")
          })
        })
      })])]]
    };
  }

}
setType("Fable.Validation.Core.ValidatorInfo", ValidatorInfo);
export class ValidationTester {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Fable.Validation.Core.ValidationTester",
      interfaces: ["FSharpUnion"],
      cases: [["Test", _Function([GenericParam("T"), "boolean"])], ["AsyncTest", _Function([GenericParam("T"), makeGeneric(Async, {
        T: makeGeneric(Result, {
          T: "boolean",
          TError: GenericParam("TError")
        })
      })])]]
    };
  }

}
setType("Fable.Validation.Core.ValidationTester", ValidationTester);
export function getInfoFlagsAndInput(info) {
  if (info.tag === 1) {
    const race = info.data[0];
    const input = info.data[1];
    return [race, input];
  } else if (info.tag === 2) {
    const race_1 = info.data[0];
    const input_1 = info.data[1];
    return [race_1, input_1];
  } else {
    const race_2 = info.data[0];
    const input_2 = info.data[1];
    return [race_2, input_2];
  }
}
export function ifInvalid(test, error, info) {
  const patternInput = getInfoFlagsAndInput(info);

  if (patternInput[0].skip) {
    toConsole(printf("skip:%A", 1))(info);
    return info;
  } else {
    const matchValue = [test, info];
    const $var1 = matchValue[0].tag === 0 ? matchValue[1].tag === 0 ? [1, matchValue[1].data[1], matchValue[0].data] : matchValue[1].tag === 1 ? [2, matchValue[1].data[1], matchValue[1].data[2], matchValue[0].data] : [0] : [0];

    switch ($var1[0]) {
      case 0:
        return new ValidatorInfo(2, [patternInput[0], patternInput[1], function () {
          return function (builder_) {
            return builder_.Delay(function () {
              let testErrors = new List();
              return builder_.Combine(test.tag === 1 ? builder_.Bind(test.data(patternInput[1]), function (_arg1) {
                if (_arg1.tag === 1) {
                  testErrors = new List(_arg1.data, testErrors);
                  return builder_.Zero();
                } else if (_arg1.data) {
                  return builder_.Zero();
                } else {
                  testErrors = new List(error, testErrors);
                  return builder_.Zero();
                }
              }) : !test.data(patternInput[1]) ? (() => {
                testErrors = new List(error, testErrors);
                return builder_.Zero();
              })() : builder_.Zero(), builder_.Delay(function () {
                if (patternInput[0].race ? !(testErrors.tail == null) : false) {
                  return builder_.Return(function (input, errors) {
                    return errors.tail == null ? new Result(0, input) : new Result(1, errors);
                  }(patternInput[1], testErrors));
                } else {
                  let result = new Result(0, patternInput[1]);
                  return builder_.Combine(info.tag === 1 ? (() => {
                    const result_ = info.data[2];
                    const race = info.data[0];
                    const input_1 = info.data[1];

                    result = function (lastResult, input_2, errors_1) {
                      return lastResult.tag === 1 ? function (input_3, errors_2) {
                        return errors_2.tail == null ? new Result(0, input_3) : new Result(1, errors_2);
                      }(input_2, append(errors_1, lastResult.data)) : function (input_4, errors_3) {
                        return errors_3.tail == null ? new Result(0, input_4) : new Result(1, errors_3);
                      }(lastResult.data, errors_1);
                    }(result_, input_1, testErrors);

                    return builder_.Zero();
                  })() : info.tag === 2 ? (() => {
                    const result__1 = info.data[2];
                    const race_1 = info.data[0];
                    const input_5 = info.data[1];
                    return builder_.Bind(result__1, function (_arg2) {
                      result = function (lastResult_1, input_6, errors_4) {
                        return lastResult_1.tag === 1 ? function (input_7, errors_5) {
                          return errors_5.tail == null ? new Result(0, input_7) : new Result(1, errors_5);
                        }(input_6, append(errors_4, lastResult_1.data)) : function (input_8, errors_6) {
                          return errors_6.tail == null ? new Result(0, input_8) : new Result(1, errors_6);
                        }(lastResult_1.data, errors_4);
                      }(_arg2, input_5, testErrors);

                      return builder_.Zero();
                    });
                  })() : (() => {
                    const race_2 = info.data[0];
                    const input_ = info.data[1];
                    throw new Error("this should never happen for asyncValidator ");
                    return builder_.Zero();
                  })(), builder_.Delay(function () {
                    return builder_.Return(result);
                  }));
                }
              }));
            });
          }(singleton);
        }()]);

      case 1:
        const testErrors_1 = !$var1[2]($var1[1]) ? ofArray([error]) : new List();
        return new ValidatorInfo(1, [patternInput[0], $var1[1], function (input_9, errors_7) {
          return errors_7.tail == null ? new Result(0, input_9) : new Result(1, errors_7);
        }($var1[1], testErrors_1)]);

      case 2:
        const testErrors_2 = !$var1[3]($var1[1]) ? ofArray([error]) : new List();
        const result_1 = (patternInput[0].race ? !(testErrors_2.tail == null) : false) ? function (input_10, errors_8) {
          return errors_8.tail == null ? new Result(0, input_10) : new Result(1, errors_8);
        }($var1[1], testErrors_2) : function (lastResult_2, input_11, errors_9) {
          return lastResult_2.tag === 1 ? function (input_12, errors_10) {
            return errors_10.tail == null ? new Result(0, input_12) : new Result(1, errors_10);
          }(input_11, append(errors_9, lastResult_2.data)) : function (input_13, errors_11) {
            return errors_11.tail == null ? new Result(0, input_13) : new Result(1, errors_11);
          }(lastResult_2.data, errors_9);
        }($var1[2], $var1[1], testErrors_2);
        return new ValidatorInfo(1, [patternInput[0], $var1[1], result_1]);
    }
  }
}
export function baseValidateAsync(raceField, rules, input) {
  return function (builder_) {
    return builder_.Delay(function () {
      let msgMap = create(empty(), new Comparer(compare));

      const consumeResult = function (key, result) {
        if (result.tag === 1) {
          msgMap = add(key, result.data, msgMap);
        }
      };

      let tail = rules(input);
      let isBreak = false;
      return builder_.Combine(builder_.While(function () {
        return !isBreak ? !(tail.tail == null) : false;
      }, builder_.Delay(function () {
        const patternInput = tail.head;
        tail = tail.tail;
        return builder_.Combine(patternInput[1].tag === 2 ? (() => {
          const result_1 = patternInput[1].data[2];
          return builder_.Bind(result_1, function (_arg1) {
            consumeResult(patternInput[0], _arg1);
            return builder_.Zero();
          });
        })() : patternInput[1].tag === 0 ? (() => {
          toFail(printf("Validation rules must be a function, but found input: %A", 1))(patternInput[1].data);
          return builder_.Zero();
        })() : (() => {
          const result_2 = patternInput[1].data[2];
          partialApply(consumeResult, [patternInput[0]])(result_2);
          return builder_.Zero();
        })(), builder_.Delay(function () {
          if (raceField ? !isEmpty(msgMap) : false) {
            isBreak = true;
            return builder_.Zero();
          } else {
            return builder_.Zero();
          }
        }));
      })), builder_.Delay(function () {
        return builder_.Return(isEmpty(msgMap) ? new Result(0, input) : new Result(1, msgMap));
      }));
    });
  }(singleton);
}
export function baseValidateSync(raceField, rules, input) {
  let msgMap = create(empty(), new Comparer(compare));

  const consumeResult = function (key, result) {
    if (result.tag === 1) {
      msgMap = add(key, result.data, msgMap);
    }
  };

  let tail = rules(input);
  let isBreak = false;

  while (!isBreak ? !(tail.tail == null) : false) {
    const patternInput = tail.head;
    tail = tail.tail;

    if (patternInput[1].tag === 2) {
      const vali = patternInput[1].data[2];
      const input_ = patternInput[1].data[1];
      toFail(printf("Sync validation cannot contain async rules: %A, whole input: %A", 2))([input_, vali], input);
    } else if (patternInput[1].tag === 0) {
      toFail(printf("Validation rules must be a function, but found input: %A, whole input: %A", 2))(patternInput[1].data, input);
    } else {
      const result_1 = patternInput[1].data[2];
      partialApply(consumeResult, [patternInput[0]])(result_1);
    }

    if (raceField ? !isEmpty(msgMap) : false) {
      isBreak = true;
    }
  }

  if (isEmpty(msgMap)) {
    return new Result(0, input);
  } else {
    return new Result(1, msgMap);
  }
}
export function skipNone(info) {
  const patternInput = getInfoFlagsAndInput(info);
  const dummy = null;

  if (patternInput[1] == null) {
    return new ValidatorInfo(1, [new ValidatorFlags(patternInput[0].race, true), dummy, new Result(0, dummy)]);
  } else {
    return new ValidatorInfo(1, [patternInput[0], patternInput[1], new Result(0, patternInput[1])]);
  }
}
export function skipError(info) {
  const patternInput = getInfoFlagsAndInput(info);
  const dummy = null;

  if (patternInput[1].tag === 1) {
    return new ValidatorInfo(1, [new ValidatorFlags(patternInput[0].race, true), dummy, new Result(0, dummy)]);
  } else {
    return new ValidatorInfo(1, [patternInput[0], patternInput[1].data, new Result(0, patternInput[1].data)]);
  }
}
export function ifNone(error, info) {
  const _ifNone = partialApply(function (test, error_1, info_1) {
    return ifInvalid(test, error_1, info_1);
  }, [new ValidationTester(0, function (option) {
    return option != null;
  })]);

  return skipNone(_ifNone(error, info));
}
export function ifError(error, info) {
  const _ifError = partialApply(function (test, error_1, info_1) {
    return ifInvalid(test, error_1, info_1);
  }, [new ValidationTester(0, function (input) {
    return input.tag === 1 ? false : true;
  })]);

  return skipError(_ifError(error, info));
}
export function ifBlank() {
  return CurriedLambda(partialApply(function (test, error, info) {
    return ifInvalid(test, error, info);
  }, [new ValidationTester(0, $var2 => !isNullOrWhiteSpace($var2))]));
}
export function ifNotGt(min) {
  return CurriedLambda(partialApply(function (test, error, info) {
    return ifInvalid(test, error, info);
  }, [new ValidationTester(0, function (input) {
    return compare(input, min) > 0;
  })]));
}
export function ifNotMaxLen(len) {
  return CurriedLambda(partialApply(function (test, error, info) {
    return ifInvalid(test, error, info);
  }, [new ValidationTester(0, function (input) {
    return count(input) <= len;
  })]));
}
export function ifNotMinLen(len) {
  return CurriedLambda(partialApply(function (test, error, info) {
    return ifInvalid(test, error, info);
  }, [new ValidationTester(0, function (input) {
    return count(input) >= len;
  })]));
}
export const mailRe = create_1("^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$", 8 | 256);
export function ifInvalidMail() {
  return CurriedLambda(partialApply(function (test, error, info) {
    return ifInvalid(test, error, info);
  }, [new ValidationTester(0, function (arg00) {
    return isMatch(mailRe, arg00);
  })]));
}
export const urlRe = create_1("^((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[\\-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9\\.\\-]+|(?:www\\.|[\\-;:&=\\+\\$,\\w]+@)[A-Za-z0-9\\.\\-]+)((?:\\/[\\+~%\\/\\.\\w\\-_]*)?\\??(?:[\\-\\+=&;%@\\.\\w_]*)#?(?:[\\.\\!\\/\\\\\\w]*))?)$", 8 | 256);
export function ifInvalidUrl() {
  return CurriedLambda(partialApply(function (test, error, info) {
    return ifInvalid(test, error, info);
  }, [new ValidationTester(0, function (arg00) {
    return isMatch(urlRe, arg00);
  })]));
}
export class People {
  constructor(name, age) {
    this.name = name;
    this.age = age | 0;
  }

  [_Symbol.reflection]() {
    return {
      type: "Fable.Validation.Core.People",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        name: "string",
        age: "number"
      }
    };
  }

  Equals(other) {
    return equalsRecords(this, other);
  }

  CompareTo(other) {
    return compareRecords(this, other) | 0;
  }

}
setType("Fable.Validation.Core.People", People);
console.time("sync");
export const result = function (rules, input) {
  return baseValidateSync(false, rules, input);
}(function (t) {
  return ofArray([["age", function (a) {
    return a;
  }(ifNotGt(18)("Age should greater then 18")(new ValidatorInfo(0, [new ValidatorFlags(false, false), t.age])))], ["name", function (a_1) {
    return a_1;
  }(ifNotMinLen(12)("Name's minimal length is 12")(ifInvalidMail()("Not valid mail sync")(ifBlank()("Name shouldn't be empty")(new ValidatorInfo(0, [new ValidatorFlags(false, false), t.name])))))]]);
}, new People("", 15));
console.timeEnd("sync");
toConsole(printf("all sync result: %A", 1))(result);
toConsole(printf("mail: %A", 1))(ifInvalidMail()("Not valid mail", new ValidatorInfo(0, [new ValidatorFlags(false, false), ""])));
export const asyncResult = (() => {
  const rules = function (t) {
    return ofArray([["age", function (a) {
      return a;
    }(ifNotGt(18)("Age should greater then 18")(new ValidatorInfo(0, [new ValidatorFlags(false, false), t.age])))], ["name", function (a_1) {
      return a_1;
    }(ifNotMinLen(12)("Name's minimal length is 12")(ifInvalidMail()("Not valid mail")(ifBlank()("Name shouldn't be empty")(new ValidatorInfo(0, [new ValidatorFlags(false, false), t.name])))))]]);
  };

  (function (arg00) {
    startImmediate(arg00);
  })(function (builder_) {
    return builder_.Delay(function () {
      console.time("async");
      return builder_.Bind(function (rules_1, input) {
        return baseValidateAsync(false, rules_1, input);
      }(rules, new People("", 15)), function (_arg1) {
        console.timeEnd("async");
        toConsole(printf("all async result: %A", 1))(_arg1);
        return builder_.Zero();
      });
    });
  }(singleton));
})();
export const p = new People("", 15);
console.time("raw");
const r_ = isNullOrWhiteSpace(p.name) ? true : count(p.name) > 12;
export { r_ as r$27$ };
const r1_ = p.age > 18;
export { r1_ as r1$27$ };
console.timeEnd("raw");