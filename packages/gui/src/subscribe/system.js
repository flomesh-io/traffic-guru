import MiniArea from "@/components/chart/MiniArea";
import MiniSector from "@/components/chart/MiniSector";
import RankingGroup from "@/components/chart/RankingGroup";
import TotalChart from "@/components/chart/TotalChart";

import clickhouse_svc from "@/services/clickhouse";
import common_svc from "@/services/common.js";
import pro_svc from "@/services/prometheus.js";
import { spread } from "@/utils/request";

import { PartitionOutlined, FolderTwoTone } from "@ant-design/icons-vue";

const system = {
  common: {
    TPS_MESH: {
      title: "TPS",
      tag: MiniArea,
      col: 6,
      service: pro_svc.getTPS(true),
      provide: "prometheus",
      className: "card nopd",
      data: (res) => {
        return {
          id: "TPS_MESH",
          colors: [
            "#abddf9",
            "#8bd4a1",
            "#8BAED4",
            "#fac858",
            "#D48BCD",
            "#fb9690",
          ],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "Req/s",
          showy: false,
          dv: pro_svc.mapData([], res),
        };
      },
    },
    ERROR_RATE_MESH: {
      title: "errorrate",
      tag: MiniArea,
      col: 6,
      service: pro_svc.getER(true),
      provide: "prometheus",
      className: "card nopd",
      data: (res) => {
        return {
          id: "ERROR_RATE_MESH",
          colors: ["#8bd4a1", "#fac858", "#fb9690", "#D48BCD"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "%",
          showy: false,
          dv: pro_svc.mapData([], res),
        };
      },
    },
    LATENCY_MESH: {
      title: "Latency",
      tag: MiniArea,
      col: 6,
      service: pro_svc.getLatency(true),
      provide: "prometheus",
      className: "card nopd",
      data: (res) => {
        return {
          id: "LATENCY_MESH",
          colors: ["#abddf9", "#8BAED4", "#D48BCD", "#fb9690"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "ms",
          showy: false,
          dv: pro_svc.mapData([], res, (d) => {
            return isNaN(d / 1000) ? 0 : d / 1000;
          }),
        };
      },
    },
    LATENCY_MESH: {
      title: "Latency",
      tag: MiniArea,
      col: 6,
      service: pro_svc.getLatency(true),
      provide: "prometheus",
      className: "card nopd",
      data: (res) => {
        return {
          id: "LATENCY",
          colors: ["#abddf9", "#8BAED4", "#D48BCD", "#fb9690"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "ms",
          showy: false,
          dv: pro_svc.mapData([], res, (d) => {
            return isNaN(d / 1000) ? 0 : d / 1000;
          }),
        };
      },
    },
    LATENCY: {
      title: "Latency",
      tag: MiniArea,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: pro_svc.getL7Latency(true),
      provide: "prometheus",
      className: "card nopd",
      data: spread((res50, res90, res99) => {
				let fixVal = _v => isNaN(_v) ? 0 : (_v * 1).toFixed(2);
				let dv50 = pro_svc.mapData([], res50, fixVal);
				let dv90 = pro_svc.mapData([], res90, fixVal);
				let dv99 = pro_svc.mapData([], res99, fixVal);
        if (dv50) {
					dv50.forEach((item) => {
						item.type = "P50";
					});
        }
        if (dv90) {
					dv90.forEach((item) => {
						item.type = "P90";
					});
        }
        if (dv99) {
					dv99.forEach((item) => {
						item.type = "P99";
					});
        }
        return {
          id: "LATENCY",
          colors: ["#abddf9", "#8BAED4", "#D48BCD", "#fb9690"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "ms",
          showy: false,
          dv: dv50.concat(dv90).concat(dv99),
        };
      }),
    },
    USER_AGENT: {
      title: "User Agent",
      tag: MiniSector,
      col: 6,
      provide: "clickhouse",
      service: common_svc.getTopUA,
      className: "card nopd",
      data: (res) => {
        let dv = [];
        let res_ary = clickhouse_svc.coverArray(res);
        res_ary.forEach((item) => {
          dv.push({ name: item[0], value: isNaN(item[1]) ? 0 : item[1] });
        });
        return {
          height: 240,
          id: "USER_AGENT",
          colors: [
            "#abddf9",
            "#8bd4a1",
            "#8BAED4",
            "#fac858",
            "#D48BCD",
            "#fb9690",
          ],
          dv: dv,
        };
      },
    },
    QPS: {
      title: "QPS",
      tag: MiniArea,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: pro_svc.getL7QPS(true),
      provide: "prometheus",
      className: "card nopd",
      data: (res) => {
				let fixVal = _v => isNaN(_v) ? 0 : (_v * 1).toFixed(2);
				let dv = pro_svc.mapData([], res, fixVal);
        return {
          id: "QPS",
          colors: [
            "#abddf9",
            "#8bd4a1",
            "#8BAED4",
            "#fac858",
            "#D48BCD",
            "#fb9690",
          ],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "Req/s",
          showy: false,
          dv,
        };
      },
    },
    ERROR_RATE: {
      title: "errorrate",
      tag: MiniArea,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: pro_svc.getL7ER(true),
      provide: "prometheus",
      className: "card nopd",
      data: (res) => {
				let fixVal = _v => isNaN(_v) ? 0 : (_v * 1).toFixed(2);
				let dv = pro_svc.mapData([], res, fixVal);
        return {
          id: "ERROR_RATE",
          colors: ["#8bd4a1", "#fac858", "#fb9690", "#D48BCD"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "%",
          showy: false,
          dv,
        };
      },
    },
    RANKING: {
      title: "ranking",
      tag: RankingGroup,
      noTitle: true,
      service: common_svc.getTopN,
      provide: "clickhouse",
      col: 8,
      className: "card nopd",
      cardToolLayout: "absolute",
      data: spread((res1, res2, res3, res4) => {
        let res4_ary = clickhouse_svc.coverArray(res4),
          LatencyData = [];
        res4_ary.forEach((item) => {
          let val = isNaN(item[2]) ? 0 : item[2];
          LatencyData.push({ name: item[1], value: `${val}ms` });
        });
        let res1_ary = clickhouse_svc.coverArray(res1),
          VisitedData = [];
        res1_ary.forEach((item) => {
          VisitedData.push({
            name: item[0],
            value: isNaN(item[1]) ? 0 : item[1],
          });
        });
        let res3_ary = clickhouse_svc.coverArray(res3),
          ClientIPData = [];
        res3_ary.forEach((item) => {
          ClientIPData.push({
            name: item[0],
            value: isNaN(item[1]) ? 0 : item[1],
          });
        });
        let res2_ary = clickhouse_svc.coverArray(res2),
          UAData = [];
        res2_ary.forEach((item) => {
          UAData.push({ name: item[0], value: isNaN(item[1]) ? 0 : item[1] });
        });
        return {
          tops: [
            {
              title: "Request source",
              items: [
                {
                  title: null,
                  list: ClientIPData,
                },
              ],
            },
            {
              title: "Latency",
              items: [
                {
                  title: null,
                  list: LatencyData,
                },
              ],
            },
            {
              title: "Request count",
              items: [
                {
                  title: null,
                  list: VisitedData,
                },
              ],
            },
            { title: "UA", items: [{ title: null, list: UAData }] },
          ],
        };
      }),
    },
    ORGANIZATION_TOTAL: {
      title: "Organizations",
      tag: TotalChart,
      col: 6,
      service: common_svc.getOrgTotal,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: PartitionOutlined,
            total: res.pagination.total,
            unit: "unitge",
            body: null,
            foot: [{ type: "Total" }],
          },
        };
      },
    },
    PROJECT_TOTAL: {
      title: "Projects",
      tag: TotalChart,
      col: 6,
      service: common_svc.getProjectTotal,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: FolderTwoTone,
            total: res.pagination.total,
            unit: "unitge",
            body: null,
            foot: [{ type: "Total" }],
          },
        };
      },
    },
    Space: {
      title: "Space",
      repeat: true,
      nopreview: true,
      tag: { icon: "icon-component", name: "Space" },
      col: 6,
    },
  },
};

export default system;
