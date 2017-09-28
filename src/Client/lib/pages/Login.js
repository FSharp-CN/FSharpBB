import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { toString, createObj, compareRecords, equalsRecords, compareUnions, equals } from "../fable-core/Util";
import { Login as Login_2 } from "../Shared/Domain";
import { toText, newGuid, printf, toFail, isNullOrEmpty } from "../fable-core/String";
import { toJson } from "../fable-core/Serialize";
import { ofArray } from "../fable-core/List";
import List from "../fable-core/List";
import { fetch as _fetch, Fetch_types } from "../src/Fetch";
import { PromiseImpl } from "../src/Promise";
import { Cmd } from "../fable/cmd";
import { AppMsg, LoginMsg } from "../Messages";
import { Props } from "../fable/Fable.Helpers.React";
import { createElement } from "react";
export class LoginState {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Login.LoginState",
      interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
      cases: [["LoggedOut"], ["LoggedIn", "string"]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

  CompareTo(other) {
    return compareUnions(this, other) | 0;
  }

}
setType("Client.Login.LoginState", LoginState);
export class Model {
  constructor(state, login, errorMsg) {
    this.State = state;
    this.Login = login;
    this.ErrorMsg = errorMsg;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Login.Model",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        State: LoginState,
        Login: Login_2,
        ErrorMsg: "string"
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
setType("Client.Login.Model", Model);
export function authUser(login, apiUrl) {
  return function (builder_) {
    return builder_.Delay(function () {
      if (isNullOrEmpty(login.UserName)) {
        return toFail(printf("You need to fill in a username."));
      } else if (isNullOrEmpty(login.Password)) {
        return toFail(printf("You need to fill in a password."));
      } else {
        const body = toJson(login);
        const props = ofArray([new Fetch_types.RequestProperties(0, "POST"), new Fetch_types.RequestProperties(1, {
          ["Content-Type"]: "application/json"
        }), new Fetch_types.RequestProperties(2, body)]);
        return builder_.Delay(function () {
          return _fetch(apiUrl, props).then(function (_arg1) {
            return !_arg1.ok ? toFail(printf("Error: %d"))(_arg1.status) : _arg1.text().then(function (_arg2) {
              return Promise.resolve(_arg2);
            });
          });
        }).catch(function (_arg3) {
          return toFail(printf("Could not authenticate user."));
        });
      }
    });
  }(PromiseImpl.promise);
}
export function authUserCmd(login, apiUrl) {
  return Cmd.ofPromise(function (tupledArg) {
    return authUser(tupledArg[0], tupledArg[1]);
  }, [login, apiUrl], function (arg0) {
    return new LoginMsg(0, arg0);
  }, function (arg0_1) {
    return new LoginMsg(3, arg0_1);
  });
}
export function init(user) {
  if (user != null) {
    return [(() => {
      const Login = new Login_2(user.UserName, "", newGuid());
      return new Model(new LoginState(1, user.Token), Login, "");
    })(), Cmd.none()];
  } else {
    return [(() => {
      const Login_1 = new Login_2("", "", newGuid());
      return new Model(new LoginState(0), Login_1, "");
    })(), Cmd.none()];
  }
}
export function update(msg, model) {
  switch (msg.tag) {
    case 1:
      return [(() => {
        const Login = new Login_2(msg.data, "", newGuid());
        return new Model(model.State, Login, model.ErrorMsg);
      })(), new List()];

    case 2:
      return [(() => {
        const Login_1 = new Login_2(model.Login.UserName, msg.data, model.Login.PasswordId);
        return new Model(model.State, Login_1, model.ErrorMsg);
      })(), new List()];

    case 4:
      return [model, authUserCmd(model.Login, "/api/users/login")];

    case 3:
      return [(() => {
        const ErrorMsg = msg.data.message;
        return new Model(model.State, model.Login, ErrorMsg);
      })(), new List()];

    default:
      return [new Model(new LoginState(1, msg.data), (() => {
        const PasswordId = newGuid();
        return new Login_2(model.Login.UserName, "", PasswordId);
      })(), model.ErrorMsg), new List()];
  }
}
export const ENTER_KEY = 13;
export function view(model, dispatch) {
  const showErrorClass = isNullOrEmpty(model.ErrorMsg) ? "hidden" : "";
  const buttonActive = (isNullOrEmpty(model.Login.UserName) ? true : isNullOrEmpty(model.Login.Password)) ? "btn-disabled" : "btn-primary";

  const onEnter = function (msg, dispatch_1) {
    return new Props.DOMAttr(14, function (_arg1) {
      if (_arg1.keyCode === 13) {
        _arg1.preventDefault();

        dispatch_1(msg);
      }
    });
  };

  if (model.State.tag === 0) {
    return createElement("div", {
      className: "signInBox"
    }, createElement("h3", {
      className: "text-center"
    }, "Log in with 'test' / 'test'."), createElement("div", {
      className: showErrorClass
    }, createElement("div", {
      className: "alert alert-danger"
    }, model.ErrorMsg)), createElement("div", {
      className: "input-group input-group-lg"
    }, createElement("span", {
      className: "input-group-addon"
    }, createElement("span", {
      className: "glyphicon glyphicon-user"
    })), createElement("input", {
      id: "username",
      type: "text",
      className: "form-control input-lg",
      placeholder: "Username",
      defaultValue: model.Login.UserName,
      onChange: function (ev) {
        dispatch(new AppMsg(4, new LoginMsg(1, ev.target.value)));
      },
      autoFocus: true
    })), createElement("div", {
      className: "input-group input-group-lg"
    }, createElement("span", {
      className: "input-group-addon"
    }, createElement("span", {
      className: "glyphicon glyphicon-asterisk"
    })), createElement("input", createObj(ofArray([new Props.HTMLAttr(56, "password"), new Props.Prop(0, "password_" + toString(model.Login.PasswordId)), new Props.HTMLAttr(116, "password"), new Props.HTMLAttr(22, "form-control input-lg"), new Props.HTMLAttr(85, "Password"), new Props.HTMLAttr(1, model.Login.Password), new Props.DOMAttr(9, function (ev_1) {
      dispatch(new AppMsg(4, new LoginMsg(2, ev_1.target.value)));
    }), onEnter(new AppMsg(4, new LoginMsg(4)), dispatch)]), 1))), createElement("div", {
      className: "text-center"
    }, createElement("button", {
      className: "btn " + buttonActive,
      onClick: function (_arg1_1) {
        dispatch(new AppMsg(4, new LoginMsg(4)));
      }
    }, "Log In")));
  } else {
    return createElement("div", {
      id: "greeting"
    }, createElement("h3", {
      className: "text-center"
    }, toText(printf("Hi %s!"))(model.Login.UserName)));
  }
}