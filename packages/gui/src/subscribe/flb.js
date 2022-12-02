import MiniArea from "@/components/chart/MiniArea";
import RankingGroup from "@/components/chart/RankingGroup";
import TotalChart from "@/components/chart/TotalChart";

//flb
import BarChart from "@/components/chart/BarChart";
import BarGroupChart from "@/components/chart/BarGroupChart";
import Sankey from "@/components/chart/Sankey";

import clickhouse_svc from "@/services/clickhouse";
import flb_svc from "@/services/flb.js";

import { format } from "date-fns";
import { spread } from "@/utils/request";

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
              {
                label: "7LB",
                value: alldata.layer7_loadbalancer_amount,
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
                  title: "4 LB conections top",
                  list: alldata.layer4_loadbalancer_connections_top,
                },
                {
                  title: "7 LB conections top",
                  list: alldata.layer7_loadbalancer_connections_top,
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
  },
};

export default flb;
