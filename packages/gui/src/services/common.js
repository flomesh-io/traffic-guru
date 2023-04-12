import api from "@/services/api";
import { request, merge, METHOD } from "@/utils/request";
import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export function getCount(type, kind) {
  return async function (parmas) {
    let filters = ``;
    if (type == "mesh") {
      if (kind == "namespaces") {
        filters = ` bindMesh: {id:{eq:${parmas.mesh}}}, registry: {id:{eq:${parmas.registry}}} `;
      } else if (kind == "services") {
        if (parmas.namespaces) {
					filters = `namespace: { in: [`;
          parmas.namespaces.forEach((namespace) => {
						filters += `"${namespace.name}"`;
          });
					filters += `]}`;
        }
      }
    }
    return query(
      `${kind}(filters: {${filters}}, pagination:{start: 0, limit: 9999}){meta{pagination{total}}}`,
    );
  };
}

export async function getK8sFacilities() {
  return query(`fleets(filters:{ type: {eq:"kubernetes"} }){data{id,attributes{name,type}}}`);
}

export async function getRegistries(type) {
  return type?query(`registries(filters:{ type: {eq:"${type}"} }){data{id,attributes{name,type}}}`):query(`registries{data{id,attributes{name,type}}}`);
}

export async function getSchemas() {
  return merge([getK8sFacilities(), getRegistries()]);
}

export async function watchHealthcheck(type, id) {
  let filters = { ...DefaultChartDate, type };
  if (id) {
    filters.id = id;
  }
  return query(`getHealthcheckDashboardPageInfo(filters: $filters){
		healthchecks_timer,healthchecks{health,unhealthy}
  }`,{filters});
}

export async function getK8sNamespaces(id) {
  return query(
    `namespaces( pagination:{limit: 9999, start: 0}, filters: $filters ){data{id,attributes{name,registry{data{id,attributes{name}}}}}}`,
    {
      filters: { registry: {id: {eq: id}} },
    },{
			filters: "NamespaceFiltersInput",
		}
  );
}

export async function getOrgTotal() {
  return query(`organizations( pagination:{start: 0, limit: 1} ){
		data{id},
		meta{pagination{total}}
	}`);
}

export async function getProjectTotal() {
  return query(`projects( pagination:{start: 0, limit: 1} ){
		data{id},
		meta{pagination{total}}
	}`);
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
