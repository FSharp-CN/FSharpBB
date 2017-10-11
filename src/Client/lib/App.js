import { setType } from "./fable-core/Symbol";
import _Symbol from "./fable-core/Symbol";
import { view as view_1, update as update_1, init as init_2, Model as Model_1 } from "./pages/Login";
import { view as view_2, update as update_2, init as init_1, Model as Model_2 } from "./pages/WishList";
import { createObj, compareRecords, equalsRecords, compareUnions, equals } from "./fable-core/Util";
import { UserData, toHash, AppMsg, Page as Page_2 } from "./Messages";
import { view as view_3, init as init_3, Model as Model_3 } from "./pages/Menu";
import CurriedLambda from "./fable-core/CurriedLambda";
import { ofArray } from "./fable-core/List";
import List from "./fable-core/List";
import { parseHash, oneOf, s, map } from "./fable/parser";
import { Cmd } from "./fable/cmd";
import { ProgramModule as ProgramModule_1, Navigation } from "./fable/navigation";
import { printf, toConsole } from "./fable-core/String";
import { delete as _delete, save } from "./Utils";
import { createElement } from "react";
import { Common } from "./fable/common";
import { centerStyle, words, viewLink } from "./Style";
import { Version } from "./ReleaseNotes";
import { result as result_2 } from "./Validation";
import { ProgramModule } from "./fable/program";
import { withReact } from "./fable/react";
export class SubModel {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.App.SubModel",
      interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
      cases: [["NoSubModel"], ["LoginModel", Model_1], ["WishListModel", Model_2]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

  CompareTo(other) {
    return compareUnions(this, other) | 0;
  }

}
setType("Client.App.SubModel", SubModel);
export class Model {
  constructor(page, menu, subModel) {
    this.Page = page;
    this.Menu = menu;
    this.SubModel = subModel;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.App.Model",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        Page: Page_2,
        Menu: Model_3,
        SubModel: SubModel
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
setType("Client.App.Model", Model);
export const pageParser = CurriedLambda((() => {
  const parsers = ofArray([map(new Page_2(0), s("home")), map(new Page_2(1), s("login")), map(new Page_2(2), s("wishlist"))]);
  return function (state) {
    return oneOf(parsers, state);
  };
})());
export function urlUpdate(result, model) {
  if (result != null) {
    if (result.tag === 2) {
      const matchValue = model.Menu.User;

      if (matchValue == null) {
        return [model, Cmd.ofMsg(new AppMsg(6))];
      } else {
        const patternInput = init_1(matchValue);
        return [(() => {
          const SubModel_1 = new SubModel(2, patternInput[0]);
          return new Model(result, model.Menu, SubModel_1);
        })(), Cmd.map(function (arg0) {
          return new AppMsg(5, arg0);
        }, patternInput[1])];
      }
    } else if (result.tag === 0) {
      return [new Model(result, new Model_3(model.Menu.User, ""), model.SubModel), new List()];
    } else {
      const patternInput_1 = init_2(model.Menu.User);
      return [(() => {
        const SubModel_2 = new SubModel(1, patternInput_1[0]);
        return new Model(result, model.Menu, SubModel_2);
      })(), Cmd.map(function (arg0_1) {
        return new AppMsg(4, arg0_1);
      }, patternInput_1[1])];
    }
  } else {
    console.error("Error parsing url");
    return [model, Navigation.modifyUrl(toHash(model.Page))];
  }
}
export function init(result) {
  const patternInput = init_3();
  const m = new Model(new Page_2(0), patternInput[0], new SubModel(0));
  const patternInput_1 = urlUpdate(result, m);
  return [patternInput_1[0], Cmd.batch(ofArray([patternInput_1[1], patternInput[1]]))];
}
export function update(msg, model) {
  const matchValue = [msg, model.SubModel];

  if (matchValue[0].tag === 2) {
    toConsole(printf("Unable to access local storage: %A", 1))(matchValue[0].data);
    return [model, new List()];
  } else if (matchValue[0].tag === 4) {
    if (matchValue[1].tag === 1) {
      const patternInput = update_1(matchValue[0].data, matchValue[1].data);
      const cmd = Cmd.map(function (arg0) {
        return new AppMsg(4, arg0);
      }, patternInput[1]);

      if (patternInput[0].State.tag === 1) {
        const newUser = new UserData(patternInput[0].Login.UserName, patternInput[0].State.data);
        const cmd_1 = equals(model.Menu.User, newUser) ? cmd : Cmd.batch(ofArray([cmd, Cmd.ofFunc(function (data) {
          save("user", data);
        }, newUser, function () {
          return new AppMsg(0);
        }, function (arg0_1) {
          return new AppMsg(2, arg0_1);
        })]));
        return [(() => {
          const SubModel_1 = new SubModel(1, patternInput[0]);
          const Menu = new Model_3(newUser, model.Menu.query);
          return new Model(model.Page, Menu, SubModel_1);
        })(), cmd_1];
      } else {
        return [(() => {
          const SubModel_2 = new SubModel(1, patternInput[0]);
          const Menu_1 = new Model_3(null, model.Menu.query);
          return new Model(model.Page, Menu_1, SubModel_2);
        })(), cmd];
      }
    } else {
      return [model, Cmd.none()];
    }
  } else if (matchValue[0].tag === 5) {
    if (matchValue[1].tag === 2) {
      const patternInput_1 = update_2(matchValue[0].data, matchValue[1].data);
      const cmd_2 = Cmd.map(function (arg0_2) {
        return new AppMsg(5, arg0_2);
      }, patternInput_1[1]);
      return [(() => {
        const SubModel_3 = new SubModel(2, patternInput_1[0]);
        return new Model(model.Page, model.Menu, SubModel_3);
      })(), cmd_2];
    } else {
      return [model, Cmd.none()];
    }
  } else if (matchValue[0].tag === 0) {
    const nextPage = new Page_2(2);
    const patternInput_2 = urlUpdate(nextPage, model);
    const matchValue_1 = patternInput_2[0].Menu.User;

    if (matchValue_1 == null) {
      return [patternInput_2[0], Cmd.ofMsg(new AppMsg(6))];
    } else {
      return [patternInput_2[0], Cmd.batch(ofArray([patternInput_2[1], Navigation.newUrl(toHash(nextPage))]))];
    }
  } else if (matchValue[0].tag === 1) {
    return [(() => {
      const Page = new Page_2(0);
      const SubModel_4 = new SubModel(0);
      return new Model(Page, new Model_3(null, model.Menu.query), SubModel_4);
    })(), Navigation.newUrl(toHash(new Page_2(0)))];
  } else if (matchValue[0].tag === 6) {
    return [model, Cmd.ofFunc(function (key) {
      _delete(key);
    }, "user", function () {
      return new AppMsg(1);
    }, function (arg0_3) {
      return new AppMsg(2, arg0_3);
    })];
  } else {
    const patternInput_3 = init_2(null);
    return [(() => {
      const Page_1 = new Page_2(1);
      const SubModel_5 = new SubModel(1, patternInput_3[0]);
      return new Model(Page_1, model.Menu, SubModel_5);
    })(), Cmd.batch(ofArray([patternInput_3[1], Navigation.newUrl(toHash(new Page_2(1)))]))];
  }
}
export function viewPage(model, dispatch) {
  if (model.Page.tag === 1) {
    if (model.SubModel.tag === 1) {
      return ofArray([createElement("div", {}, view_1(model.SubModel.data, dispatch))]);
    } else {
      return new List();
    }
  } else if (model.Page.tag === 2) {
    if (model.SubModel.tag === 2) {
      return ofArray([createElement("div", {}, Common.lazyView2(function (model_1, dispatch_1) {
        return view_2(model_1, dispatch_1);
      })(model.SubModel.data, dispatch))]);
    } else {
      return new List();
    }
  } else {
    return ofArray([viewLink(new Page_2(1), "Please login into the SAFE-Stack sample app"), createElement("br", {}), createElement("br", {}), createElement("br", {}), createElement("br", {}), createElement("br", {}), createElement("br", {}), createElement("br", {}), words(20, "Made with"), createElement("a", {
      href: "https://safe-stack.github.io/"
    }, createElement("img", {
      src: "/Images/safe_logo.png"
    })), words(15, "An end-to-end, functional-first stack for cloud-ready web development that emphasises type-safe programming."), createElement("br", {}), createElement("br", {}), createElement("br", {}), createElement("br", {}), words(20, "version " + Version)]);
  }
}
export function view(model, dispatch) {
  return createElement("div", {}, Common.lazyView2(function (model_1, dispatch_1) {
    return view_3(model_1, dispatch_1);
  })(model.Menu, dispatch), createElement("hr", {}), createElement("div", createObj(ofArray([centerStyle("column")]), 1), ...viewPage(model, dispatch)));
}
toConsole(printf("Result:%A", 1))(result_2);
export function main() {
  ProgramModule.run(withReact("elmish-app", ProgramModule.withConsoleTrace((() => {
    const parser = function (location) {
      return parseHash(pageParser, location);
    };

    return function (program) {
      return ProgramModule_1.toNavigable(parser, function (result, model) {
        return urlUpdate(result, model);
      }, program);
    };
  })()(ProgramModule.mkProgram(function (result_1) {
    return init(result_1);
  }, function (msg, model_1) {
    return update(msg, model_1);
  }, function (model_2, dispatch) {
    return view(model_2, dispatch);
  })))));
}