import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { equals, createObj, compareRecords, equalsRecords, Option } from "../fable-core/Util";
import { AppMsg, Page, UserData } from "../Messages";
import { load } from "../Utils";
import { Cmd } from "../fable/cmd";
import { createElement } from "react";
import { ofArray } from "../fable-core/List";
import { buttonLink, viewLink, centerStyle } from "../Style";
import { empty, singleton, append, delay, toList } from "../fable-core/Seq";
export class Model {
  constructor(user, query) {
    this.User = user;
    this.query = query;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Menu.Model",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        User: Option(UserData),
        query: "string"
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
setType("Client.Menu.Model", Model);
export function init() {
  return [new Model(load("user"), ""), Cmd.none()];
}
export function view(model, dispatch) {
  return createElement("div", createObj(ofArray([centerStyle("row")]), 1), ...toList(delay(function () {
    return append(singleton(viewLink(new Page(0), "Home")), delay(function () {
      return append(!equals(model.User, null) ? singleton(viewLink(new Page(2), "Wishlist")) : empty(), delay(function () {
        return equals(model.User, null) ? singleton(viewLink(new Page(1), "Login")) : singleton(buttonLink("logout", function () {
          dispatch(new AppMsg(6));
        }, ofArray(["Logout"])));
      }));
    }));
  })));
}