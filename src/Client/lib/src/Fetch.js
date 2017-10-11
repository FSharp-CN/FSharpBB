import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { createObj, Interface, equals, Any } from "../fable-core/Util";
import { Promise as _Promise } from "./Promise";
import { toJson, ofJson } from "../fable-core/Serialize";
import { append, ofArray } from "../fable-core/List";
export const Fetch_types = function (__exports) {
  const HttpRequestHeaders = __exports.HttpRequestHeaders = class HttpRequestHeaders {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.PowerPack.Fetch.Fetch_types.HttpRequestHeaders",
        interfaces: ["FSharpUnion", "System.IEquatable"],
        cases: [["Accept", "string"], ["Accept-Charset", "string"], ["Accept-Encoding", "string"], ["Accept-Language", "string"], ["Accept-Datetime", "string"], ["Authorization", "string"], ["Cache-Control", "string"], ["Connection", "string"], ["Cookie", "string"], ["Content-Length", "string"], ["Content-MD5", "string"], ["Content-Type", "string"], ["Date", "string"], ["Expect", "string"], ["Forwarded", "string"], ["From", "string"], ["Host", "string"], ["If-Match", "string"], ["If-Modified-Since", "string"], ["If-None-Match", "string"], ["If-Range", "string"], ["If-Unmodified-Since", "string"], ["Max-Forwards", "number"], ["Origin", "string"], ["Pragma", "string"], ["Proxy-Authorization", "string"], ["Range", "string"], ["Referer", "string"], ["SOAPAction", "string"], ["TE", "string"], ["User-Agent", "string"], ["Upgrade", "string"], ["Via", "string"], ["Warning", "string"], ["X-Requested-With", "string"], ["DNT", "string"], ["X-Forwarded-For", "string"], ["X-Forwarded-Host", "string"], ["X-Forwarded-Proto", "string"], ["Front-End-Https", "string"], ["X-Http-Method-Override", "string"], ["X-ATT-DeviceId", "string"], ["X-Wap-Profile", "string"], ["Proxy-Connection", "string"], ["X-UIDH", "string"], ["X-Csrf-Token", "string"], ["Custom", "string", Any]]
      };
    }

    Equals(other) {
      return this === other || this.tag === other.tag && equals(this.data, other.data);
    }

  };
  setType("Fable.PowerPack.Fetch.Fetch_types.HttpRequestHeaders", HttpRequestHeaders);
  const RequestProperties = __exports.RequestProperties = class RequestProperties {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.PowerPack.Fetch.Fetch_types.RequestProperties",
        interfaces: ["FSharpUnion", "System.IEquatable"],
        cases: [["Method", "string"], ["Headers", Interface("Fable.PowerPack.Fetch.Fetch_types.IHttpRequestHeaders")], ["Body", Any], ["Mode", "string"], ["Credentials", "string"], ["Cache", "string"]]
      };
    }

    Equals(other) {
      return this === other || this.tag === other.tag && equals(this.data, other.data);
    }

  };
  setType("Fable.PowerPack.Fetch.Fetch_types.RequestProperties", RequestProperties);
  return __exports;
}({});

function _fetch(url, init) {
  return fetch(url, createObj(init, 1)).then(function (response) {
    if (response.ok) {
      return response;
    } else {
      throw new Error(response.status.toString() + " " + response.statusText + " for URL " + response.url);
    }
  });
}

export { _fetch as fetch };
export function tryFetch(url, init) {
  return _Promise.result(_fetch(url, init));
}
export function fetchAs(url, init, _genArgs) {
  return _fetch(url, init).then(function (fetched) {
    return fetched.text();
  }).then(function (json) {
    return ofJson(json, {
      T: _genArgs.T
    });
  });
}
export function tryFetchAs(url, init, _genArgs) {
  return _Promise.result(fetchAs(url, init, {
    T: _genArgs.T
  }));
}
export function postRecord(url, record, properties) {
  const defaultProps = ofArray([new Fetch_types.RequestProperties(0, "POST"), new Fetch_types.RequestProperties(1, {
    ["Content-Type"]: "application/json"
  }), new Fetch_types.RequestProperties(2, toJson(record))]);
  return function (init) {
    return _fetch(url, init);
  }(append(defaultProps, properties));
}
export function tryPostRecord(url, record, properties) {
  return _Promise.result(postRecord(url, record, properties));
}
export function putRecord(url, record, properties) {
  const defaultProps = ofArray([new Fetch_types.RequestProperties(0, "PUT"), new Fetch_types.RequestProperties(1, {
    ["Content-Type"]: "application/json"
  }), new Fetch_types.RequestProperties(2, toJson(record))]);
  return function (init) {
    return _fetch(url, init);
  }(append(defaultProps, properties));
}
export function tryPutRecord(url, record, properties) {
  return _Promise.result(putRecord(url, record, properties));
}
export function patchRecord(url, record, properties) {
  const defaultProps = ofArray([new Fetch_types.RequestProperties(0, "PATCH"), new Fetch_types.RequestProperties(1, {
    ["Content-Type"]: "application/json"
  }), new Fetch_types.RequestProperties(2, toJson(record))]);
  return function (init) {
    return _fetch(url, init);
  }(append(defaultProps, properties));
}