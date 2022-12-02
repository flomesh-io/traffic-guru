import { request, METHOD } from "@/utils/request";
import { message } from "ant-design-vue";
import REST from "./api";
import _ from "lodash";
import { checkAuthorization } from "@/utils/request";

function pipeMsg(msg) {
  return (msg || "").replace("GraphQL error:", "Error:");
}

function getVariablesPayload(variables, variablesType) {
  let rtn = "";
  if (variables) {
    Object.keys(variables).forEach((key, i) => {
      if (i > 0) {
        rtn += ",";
      }
      const type =
        variablesType && variablesType[key] ? variablesType[key] : "JSON";
      rtn += `$${key}: ${type}`;
    });
  }
  return rtn;
}

function messageError(msg, noMsg){
	if(!noMsg){
		message.error(pipeMsg(msg), 3);
	}
	if(location.hash != '#/login' && !checkAuthorization()){
		location.reload();
	}
}

export function query(query, variables, variablesType, fetchPolicy) {
  try {
    let variablesPayload = variables
      ? getVariablesPayload(variables, variablesType)
      : null;
    let options = {
      query: variablesPayload
        ? `query(${variablesPayload}){${query}}`
        : `query{${query}}`,
      variables: variables ? _.cloneDeep(variables) : null,
      fetchPolicy: fetchPolicy ? fetchPolicy : "network-only",
    };
    return new Promise((resolve, reject) => {
      request(REST.GQL, METHOD.POST, options)
        .then((fetchRes) => {
          if (fetchRes.status == 200) {
            const res = fetchRes.data;
            if (res.errors) {
              messageError(res.errors.message);
              reject(res.errors);
            } else if (res.errors && res.errors[0].message) {
              messageError(res.errors[0].message);
              reject(res.errors);
            } else if (!res.data || Object.keys(res.data).length == 0) {
              resolve(null);
            } else {
              resolve(res.data[Object.keys(res.data)[0]]);
            }
          } else {
            if (fetchRes.status) {
              messageError(fetchRes.statusText);
              reject(fetchRes.statusText);
            } else if (fetchRes.errors && fetchRes.errors.message) {
              messageError(fetchRes.errors.message);
              reject(fetchRes.errors);
            } else if (fetchRes.errors && fetchRes.errors[0].message) {
              messageError(fetchRes.errors[0].message);
              reject(fetchRes.errors);
            }
          }
        })
        .catch((e) => {
          if (e.networkError) {
            if (e.networkError.message) {
              messageError(e.networkError.message);
            } else if (e.networkError.result.errors) {
              messageError(e.networkError.result.errors[0].message);
            }
          } else {
            messageError(e.message);
          }
          reject(e);
        });
    });
  } catch (error) {
    messageError(error.message);
    return null;
  }
}
export function mutation(mutation, variables, variablesType, update, noMsg) {
  try {
    let variablesPayload = variables
      ? getVariablesPayload(variables, variablesType)
      : null;
    let options = {
      query: variablesPayload
        ? `mutation(${variablesPayload}){${mutation}}`
        : `mutation{${mutation}}`,
      variables: variables ? _.cloneDeep(variables) : null,
      update: update,
    };
    return new Promise((resolve, reject) => {
      request(REST.GQL, METHOD.POST, options)
        .then((fetchRes) => {
          if (fetchRes.status == 200) {
            const res = fetchRes.data;
            if (res.errors && res.errors.message) {
							messageError(res.errors.message, noMsg);
              reject(res.errors);
            } else if (res.errors && res.errors[0].message) {
							messageError(res.errors[0].message, noMsg);
              reject(res.errors);
            } else if (!res.data || Object.keys(res.data).length == 0) {
              resolve(null);
            } else {
              resolve(res.data[Object.keys(res.data)[0]]);
            }
          } else {
						if (fetchRes.status) {
							messageError(fetchRes.statusText, noMsg);
							reject(fetchRes.statusText);
						} else if (fetchRes.errors && fetchRes.errors.message) {
							messageError(fetchRes.errors.message, noMsg);
							reject(fetchRes.errors);
						} else if (fetchRes.errors && fetchRes.errors[0].message) {
							messageError(fetchRes.errors[0].message, noMsg);
							reject(fetchRes.errors);
						}
          }
        })
        .catch((e) => {
          if (!noMsg) {
            if (e.networkError && e.networkError.result.errors) {
							messageError(e.networkError.result.errors[0].message, noMsg);
            } else {
							messageError(e.message, noMsg);
            }
          }
          reject(e);
        });
    });
  } catch (e) {
		messageError(e.message, noMsg);
    let result = { errors: e };
    return result;
  }
}
