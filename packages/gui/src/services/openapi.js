import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export async function getApiSummary(params) {
  let where = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      where.apiId = params.pid;
    } else if (params.apply == "project") {
      where.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(where: $where){
		apis{total,run,error}
	}`,{where});
}

export async function getApplicationSummary(params) {
  let where = DefaultChartDate;
  if (where.pid) {
    if (params.apply == "openapi") {
      where.apiId = params.pid;
    } else if (params.apply == "project") {
      where.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(where: $where){
		applications{total,run,error}
	}`,{where});
}

export async function getApiStatus(params) {
  let where = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      where.apiId = params.pid;
    } else if (params.apply == "project") {
      where.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(where: $where){
		api_status{run,error}
	}`,{where});
}

export async function getApiChartWeek(params) {
  let where = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      where.apiId = params.pid;
    } else if (params.apply == "project") {
      where.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(where: $where){
		api_week
	}`,{where});
}

export async function getApiChartMonth(params) {
  let where = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      where.apiId = params.pid;
    } else if (params.apply == "project") {
      where.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(where: $where){
		api_month
	}`,{where});
}

export default {
  getApiSummary,
  getApplicationSummary,
  getApiStatus,
  getApiChartWeek,
  getApiChartMonth,
};
