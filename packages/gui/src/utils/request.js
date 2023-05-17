import axios from "axios";
import Cookie from '@/utils/cookie'

const xsrfHeaderName = "Authorization";

axios.defaults.timeout = 30000;
axios.defaults.withCredentials = false;

const AUTH_TYPE = {
  BEARER: "Bearer",
  BASIC: "basic",
  AUTH1: "auth1",
  AUTH2: "auth2",
};

const METHOD = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PUT: "put",
};

async function request(url, method, params, config) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, { params, ...config });
    case METHOD.POST:
      return axios.post(url, params, config);
    case METHOD.DELETE:
      return axios.delete(url, params, config);
    case METHOD.PUT:
      return axios.put(url, params, config);
    default:
      return axios.get(url, { params, ...config });
  }
}

async function mock(d) {
  return new Promise((resolve) => {
		resolve(d);
	});
}

async function merge(ary) {
  return axios.all(ary).then();
}

function spread(callback) {
  return axios.spread(callback);
}

function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.set(xsrfHeaderName, "Bearer " + auth.token, {
        expires: auth.expireAt,
      });
      break;
    case AUTH_TYPE.BASIC:
      Cookie.set(xsrfHeaderName, auth.token, { expires: auth.expireAt });
      break;
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.remove(xsrfHeaderName);
      break;
    case AUTH_TYPE.BASIC:
      Cookie.remove(xsrfHeaderName);
      break;
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookie.get(xsrfHeaderName)) {
        return true;
      }
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
  return false;
}

function getHeaders(headers) {
  return {
    ...headers,
    Authorization: Cookie.get("Authorization")
      ? "Bearer " + (Cookie.get("Authorization") || "").replace("Basic ", "")
      : "",
    SCHEMA_ID: localStorage.getItem("SCHEMA_ID"),
    SCHEMA_TYPE: localStorage.getItem("SCHEMA_TYPE"),
    NAMESPACE: localStorage.getItem("NAMESPACE"),
  };
}

function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors;
  request.forEach((item) => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== "function") {
      onFulfilled = (config) => config;
    }
    if (!onRejected || typeof onRejected !== "function") {
      onRejected = (error) => Promise.reject(error);
    }
    axios.interceptors.request.use(
      (config) => {
        if (
          !config.headers["Authorization"] &&
          config.url.indexOf("/login") == -1 &&
          !!Cookie.get(xsrfHeaderName)
        ) {
          config.headers["Authorization"] =
            "Bearer " + Cookie.get(xsrfHeaderName);
        }
        if (localStorage.getItem("SCHEMA_ID")) {
          config.headers["SCHEMA_ID"] = localStorage.getItem("SCHEMA_ID");
        }
        if (localStorage.getItem("SCHEMA_TYPE")) {
          config.headers["SCHEMA_TYPE"] = localStorage.getItem("SCHEMA_TYPE");
        }
        if (localStorage.getItem("NAMESPACE")) {
          config.headers["NAMESPACE"] = localStorage.getItem("NAMESPACE");
        }
        return onFulfilled(config, options);
      },
      (error) => onRejected(error, options),
    );
  });
  response.forEach((item) => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== "function") {
      onFulfilled = (response) => response;
    }
    if (!onRejected || typeof onRejected !== "function") {
      onRejected = (error) => Promise.reject(error);
    }
    axios.interceptors.response.use(
      (response) => onFulfilled(response, options),
      (error) => onRejected(error, options),
    );
  });
}

function parseUrlParams(url) {
  const params = {};
  if (!url || url === "" || typeof url !== "string") {
    return params;
  }
  const paramsStr = url.split("?")[1];
  if (!paramsStr) {
    return params;
  }
  const paramsArr = paramsStr.replace(/&|=/g, " ").split(" ");
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1];
    params[paramsArr[i * 2]] =
      value === "true" ? true : value === "false" ? false : value;
  }
  return params;
}

export {
  METHOD,
  AUTH_TYPE,
  request,
  merge,
  spread,
	mock,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams,
  getHeaders,
};
