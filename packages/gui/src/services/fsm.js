import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export async function getServicesSummary() {
  return query(`getFsmDashboardPageInfo(where: $where){
		services{total,include,exclude}
	}`,{where:DefaultChartDate});
}

export async function getNamespacesSummary() {
  return query(`namespacesConnection{
		aggregate{totalCount}
	}`);
}

export async function getRegistriesSummary() {
  return query(`getFsmDashboardPageInfo(where: $where){
		registries{total,valid,invalid}
	}`,{where:DefaultChartDate});
}

export async function getHealthchecksChart() {
	let where = DefaultChartDate;
	where.type = "service";
  return query(`getHealthcheckDashboardPageInfo(where: $where){
		healthchecks_timer
	}`,{where});
}

export async function getServicesHealthSummary() {
	let where = DefaultChartDate;
	where.type = "service";
  return query(`getHealthcheckDashboardPageInfo(where: $where){
		healthchecks{health,unhealthy}
	}`,{where});
}

export async function getIngressHealthSummary() {
	let where = DefaultChartDate;
	where.type = "ingress";
  return query(`getHealthcheckDashboardPageInfo(where: $where){
		healthchecks{health,unhealthy}
	}`,{where});
}

export default {
  getServicesSummary,
  getRegistriesSummary,
  getNamespacesSummary,
  getHealthchecksChart,
  getServicesHealthSummary,
  getIngressHealthSummary,
};
