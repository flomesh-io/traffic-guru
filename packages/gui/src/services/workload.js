import api from "@/services/api";
import { request, METHOD } from "@/utils/request";

export async function CRONJOB(params, id, child) {
  return call(api.KUBE.CRONJOB, params, id, child);
}

export async function DAEMONSET(params, id, child) {
  return call(api.KUBE.DAEMONSET, params, id, child);
}

export async function DEPLOYMENT(params, id, child) {
  return call(api.KUBE.DEPLOYMENT, params, id, child);
}

export async function JOB(params, id, child) {
  return call(api.KUBE.JOB, params, id, child);
}

export async function POD(params, id, child) {
  return call(api.KUBE.POD, params, id, child);
}

export async function REPLICASET(params, id, child) {
  return call(api.KUBE.REPLICASET, params, id, child);
}

export async function REPLICATIONCONTROLLER(params, id, child) {
  return call(api.KUBE.REPLICATIONCONTROLLER, params, id, child);
}

export async function STATEFULSET(params, id, child) {
  return call(api.KUBE.STATEFULSET, params, id, child);
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
    api.KUBE.append(
      params ? params.pageSize : 0,
      params ? params.pageNo : 1,
      "d,creationTimestamp",
    );
  return api.KUBE.encode(path, append, params.filters?.namespaceQL || null);
}

function DETAIL_URL(path, params, id) {
  let append = "/" + id;
  return api.KUBE.encode(path, append, params.filters?.namespaceQL || null);
}

function URL(path, params) {
  let append = api.KUBE.append(
    params ? params.pageSize : 0,
    params ? params.pageNo : 1,
    "d,creationTimestamp",
  );
  return api.KUBE.encode(path, append, params.filters?.namespaceQL || null);
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
