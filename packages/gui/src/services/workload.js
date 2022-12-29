import api from "@/services/api";
import { request, METHOD } from "@/utils/request";

export async function CRONJOB(params, id, child) {
  return call(api.K8S.CRONJOB, params, id, child);
}

export async function DAEMONSET(params, id, child) {
  return call(api.K8S.DAEMONSET, params, id, child);
}

export async function DEPLOYMENT(params, id, child) {
  return call(api.K8S.DEPLOYMENT, params, id, child);
}

export async function JOB(params, id, child) {
  return call(api.K8S.JOB, params, id, child);
}

export async function POD(params, id, child) {
  return call(api.K8S.POD, params, id, child);
}

export async function REPLICASET(params, id, child) {
  return call(api.K8S.REPLICASET, params, id, child);
}

export async function REPLICATIONCONTROLLER(params, id, child) {
  return call(api.K8S.REPLICATIONCONTROLLER, params, id, child);
}

export async function STATEFULSET(params, id, child) {
  return call(api.K8S.STATEFULSET, params, id, child);
}

function call(path, params, id, child) {
  if (child && id) {
    return request(CHILD_URL(path, params, id, child), METHOD.GET);
  } else if (id) {
    return request(DETAIL_URL(path, params, id), METHOD.GET);
  } else {
    return request(URL(path, params), METHOD.GET);
  }
}

function CHILD_URL(path, params, id, child) {
  let append =
    "/" +
    id +
    "/" +
    child +
    api.K8S.append(
      params ? params.pageSize : 0,
      params ? params.pageNo : 1,
      "d,creationTimestamp",
    );
  return api.K8S.encode(path, append, params.filters?.namespaceQL || null);
}

function DETAIL_URL(path, params, id) {
  let append = "/" + id;
  return api.K8S.encode(path, append, params.filters?.namespaceQL || null);
}

function URL(path, params) {
  let append = api.K8S.append(
    params ? params.pageSize : 0,
    params ? params.pageNo : 1,
    "d,creationTimestamp",
  );
  return api.K8S.encode(path, append, params.filters?.namespaceQL || null);
}

export default {
  CRONJOB,
  DAEMONSET,
  DEPLOYMENT,
  JOB,
  POD,
  REPLICASET,
  REPLICATIONCONTROLLER,
  STATEFULSET,
};
