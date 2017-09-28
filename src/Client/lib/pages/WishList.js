import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { Validation, Book, WishList } from "../Shared/Domain";
import { createObj, toString, equals, some, compare, compareRecords, equalsRecords, Option } from "../fable-core/Util";
import { filter, ofArray } from "../fable-core/List";
import List from "../fable-core/List";
import { fetchAs, Fetch_types } from "../src/Fetch";
import { PromiseImpl } from "../src/Promise";
import { Cmd } from "../fable/cmd";
import { AppMsg, WishListMsg } from "../Messages";
import { toJson } from "../fable-core/Serialize";
import { isNullOrWhiteSpace, printf, toText, isNullOrEmpty, newGuid } from "../fable-core/String";
import { map, empty, singleton, append, delay, sortWith, toList } from "../fable-core/Seq";
import { createElement } from "react";
import { Props } from "../fable/Fable.Helpers.React";
import { buttonLink } from "../Style";
export class Model {
  constructor(wishList, token, newBook, newBookId, titleErrorText, authorsErrorText, linkErrorText, errorMsg) {
    this.WishList = wishList;
    this.Token = token;
    this.NewBook = newBook;
    this.NewBookId = newBookId;
    this.TitleErrorText = titleErrorText;
    this.AuthorsErrorText = authorsErrorText;
    this.LinkErrorText = linkErrorText;
    this.ErrorMsg = errorMsg;
  }

  [_Symbol.reflection]() {
    return {
      type: "Client.WishList.Model",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        WishList: WishList,
        Token: "string",
        NewBook: Book,
        NewBookId: "string",
        TitleErrorText: Option("string"),
        AuthorsErrorText: Option("string"),
        LinkErrorText: Option("string"),
        ErrorMsg: Option("string")
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
setType("Client.WishList.Model", Model);
export function getWishList(token) {
  return function (builder_) {
    return builder_.Delay(function () {
      const props = ofArray([new Fetch_types.RequestProperties(1, {
        Authorization: "Bearer " + token
      })]);
      return fetchAs("api/wishlist/", props, {
        T: WishList
      });
    });
  }(PromiseImpl.promise);
}
export function loadWishListCmd(token) {
  return Cmd.ofPromise(function (token_1) {
    return getWishList(token_1);
  }, token, function (arg0) {
    return new WishListMsg(1, arg0);
  }, function (arg0_1) {
    return new WishListMsg(7, arg0_1);
  });
}
export function postWishList(token, wishList) {
  return function (builder_) {
    return builder_.Delay(function () {
      const body = toJson(wishList);
      const props = ofArray([new Fetch_types.RequestProperties(0, "POST"), new Fetch_types.RequestProperties(1, {
        Authorization: "Bearer " + token,
        ["Content-Type"]: "application/json"
      }), new Fetch_types.RequestProperties(2, body)]);
      return fetchAs("api/wishlist/", props, {
        T: WishList
      });
    });
  }(PromiseImpl.promise);
}
export function postWishListCmd(token, wishList) {
  return Cmd.ofPromise(function (tupledArg) {
    return postWishList(tupledArg[0], tupledArg[1]);
  }, [token, wishList], function (arg0) {
    return new WishListMsg(1, arg0);
  }, function (arg0_1) {
    return new WishListMsg(7, arg0_1);
  });
}
export function init(user) {
  return [new Model(WishList.New(user.UserName), user.Token, Book.empty, newGuid(), null, null, null, null), loadWishListCmd(user.Token)];
}
export function update(msg, model) {
  switch (msg.tag) {
    case 1:
      let wishList;
      const Books = toList(sortWith(($var1, $var2) => compare(function (b) {
        return b.Title;
      }($var1), function (b) {
        return b.Title;
      }($var2)), msg.data.Books));
      wishList = new WishList(msg.data.UserName, Books);
      return [new Model(wishList, model.Token, model.NewBook, model.NewBookId, model.TitleErrorText, model.AuthorsErrorText, model.LinkErrorText, model.ErrorMsg), Cmd.none()];

    case 4:
      const newBook = new Book(msg.data, model.NewBook.Authors, model.NewBook.Link);
      return [(() => {
        const TitleErrorText = Validation.verifyBookTitle(msg.data);
        const ErrorMsg = Validation.verifyBookisNotADuplicate(model.WishList, newBook);
        return new Model(model.WishList, model.Token, newBook, model.NewBookId, TitleErrorText, model.AuthorsErrorText, model.LinkErrorText, ErrorMsg);
      })(), Cmd.none()];

    case 5:
      const newBook_1 = new Book(model.NewBook.Title, msg.data, model.NewBook.Link);
      return [(() => {
        const AuthorsErrorText = Validation.verifyBookAuthors(msg.data);
        const ErrorMsg_1 = Validation.verifyBookisNotADuplicate(model.WishList, newBook_1);
        return new Model(model.WishList, model.Token, newBook_1, model.NewBookId, model.TitleErrorText, AuthorsErrorText, model.LinkErrorText, ErrorMsg_1);
      })(), Cmd.none()];

    case 6:
      const newBook_2 = new Book(model.NewBook.Title, model.NewBook.Authors, msg.data);
      return [(() => {
        const LinkErrorText = Validation.verifyBookLink(msg.data);
        const ErrorMsg_2 = Validation.verifyBookisNotADuplicate(model.WishList, newBook_2);
        return new Model(model.WishList, model.Token, newBook_2, model.NewBookId, model.TitleErrorText, model.AuthorsErrorText, LinkErrorText, ErrorMsg_2);
      })(), Cmd.none()];

    case 2:
      let wishList_1;
      const Books_1 = filter(function (y) {
        return !msg.data.Equals(y);
      }, model.WishList.Books);
      wishList_1 = new WishList(model.WishList.UserName, Books_1);
      return [(() => {
        const ErrorMsg_3 = Validation.verifyBookisNotADuplicate(wishList_1, model.NewBook);
        return new Model(wishList_1, model.Token, model.NewBook, model.NewBookId, model.TitleErrorText, model.AuthorsErrorText, model.LinkErrorText, ErrorMsg_3);
      })(), postWishListCmd(model.Token, wishList_1)];

    case 3:
      if (Validation.verifyBook(model.NewBook)) {
        const matchValue = Validation.verifyBookisNotADuplicate(model.WishList, model.NewBook);

        if (matchValue == null) {
          let wishList_2;
          const Books_2 = toList(sortWith(($var3, $var4) => compare(function (b_1) {
            return b_1.Title;
          }($var3), function (b_1) {
            return b_1.Title;
          }($var4)), new List(model.NewBook, model.WishList.Books)));
          wishList_2 = new WishList(model.WishList.UserName, Books_2);
          return [(() => {
            const NewBook = Book.empty;
            const NewBookId = newGuid();
            const ErrorMsg_4 = null;
            return new Model(wishList_2, model.Token, NewBook, NewBookId, model.TitleErrorText, model.AuthorsErrorText, model.LinkErrorText, ErrorMsg_4);
          })(), postWishListCmd(model.Token, wishList_2)];
        } else {
          return [(() => {
            const ErrorMsg_5 = some(matchValue);
            return new Model(model.WishList, model.Token, model.NewBook, model.NewBookId, model.TitleErrorText, model.AuthorsErrorText, model.LinkErrorText, ErrorMsg_5);
          })(), Cmd.none()];
        }
      } else {
        return [(() => {
          const TitleErrorText_1 = Validation.verifyBookTitle(model.NewBook.Title);
          const AuthorsErrorText_1 = Validation.verifyBookAuthors(model.NewBook.Authors);
          const LinkErrorText_1 = Validation.verifyBookLink(model.NewBook.Link);
          const ErrorMsg_6 = Validation.verifyBookisNotADuplicate(model.WishList, model.NewBook);
          return new Model(model.WishList, model.Token, model.NewBook, model.NewBookId, TitleErrorText_1, AuthorsErrorText_1, LinkErrorText_1, ErrorMsg_6);
        })(), Cmd.none()];
      }

    case 7:
      return [(() => {
        const ErrorMsg_7 = some(msg.data.message);
        return new Model(model.WishList, model.Token, model.NewBook, model.NewBookId, model.TitleErrorText, model.AuthorsErrorText, model.LinkErrorText, ErrorMsg_7);
      })(), Cmd.none()];

    default:
      return [model, new List()];
  }
}
export function newBookForm(model, dispatch) {
  const buttonActive = (((isNullOrEmpty(model.NewBook.Title) ? true : isNullOrEmpty(model.NewBook.Authors)) ? true : isNullOrEmpty(model.NewBook.Link)) ? true : !equals(model.ErrorMsg, null)) ? "btn-disabled" : "btn-primary";
  const titleStatus = isNullOrEmpty(model.NewBook.Title) ? "" : "has-success";
  const authorStatus = isNullOrEmpty(model.NewBook.Authors) ? "" : "has-success";
  const linkStatus = isNullOrEmpty(model.NewBook.Link) ? "" : "has-success";
  return createElement("div", {}, createElement("h4", {}, "New Book"), createElement("div", {
    className: "container"
  }, createElement("div", {
    className: "row"
  }, createElement("div", {
    className: "col-md-8"
  }, createElement("div", {
    className: "form-group has-feedback" + titleStatus
  }, ...toList(delay(function () {
    return append(singleton(createElement("div", {
      className: "input-group"
    }, ...toList(delay(function () {
      return append(singleton(createElement("span", {
        className: "input-group-addon"
      }, createElement("span", {
        className: "glyphicon glyphicon-pencil"
      }))), delay(function () {
        return append(singleton(createElement("input", {
          key: "Title_" + toString(model.NewBookId),
          type: "text",
          name: "Title",
          defaultValue: model.NewBook.Title,
          className: "form-control",
          placeholder: "Please insert book title",
          required: true,
          onChange: function (ev) {
            dispatch(new AppMsg(5, new WishListMsg(4, ev.target.value)));
          }
        })), delay(function () {
          return model.TitleErrorText != null ? singleton(createElement("span", {
            className: "glyphicon glyphicon-remove form-control-feedback"
          })) : empty();
        }));
      }));
    })))), delay(function () {
      return model.TitleErrorText != null ? singleton(createElement("p", {
        className: "text-danger"
      }, model.TitleErrorText)) : empty();
    }));
  }))), createElement("div", {
    className: "form-group has-feedback" + authorStatus
  }, ...toList(delay(function () {
    return append(singleton(createElement("div", {
      className: "input-group"
    }, ...toList(delay(function () {
      return append(singleton(createElement("span", {
        className: "input-group-addon"
      }, createElement("span", {
        className: "glyphicon glyphicon-user"
      }))), delay(function () {
        return append(singleton(createElement("input", {
          key: "Author_" + toString(model.NewBookId),
          type: "text",
          name: "Author",
          defaultValue: model.NewBook.Authors,
          className: "form-control",
          placeholder: "Please insert authors",
          required: true,
          onChange: function (ev_1) {
            dispatch(new AppMsg(5, new WishListMsg(5, ev_1.target.value)));
          }
        })), delay(function () {
          return model.AuthorsErrorText != null ? singleton(createElement("span", {
            className: "glyphicon glyphicon-remove form-control-feedback"
          })) : empty();
        }));
      }));
    })))), delay(function () {
      return model.AuthorsErrorText != null ? singleton(createElement("p", {
        className: "text-danger"
      }, model.AuthorsErrorText)) : empty();
    }));
  }))), createElement("div", {
    className: "form-group has-feedback" + linkStatus
  }, ...toList(delay(function () {
    return append(singleton(createElement("div", {
      className: "input-group"
    }, ...toList(delay(function () {
      return append(singleton(createElement("span", {
        className: "input-group-addon"
      }, createElement("span", {
        className: "glyphicon glyphicon glyphicon-pencil"
      }))), delay(function () {
        return append(singleton(createElement("input", {
          key: "Link_" + toString(model.NewBookId),
          type: "text",
          name: "Link",
          defaultValue: model.NewBook.Link,
          className: "form-control",
          placeholder: "Please insert link",
          required: true,
          onChange: function (ev_2) {
            dispatch(new AppMsg(5, new WishListMsg(6, ev_2.target.value)));
          }
        })), delay(function () {
          return model.LinkErrorText != null ? singleton(createElement("span", {
            className: "glyphicon glyphicon-remove form-control-feedback"
          })) : empty();
        }));
      }));
    })))), delay(function () {
      return model.LinkErrorText != null ? singleton(createElement("p", {
        className: "text-danger"
      }, model.LinkErrorText)) : empty();
    }));
  }))), createElement("div", {}, ...toList(delay(function () {
    return append(singleton(createElement("button", {
      className: "btn " + buttonActive,
      onClick: function (_arg1) {
        dispatch(new AppMsg(5, new WishListMsg(3)));
      }
    }, createElement("i", createObj(ofArray([new Props.HTMLAttr(22, "glyphicon glyphicon-plus"), ["style", {
      paddingRight: 5
    }]]), 1)), "Add")), delay(function () {
      return model.ErrorMsg != null ? singleton(createElement("p", {
        className: "text-danger"
      }, model.ErrorMsg)) : empty();
    }));
  })))))));
}
export function view(model, dispatch) {
  return createElement("div", {}, createElement("h4", {}, toText(printf("Wishlist for %s"))(model.WishList.UserName)), createElement("table", {
    className: "table table-striped table-hover"
  }, createElement("thead", {}, createElement("tr", {}, createElement("th", {}, "Title"), createElement("th", {}, "Authors"))), createElement("tbody", {}, ...toList(delay(function () {
    return map(function (book) {
      return createElement("tr", {}, createElement("td", {}, ...toList(delay(function () {
        return isNullOrWhiteSpace(book.Link) ? singleton(book.Title) : singleton(createElement("a", {
          href: book.Link,
          target: "_blank"
        }, book.Title));
      }))), createElement("td", {}, book.Authors), createElement("td", {}, buttonLink("", function () {
        dispatch(new AppMsg(5, new WishListMsg(2, book)));
      }, ofArray(["Remove"]))));
    }, model.WishList.Books);
  })))), newBookForm(model, dispatch));
}