import { request, METHOD } from "@/utils/request";
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
  getTimelinePQL,
  mapData,
};
