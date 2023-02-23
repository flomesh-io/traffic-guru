import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export async function getApiSummary(params) {
  let filters = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      filters.apiId = params.pid;
    } else if (params.apply == "project") {
      filters.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(filters: $filters){
		apis{total,run,error}
	}`,{filters});
}

export async function getApplicationSummary(params) {
  let filters = DefaultChartDate;
  if (filters.pid) {
    if (params.apply == "openapi") {
      filters.apiId = params.pid;
    } else if (params.apply == "project") {
      filters.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(filters: $filters){
		applications{total,run,error}
	}`,{filters});
}

export async function getApiStatus(params) {
  let filters = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      filters.apiId = params.pid;
    } else if (params.apply == "project") {
      filters.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(filters: $filters){
		api_status{run,error}
	}`,{filters});
}

export async function getApiChartWeek(params) {
  let filters = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      filters.apiId = params.pid;
    } else if (params.apply == "project") {
      filters.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(filters: $filters){
		api_week
	}`,{filters});
}

export async function getApiChartMonth(params) {
  let filters = DefaultChartDate;
  if (params.pid) {
    if (params.apply == "openapi") {
      filters.apiId = params.pid;
    } else if (params.apply == "project") {
      filters.projectId = params.pid;
    }
  }
  return query(`getApiDashboardPageInfo(filters: $filters){
		api_month
	}`,{filters});
}

export default {
  getApiSummary,
  getApplicationSummary,
  getApiStatus,
  getApiChartWeek,
  getApiChartMonth,
};
