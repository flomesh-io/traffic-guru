import { query } from "@/services/graphql";

export const columns = [
  "serviceName",
  "podName",
  "reqPath",
  "reqMethod",
  "reqProtocol",
  "resTime",
  "reqTime",
  "resStatus",
  "resSize",
  "remoteAddr",
  "remotePort",
  "localAddr",
  "localPort",
  "createdAt",
  "reqHeaders",
  "message",
];
export const filterColumns = [
  "serviceName",
  "podName",
  "reqPath",
  "reqMethod",
  "reqProtocol",
  "resTime",
  "reqTime",
  "resStatus",
  "resSize",
  "remoteAddr",
  "remotePort",
  "localAddr",
  "localPort",
  "reqHeaders",
  "message",
];

export function getSelectKeys() {
  return columns.join(",");
}

export function getServiceName(name, namespace, domain) {
  return domain ? `${name}.${namespace}.svc.${domain}` : (namespace? `${name}.${namespace}` : name);
}

export function getTime(date){
	if(typeof(date) == "object"){
		if(date.$d){
			return date.$d.getTime();
		} else {
			return date.getTime();
		}
	} else if (typeof(date) == "string"){
		return new Date(date).getTime()
	} else {
		return date;
	}
}
export function getDate(date){
	if(typeof(date) == "object"){
		if(date.$d){
			return date.$d;
		} else {
			return date;
		}
	} else {
		return new Date(date);
	}
}
function getTraceFilter(filter) {
	let _filter = {};
	if (filter.filter) {
		_filter.keyWord = filter.filter;
	}
	if(filter.date){
		_filter.reqTimeFrom = getDate(filter.date);
	}
	if(filter.endDate){
		_filter.reqTimeTo = getDate(filter.endDate);
	}
	if(filter.pageSize){
		_filter.pageSize = filter.pageSize;
	}
	if(filter.pageNo){
		_filter.pageNo = filter.pageNo;
	}
  return _filter;
}
function getLogFilter(filter) {
	let _filter = {};
	if(filter.sortBy){
		_filter.orderByField = filter.sortBy;
	}
	if(filter.arrow){
		_filter.orderByType = filter.arrow;
	}
	if(filter.date){
		_filter.reqTimeFrom = getDate(filter.date);
	}
	if(filter.endDate){
		_filter.reqTimeTo = getDate(filter.endDate);
	}
	if(filter.pageSize){
		_filter.pageSize = filter.pageSize;
	}
	if(filter.pageNo){
		_filter.pageNo = filter.pageNo;
	}
	
	switch (filter.type) {
		case "4lb":
			_filter.a4lbid = filter.uid * 1;
			break;
		case "7lb":
			_filter.a7lbid = filter.uid * 1;
			break;
		case "api":
			_filter.aid = filter.uid * 1;
			break;
		case "mesh":
			_filter.meshName = filter.params.name;
			break;
		case "service":
			_filter.serviceName = getServiceName(
				null,
				filter.params.name,
				filter.params.namespace,
				filter.params.domain,
			);
			break;
		case "app":
			_filter.appid = filter.uid * 1;
			break;
		default:
			break;
	}
	
	if (filter.pipy) {
		_filter.igid = filter.pipy.id * 1;
	}
	if (filter.key) {
		_filter.queryWords = filter.key;
	}
	if (filter.filter) {
		_filter.customQuery = filter.filter;
	}
  return _filter;
}
/*
	[payload]
	pageNo,
	pageSize,
	filter,
	sortBy,
	arrow,
	date,
	endDate,
	type,
	uid,
	key,
	pipy,
	params
*/
export async function getLogList(payload) {
  const keys = getSelectKeys();
	const filters = getLogFilter(payload);
  return query(`logList(filters: $filters){
			data{${keys}},total
		}`,
		{filters},
		{filters:"LogFilters"}
	);
}

export async function getTPS(payload) {
	const filters = getLogFilter(payload);
  return query(`tpsChart(filters: $filters){
			data{count,minute}
		}`,
		{filters},
		{filters:"LogFilters"}
	);
}

export async function getLatency(payload) {
	const filters = getLogFilter(payload);
  return query(`latencyChart(filters: $filters){
			data{latency,count}
		}`,
		{filters},
		{filters:"LogFilters"}
	);
}

export async function getLoadStatus(payload) {
	const filters = getLogFilter(payload);
  return query(`statusChart(filters: $filters){
			data{status,count}
		}`,
		{filters},
		{filters:"LogFilters"}
	);
}

export async function getTraceList(payload) {
	const filters = getTraceFilter(payload);
  return query(`traceList(filters: $filters){
			data{
				traceId,
				spanCount,
				duration,
				minReqTime,
				maxResTime,
				serviceName,
				podName
			},
			total
		}`,
		{filters},
		{filters:"TraceFilters"}
	);
}

export async function getTraceDetail(id) {
  return query(`traceDetail(traceId: "${id}"){
			data{
				traceSpan,
				traceParent,
				duration,
				reqTime,
				resTime,
				serviceName,
				podName,
				message
			}
		}`
	);
}

export async function getTopoData(payload) {
	const filters = getTraceFilter(payload);
  return query(`traceList(filters: $filters){
			services{
				id,
				name,
				pods,
				namespace,
				registry{id,name},
			},
			links{
				error,
				weight,
				source,
				target
			}
		}`,
		{filters},
		{filters:"TraceDAGFilters"}
	);
	//traceDAG
}

export function setTopoData() {
  return (res) => {
    let categories = [];
    let categoryMap = {};
    let nodes = [];
    let links = [];
    let nodePos = {};
    let state = -1;
    //service
    let serviceNodes = res.data.services;
    let index = 0;
    serviceNodes.forEach((node) => {
      let _map = {
        value: node.id,
        index: index,
        unset: true,
      };
      let category = {
        name: node.name,
        id: node.id,
      };
      if (node.id != "") {
        index++;
        categories.push(category);
        categoryMap[node.id] = _map;
      }
			
			let service = {
        name: node.name,
        id: node.id,
			  value: 10,
			  symbol: serviceIcon,
			  symbolSize: 30,
			  category: categoryMap[node.id].index,
			  isSvc: true,
			};
			nodes.push(service);
    });

    //path
    let pathNodes = res.data.links;
    pathNodes.forEach((node) => {
      if (node.source) {
        let source = node.source;
        let target = node.target;
        let link = {
          source,
          target,
          value: node.weight,
          label: {
            show: true,
            position: "middle",
            backgroundColor: "#cccccc",
            padding: 2,
            borderRadius: 3,
            fontSize: 10,
            color: "#000000",
            formatter: "{@value}",
          },
        };
        links.push(link);
      }
    });
    state = nodes.length;
    return { categories, categoryMap, nodes, links, nodePos, state };
  };
}

export function coverMessage(res) {
  if (typeof res.data == "object") {
    return JSON.stringify(res.data);
  } else {
    let _nodes = [];
    let nodes = res.data.trim().split("\n");
    if (nodes.length > 1) {
      nodes.map((nodeStr) => {
        if (nodeStr && nodeStr != "") {
          _nodes.push(JSON.parse(nodeStr));
        }
        return nodeStr;
      });
      return JSON.stringify(_nodes);
    } else {
      return res.data.replace(/\\\\\\\\"/g, '\\"').replace(/\\\\"/g, '\\"');
    }
  }
}
export default {
  columns,
	filterColumns,
  getSelectKeys,
	getLogList,
	getTPS,
	getDate,
	getTime,
  getLatency,
  getLoadStatus,
	coverMessage
};
