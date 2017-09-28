import { setType } from "./fable-core/Symbol";
import _Symbol from "./fable-core/Symbol";
import { compareUnions, compareRecords, equalsRecords, equals } from "./fable-core/Util";
import { Book, WishList } from "./Shared/Domain";
export class LoginMsg {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Messages.LoginMsg",
      interfaces: ["FSharpUnion", "System.IEquatable"],
      cases: [["GetTokenSuccess", "string"], ["SetUserName", "string"], ["SetPassword", "string"], ["AuthError", Error], ["ClickLogIn"]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

}
setType("Client.Messages.LoginMsg", LoginMsg);
export class WishListMsg {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Messages.WishListMsg",
      interfaces: ["FSharpUnion", "System.IEquatable"],
      cases: [["LoadForUser", "string"], ["FetchedWishList", WishList], ["RemoveBook", Book], ["AddBook"], ["TitleChanged", "string"], ["AuthorsChanged", "string"], ["LinkChanged", "string"], ["FetchError", Error]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

}
setType("Client.Messages.WishListMsg", WishListMsg);
export class AppMsg {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Messages.AppMsg",
      interfaces: ["FSharpUnion", "System.IEquatable"],
      cases: [["LoggedIn"], ["LoggedOut"], ["StorageFailure", Error], ["OpenLogIn"], ["LoginMsg", LoginMsg], ["WishListMsg", WishListMsg], ["Logout"]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

}
setType("Client.Messages.AppMsg", AppMsg);
export class UserData {
  constructor(userName, token) {
    this.UserName = userName;
    this.Token = token;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Messages.UserData",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        UserName: "string",
        Token: "string"
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
setType("Client.Messages.UserData", UserData);
export class Page {
  constructor(tag, data) {
    this.tag = tag;
    this.data = data;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.Messages.Page",
      interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
      cases: [["Home"], ["Login"], ["WishList"]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && equals(this.data, other.data);
  }

  CompareTo(other) {
    return compareUnions(this, other) | 0;
  }

}
setType("Client.Messages.Page", Page);
export function toHash(_arg1) {
  if (_arg1.tag === 1) {
    return "#login";
  } else if (_arg1.tag === 2) {
    return "#wishlist";
  } else {
    return "#home";
  }
}