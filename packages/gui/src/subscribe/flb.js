import MiniArea from "@/components/chart/MiniArea";
import RankingGroup from "@/components/chart/RankingGroup";
import TotalChart from "@/components/chart/TotalChart";

import Scatter from "@/components/chart/Scatter";
import BarChart from "@/components/chart/BarChart";
import BarGroupChart from "@/components/chart/BarGroupChart";
import Sankey from "@/components/chart/Sankey";

import clickhouse_svc from "@/services/clickhouse";
import flb_svc from "@/services/flb.js";
import pro_svc from "@/services/prometheus.js";

import { format } from "date-fns";
import { spread } from "@/utils/request";
import { getBitUnit, getBitValue } from "./tools";

const flb = {
  dashboard: {
    TOTAL: {
      title: "LB Total",
      tag: TotalChart,
      service: flb_svc.getSummary,
      col: 6,
      className: "card nopd",
      data: (res) => {
        let alldata = res.loadbalancer_summary;
        return {
          config: {
            icon: require("@/assets/img/lb.png"),
            total: alldata.loadbalancer_amount,
            unit: "unitge",
            body: [
              {
                label: "4LB",
                value: alldata.layer4_loadbalancer_amount,
                unit: "unitge",
              },
            ],
            foot: [
              { label: "activeClient", value: alldata.active_clients },
              { label: "activeTarget", value: alldata.active_targets },
            ],
          },
        };
      },
    },
    UNHEALTHY_UPSTREAM: {
      title: "Unhealthy Upstream",
      tag: Scatter,
      service: flb_svc.getUnhealthy,
      col: 16,
      className: "card nopd",
      data: (res) => {
        let alldata = res.health_check_unhealthy;
				let dv = [];
				alldata.forEach((item)=>{
					item.unhealthy.forEach((point,index)=>{
						dv.push({date:new Date(item.time),value:index+2,type:point});
					})
				})
        return {
          id: "UNHEALTHY_UPSTREAM",
          colors: ["#fb9690"],
          height: 220,
          padding: [0, 0, 0, 0],
          axis: false,
					stackLayout: true,
          unit: "",
					min:1,
					formatter: (v)=> `${v.data[2]}`,
          hideY: true,
          dv,
        };
      },
    },
    ERRORRATE: {
      title: "Load Status",
      tag: BarChart,
      provide: "clickhouse",
      service: clickhouse_svc.allErrorRate,
      col: 6,
      className: "card nopd",
      data: spread((res, cnt) => {
        let barData = [],
          ary = clickhouse_svc.coverArray(res);
        ary.forEach((node) => {
          let _template = {};
          _template.type = "Request Count";
          _template.date = node[1];
          _template.value = node[0] * 1;
          let color = "#fb9690";
          if (node[1] * 1 < 300) {
            color = "#8bd4a1";
          } else if (node[1] * 1 < 400) {
            color = "#fac858";
          }
          _template.itemStyle = { color };
          barData.push(_template);
        });
        return {
          label: "errorrate",
          barData: barData,
          cnt: clickhouse_svc.coverArray(cnt),
        };
      }),
    },
    ADDRESSPOOL: {
      title: "apu",
      tag: BarGroupChart,
      service: flb_svc.getAddressPoolUsage,
      col: 6,
      className: "card nopd",
      data: (res) => {
        let alldata = res.address_pool_usage;
        alldata.bars = alldata.pools;
        (alldata.bars || []).forEach((item) => {
          item.name = item.name ? item.name : item.poolName;
        });
        return {
          group: alldata,
        };
      },
    },
    TPS: {
      title: "tps",
      tag: MiniArea,
      provide: "clickhouse",
      service: clickhouse_svc.allTPS,
      col: 6,
      className: "card nopd",
      data: spread((tps7, tps4) => {
        let tps = [];
        let tps7ary = clickhouse_svc.coverArray(tps7);
        tps7ary.forEach((item) => {
          let _template = {};
          _template.type = "7lb";
          _template.value = item[0];
          (_template.date = format(new Date(item[1]), "yyyy-MM-dd HH:mm")),
            tps.push(_template);
        });
        let tps4ary = clickhouse_svc.coverArray(tps4);
        tps4ary.forEach((item) => {
          let _template = {};
          _template.type = "4lb";
          _template.value = item[0];
          (_template.date = format(new Date(item[1]), "yyyy-MM-dd HH:mm")),
            tps.push(_template);
        });
        return {
          id: "TPS",
          colors: ["#00adef", "#8be4c1"],
          height: 148,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "个",
          showy: false,
          dv: tps,
        };
      }),
    },
    RANKING: {
      title: "ranking",
      tag: RankingGroup,
      noTitle: true,
      provide: "clickhouse",
      service: flb_svc.getRanking,
      col: 8,
      className: "card nopd",
      cardToolLayout: "absolute",
      data: (res) => {
        let alldata = res;
        return {
          tops: [
            {
              title: "conections",
              items: [
                {
                  list: alldata.layer4_loadbalancer_connections_top,
                },
              ],
            },
            {
              title: "tps",
              items: [
                {
                  title: "4 LB tps top",
                  list: alldata.layer4_loadbalancer_tps_top,
                },
                {
                  title: "7 LB tps top",
                  list: alldata.layer7_loadbalancer_tps_top,
                },
              ],
            },
            {
              title: "bps",
              items: [
                {
                  title: "4 LB bps top",
                  list: alldata.layer4_loadbalancer_bps_top,
                },
                {
                  title: "7 LB bps top",
                  list: alldata.layer7_loadbalancer_bps_top,
                },
              ],
            },
          ],
        };
      },
    },
    SANKEY: {
      title: "trafficOverview",
      tag: Sankey,
      col: 16,
      className: "card nopd",
      data: () => {
        return {
          fields: [
            { title: "cluster", value: 11, unit: "unitge" },
            { title: "nodes", value: 200, unit: "unitge" },
          ],
        };
      },
    },
		
		
		CONNECTIONS: {
			title: "Connections",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: spread((curRes, newRes) => {
				let curDv = pro_svc.mapData([], curRes);
				let newDv = pro_svc.mapData([], newRes);
				curDv.forEach((item)=>{
					item.type = "Concurrent";
				})
				newDv.forEach((item)=>{
					item.type = "New";
				})
				return {
					id: "CONNECTIONS",
					colors: [
						"#fac858",
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					noStack: true,
					dv: curDv.concat(newDv),
				};
			}),
		},
		
		CURRENT_CONNECTIONS: {
			title: "Current Connections",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBCurConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "CURRENT_CONNECTIONS",
					colors: [
						"#fac858",
						"#abddf9",
						"#8bd4a1",
						"#8BAED4",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		INACT_CONNECTIONS: {
			title: "In Act Connections",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBInActConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "INACT_CONNECTIONS",
					colors: [
						"#8bd4a1",
						"#fac858",
						"#abddf9",
						"#8BAED4",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		FAIL_CONNECTIONS: {
			title: "Fail Connections",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBFailConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: spread((inRes, outRes) => {
				let inDv = pro_svc.mapData([], inRes);
				let outDv = pro_svc.mapData([], outRes);
				inDv.forEach((item)=>{
					item.type = "Inbound";
				})
				outDv.forEach((item)=>{
					item.type = "Outbound";
				})
				return {
					id: "FAIL_CONNECTIONS",
					colors: [
						"#fb9690",
						"#D48BCD",
						"#fac858",
						"#abddf9",
						"#8bd4a1",
						"#8BAED4",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: inDv.concat(outDv),
				};
			}),
		},
		
		FAIL_INBOUND_CONNECTIONS: {
			title: "Fail Connections (Inbound)",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBInFailConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "FAIL_INBOUND_CONNECTIONS",
					colors: [
						"#fb9690",
						"#abddf9",
						"#8bd4a1",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		FAIL_OUTBOUND_CONNECTIONS: {
			title: "Fail Connections (Outbound)",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBOutFailConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "FAIL_OUTBOUND_CONNECTIONS",
					colors: [
						"#fb9690",
						"#abddf9",
						"#8bd4a1",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		NEW_CONNECTIONS: {
			title: "New Connections",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBNewConns(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "NEW_CONNECTIONS",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		BYTES: {
			title: "Bytes",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBBits(true),
			provide: "prometheus",
			className: "card nopd",
			data: spread((downRes, upRes) => {
				let downDv = pro_svc.mapData([], downRes);
				let upDv = pro_svc.mapData([], upRes);
				
				let max = 0;
				downDv.forEach((item) => {
					max = max > item.value*1 ? max : item.value*1;
				});
				downDv.forEach((item) => {
					item.value = getBitValue(max, item.value);
					item.type = "Downstream";
				});
				
				upDv.forEach((item) => {
					max = max > item.value*1 ? max : item.value*1;
				});
				upDv.forEach((item) => {
					item.value = getBitValue(max, item.value);
					item.type = "Upstream";
				});
				
				return {
					id: "BYTES",
					colors: [
						"#abddf9",
						"#fac858",
						"#8bd4a1",
						"#8BAED4",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: getBitUnit(max),
					showy: false,
					dv: downDv.concat(upDv),
				};
			}),
		},
		
		DOWNSTREAM_BYTES: {
			title: "Downstream Bytes",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBInBits(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				let dv = pro_svc.mapData([], res);
				let max = 0;
				dv.forEach((item) => {
					max = max > item.value*1 ? max : item.value*1;
				});
				dv.forEach((item) => {
					item.value = getBitValue(max, item.value);
				});
				return {
					id: "DOWNSTREAM_BYTES",
					colors: [
						"#abddf9",
						"#8bd4a1",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: getBitUnit(max),
					showy: false,
					dv,
				};
			},
		},
		
		UPSTREAM_BYTES: {
			title: "Upstream Bytes",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getLBOutBits(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				let dv = pro_svc.mapData([], res);
				let max = 0;
				dv.forEach((item) => {
					max = max > item.value*1 ? max : item.value*1;
				});
				dv.forEach((item) => {
					item.value = getBitValue(max, item.value);
				});
				//getBitUnit(max),
				return {
					id: "UPSTREAM_BYTES",
					colors: [
						"#8BAED4",
						"#8bd4a1",
						"#abddf9",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: getBitUnit(max),
					showy: false,
					dv,
				};
			},
		},
		
		FREE_CPU: {
			title: "Free CPU",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getFreeCpu(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				let dv = pro_svc.mapData([], res);
				dv.forEach((item)=>{
					item.value = item.value*100;
				})
				return {
					id: "FREE_CPU",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "%",
					noStack: true,
					showy: false,
					dv,
				};
			},
		},
		
		PROCESS_CPU: {
			title: "Process CPU",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getProcessCpu(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				let dv = pro_svc.mapData([], res);
				return {
					id: "PROCESS_CPU",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Cores",
					showy: false,
					dv,
				};
			},
		},
		
		PROCESS_MEMORY: {
			title: "Process Memory",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getProcessMemory(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				let dv = pro_svc.mapData([], res);
				let max = 0;
				dv.forEach((item) => {
					max = max > item.value*1 ? max : item.value*1;
				});
				dv.forEach((item) => {
					item.value = getBitValue(max, item.value);
				});
				return {
					id: "PROCESS_MEMORY",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: getBitUnit(max),
					showy: false,
					dv,
				};
			},
		},
		
		TIME_WAIT: {
			title: "Time Wait",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getTimeWait(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "TIME_WAIT",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		OVERFLOW_ERROR: {
			title: "Overflow Error",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getConnOverflowError(true),
			provide: "prometheus",
			className: "card nopd",
			
			data: spread((fullRes, halfRes) => {
				let fullDv = pro_svc.mapData([], fullRes);
				let halfDv = pro_svc.mapData([], halfRes);
				fullDv.forEach((item)=>{
					item.type = "full-connection";
				})
				halfDv.forEach((item)=>{
					item.type = "half-connection";
				})
				return {
					id: "OVERFLOW_ERROR",
					colors: [
						"#fb9690",
						"#D48BCD",
						"#fac858",
						"#abddf9",
						"#8bd4a1",
						"#8BAED4",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: fullDv.concat(halfDv),
				};
			}),
		},
		
		FULL_CONN_OVERFLOW_ERROR: {
			title: "Overflow Error ( Full Connection )",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getFullConnOverflowError(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "FULL_CONN_OVERFLOW_ERROR",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
		
		HALF_CONN_OVERFLOW_ERROR: {
			title: "Overflow Error ( Half Connection )",
			tag: MiniArea,
			col: 6,
			service: pro_svc.getHalfConnOverflowError(true),
			provide: "prometheus",
			className: "card nopd",
			data: (res) => {
				return {
					id: "HALF_CONN_OVERFLOW_ERROR",
					colors: [
						"#8bd4a1",
						"#abddf9",
						"#8BAED4",
						"#fac858",
						"#D48BCD",
						"#fb9690",
					],
					height: 148,
					padding: [0, 0, 0, 0],
					axis: false,
					unit: "Conn",
					min:1,
					showy: false,
					dv: pro_svc.mapData([], res),
				};
			},
		},
  },
};

export default flb;
