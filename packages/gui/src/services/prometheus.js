import { request, merge, METHOD } from "@/utils/request";
import api from "@/services/api";
import _ from "lodash";

export function customQuery(query, isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getLbCpu(isInit) {
	return async function (params) {
		return merge([getFreeCpu(isInit)(params), getProcessCpu(isInit)(params)]);
	}
}

//FREE_CPU
export function getFreeCpu(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum by(instance) (irate(node_cpu_seconds_total{repo=~"/flomesh/pipy4lb/.*", mode="idle"}[1m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{repo=~"/flomesh/pipy4lb/.*"}[1m])))`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}
//PROCESS_CPU
export function getProcessCpu(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum (rate(namedprocess_namegroup_cpu_seconds_total{groupname=~"pipy-[0-9]*:/flomesh/pipy4lb/.*",repo=~"/flomesh/pipy4lb/.*"}[1m]) ) by (instance)`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}
//PROCESS_MEMORY
export function getProcessMemory(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(namedprocess_namegroup_memory_bytes{groupname=~"pipy-[0-9]*:/flomesh/pipy4lb/.*",repo=~"/flomesh/pipy4lb/.*", memtype="resident"}) by (instance)`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

//TIME_WAIT
export function getTimeWait(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(node_sockstat_TCP_tw{repo=~"/flomesh/pipy4lb/.*"}) by (instance)`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getConnOverflowError(isInit) {
	return async function (params) {
		return merge([getFullConnOverflowError(isInit)(params), getHalfConnOverflowError(isInit)(params)]);
	}
}

//FULL_CONN_OVERFLOW_ERROR
export function getFullConnOverflowError(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(node_netstat_TcpExt_ListenOverflows{repo=~"/flomesh/pipy4lb/.*"}[1m])) by (instance)`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

//HALF_CONN_OVERFLOW_ERROR
export function getHalfConnOverflowError(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(node_netstat_TcpExt_ListenDrops{repo=~"/flomesh/pipy4lb/.*"}[1m])) by (instance)`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getLBConns(isInit) {
	return async function (params) {
		return merge([getLBCurConns(isInit)(params), getLBNewConns(isInit)(params)]);
	}
}

export function getLBCurConns(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(l4lb_concurrent_connections{target!=''})`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getLBNewConns(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(l4lb_connections_total{target!=''}[1m]))`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}
export function getLBInActConns(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(node_tcp_connection_states{repo=~"/flomesh/pipy4lb/.*",state!~"established|rx_queued_bytes|tx_queued_bytes"}) by (instance)`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getLBFailConns(isInit) {
	return async function (params) {
		return merge([getLBInFailConns(isInit)(params), getLBOutFailConns(isInit)(params)]);
	}
}
export function getLBInFailConns(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(l4lb_fail_inbound_connections_total{target!=''}[1m]))`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getLBOutFailConns(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(l4lb_fail_outbound_connections_total{target!=''}[1m]))`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}


export function getLBBits(isInit) {
	return async function (params) {
		return merge([getLBInBits(isInit)(params), getLBOutBits(isInit)(params)]);
	}
}

export function getLBInBits(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(l4lb_downstream_send_bytes_total{target!=''}[1m]))`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getLBOutBits(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(increase(l4lb_upstream_send_bytes_total{target!=''}[1m]))`;
    const url = getUrl(
      "lb",
      null,
      null,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}


export function getTPS(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    let namespaceQL = params.filters?.namespaceQL;
    const cond =
      params.kind == "service"
        ? `source_name="${params.name}",source_namespace="${params.name}"`
        : namespaceQL
        ? `source_namespace="${namespaceQL}"`
        : "";
    const query = `topk(2, sum(irate(sidecar_cluster_upstream_rq_xx{${cond}}[1m])) by (source_namespace, source_service, sidecar_cluster_name))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}
export function getL7QPS(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `sum(rate(l7lb_request_count{route!=""} [1m])) by (route)`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getER(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    let namespaceQL = params.filters?.namespaceQL;
    const cond =
      params.kind == "service"
        ? `source_name="${name}",source_namespace="${params.name},sidecar_response_code_class!="2""`
        : namespaceQL
        ? `source_namespace="${namespaceQL}",sidecar_response_code_class!="2"`
        : 'sidecar_response_code_class!="2"';
    const query = `topk(2, sum(irate(sidecar_cluster_upstream_rq_xx{${cond}}[1m])) by (source_namespace, source_service, sidecar_cluster_name))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getL7ER(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `100*sum(rate(l7lb_response_status{status!=""}[1m])) by (status) / on() group_left() sum(rate(l7lb_response_status{status!=""}[1m]))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}


export function getLatency(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    let namespaceQL = params.filters?.namespaceQL;
    const cond =
      params.kind == "service"
        ? `destination_name="${params.name}"`
        : namespaceQL
        ? `source_namespace="${namespaceQL}"`
        : "";
    const query = `topk(2, histogram_quantile(0.99,sum(irate(osm_request_duration_ms_bucket{${cond}}[1m])) by (le, source_namespace, source_name, destination_namespace, destination_name)))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getL7Latency(isInit) {
	return async function (params) {
		return merge([getL7Latency50(isInit)(params), getL7Latency90(isInit)(params), getL7Latency99(isInit)(params)]);
	}
}

export function getL7Latency50(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `histogram_quantile(0.5, sum by(le) (rate(l7lb_request_latency_bucket{route!=""}[1m])))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getL7Latency90(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `histogram_quantile(0.9, sum by(le) (rate(l7lb_request_latency_bucket{route!=""}[1m])))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function getL7Latency99(isInit) {
  return async function (params) {
    let timelineQL = params.filters?.timelineQL;
    const query = `histogram_quantile(0.99, sum by(le) (rate(l7lb_request_latency_bucket{route!=""}[1m])))`;
    const url = getUrl(
      params.kind,
      params.mesh,
      params.namespaceId,
      timelineQL,
      query,
      isInit,
    );
    return request(url, METHOD.GET);
  };
}

export function mapData(lastData, resStr, make) {
  let map = _.cloneDeep(lastData);
  if (!map) {
    map = [];
  }
  let resp = resStr.data;
  resp.data.result.forEach((item) => {
    let _key = ``;
    if (item.metric.sidecar_cluster_name) {
      _key = `${item.metric.sidecar_cluster_name} - ${item.metric.source_service}`;
    } else if (item.metric.destination_name) {
      _key = `${item.metric.source_name} -> ${item.metric.destination_name}`;
    } else if (item.metric.instance) {
      _key = `${item.metric.instance}`;
    } else if (item.metric.route) {
      _key = `${item.metric.route}`;
    } else if (item.metric.path) {
      _key = `${item.metric.path}`;
    } else if (item.metric.status) {
      _key = `status:${item.metric.status}`;
    }
		
    if (!!item.values) {
      item.values.forEach((_v) => {
        map.push({
          type: _key,
          date: new Date(_v[0] * 1000),
          value: make ? make(_v[1]) : _v[1],
        });
      });
    } else if (!!item.value) {
      map.push({
        type: _key,
        date: new Date(item.value[0] * 1000),
        value: make ? make(item.value[1]) : item.value[1],
      });
    }
  });
  return map;
}

export function getUrl(kind, id, namespace, timelineQL, query, isInit) {
  if (isInit) {
		let timeFilter = timelineQL ? timelineQL : getTimelinePQL(20,100);
		let append = `${query}${timeFilter}`;
    return api.PROMETHEUS.QUERY_RANGE(
      append,
      namespace,
      kind == "mesh" ? id : null,
    );
  } else {
    return api.PROMETHEUS.QUERY(
      query,
      namespace,
      kind == "mesh" ? id : null,
    );
  }
}

export function getTs(idx) {
  let _d = new Date();
  switch (idx) {
    case 0:
      _d.setMonth(_d.getMonth() - 1);
      break;
    case 10:
      _d.setDate(_d.getDate() - 15);
      break;
    case 20:
      _d.setDate(_d.getDate() - 7);
      break;
    case 30:
      _d.setDate(_d.getDate() - 3);
      break;
    case 40:
      _d.setDate(_d.getDate() - 1);
      break;
    case 50:
      _d.setHours(_d.getHours() - 12);
      break;
    case 60:
      _d.setHours(_d.getHours() - 6);
      break;
    case 70:
      _d.setHours(_d.getHours() - 1);
      break;
    case 80:
      _d.setMinutes(_d.getMinutes() - 30);
      break;
    case 90:
      _d.setMinutes(_d.getMinutes() - 5);
      break;
    default:
      break;
  }
  return "" + _d.getTime() / 1000;
}

export function getStep(idx) {
  let step = "15";
  switch (idx) {
    case 0:
      step = "10000";
      break;
    case 10:
      step = "5000";
      break;
    case 20:
      step = "2100";
      break;
    case 30:
      step = "1000";
      break;
    case 40:
      step = "340";
      break;
    case 50:
      step = "170";
      break;
    case 60:
      step = "85";
      break;
    case 70:
      step = "5";
      break;
    case 80:
      step = "3";
      break;
    case 90:
      step = "1";
      break;
    default:
      break;
  }
  return step;
}

export function getTimelinePQL(dateIndex, endDateIndex) {
  let ql = "";
  if (dateIndex >= 0) {
    ql += "&start=" + getTs(dateIndex);
  }
  if (endDateIndex >= 0) {
    ql += "&end=" + getTs(endDateIndex);
  }
  ql += "&step=" + getStep(dateIndex);
  return ql;
}

export default {
  getTPS,
  getER,
  getLatency,
	getLBInActConns,
	getLBConns,
  getTimelinePQL,
	getLBCurConns,
	getLBFailConns,
	getLBInFailConns,
	getLBOutFailConns,
	getLBNewConns,
	getLBBits,
	getLBInBits,
	getLBOutBits,
	getL7Latency,
	getL7QPS,
	getL7ER,
	getLbCpu,
	getFreeCpu,
	getProcessCpu,
	getProcessMemory,
	getTimeWait,
	getConnOverflowError,
	getFullConnOverflowError,
	getHalfConnOverflowError,
  mapData,
};
