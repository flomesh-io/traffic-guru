import { query, mutation } from "@/services/graphql";

export const DEFAULT_WORKPLACE =
  process.env.VUE_APP_VERSION == "pro"
    ? "system.common.ORGANIZATION_TOTAL,system.common.PROJECT_TOTAL,system.common.Space,system.common.Space,workload.dashboard.DEPLOYMENT,workload.dashboard.STATEFULSET,workload.dashboard.JOB,workload.dashboard.POD"
    : "fsm.dashboard.REGISTRY_TOTAL,fsm.dashboard.NAMESPACE_TOTAL,fsm.dashboard.SERVICE_TOTAL,system.common.Space,workload.dashboard.DEPLOYMENT,workload.dashboard.STATEFULSET,workload.dashboard.JOB,workload.dashboard.POD";

export const DEFAULT_FLB =
  "flb.dashboard.TOTAL,flb.dashboard.ADDRESSPOOL,flb.dashboard.BYTES,flb.dashboard.PROCESS_MEMORY,flb.dashboard.CONNECTIONS,flb.dashboard.INACT_CONNECTIONS,flb.dashboard.FAIL_CONNECTIONS,flb.dashboard.TIME_WAIT,flb.dashboard.FREE_CPU,flb.dashboard.PROCESS_CPU,flb.dashboard.FULL_CONN_OVERFLOW_ERROR,flb.dashboard.HALF_CONN_OVERFLOW_ERROR,flb.dashboard.UNHEALTHY_UPSTREAM,flb.dashboard.RANKING,flb.dashboard.SANKEY";

export const DEFAULT_FSM =
  "fsm.dashboard.REGISTRY_TOTAL,fsm.dashboard.NAMESPACE_TOTAL,fsm.dashboard.SERVICE_TOTAL,system.common.Space,fsm.dashboard.SERVICE_HEALTHCHECK,fsm.dashboard.SERVICE_STATUS,fsm.dashboard.INGRESS_STATUS,fsm.dashboard.MCS_TOPOLOGY";

export const DEFAULT_MESH_DETAIL =
  "fsm.dashboard.NAMESPACE_MESH_TOTAL,fsm.dashboard.SERVICE_MESH_TOTAL,system.common.Space,system.common.Space,system.common.TPS_MESH,system.common.ERROR_RATE_MESH,system.common.LATENCY_MESH,workload.dashboard.POD,fsm.dashboard.TOPOLOGY";

export const DEFAULT_SERVICE_DETAIL =
  "fsm.dashboard.TPS_ERROR,fsm.dashboard.BPS,fsm.dashboard.LATENCY,fsm.dashboard.LOAD_STATUS,fsm.dashboard.TOPOLOGY,fsm.dashboard.QOS";

export const DEFAULT_WORKLOAD =
  "workload.dashboard.CRONJOB,workload.dashboard.DAEMONSET,workload.dashboard.DEPLOYMENT,workload.dashboard.JOB,workload.dashboard.POD,workload.dashboard.REPLICASET,workload.dashboard.REPLICATIONCONTROLLER,workload.dashboard.STATEFULSET";

export const DEFAULT_API =
  "openapi.dashboard.API_TOTAL,openapi.dashboard.APP_TOTAL,system.common.ORGANIZATION_TOTAL,system.common.PROJECT_TOTAL,system.common.LATENCY,system.common.USER_AGENT,system.common.QPS,system.common.ERROR_RATE,openapi.dashboard.API_STATUS,openapi.dashboard.API_METRIC_WEEK,openapi.dashboard.API_METRIC_MONTH,system.common.Space,system.common.RANKING";

export const DEFAULT_PROJECT =
  "openapi.dashboard.API_TOTAL,openapi.dashboard.APP_TOTAL,system.common.Space,system.common.Space,fsm.dashboard.QOS,fsm.dashboard.LATENCY,fsm.dashboard.LOAD_STATUS,fsm.dashboard.TPS_ERROR,fsm.dashboard.BPS,openapi.dashboard.API_STATUS,openapi.dashboard.API_METRIC_WEEK,openapi.dashboard.API_METRIC_MONTH";

export const DEFAULT_API_DETAIL =
  "fsm.dashboard.TPS_ERROR,fsm.dashboard.BPS,fsm.dashboard.LATENCY,fsm.dashboard.LOAD_STATUS,openapi.dashboard.TOPOLOGY,fsm.dashboard.QOS,openapi.dashboard.API_METRIC_WEEK,openapi.dashboard.API_METRIC_MONTH";

export async function getDashboardById(id) {
  return query(`dashboard(id:${id}){data{id,attributes{name,content,apply}}}`);
}

export async function getDashboardByApply(apply) {
  return query(`dashboards(filters:{apply:{eq:"${apply}"}}){data{id,attributes{name,content,apply}}}`);
}

export async function setDashboard(id, data) {
  let _p = {},
    widget = "";
  if (data.subscribes) {
    widget = data.subscribes.join(",");
    _p.content = { widget };
  }
  if (data.name && data.name.length > 0) {
    _p.name = data.name;
  }
  if (data.apply != null) {
    _p.apply = data.apply;
  }
  return mutation(
    `updateDashboard(id:${id}, data: $data){data{id}}`,
    {
			data: _p,
    },
    { data: "DashboardInput!" },
  );
}

export async function addDashboard(data) {
  let _p = {};
  if (data.widget != null) {
    _p.content = { widget: data.widget };
  }
  if (data.name && data.name.length > 0) {
    _p.name = data.name;
  }
  if (data.apply != null) {
    _p.apply = data.apply;
  }
  return mutation(
    `createDashboard(data: $data){data{id}}`,
    {
      data: _p
    },
    { data: "DashboardInput!" },
  );
}

export async function addUserWidget(content) {
  const data = {
    content: content,
    name: content.id,
    shared: 0,
  };
  return mutation(
    `createWidget(data: $data){data{id}}`,
    {
      data
    },
    { data: "WidgetInput!" }
  );
}

export async function editUserWidget(id, content) {
  delete content.uid;
  const p = { content: content, name: content.id };
  return mutation(
    `updateWidget(id:${id}, data: $data){data{id}}`,
    {
			data: p,
    },
    { data: "WidgetInput!" },
  );
}

export async function deleteUserWidget(id) {
  return mutation(`deleteWidget(id:${id}){data{id}}`);
}

export async function getUserWidgets() {
  return query(`widgets{data{id,attributes{name,shared,user_id,content}}}`);
}
export async function getUserWidget(id) {
  return query(`widget(id:${id}){data{id,attributes{name,shared,user_id,content}}}`);
}

export const SAMPLE_WIDGET = {
  id: "TEST-CUSTOM",
  title: "A Sample",
  tag: { name: "Gauge" },
  service: {
    type: "rest",
    path: "hk.flomesh.cn:8090/kube-dashboard/?url=%2Fapi%2Fv1%2Fjob%2Fdefault%3FitemsPerPage%3D0%26page%3D1%26sortBy%3Dd%2CcreationTimestamp",
    method: "GET",
    payload: "{}",
    clickhouseSQL: "",
    prometheusSQL: "",
  },
  col: 6,
  data: `res => {
	let _data = res.data;
	function getPercentage(current,status){
		let per = (status.running+status.succeeded+status.failed);
		return per ==0 ?0 :Math.round(current*100/per);
	}
	return {
		id:'WP-CUSTOM',
		vals:[
			getPercentage(_data.status.running,_data.status),
			getPercentage(_data.status.succeeded,_data.status),
			getPercentage(_data.status.failed,_data.status)
		]
	}
}`,
};

export const CLICKHOUSE_SAMPLE_WIDGET = {
  id: "CLICKHOUSE-TEST-CUSTOM",
  title: "A Clickhouse Datasource Sample",
  tag: { name: "MiniSector" },
  service: {
    type: "clickhouse",
    path: "",
    method: "GET",
    payload: "{}",
    clickhouseSQL:
      "select count() as count,res.status from log where res.status>'0' group by res.status order by res.status",
    prometheusSQL: "",
  },
  col: 6,
  data: `res => {
	let dv = [];
	res.map((item) => {
			dv.push({type:item[1],value:item[0],name:item[1]});
	});
	return {
		colors:['#8bd4a1','#fac858','#fb9690'],
		dv:dv
	}
}`,
};

export const PROMETHEUS_SAMPLE_WIDGET = {
  id: "PROMETHEUS-TEST-CUSTOM",
  title: "A Prometheus Datasource Sample",
  tag: { name: "MiniArea" },
  service: {
    type: "prometheus",
    path: "",
    method: "GET",
    payload: "{}",
    clickhouseSQL: "",
    prometheusSQL: "sum(pipy_chunk_size)",
  },
  col: 6,
  data: `res => {
	let dv = [];
	if(res.data?.result){
		res.data.result.forEach((result,i) => {
			result.values.forEach((value,j) => {
				if(value[1]){
					dv.push({
						type:'item'+i,
						value:(value[1]*1).toFixed(2),
						date:new Date(value[0]*1000).toISOString().split('.')[0].replace('T',' ')
					})
				}
			})
		})
	}
	return {
		id: 'Test-Prometheus-MiniArea',
		colors: ['#8bd4a1', '#fb9690'],
		height: 240,
		padding: [0, 0, 0, 0],
		axis: false,
		unit: 'unitge',
		showy: false,
		dv
	}
}`,
};

export default {
  getDashboardById,
  getDashboardByApply,
  setDashboard,
  addDashboard,
  addUserWidget,
  editUserWidget,
  deleteUserWidget,
  getUserWidgets,
  SAMPLE_WIDGET,
  DEFAULT_WORKPLACE,
  DEFAULT_FLB,
  DEFAULT_FSM,
  DEFAULT_WORKLOAD,
  DEFAULT_API,
  DEFAULT_API_DETAIL,
  DEFAULT_SERVICE_DETAIL,
  DEFAULT_PROJECT,
};
