import { createElement } from "react";
import { createObj } from "./fable-core/Util";
import { ofArray } from "./fable-core/List";
import { Props } from "./fable/Fable.Helpers.React";
import { toHash } from "./Messages";
import { printf, toText } from "./fable-core/String";
export function viewLink(page, description) {
  return createElement("a", createObj(ofArray([["style", {
    padding: "0 20px"
  }], new Props.HTMLAttr(51, toHash(page))]), 1), description);
}
export function centerStyle(direction) {
  return ["style", createObj(ofArray([new Props.CSSProp(95, "flex"), new Props.CSSProp(101, direction), new Props.CSSProp(21, "center"), ["justifyContent", "center"], new Props.CSSProp(175, "20px 0")]), 1)];
}
export function words(size, message) {
  return createElement("span", createObj(ofArray([["style", createObj(ofArray([["fontSize", toText(printf("%dpx", 1))(size)]]), 1)]]), 1), message);
}
export function buttonLink(cssClass, onClick, elements) {
  return createElement("a", createObj(ofArray([new Props.HTMLAttr(22, cssClass), new Props.DOMAttr(39, function (_arg1) {
    onClick();
  }), new Props.DOMAttr(61, function (_arg2) {
    onClick();
  }), ["style", createObj(ofArray([["cursor", "pointer"]]), 1)]]), 1), ...elements);
}
export function onEnter(msg, dispatch) {
  return new Props.DOMAttr(14, function (ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      dispatch(msg);
    }
  });
}