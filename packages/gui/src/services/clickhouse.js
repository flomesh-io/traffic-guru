import api from "@/services/api";
import { request, merge, spread, METHOD, mock } from "@/utils/request";
import { timelineMap } from "@/utils/timeline";

export const select_keys = [
  "service.name",
  "pod.name",
  "req.path",
  "req.method",
  "req.protocol",
  "resTime",
  "reqTime",
  "res.status",
  "resSize",
  "remoteAddr",
  "remotePort",
  "localAddr",
  "localPort",
  "timestamp",
  "req.headers",
  "message",
];

export function getFilter(params) {
  let pidFilter = ` AND bondType != 'outbound' AND x_parameters.aid = 0 AND x_parameters.a4lbid = 0 AND x_parameters.sid = 0 AND service.name is not null AND res.status < 400`;
  if (params.pid) {
    if (params.apply == "project") {
      pidFilter += ` AND x_parameters.pid = '${params.pid}'`;
    } else if (params.apply == "service") {
      pidFilter += getServiceWhere(
        "both",
        params.name,
        params.namespace,
        params.domain,
      );
    } else if (params.apply == "mesh") {
      pidFilter += ` AND meshName = '${params.name}'`;
    }
  }
  return ` ${params.where} ${pidFilter} `;
}

export function getServices(params) {
  let filter = getFilter(params);
  let SQL = `select count() as count,service.name,max(service.name) from log where 1=1 ${filter} group by service.name order by service.name;`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}

export function getPods(params) {
  let filter = getFilter(params);
  let SQL = `select pod.ip,pod.name,max(service.name),count() as count,service.name from log where 1=1 ${filter} group by pod.ip,pod.name,service.name order by service.name,pod.ip;`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}

export function getPaths(params) {
  let filter = getFilter(params);
  let SQL = `select remoteAddr,localAddr, count() as count from log where 1=1 ${filter} group by remoteAddr,localAddr,service.name order by service.name,remoteAddr;`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}

export async function getTopoData(params) {
  return merge([getServices(params), getPods(params), getPaths(params)]);
}

export async function getAPITopoData(params,nocurrent) {
	console.log(params)
  return mock({
		services:[
			{
				id: 'svc001',
				type:'service',
				name:'svc1',
			},
			{
				id: 'svc002',
				type:'service',
				name:'svc2',
			},
		],
		apis:[
			{
				id: 'api001',
				service:'svc001',
				type:'api',
				name:'/api1',
				error:false,
				weight:3,
				current:!nocurrent
			},
			{
				id: 'api002',
				service:'svc001',
				type:'api',
				name:'/api2',
				error:true,
				weight:3,
			},
			{
				id: 'api003',
				service:'svc001',
				type:'api',
				name:'/api3',
				error:false,
				weight:3,
			},
			{
				id: 'api004',
				service:'svc001',
				type:'api',
				name:'/api4',
				error:false,
				weight:3,
			},
			{
				id: 'api005',
				service:'svc001',
				type:'api',
				name:'/api5',
				error:false,
				weight:3,
			},
			{
				id: 'api006',
				service:'svc001',
				type:'api',
				name:'/api6',
				error:false,
				weight:3,
			},
			{
				id: 'api007',
				service:'svc002',
				type:'api',
				name:'/api7',
				error:false,
				weight:3,
			},
			{
				id: 'api008',
				service:'svc002',
				type:'api',
				name:'/api8',
				error:false,
				weight:10,
			},
			{
				id: 'api009',
				service:'svc002',
				type:'api',
				name:'/api9',
				error:false,
				weight:10,
			},
		],
		links:[
			{
				source:"api001",
				target:"api002",
				weight:30,
				error:true,
			},
			{
				source:"api003",
				target:"api004",
				weight:3,
				error:false,
			},
			{
				source:"api001",
				target:"api003",
				weight:20,
				error:false,
			},
			{
				source:"api005",
				target:"api006",
				weight:20,
				error:false,
			},
			{
				source:"api007",
				target:"api008",
				weight:20,
				error:false,
			},
			{
				source:"api008",
				target:"api009",
				weight:20,
				error:false,
			},
			{
				source:"api001",
				target:"api008",
				weight:20,
				error:false,
			},
		]
	});
}
export function checkPodRepeat(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id == id) {
      return true;
    }
  }
  return false;
}

export function calcSymbolSize(val) {
  let rtn = val / 10 + 10;
  if (rtn > 50) {
    return 50;
  } else if (rtn < 30) {
    return 30;
  } else {
    return rtn;
  }
}

export function calcPodSymbolSize(val) {
  let rtn = val / 10 + 10;
  if (rtn > 30) {
    return 30;
  } else if (rtn < 15) {
    return 15;
  } else {
    return rtn;
  }
}

const serviceIcon =
  "image://data:image/png;base64,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";

const podIcon =
  "image://data:image/png;base64,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";

const apiIcon =
  "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc4NzY0Mjk3MDIwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzMzMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMi44NCA2My41NkwxMjUuMzIgMjg3LjN2NDQ3LjQ3bDM4Ny41MiAyMjMuNzQgMzg3LjUzLTIyMy43NFYyODcuM3oiIGZpbGw9IiNkZWYyZmQiIHAtaWQ9IjIzMzQiPjwvcGF0aD48cGF0aCBkPSJNMzYzLjg2IDcwOC45NmMwIDY2LjQxIDE0LjMzIDEyOS4zNyAzOS42MiAxODYuNDFsMTA5LjM3IDYzLjE0IDM4Ny41Mi0yMjMuNzRWMjg3LjNsLTY2Ljc3LTM4LjU1Yy0zLjA1LTAuMDYtNi0wLjQ2LTkuMDctMC40Ni0yNTQuNDIgMC00NjAuNjcgMjA2LjI1LTQ2MC42NyA0NjAuNjd6IiBmaWxsPSIjYWFkY2Y3IiBwLWlkPSIyMzM1Ij48L3BhdGg+PHBhdGggZD0iTTg3NS4zNSAyNzIuODZjMS4yIDEzLjUyIDIuMDcgMjcuMTMgMi4wNyA0MC45NiAwIDI1My4zMi0yMDUuMzYgNDU4LjY4LTQ1OC42OCA0NTguNjgtMTExLjYzIDAtMjEzLjg4LTM5Ljk1LTI5My40MS0xMDYuMjR2NjguNTFsMzg3LjUyIDIyMy43NCAzODcuNTItMjIzLjc0VjI4Ny4zbC0yNS4wMi0xNC40NHoiIGZpbGw9IiNhYWRjZjciIHAtaWQ9IjIzMzYiPjwvcGF0aD48cGF0aCBkPSJNNTEyLjYyIDk1OC41MUwxMjQuODcgNzM0LjY2VjI4Ni45Mkw1MTIuNjIgNjMuMDNsMzg3Ljc1IDIyMy44OXY0NDcuNzRMNTEyLjYyIDk1OC41MXpNMTYwLjY5IDcxMy45OGwzNTEuOTMgMjAzLjE3IDM1MS45My0yMDMuMTdWMzA3LjZMNTEyLjYyIDEwNC4zOSAxNjAuNjkgMzA3LjZ2NDA2LjM4eiIgZmlsbD0iIzhhOGE4YSIgcC1pZD0iMjMzNyI+PC9wYXRoPjxwYXRoIGQ9Ik03NDcuODUgMzA2Ljg5bC00NC4zIDQzLjkzYzMwLjc5IDQ1LjQzIDI1LjkxIDEwNy4wMS0xMy44OSAxNDcuMThsLTU4Ljk1IDU4Ljk1Yy0xLjEzIDAuNzUtMi4yNSAxLjUtMy4zOCAxLjVzLTIuNjMtMC4zOC0zLjM4LTEuNWwtOTkuNS05OS41LTU4LjItNTcuODJjLTEuNS0xLjg4LTEuNS00Ljg4IDAtNi43Nmw1OS4zMi01OC45NWM5LjM5LTkuMzkgMTkuOS0xNi44OSAzMS4xNi0yMi4xNSAxNS43Ny04LjI2IDMzLjQxLTEyLjAyIDUwLjY5LTEyLjAyIDIzLjI4IDAgNDUuODEgNy4xMyA2NC45NiAxOS45bDQ0LjMtNDMuOTNjMC43NS0xLjEzIDEuODgtMS41IDMuMzgtMS41IDEuMTMgMCAyLjI1IDAuMzggMyAxLjVsMjQuNzggMjQuNDFhNC43NjUgNC43NjUgMCAwIDEgMC4wMSA2Ljc2eiIgZmlsbD0iIzAwYWRlZiIgcC1pZD0iMjMzOCI+PC9wYXRoPjxwYXRoIGQ9Ik01NzIuNSA1NTguNDVsLTM4LjY3IDM4LjY3IDI1LjE2IDI0Ljc4YzEuNSAxLjg4IDEuNSA0Ljg4IDAgNi43NmwtNTkuMzIgNTguOTVjLTIyLjUzIDIyLjktNTIuMTkgMzQuMTctODEuODUgMzQuMTctNy41MSAwLTE0LjY0LTAuNzUtMjEuNzgtMi4yNS0xNS4zOS0yLjYzLTMwLjA0LTguNjQtNDMuMTgtMTcuNjVsLTQ0LjMxIDQzLjkzYy0wLjc1IDEuMTMtMS44OCAxLjUtMy4zOCAxLjUtMS4xMyAwLTIuMjUtMC4zOC0zLTEuNWwtMjQuNzgtMjQuNDFhNC43NTYgNC43NTYgMCAwIDEgMC02Ljc2bDQ0LjMtNDMuOTNjLTMwLjc5LTQ1LjA2LTI1LjkxLTEwNy4wMSAxMy44OS0xNDcuMThsNTguOTUtNTguOTVjMS4xMy0wLjc1IDIuMjUtMS41IDMuMzgtMS41czIuNjMgMC43NSAzLjM4IDEuNWwyNC43OCAyNC43OCAzOC42Ny0zOC42N2MxLjg4LTEuNSA0Ljg4LTEuNSA2Ljc2IDBsMjEuMDMgMjEuNGMxLjg4IDEuNSAxLjg4IDQuNTEgMCA2LjM4bC0zOC42NyAzOC42NyA1Mi41NyA1Mi41NyAzOC4zLTM4LjY3YTQuNzU2IDQuNzU2IDAgMCAxIDYuNzYgMGwyMS4wMyAyMS4wM2MxLjg2IDEuNSAxLjg2IDQuNTEtMC4wMiA2LjM4eiIgZmlsbD0iIzAwYWRlZiIgcC1pZD0iMjMzOSI+PC9wYXRoPjxwYXRoIGQ9Ik01NzIuNSA1NTguNDVsLTM4LjY3IDM4LjY3IDI1LjE2IDI0Ljc4YzEuNSAxLjg4IDEuNSA0Ljg4IDAgNi43NmwtNTkuMzIgNTguOTVjLTIyLjUzIDIyLjktNTIuMTkgMzQuMTctODEuODUgMzQuMTctNy41MSAwLTE0LjY0LTAuNzUtMjEuNzgtMi4yNS0xMi4wMi0yOS42Ni0xOC40LTYxLjk1LTE4LjQtOTYuMTIgMC01MS44MSAxNS4wMi0xMDAuMjUgNDEuNjgtMTQwLjhsNi43NiA2Ljc2IDM4LjY3LTM4LjY3YzEuODgtMS41IDQuODgtMS41IDYuNzYgMGwyMS4wMyAyMS40YzEuODggMS41IDEuODggNC41MSAwIDYuMzhsLTM4LjY3IDM4LjY3IDUyLjU3IDUyLjU3IDM4LjMtMzguNjdhNC43NTYgNC43NTYgMCAwIDEgNi43NiAwbDIxLjAzIDIxLjAzYzEuODUgMS40OSAxLjg1IDQuNS0wLjAzIDYuMzd6TTc0Ny44NSAzMDYuODlsLTQ0LjMgNDMuOTNjMzAuNzkgNDUuNDMgMjUuOTEgMTA3LjAxLTEzLjg5IDE0Ny4xOGwtNTguOTUgNTguOTVjLTEuMTMgMC43NS0yLjI1IDEuNS0zLjM4IDEuNXMtMi42My0wLjM4LTMuMzgtMS41bC05OS41LTk5LjVjLTMtMTIuMzktNC41MS0yNS41My00LjUxLTM5LjA1IDAtNDAuMTcgMTMuNTItNzcuMzUgMzYuOC0xMDYuNjMgMTUuNzctOC4yNiAzMy40MS0xMi4wMiA1MC42OS0xMi4wMiAyMy4yOCAwIDQ1LjgxIDcuMTMgNjQuOTYgMTkuOWw0NC4zLTQzLjkzYzAuNzUtMS4xMyAxLjg4LTEuNSAzLjM4LTEuNSAxLjEzIDAgMi4yNSAwLjM4IDMgMS41bDI0Ljc4IDI0LjQxYTQuNzc0IDQuNzc0IDAgMCAxIDAgNi43NnoiIGZpbGw9IiMxMjk2ZGIiIHAtaWQ9IjIzNDAiPjwvcGF0aD48L3N2Zz4=";

const apiErrorIcon =
  "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc4NzY0MzE0Njg5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0ODgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMi44NCA2My41NkwxMjUuMzIgMjg3LjN2NDQ3LjQ3bDM4Ny41MiAyMjMuNzQgMzg3LjUzLTIyMy43NFYyODcuM3oiIGZpbGw9IiNmY2UyZTIiIHAtaWQ9IjI0ODkiPjwvcGF0aD48cGF0aCBkPSJNMzYzLjg2IDcwOC45NmMwIDY2LjQxIDE0LjMzIDEyOS4zNyAzOS42MiAxODYuNDFsMTA5LjM3IDYzLjE0IDM4Ny41Mi0yMjMuNzRWMjg3LjNsLTY2Ljc3LTM4LjU1Yy0zLjA1LTAuMDYtNi0wLjQ2LTkuMDctMC40Ni0yNTQuNDIgMC00NjAuNjcgMjA2LjI1LTQ2MC42NyA0NjAuNjd6IiBmaWxsPSIjZjJjZGNkIiBwLWlkPSIyNDkwIj48L3BhdGg+PHBhdGggZD0iTTg3NS4zNSAyNzIuODZjMS4yIDEzLjUyIDIuMDcgMjcuMTMgMi4wNyA0MC45NiAwIDI1My4zMi0yMDUuMzYgNDU4LjY4LTQ1OC42OCA0NTguNjgtMTExLjYzIDAtMjEzLjg4LTM5Ljk1LTI5My40MS0xMDYuMjR2NjguNTFsMzg3LjUyIDIyMy43NCAzODcuNTItMjIzLjc0VjI4Ny4zbC0yNS4wMi0xNC40NHoiIGZpbGw9IiNmMmNkY2QiIHAtaWQ9IjI0OTEiPjwvcGF0aD48cGF0aCBkPSJNNTEyLjYyIDk1OC41MUwxMjQuODcgNzM0LjY2VjI4Ni45Mkw1MTIuNjIgNjMuMDNsMzg3Ljc1IDIyMy44OXY0NDcuNzRMNTEyLjYyIDk1OC41MXpNMTYwLjY5IDcxMy45OGwzNTEuOTMgMjAzLjE3IDM1MS45My0yMDMuMTdWMzA3LjZMNTEyLjYyIDEwNC4zOSAxNjAuNjkgMzA3LjZ2NDA2LjM4eiIgZmlsbD0iIzhhOGE4YSIgcC1pZD0iMjQ5MiI+PC9wYXRoPjxwYXRoIGQ9Ik03NDcuODUgMzA2Ljg5bC00NC4zIDQzLjkzYzMwLjc5IDQ1LjQzIDI1LjkxIDEwNy4wMS0xMy44OSAxNDcuMThsLTU4Ljk1IDU4Ljk1Yy0xLjEzIDAuNzUtMi4yNSAxLjUtMy4zOCAxLjVzLTIuNjMtMC4zOC0zLjM4LTEuNWwtOTkuNS05OS41LTU4LjItNTcuODJjLTEuNS0xLjg4LTEuNS00Ljg4IDAtNi43Nmw1OS4zMi01OC45NWM5LjM5LTkuMzkgMTkuOS0xNi44OSAzMS4xNi0yMi4xNSAxNS43Ny04LjI2IDMzLjQxLTEyLjAyIDUwLjY5LTEyLjAyIDIzLjI4IDAgNDUuODEgNy4xMyA2NC45NiAxOS45bDQ0LjMtNDMuOTNjMC43NS0xLjEzIDEuODgtMS41IDMuMzgtMS41IDEuMTMgMCAyLjI1IDAuMzggMyAxLjVsMjQuNzggMjQuNDFhNC43NjUgNC43NjUgMCAwIDEgMC4wMSA2Ljc2eiIgZmlsbD0iI2UwNzA3OSIgcC1pZD0iMjQ5MyI+PC9wYXRoPjxwYXRoIGQ9Ik01NzIuNSA1NTguNDVsLTM4LjY3IDM4LjY3IDI1LjE2IDI0Ljc4YzEuNSAxLjg4IDEuNSA0Ljg4IDAgNi43NmwtNTkuMzIgNTguOTVjLTIyLjUzIDIyLjktNTIuMTkgMzQuMTctODEuODUgMzQuMTctNy41MSAwLTE0LjY0LTAuNzUtMjEuNzgtMi4yNS0xNS4zOS0yLjYzLTMwLjA0LTguNjQtNDMuMTgtMTcuNjVsLTQ0LjMxIDQzLjkzYy0wLjc1IDEuMTMtMS44OCAxLjUtMy4zOCAxLjUtMS4xMyAwLTIuMjUtMC4zOC0zLTEuNWwtMjQuNzgtMjQuNDFhNC43NTYgNC43NTYgMCAwIDEgMC02Ljc2bDQ0LjMtNDMuOTNjLTMwLjc5LTQ1LjA2LTI1LjkxLTEwNy4wMSAxMy44OS0xNDcuMThsNTguOTUtNTguOTVjMS4xMy0wLjc1IDIuMjUtMS41IDMuMzgtMS41czIuNjMgMC43NSAzLjM4IDEuNWwyNC43OCAyNC43OCAzOC42Ny0zOC42N2MxLjg4LTEuNSA0Ljg4LTEuNSA2Ljc2IDBsMjEuMDMgMjEuNGMxLjg4IDEuNSAxLjg4IDQuNTEgMCA2LjM4bC0zOC42NyAzOC42NyA1Mi41NyA1Mi41NyAzOC4zLTM4LjY3YTQuNzU2IDQuNzU2IDAgMCAxIDYuNzYgMGwyMS4wMyAyMS4wM2MxLjg2IDEuNSAxLjg2IDQuNTEtMC4wMiA2LjM4eiIgZmlsbD0iI2UwNzA3OSIgcC1pZD0iMjQ5NCI+PC9wYXRoPjxwYXRoIGQ9Ik01NzIuNSA1NTguNDVsLTM4LjY3IDM4LjY3IDI1LjE2IDI0Ljc4YzEuNSAxLjg4IDEuNSA0Ljg4IDAgNi43NmwtNTkuMzIgNTguOTVjLTIyLjUzIDIyLjktNTIuMTkgMzQuMTctODEuODUgMzQuMTctNy41MSAwLTE0LjY0LTAuNzUtMjEuNzgtMi4yNS0xMi4wMi0yOS42Ni0xOC40LTYxLjk1LTE4LjQtOTYuMTIgMC01MS44MSAxNS4wMi0xMDAuMjUgNDEuNjgtMTQwLjhsNi43NiA2Ljc2IDM4LjY3LTM4LjY3YzEuODgtMS41IDQuODgtMS41IDYuNzYgMGwyMS4wMyAyMS40YzEuODggMS41IDEuODggNC41MSAwIDYuMzhsLTM4LjY3IDM4LjY3IDUyLjU3IDUyLjU3IDM4LjMtMzguNjdhNC43NTYgNC43NTYgMCAwIDEgNi43NiAwbDIxLjAzIDIxLjAzYzEuODUgMS40OSAxLjg1IDQuNS0wLjAzIDYuMzd6TTc0Ny44NSAzMDYuODlsLTQ0LjMgNDMuOTNjMzAuNzkgNDUuNDMgMjUuOTEgMTA3LjAxLTEzLjg5IDE0Ny4xOGwtNTguOTUgNTguOTVjLTEuMTMgMC43NS0yLjI1IDEuNS0zLjM4IDEuNXMtMi42My0wLjM4LTMuMzgtMS41bC05OS41LTk5LjVjLTMtMTIuMzktNC41MS0yNS41My00LjUxLTM5LjA1IDAtNDAuMTcgMTMuNTItNzcuMzUgMzYuOC0xMDYuNjMgMTUuNzctOC4yNiAzMy40MS0xMi4wMiA1MC42OS0xMi4wMiAyMy4yOCAwIDQ1LjgxIDcuMTMgNjQuOTYgMTkuOWw0NC4zLTQzLjkzYzAuNzUtMS4xMyAxLjg4LTEuNSAzLjM4LTEuNSAxLjEzIDAgMi4yNSAwLjM4IDMgMS41bDI0Ljc4IDI0LjQxYTQuNzc0IDQuNzc0IDAgMCAxIDAgNi43NnoiIGZpbGw9IiNlYTRlNWEiIHAtaWQ9IjI0OTUiPjwvcGF0aD48L3N2Zz4=";

const apiSuccessIcon = "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc4NzY0MzIyODU4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NDgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMi44NCA2My41NkwxMjUuMzIgMjg3LjN2NDQ3LjQ3bDM4Ny41MiAyMjMuNzQgMzg3LjUzLTIyMy43NFYyODcuM3oiIGZpbGw9IiNkN2ZkZTAiIHAtaWQ9IjI2NDkiPjwvcGF0aD48cGF0aCBkPSJNMzYzLjg2IDcwOC45NmMwIDY2LjQxIDE0LjMzIDEyOS4zNyAzOS42MiAxODYuNDFsMTA5LjM3IDYzLjE0IDM4Ny41Mi0yMjMuNzRWMjg3LjNsLTY2Ljc3LTM4LjU1Yy0zLjA1LTAuMDYtNi0wLjQ2LTkuMDctMC40Ni0yNTQuNDIgMC00NjAuNjcgMjA2LjI1LTQ2MC42NyA0NjAuNjd6IiBmaWxsPSIjYjNmMmMyIiBwLWlkPSIyNjUwIj48L3BhdGg+PHBhdGggZD0iTTg3NS4zNSAyNzIuODZjMS4yIDEzLjUyIDIuMDcgMjcuMTMgMi4wNyA0MC45NiAwIDI1My4zMi0yMDUuMzYgNDU4LjY4LTQ1OC42OCA0NTguNjgtMTExLjYzIDAtMjEzLjg4LTM5Ljk1LTI5My40MS0xMDYuMjR2NjguNTFsMzg3LjUyIDIyMy43NCAzODcuNTItMjIzLjc0VjI4Ny4zbC0yNS4wMi0xNC40NHoiIGZpbGw9IiNiM2YyYzIiIHAtaWQ9IjI2NTEiPjwvcGF0aD48cGF0aCBkPSJNNTEyLjYyIDk1OC41MUwxMjQuODcgNzM0LjY2VjI4Ni45Mkw1MTIuNjIgNjMuMDNsMzg3Ljc1IDIyMy44OXY0NDcuNzRMNTEyLjYyIDk1OC41MXpNMTYwLjY5IDcxMy45OGwzNTEuOTMgMjAzLjE3IDM1MS45My0yMDMuMTdWMzA3LjZMNTEyLjYyIDEwNC4zOSAxNjAuNjkgMzA3LjZ2NDA2LjM4eiIgZmlsbD0iIzhhOGE4YSIgcC1pZD0iMjY1MiI+PC9wYXRoPjxwYXRoIGQ9Ik03NDcuODUgMzA2Ljg5bC00NC4zIDQzLjkzYzMwLjc5IDQ1LjQzIDI1LjkxIDEwNy4wMS0xMy44OSAxNDcuMThsLTU4Ljk1IDU4Ljk1Yy0xLjEzIDAuNzUtMi4yNSAxLjUtMy4zOCAxLjVzLTIuNjMtMC4zOC0zLjM4LTEuNWwtOTkuNS05OS41LTU4LjItNTcuODJjLTEuNS0xLjg4LTEuNS00Ljg4IDAtNi43Nmw1OS4zMi01OC45NWM5LjM5LTkuMzkgMTkuOS0xNi44OSAzMS4xNi0yMi4xNSAxNS43Ny04LjI2IDMzLjQxLTEyLjAyIDUwLjY5LTEyLjAyIDIzLjI4IDAgNDUuODEgNy4xMyA2NC45NiAxOS45bDQ0LjMtNDMuOTNjMC43NS0xLjEzIDEuODgtMS41IDMuMzgtMS41IDEuMTMgMCAyLjI1IDAuMzggMyAxLjVsMjQuNzggMjQuNDFhNC43NjUgNC43NjUgMCAwIDEgMC4wMSA2Ljc2eiIgZmlsbD0iIzg3YzM4ZiIgcC1pZD0iMjY1MyI+PC9wYXRoPjxwYXRoIGQ9Ik01NzIuNSA1NTguNDVsLTM4LjY3IDM4LjY3IDI1LjE2IDI0Ljc4YzEuNSAxLjg4IDEuNSA0Ljg4IDAgNi43NmwtNTkuMzIgNTguOTVjLTIyLjUzIDIyLjktNTIuMTkgMzQuMTctODEuODUgMzQuMTctNy41MSAwLTE0LjY0LTAuNzUtMjEuNzgtMi4yNS0xNS4zOS0yLjYzLTMwLjA0LTguNjQtNDMuMTgtMTcuNjVsLTQ0LjMxIDQzLjkzYy0wLjc1IDEuMTMtMS44OCAxLjUtMy4zOCAxLjUtMS4xMyAwLTIuMjUtMC4zOC0zLTEuNWwtMjQuNzgtMjQuNDFhNC43NTYgNC43NTYgMCAwIDEgMC02Ljc2bDQ0LjMtNDMuOTNjLTMwLjc5LTQ1LjA2LTI1LjkxLTEwNy4wMSAxMy44OS0xNDcuMThsNTguOTUtNTguOTVjMS4xMy0wLjc1IDIuMjUtMS41IDMuMzgtMS41czIuNjMgMC43NSAzLjM4IDEuNWwyNC43OCAyNC43OCAzOC42Ny0zOC42N2MxLjg4LTEuNSA0Ljg4LTEuNSA2Ljc2IDBsMjEuMDMgMjEuNGMxLjg4IDEuNSAxLjg4IDQuNTEgMCA2LjM4bC0zOC42NyAzOC42NyA1Mi41NyA1Mi41NyAzOC4zLTM4LjY3YTQuNzU2IDQuNzU2IDAgMCAxIDYuNzYgMGwyMS4wMyAyMS4wM2MxLjg2IDEuNSAxLjg2IDQuNTEtMC4wMiA2LjM4eiIgZmlsbD0iIzg3YzM4ZiIgcC1pZD0iMjY1NCI+PC9wYXRoPjxwYXRoIGQ9Ik01NzIuNSA1NTguNDVsLTM4LjY3IDM4LjY3IDI1LjE2IDI0Ljc4YzEuNSAxLjg4IDEuNSA0Ljg4IDAgNi43NmwtNTkuMzIgNTguOTVjLTIyLjUzIDIyLjktNTIuMTkgMzQuMTctODEuODUgMzQuMTctNy41MSAwLTE0LjY0LTAuNzUtMjEuNzgtMi4yNS0xMi4wMi0yOS42Ni0xOC40LTYxLjk1LTE4LjQtOTYuMTIgMC01MS44MSAxNS4wMi0xMDAuMjUgNDEuNjgtMTQwLjhsNi43NiA2Ljc2IDM4LjY3LTM4LjY3YzEuODgtMS41IDQuODgtMS41IDYuNzYgMGwyMS4wMyAyMS40YzEuODggMS41IDEuODggNC41MSAwIDYuMzhsLTM4LjY3IDM4LjY3IDUyLjU3IDUyLjU3IDM4LjMtMzguNjdhNC43NTYgNC43NTYgMCAwIDEgNi43NiAwbDIxLjAzIDIxLjAzYzEuODUgMS40OSAxLjg1IDQuNS0wLjAzIDYuMzd6TTc0Ny44NSAzMDYuODlsLTQ0LjMgNDMuOTNjMzAuNzkgNDUuNDMgMjUuOTEgMTA3LjAxLTEzLjg5IDE0Ny4xOGwtNTguOTUgNTguOTVjLTEuMTMgMC43NS0yLjI1IDEuNS0zLjM4IDEuNXMtMi42My0wLjM4LTMuMzgtMS41bC05OS41LTk5LjVjLTMtMTIuMzktNC41MS0yNS41My00LjUxLTM5LjA1IDAtNDAuMTcgMTMuNTItNzcuMzUgMzYuOC0xMDYuNjMgMTUuNzctOC4yNiAzMy40MS0xMi4wMiA1MC42OS0xMi4wMiAyMy4yOCAwIDQ1LjgxIDcuMTMgNjQuOTYgMTkuOWw0NC4zLTQzLjkzYzAuNzUtMS4xMyAxLjg4LTEuNSAzLjM4LTEuNSAxLjEzIDAgMi4yNSAwLjM4IDMgMS41bDI0Ljc4IDI0LjQxYTQuNzc0IDQuNzc0IDAgMCAxIDAgNi43NnoiIGZpbGw9IiMzNmFiNjAiIHAtaWQ9IjI2NTUiPjwvcGF0aD48L3N2Zz4=";		
		
export function setTopoData() {
  return spread((serviceRes, podRes, pathRes) => {
    let categories = [];
    let categoryMap = {};
    let nodes = [];
    let links = [];
    let nodePos = {};
    let state = -1;
    //service
    let serviceNodes = coverArray(serviceRes);
    let index = 0;
    serviceNodes.forEach((node) => {
      let _map = {
        value: node[0],
        index: index,
        unset: true,
      };
      let category = {
        name: node[2],
        id: node[1],
      };
      if (node[1] != "") {
        index++;
        categories.push(category);
        categoryMap[node[1]] = _map;
      }
    });

    //pods
    let podNodes = coverArray(podRes);
    podNodes.forEach((node) => {
      if (
        categoryMap[node[4]] &&
        node[0] != "" &&
        !checkPodRepeat(nodes, node[0])
      ) {
        if (categoryMap[node[2]].unset) {
          nodePos[node[4]] = {
            type: "service",
            children: [],
            parent: null,
            x: 0,
            y: 0,
          };
          let service = {
            id: node[4],
            name: node[2],
            value: categoryMap[node[4]].value,
            symbol: serviceIcon,
            symbolSize: calcSymbolSize(categoryMap[node[4]].value),
            category: categoryMap[node[4]].index,
            isSvc: true,
          };
          nodes.push(service);
          categoryMap[node[4]].unset = false;
        }
        let pod = {
          id: node[0],
          name: node[1],
          value: node[3],
          symbolSize: calcPodSymbolSize(node[3]) * 2,
          symbol: podIcon,
          category: categoryMap[node[4]].index,
          isSvc: false,
          parent: node[4],
        };
        nodePos[node[0]] = {
          type: "pod",
          service: node[4],
          children: [],
          parent: null,
          x: 0,
          y: 0,
        };
        nodePos[node[2]].children.push(node[0]);
        nodes.push(pod);
        let link = {
          source: node[4],
          target: node[0],
          value: node[4],

          symbol: ["circle", "circle"],
          symbolSize: [10, 5],
          lineStyle: {
            type: "dashed",
          },
          label: {
            show: false,
          },
        };
        links.push(link);
      }
    });

    //path
    let pathNodes = coverArray(pathRes);
    pathNodes.forEach((node) => {
      if (node[0] != "") {
        let source = node[0].replace("::ffff:", "");
        let target = node[1].replace("::ffff:", "");
        let link = {
          source,
          target,
          value: node[2],
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
        if (nodePos[source] && nodePos[target]) {
          if (nodePos[source].service == nodePos[target].service) {
            nodePos[source].children.push(target);
            nodePos[target].parent = source;
          }
        }
        links.push(link);
      }
    });
    state = nodes.length;
    return { categories, categoryMap, nodes, links, nodePos, state };
  });
}


export function setAPITopoData() {
  return (res) => {
		let serviceNodes = res.services || [];
		let apiNodes = res.apis || [];
		let pathNodes = res.links || [];
    let categories = [];
    let categoryMap = {};
    let nodes = [];
    let links = [];
    let nodePos = {};
    let state = -1;
    //service
    let index = 0;
    serviceNodes.forEach((node) => {
      let _map = {
        value: node.name,
        name: node.name,
        index: index,
        unset: true,
      };
      let category = {
        name: node.name,
        id: node.id,
      };
      if (node.name != "") {
        index++;
        categories.push(category);
        categoryMap[node.id] = _map;
      }
    });

    //apis
    apiNodes.forEach((node) => {
      if (
        categoryMap[node.service] &&
        node.name != "" &&
        !checkPodRepeat(nodes, node.id)
      ) {
        if (categoryMap[node.service].unset) {
          nodePos[node.service] = {
            type: "service",
            children: [],
            parent: null,
            x: 0,
            y: 0,
          };
          let service = {
            id: node.service,
            name: categoryMap[node.service].name,
            value: categoryMap[node.service].value,
            symbol: serviceIcon,
            symbolSize: 50,//calcSymbolSize(categoryMap[node.service].value),
            category: categoryMap[node.service].index,
            isSvc: true,
          };
          nodes.push(service);
          categoryMap[node.service].unset = false;
        }
        let api = {
          id: node.id,
          name: node.name,
          value: node.weight,
          symbolSize: calcPodSymbolSize(node.weight) * 3 + (node.current?10:0),
          symbol: node.error?apiErrorIcon:(node.current?apiSuccessIcon:apiIcon),
          category: categoryMap[node.service].index,
          isSvc: false,
          parent: node.service,
        };
        nodePos[node.id] = {
          type: "api",
          service: node.service,
          children: [],
          parent: null,
          x: 0,
          y: 0,
        };
        nodePos[node.service].children.push(node.id);
        nodes.push(api);
        let link = {
          source: node.service,
          target: node.id,
          value: node.service,

          symbol: ["circle", "circle"],
          symbolSize: [10, 5],
          lineStyle: {
            type: "dashed",
          },
          label: {
            show: false,
          },
        };
        links.push(link);
      }
    });

    //path
    pathNodes.forEach((node) => {
      if (node.source != "") {
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
          lineStyle: {
            color: node.error ? "red":null,
						width: 1 + node.weight/10
          },
        };
        if (nodePos[source] && nodePos[target]) {
          if (nodePos[source].service == nodePos[target].service) {
            nodePos[source].children.push(target);
            nodePos[target].parent = source;
          }
        }
        links.push(link);
      }
    });
    state = nodes.length;
    return { categories, categoryMap, nodes, links, nodePos, state };
  };
}

export function getTimelineWhere(dateIndex, endDateIndex) {
  let sql = "";
  if (endDateIndex >= 0) {
    sql +=
      " AND toDateTime(reqTime/1000) <now() - interval " +
      timelineMap[endDateIndex] +
      " ";
  }
  if (dateIndex >= 0) {
    sql +=
      " AND toDateTime(reqTime/1000) >now() - interval " +
      timelineMap[dateIndex] +
      " ";
  }
  return sql;
}

export function getNamespaceWhere(ns) {
  let sql = "";
  if (ns) {
    sql += " AND pod.ns = '" + ns + "'";
  }
  return sql;
}

export function getSQLWhere(type, name, dateIndex, endDateIndex) {
  let sql = "";
  if (endDateIndex >= 0 || dateIndex >= 0) {
    sql += getTimelineWhere(dateIndex, endDateIndex);
  }
  if (name && name != "") {
    sql += " AND ";
    if (type == "service") {
      sql += "service.name='" + name + "' ";
    } else if (type == "pod") {
      sql += "pod.name='" + name + "' ";
    }
  }
  return sql;
}

export function getTopoWhere(dateIndex, endDateIndex) {
  let sql = "";
  if (endDateIndex >= 0 || dateIndex >= 0) {
    sql += getTimelineWhere(dateIndex, endDateIndex);
  }
  return sql;
}

export function getServiceName(name, namespace, domain) {
  return domain ? `${name}.${namespace}.svc.${domain}` : (namespace? `${name}.${namespace}` : name);
}

export function getReqServiceName(name, namespace, domain) {
  return domain ? `${name}.${namespace}.${domain}` : namespace? `${name}.${namespace}` : name;
}

export function getServiceWhere(type, name, namespace, domain) {
  if (type == "and") {
    return ` AND service.name = '${getServiceName(name, namespace, domain)}'`;
  } else if (type == "both") {
    return ` AND (service.name = '${getServiceName(
      name,
      namespace,
      domain,
    )}' OR req.service.name = '${getReqServiceName(name, namespace, domain)}')`;
  } else {
    return ` service.name = '${getServiceName(name, namespace, domain)}'`;
  }
}

export function getSelectKeys(mode) {
  if (mode == "name&as") {
    let rtn = "";
    select_keys.forEach((key, idx) => {
      if (idx > 0) {
        rtn += ",";
      }
      rtn += key + " as " + key.replace(/\./g, "_");
    });
    return rtn;
  } else if (mode == "as") {
    let rtn = "";
    select_keys.forEach((key, idx) => {
      if (idx > 0) {
        rtn += ",";
      }
      rtn += key.replace(/\./g, "_");
    });
    return rtn;
  } else {
    return select_keys.join(",");
  }
}

function getSqlPagging(sql, pageNo, pageSize, sortBy, arrow) {
  return `${sql} ORDER BY ${sortBy} ${arrow} LIMIT ${
    (pageNo - 1) * pageSize
  },${pageSize};`;
}

function getWhere(filter, date, endDate) {
  let sql = `where 1=1  AND bondType != 'outbound' `;
  if (filter && filter != "") {
    sql += ` AND ${filter} `;
  }
  if (date && date != "") {
    sql += " AND reqTime > " + new Date(date).getTime();
  }
  if (endDate && endDate != "") {
    sql += " AND reqTime < " + new Date(endDate).getTime();
  }

  return sql;
}

export async function getPagingData(
  pageNo,
  pageSize,
  filter,
  sortBy,
  arrow,
  date,
  endDate,
  type,
  uid,
) {
  let whereSQL = getWhere(filter, date, endDate);
  let _keys = getSelectKeys("name&as");
  let SQL = getSqlPagging(
    `select ${_keys} from log ${whereSQL}`,
    pageNo,
    pageSize,
    sortBy,
    arrow,
  );
  let CNTSQL = `select count(1) as cnt from (select 1 from log ${whereSQL})`;
  let append = "";
  append += type ? `&type=${type}` : "";
  append += uid ? `&id=${uid}` : "";
  return merge([
    request(api.CLICKHOUSE.QUERY(CNTSQL) + append, METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL) + append, METHOD.GET),
  ]);
}

export async function getDetail(reqTime) {
  let SQL = `select message from log where reqTime='${reqTime}';`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}

export async function allErrorRate() {
  let SQL1 =
    "select count(1) as count,res.status from log where res.status>'0' and proto = 'http' AND bondType != 'outbound' group by res.status order by res.status asc";
  let SQL2 =
    "select count(1) as count,count(CASE WHEN res.status<'400' THEN 1 END) as succss_count ,count(CASE WHEN res.status>='400' THEN 1 END) as error_count from log where res.status>'0' and proto = 'http' AND bondType != 'outbound' group by proto";
  return merge([
    request(api.CLICKHOUSE.QUERY(SQL1), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL2), METHOD.GET),
  ]);
}

export async function allTPS() {
  let SQL7lb =
    "select count(1) AS tps_sum, toStartOfInterval(toDateTime(resTime/1000),interval 1 minute) as minute from log where proto = 'http' AND timestamp > subtractWeeks(now(),1) group by minute order by minute asc";
  let SQL4lb =
    "select count(1) AS tps_sum, toStartOfInterval(toDateTime(resTime/1000),interval 1 minute) as minute from log where proto = 'tcp' AND timestamp > subtractWeeks(now(),1) group by minute order by minute asc";
  return merge([
    request(api.CLICKHOUSE.QUERY(SQL7lb), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL4lb), METHOD.GET),
  ]);
}

export async function getTPS(id) {
  let SQL = `select count(1) AS tps_sum, toStartOfInterval(toDateTime(resTime/1000),interval 1 minute) as minute from log where iid='${id}' group by minute order by minute asc`;
  let SQL2 = `select count(1) AS tps_sum from log where iid='${id}'`;
  return merge([
    request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL2), METHOD.GET),
  ]);
}

export async function getTPSByWhere(
  pageNo,
  pageSize,
  filter,
  sortBy,
  arrow,
  date,
  endDate,
) {
  let whereSQL = getWhere(filter, date, endDate);
  let SQL = `select count(1) AS tps_sum, toStartOfInterval(toDateTime(resTime/1000),interval 1 minute) as minute from log ${whereSQL} group by minute order by minute asc`;
  let SQL2 = `select count(1) AS tps_sum from log ${whereSQL}`;
  return merge([
    request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET),
    request(api.CLICKHOUSE.QUERY(SQL2), METHOD.GET),
  ]);
}

export async function getLatencyByWhere(
  pageNo,
  pageSize,
  filter,
  sortBy,
  arrow,
  date,
  endDate,
) {
  let whereSQL = getWhere(filter, date, endDate);
  let SQL = `select (ceil((resTime - reqTime)/1000000*2)) as latency ,count() as count from log ${whereSQL} group by latency order by latency`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}

export async function getLoadStatusByWhere(
  pageNo,
  pageSize,
  filter,
  sortBy,
  arrow,
  date,
  endDate,
) {
  let whereSQL = getWhere(filter, date, endDate);
  let SQL = `select count() as count,res.status from log ${whereSQL} AND res.status>'0' group by res.status order by res.status`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
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

export function coverList(res) {
  let _data = [];
  let nodes = res.data.split("\n");
  nodes.map((nodeStr) => {
    let node = nodeStr.split("\t");
    let item = {};
    if (node && (node.length > 1 || (node.length == 1 && node[0] != ""))) {
      node.forEach((col, index) => {
        item[select_keys[index]] = col;
      });
      _data.push(item);
    }
    return nodeStr;
  });
  return _data;
}

export function coverArray(res) {
  let _data = [];
  if (res && res.data) {
    if (typeof res.data == "number") {
      _data.push(res.data);
    } else {
      let nodes = res && res.data ? res.data.split("\n") : [];
      nodes.map((nodeStr) => {
        let node = nodeStr.split("\t");
        if (node[0] != "") {
          _data.push(node);
        }
        return nodeStr;
      });
    }
  }
  return _data;
}

export default {
  select_keys,
  getSelectKeys,
  getPagingData,
  getDetail,
  coverMessage,
  coverList,
  coverArray,
  getTPS,
  getTPSByWhere,
  getLatencyByWhere,
  getLoadStatusByWhere,
  allTPS,
  allErrorRate,
  getServiceName,
  getTopoData,
  setTopoData,
	setAPITopoData,
	getAPITopoData,
  getServiceWhere,
};
