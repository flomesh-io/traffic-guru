const API_PROXY_PREFIX = "/api";
const DEFAULT_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_API_BASE_URL
      ? process.env.VUE_APP_API_BASE_URL
      : window.location.origin
    : API_PROXY_PREFIX;
const BASE_URL = DEFAULT_BASE_URL;
const FLB_BASE = `${BASE_URL}/flb`;
const KUBE_BASE = `${BASE_URL}/kube-dashboard/?url=`;
const K8S_BASE = `${BASE_URL}/kube-proxy/?url=`;
const CLICKHOUSE_BASE = `${BASE_URL}/clickhouse`;
const PROMETHEUS_BASE = `${BASE_URL}/prometheus`;

module.exports = {
  BASE_URL,
  GQL: `${BASE_URL}/graphql`,
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
      console.log(sql);
      return path + encodeURI(sql);
    },
  },
  K8S: {
    append: (size, page, sort) => {
      return (
        "?itemsPerPage=" +
        size +
        "&page=" +
        page +
        (sort ? "&sortBy=" + sort : "")
      );
    },
    encode: (url, append, ns) => {
      let namespace = ns || localStorage.getItem("NAMESPACE");
      return (
        `${K8S_BASE}` +
        encodeURIComponent(
          url.replace(
            "{namespace}",
            namespace == "_all" ? "" : namespace || "default",
          ) +
            "" +
            (append ? append : ""),
        )
      );
    },
    PROXYPROFILES: `/proxyprofiles`,
  },
  KUBE: {
    iconStatus: {
      Normal: "#icon-success",
      Success: "#icon-success",
      Completed: "#icon-success",
      Complete: "#icon-success",
      Running: "#icon-success",
      Warning: "#icon-warning",
      ImagePullBackOff: "#icon-error",
      ErrImagePull: "#icon-error",
      "Init: CrashLoopBackOff": "#icon-error",
      "Init:Error": "#icon-error",
      "Error: ErrImagePull": "#icon-error",
      "Back-off restarting failed container": "#icon-error",
    },
    append: (size, page, sort, filter) => {
      return (
        "?itemsPerPage=" +
        size +
        "&page=" +
        page +
        (sort ? "&sortBy=" + sort : "") +
        (filter && filter.trim() != "" ? "&filterBy=name," + filter : "")
      );
    },
    encode: (url, append, ns) => {
      let namespace = ns || localStorage.getItem("NAMESPACE") || "default";
      return (
        `${KUBE_BASE}` +
        encodeURIComponent(
          url.replace("{namespace}", namespace == "_all" ? "" : namespace) +
            "" +
            (append ? append : ""),
        )
      );
    },
    NAMESPACE: () => {
      return `${KUBE_BASE}` + encodeURIComponent("/api/v1/namespace");
    },
    DAEMONSET: "/api/v1/daemonset/{namespace}",
    CRONJOB: "/api/v1/cronjob/{namespace}",
    JOB: "/api/v1/job/{namespace}",
    DEPLOYMENT: "/api/v1/deployment/{namespace}",
    POD: "/api/v1/pod/{namespace}",
    SERVICE: "/api/v1/service/{namespace}",
    REPLICASET: "/api/v1/replicaset/{namespace}",
    STATEFULSET: "/api/v1/statefulset/{namespace}",
    REPLICATIONCONTROLLER: "/api/v1/replicationcontroller/{namespace}",
    SECRET: "/api/v1/secret/{namespace}",
    INGRESS: "/api/v1/ingress/{namespace}",
    SIDECAR: "/api/v1/crd/{namespace}/proxyprofiles.flomesh.io",
    SIDECAR_DETAIL: "/api/v1/_raw/proxyprofiles.flomesh.io",
    SIDECAR_POST: "/apis/flomesh.io/v1alpha1/proxyprofiles",
    MESH_CONFIG: "/api/v1/meshconfig/{namespace}",
    OSM_INSTALL: "/api/v1/osm/cmd/cli/install",
    OSM_UNINSTALL: "/api/v1/osm/cmd/cli/uninstall",
  },
};
