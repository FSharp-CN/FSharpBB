export default function CurriedLambda(f, expectedArgsLength) {
  if (f.curried === true) {
    return f;
  }
  const curriedFn = (...args) => {
    // _this = _this || this;
    const actualArgsLength = Math.max(args.length, 1);
    expectedArgsLength = Math.max(expectedArgsLength || f.length, 1);
    if (actualArgsLength >= expectedArgsLength) {
      const restArgs = args.splice(expectedArgsLength);
      const res = f(...args);
      if (typeof res === "function") {
        const newLambda = CurriedLambda(res);
        return restArgs.length === 0 ? newLambda : newLambda(...restArgs);
      } else {
        return res;
      }
    } else {
      return CurriedLambda((...args2) => {
        return f(...args.concat(args2));
      }, expectedArgsLength - actualArgsLength);
    }
  };
  curriedFn.curried = true;
  return curriedFn;
}
export function partialApply(f, args) {
  const lambda = f.curried === true ? f : CurriedLambda(f, f.argsLength || f.length);
  return lambda(...args);
}