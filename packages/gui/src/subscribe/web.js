import TotalChart from "@/components/chart/TotalChart";
import web_svc from "@/services/web.js";
import {
  IeOutlined,
} from "@ant-design/icons-vue";
const web = {
  dashboard: {
    TOTAL: {
      title: "LB Total",
      tag: TotalChart,
      service: web_svc.getWebsiteTotal,
      col: 6,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
						icon: IeOutlined,
            total: res.pagination.total,
						unit: "unitge",
          },
        };
      },
    },
  },
};

export default web;
