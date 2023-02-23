const API_PROXY_PREFIX = "/api";
const DEFAULT_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_API_BASE_URL
      ? process.env.VUE_APP_API_BASE_URL
      : window.location.origin
    : API_PROXY_PREFIX;
const BASE_URL = DEFAULT_BASE_URL + '/api';
const FLB_BASE = `${BASE_URL}/flb`;
const K8S_BASE = `${BASE_URL}/k8s`;
const CLICKHOUSE_BASE = `${BASE_URL}/clickhouse`;
const PROMETHEUS_BASE = `${BASE_URL}/prometheus`;

module.exports = {
  BASE_URL,
  DEFAULT_BASE_URL,
  GQL: `${DEFAULT_BASE_URL}/graphql`,
  UPLOAD: `${BASE_URL}/upload`,
  LOGIN: `${BASE_URL}/login`,
  ROUTES: `${BASE_URL}/routes`,
  DASHBOARD: `${FLB_BASE}/frontend/dashboard`,
  GET_4LB: `${FLB_BASE}/4lb`,
  GET_7LB: `${FLB_BASE}/7lb`,
  GET_LB: (path) => {
    if (path.indexOf("/4lb") >= 0) {
      return `${FLB_BASE}/4lb`;
    } else if (path.indexOf("/7lb") >= 0) {
      return `${FLB_BASE}/7lb`;
    } else {
      return `${FLB_BASE}/4lb`;
    }
  },
  LOG_4LB: `${FLB_BASE}/logs/4lb`,
  LOG_7LB: `${FLB_BASE}/logs/7lb`,
  LOG: `${FLB_BASE}/logs`,
  TPS_7LB: `${FLB_BASE}/tps/7lb`,
  TPS_4LB: `${FLB_BASE}/tps/4lb`,
  ERROR_RATE: `${FLB_BASE}/error-rate/7lb`,
  ADDRESS: `${FLB_BASE}/addresses`,
  ADDRESS_POOL: `${FLB_BASE}/address-pools`,
  EVENTS: `${BASE_URL}/events`,
  CLUSTER: `${FLB_BASE}/clusters`,
  ZONE: `${FLB_BASE}/zones`,
  NODE: `${FLB_BASE}/nodes`,
  PROFILE: `${FLB_BASE}/profiles`,
  CLICKHOUSE: {
    QUERY: (sql) => {
      return `${CLICKHOUSE_BASE}/?query=` + "" + encodeURIComponent(sql);
    },
  },
  PROMETHEUS: {
    QUERY: (sql, namespace, meshName) => {
      let path = "";
      if (meshName) {
        path = `${PROMETHEUS_BASE}/mesh/${meshName}/?type=query_range&query=`;
      } else if (namespace) {
        path = `${PROMETHEUS_BASE}/namespace/${namespace}/?type=query_range&query=`;
      } else {
        path = `${PROMETHEUS_BASE}/?type=query_range&query=`;
      }
      return path + new URLSearchParams(sql).toString().replace("%29=", "%29");
    },
    QUERY_RANGE: (sql, namespace, meshName) => {
      let path = "";
      if (meshName) {
        path = `${PROMETHEUS_BASE}/mesh/${meshName}/?type=query_range&query=`;
      } else if (namespace) {
        path = `${PROMETHEUS_BASE}/namespace/${namespace}/?type=query_range&query=`;
      } else {
        path = `${PROMETHEUS_BASE}/?type=query_range&query=`;
      }
      return path + encodeURI(sql);
    },
  },
  K8S: {
    append: (size, page, sort, filter, search) => {
      return (
        "?itemsPerPage=" +
        size +
        (page ? "&page=" + page : "") +
        (sort ? "&sortBy=" + sort : "") +
        (filter ? "&filterBy=name," + filter : "") +
        (search ? "&search=" + search : "")
      );
    },
    encode: (url, append, ns) => {
      let namespace = ns || localStorage.getItem("NAMESPACE");
      return (
        `${K8S_BASE}` +
          url.replace(
            "/{namespace}",
            namespace == "_all" ? "" : ("/" + namespace || "default"),
          ) +
            "" +
            (append ? append : "")
      );
    },
    DAEMONSET: "/daemonset/{namespace}",
    CRONJOB: "/cronjob/{namespace}",
    JOB: "/job/{namespace}",
    DEPLOYMENT: "/deployment/{namespace}",
    POD: "/pod/{namespace}",
    SERVICE: "/service/{namespace}",
    REPLICASET: "/replicaset/{namespace}",
    STATEFULSET: "/statefulset/{namespace}",
    REPLICATIONCONTROLLER: "/replicationcontroller/{namespace}",
    SECRET: "/secret/{namespace}",
    INGRESS: "/ingress/{namespace}",
    SIDECAR: "/crd/{namespace}/proxyprofiles.flomesh.io",
    SIDECAR_DETAIL: "/_raw/proxyprofiles.flomesh.io",
    SIDECAR_POST: "/apis/flomesh.io/v1alpha1/proxyprofiles",
    PROXYPROFILES: `/proxyprofiles`,
  },
};
