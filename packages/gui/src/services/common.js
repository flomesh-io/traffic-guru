import api from "@/services/api";
import { request, merge, METHOD } from "@/utils/request";
import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export function getCount(type, kind) {
  return async function (parmas) {
    let where = {};
    if (type == "mesh") {
      if (kind == "namespaces") {
        where = { bindMesh: parmas.mesh, registry: parmas.registry };
      }
      if (kind == "services") {
        where = {};
        let namespacesName = [];
        if (parmas.namespaces) {
          parmas.namespaces.forEach((namespace) => {
            namespacesName.push(namespace.name);
          });
          where.namespace_in = namespacesName;
        }
      }
    }
    return query(
      `${kind}Connection(where: $where, start: 0, limit: -1){aggregate{totalCount}}`,
      {
        where,
      },
    );
  };
}

export async function getK8sFacilities() {
  return query(`fleets(where:{ type: "kubernetes" }){id,name,type}`);
}

export async function getRegistries() {
  return query(`registries{id,name,type}`);
}

export async function getSchemas() {
  return merge([getK8sFacilities(), getRegistries()]);
}

export async function watchHealthcheck(type, id) {
  let where = { ...DefaultChartDate, type };
  if (id) {
    where.id = id;
  }
  return query(`getHealthcheckDashboardPageInfo(where: $where){
		healthchecks_timer,healthchecks{health,unhealthy}
  }`,{where});
}

export async function getK8sNamespaces(id) {
  return query(
    `namespaces( limit: -1, start: 0, where: $where ){id,name,registry{id,name}}`,
    {
      where: { registry: id },
    },
  );
}

export async function getOrgTotal() {
  return query(`organizationsConnection( start: 0, limit: 1 ){
		values{id},aggregate{totalCount}
	}`);
}

export async function getProjectTotal() {
  return query(`projectsConnection( start: 0, limit: 1 ){
		values{id},aggregate{totalCount}
	}`);
}

export async function getLatency() {
  let end = new Date().getTime() / 1000;
  let start = new Date().setHours(new Date().getHours() - 1) / 1000;
  let timeFilter = `&start=${start}&end=${end}`;
  let SQL50 = `histogram_quantile(0.5, sum by(le) (rate(http_request_latency_bucket[1m])))&step=15${timeFilter}`;
  let SQL90 = `histogram_quantile(0.9, sum by(le) (rate(http_request_latency_bucket[1m])))&step=15${timeFilter}`;
  let SQL99 = `histogram_quantile(0.99, sum by(le) (rate(http_request_latency_bucket[1m])))&step=15${timeFilter}`;
  return merge([
    request(api.PROMETHEUS.QUERY_RANGE(SQL50), METHOD.GET),
    request(api.PROMETHEUS.QUERY_RANGE(SQL90), METHOD.GET),
    request(api.PROMETHEUS.QUERY_RANGE(SQL99), METHOD.GET),
  ]);
}

export async function getQPS() {
  let end = new Date().getTime() / 1000;
  let start = new Date().setHours(new Date().getHours() - 1) / 1000;
  let timeFilter = `&start=${start}&end=${end}`;
  let SQL = `sum(rate(http_requests_count{path!=""} [1m])) by (path)&step=15${timeFilter}`;
  return request(api.PROMETHEUS.QUERY_RANGE(SQL), METHOD.GET);
}

export async function getErrorrate() {
  let end = new Date().getTime() / 1000;
  let start = new Date().setHours(new Date().getHours() - 1) / 1000;
  let timeFilter = `&start=${start}&end=${end}`;
  let SQL = `100*sum(rate(http_requests_count{path!=""}[1m])) by (status) / on() group_left() sum(rate(http_requests_count{path!=""}[1m]))&step=15${timeFilter}`;
  return request(api.PROMETHEUS.QUERY_RANGE(SQL), METHOD.GET);
}

export async function getTopUA() {
  let timeFilter = "1=1";
  let SQL = `
	SELECT
	    userAgent,
	    count() as count
	FROM log
	WHERE ${timeFilter} 
	GROUP BY userAgent 
	ORDER BY count DESC 
	LIMIT 10 
	`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}
export async function getTopN() {
  let timeFilter = "1=1";
  let SQL1 = `
SELECT
    req.path,
    count() as count 
FROM log
WHERE ${timeFilter} 
GROUP BY req.path 
ORDER BY count DESC 
LIMIT 10 
`;
  let SQL2 = `
SELECT
    userAgent,
    count() as count
FROM log
WHERE ${timeFilter} 
GROUP BY userAgent 
ORDER BY count DESC 
LIMIT 10 
`;
  let SQL3 = `
SELECT
    remoteAddr,
    count() AS count 
FROM log 
WHERE ${timeFilter} 
GROUP BY remoteAddr 
ORDER BY count DESC 
LIMIT 10
`;
  let SQL4 = `
SELECT
    remoteAddr,
    req.path,
    resTime - reqTime AS latency
FROM log 
WHERE ${timeFilter} 
ORDER BY latency DESC 
LIMIT 10
`;
  return merge([
    request(api.CLICKHOUSE.QUERY(SQL1), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL2), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL3), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL4), METHOD.GET),
  ]);
}

export default {
  getLatency,
  getQPS,
  getErrorrate,
  getTopN,
  getTopUA,
  getSchemas,
  getRegistries,
  getOrgTotal,
  getCount,
  getProjectTotal,
  getK8sFacilities,
  getK8sNamespaces,
  watchHealthcheck,
};
