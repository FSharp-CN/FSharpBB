import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { equals, makeGeneric, compareRecords, equalsRecords } from "../fable-core/Util";
import List from "../fable-core/List";
import { isNullOrWhiteSpace } from "../fable-core/String";
import { forAll, exists } from "../fable-core/Seq";
export class Login {
  constructor(userName, password, passwordId) {
    this.UserName = userName;
    this.Password = password;
    this.PasswordId = passwordId;
  }

  [_Symbol.reflection]() {
    return {
      type: "ServerCode.Domain.Login",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        UserName: "string",
        Password: "string",
        PasswordId: "string"
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
setType("ServerCode.Domain.Login", Login);
export class Book {
  constructor(title, authors, link) {
    this.Title = title;
    this.Authors = authors;
    this.Link = link;
  }

  [_Symbol.reflection]() {
    return {
      type: "ServerCode.Domain.Book",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        Title: "string",
        Authors: "string",
        Link: "string"
      }
    };
  }

  Equals(other) {
    return equalsRecords(this, other);
  }

  CompareTo(other) {
    return compareRecords(this, other) | 0;
  }

  static get empty() {
    return new Book("", "", "");
  }

}
setType("ServerCode.Domain.Book", Book);
export class WishList {
  constructor(userName, books) {
    this.UserName = userName;
    this.Books = books;
  }

  [_Symbol.reflection]() {
    return {
      type: "ServerCode.Domain.WishList",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        UserName: "string",
        Books: makeGeneric(List, {
          T: Book
        })
      }
    };
  }

  Equals(other) {
    return equalsRecords(this, other);
  }

  CompareTo(other) {
    return compareRecords(this, other) | 0;
  }

  static New(userName) {
    return new WishList(userName, new List());
  }

}
setType("ServerCode.Domain.WishList", WishList);
export const Validation = function (__exports) {
  const verifyBookTitle = __exports.verifyBookTitle = function (title) {
    if (isNullOrWhiteSpace(title)) {
      return "No title was entered";
    } else {
      return null;
    }
  };

  const verifyBookAuthors = __exports.verifyBookAuthors = function (authors) {
    if (isNullOrWhiteSpace(authors)) {
      return "No author was entered";
    } else {
      return null;
    }
  };

  const verifyBookLink = __exports.verifyBookLink = function (link) {
    if (isNullOrWhiteSpace(link)) {
      return "No link was entered";
    } else {
      return null;
    }
  };

  const verifyBookisNotADuplicate = __exports.verifyBookisNotADuplicate = function (wishList, book) {
    if (exists(function (b) {
      return equals([b.Authors, b.Title], [book.Authors, book.Title]);
    }, wishList.Books)) {
      return "Your wishlist contains this book already.";
    } else {
      return null;
    }
  };

  const verifyBook = __exports.verifyBook = function (book) {
    if (equals(verifyBookTitle(book.Title), null) ? equals(verifyBookAuthors(book.Authors), null) : false) {
      return equals(verifyBookLink(book.Link), null);
    } else {
      return false;
    }
  };

  const verifyWishList = __exports.verifyWishList = function (wishList) {
    return function (list) {
      return forAll(function (book) {
        return verifyBook(book);
      }, list);
    }(wishList.Books);
  };

  return __exports;
}({});