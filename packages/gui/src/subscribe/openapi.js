import MiniArea from "@/components/chart/MiniArea";
import RingStatus from "@/components/chart/RingStatus";
import TotalChart from "@/components/chart/TotalChart";
import openapi_svc from "@/services/openapi.js";

const openapi = {
  dashboard: {
    API_TOTAL: {
      title: "API",
      tag: TotalChart,
      col: 6,
      service: openapi_svc.getApiSummary,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/api.png"),
            total: res.apis.total,
            unit: "unitge",
            body: [
              { label: "Running", value: res.apis.run, unit: "unitge" },
              { label: "Error", value: res.apis.error, unit: "unitge" },
            ],
            foot: [{ type: "Running" }],
          },
        };
      },
    },
    APP_TOTAL: {
      title: "Application",
      tag: TotalChart,
      col: 6,
      service: openapi_svc.getApplicationSummary,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/app.png"),
            total: res.applications.total,
            unit: "unitge",
            body: [
              { label: "Pending", value: res.applications.run, unit: "unitge" },
              { label: "Error", value: res.applications.error, unit: "unitge" },
            ],
            foot: [{ type: "Running" }],
          },
        };
      },
    },
    API_STATUS: {
      title: "API - Status",
      tag: RingStatus,
      col: 6,
      service: openapi_svc.getApiStatus,
      className: "card nopd",
      data: (res) => {
        return {
          id: "API-Status",
          colors: ["#00adef", "#fb9690"],
          labels: ["Running", "Error"],
          total: res.api_status.run * 1 + res.api_status.error * 1,
          unit: "unitge",
          vals: [res.api_status.run * 1, res.api_status.error * 1],
        };
      },
    },
    API_METRIC_WEEK: {
      title: "API Metric - Last Week",
      tag: MiniArea,
      col: 6,
      service: openapi_svc.getApiChartWeek,
      className: "card nopd",
      data: (res) => {
        return {
          id: "API-METRIC-WEEK",
          colors: ["#8bd4a1", "#fb9690"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "unitci",
          showy: false,
          dv: res.api_week,
        };
      },
    },
    API_METRIC_MONTH: {
      title: "API Metric - Last Month",
      tag: MiniArea,
      col: 6,
      service: openapi_svc.getApiChartMonth,
      className: "card nopd",
      data: (res) => {
        return {
          id: "API-METRIC-MONTH",
          colors: ["#8bd4a1", "#fb9690"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "unitci",
          showy: false,
          dv: res.api_month,
        };
      },
    },
  },
};

export default openapi;
