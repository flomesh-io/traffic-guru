import api from "@/services/api";
import { request, METHOD } from "@/utils/request";
import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export async function ERROR_RATE() {
  return request(api.ERROR_RATE, METHOD.POST, DefaultChartDate);
}

export async function getAddressPoolUsage() {
  return query(`getFlbDashboardPageInfo(where: $where){
		address_pool_usage{pool_usages{pool_id,pool_name,used_amount,amount},total_used_amount,total_amount}
	}`,{where:DefaultChartDate});
}

export async function getSummary() {
  return query(`getFlbDashboardPageInfo(where: $where){
		loadbalancer_summary{loadbalancer_amount,layer4_loadbalancer_amount,layer7_loadbalancer_amount,active_clients,active_targets}
	}`,{where:DefaultChartDate});
}

export async function getRanking() {
  return query(`getFlbDashboardPageInfo(where: $where){
		layer7_loadbalancer_connections_top{value,iid,name},
		layer4_loadbalancer_connections_top{value,iid,name},
		layer7_loadbalancer_tps_top{value,iid,name},
		layer4_loadbalancer_tps_top{value,iid,name},
		layer7_loadbalancer_bps_top{value,iid,name},
		layer4_loadbalancer_bps_top{value,iid,name}
	}`,{where:DefaultChartDate});
}

export default {
  getSummary,
  getAddressPoolUsage,
  getRanking,
  ERROR_RATE,
};
