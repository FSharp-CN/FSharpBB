import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { some, equals, GenericParam, Interface } from "../fable-core/Util";
import { ofArray } from "../fable-core/List";
import { Cmd } from "./cmd";
import { Program } from "./program";
export class Navigable {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Elmish.Browser.Navigation.Navigable",
      interfaces: ["FSharpUnion", "System.IEquatable"],
      cases: [["Change", Interface("Fable.Import.Browser.Location")], ["UserMsg", GenericParam("msg")]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

}
setType("Elmish.Browser.Navigation.Navigable", Navigable);
export const Navigation = function (__exports) {
  const NavigatedEvent = __exports.NavigatedEvent = "NavigatedEvent";

  const modifyUrl = __exports.modifyUrl = function (newUrl) {
    return ofArray([function (_arg1) {
      history.replaceState(null, some(""), some(newUrl));
    }]);
  };

  const newUrl = __exports.newUrl = function (newUrl_1) {
    return ofArray([function (_arg1) {
      history.pushState(null, some(""), some(newUrl_1));
      const ev = document.createEvent("CustomEvent");
      ev.initCustomEvent("NavigatedEvent", true, true, {});
      window.dispatchEvent(ev);
    }]);
  };

  const jump = __exports.jump = function (n) {
    return ofArray([function (_arg1) {
      history.go(some(n));
    }]);
  };

  return __exports;
}({});
export const ProgramModule = function (__exports) {
  const toNavigable = __exports.toNavigable = function (parser, urlUpdate, program) {
    const map = function (tupledArg) {
      return [tupledArg[0], Cmd.map(function (arg0) {
        return new Navigable(1, arg0);
      }, tupledArg[1])];
    };

    const update = function (msg, model) {
      return map(msg.tag === 1 ? program.update(msg.data, model) : urlUpdate(parser(msg.data), model));
    };

    const locationChanges = function (dispatch) {
      let lastLocation = null;

      const onChange = function (_arg1) {
        return (() => {
          const $var1 = lastLocation != null ? (() => {
            const href = lastLocation;
            return href === window.location.href;
          })() ? [0, lastLocation] : [1] : [1];

          switch ($var1[0]) {
            case 0:
              break;

            case 1:
              lastLocation = some(window.location.href);
              dispatch(new Navigable(0, window.location));
              break;
          }
        })();
      };

      window.addEventListener("popstate", onChange);
      window.addEventListener("hashchange", onChange);
      window.addEventListener("NavigatedEvent", onChange);
    };

    const subs = function (model_1) {
      return Cmd.batch(ofArray([ofArray([locationChanges]), Cmd.map(function (arg0_1) {
        return new Navigable(1, arg0_1);
      }, program.subscribe(model_1))]));
    };

    const init = function () {
      return map(program.init(parser(window.location)));
    };

    const setState = function (model_2, dispatch_1) {
      program.setState(model_2, $var2 => dispatch_1(function (arg0_2) {
        return new Navigable(1, arg0_2);
      }($var2)));
    };

    return new Program(init, update, subs, function (model_3, dispatch_2) {
      return program.view(model_3, $var3 => dispatch_2(function (arg0_3) {
        return new Navigable(1, arg0_3);
      }($var3)));
    }, setState, program.onError);
  };

  return __exports;
}({});