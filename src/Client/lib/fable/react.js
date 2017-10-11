import { render } from "react-dom";
import { Common } from "./common";
import { Program } from "./program";
export function withReact(placeholderId, program) {
  let lastRequest = null;

  const setState = function (model, dispatch) {
    if (lastRequest != null) {
      const r = lastRequest;
      window.cancelAnimationFrame(r);
    }

    lastRequest = window.requestAnimationFrame(function (_arg1) {
      render(Common.lazyView2With(function (x, y) {
        return x === y;
      }, program.view, model, dispatch), document.getElementById(placeholderId));
    });
  };

  return new Program(program.init, program.update, program.subscribe, program.view, setState, program.onError);
}